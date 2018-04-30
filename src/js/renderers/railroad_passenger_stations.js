(() => {
  let _url = GEOSERVER + "/ny/ows"

  let _layer = "ny:rail_passenger_stations";

  RendererTemplates.geojson_points('railroad_passenger_stations',  {
    parameters: {
      opacity: false,
      no_sorting: true
    },

    url: CDN(
          URI(_url).query({
            service: "WFS",
            version: "1.0.0",
            request: "GetFeature",
            typeName: _layer,
            maxFeatures: 500,
            outputFormat: "application/json"
      }).toString()),

    clustering: {
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 40,
      disableClusteringAtZoom: 10,
      iconCreateFunction: function (cluster, pane) {
        return new L.DivIcon({
          pane: pane,
          html: cluster.getChildCount(),
          className: 'railPassengerStationCluster',
          iconSize: new L.Point(35,35)
        });
      }
    },

    pointToLayer: function (active_layer, feature, latlng, pane) {
        return L.marker(latlng, {
            pane: pane,
            icon: L.icon({
                iconAnchor: [12, 28],
                iconSize: [21, 24],
                iconUrl: './img/icons/rail_passenger_station.png',
                opacity: 0,
                popupAnchor: [0, -25]
            }),
            title: feature.properties.name
        });
    },
    popupContents: function (feature) {
        return `
          <strong>${feature.properties.name} Station</strong>
          <br/>
          Use:${feature.properties.use}
          <br/>
          Operator:${feature.properties.operator}
          <br/>
          Line:${feature.properties.line_name}
          <br/>
          ${Renderers.utils.zoom_to_location_link(feature.geometry)}
      `;
    },
    legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <img src="./img/icons/rail_passenger_station.png"/> Railroad Junctions
      </div>
      <div class='detail-block legend-url-text'>
        <span class='legend-text'>
          Click map icons for more info
        </span>
      </div>
    `
  });
})();

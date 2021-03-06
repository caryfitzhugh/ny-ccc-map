(() => {
  let _url = GEOSERVER + "/ny/ows"

  let _layer = "ny:freight_stations";

  RendererTemplates.geojson_points('freight_stations',  {
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
          className: 'freightStationCluster',
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
                iconUrl: './img/icons/freight_station.png',
                opacity: 0,
                popupAnchor: [0, -25]
            }),
            title: feature.properties.name
        });
    },
    popupContents: function (feature) {
        return `
          <strong>${feature.properties.city} Freight Station</strong>
          <br/>
          Railroad: ${feature.properties.railroad}
          <br/>
          ${Renderers.utils.zoom_to_location_link(feature.geometry)}
      `;
    },

    legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <img src="./img/icons/freight_station.png"/> Railroad Freight Stations
      </div>
      <div class='detail-block legend-url-text'>
        <span class='legend-text'>
          Click map icons for more info
        </span>
      </div>
    `
  });
})();

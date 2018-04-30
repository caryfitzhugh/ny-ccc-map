(() => {
  let _url = GEOSERVER + "/ny/ows"

  let _layer = "ny:rail_junctions";

  RendererTemplates.geojson_points('railroad_junctions',  {
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
          className: 'railroadJunctionCluster',
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
                iconUrl: './img/icons/railroad_junction.png',
                opacity: 0,
                popupAnchor: [0, -25]
            }),
            title: feature.properties.name
        });
    },
    popupContents: function (feature) {
        return `
          <strong>${feature.properties.name}</strong>
          <br/>
          ${Renderers.utils.zoom_to_location_link(feature.geometry)}
      `;
    },

    legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <img src="./img/icons/railroad_junction.png"/> Railroad Junctions
      </div>
      <div class='detail-block legend-url-text'>
        <span class='legend-text'>
          Click map icons for more info
        </span>
      </div>
    `
  });
})();

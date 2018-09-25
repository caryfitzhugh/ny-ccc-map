(() => {
  let _url = GEOSERVER + "/ny/ows"

  let _layer = "ny:thruway_bridges";

  RendererTemplates.geojson_points('thruway_bridges',  {
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
      disableClusteringAtZoom: 16,
      iconCreateFunction: function (cluster, pane) {
        return new L.DivIcon({
          pane: pane,
          html: cluster.getChildCount(),
          className: 'thruway_bridgeCluster',
          iconSize: new L.Point(50,50)
        });
      }
    },

    pointToLayer: function (active_layer, feature, latlng, pane) {
        return L.marker(latlng, {
            pane: pane,
            icon: L.icon({
                iconAnchor: [15, 15],
                iconSize: [30, 30],
                iconUrl: './img/icons/thruway_bridge.png',
                opacity: 0,
                popupAnchor: [0, -15]
            }),
            title: feature.properties.name
        });
    },
    popupContents: function (feature) {
        return `
          <strong>Thruway Bridge: ${feature.properties.bridge_loc}</strong>
          <br/>
          Owner: ${feature.properties.primary_ow}
          <br/>
          Feature Carried: ${feature.properties.feature_ca}
          <br/>
          Feature Crossed: ${feature.properties.feature_cr}
          <br/>
          ${Renderers.utils.zoom_to_location_link(feature.geometry)}
      `;
    },

    legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <img src="./img/icons/thruway_bridge.png" width="50px;"/> Thruway Bridge
      </div>
      <div class='detail-block legend-url-text'>
        <span class='legend-text'>
          Click map icons for more info
        </span>
      </div>
    `
  });
})();

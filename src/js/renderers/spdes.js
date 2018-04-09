(() => {
  let _url = CDN(GEOSERVER + "/ny/ows")

  let _layer = "ny:spdes";

  RendererTemplates.geojson_points('spdes',  {
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
            maxFeatures: 10000,
            outputFormat: "application/json",
      }).toString()),

  selectData: (active_layer, features) => {
      active_layer.parameters.total_shown = features.length;
      return features;
  },
  clustering: {
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 11,
      removeOutsideVisibleBounds: true,
      iconCreateFunction: function (cluster, pane) {
        return new L.DivIcon({
          pane: pane,
          html: cluster.getChildCount(),
          className: 'spdesCluster',
          iconSize: new L.Point(35,35)
        });
      }
    },

    pointToLayer: function (active_layer, feature, latlng, pane) {
        return L.marker(latlng, {
            pane: pane,
            icon: L.icon({
                iconUrl: './img/icons/spdes.png',
                iconSize: [16, 18],
                iconAnchor: [12, 28],
                opacity: 0,
                popupAnchor: [0, -25]
            }),
            title: feature.properties.name
        });
    },

    popupContents: function (feature) {
        content =  `
          <strong>${feature.properties.name}</strong>
          <br/>
          Owner: ${feature.properties.owner}
          <br/>
          Discharge (per second): ${feature.properties.dischargec}
          <br/>
          SPDES id: ${feature.properties.spdesnum}
          <br/>
          ${Renderers.utils.zoom_to_location_link(feature.geometry)}
      `;
      return content;
    },

    legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
      </div>
      <div class='detail-block clusterlegend'>
        <img src="./img/icons/spdes.png"/>
        <br/>
        <span class='legend-text'>
          <strong>&nbsp;{{parameters.total_shown}}</strong>&nbsp;&nbsp;&nbsp; Number of water treatment facilities shown
        </span>
      </div>
    `
  });
})();

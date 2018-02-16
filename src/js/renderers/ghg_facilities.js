(() => {
  let _url = CDN(GEOSERVER + "/ny/ows")

  let _layer = "ny:ghg_facilities";

  RendererTemplates.geojson_points('ghg_facilities',  {
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
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 11,
      iconCreateFunction: function (cluster) {
        return new L.DivIcon({
          html: cluster.getChildCount(),
          className: 'ghg_facilitiesCluster',
          iconSize: new L.Point(35,35)
        });
      }
    },

    pointToLayer: function (active_layer, feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: './img/icons/ghg_facilities.png',
                iconSize: [18, 21],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25],
                opacity: 0
            }),
            title: feature.properties.name
        });
    },
    popupContents: function (feature) {
        return `
          <strong>${feature.properties.name}</strong>
          <br>
          <strong>Parent Company:</strong>
          ${feature.properties.parent_company}
          <br>
          ${feature.properties.ghg_quantity} metric tons
          <br>
          ${Renderers.utils.zoom_to_location_link(feature.geometry)}
        `;
    },

    legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <img src="./img/icons/ghg_facilities.png"/>
      </div>
      <div class='detail-block legend-url-text'>
        <span class='legend-text'>
          Click map icons for more info
        </span>
      </div>
    `
  });
})();

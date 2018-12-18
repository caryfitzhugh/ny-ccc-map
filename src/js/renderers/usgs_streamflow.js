RendererTemplates.geojson_points('usgs_streamflow',  {
  parameters: {
    opacity: false,
    no_sorting: true
  },

  url: CDN(
      URI("https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows").query({
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    typeName: "ny:usgs_streamflow_geoserver",
    //maxFeatures: 2000,
    outputFormat: "application/json"
  }).toString()),
/*
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
          className: 'usgs_streamflowCluster',
          iconSize: new L.Point(35,35)
        });
      }
    },*/

  pointToLayer: function (active_layer, feature, latlng, pane) {
      var color = "#FF0000";
              if (feature.properties.class === "1") {
                color = "#FF0000";
              } 
              else if (feature.properties.class === "2") {
                color = "#B12121";
              } 
              else if (feature.properties.class === "3") {
                color = "#B12121";
              }
              else if (feature.properties.class === "4") {
                color = "#FFA400";
              } 
              else if (feature.properties.class === "5") {
                color = "#00FF00";
              }
              else if (feature.properties.class === "6") {
                color = "#40DFD0";
              } 
              else if (feature.properties.class === "7") {
                color = "#0000FF";
              }
              else if (feature.properties.class === "8") {
                color = "#000";
              }
              else {
                color = "#000000";
              }
        return L.circleMarker(latlng, {
                  pane: pane,
                  riseOnHover: true,
                    radius: 4,
              fillColor: color,
              fillOpacity: 0.8,
              color: "black",
              weight: 1,
              opacity: 1,
                    title: feature.properties.name
                });
  },

  popupContents: function (feature) {
   return `
      <strong>${feature.properties.name}</strong>
      <br>
      Date: ${feature.properties.date}
      <br>
      Time: ${feature.properties.time}
      <br>
      Flow: ${feature.properties.flow} ${feature.properties.flow_unit}
      <br>
      Flow Class: ${feature.properties.class}
      <br>
      Percentile: ${feature.properties.percentile}
      <br>
       <a href='${feature.properties.url}' target='_blank_'>More info</a><br>`+
      Renderers.utils.zoom_to_location_link(feature.geometry);

  },

  legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <div>
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="#FF0000" />
          </svg>  New minimum <br>
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="#B12121" />
          </svg> gt old minimum and lt 5th percentile
          <br>
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="#B12121" />
          </svg> 5th - 10th percentile <br>
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="#FFA400" />
          </svg> 10th - 25th percentile <br>
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="#00FF00" />
          </svg> 25th - 75th percentile <br>
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="#40DFD0" />
          </svg> 75th - 90th percentile <br>
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="#0000FF" />
          </svg> gt 90th percentile and lt old maximum <br>
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="#000" />
          </svg> New Maximum <br>
        </div>
      </div>
  `

});

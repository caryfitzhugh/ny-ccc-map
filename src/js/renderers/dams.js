RendererTemplates.geojson_points('dams',  {
  parameters: {
    opacity: false,
    no_sorting: true
  },

  url: CDN(
      URI("https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows").query({
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    typeName: "ny:dams",
    //maxFeatures: 2000,
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
          className: 'damsCluster',
          iconSize: new L.Point(35,35)
        });
      }
    },

  pointToLayer: function (active_layer, feature, latlng, pane) {
      var url = "./img/icons/dam-";
              if (feature.properties.hazard_code === "A" ||
                  feature.properties.hazard_code === "a") {
                url += "a.png";
              } else if (feature.properties.hazard_code === "B" ||
                  feature.properties.hazard_code === "b") {
                url += "b.png";
              } else if (feature.properties.hazard_code === "C" ||
                  feature.properties.hazard_code === "c") {
                url += "c.png";
              } else {
                url += "unk.png";
              }
      return L.marker(latlng, {
                  pane: pane,
                  riseOnHover: true,
                    icon: L.icon({
                        className: "dam-" + feature.properties.hazard_code.toLowerCase() ,
                        iconUrl: url,
                        iconSize: [21, 24],
                        iconAnchor: [12, 28],
                        opacity: 0,
                        popupAnchor: [0, -25]
                    }),
                    title: feature.properties.name
                });
  },

  popupContents: function (feature) {
    link_url = "<a href='http://www.dec.ny.gov/airmon/stationStatus.php?stationNo="+ feature.properties.dec_uid + "' target='_blank_'>More info</a><br><a href='http://www.dec.ny.gov/airmon/stationStatus.php?stationNo="+ feature.properties.dec_uid + "' target='_blank_'><img src='http://www.dec.ny.gov/airmon/stationUSAQIGraph.php?stationno="+ feature.properties.dec_uid + "' width='100%'></a><br>"

    return `
      <strong>${feature.properties.name}</strong>
      <br>
      ${feature.properties.hazard}
      <br>
      State ID: ${feature.properties.state_id}
      <br>
      Federal ID: ${feature.properties.federal_id}
      <br>`+
      Renderers.utils.zoom_to_location_link(feature.geometry);
  },

  legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <div><img src={{'./img/icons/dam-a.png'}}> Low Hazard<br>
          <img src={{'./img/icons/dam-b.png'}}> Intermediate Hazard<br>
          <img src={{'./img/icons/dam-c.png'}}> High Hazard<br>
          <img src={{'./img/icons/dam-unk.png'}}> Unknown Hazard<br>
        </div>
      </div>
  `

});

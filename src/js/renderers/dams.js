RendererTemplates.geojson_points('dams',  {
  parameters: {
    opacity: false,
    no_sorting: true
  },

  url: CDN(
      URI("http://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows").query({
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    typeName: "ny:dams",
    maxFeatures: 1000,
    outputFormat: "application/json"
  }).toString()),

  pointToLayer: function (active_layer, feature, latlng) {
      return L.marker(latlng, {
          icon: L.icon({
              iconUrl: './img/icons/airmon.png',
              iconSize: [18, 21],
              iconAnchor: [12, 28],
              popupAnchor: [0, -25],
              opacity: 0
          }),
          title: feature.properties.name
      });
  },

  popupContents: function (feature) {
    link_url = "<a href='http://www.dec.ny.gov/airmon/stationStatus.php?stationNo="+ feature.properties.dec_uid + "' target='_blank_'>More info</a><br><a href='http://www.dec.ny.gov/airmon/stationStatus.php?stationNo="+ feature.properties.dec_uid + "' target='_blank_'><img src='http://www.dec.ny.gov/airmon/stationUSAQIGraph.php?stationno="+ feature.properties.dec_uid + "' width='100%'></a><br>"

    return `
      <strong>${feature.properties.stat_name}</strong>
      <br>
      Location: ${feature.properties.location}
      <br>` +
      Renderers.utils.zoom_to_location_link(feature.geometry);
  },

  legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <img src={{'./img/icons/airmon.png'}}>
      </div>
  `

});

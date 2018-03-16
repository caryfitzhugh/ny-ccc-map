(function () {
  let _legend = [];

  RendererTemplates.esri_rest('power_stations', {
    parameters: {
      opacity: false
    },
    url: CDN("https://ags-doe.secgeo.com/arcgis/rest/services/StateEnergyProfilesMap/MapServer"),
    esri_opts: {
      layers: '6',
      transparent: true
    }
  });
})()

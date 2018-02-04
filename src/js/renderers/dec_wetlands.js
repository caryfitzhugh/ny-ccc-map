RendererTemplates.esri("dec_wetlands", {
  parameters: {
    opacity: 85,
    options: {

    }
  },
  legend_template: `
    <div class='detail-block legend'>
      <label> Legend </label>
      <img src="img/legends/dec_wetlands.png"/>
    </div>
  `,
  esri_opts: function (active_layer) {
    return {
            url: CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_toolkit/MapServer"),
            // No longer defaults to image, but JSON
            layers: [136],
            f:"image",
            clickable: false,
            attribution: 'NYS DEC'}
  }
});

RendererTemplates.esri("flood_exposure", {
  parameters: {
    opacity: 85,
    options: {

    }
  },
  legend_template: `
    <div class='detail-block legend'>
      <label> Legend </label>
      <img src="https://coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CoastalFloodHazardComposite/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"/>
    </div>
  `,
  esri_opts: function (active_layer) {
    return {
            url: CDN("https://coast.noaa.gov/arcgis/rest/services/FloodExposureMapper/CFEM_CoastalFloodHazardComposite/MapServer"),
            // No longer defaults to image, but JSON
            layers: [1],
            f:"image",
            clickable: false,
            attribution: 'NOAA'}
  }
});

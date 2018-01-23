RendererTemplates.wms("croplands", {
  parameters: {
    opacity: 70,
  },
  url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
  wms_opts: (active_layer) => {
    return {
        layers: 'aglands:aglands-croplands-2000',
        format: 'image/png',
        opacity: 0,
        zIndex: -1,
        transparent: true };
  },

  legend_template: `
      <div class='detail-block show-confidence'>
        <img src={{CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=aglands:aglands-croplands-2000&format=image/png")}}/>
      </div>
      <div class='detail-block legend-url-text'>
        <span class='legend-text'>% of cell area in crops</span>
      </div>
  `,
});

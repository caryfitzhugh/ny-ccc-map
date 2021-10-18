RendererTemplates.wms("lulc_2011", {
  parameters: {
    opacity: 90,
    min_zoom: 11,
    max_zoom: 19
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:lulc2011',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  legend_template: `
      <div class='detail-block show-confidence'>
      Land Classification<br/><img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:lulc2011&format=image/png")}}/>
      </div>
  `
});

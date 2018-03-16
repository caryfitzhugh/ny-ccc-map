(function () {
  RendererTemplates.wms('pastures', {
    parameters: {
      opacity: 70
    },
    url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
    wms_opts: {
      layers: 'aglands:aglands-pastures-2000',
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      crs: L.CRS.EPSG4326,
      srs: L.CRS.EPSG4326,
      transparent: true
    },
    'legend_template': `
      <div class='detail-block show-confidence'>
        <img src={{CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=aglands:aglands-pastures-2000&format=image/png")}}/>
      </div>
      <div class='detail-block legend-url-text {{layer_default_id}} {{legend_classname}}'>
        <span class='legend-text'> % cell area in pasture</span>
      </div>
    `
  });
})()

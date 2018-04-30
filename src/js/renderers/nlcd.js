(function() {
  let _url = CDN(GEOSERVER + "/wms");

  RendererTemplates.wms('nlcd', {
    parameters: {
      opacity: 90,
      layers: "ny:nlcd_2011_ny"
    },
    url: _url,
    wms_opts: (active_layer) => {
        return  {
          layers: active_layer.parameters.layers,
          format: "image/png",
          opacity: 0,
          zIndex: -1,
          transparent: true,
          crs: L.CRS.EPSG4326,
          srs: L.CRS.EPSG4326
        };
    },
    legend_template: `
      <div class='detail-block show-confidence'>
        <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:nlcd_2011_ny&format=image/png")}}/>
      </div>
    `
  });
})();

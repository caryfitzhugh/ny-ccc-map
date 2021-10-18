RendererTemplates.wms("lulc_2050", {
  parameters: {
    opacity: 90,
    min_zoom: 11,
    max_zoom: 19
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:lulc2050',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER+
          "/wms"+
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          "LAYERS=ny:lulc2050&"+
          "QUERY_LAYERS=ny:lulc2050&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>");
  },
  legend_template: `
      <div class='detail-block show-confidence'>
        Land Classification<br/><img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:lulc2050&format=image/png")}}/>
      </div>
  `,
  info_template: `
  `
});

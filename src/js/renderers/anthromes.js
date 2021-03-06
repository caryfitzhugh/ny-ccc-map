RendererTemplates.wms('anthromes', {
  parameters: {
    opacity: 70,
    year_indx: 2,
    options: {
      years: ['1800','1900','2000']
    }
  },
  wms_opts: (active_layer) => {
    var year = active_layer.parameters.options.years[active_layer.parameters.year_indx];
    return {
      layers: 'anthromes:anthromes-anthropogenic-biomes-world-v2-'+ year,
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true
            }
  },
  url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
  legend_template: `
    <div class='detail-block opacity'>
      <label> Model Year: </label>
      <input type='range' list='anthromes-year-tickmarks' value='{{parameters.year_indx}}' min='0' max='{{parameters.options.years.length - 1}}'>
      {{parameters.options.years[parameters.year_indx]}}
    </div>

    <div class='detail-block'>
      <label> Legend: </label>
      <img src='{{CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=anthromes:anthromes-anthropogenic-biomes-world-v2-1700&format=image/png")}}'>
    </div>
  `,
  info_template: `
    <div class='col-xs-2'>
      <label> {{name}} </label>
    </div>
    <div class='col-xs-10'>
      {{#json.features}}
        <div>
          Value: {{properties.GRAY_INDEX}}
        </div>
      {{/json.features}}
    </div>
  `,
  get_feature_info_url: function (active_layer) {
    var year = active_layer.parameters.options.years[active_layer.parameters.year_indx];

    return CDN("http://sedac.ciesin.columbia.edu/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=anthromes:anthromes-anthropogenic-biomes-world-v2-"+year+"&"+
          "QUERY_LAYERS=anthromes:anthromes-anthropogenic-biomes-world-v2-"+year+"&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  }
});

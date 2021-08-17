RendererTemplates.wms('superfund', {
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
      layers: 'superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2',
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true
            }
  },
  url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
  legend_template: `
    <div class='detail-block'>
      <label> Legend: </label>
      <img src='{{CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2&format=image/png")}}'>
    </div>
  `,
  info_template: `
    <div class='col-xs-2'>
      <label> {{u.layer_defaults(active_layer.layer_default_id).name}} </label>
    </div>
    <div class='col-xs-10'>
      {{#json.features}}
        <div>
          {{properties.site_name}}<br/> <a target="_blank" href="{{properties.SITE_PROFI}}"> Additional EPA Site Information </a>
        </div>
      {{/json.features}}
    </div>
  `,
  get_feature_info_url: function (active_layer) {
    var year = active_layer.parameters.options.years[active_layer.parameters.year_indx];

    return CDN("http://sedac.ciesin.columbia.edu/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2&"+
          "QUERY_LAYERS=superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2&"+
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

RendererTemplates.wms("boundary_climate_divisions", {
  parameters: {
    opacity: 100,
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:clim_div',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      crs: L.CRS.EPSG4326,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/wms" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=ny:clim_div&"+
              "QUERY_LAYERS=ny:clim_div&"+
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
        <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:clim_div&format=image/png")}}>
      </div>
  `,
  info_template: `
    <div class='col-xs-2'>
      <label> {{u.layer_defaults(active_layer.layer_default_id).name}} </label>
    </div>
    <div class='col-xs-10'>
      <table class="table">
        <tr>
          <th>Name</th>
          <th>Sample Queries</th>
        </tr>
        {{#json.features}}
          <tr>
            <td>{{properties.name}}</td>
            <td>
              <a href="http://www.ncdc.noaa.gov/cag/time-series/us/{{properties.clim_div_id_state}}/{{properties.clim_div_id}}/pcp/ytd/12/1895-2015?base_prd=true&firstbaseyear=1895&lastbaseyear=2015&trend=true&trend_base=10&firsttrendyear=1905&lasttrendyear=2015&filter=true&filterType=binomial" target="_blank">Annual PPT 1895-2015</a><br>
              <a href="http://www.ncdc.noaa.gov/cag/time-series/us/{{properties.clim_div_id_state}}/{{properties.clim_div_id}}/tmax/1/9/1950-2015?base_prd=true&firstbaseyear=1950&lastbaseyear=2015&trend=true&trend_base=10&firsttrendyear=1950&lasttrendyear=2015&filter=true&filterType=binomial" target="_blank">Sept Max Temp 1895-2015</a>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        {{/json.features}}
      </table>
    </div>
  `
});

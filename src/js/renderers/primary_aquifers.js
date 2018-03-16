(function () {
  RendererTemplates.wms('primary_aquifers', {
    parameters: {
      opacity: 70
    },
    url: CDN(GEOSERVER + "/wms"),
    wms_opts: {
      layers: 'ny:primary_aquifers',
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      crs: L.CRS.EPSG4326,
      srs: L.CRS.EPSG4326,
      transparent: true
    },
    'legend_template': `
      <div class='detail-block show-confidence'>
        <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:primary_aquifers&format=image/png")}}/>
      </div>
      <div class='detail-block legend-url-text'>
        <span class='legend-text'> Extimated aquifer boundary </span>
      </div>
    `,
    'info_template': `
        <div class='row'>
          <div class='col-xs-2'>
            <label> {{name}} </label>
          </div>
          <div class='col-xs-10'>
            <table class="table">
              <tr>
                <th>GID</th>
                <th>Source</th>
                <th>Shape Area</th>
                <th>Shape Length</th>
              </tr>
              {{#json.features}}
                <tr>
                  <td>{{properties.gid}}</td>
                  <td>{{properties.source}}</td>
                  <td>{{properties.shape_area}}</td>
                  <td>{{properties.shape_len}}</td>
                </tr>
              {{/json.features}}
            </table>
          </div>
    `,
  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/wms" +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=ny:primary_aquifers&"+
          "QUERY_LAYERS=ny:primary_aquifers&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>");
  }
  });
})()

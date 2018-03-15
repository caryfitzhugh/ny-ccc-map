(function () {
  RendererTemplates.wms('public_environmental_justice_areas', {
    parameters: {
      opacity: 70,
      legend_url: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:peja&format=image/png")
    },
    url: CDN(GEOSERVER + "/wms"),
    wms_opts: {
      layers: 'ny:peja',
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      crs: L.CRS.EPSG4326,
      srs: L.CRS.EPSG4326,
      transparent: true
    },
    'legend_template': `
      <div class='detail-block show-confidence'>
        <img src={{legend_url}}/>
      </div>
    `,
    get_feature_info_url: function (active_layer) {
      return CDN(GEOSERVER + "/wms"+
            "?SERVICE=WMS&VERSION=1.1.1&"+
            "REQUEST=GetFeatureInfo&"+
            "LAYERS=ny:peja&"+
            "QUERY_LAYERS=ny:peja&"+
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
  info_template: `
    <div class='row'>
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class="table">
          <tr>
            <th>County</th>
            <th>GID</th>
            <th>Name</th>
          </tr>
          {{#json.features}}
            <tr>
              <td>{{properties.county}}</td>
              <td>{{properties.gid}}</td>
              <td>{{properties.name}}</td>
            </tr>
          {{/json.features}}
        </table>
      </div>
    </div>
  `
  });
})()

RendererTemplates.wms("remediation_sites", {
  parameters: {
    opacity: 100,
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:remediation_site_borders',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      crs: L.CRS.EPSG4326,
      srs: L.CRS.EPSG4326,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/wms" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=ny:remediation_site_borders&"+
              "QUERY_LAYERS=ny:remediation_site_borders&"+
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
      <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:remediation_site_borders&format=image/png")}}>
    </div>
    <div class='detail-block legend-url-text'>
      <span class='legend-text'> Remediation site boundary (click for info) </span>
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
          <th>Program</th>
          <th>Site Code</th>
          <th>Address</th>
        </tr>
        {{#json.features}}
          <tr>
            <td>{{properties.name}}</td>
            <td>{{properties.program}}</td>
            <td>{{properties.sitecode}}</td>
            <td>{{properties.address}}</td>
          </tr>
        {{/json.features}}
      </table>
    </div>
  `
});

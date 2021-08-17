RendererTemplates.wms("subway_lines", {
  parameters: {
    opacity: 100,
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:subway_lines',
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
              "LAYERS=ny:subway_lines&"+
              "QUERY_LAYERS=ny:subway_lines&"+
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
      <div class='detail-block'>
        <label>Legend</label>
        <br/>
        <img src="{{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:subway_lines&format=image/png")}}"/>
      </div>
  `,
  info_template: `
    <div class='col-xs-2'>
      <label> {{u.layer_defaults(active_layer.layer_default_id).name}} </label>
    </div>
    <div class='col-xs-10'>
      <table class="table">
        <tr>
          <th>Line Name</th>
          <th>Track Name</th>
          <th>Owner</th>
        </tr>
        {{#json.features}}
          <tr>
            <td>{{properties.line_name}}</td>
            <td>{{properties.trk_name}}</td>
            <td>{{properties.owner_name}}</td>
          </tr>
        {{/json.features}}
      </table>
    </div>
  `
});

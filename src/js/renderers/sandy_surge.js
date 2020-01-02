RendererTemplates.wms("sandy_surge", {
  parameters: {
    opacity: 100,
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:sandy_surge',
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
              "LAYERS=ny:sandy_surge&"+
              "QUERY_LAYERS=ny:sandy_surge&"+
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
        <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:sandy_surge&format=image/png")}}>Sandy Surge Extent
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class="table">
          <tr>
            <th>Status</th>
            <th>Source</th>
            <th>Verified</th>
          </tr>
          {{#json.features}}
            <tr>
              <td>{{properties.status}}</td>
              <td>{{properties.sourcedata}}</td>
              <td>{{properties.verified}}</td>
            </tr>
          {{/json.features}}
        </table>
      </div>
  `
});

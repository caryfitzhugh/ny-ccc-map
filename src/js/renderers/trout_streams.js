RendererTemplates.wms("trout_streams", {
  parameters: {
    opacity: 100,
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:trout_streams',
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
              "LAYERS=ny:trout_streams&"+
              "QUERY_LAYERS=ny:trout_streams&"+
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
        <img src="{{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:trout_streams&format=image/png")}}"/> Suitable Trout Waters 
      </div>
  `,
  info_template: `
    <div class='col-xs-2'>
      <label> {{name}} </label>
    </div>
    <div class='col-xs-10'>
      <table class="table">
        <tr>
          <th>ID</th>
          <th>Classification</th>
          <th>Standard</th>
          <th>Protected</th>
        </tr>
        {{#json.features}}
          <tr>
            <td>{{properties.partitem}}</td>
            <td>{{properties.classifica}}</td>
            <td>{{properties.standard}}</td>
            <td>{{properties.protected}}</td>
          </tr>
        {{/json.features}}
      </table>
    </div>
  `
});

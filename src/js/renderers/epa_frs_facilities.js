RendererTemplates.wms("epa_frs_facilities", {
  parameters: {
    opacity: 60,
/*    min_zoom: 0,
    max_zoom: 13,*/
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:epa_frs_facilities',
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
              "LAYERS=ny:epa_frs_facilities&"+
              "QUERY_LAYERS=ny:epa_frs_facilities&"+
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
        <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:epa_frs_facilities&format=image/png")}}>
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
          <th>Address</th>
          <th>Report Link</th>
        </tr>
        {{#json.features}}
          <tr>
            <td>{{properties.primary_name}}</td>
            <td>{{properties.location_address}}, {{properties.city_name}}</td>
            <td><a href="{{properties.frs_facility_detail_report_url}}" target="_blank">View Report</a></td>
          </tr>
        {{/json.features}}
      </table>
    </div>
  `
});

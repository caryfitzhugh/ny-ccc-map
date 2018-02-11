RendererTemplates.wms("gap_lc", {
  parameters: {
    opacity: 70,
    layers: "0"
  },

  url: CDN("http://gis1.usgs.gov/arcgis/services/gap/GAP_Land_Cover_NVC_Formation_Landuse/MapServer/WmsServer"),

  wms_opts:(active_layer) => {
    return  {
      layers: '0',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_xml_url: function (active_layer) {
    return CDN("http://gis1.usgs.gov/arcgis/services/gap/GAP_Land_Cover_NVC_Formation_Landuse/MapServer/WmsServer?") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          // NOT SURE ON LAYERS?
          "LAYERS=" + active_layer.parameters.layers + "&"+
          // NOT SURE ON LAYERS?
          "QUERY_LAYERS=" + active_layer.parameters.layers + "&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=application%2Fjson&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  },

  legend_template: `
      <div class='detail-block show-confidence'>
        <img src={{CDN("http://gis1.usgs.gov/arcgis/services/gap/GAP_Land_Cover_NVC_Formation_Landuse/MapServer/WmsServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=" + parameters.layers + "&FORMAT=image/png")}} />
      </div>
  `,

  info_template: `
    <div class='row'>
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class="table">
          <tr>
            <th> NVC Class </th>
            <th> NVC Sub-Class </th>
            <th> NVC Form </th>
            <th> NVC Div </th>
            <th> Ecosystem LU</th>
          </tr>

          {{#xml_output}}
            <tr>
              <td>{{{nvc_class}}}</td>
              <td>{{{nvc_subcl}}}</td>
              <td>{{{nvc_form}}}</td>
              <td>{{{nvc_div}}}</td>
              <td>{{{ecolsys_lu}}}</td>
            </tr>
          {{/xml_output}}
        </table>
      </div>
    </div>
  `
});

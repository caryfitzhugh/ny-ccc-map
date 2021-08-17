(function () {
  let _layer = "formation";
  let _url = CDN("https://www.sciencebase.gov/geoserver/nvcs/wms");
  let _legend_url = _url + "?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=" + _layer + "&FORMAT=image/png";

  RendererTemplates.wms("gap_lc", {
    parameters: {
      opacity: 70,
      layers: _layer // "formation"
    },

    url: _url,

    wms_opts:(active_layer) => {
      return  {
        layers: active_layer.parameters.layers,
        format: "image/png",
        opacity: 0,
        zIndex: -1,
        transparent: true,
      };
    },
    /*
    get_feature_info_xml_url: function (active_layer) {
      return _url +
            "?SERVICE=WMS&" +
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
    */

    legend_template: `
        <div class='detail-block show-confidence'>
          <img  style='max-width: 110%' src='${_legend_url}' />
        </div>
    `,

    info_template: `
      <div class='row'>
        <div class='col-xs-2'>
          <label> {{u.layer_defaults(active_layer.layer_default_id).name}} </label>
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
})();

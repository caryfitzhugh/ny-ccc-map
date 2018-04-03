RendererTemplates.wms("dow_unconsolidated_aquifers", {
  parameters: {
    opacity: 100,
    layers: "ny:dow_uncon_aqui_main",
    options: {
    }
  },

  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: active_layer.parameters.layers,
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER+
          "/wms"+
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          "LAYERS=" + active_layer.parameters.layers + "&"+
          "QUERY_LAYERS=" + active_layer.parameters.layers + "&"+
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
        <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=" + parameters.layers + "&format=image/png")}}/>
      </div>
      <div class='detail-block legend-url-text'>
        <span class='legend-text'> Click on map to view more detail</span>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class="table">
          <tr>
            <th>Primary Aquifer</th>
            <th>Type</th>
            <th>Yield</th>
            <th>Acres</th>
          </tr>
          {{#json.features}}
            <tr>
              <td>{{properties.primary_aq}}</td>
              <td>{{properties.type}}</td>
              <td>{{properties.yield}}</td>
              <td>{{properties.acres}}</td>
            </tr>
          {{/json.features}}
        </table>
      </div>


  `
});

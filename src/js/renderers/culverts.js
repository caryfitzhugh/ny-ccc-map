(function() {
  let _url = CDN(GEOSERVER + "/wms");

  RendererTemplates.wms('culverts', {
    parameters: {
      opacity: 90,
      layers: "ny:large_culverts"
    },
    url: _url,
    wms_opts: (active_layer) => {
        return  {
          layers: active_layer.parameters.layers,
          format: "image/png",
          opacity: 0,
          zIndex: -1,
          transparent: true,
          crs: L.CRS.EPSG4326,
          srs: L.CRS.EPSG4326
        };
    },

    get_feature_info_url: (active_layer) => {
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
        <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:large_culverts&format=image/png")}}/>
      </div>
    `,
    info_template: `
      <div class='col-xs-2'>
        <label> {{u.layer_defaults(active_layer.layer_default_id).name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class="table">
          <tr>
            <th>ID</th>
            <th>Crosses</th>
            <th>Material</th>
            <th>Inspected</th>
            <th>Condition Index</th>
          </tr>
          {{#json.features}}
            <tr>
              <td>{{properties.culvert_id}}</td>
              <td>{{properties.crosses}}</td>
              <td>{{properties.material}}</td>
              <td>{{properties.last_inspected}}</td>
              <td>{{properties.condition}}</td>
            </tr>
          {{/json.features}}
        </table>
      </div>

    `
  });
})();

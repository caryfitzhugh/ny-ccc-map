(function() {
  let _root_url = CDN("https://rmgsc.cr.usgs.gov/arcgis/rest/services/contUS/MapServer/");
  let _legend_url = CDN("https://rmgsc.cr.usgs.gov/arcgis/rest/services/contUS/MapServer/legend?f=json");
  let _soil_layers = {
    "Ecosystems": 0,
    "Bioclimates": 1,
    "Land Surface Forms": 2,
    "Surficial Lithology": 3,
    "Topographic Position": 4,
  };

  let _cache = null;

  let _get_legend_data = function (active_layer, callback) {
      // callback(error, geojson_data?)
      if (_cache) {
        callback(null, _cache);
      } else {
        $.ajax({
          url: CDN(_root_url + "/legend"),
          data: {f: "pjson"},
          dataType: "jsonp",
          success: function (data) {
            _cache = data;
            callback(null, _cache);
          },
          error:   function (err) {
            if (err.status !== 200) {
              callback(err, []);
              Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
            }
          }
        });
      }
    };

  RendererTemplates.esri("ecological_land_units", {
    parameters: {
      opacity: 70,
      soils_name: 'Ecosystems',
      legend_data: [],
      options: {
        soils_options: _soil_layers,
        eco_desc: Renderers.Constants.soils_eco_desc,
      }
    },

    url:  _root_url,

    esri_opts: (active_layer) => {
      let layer_id = active_layer.parameters.options.soils_options[active_layer.parameters.soils_name];

      return {
         url: CDN(_root_url),
         layers: [layer_id],
         f:"image",
         format: "png8",
         transparent: true,
         dpi: 96,
         clickable: false,
         attribution: 'USGS Land Change Science Program Global Ecosystems'}
    },

    onrender: (active_layer) => {
      _get_legend_data(active_layer, (err, data) => {
        let layer_id = active_layer.parameters.options.soils_options[active_layer.parameters.soils_name];
        let legend = _.find(data.layers, {layerId: layer_id});
        active_layer.parameters.legend_data = legend.legend;
        Views.ControlPanel.fire("update-layers-parameters", active_layer);
      });
    },

    get_feature_info_url: function (active_layer, map) {
      let layer_id = active_layer.parameters.options.soils_options[active_layer.parameters.soils_name];

      return CDN(_root_url + "/identify") +
        "?f=json" +
        "&tolerance=1" +
        "&returnGeometry=true" +
        "&imageDisplay=<%=width%>%2C<%=height%>%2C96" +
        "&maxAllowableOffset=150" +
        "&geometry={\"x\": <%= lng %>,\"y\": <%=lat%>}" +
        "&geometryType=esriGeometryPoint" +
        "&sr=4326" +
        "&mapExtent=<%=xmin%>,<%=ymin%>,<%=xmax%>,<%=ymax%>"+
        "&layers=visible%3A" + layer_id;
    },
    legend_template: `
        <div class='detail-block show-confidence'>
          <label> Layer: </label>
          <select value='{{parameters.soils_name}}'>
          {{#parameters.options.soils_options:name}}
            <option value='{{name}}'> {{name}} </option>
          {{/parameters.options.soils_options:name}}
          </select>
        </div>
        <div class='detail-block sovi'>
          {{#parameters.legend_data}}
            {{#if parameters.options.eco_desc[label]}}
              <div class=''>
                <img src="data:{{contentType}};base64,{{imageData}}" class='cube'/>
                <span>{{parameters.options.eco_desc[label]}}</span>
              </div>
            {{ else }}
              <div class=''>
                <img src="data:{{contentType}};base64,{{imageData}}" class='cube'/>
                <span>{{label}}</span>
              </div>
            {{/if parameters.options.eco_desc[label]}}
          {{/legend_data}}
        </div>
    `,
    info_template: `
    <div class='col-xs-2'>
      <label> {{u.layer_defaults(active_layer.layer_default_id).name}} </label>
    </div>
    <div class='col-xs-10'>
      <table class="table">
        <tr>
          <th>Legend Color</th>
          <th>Name</th>
        </tr>
        {{#json.results}}
          <tr>
            <td>
              {{#active_layer.parameters.legend_data}}
                {{#if attributes['code_desc'] == label}}
                    <img src="data:{{contentType}};base64,{{imageData}}" class='cube'/>
                {{/if attributes['code_desc'] == label}}
              {{/active_layer.parameters.legend_data}}
            </td>
            <td>{{attributes["code_desc"]}}</td>
          </tr>
        {{/json.features}}
      </table>
    </div>
    `
  });
})();

(function () {
  let _legend_data = null;

  let _get_legend_data = function (callback) {
    if (_legend_data) {
      callback(null, _legend_data);
    } else {
      $.ajax({
        url: CDN("https://services2.coastalresilience.org/arcgis/rest/services/Natural_Resource_Navigator/Natural_Resource_Navigator/MapServer/legend"),
        data: {f: "pjson"},
        dataType: "jsonp",
        success: function (data) {
          _legend_data = data;
          callback(null, data);
        },
        error:   function (err) {
          if (err.status !== 200) {
            callback(err, []);
          }
        }
      });
    }
  };

  let _species_groups = {
    "All":  {
      "Future" : 244,
      "Current": 254,
      "Change" : 264
    },
    "Animals": {
      "Future" : 245,
      "Current": 255,
      "Change" : 265
    },
    "Plants": {
      "Future" : 246,
      "Current": 256,
      "Change" : 266
    },
    "Invertebrates": {
      "Future" : 248,
      "Current": 258,
      "Change" : 268
    },
    "Vertebrates": {
      "Future" : 247,
      "Current": 257,
      "Change" : 267
    },
    "Birds": {
      "Future" : 249,
      "Current": 259,
      "Change" : 269
    },
    "Aerial Insects": {
      "Future" : 250,
      "Current": 260,
      "Change" : 270
    },
    "Federally Listed": {
      "Future" : 251,
      "Current": 261,
      "Change" : 271
    },
    "NY State Listed": {
      "Future" : 252,
      "Current": 262,
      "Change" : 272
    }
  };

  let _get_layer_id = (active_layer) => {
      var layer_id = _species_groups[active_layer.parameters.species_group][active_layer.parameters.time];
      return layer_id;
  };

  RendererTemplates.esri('rare_plants_and_animals', {
    esri_opts: function (active_layer) {
      return {
        url: CDN("https://services2.coastalresilience.org/arcgis/rest/services/Natural_Resource_Navigator/Natural_Resource_Navigator/MapServer"),
        layers: [_get_layer_id(active_layer)],
        f:"image",
        format: "png32",
        transparent: true,
        dpi: 96,
        clickable: false,
        attribution: 'NYS DEC'
      };
    },
    on_layer_create: (active_layer) => {
      // Load legend data
      _get_legend_data((err, legend_data) => {
          let layer_id = _get_layer_id(active_layer);
          let legend = _.find(legend_data.layers, {layerId: layer_id});
          var augmented_legend = _.cloneDeep(legend);

          if (augmented_legend) {
            augmented_legend.legend.push({
              contentType: "image/gif",
              imageData: "R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=",
              label: "None"
            });
          }
          active_layer.parameters.legend_data = augmented_legend;
          Views.ControlPanel.fire("tile-layer-loaded", active_layer);
      });
    },
    parameters: {
        opacity: 70,
        time: "Current",  // Future, Current, Change
        species_group: "All",
        options: {
          species_groups: _species_groups,
          species_names: _.keys(_species_groups)
        }
    },
    get_feature_info_url: function (active_layer, map) {
      return CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_species_maptree/MapServer/identify") +
        "?f=json" +
        "&tolerance=5" +
        "&returnGeometry=true" +
        "&imageDisplay=<%=width%>%2C<%=height%>%2C96" +
        "&maxAllowableOffset=150" +
        "&geometry={\"x\": <%= lng %>,\"y\": <%=lat%>}" +
        "&geometryType=esriGeometryPoint" +
        "&sr=4326" +
        "&mapExtent=<%=xmin%>,<%=ymin%>,<%=xmax%>,<%=ymax%>"+
        "&layers=visible%3A" + _get_layer_id(active_layer);
    },
    info_template: `
        <div class='col-xs-2'>
          <label> {{name}} </label>
        </div>
        <div class='col-xs-10'>
          <table class="table">
            <tr>
              <th>Layer Name</th>
              <th>Stretched value</th>
              <th>Pixel Value</th>
              <th>Count</th>
            </tr>
            {{#json.results}}
              <tr>
                <td>{{layerName}}</td>
                <td>{{attributes["Stretched value"]}}</td>
                <td>{{attributes["Pixel Value"]}}</td>
                <td>{{attributes["Count"]}}</td>
              </tr>
            {{/json.features}}
          </table>
        </div>
      `,
    legend_template: `
        <div class='detail-block show-confidence plants-and-animals'>
          <label> Species: </label>
          <select value='{{parameters.species_group}}'>
          {{#parameters.options.species_names}}
            <option value='{{.}}'> {{.}} </option>
          {{/parameters.options.species_names}}
          </select>
        </div>
        <div class='detail-block show-confidence plants-and-animals'>
          <label> Timeframe: </label>
          <select value='{{parameters.time}}'>
            {{#u.to_sorted_keys_from_hash(parameters.options.species_groups[parameters.species_group])}}
              <option value='{{key}}'>{{key}}</option>
            {{/u.to_sorted_keys_from_hash(parameters.options.species_groups[parameters.species_group])}}
          </select>
        </div>
        {{#if parameters.legend_data}}
          <div class='detail-block show-confidence plants-and-animals esri-legend'>
            {{#parameters.legend_data.legend}}
              <div class='detail-block legend-block' style="width: {{98 / parameters.legend_data.legend.length}}%;">
                <img src="data:{{contentType}};base64,{{imageData}}">
                <span> {{label}} &nbsp; </span>
              </div>
            {{/parameters.legend_data.legend}}
          </div>
          <div class='detail-block legend-url-text {{layer_default_id}} {{legend_classname}}'>
            <span class='legend-text'>
              Species richness based on habitat suitability models
            </span>
          </div>
        {{/if parameters.legend_data}}
    `
  });
})();

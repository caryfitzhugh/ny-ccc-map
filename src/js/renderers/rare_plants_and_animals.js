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
      "Future" : 18,
      "Current": 28,
      "Change" : 38
    },
    "Animals": {
      "Future" : 19,
      "Current": 29,
      "Change" : 39
    },
    "Plants": {
      "Future" : 20,
      "Current": 30,
      "Change" : 40
    },
    "Invertebrates": {
      "Future" : 22,
      "Current": 32,
      "Change" : 42
    },
    "Vertebrates": {
      "Future" : 21,
      "Current": 31,
      "Change" : 41
    },
    "Birds": {
      "Future" : 23,
      "Current": 33,
      "Change" : 43
    },
    "Aerial Insects": {
      "Future" : 24,
      "Current": 34,
      "Change" : 44
    },
    "Federally Listed": {
      "Future" : 25,
      "Current": 35,
      "Change" : 45
    },
    "NY State Listed": {
      "Future" : 26,
      "Current": 36,
      "Change" : 46
    }
  };

  let _get_layer_id = (active_layer) => {
      var layer_id = _species_groups[active_layer.parameters.species_group][active_layer.parameters.time];
      return layer_id;
  };

  RendererTemplates.esri('rare_plants_and_animals', {
    esri_opts: function (active_layer) {
      return {
        url: CDN("https://services2.coastalresilience.org/arcgis/rest/services/Natural_Resource_Navigator/Natural_Resource_Navigator_Species/MapServer"),
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
      return CDN("https://services2.coastalresilience.org/arcgis/rest/services/Natural_Resource_Navigator/Natural_Resource_Navigator_Species/MapServer/identify") +
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
              <div class='detail-block legend-block' >
                <img src="img/legends/rare_species.jpg">
                <span> {{label}} &nbsp; </span>
              </div>
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

(function () {
  let _root_url = "http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_toolkit/MapServer";

  let _event_types = {
      "100 Year Event":  {
        "Future Recurrence" : 153,
        "Future Avg Percent Increase": 154,
        "Current Magnitude" : 155
      },
      "10 Year Event":  {
        "Future Recurrence" : 156,
        "Future Avg Percent Increase": 157,
        "Current Magnitude" : 158
      }
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
              _.each(_event_legend_transforms, function (func, id) {
                var indx = _.findIndex(data.layers, {layerId: parseInt(id)});
                data.layers[indx].legend = func(data.layers[indx].legend);
              });

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

  _.keys(_event_types).sort();
  var _event_timeframes = { };
    _.each(_.keys(_event_types), function (type) {
      var types = _.keys(_event_types[type]).sort();
      _event_timeframes[type] = types;
    });

  let _event_legend_transforms = {
    156: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+(\.\d+)?/);
        if (v) { leg.label = "" + v[0];}
      });
      return legend; },
    153: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+/);
        if (v) { leg.label = "" + v[0];}
      });
      return legend; },
    154: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+(\.\d+)?/);
        if (v) { leg.label = "" + v[0] + "%"; }
      });
      return legend; },
    157: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+/);
        if (v) { leg.label = "" + v[0] + "%"; }
      });
      return legend; },
    155: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+/);
        if (v) {
          var val = (parseInt(v) / 1000.0).toFixed(2).toString();

          leg.label = "" + val + "\"";
        }
      });
      return legend; },
    158: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+/);
        if (v) {
          var val = (parseInt(v) / 1000.0).toFixed(2).toString();

          leg.label = "" + val + "\"";
        }
      });
      return legend; },
  };

  RendererTemplates.esri("extreme_precipitation", {
    parameters: {
      opacity: 70,

      // Future, Current, Change
      event_type: "10 Year Event",
      time: "Current Magnitude",
      options: {
        event_types: _.keys(_event_types),
        event_timeframes: _event_timeframes,
      }
    },
    get_feature_info_url: function (active_layer, map) {
      var layer_id = _event_types[active_layer.parameters.event_type][active_layer.parameters.time];
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
    onrender: (active_layer) => {
      _get_legend_data(active_layer, (err, data) => {
        let layer_id = _event_types[active_layer.parameters.event_type][active_layer.parameters.time];
        let legend = _.find(data.layers, {layerId: layer_id});
        active_layer.parameters.legend_data = legend;
        Views.ControlPanel.fire("update-layers-parameters", active_layer);
      });
    },
    esri_opts: (active_layer) => {
      var layer_id = _event_types[active_layer.parameters.event_type][active_layer.parameters.time];

      return {
         url: CDN(_root_url),
         layers: [layer_id],
         f:"image",
         format: "png8",
         transparent: true,
         dpi: 96,
         clickable: false,
         attribution: 'NYS DEC'}
  },
  legend_template: `
      <div class='detail-block show-confidence'>
        <label> Event Type: </label>
        <select value='{{parameters.event_type}}'>
        {{#parameters.options.event_types}}
          <option value='{{.}}'> {{.}} </option>
        {{/parameters.options.event_types}}
        </select>
      </div>

      <div class='detail-block show-confidence'>
        <label> Timeframe: </label>
        <select value='{{parameters.time}}'>
        {{#parameters.options.event_timeframes[parameters.event_type]}}
          <option value='{{.}}'> {{.}} </option>
        {{/parameters.options.event_timeframes[parameters.event_type]}}
        </select>
      </div>
      {{#if parameters.legend_data}}
        <div class='detail-block show-confidence extreme-precip'>
          <label> Legend: </label>
        </div>
        <div class='detail-block show-confidence extreme-precip esri-legend'>

          {{#parameters.legend_data.legend}}
            <div class='detail-block legend-block'>
              <img src="data:{{contentType}};base64,{{imageData}}" >
              <span> {{label}} </span>
            </div>
          {{/parameters.legend_data.legend}}
        </div>

        <div class='detail-block legend-url-text extreme-precip'>
          <span class='legend-text'>
            {{#if parameters.time === "Current Magnitude"}}
              Inches precipitation
            {{ else }}
              {{#if parameters.time === "Future Avg Percent Increase"}}
                % change in precipitation amount
              {{ else }}
                {{#if parameters.time === "Future Recurrence"}}
                  Return interval (years)
                {{/if}}
              {{/if}}
            {{/if}}
          </span>
        </div>
      {{/if parameters.legend_data}}

  `,
  info_template: `
    <div class='col-xs-2'>
      <label> {{name}} </label>
    </div>
    <div class='col-xs-10'>
      <table class="table">
        <tr>
          <th>Stretched Value</th>
          <th>Pixel Value</th>
        </tr>
        {{#json.results}}
          <tr>
            <td>{{attributes["Stretched value"]}}</td>
            <td>{{attributes["Pixel Value"]}}</td>
          </tr>
        {{/json.features}}
      </table>
    </div>
  `
})})();

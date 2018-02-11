
(function () {
    let _root_url = CDN("https://gis.fema.gov/arcgis/rest/services/FEMA/HistoricalDesignations/MapServer");
    let _cache = {};

    let _get_legend_data = function (active_layer, callback) {
        var fhl = active_layer.parameters.fema_historic_layer;

        if (_cache[fhl]) {
          callback(null, _cache[fhl]);
        } else {
          $.ajax({
            url: CDN(_root_url + "/" + fhl),
            data: {f: "pjson"},
            dataType: "jsonp",
            success: function (data) {
              _cache[fhl] = data;
              callback(null, _cache[fhl]);
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

  RendererTemplates.esri("fema_historic", {
    parameters: {
      opacity: 70,
      // Future, Current, Change
      fema_historic_layer: "0",
      options: {
        types: {
          '0': 'Total',
          '2': "Drought",
          '3': "Fire",
          '4': "Flood",
          '5': "Hurricane",
          '6': "Severe Storm",
          '7': "Snow/Ice/Freezing",
          '8': "Tornado"
        }
      }
    },

    get_feature_info_url: function (active_layer, map) {
      var fhl = active_layer.parameters.fema_historic_layer;
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
        "&layers=visible%3A" + fhl;
    },

    onrender: (active_layer) => {
      _get_legend_data(active_layer, (err, legend_data) => {
          active_layer.parameters.legend_text = legend_data.name;
          if (legend_data.drawingInfo.renderer.type == 'uniqueValue') {
              let uvis = _.uniq(legend_data.drawingInfo.renderer.uniqueValueInfos, 'label');
              active_layer.parameters.legend_range = _.map(uvis, function (uvi) {
                var clr = "rgba(" + uvi.symbol.color.join(",") + ")";
                return {c: clr, s: uvi.label};
              });

          } else {
              active_layer.parameters.legend_range = _.map(legend_data.drawingInfo.renderer.classBreakInfos, function (cbi) {
                var clr = "rgba(" + cbi.symbol.color.join(",") + ")";
                return {c: clr, s: cbi.label};
              });
          }
        Views.ControlPanel.fire("update-layers-parameters", active_layer)
      });
    },

    esri_opts: (active_layer) => {
      var fhl = active_layer.parameters.fema_historic_layer;

      return {
         url: CDN(_root_url),
         layers: [fhl],
         f:"image",
         format: "png8",
         transparent: true,
         dpi: 96,
         clickable: false,
         attribution: 'FEMA'}
  },
  legend_template: `
     <div class='detail-block show-confidence'>
       <label decorator='tooltip:Choose an emergency type'> Summarize by: </label>
       <select value='{{parameters.fema_historic_layer}}'>
         {{#u.to_sorted_keys_from_hash(parameters.options.types)}}
           <option value='{{key}}'>{{value}}</option>
         {{/u.to_sorted_keys_from_hash(parameters.options.types)}}
       </select>
     </div>

    <div class='detail-block legend'>
      {{#parameters.legend_text}}
        <div class='color-legend'>{{parameters.legend_text}}</div>
      {{/parameters.legend_text}}

      {{#parameters.legend_range}}
        <div class='color-block' style="width: {{100.0 / parameters.legend_range.length}}%;">
          <svg width="100" height="100">
            <rect height="100" width="100" style="fill: {{c}}; opacity:{{(0.7 * parameters.opacity / 100.0) + 0.3}}; "/>
          </svg>
          {{#if v}}
            <label>{{fixed_precision(v, parameters.legend_significant_digits)}}</label>
          {{/if v}}

          {{#if s}}
            <label>{{s}} </label>
          {{/if s}}
        </div>
      {{/parameters.legend_range}}
    </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class="table" style="text-align:center;">
          <tr>
            <th>County</th>
            <th>Total</th>
            <th>Drought</th>
            <th>Drought</th>
            <th>Earthquake</th>
            <th>Fire</th>
            <th>Flood</th>
            <th>Hurricane</th>
            <th>Ice Storm</th>
            <th>Snow</th>
            <th>Storm</th>
            <th>Tornado</th>
          </tr>
          <tr>
            <th> &nbsp; </th>
            <th colspan='11' style='text-align: center'>
              (1964 - 2000)
            </th>
          </tr>
          {{#json.results}}
            <tr>
              <td>{{attributes.COUNTY}}</td>
              <td>{{attributes.TOTAL_DECLARATIONS_1964}} - {{attributes.TOTAL_DECLARATIONS_2K}}</td>
              <td>{{attributes.DROUGHT_1964}} - {{attributes.DROUGHT_2K}}</td>
              <td>{{attributes.EARTHQUAKE_1964}} - {{attributes.EARTHQUAKE_2K}}</td>
              <td>{{attributes.FIRE_1964}} - {{attributes.FIRE_2K}}</td>
              <td>{{attributes.FLOOD_1964}} - {{attributes.FLOOD_2K}}</td>
              <td>{{attributes.HURRICANE_1964}} - {{attributes.HURRICANE_2K}}</td>
              <td>{{attributes.ICE_STORM_1964}} - {{attributes.ICE_STORM_2K}}</td>
              <td>{{attributes.SNOW_1964}} - {{attributes.SNOW_2K}}</td>
              <td>{{attributes.STORM_1964}} - {{attributes.STORM_2K}}</td>
              <td>{{attributes.TORNADO_1964}} - {{attributes.TORNADO_2K}}</td>
            </tr>
          {{/json.results}}
        </table>
      </div>
  `
})})();

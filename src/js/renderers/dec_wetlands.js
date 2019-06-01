(function() {
  let _layer_number = 136
  let _root_url = CDN("https://services2.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_toolkit/MapServer/");
  let _cache = null;
  let _get_legend_data = function (active_layer, callback) {
      // callback(error, geojson_data?)
      if (_cache) {
        callback(null, _cache);
      } else {
        $.ajax({
          url: CDN(_root_url + "/" + _layer_number + "/legend"),
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

  RendererTemplates.esri("dec_wetlands", {
    parameters: {
      opacity: 85,
      options: {

      }
    },
    legend_template: `
      <div class='detail-block legend'>
        <label> Legend </label>
        <img src="img/legends/dec_wetlands.png"/>
      </div>
    `,
    legend_template: `
        <div class='detail-block legend'>
          {{#parameters.legend}}
            <div class='color-block square'>
              <svg width="100" height="100">
                <rect height="100" width="100" style="fill: {{color}}; opacity:{{(0.7 * parameters.opacity / 100.0) + 0.3}}; "/>
              </svg>
            </div>
            <span class='legend-text'>{{label}}</span>
          {{/legend_data}}
        </div>
    `,
    onrender: (active_layer) => {
      _get_legend_data(active_layer, (err, data) => {
        let dinfo = data.drawingInfo.renderer;
        let color_str = "rgba(" +
           dinfo.defaultSymbol.color[0] + ", " +
           dinfo.defaultSymbol.color[1] + ", " +
           dinfo.defaultSymbol.color[2] + ", " +
           dinfo.defaultSymbol.color[3] + ")";

        active_layer.parameters.legend = [{color: color_str, label: dinfo.defaultLabel}];
        Views.ControlPanel.fire("update-layers-parameters", active_layer);
      });
    },
    esri_opts: function (active_layer) {
      return {
              url: CDN(_root_url),
              // No longer defaults to image, but JSON
              layers: [_layer_number],
              f:"image",
              clickable: false,
              attribution: 'NYS DEC'}
    }
  });
})();

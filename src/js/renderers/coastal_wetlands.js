(function() {
  let _layer_number = 32
  let _root_url = CDN("http://50.19.218.171/arcgis1/rest/services/MarineLifeAndHabitat/MapServer/");
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

  RendererTemplates.esri("coastal_wetlands", {
    parameters: {
      opacity: 85,
      options: {

      }
    },
    legend_template: `
      <div class='detail-block legend'>
        <label> Legend </label>
        <img src="img/legends/coastal_wetlands.jpg"/>
      </div>
    `,
    esri_opts: function (active_layer) {
      return {
              url: CDN(_root_url),
              // No longer defaults to image, but JSON
              layers: [_layer_number],
              f:"image",
              clickable: false,
              attribution: 'NWI'}
    }
  });
})();

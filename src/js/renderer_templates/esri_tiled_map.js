RendererTemplates.esri_tiled_map = function (layer_id, opts) {
  function get_esri_opts(active_layer) {
    var esri_opts = opts.esri_opts;
    if (typeof opts.esri_opts === 'function') {
      esri_opts = opts.esri_opts(active_layer);
    }
    return esri_opts;
  }
  function get_esri_tiled_map_legend (active_layer) {
    return new Promise((win, lose) => {
        $.ajax({
          cache: true,
          dataType: "json",
          url: opts.url + "/legend?f=pjson",
          success: function (data) {
            let layers = _.map(opts.esri_opts.layers.split(","), parseInt);
            let legends = [];
            _.each(data.layers, (layer) => {
              if (_.contains(layers, layer.layerId)) {
                _.each(layer.legend, (leg) => {
                  legends.push(leg);
                });
              }
            });
            active_layer.legend_data = legends;
            win();
          },
          error:   function (err) {
            if (err.status !== 200) {
              lose(err);
            }
          }
        });
    });
  }
  function create_esri_tiled_map (active_layer, pane) {
    return new Promise((win, lose) => {
        //var layer = new L.TileLayer.EsriRest(opts.url,
        var layer = new L.esri.TiledMapLayer(
          _.merge({ url: opts.url,
                    pane: pane,
                    minZoom: opts.parameters.min_zoom || 0,
                    maxZoom: opts.parameters.max_zoom || 18},
                  get_esri_opts(active_layer)));
        layer.on("tileload", function (loaded) {
          Views.ControlPanel.fire("tile-layer-loaded", active_layer);
        });
        layer.on("tileerror", function (err) {
          console.warn("layer_id", "WMS Renderer",  err);
          Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
        });
        win(layer);
      });
  }
  var renderer = RendererTemplates.base(layer_id, opts, {
    legend_template: `
        <div class='detail-block esri-tiled-map'>
          {{#legend_data}}
            <div class=''>
              <img src="data:{{contentType}};base64,{{imageData}}" class='cube'/>
              <span>{{label}}</span>
            </div>
          {{/legend_data}}
        </div>
    `,
    render: function (map, active_layer, pane) {
      Renderers.create_leaflet_layer_async(
        map,
        active_layer,
        get_esri_opts(active_layer),
        () => {
          return Promise.all([create_esri_tiled_map(active_layer, pane),
                              get_esri_tiled_map_legend(active_layer)]);
        },
        function () {
          if (opts.on_layer_create) {
            opts.on_layer_create(active_layer);
          }
        });

      var opacity = Renderers.opacity(active_layer);
      var layers = Renderers.get_all_leaflet_layers(map,active_layer);
      var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_esri_opts(active_layer))

      _.each(layers, function (layer) {
        // Hide the ones which aren't active
        if (active_leaflet_layer._leaflet_id === layer._leaflet_id) {
          layer.setOpacity(opacity);
        } else {
          layer.setOpacity(0);
        }
      });
    }
  });

  Renderers[layer_id] = renderer;
}

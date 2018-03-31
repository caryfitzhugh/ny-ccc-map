RendererTemplates.esri_rest = function (layer_id, opts) {
  function get_esri_opts(active_layer) {
    var esri_opts = opts.esri_opts;
    if (typeof opts.esri_opts === 'function') {
      esri_opts = opts.esri_opts(active_layer);
    }
    return esri_opts;
  }

  var renderer = RendererTemplates.base(layer_id, opts, {
    render: function (map, active_layer, pane) {
      Renderers.create_leaflet_layer(
        map,
        active_layer,
        get_esri_opts(active_layer),
        () => {
          return new Promise((win, lose) => {
            var layer = new L.TileLayer.EsriRest(opts.url,
              _.merge({ pane: pane,
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

RendererTemplates.geojson_points = function (layer_id, opts) {
  let _cache = {};
  let loading = {};

  let get_opts = function (active_layer) {
    return active_layer.parameters.options;
  };

  let load_data_url = ((active_layer, durl, url_opts) => {
    return new Promise( (win, lose) => {
      if (_cache[durl]) {
        win(_cache[durl])
      } else  {
        if (!loading[durl]) {
          loading[durl] = true;
          if (opts.load_data_url) {
            opts.load_data_url(active_layer, durl, url_opts)
              .then((json) => {
                _cache[durl] = json;
                win(json);
              })
              .error(() => {
                lose();
              })
          } else {
            $.ajax({
              cache: true,
              dataType: "json",
              url: durl,
              success: function (json) {
                _cache[durl] = json;
                win(json);
              },
              error:   function (err) {
                lose();
              }
            });
          }
        }
      }
    });
  });

  var renderer = RendererTemplates.base(layer_id, opts, {
    render: function (map, active_layer, pane) {

      load_data_url(active_layer, opts.url, opts.url_opts)
      .then((data) => {
        Renderers.create_leaflet_layer_async(
          map,
          active_layer,
          get_opts(active_layer),
          () => {
            return new Promise((win, lose) => {
              let features = opts.selectData ? opts.selectData(active_layer, data.features) : data.features;

              var layer = new L.GeoJSON(Object.assign({}, data), {
                pointToLayer: function(feature, latlng) {
                  if (opts.pointToLayer) {
                    return opts.pointToLayer(active_layer, feature, latlng);
                  }
                },
                pane: pane,
                onEachFeature: (feature, layer) => {
                  if (opts.onEachGeometry) {
                    opts.onEachGeometry(data, active_layer, feature, layer);
                  }
                  if (opts.popupContents) {
                    layer.bindPopup(opts.popupContents(feature));
                  }
                }
              });

              if (opts.clustering) {
                  let group = new L.MarkerClusterGroup(_.merge({
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    disableClusteringAtZoom: 11,
                    iconCreateFunction: function (cluster) {
                      return new L.DivIcon({
                        html: cluster.getChildCount()
                      });
                    }
                  }, opts.clustering));
                  group.addLayer(layer);
                  layer = group;
              }
              win(layer);
              Views.ControlPanel.fire("tile-layer-loaded", active_layer);
            })
          },
          () => {
            if (opts.on_layer_create) {
              opts.on_layer_create(active_layer);
            }
            var opacity = Renderers.opacity(active_layer);
            var layers = Renderers.get_all_leaflet_layers(map,active_layer);
            var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))

            _.each(layers, function (layer) {
              let sublayers = null;
              if (opts.clustering) {
                sublayers = layer._featureGroup._layers;
              } else {
                sublayers = layer._layers;
              }

              // Hide the ones which aren't active
              if (active_leaflet_layer && active_leaflet_layer._leaflet_id === layer._leaflet_id) {
                Object.keys(sublayers).forEach((key) => {
                  let point = sublayers[key];
                  point.setOpacity(opacity);
                });
              } else {
                Object.keys(sublayers).forEach((key) => {
                  let point = sublayers[key];
                  point.setOpacity(0);
                });
              }
            });
          }
        )
      })
      .catch((err) => {
        Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
      })
    }
  });
  Renderers[layer_id] = renderer;
}

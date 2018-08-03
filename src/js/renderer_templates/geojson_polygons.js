RendererTemplates.geojson_polygons = function (layer_id, opts) {
  let _cache = {}
  let _loading = {}

  let _get_opts = opts.get_opts || (function (active_layer) {
    return active_layer.parameters.options;
  });

  let load_data_url = opts.load_data_url || ((active_layer, durl, url_opts) => {
    return new Promise( (win, lose) => {
      if (_cache[durl]) {
        win(_cache[durl])
      } else  {
        if (!_loading[durl]) {
          _loading[durl] = true;
          $.ajax({
            cache: true,
            dataType: "json",
            url: durl,
            success: function (json) {
              if (json.type === "Topology") {
                let name = _.keys(json.objects)[0];
                json = topojson.feature(json, json.objects[name]);
              }
              _cache[durl] = json;
              win(json);
            },
            error:   function (err) {
              lose();
            }
          });
        }
      }
    });
  });

  var renderer = RendererTemplates.base(layer_id, opts, {
    find_geo_json: function (map, active_layer, evt) {
      var details_at_point = [];
      var layer = Renderers.get_leaflet_layer(map, active_layer, _get_opts(active_layer))

      var match = Renderers.find_geojson_polygon_by_point(evt, layer);

      if (match) {
        if (opts.find_geojson_match) {
          var data = opts.find_geojson_match(active_layer, match)
          if (data) {
            details_at_point.push(data);
          }
        }
      }
      return details_at_point;
    },

    render: function (map, active_layer, pane) {
      Renderers.create_leaflet_layer_async(
        map,
        active_layer,
        _get_opts(active_layer),
        () => {
          return new Promise((win, lose) => {
            load_data_url(active_layer, opts.url, opts.url_opts)
              .then((data) => {
                  let layer_data = data;

                  var layer = new L.GeoJSON(layer_data, {
                    pane: pane,
                    filter: opts.filter ? ((feature, layer) => {
                      return opts.filter(active_layer, feature, layer);
                    }) : null,
                    onEachFeature: (feature, layer) => {
                      if (opts.onEachGeometry) {
                        opts.onEachGeometry(data, active_layer, feature, layer);
                      }
                      if (opts.popupContents) {
                        layer.bindPopup(opts.popupContents(feature));
                      }
                    }
                  });

                  win(layer);
                  Views.ControlPanel.fire("tile-layer-loaded", active_layer);
              });
          })
        },
        () => {
          if (opts.on_layer_create) {
            opts.on_layer_create(active_layer);
          }
          var layers = Renderers.get_all_leaflet_layers(map,active_layer);
          var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, _get_opts(active_layer))
          let opacity = Renderers.opacity(active_layer);

          _.each(layers, function (layer) {
            _.each(layer._layers, function (polygon) {
              if (active_leaflet_layer && layer._leaflet_id == active_leaflet_layer._leaflet_id) {
                polygon.setStyle({"fillOpacity": opacity, "opacity": opacity});
                if (opts.onEachPolygon) {
                  opts.onEachPolygon(active_layer, polygon, opacity);
                }
              } else {
                polygon.setStyle({"fillOpacity": 0, "opacity": 0});
              }
            });
          });
        })
    }
  });
  Renderers[layer_id] = renderer;
}

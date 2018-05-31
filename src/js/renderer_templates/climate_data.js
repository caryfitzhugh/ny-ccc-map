RendererTemplates.ny_climate_data_cache = {};

RendererTemplates.ny_match_geometry_and_data = (layer_data, geom_feature, summary, season, year) => {
  let is_same_geometry = (ldf) => {
      if (summary == 'county') {
         return ldf.properties.name == geom_feature.properties.name;
      } else if (summary == 'basin') {
        return parseInt(ldf.properties.uid, 10) === parseInt(geom_feature.id, 10)
      } else if (summary == 'state') {
        return true; //debugger;
      } else {
        console.error("matching", summary, ldf.properties, geom_feature.properties);
      }
  };

  let data_value = {};

  _.each(layer_data.features, (layer_data_feature) => {
    if (is_same_geometry(layer_data_feature)) {
      _.each(layer_data_feature.properties.data, (data) => {
        if (data.season === season) {
          found_data_value = _.find(data.values, (value) => {
            return value.year === year;
          });
          if (found_data_value) {
            data_value = {
              value: found_data_value,
              season: season,
              year: year,
              season_data: data,
              geometry_data: layer_data_feature.properties
            }
          }
        }
      });
    }
  })

  return data_value;
};

RendererTemplates.ny_climate_data_colorize = (metrics_range, value, colors, opts) => {
  // Start from left.
  // Find the first quantile which our value is LESS than.
  //    if it's < [0], it returns immediately.
  //    error case is if it's > [last], which is -1
  //    and we set that to the last bucket index.
  // INVERT if needed, and then flip the comparisons.
  let index = _.findIndex(metrics_range, (qv) => {
    if (opts.invert_scale) {
      return value >= qv;
    } else {
      return value <= qv;
    }
  });

  if (index === -1 ) {
    index = metrics_range.length;
  }
  return colors[index];
};

RendererTemplates.ny_climate_data = function (layer_id, opts) {
  // This takes an active layer and returns a hash of uniquely identifying data (including parameters)
  // This relates a set of params (sliders/toggles/etc) with a leaflet layer.
  // (a_l.parameters.year == 2044)
  //   => {year: 2044, layer: 'future_data',...}
  let get_opts = function (active_layer) {
    return {options: active_layer.parameters.options};
  };

  let loading = {};

  let load_data_url = (durl) =>  {
    return new Promise( (win, lose) => {
      if (RendererTemplates.ny_climate_data_cache[durl]) {
        win(_.cloneDeep(RendererTemplates.ny_climate_data_cache[durl]))
      } else  {
        if (!loading[durl]) {
          loading[durl] = true;
          $.ajax({
            cache: true,
            dataType: "json",
            url: durl,
            success: function (json) {
              RendererTemplates.ny_climate_data_cache[durl] = json;
              win(json);
            },
            error:   function (err) {
              lose();
            }
          });
        }
      }
    });
  };

  let load_geometry_url = (name) =>  {
    return new Promise( (win, lose) => {
      GeometryLoader.load(name, (err, data) => {
        if (err) { lose(err); }
        else { win(data); }
      });
    });
  };

  var renderer = RendererTemplates.base(layer_id, opts, {
    find_geo_json: function (map, active_layer, evt) {
      // For this layer, get *all* of the leaflet_layers associated with it
      var layers = Renderers.get_all_leaflet_layers(map,active_layer);
      // Lookup the *active* leaflet layer from those available
      var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))
      var lyr = Object.keys(active_leaflet_layer._layers)[0];

      if (active_leaflet_layer) {
        let latlng = evt.latlng;
        let match = leafletPip.pointInLayer(evt.latlng, active_leaflet_layer, true);
        if (match[0]) {
          return _.cloneDeep(match[0].feature.properties);
        } else {
          return null;
        }
      }
      return null;
    },
    render: function (map, active_layer, pane) {
      load_data_url(opts.data_url)
      .then((layer_data) => {
        if (opts.onLoadedData) {
          // You can pre-process the data,
          // You can figure out min/max , buckets, years available, etc.
          opts.onLoadedData(layer_data, active_layer);
        }

        Renderers.create_leaflet_layer_async(
          map,
          active_layer,
          get_opts(active_layer),
          () => {
            return new Promise((win, lose) => {
              load_geometry_url(active_layer.parameters.options.summary)
              .then((geom_data) => {
                var layer = new L.GeoJSON(geom_data, {
                  pointToLayer: opts.pointToLayer,
                  pane: pane,
                  onEachFeature: (feature, layer) => {
                    opts.onEachGeometry(layer_data, active_layer, feature, layer);
                  }
                });
                win(layer);
                Views.ControlPanel.fire("tile-layer-loaded", active_layer);
              })
              .catch((err) => {
                if (err.status !== 200) {
                  Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
                }
                lose();
              });
            })
          }, () => {

            var opacity = Renderers.opacity(active_layer);
            var layers = Renderers.get_all_leaflet_layers(map,active_layer);
            var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))
            // http://leafletjs.com/reference-1.2.0.html#path-option
            let base_style = {
              "weight": '1',
              "color": "black",
            };
            let hidden_style = {
              "weight": '0',
              'opacity': 0,
              'fillOpacity': 0
            };

            _.each(layers, function (layer) {
              // Hide the ones which aren't active
              if (active_leaflet_layer && active_leaflet_layer._leaflet_id === layer._leaflet_id) {
                layer.setStyle((feature) => {
                  if (feature.properties.location_data) {
                    return _.merge({}, base_style, {opacity: opacity, fillOpacity: Math.max(0, opacity - 0.1)});
                  } else {
                    return _.merge({}, hidden_style, {fillColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.1)", opacity: opacity, fillOpacity: Math.max(0, opacity - 0.1)});
                  }
                });
              } else {
                layer.setStyle((feature) => {
                  return hidden_style;
                });
              }
            });
          });
      });
    }
  });

  Renderers[layer_id] = renderer;
}

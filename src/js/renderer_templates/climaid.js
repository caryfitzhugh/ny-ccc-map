RendererTemplates.climaid_data = {};

RendererTemplates.climaid = function (layer_id, opts) {
  let get_opts = function (active_layer) {
    let opts = _.pick(active_layer.parameters, ['timestep', 'scenario', 'percentile', 'symbology']);
    return opts;
  };
  let loading = {};

  let process_data = (climaid_deltas, params) => {
    let timestep = params.timestep;
    let scenario = params.scenario;
    let percentile = params.percentile;
    let symbology = params.symbology;

    var cache_key = [layer_id, timestep, scenario, percentile, symbology].join("_");
    if (!RendererTemplates.climaid_data[cache_key]) {
      // We have the data coming in a big blob.  One file == all the data
      var get_geometry = function (row_i, col_i) {
        // Latitude is the Y (col)
        var tl = [
          climaid_deltas.longitude.start + (col_i * climaid_deltas.longitude.step),
          climaid_deltas.latitude.start + (row_i * climaid_deltas.latitude.step)
        ];

        var tr = [
          climaid_deltas.longitude.start + ((1 + col_i) * climaid_deltas.longitude.step),
          climaid_deltas.latitude.start + (row_i * climaid_deltas.latitude.step)
        ];

        var br = [
          climaid_deltas.longitude.start + ((1 + col_i) * climaid_deltas.longitude.step),
          climaid_deltas.latitude.start + ((1 + row_i) * climaid_deltas.latitude.step)
        ];

        var bl = [
          climaid_deltas.longitude.start + (col_i * climaid_deltas.longitude.step),
          climaid_deltas.latitude.start + ((1 + row_i) * climaid_deltas.latitude.step)
        ];

        return [tl, tr, br, bl, tl];
      };

      // We want to convert this into a set of values which can drop into d3
      var geojson = {
        "type": "FeatureCollection",
        "features": []
      };

      var temp_prediction_set = climaid_deltas[timestep][scenario][percentile];

      // The temp prediction set looks like this:
      // [
      //    [  1, 2, 3, 4, 5...] // These are the deltas in Celsius
      //    // Each row is the vertical row on the map. (like Y)
      //    // Each row's contents defines the horiztonal data (like X)
      //    ....
      // ]
      _.forEach(temp_prediction_set, function (delta_row, row_i) {
        _.forEach(delta_row, function (delta_col, col_i) {
          geojson.features.push({
            "type": "Feature",
            "lat-lng": get_geometry(row_i, col_i)[0],
            "geometry": {
              "type": "Polygon",
              "coordinates": [get_geometry(row_i, col_i)]
            },
            "properties": {
              "climaid_delta": delta_col
            }
          });
        });
      });

      var color_extent = [0,100];
      // Find the range.
      if (symbology === "year") {
        // Want all the values inside this entire year set
        color_extent = d3.extent(
          _.flattenDeep(_.map(climaid_deltas[timestep],
                              function(y) { return _.map(y,
                                                          function (s) { return _.flattenDeep(s);}); }))
        );

      } else if (symbology === "scenario") {
        // Want all values from this scenario, across all years / percentiles
        var scenarios = _.compact(_.pluck(climaid_deltas, scenario));
        var data_points = _.flattenDeep(_.map(scenarios, function (s) { return _.values(s); }));
        color_extent = d3.extent(data_points);

      } else if (symbology === "percentile") {
        // Want all values from this percentile, across all years / scenarios
        var data_points = [];
        _.each(climaid_deltas, function (year) {
          _.each(year, function (scenario) {
            _.each(scenario, function (percentile_data, val) {
              if (val === percentile) {
                data_points.push(percentile_data);
              }
            });
          });
        });
        color_extent = d3.extent( _.flattenDeep(data_points));
      }
      RendererTemplates.climaid_data[cache_key] = Object.freeze({geojson: geojson, color_extent: color_extent});
    }
    return RendererTemplates.climaid_data[cache_key];
  };

  let load_data_url = (durl) =>  {
    return new Promise( (win, lose) => {
      if (RendererTemplates.climaid_data[durl]) {
        // You can return this, b/c it is frozen
        win(RendererTemplates.climaid_data[durl])
      } else  {
        if (!loading[durl]) {
          loading[durl] = true;
          $.ajax({
            cache: true,
            dataType: "json",
            url: durl,
            success: function (json) {
              RendererTemplates.climaid_data[durl] = json;
              Object.freeze(RendererTemplates.climaid_data[durl]);
              win(RendererTemplates.climaid_data[durl]);
            },
            error:   function (err) {
              lose();
            }
          });
        }
      }
    });
  };


  let calculate_colors = (active_layer, layer_data, color_extent) => {
    let color = d3.scaleQuantile()
    let color_range = opts.color_range.positive;
    let extent = color_extent;

    // We do fnacy if there is negative values
    if (color_extent[0] < 0) {
      color_range = (opts.color_range.negative.concat(["rgba(0,0,0)"]).concat(opts.color_range.positive))

      //Caclulate the domain of color based on the range of data
      // Want the most positive or most negative number as the max / min
      var most = _.max([Math.abs(color_extent[1]), Math.abs(color_extent[0])]);
      extent = [-most, most];
    }

    // Apply values
    color.range(color_range);
    color.domain(extent);

    // Now we need to limit this to at most 9 values (even if it got extended)
    let cd = color.domain();
    var legend_color_range = _.reduce(_.range(cd[0], cd[1], (cd[1] - cd[0]) / 9).concat([cd[1]]), function (legend, step) {
        legend.push(color(step));
        return legend;
      }, []);
    active_layer.parameters.color_range = legend_color_range;
    active_layer.parameters.color_extent = extent;
    active_layer.parameters.colorfn = color;

    return color;
  };
  let set_metrics_ranges = (active_layer, colorfn) => {
    active_layer.parameters.metrics_range = colorfn.quantiles();
    active_layer.parameters.colorfn = colorfn;
  };
  let onEachGeometry = (layer_data, colorfn, active_layer, feature, layer) => {
    try {
      let value = feature.properties.climaid_delta;
      let color = colorfn(value) || "rgba(0,0,0,0)";
      layer.setStyle({fillColor: color, color: color});
    } catch(e) {
      console.error(e);
    }
  }

  var renderer = RendererTemplates.base(layer_id, opts, {
    parameters: {
      opacity: '70',
      timestep: '2020',
      percentile: "mean",
      scenario: '45', // conf
      symbology: "scenario"
    },
    find_geo_json: function (map, active_layer, evt) {
      var details_at_point = null;
      // Lookup the *active* leaflet layer from those available
      var layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))
      var match = Renderers.find_geojson_polygon_by_point(evt, layer);
      if (match) {
        details_at_point = _.merge({}, match.feature.properties, {geojson: true});
      }
      return details_at_point;
    },

    render: function (map, active_layer, pane) {
      load_data_url(opts.data_url)
      .then((layer_data) => {
        Renderers.create_leaflet_layer_async(
          map,
          active_layer,
          get_opts(active_layer),
          () => {
            // We process the downloaded deltas, against the parameters
            // Creating a GeoJSON record
            let display_data = process_data(layer_data, active_layer.parameters);
            let colorfn = calculate_colors(active_layer, layer_data, display_data.color_extent);
            set_metrics_ranges(active_layer, colorfn);

            return new Promise((win, lose) => {
              var layer = new L.GeoJSON(display_data.geojson, {
                pane: pane,
                onEachFeature: (feature, layer) => {
                  onEachGeometry(layer_data, colorfn, active_layer, feature, layer);
                }
              });
              win(layer);
              Views.ControlPanel.fire("tile-layer-loaded", active_layer);
            })
          }, () => {
            var opacity = Renderers.opacity(active_layer);
            var layers = Renderers.get_all_leaflet_layers(map,active_layer);
            var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))

            // http://leafletjs.com/reference-1.2.0.html#path-option
            let base_style = {
              "weight": '0.1',
              "color": "rgba(0,0,0,0.4)",
            };

            let hidden_style = {
              "weight": '0',
              'opacity': 0,
              'fillOpacity': 0,
              'fill': 'transparent'
            };

            _.each(layers, function (layer) {
              // Hide the ones which aren't active
              if (active_leaflet_layer && active_leaflet_layer._leaflet_id === layer._leaflet_id) {
                layer.setStyle((feature) => {
                  return _.merge({}, base_style, {opacity: opacity, fillOpacity: Math.max(0, opacity - 0.1)});
                });
              } else {
                layer.setStyle((feature) => {
                  return hidden_style;
                });
              }
            });
          });
      });
    },
    info_template: `
      <div class='col-xs-2'>
        <label> ` + opts.title + ` </label>
      </div>
      <div class='col-xs-10'>
        <div>
          Projected ` + opts.legend + `: {{u.to_fixed(geojson.climaid_delta, ` + opts.legend_precision + `)}} {{{ ` + opts.legend_units + `}}} <br>
        </div>
      </div>
    `,
    legend_template: `
      <div class='detail-block sea-level'>
        <label decorator='tooltip:Use slider to select date'> Year: </label>
        <select value='{{parameters.timestep}}'>
          <option value='2020'> 2020 </option>
          <option value='2050'> 2050 </option>
          <option value='2080'> 2080 </option>
        </select>
      </div>
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Emissions Scenario'> Scenario: </label>
        <select value='{{parameters.scenario}}'>
          <option value='45'> Low (4.5) </option>
          <option value='85'> High (8.5) </option>
        </select>
      </div>
      <div class='detail-block show-confidence'>
        <label decorator='tooltip: Percentile standing among all possible models'> Percentile: </label>
        <select value='{{parameters.percentile}}'>
          <option value='10'> 10th Percentile </option>
          <option value='25'> 25th Percentile </option>
          <option value='mean'> Median </option>
          <option value='75'> 75th Percentile </option>
          <option value='90'> 90th Percentile </option>
        </select>
      </div>
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:The data range from which the color scale will be constructed'> Symbolize By: </label>
        <select value='{{parameters.symbology}}'>
          <option value='scenario'> Across Scenario </option>
          <option value='year'> Across Years </option>
          <option value='percentile'> Across Percentile </option>
        </select>
      </div>

      {{#{metrics: parameters.metrics_range,
          legend: '` + opts.legend + `',
          inverted: '` + opts.invert_scale + `',
          quantiled: true,
          signed: false,
          precision: '` + opts.legend_precision + `',
          colors: parameters.color_range} }}
        {{> map_color_block_legend_template }}
      {{/{metrics: parameters.metrics_range}}
    `
  });

  Renderers[layer_id] = renderer;
}

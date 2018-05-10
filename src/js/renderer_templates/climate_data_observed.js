const findDataForNYObservedData = (layer_data, area, season, year) => {
  let data_value = {};
  _.each(layer_data.features, (feature) => {
    if (feature.properties.name === area) {
      _.each(feature.properties.data, (data) => {
        if (data.season === season) {
          found_data_value = _.find(data.values, (value) => {
            return value.year === year;
          });
          if (found_data_value) {
            data_value = {
              value: found_data_value,
              season: season,
              year: year,
              area: area,
              season_data: data,
              area_data: feature
            }
          }
        }
      });
    }
  })
  return data_value;
};

RendererTemplates.ny_observed_climate_data = function (layer_id, opts) {
  RendererTemplates.ny_climate_data(layer_id, {

    clone_layer_name: function(active_layer) {
      let p = active_layer.parameters.options;
      var name =  opts.title + " Y:" + active_layer.parameters.years[p.year_indx] + "s S:" + p.season + " by " + p.summary;
      return name;
    },
    info_template: `
        <div class='col-xs-2'>
          <label> {{{name}}}</label>
        </div>
        <div class='col-xs-10'>
          <table class='table'>
            <thead>
              <tr>
                <th style='text-align: center;'
                    colspan='{{u.object_entries_count(active_layer.parameters.all_seasons) + 2}}'> {{geojson.name}} {{geojson.geomtype}}
    </th>
              </tr>
              <tr>
                <th> </th>
                <th></th>
                <th class='deltas' style='text-align: center;'
                    colspan='{{u.object_entries_count(active_layer.parameters.all_seasons)}}'>
                      ` + opts.legend + ` </th>
              </tr>
              <tr>
                <th> Season </th>
                <th> Baseline (` + opts.legend_units + `)</th>
                {{#active_layer.parameters.years}}
                  <th> {{.}}s</th>
                {{/active_layer.parameters.years}}
              </tr>
            </thead>
            <tbody>
              {{#u.sort_by(geojson.location_data.area_data.properties.data, 'season')}}
                <tr class="{{(season === geojson.location_data.season ? 'active-season' : '')}}">
                  <td>{{u.capitalize(season)}}</td>
                  <td>{{baseline}}</td>
                  {{#u.sort_by(values, 'year')}}
                    <td decorator="tooltip: Likely Range: {{range}} " class='{{(year === geojson.location_data.year ? 'active-year' : '')}}'>
                    {{{data_value}}}</td>
                  {{/sort_by(values, 'year')}}
                </tr>
              {{/u.sort_by(geojson.location_data.area_data.properties.data, 'season')}}
            </tbody>
          </table>
        </div>
    `,
    legend_template: `
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Summary Area'> Summary: </label>
        <select value='{{parameters.options.summary}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_summaries)}}
            <option value='{{key}}'>{{{value}}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_summaries)}}
        </select>
      </div>
      <div class='detail-block opacity'>
        <label  decorator='tooltip:Use slider to adjust Decade'> Decade: </label>
        <input type="range" value="{{parameters.options.year_indx}}"
          min="0"
          max="{{parameters.years.length-1}}">
        {{parameters.years[parameters.options.year_indx]}}
      </div>
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Scenario'> Scenario: </label>
        <select value='{{parameters.options.scenario}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_scenarios)}}
            <option value='{{key}}'>{{value}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_scenarios)}}
        </select>
      </div>
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Season'> Season: </label>
        <select value='{{parameters.options.season}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_seasons)}}
            <option value='{{key}}'>{{value}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_seasons)}}
        </select>
      </div>

      {{#{metrics: parameters.metrics_ranges[parameters.options.season][parameters.options.scenario],
          legend: '` + opts.legend + `',
          inverted: '` + opts.invert_scale + `',
          quantiled: true,
          signed: false,
          precision: '` + opts.legend_precision + `',
          colors: parameters.color_range} }}
        {{> map_color_block_legend_template }}
      {{/{metrics: parameters.metrics_ranges[parameters.options.season]}}
    `,
    data_url: opts.data_url,

    onLoadedData: (layer_data, active_layer) => {
      let baselines = {};
      let years = _.uniq(_.flatten(_.map(layer_data.features, (feature) => {
        return _.flatten(_.map(feature.properties.data, (data) => {
            return _.flatten(_.map(data.values, (value) => {
              return value.year;
            }));
        }));
      }))).sort();

      active_layer.parameters.years = years;

      // Calculate the color brewer bands.
      // Get min / max values for all these metrics across all the years / seasons / etc.
      // track baselines
      let data_values = {};
      _.each(layer_data.features, (feature) => {
        _.each(feature.properties.data, (data) => {
          data_values[data.season] = data_values[data.season] || {'high': [], 'low': []};
          _.each(data.values, (value) => {
            data_values[data.season]['low'].push(value.data_value);
            data_values[data.season]['high'].push(value.data_value);
          });
        });
      });

      let color_range = _.cloneDeep(active_layer.parameters.color_range);
      if (opts.invert_scale) {
        color_range.reverse();
      }

      _.each(active_layer.parameters.all_seasons, (name, season) => {
        let scale_h = d3.scaleQuantile().domain(data_values[season]['high']).range(color_range).quantiles();
        let scale_l = d3.scaleQuantile().domain(data_values[season]['low']).range(color_range).quantiles();

        if (opts.invert_scale) {
          scale_h.reverse();
          scale_l.reverse();
        }

        active_layer.parameters.metrics_ranges[season] = {
          'low': scale_l,
          'high': scale_h
        };
      });
    },
    onEachGeometry: (layer_data, active_layer, feature, layer) => {
      let p = active_layer.parameters.options;

      let colorize = RendererTemplates.ny_climate_data_colorize;

      try {
        let location_data = findDataForNYObservedData(layer_data,
                                               feature.properties.name,
                                               p.season,
                                               active_layer.parameters.years[p.year_indx],
                                              );

        feature.properties.location_data = location_data;

        let value = p.scenario === 'high' ? location_data.value.data_value : location_data.value.data_value;

        let color = colorize(active_layer.parameters.metrics_ranges[p.season][p.scenario],
                             value,
                             active_layer.parameters.color_range,
                             opts);

        layer.setStyle({fillColor: color, color: color});
      } catch( e) {
        feature.properties.location_data = null;

        console.log('failed to find value for ', p.metric,
                    "Feature Name:", feature.properties.name,
                    feature.properties.name,
                    "Available Names:", Object.keys(layer_data));
        let rgb = `transparent`;
        layer.setStyle({fillColor: rgb, color: rgb});
      }
    },

    parameters: {
      opacity: 100,
      color_range: opts.color_range,
      metrics_ranges: {},
      all_scenarios: {"high": "High", "low": "Low"},
      all_summaries: {
        "county": "County",
        "state": "State",
        "basin": "Drainage Basin",
        //"watershed": "HUC8 Watershed",
        //"6km": "6km Bounding Box",
      },
      all_seasons: {
        "yly": "Annual",
        /*
        "fall": "Fall",
        "winter": "Winter",
        "spring": "Spring",
        "summer": "Summer",
        */
      },
      years: [],
      options: {
        year_indx: 0,
        season: 'yly',
        summary: 'county',
        scenario: 'high'
      },
    }
  });
};

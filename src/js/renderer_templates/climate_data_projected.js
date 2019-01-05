var findDataForNYProjectedData = (layer_data, geom_feature, summary, season, year, scenario) => {
  let data_value = RendererTemplates.ny_match_geometry_and_data(layer_data, geom_feature, summary, season, year);
  if (!_.isEmpty(data_value)) {
    data_value.scenario = scenario;
  }
  return data_value;
};

RendererTemplates.ny_projected_climate_data = function (layer_id, opts) {
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
          {{#geojson.location_data}}
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
                      colspan='{{u.object_entries_count(active_layer.parameters.all_seasons) + 2}}'>
                        ` + opts.legend + ` </th>
                </tr>
                <tr>
                  <th> Season </th>
                  <th> Baseline (` + opts.legend_units + `)</th>
                  <th> Scenario </th>

                  {{#active_layer.parameters.years}}
                    <th> {{.}}s</th>
                  {{/active_layer.parameters.years}}
                </tr>
              </thead>
              <tbody>
                {{#u.sort_by(geojson.location_data.geometry_data.data, 'season')}}
                  <tr class="{{(season === geojson.location_data.season ? 'active-season' : '')}} {{(("high" == geojson.location_data.scenario) ? 'active-scenario' : '')}}">
                    <td rowspan='2'>{{u.capitalize(season)}}</td>
                    <td rowspan='2'>{{u.to_fixed(baseline, ${opts.legend_precision})}}</td>
                    <td> High </td>

                    {{#u.sort_by(values, 'year')}}
                      <td decorator="tooltip: Likely Range: {{range}} " class='{{((year === geojson.location_data.year) ? 'active-year' : '')}}'>
                      {{{u.add_sign(u.to_fixed(delta_high, ${opts.legend_precision}))}}}</td>
                    {{/sort_by(values, 'year')}}
                  </tr>

                  <tr class="{{(season === geojson.location_data.season ? 'active-season' : '')}} {{(("low" == geojson.location_data.scenario) ? 'active-scenario' : '')}}">

                    <td> Low </td>

                    {{#u.sort_by(values, 'year')}}
                      <td decorator="tooltip: Likely Range: {{range}} "
                          class='{{((year === geojson.location_data.year) ? 'active-year' : '')}}'>
                      {{{u.add_sign(u.to_fixed(delta_low, ${opts.legend_precision}))}}}</td>
                    {{/sort_by(values, 'year')}}
                  </tr>
                {{/u.sort_by(geojson.location_data.geometry_data.data, 'season')}}
              </tbody>
            </table>
          {{else}}
            <h4> No Climate Data For This Location</h4>
          {{/geojson.location_data}}
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
        {{parameters.years[parameters.options.year_indx]}}s
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
          signed: true,
          precision: '` + opts.legend_precision + `',
          colors: parameters.color_range} }}
        {{> map_color_block_legend_template }}
      {{/{metrics: parameters.metrics_ranges[parameters.options.season]}}
    `,
    data_url: "https://repository.nescaum-ccsc-dataservices.com/acis/ny/projected/?variable_name="+opts.variable_name,

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
            data_values[data.season]['low'].push(value.delta_low);
            data_values[data.season]['high'].push(value.delta_high);
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
        let location_data = findDataForNYProjectedData(layer_data,
                                               feature,
                                               p.summary,
                                               p.season,
                                               active_layer.parameters.years[p.year_indx],
                                               p.scenario
                                              );
        feature.properties.location_data = location_data;
        if (_.isEmpty(location_data)) {
          layer.setStyle({fillColor: 'rgba(30,30,30,0.2)', color: 'rgba(30,30,30,0.2)'});
        } else {
          let value = p.scenario === 'high' ? location_data.value.delta_high : location_data.value.delta_low;

          let color = colorize(active_layer.parameters.metrics_ranges[p.season][p.scenario],
                              value,
                              active_layer.parameters.color_range,
                              opts);

          layer.setStyle({fillColor: color, color: color});
        }
      } catch( e) {
        feature.properties.location_data = null;

        console.error(e);
        console.log('failed to find value for ', p.metric,
                    "Feature Name:", feature.properties.name,
                    feature.properties.name,
                    "Available Names:", Object.keys(layer_data));
      }
    },

    parameters: {
      opacity: 100,
      color_range: opts.color_range,
      metrics_ranges: {},
      all_scenarios: {"high": "High", "low": "Low"},
      all_summaries: {
        "county": "County",
        //"state": "State",
        //"basin": "Drainage Basin",
        "watershed": "Watershed",
        //"6km": "6km Bounding Box",
      },
      all_seasons: {
        "annual": "Annual",
        "fall": "Fall",
        "winter": "Winter",
        "spring": "Spring",
        "summer": "Summer",
      },
      years: [],
      options: {
        year_indx: 0,
        season: 'annual',
        summary: 'county',
        scenario: 'high'
      },
    }
  });
};

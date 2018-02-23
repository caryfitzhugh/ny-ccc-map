RendererTemplates.invasives = function (layer_id, opts) {
  let _huc8_to_imap = {
    "05010001": "Allegheny River",
    "04150101": "Black",
    "02030102": "Bronx River",
    "04120103": "Buffalo River",
    "02050104": "Canisteo River",
    "04120102": "Cattaraugus Creek",
    "04150102": "Chaumont_Perch",
    "05010002": "Chautauqua Lake",
    "02050102": "Chenango River",
    "02050105": "Cohocton River",
    "02040102": "East Branch Delaware River",
    "04150307": "English_Salmon",
    "04140201": "Finger Lakes",
    "04150304": "Grass",
    "04150303": "Indian",
    "02010004": "Lake Champlain",
    "04120101": "Lake Erie",
    "01100006": "Lower Byram River",
    "04130003": "Lower Genesee",
    "02040104": "Mid -Delaware River",
    "02020006": "Mid-Hudson River",
    "04140101": "Mid-Lake Ontario",
    "02020003": "Mid-Northern Hudson River",
    "04140102": "Mid-Northern Lake Ontario",
    "02020008": "Mid-Southern Hudson River",
    "02020004": "Mohawk River",
    "02020001": "Northern Hudson River",
    "02010006": "Northern Lake Champlain",
    "02030201": "Northern Long Island",
    "02040101": "Nothern Delaware River",
    "04140202": "Oneida",
    "04150302": "Oswegatchie",
    "04140203": "Oswego River",
    "04150305": "Raquette",
    "02020002": "Sacandaga Reservoir",
    "02020005": "Schoharie Creek",
    "02030101": "Southern Hudson River",
    "02010001": "Southern Lake Champlain",
    "02030202": "Southern Long Island",
    "04150306": "St.Regis",
    "02030104": "Staten Island",
    "01100005": "Still River",
    "02050103": "Susquehanna  River",
    "04120104": "Tonawanda Creek",
    "02050101": "Unadilla River",
    "04130002": "Upper Genesee",
    "02030103": "Upper Hackensack River",
    "04150301": "Upper St.Lawrence",
    "02020007": "Wallkill River",
    "05010004": "West Allegheny",
    "04130001": "West Lake Ontario",
  };

  let _url = opts.url;
  let _cache = null;
  let _get_opts =  (active_layer) => {
      let opts = _.pick(active_layer.parameters, ["species", "area"]);
      console.log("get opts", opts, active_layer.parameters);
      return opts;
    };

  let _colors = {};
  let _color_range = colorbrewer.YlOrRd[9];
  let _get_colors_for = (speci, area, data) => {
      let color = _.get(_colors, [speci, area])
      if (color) {
        return color;
      } else {
        let species_data = data[speci][area];
        color = d3.scaleQuantile();
        // Set different color ranges
        color = color.range(_color_range);

        // Get you all the counts of all the basin/county sectors
        let all_values = _.values(species_data);

        // This will set the domain to those extents
        color.domain(d3.extent(all_values));
        _.set(_colors, [speci, area], color);
        return color;
      }
  };

  let _process_data = (active_layer, data, geometries) => {
    let p = _get_opts(active_layer);
    let annotated_geometries = _.cloneDeep(geometries);

    let species = _.keys(data);

    /// Loop over all the basin_features.
    _.each(annotated_geometries.features, (feature) => {
      feature.properties.color_fn = _get_colors_for(p.species, p.area, data);
      feature.properties.area = p.area;
      feature.properties.species = p.species;

      if (p.area == 'watershed') {
        let cnt = data[p.species]['basin'][_huc8_to_imap[feature.properties.huc8]];
        if (!cnt) { console.log("Could not find", feature.properties.huc8) }
        feature.properties.data_count = cnt;
        feature.properties.name = feature.properties.name + " (" + feature.properties.huc8 + ")";//basin_name;
        active_layer.unmapped_basins = _.without(active_layer.unmapped_basins, _huc8_to_imap[feature.properties.huc8]);
      } else {
        let cnt = data[p.species]['county'][feature.properties.name];
        feature.properties.data_count = cnt;
      }
    });

    active_layer.parameters.all_species = species;
    return annotated_geometries;
  };

  RendererTemplates.geojson_polygons(layer_id, {
    parameters: {
      opacity: 95,
      species: opts.species,
      area : "county",
      all_areas: ['county', 'watershed']
    },
    pickle: (active_layer) => {
      delete active_layer.parameters.color_fn;
      delete active_layer.parameters.data_count;
    },
    get_opts: _get_opts,

    onEachPolygon: (active_layer, polygon, opacity) => {
      let p = _get_opts(active_layer);
      let count = polygon.feature.properties.data_count;
      let color_fn = polygon.feature.properties.color_fn;
      let style = {
        weight: 1,
        color: 'black',
        opacity: 0.3 + (0.7 * opacity),
        fillColor: 'rgba(0,0,0)',
        fillOpacity: 0
      };

      if (color_fn) {
        let color = color_fn(count);

        if (color) {
          style.fillColor = color;
          style.fillOpacity = opacity;
        }
      } else {
        console.log("No color set");
      }
      polygon.setStyle(style);
    },

    find_geojson_match: (active_layer, match) => {
      let p = _get_opts(active_layer);
      let count = match.feature.properties.data_count;
      return {count: count,
              area: match.feature.properties.name,
              geojson: true,
              species: active_layer.parameters.species};
    },

    load_data_url: (active_layer) => {
      return new Promise( (win, lose) => {
        let p = _get_opts(active_layer);
        GeometryLoader.load(p.area, function (error, geometries) {
          if (error) {
            console.log("Error!", error);
            lose();
          } else {
              if (_cache) {
                  win(_process_data(active_layer, _cache, geometries));
              } else {
                $.ajax({
                  cache: true,
                  dataType: "json",
                  url: _url,
                  success: function (data) {
                    _cache = data;
                    win(_process_data(active_layer, _cache, geometries));
                  },
                  error:   function (err) {
                    lose();
                  }
                });
              }
          }
        });
      });
    },
    info_template: `
        <div class='col-xs-2'>
          <label> {{name}} </label>
        </div>
        <div class='col-xs-10'>
        {{#geojson}}
          <div>
            Area: {{area}} {{parameters.area}} <br>
            Species: {{species}} <br>
            Number reported: {{count}} <br>
          </div>
        {{/geojson}}
        </div>
    `,
    legend_template: `
      <div class='detail-block show-confidence'>
        <label> Species: </label>
        <select style="max-width: 70%;" value='{{parameters.species}}'>
          {{#parameters.all_species}}
            <option value='{{this}}'> {{this}} </option>
          {{/parameters.all_species}}
        </select>
      </div>
      <div class='detail-block show-confidence'>
        <label> Area: </label>
        <select style="max-width: 70%;" value='{{parameters.area}}'>
          {{#parameters.all_areas}}
            <option value='{{this}}'> {{u.capitalize(this)}} </option>
          {{/parameters.all_areas}}
        </select>
      </div>

    `
  });
};

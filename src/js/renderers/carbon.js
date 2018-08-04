RendererTemplates.wms("carbon", {
  parameters: {
    opacity: 70,
    scenario_year: 'ny:biomass_b1_2050',
    options: {
      scenario_years: {
        'ny:biomass_a2_2010': "2010 - A2 (medium-high emissions)",
        'ny:biomass_a2_2050': "2050 - A2 (medium-high emissions)",
        'ny:biomass_b1_2050': "2050 - B1 (lower emissions)"
      },

    }
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    var scenario_year = active_layer.parameters.scenario_year;
    return  {
      layers: scenario_year,
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
      crs: L.CRS.EPSG4326,
      srs: L.CRS.EPSG4326
    };
  },
  get_feature_info_url: function (active_layer) {
    var scenario_year = active_layer.parameters.scenario_year;

    return CDN(GEOSERVER+"/wms" +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          "LAYERS="+scenario_year+"&"+
          "QUERY_LAYERS="+scenario_year+"&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>");
  },
  legend_template: `
    <div class='detail-block show-confidence carbon'>
      <label> Year / Scenario: </label>
      <select value='{{parameters.scenario_year}}'>
        <option value='ny:biomass_a2_2010'>
          2010 - A2 (medium-high emissions)
        </option>
        <option value='ny:biomass_a2_2050'>
          2050 - A2 (medium-high emissions)
        </option>
        <option value='ny:biomass_b1_2050'>
          2050 - B1 (lower emissions)
        </option>
      </select>
    </div>
    <div class='detail-block legend-url-text carbon'>
      <span class='legend-text'>
        grams C per m<sup>2</sup>
      </span>
    </div>
    <div class='detail-block legend-url-text'>
      <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=" + parameters.scenario_year+"&format=image/png")}}/>
    </div>
  `,
  info_template: `
    <div class='col-xs-2'>
      <label> {{name}} </label>
    </div>
    <div class='col-xs-10'>
      {{#json.features}}
        <div>
          Value: {{properties.GRAY_INDEX}}
        </div>
      {{/json.features}}
    </div>
  `
});

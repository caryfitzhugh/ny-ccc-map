(function () {
  let _years = [
      5,
      10,
      20,
      50,
      100,
      200,
      500,
      1000,
  ];
  let _rises = [
      0,
      6,
      12,
      18,
      24,
      30,
      36,
      48,
      60,
      72];

  RendererTemplates.wms('nyserda_slr', {
    parameters: {
        opacity: 100,
        rise: _rises[0],
        year: _years[0],
        options:{
          rises: _rises,
          years: _years
        }

      },
    url: CDN("http://ciesin.columbia.edu/geoserver/nyserda/wms"),
    wms_opts: (active_layer) => {
        var rise = active_layer.parameters.rise;
        var year = active_layer.parameters.year;
        return {
          layers: "nyserda:flood_"+_.padLeft(rise, 2, '0') +"_"+_.padLeft(year, 4, '0'),
          format: 'image/png',
          opacity: 0,
          zIndex: -1,
          crs: L.CRS.EPSG4326,
          srs: L.CRS.EPSG4326,
          transparent: true
        };
    },
    'legend_template': `
      <div class='detail-block show-confidence'>
          <label decorator='tooltip:Use slider to select sea level (inches above mean higher high water)'> Sea Level: </label>
          <select value='{{parameters.rise}}'>
            {{#parameters.options.rises}}
              <option value={{.}}>{{.}} inches</option>
            {{/parameters.options.rises}}
          </select>
        </div>
        <div class='detail-block show-confidence'>
          <label decorator='tooltip:Choose a storm return period'> Storm Return: </label>
          <select value='{{parameters.year}}'>
            {{#parameters.options.years}}
              <option value={{.}}>{{.}} year</option>
            {{/parameters.options.years}}
          </select>
        </div>
        <div class='detail-block'>
          <label>Legend</label>
          <img src="./img/legends/nyserda_slr.jpg"/>
        </div>
    `
  });
})();

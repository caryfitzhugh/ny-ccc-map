(function () {
  let _legend_data = [
      {
      "label": "Current Sea Level",
      "url": "eb79a6a4c8c41af16e3da3e5a016f773",
      "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAEtJREFUOI1jYaAyYGFgYGBgYJf/T7FJPx8yIgykBmCX/8/w8yEjqoFuM8kzbFc6nEk9F44aOGrgqIHD2ECkUoM6BlICUApYKIcaAABK1g0oRy3dqQAAAABJRU5ErkJggg==",
      "contentType": "image/png",
      },
      {
        "label": "Predicted Sea Level",
        "url": "282365f8fa642491daa9ffee493361ea",
        "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAE1JREFUOI1jYaAyYGFgYGBgcEj7T7FJB2YxIgykBnBI+89wYBYjioEqaZVkmXVnVjucTT0Xjho4auCogcPXQORSgyoGUgRQClgohxoAAAemDgT4LaMAAAAAAElFTkSuQmCC",
        "contentType": "image/png",
        "height": 20,
        "width": 20
      },
    ];

  RendererTemplates.esri('dewberry_sea_level_rise', {
    parameters: {
      opacity: 70,
      rise: 0,
      year: 0,
      legend_data: _legend_data,
      options: {
        years: {
          0: '10 year',
          1: '50 year',
          2: '100 year',
          3: '500 year'
        },
        rises: {
          0: "0 Inches",
          1: "12 inches",
          2: "18 inches",
          3: "24 inches",
          4: "36 inches",
          5: "48 inches",
          6: "60 inches",
          7: "72 inches",
        }
      }
    },
    clone_layer_name: function (active_layer) {
      var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
      var rise = active_layer.parameters.rise;
      var year = active_layer.parameters.year;
      var name =  layer_default.name + " Rise:" + rise+ " Year:" + year;
      return name;
    },
    esri_opts: (active_layer) => {
      var rise = active_layer.parameters.rise;
      var year = active_layer.parameters.year;
      var risenum= rise*4;
      var yearnum=+year;
      var layer_array= [34+risenum+yearnum,67+risenum+yearnum,100+risenum+yearnum];

      return {
          url: CDN("http://services.nyserda.ny.gov/arcgis/rest/services/NYSERDA_SLR_Viewer/MapServer"),
          // No longer defaults to image, but JSON
          layers: layer_array,
          f:"image",
          format:"png8",
          opacity: 0,
          zIndex: -1,
          attribution: 'Dewberry Sea Level Rise (SLR)'};
    },
    legend_template: `
      <div class='detail-block sea-level'>
        <label decorator='tooltip:Use slider to select sea level (feet above mean higher high water)'> Sea Level: </label>
        <input type="range"
              min="0"
              max="{{u.number_of_keys(parameters.options.rises) - 1}}"
              value="{{parameters.rise}}">
        <span> {{parameters.options.rises[parameters.rise]}} </span>
      </div>
      <div class='detail-block'>
        <label decorator='tooltip:Use slider to select storm return'> Storm Return: </label>
        <select value='{{parameters.year}}'>
          {{#u.to_sorted_values_from_hash(parameters.options.years)}}
            <option value='{{key}}'>{{value}}</option>
          {{/u.to_sorted_values_from_hash(parameters.options.years)}}
        </select>
      </div>

      <div class='detail-block sea-level'>
        <label decorator='tooltip:Use slider to select storm return'> Legend: </label>
        {{#parameters.legend_data}}
          <div class=''>
            <img src="data:{{contentType}};base64,{{imageData}}" class='cube'/>
            <span>{{label}}</span>
          </div>
        {{/parameters.legend_data}}
      </div>
    `
  });
})();

(function () {
  let _legend_data = {
    'slr': [
      {"label": "Low-lying Areas", "imageData":  "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADFJREFUOI1jYaAyYKGZgaH/Gf5TYtBqRgZGFAOpBUYNHDVw1MBRA+lsIKw8o5qB1AIAREsD/qXn0TcAAAAASUVORK5CYII=", "contentType": "image/png"},
      { "label": "Deep", "url": "75297640e0328adb91c5043fdb2da9f6", "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAFRJREFUOI3N0sENwCAMBMGLORvetJGqU2ckoIl94AJGJ6396tsCz6kgPVk02PGFnQYnDVZjwRow2AyDGtdXLhiMpBfSUZbxhQ8LRtKPTYNBR/nhKAfGVATCm4CufAAAAABJRU5ErkJggg==", "contentType": "image/png", "height": 20, "width": 20 },
      { "label": "", "url": "fb23e54840a8e44a8f340dfc35746833", "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAFhJREFUOI2t1AENwEAIQ9EelJ6yaZncE7Qsm4mPgBeaEnzd5xM4lpv0ZKVY8BkYfANH7obBoiOr8VLoszG84Rj15N2LBcODqCcPvSEP0i2n4DuE/6scOPIPnH8GX6OI2SAAAAAASUVORK5CYII=", "contentType": "image/png", "height": 20, "width": 20 },
      { "label": "Shallow", "url": "aff5b949562089841a6ad19cd52c833b", "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAEtJREFUOI3Nk0ERACAMwwoLovGFLDyAiTw2Abld2rLPfREPpolLKIYLXKXywiz5w7IdojtE5QXaO1y2Q+we6sD+09N7qG/ZD6U78ANTnwPz39fdJgAAAABJRU5ErkJggg==", "contentType": "image/png", "height": 20, "width": 20 }
    ],
    'conf': [
      { "label": "Low Confidence", "url": "b5c3ee43c73775a8b49e866126d69b44", "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADlJREFUOI1jYaAyYKGlgf+pYB4jigv/r6TApHAITVMvjxo4auCogaMGYjcQVgSRCRjRDWSkyDgoAAB8swOrTPh0KQAAAABJRU5ErkJggg==", "contentType": "image/png", "height": 20, "width": 20 },
      { "label": "High Confidence", "url": "d52c8cf8f3602499ba27244fc7989e41", "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jqgujn5Fv1FIpBgYGGnt51MBRA0cNHDUQh4HQIohMwIhuICMlpsEAAJ4ABBIZrV6vAAAAAElFTkSuQmCC", "contentType": "image/png", "height": 20, "width": 20 }
    ]
  };
  RendererTemplates.esri('noaa_sea_level_rise', {
    parameters: {
      opacity: 70,
      sea_level_height: 0,
      display_layer : "slr", // conf
      legend_data: _legend_data
    },
    esri_opts: (active_layer) => {
      var rise = active_layer.parameters.sea_level_height;
      var view = active_layer.parameters.display_layer;

      return {
        url: CDN("https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/"+view+"_"+rise+"ft/MapServer/tile"),
        // No longer defaults to image, but JSON
        f:"image",
        opacity: 0,
        zIndex: -1,
        attribution: 'NOAA Sea Level Rise (SLR)'
      };
    },
    legend_template: `
      <div class='detail-block sea-level'>
        <label decorator='tooltip:Use slider to select sea level (feet above mean higher high water)'> Sea Level: </label>
        <input type="range"
              min="0"
              max="6"
              value="{{parameters.sea_level_height}}">
        <span> {{parameters.sea_level_height}} ft. </span>
        <div style='margin-left: 25%' >Feet above Mean Height High Water</div>
      </div>

      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Display modeled sea level or model confidence'> Display: </label>
        <select value={{parameters.display_layer}}>
          <option value="slr"> Sea Level</option>
          <option value="conf"> Confidence</option>
        </select>
      </div>

      <div class='detail-block lulc'>
        {{#parameters.legend_data[parameters.display_layer]}}
          <div class=''>
            <img src="data:{{contentType}};base64,{{imageData}}" class='cube'/>
            <span>{{label}}</span>
          </div>
        {{/parameters.legend_data[parameters.display_layer]}}
      </div>
    `
  });
})();

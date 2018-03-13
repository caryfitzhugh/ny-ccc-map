(function () {
  // http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_toolkit/MapServer/legend?dynamicLayers=208&f=pjson
  let _legend_data = [
    {"label": "Coverage area - Zoom in to see details", "imageData":  "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAGJJREFUOI3t1EEKgDAMBMB0yc9K32X+VfK11YuW1oNg40m6pyWEIaeofBy9CkmLQACsgSe2JfdpkKQAsHZhchcpZU6rtVV9WJvKAhe4wD+C3dd4kz3nEQRgJAN33R5sP4jmAJKYGEcjsXAtAAAAAElFTkSuQmCC", "contentType": "image/png"},
    {"label": "High Risk - Floodway", "imageData":  "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAH5JREFUOI211MENwCAIBdBP0jVczeFczUHooT2UAib0W44oL/+AHthcx2+gAvo+lDHDIe3N9QQQA1LYmMDdD8Ey9igHMpgDWcyAOzCXkMWWYAXT3q6dycAqtkzIYA5kMQPuwFxCFkvBKrZ8y5+wLCGLGVAAQTYYdoHo/vYf+wS600fTP7m0hwAAAABJRU5ErkJggg==", "contentType": "image/png"},
    {"label": "High Risk", "imageData":  "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAC9JREFUOI1jYaAyYKGdgYse/6fIpDhZRlQDqQRGDRw1cNTAUQPpbSC0PKOegVQCADCrA81JwUxoAAAAAElFTkSuQmCC", "contentType": "image/png"},
    {"label": "Moderate Risk", "imageData":  "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADFJREFUOI1jYaAyYKGZgd+nqvynxCDO7DuMKAZSC4waOGrgqIGjBtLZQFh5RjUDqQUAIocFoingXccAAAAASUVORK5CYII=", "contentType": "image/png"},
  ];

  RendererTemplates.esri('national_flood_hazard', {
    parameters: {
      opacity: 80,
      legend_data: _legend_data,
    },
    esri_opts: {
      url: CDN("https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer"),
      layers: [ 0, 16, 28, ],
      f:"image",
      clickable: false,
      attribution: 'FEMA'
    },

    legend_template: `
        <div class='detail-block lulc'>
          {{#parameters.legend_data}}
            <div class=''>
              <img src="data:{{contentType}};base64,{{imageData}}" class='cube'/>
              <span>{{label}}</span>
            </div>
          {{/legend_data}}
        </div>
    `
  });
})();

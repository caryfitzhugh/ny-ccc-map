(function () {
  RendererTemplates.esri('sandy_surge', {
    parameters: {
      opacity: 70,
      resolution: "0"
    },
    on_layer_create: (active_layer) => {
        var vhr =   { c: "rgb(116, 178, 255)",
            v: null,
            s: "Very High Resolution (1m)"};

        var hr =   { c: "rgb(41, 59, 97)",
            v: null,
            s: "High Resolution (3m)"};

        active_layer.parameters.legend_range = []
        if (active_layer.parameters.resolution === "0") {
          active_layer.parameters.legend_range = [vhr, hr];
        } else if (active_layer.parameters.resolution === "1") {
          active_layer.parameters.legend_range = [vhr];
        } else {
          active_layer.parameters.legend_range = [hr];
        }
        Views.ControlPanel.fire("tile-layer-loaded", active_layer);
    },
    esri_opts: (active_layer) => {
      let layers = [active_layer.parameters.resolution];

      return {
        url: CDN("http://services.femadata.com/arcgis/rest/services/2012_Sandy/SurgeBoundaries_Final_0214/MapServer"),
        layers: layers,
        f:"image",
        format: "png8",
        transparent: true,
        dpi: 96,
        clickable: false,
        attribution: 'FEMA'
      };
    },
    legend_template: `
      <div class='detail-block show-confidence'>
        <label> Resolution: </label>
        <select style="max-width: 70%;" value='{{parameters.resolution}}'>
          <option value='0'> Final Extent</option>
          <option value='1'> Very High Resolution (1m)</option>
          <option value='2'> High Resolution (3)</option>
        </select>
      </div>
      <div class='detail-block legend'>
        <div class='color-legend'>NYC Surge Area (Field verified Feb 2013)</div>

        {{#parameters.legend_range}}
          <div class='color-block' style="width: {{100.0 / parameters.legend_range.length}}%;">
            <svg width="100" height="100">
              <rect height="100" width="100" style="fill: {{c}}; opacity:{{(0.7 * parameters.opacity / 100.0) + 0.3}}; "/>
            </svg>
            {{#if v}}
              <label>{{fixed_precision(v, parameters.legend_significant_digits)}}</label>
            {{/if v}}

            {{#if s}}
              <label>{{s}} </label>
            {{/if s}}
          </div>
        {{/parameters.legend_range}}
      </div>
    `,

    info_template: `
        <div class='col-xs-2'>
          <label> {{name}} </label>
        </div>
        <div class='col-xs-10'>
          {{#json.results}}
            <div>
              State: {{value}} <br>
              Status: {{attributes.Status}} <br>
              DEM Source: {{attributes.DEMSource}} <br>
              Comments: {{attributes.Comments}} <br>
              Source Data: {{attributes.SourceData}} <br>
            </div>
          {{/json.results}}
        </div>
    `
  });
})();

RendererTemplates.wms("cfem_critical", {
  parameters: {
    opacity: 100,
    //layers: "0,1,2,3,4,5,6,7,8,9",
    layers: "0,7,8",
    options: {
    }
  },

  url: CDN("https://maps.coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CriticalFacilities/MapServer/WMSServer"),

  wms_opts:(active_layer) => {
    return  {
      layers: active_layer.parameters.layers,
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_xml_url: function (active_layer) {
    return CDN(
      "https://maps.coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CriticalFacilities/MapServer/WMSServer"+
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          "LAYERS="+active_layer.parameters.layers+"&"+
          "QUERY_LAYERS="+active_layer.parameters.layers+"&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=application%2Fjson&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>");
  },
  legend_template: `
      <div class='detail-block show-confidence'>
        <img src={{CDN(
          "https://maps.coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CriticalFacilities/MapServer/WMSServer"+
          "?request=GetLegendGraphic&LAYER=ny:aadt&format=image/png")}}/>
      </div>
  `,
  info_template: `
    <div class='row'>
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class="table">
          <tr>
						<th>Type</th>
						<th>Name</th>
            <th>Address</th>
          </tr>
          {{#u.uniq_on_prop(xml_output, "Name")}}
            <tr>
              <td>{{FCode}}</td>
              <td>{{Name}}</td>
              <td>{{Address}} {{City}} {{State}}</td>
            </tr>
          {{/u.uniq_on_prop(xml_output, "Name")}}
        </table>
      </div>
    </div>
  `
});

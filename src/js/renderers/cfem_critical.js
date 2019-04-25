RendererTemplates.wms("cfem_critical", {
  parameters: {
    opacity: 100,
    layers: "9", //21", //0,1,2,3,4,5,6",
    //layers: "0,7,8",
    options: {
    }
  },

  url: CDN("https://coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CoastalFloodHazardComposite/MapServer/WmsServer"),
  wms_opts:(active_layer) => {
    return  {
      layers: active_layer.parameters.layers,
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
      crs: L.CRS.EPSG4326,
      srs: L.CRS.EPSG4326
    };
  },
  get_feature_info_xml_url: function (active_layer) {
    return CDN(
      "https://coast.noaa.gov:443/arcgis/services/FloodExposureMapper/CFEM_CoastalFloodHazardComposite/MapServer/WmsServer"+
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          "LAYERS="+active_layer.parameters.layers+"&"+
          "QUERY_LAYERS="+active_layer.parameters.layers+"&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=1000&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "SRS=EPSG%3A4326&"+
          "CRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>");
  },
  legend_template: `
      <div class='detail-block show-confidence'>
        <img src={{CDN("https://coast.noaa.gov:443/arcgis/services/FloodExposureMapper/CFEM_CoastalFloodHazardComposite/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0")}}/>
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
						<th>Hazard Number</th>
						<th>Description</th>
          </tr>
          {{#u.uniq_on_prop(xml_output, "OBJECTID")}}
            <tr>
              <td>{{HAZ_NUM}}</td>
              <td>{{{DESCRPTN}}}</td>
            </tr>
          {{/u.uniq_on_prop(xml_output, "Name")}}
        </table>
      </div>
    </div>
  `
});

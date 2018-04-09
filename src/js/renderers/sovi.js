RendererTemplates.wms("sovi", {
  parameters: {
    opacity: 100,
  },
  url: CDN("https://coast.noaa.gov/arcgis/services/sovi/sovi_tracts2010/MapServer/WMSServer?"),

  wms_opts:(active_layer) => {
    return  {
      layers: '10,41',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      crs: L.CRS.EPSG4326,
      srs: L.CRS.EPSG4326,
      transparent: true,
    };
  },
  get_feature_info_xml_url: function (active_layer) {
    return CDN("https://coast.noaa.gov/arcgis/services/sovi/sovi_tracts2010/MapServer/WMSServer?") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          // NOT SURE ON LAYERS?
          "LAYERS=41&"+
          // NOT SURE ON LAYERS?
          "QUERY_LAYERS=41&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=application%2Fjson&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  },
  legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
        <br/>
        <img src={{CDN("https://coast.noaa.gov/arcgis/services/sovi/sovi_tracts2010/MapServer/WMSServer?service=wms&version=1.1.1&request=GetLegendGraphic&format=image/png&layer=10,41&WIDTH=300&HEIGHT=150")}}>
      </div>
  `,
  info_template: `
    <div class='col-xs-2'>
      <label> {{name}} </label>
    </div>
    <div class='col-xs-10'>
      <table class="table">
                  <tr>
                    <th> Census Tract </th>
                    <th> % Asian </th>
                    <th> % Black </th>
                    <th> % Hispanic </th>
                    <th> % Native American </th>
                    <th> Median Age </th>
                    <th> % Poverty</th>
                    <th> Per Capita </th>
                  </tr>
                  {{#xml_output}}
                    <tr>
                      <td>{{{NAME10}}} </td>
                      <td>{{{(QASIAN * 1.0).toFixed(2)}}} </td>
                      <td>{{{(QBLACK * 1.0).toFixed(2)}}} </td>
                      <td>{{{(QHISP * 1.0).toFixed(2)}}} </td>
                      <td>{{{(QNATAM * 1.0).toFixed(2)}}} </td>
                      <td>{{{(MEDAGE * 1.0).toFixed(2)}}}</td>
                      <td>{{{(QPOVTY * 1.0).toFixed(2)}}} </td>
                      <td>{{{(PERCAP * 1.0).toFixed(0)}}} </td>
                    </tr>
                  {{/xml_output}}
                </table>

    </div>
  `
});

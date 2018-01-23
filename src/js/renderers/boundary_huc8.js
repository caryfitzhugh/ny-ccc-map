RendererTemplates.wms("boundary_huc8", {
  parameters: {
    opacity: 100,
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts:(active_layer) => {
    return  {
      layers: 'ny:huc8',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      crs: L.CRS.EPSG4326,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/wms" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=ny:huc8&"+
              "QUERY_LAYERS=ny:huc8&"+
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
      <div class='detail-block show-confidence'>
        <img src={{CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=ny:huc8&format=image/png")}}>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class="table">
          <tr>
            <th>Name</th>
            <th>HUC8 Reachcode</th>
            <th>Shapefile Link</th>
            <th></th>
            <th></th>
          </tr>
          {{#json.features}}
            <tr>
              <td>{{properties.name}}</td>
              <td>{{properties.huc8}}</td>
              <td><a target='_blank'
                href="ftp://ftp.horizon-systems.com/NHDPlus/NHDPlusV1/NHDPlusExtensions/Subbasins/NHDPlus02/NHDPlus{{properties.huc8}}.zip">Shapefile(s)</a></td>
              <td></td>
              <td></td>
            </tr>
          {{/json.features}}
        </table>
      </div>
  `
});

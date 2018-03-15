RendererTemplates.wms("national_land_cover_dataset", {
  parameters: {
    opacity: 70,
    legend_url: CDN("http://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WmsServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=1&FORMAT=image/gif&SCALE=55467893.20400156")
  },

  url: CDN("http://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WmsServer?"),
  wms_opts: {
    crs: L.CRS.EPSG4326,
    srs: L.CRS.EPSG4326,
    layers: 33,
    format: 'image/png',
    opacity: 0,
    zIndex: -1,
    transparent: true },

  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER+
          "/wms"+
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          "LAYERS=ny:aadt&"+
          "QUERY_LAYERS=ny:aadt&"+
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
        <img src={{parameters.legend_url}}/>
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
            <th>Name</th>
            <th>AADT Type</th>
            <th>Avg. Cars/Day</th>
            <th>Data Link</th>
          </tr>
          {{#json.features}}
            <tr>
              <td>{{properties.tdv_route}}</td>
              <td>{{properties.aadt_type}}</td>
              <td>{{properties.aadt}}</td>
              <td><a target='_blank'
                href="{{properties.vol_url1}}">PDF Report</a></td>
            </tr>
          {{/json.features}}
        </table>
      </div>
    </div>
  `
});

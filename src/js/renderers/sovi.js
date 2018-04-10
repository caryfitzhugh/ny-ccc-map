(function() {
  let _url = CDN("https://coast.noaa.gov/arcgis/services/sovi/sovi_tracts2010/MapServer/WMSServer");
  let _legend_data = [
    {
     "label": "High",
     "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHNJREFUOI3t1LENwCAMBEDrlTJiA0TnadgpHopp6KJsgFK/UgWFFqgivrJcnL76TSZnew+SNgIBsAqStPu6jpJzF+ZUhaQAsNqw5CxnjF1gSEl276U2nJkFLnCBPwOdqoSUuhCn2oIAjGSdoJ40A/t9jOYBMMcefTVHWBkAAAAASUVORK5CYII=",
     "contentType": "image/png",
    },
    {
     "label": "Medium",
     "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHlJREFUOI3t1CEOgDAQBMDLhlCLIqGm/+kz+Aj3Ep7BfzCQoLBFbFA0YA8U6arLicmqreTjVNdBUt9AADSDJPXY1iEtswlzPghJAaC5YVpm2afRBDaxl7rtJDf8MgUsYAF/BjofpIm9CXE+PEEASjJPkCWPgb0/3uYEDvAdh2ixOZQAAAAASUVORK5CYII=",
     "contentType": "image/png",
    },
    {
     "label": "Low",
     "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHFJREFUOI3tlDEKgDAQBI81lQFJ6Q/yTO+b/sAyCApCXKwMpk1SSaY6rhimWiONMe9BUmtEADQJSep97ks8QlmVdUJSAGgqjEeQa1vL8mYvwzhJKmxJF3ZhF/5MaKwTmX2ZxLpcCEBJpgkqIRvY76OWBxg1HMjNCS0wAAAAAElFTkSuQmCC",
     "contentType": "image/png",
    }
   ];

  RendererTemplates.wms("sovi", {
    parameters: {
      opacity: 100,
      legend_data: _legend_data,
    },

    url:  _url,

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
      return _url +
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
        <div class='detail-block sovi'>
          {{#parameters.legend_data}}
            <div class=''>
              <img src="data:{{contentType}};base64,{{imageData}}" class='cube'/>
              <span>{{label}}</span>
            </div>
          {{/legend_data}}
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
})();

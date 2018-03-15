var GeometryLoader ={
  load: function (name, callback, error_cb) {
    var paths = {
      "county": CDN("http://api.nescaum-ccsc-dataservices.com/ny.counties.json"),
      "basin": CDN("http://api.nescaum-ccsc-dataservices.com/ny.basins.topojson"),
      "watershed": CDN("http://repository.nescaum-ccsc-dataservices.com/data/ny/watershed.json")
    };
    if (GeometryLoader.cache[name]) {
      callback(null, GeometryLoader.cache[name]);
    } else {
      d3.json(paths[name], function (error, geometries) {
        if (error) {
          callback(error, null);
        } else {
          if (geometries.type === "Topology") {
            geometries = topojson.feature(geometries, geometries.objects[name]);
          }
          GeometryLoader.cache[name] = geometries;
          callback(null, GeometryLoader.cache[name]);
        }
      });
    }
  },
  cache: {}
};

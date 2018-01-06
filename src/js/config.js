var getParameterByName = function(name) {
  // This test is for the meta_data pre_processing
  if (typeof window !== "undefined") {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  } else {
    return null;
  }
};

function stringify(obj) {
  function flatten(obj) {
    if (_.isObject(obj)) {
      return _.sortBy(_.map(
          _.pairs(obj),
          function(p) { return [p[0], flatten(p[1])]; }
        ),
        function(p) { return p[0]; }
      );
    }
    return obj;
  }
  return JSON.stringify(flatten(obj));
}

var Config = {
  defaults: {
   // https://www.maptechnica.com/state-map/NY (only via google results though! haha)
   "bounding-box": [-79.76259, 45.015865, -71.777491 , 40.477399],
  },
  // If you want to SKIP the CDN, add this query parameter.
  skip_cdn: getParameterByName("cdn") === "disable"
};

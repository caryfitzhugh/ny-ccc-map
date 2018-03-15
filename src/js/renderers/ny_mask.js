(function() {
  let _url = CDN("http://repository.nescaum-ccsc-dataservices.com/data/ny/ny_mask.topojson");
  let _cache = {};
  RendererTemplates.geojson_polygons('ny_mask', {
    parameters: {
      opacity: 80,
      fixed_z_index: 5000, // Set this to 5000 if you want markers on top. Or 15000 if you want markers under.
      no_sorting: true,
      style: {
        weight: 1,
        //"stroke-opacity": 1,
        color: "#111111",
        //"fill-opacity": 0.5,
      }
    },
    url: _url,
    onEachPolygon: (active_layer, polygon, opacity) => {
      polygon.setStyle(_.merge({opacity: opacity}, active_layer.parameters.style));
    }
  });
})();

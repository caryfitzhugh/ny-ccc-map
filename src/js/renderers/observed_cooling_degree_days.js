RendererTemplates.ny_observed_climate_data("observed_cooling_degree_days", {
  title: "Cooling Degree Days",
  legend: "Observed Cooling Degree-Days",
  legend_precision: 0,
  legend_units: "Degree-Days",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/cooldegdays.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=cdd",
  color_range: colorbrewer.Blues[6]
});

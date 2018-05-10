RendererTemplates.ny_observed_climate_data('observed_avg_temp', {
  title: "Average Temperature",
  legend: "Observed Average Temp. (&deg;F)",
  legend_units: " &deg; F",
  legend_precision: 1,
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/avgtemp.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=avgt",
  color_range: colorbrewer.OrRd[6]
});

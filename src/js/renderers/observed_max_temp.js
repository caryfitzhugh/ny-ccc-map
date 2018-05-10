RendererTemplates.ny_observed_climate_data('observed_max_temp', {
  title: "Maximum Temperature",
  legend: "Observed Max Temp. (&deg;F)",
  legend_precision: 1,
  legend_units: " &deg;F",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/maxtemp.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=maxt",
  color_range: colorbrewer.OrRd[6]
});

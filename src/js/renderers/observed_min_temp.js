RendererTemplates.ny_observed_climate_data('observed_min_temp', {
  title: "Minimum Temperature",
  legend: "Observed Min Temp. (&deg;F)",
  legend_precision: 1,
  legend_units: " &deg;F",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/mintemp.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=mint",
  color_range: colorbrewer.OrRd[6]
});

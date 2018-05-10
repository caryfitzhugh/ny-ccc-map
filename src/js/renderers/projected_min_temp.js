RendererTemplates.ny_projected_climate_data('projected_min_temp', {
  title: "Minimum Temperature",
  legend: "Projected change in minimum temperature (&deg;F)",
  legend_precision: 1,
  legend_units: " &deg;F",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/mintemp.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climatedeltas.php?parameter=mint",
  color_range: colorbrewer.OrRd[6]
});

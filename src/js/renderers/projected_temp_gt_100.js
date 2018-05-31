RendererTemplates.ny_projected_climate_data("projected_temp_gt_100", {
  title: "Days > 100&deg;F",
  legend: "Projected change in # days above 100&deg;F",
  legend_precision: 1,
  legend_units: " Days ",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/tempgt100.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climatedeltas.php?parameter=maxt_gt_100",
  color_range: colorbrewer.OrRd[6]
});

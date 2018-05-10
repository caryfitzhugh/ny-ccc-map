RendererTemplates.ny_observed_climate_data("observed_temp_gt_95", {
  title: "Days > 95 &deg;F",
  legend: " Days above 95 &deg;F",
  legend_precision: 1,
  legend_units: "days",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/tempgt95.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=maxt_gt_95",
  color_range: colorbrewer.OrRd[6]
});

RendererTemplates.ny_observed_climate_data('observed_temp_lt_0', {
  title: "Days Below 0 &deg;F ",
  legend: " Days below 0 &deg;F",
  legend_precision: 1,
  legend_reverse: true,
  legend_units: "days",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/templt0.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=mint_lt_0",
  color_range: colorbrewer.Blues[6],
  invert_scale: false
});

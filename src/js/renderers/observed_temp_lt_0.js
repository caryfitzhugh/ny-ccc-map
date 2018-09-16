RendererTemplates.ny_observed_climate_data('observed_temp_lt_0', {
  title: "Days Below 0 &deg;F ",
  legend: " Days below 0 &deg;F",
  legend_precision: 1,
  legend_reverse: true,
  legend_units: "days",
  variable_name: "mint_lt_0",
  color_range: colorbrewer.Blues[6],
  invert_scale: false
});

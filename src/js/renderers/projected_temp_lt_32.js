RendererTemplates.ny_projected_climate_data('projected_temp_lt_32', {
  title: "Days Below 32 &deg;F ",
  legend: " Projected change in # days below 32 &deg;F",
  legend_precision: 1,
  legend_units: "days",
  variable_name: "mint_lt_32",
  color_range: colorbrewer.Blues[6],
  invert_scale: true
});

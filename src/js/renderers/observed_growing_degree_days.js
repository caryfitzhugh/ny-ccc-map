RendererTemplates.ny_observed_climate_data("observed_growing_degree_days", {
  title: "Growing Degree Days",
  legend: "Growing Degree-Days (Observed)",
  legend_precision: 0,
  legend_units: "Degree-Days",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=gdd",
  color_range: colorbrewer.Greens[6],
});

RendererTemplates.ny_observed_climate_data('observed_precip_gt_2', {
  title: " Precipitation &gt; 2\"",
  legend: " Days with precipitation &gt; 2\" ",
  legend_precision: 2,
  legend_units: "days",
 // data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=precipgt2",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=pcpn_gt_2",
  color_range: colorbrewer.Purples[5]
});

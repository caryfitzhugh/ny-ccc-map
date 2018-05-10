RendererTemplates.ny_observed_climate_data('observed_precip_gt_4', {
title: " Precipitation &gt; 4\"",
  legend: " Observed # Days with precipitation &gt; 4\" ",
  legend_precision: 2,
  legend_units: "days",
  //data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=precipgt4",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=pcpn_gt_4",
  color_range: colorbrewer.Purples[5]
});

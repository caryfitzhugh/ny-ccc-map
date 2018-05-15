RendererTemplates.ny_projected_climate_data('projected_precip_gt_4', {
title: " Precipitation &gt; 4\"",
  legend: " Projected change in # Days with precipitation &gt; 4\" ",
  legend_precision: 2,
  legend_units: "days",
  data_url: "https://adirondackatlas.org/api/v1/ny_climatedeltas.php?parameter=pcpn_gt_4",
  color_range: colorbrewer.Purples[5]
});
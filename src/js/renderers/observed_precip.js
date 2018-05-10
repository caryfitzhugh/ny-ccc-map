RendererTemplates.ny_observed_climate_data('observed_precip', {
  title: "Total Precipitation",
  legend: " Total Precipitation (inches)",
  legend_precision: 1,
  legend_units: "inches",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/precip.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climateobs.php?parameter=pcpn",
  color_range: colorbrewer.Blues[7]
});

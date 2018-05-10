RendererTemplates.ny_projected_climate_data("projected_growing_degree_days", {
  title: "Growing Degree Days",
  legend: "Projected change in Growing Degree-Days",
  legend_precision: 0,
  legend_units: "Degree-Days",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/growdegdays.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climatedeltas.php?parameter=gdd",
  color_range: colorbrewer.Greens[6],
});

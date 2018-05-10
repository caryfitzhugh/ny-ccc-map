RendererTemplates.ny_projected_climate_data("projected_heating_degree_days", {
  title: "Heating Degree Days",
  legend: "Projected change in Heating Degree-Days",
  legend_precision: 0,
  legend_units: "Degree-Days",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/heatdegdays.json",
  data_url: "https://adirondackatlas.org/api/v1/ny_climatedeltas.php?parameter=hdd",
  color_range: colorbrewer.OrRd[6]
});

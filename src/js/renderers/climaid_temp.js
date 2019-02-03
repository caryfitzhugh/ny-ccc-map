RendererTemplates.climaid('climaid_temp', {
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ny/climaid_temp_deltas.json",
  title: "CLIMAID Temperature Change",
  legend: "Temperature Change (&deg; F)",
  legend_units: " &deg;F ",
  legend_precision: 2,
  color_range: {positive: colorbrewer.YlOrRd[9],
                negative: _.cloneDeep(colorbrewer.Blues[9]).reverse()}
});

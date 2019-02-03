RendererTemplates.climaid('climaid_precip', {
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ny/climaid_precip_deltas.json",
  title: "CLIMAID Precipitation Change",
  legend: "Precipitation Change (cm)",
  legend_units: " cm ",
  legend_precision: 2,
  color_range: { positive: colorbrewer.BuGn[9],
                 negative: _.cloneDeep(colorbrewer.Blues[9].reverse())}
});

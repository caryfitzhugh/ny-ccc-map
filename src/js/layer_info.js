/*global Config, _ , URI, console*/
var GEOSERVER = "http://geoserver.nescaum-ccsc-dataservices.com/geoserver";
var API_SERVER = "http://api.nescaum-ccsc-dataservices.com/";

var CDN = function (url_str) {
  var url;
  if (Config.skip_cdn) {
    url = url_str;
  } else {
    var uri = new URI(url_str);
    var hostname = uri.hostname();

    if (hostname.match(/geoserver.nescaum-ccsc-dataservices.com/)) {
      uri.hostname("d3dfsz5phlpu8l.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/api.nescaum-ccsc-dataservices.com/)) {
      uri.hostname("d2749s27r5h52i.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else {
      console.warn("Hostname not in a CDN", hostname);
    }

    url = uri.toString();
  }
  return url;
};

var available_layers = [
    {
      "id": "aadt",
      "folder": "Transportation",
      "name": "Traffic: Avg Annualized Daily",
      "sectors": ["Transportation"],
      "description": "A line shapefile showing traffic volumes (daily average in 2012) on significant roads in New York State. Includes links to detailed, hourly reports for volume, speed, and vehicle classification data. UTM NAD 83 Zone 18N. ",
      "source": "NYS DOT",
      "source_url": "http:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1282",
      "sectors": "Transportation",
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1282&file=AADT_2015_tdv.zip",
      "metadata_url": null,
    },
];

var desired_active_on_load = [

];

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
    {
      "id": "airmon",
      "folder": "Air Emissions",
      "name": "Air Monitoring Stations",
      "description": "This dataset shows the location of each ambient air quality monitoring station currently being operated by the Bureau of Air Quality Surveillance (BAQS), Division of Air Resources, New York State Department of Environmental Conservation. Real-time air quality conditions may be accessed for most stations by clicking on the icon in the map view.",
      "source": "New York State Department of Environmental Conservation",
      "source_url": "http:\/\/www.dec.ny.gov",
      "sectors": "Public Health",
      "download_url": "https:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1159&file=AirMonStations.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.AirMon.shp.xml",
    },
    {
      "id": "anthromes",
      "folder": "Land Cover",
      "name": "Anthropogenic Biomes",
      "description": "The Anthropogenic Biomes of the World Version 2 data set describes anthropogenic transformations within the terrestrial biosphere caused by sustained direct human interaction with ecosystems, including agriculture and urbanization circa the year 2000. Potential natural vegetation, biomes, such as tropical rainforests or grasslands, are based on global vegetation patterns related to climate and geology. Anthropogenic transformation within each biome is approximated using population density, agricultural intensity (cropland and pasture) and urbanization. The data, as part of a time series provide global patterns of historical transformation of the terrestrial biosphere during the Industrial Revolution. This data set is distributed by the Columbia University Center for International Earth Science Information Network (CIESIN).",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/anthromes-anthropogenic-biomes-world-v2-2000",
      "sectors": "Ecosystems, Agriculture, Buildings",
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/anthromes-anthropogenic-biomes-world-v2-2000",
    },
    {
      "id": "boundary_municipal",
      "folder": "Boundaries",
      "name": "Municipalities",
      "description": "Towns, villages, hamlets, boroughs and other municipalities of New York State.",
      "source": "NY"
    },
];

var desired_active_on_load = [

];

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
      "id": "boundary_climate_divisions",
      "folder": "Boundaries",
      "name": "NOAA Climate Divisions",
      "description": "NOAA Climate Divisions for New York State.  Clicking on a climate division will provide links to NOAA web resources where temperature and precipitation data may be queried for that division.",
      "source": "NOAA",
      "source_url": "http://www.ncdc.noaa.gov/monitoring-references/maps/us-climate-divisions.php",
      "metadata_url": "",
      "download_url": ""
    },
    {
      "id": "boundary_counties",
      "folder": "Boundaries",
      "name": "Counties",
      "description": "TIGER 2013 Simplified County Boundaries, designed for 1:500k or smaller.  The cartographic boundary files are simplified representations of selected geographic areas from the Census Bureau’s MAF/TIGER geographic database.   These boundary files are specifically designed for small scale thematic mapping. ",
      "source": "US Census Bureau",
      "source_url": "https://www.census.gov/en.html",
      "metadata_url": "https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html",
      "download_url": "http://www2.census.gov/geo/tiger/GENZ2013/cb_2013_us_county_500k.zip",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "boundary_huc8",
      "folder": "Boundaries",
      "name": "Major Watersheds",
      "description": "Sub-basin (8-digit HUC) boundaries derived from the National Hydrography Dataset (NHD).",
      "source": "USGS",
      "source_url": "http:\/\/nhd.usgs.gov/",
      "metadata_url": "ftp:\/\/nhdftp.usgs.gov\/DataSets\/Staged\/States/FileGDB\/MediumResolution\/",
      "download_url": "ftp:\/\/nhdftp.usgs.gov\/DataSets\/Staged\/States/FileGDB\/MediumResolution\/NHDM_NY_931v220.zip"
    },
    {
      "id": "boundary_municipal",
      "folder": "Boundaries",
      "name": "Municipalities",
      "description": "Towns, villages, hamlets, boroughs and other municipalities of New York State.",
      "source": "NY"
    },
    {
      "id": "bulkstorage",
      "folder": "Public Health",
      "name": "Bulk Storage Sites",
      "description": "Point locations for: 1) Chemical Bulk Storage (CBS) Facilities, pursuant to the Hazardous Substance Bulk Storage Law, Article 40 of ECL; And 6 NYCRR 595-599. 2) Major Oil Storage Facilities, pursuant to Article 12 of the Navigation Law. 3) Petroleum Bulk Storage (PBS) Facilities, registered pursuant to title 10 of Article 17.",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1253",
      "sectors": "Public Health,Energy",
      "download_url": "ftp:\/\/ftp.dec.state.ny.us\/der\/FOIL\/bulkstorageGIS.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.BS.xml",
      "parameters": {
        // Don't do opacity, they are markers.
        "opacity": 70
      }
    },
    {
      "id": "carbon",
      "folder": "Ecosystems",
      "name": "Biomass Carbon Stock",
      "description": "Current (2010) and projected future (2050) biomass carbon stock (grams of carbon per square meter) for two different emissions scenarios: IPCC A2 (medium-high emissions) and IPCC B1 (lower emissions). Biomass carbon includes carbon stored in above- and below-ground live plant components (such as leaf, branch, stem and root) as well as in standing and down dead woody debris, and fine litter.",
      "source": "landcarbon.org",
      "source_url": "http:\/\/landcarbon.org\/categories\/biomass-c\/download\/",
      "sectors": "Ecosystems",
      "download_url": null,
      "metadata_url": null,
    },
    {
      "id": "cfem_critical",
      "folder": "Coastal Zones",
      "name": "HAZUS Critical Facilities",
      "description": "Selected facilities and structures along the Atlantic and Gulf coasts that, if flooded, would present an immediate threat to life, public health, or safety.",
      "source": "NOAA Office For Coastal Management",
      "source_url": "https://maps.coast.noaa.gov/arcgis/rest/services/FloodExposureMapper/CFEM_CriticalFacilities/MapServer",
      "sectors": "Public Health,Coastal Zones",
      "download_url": null,
      "metadata_url": "https://maps.coast.noaa.gov/arcgis/rest/services/FloodExposureMapper/CFEM_CriticalFacilities/MapServer",
    },
    {
      "id": "croplands",
      "folder": "Agriculture",
      "name": "Global Croplands,2000",
      "description": "The Global Croplands dataset represents the proportion of land areas used as cropland (land used for the cultivation of food) in the year 2000. Satellite data from Modetate Resolution Imaging Spectroradiometer (MODIS) and Satellite Pour l'Observation de la Terre (SPOT) Image Vegetation sensor were combined with agricultural inventory data to create a global data set. The visual presentation of this data demonstrates the extent to which human land use for agriculture has changed the Earth and in which areas this change is most intense. The data was compiled by Navin Ramankutty , et. al. (2008) and distributed by the Columbia University Center for International Earth Science Information Network (CIESIN).",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/",
      "sectors": "Agriculture,Ecosystems",
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/maps\/services#Global Agricultural Lands",
    },
    {
      "id": "dec_wetlands",
      "folder": "Ecosystems",
      "name": "Regulatory Wetlands",
      "description": "The State Legislature passed The Freshwater Wetlands Act (PDF) (129 kB)(Act) in 1975 with the intent to preserve, protect and conserve freshwater wetlands and their benefits, consistent with the general welfare and beneficial economic, social and agricultural development of the state. To be protected under the Freshwater Wetlands Act, a wetland must be 12.4 acres (5 hectares or larger). Wetlands smaller than this may be protected if they are considered of unusual local importance. Around every wetland is an 'adjacent area' of 100 feet that is also regulated to provide protection for the wetland. A permit is required to conduct any regulated activity in a protected wetland or its adjacent area. Wetlands shown on the DEC maps usually are also regulated by the Corps, but the Corps also regulates additional wetlands not shown on the DEC maps. Different wetlands provide different functions and benefits and in varying degrees. The Act requires DEC to rank wetlands in classes based on the benefits and values provided by each wetland. The wetland class helps to determine the best uses for each wetland. Higher class wetlands provide the greatest level of benefits and are afforded a higher level of protection. Lower class wetlands still provide important functions and benefits, but typically require less protection to continue to provide these functions.Digital wetlands data are not official regulatory maps and are subject to change.",
      "source": "NYS DEC",
      "source_url": "http:\/\/maps.naturalresourcenavigator.org",
      "sectors": "Ecosystems,Water Resources",
      "download_url": null,
      "metadata_url": "http:\/\/services.coastalresilience.org\/arcgis\/rest\/services\/New_York\/NY_CLIMAD_toolkit\/MapServer/136"
    },
    {
      "id": "dow_unconsolidated_aquifers",
      "folder": "Water Resources",
      "name": "Aquifers- Unconsolidated",
      "description": "These aquifers include those in upstate NY that consist of sand and gravel and yield large supplies of water to wells. Bedrock aquifers, although significant in some areas, are not included here. Source data is 1:250,000, same scale as the NYS Geological Survey surficial and bedrock geology maps on which they were based. Together these maps form a consistent set of geologic and groundwater maps for use in regional management of the groundwater resources of the State. Long Island is represented in the separate 'Hydrogeologic Framework at 1:250,000 - Long Island, NY', published by USGS/NYSDEC. ",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1141",
      "sectors": "Ecosystems,Water Resources",
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1141&file=dow_uncon_aqui.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.uncon_aqui.html",
    },
    {
      "id": "extreme_precipitation",
      "folder": "Climate Data.Precipitation",
      "name": "Extreme Precipitation",
      "description": "Natural Heritage Program: Predicted Future and Current Extreme Precipitation Events.  1) Average predicted future return frequency (in years) of a storm event with a precipitation magnitude matching that of a current 10 or 100-year event. 2)Average predicted percent increase in future precipitation amount for 10 and 100-year storm events (1 day duration). 3) Current magnitude of a 10 and 100-year precipitation event (1 day duration) in inches. (Raw data in thousandths of an inch.)",
      "source": "'Natural Resource Navigator / NY Climate Adaptation",
      "source_url": "http://maps.naturalresourcenavigator.org/",
      "sectors": "Water Resources",
    },
    {
      "id": "fema_historic",
      "folder": "Water Resources",
      "name": "FEMA Historic Emergencies 1964-2014",
      "description": "This layer summarizes FEMA historic disaster declarations from 1964 through 2014, categorized by type.",
      "source": "FEMA",
      "source_url": "https:\/\/catalog.data.gov\/dataset\/fema-historical-disaster-declarations-shp",
      "sectors": "All Sectors",
      "legend_url": CDN("http://52.2.5.122:8080/geoserver/wms?request=GetLegendGraphic&LAYER=nyccsc:fema_historic&format=image/png"),
      "download_url": "http:\/\/gis.fema.gov\/kmz\/HistoricDeclarations.zip",
      "metadata_url": "https:\/\/www.fema.gov\/openfema-dataset-disaster-declarations-summaries-v1",
      "parameters": {
        "opacity": 70,
      }
    },
    {
      "id": "gap_lc",
      "folder": "Land Cover",
      "name": "GAP Land Cover Dataset",
      "description": "GAP Land Cover 3 National Vegetation Classification-Formation Land Use for the contiguous United States. For more information about the National Vegetation Classification Standard please visit this link: http://usnvc.org/data-standard/",
      "source": "USGS",
      "source_url": "https://catalog.data.gov/dataset/u-s-geological-survey-gap-analysis-program-land-cover-data-v2-2",
      "sectors": "Agriculture,Ecosystems",
      "download_url": null,
      "metadata_url": "https://gis1.usgs.gov/arcgis/rest/services/gap/GAP_Land_Cover_NVC_Class_Landuse/MapServer",
    },
];

var desired_active_on_load = [

];

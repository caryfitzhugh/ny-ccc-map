/*global Config, _ , URI, console*/
var GEOSERVER = "https://geoserver.nescaum-ccsc-dataservices.com/geoserver";
var API_SERVER = "https://api.nescaum-ccsc-dataservices.com/";

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
    /*
    } else if (hostname.match(/sedac.ciesin.columbia.edu/)) {
      uri.hostname("d1fki4hbucg4je.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    */
    } else if (hostname.match(/aps.coast.noaa.gov/)) {
      uri.hostname("d34d8e4z51f5hr.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/gis.fema.gov/)) {
      uri.hostname("d2zzyfhnmavvhx.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/gis1.usgs.gov/)) {
      uri.hostname("d2j0p075yoyqht.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/services.coastalresilience.org/)) {
      uri.hostname("d1afxrl1v7xde2.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/hazards.fema.gov/)) {
      uri.hostname("d2ostsj8rmvqnh.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/ciesin.columbia.edu/)) {
      //uri.hostname("dm1qgr5i36k4o.cloudfront.net");
      //uri.port(null);
      // Pretty lame but doesn't look lke we can use the CDN for this host anymore.
      uri.scheme("https");

    } else if (hostname.match(/rmgsc.cr.usgs.gov/)) {
      uri.hostname("d2m13662o5wefi.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/coast.noaa.gov/)) {
      uri.hostname("d20i2i7q9fpq87.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/repository.nescaum-ccsc-dataservices.com/)) {
      //Nothing
    } else if (hostname.match(/geoserver.nescaum-ccsc-dataservices.com/)) {
      // Running it through an HTTPS proxy cloudfront-style
      uri.hostname("3dfsz5phlpu8l.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/.*\.cloudfront.net/)) {
      //Nothing
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
      "description": "A line shapefile showing traffic volumes (daily average in 2012) on significant roads in New York State. Includes links to detailed, hourly reports for volume, speed, and vehicle classification data. UTM NAD 83 Zone 18N. ",
      "source": "NYS DOT",
      "source_url": "http:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1282",
      "sectors": ["Transportation"],
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
      "sectors": ["Public Health"],
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
      "sectors": ["Ecosystems", 'Agriculture', 'Buildings'],
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/anthromes-anthropogenic-biomes-world-v2-2000",
    },
    {
      "id": "armories",
      "folder": "Emergency Operations",
      "name": "Armories",
      "description": "This data file contains information on the 64 Armories for NYS.",
      "source": "New York State Department of Environmental Conservation",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=79",
      "sectors": ["Public Health"],
      "download_url": "http://gis.ny.gov/gisdata/fileserver/?DSID=79&file=armories.zip",
      "metadata_url": "http://gis.ny.gov/gisdata/metadata/dmna.NYS_ARMORIES.html",
    },
    {
      "id": "boundary_climate_divisions",
      "folder": "Boundaries",
      "name": "NOAA Climate Divisions",
      "description": "NOAA has identified 344 climate divisions in the continental United States. Climate divisions are computed from daily observations, monthly station temperature and precipitation values. The divisional values are weighted by area to compute statewide values and the statewide values are weighted by area to compute regional values. (Karl and Koss, 1984).",
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
      "source": "New York State",
      "source_url": "http://gis.ny.gov/civil-boundaries/",
      "download_url": "http://gis.ny.gov/gisdata/fileserver/?DSID=927&file=NYS_Civil_Boundaries.shp.zip",
      "metadata_url": "http://gis.ny.gov/gisdata/metadata/nysgis.Cities_Towns.pdf"
    },
    {
      "id": "bridges",
      "folder": "Transportation",
      "name": "Bridges",
      "description": "Point layer of all New York State bridge that carry or cross a public road including general inventory attributes. Bridge ID Number (BIN) attribute used to identify each bridge. ",
      "source": "NYS DOT",
      "source_url": "https:\/\/www.dot.ny.gov\/index",
      "sectors": ["Transportation"],
      "download_url": "http://gis.ny.gov/gisdata/fileserver/?DSID=397&file=NYSDOTBridges.zip",
      "metadata_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=397"
    },
    {
      "id": "bulkstorage",
      "folder": "Critical Infrastructure",
      "name": "Bulk Storage Sites",
      "description": "Point locations for: 1) Chemical Bulk Storage (CBS) Facilities, pursuant to the Hazardous Substance Bulk Storage Law, Article 40 of ECL; And 6 NYCRR 595-599. 2) Major Oil Storage Facilities, pursuant to Article 12 of the Navigation Law. 3) Petroleum Bulk Storage (PBS) Facilities, registered pursuant to title 10 of Article 17.",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1253",
      "sectors": ["Public Health","Energy"],
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
      "sectors": ["Ecosystems"],
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
      "sectors": ["Public Health","Coastal Zones"],
      "download_url": null,
      "metadata_url": "https://maps.coast.noaa.gov/arcgis/rest/services/FloodExposureMapper/CFEM_CriticalFacilities/MapServer",
    },
    {
      "id": "climaid_temp",
      "folder": "Other Climate Data",
      "name": "CLIMAID Temperature Change",
      "description": "Future temperature projections developed for and utilized by the New York ClimAID Report. Projected temperature change for the years 2020, 2050, and 2080, compared with the baseline period of 1971-2000, at a 50x50km resolution. Projections are available for two different emissions scenarios, RCP 4.5 (substantial reductions in GHG emissions before 2100) and RCP 8.5 (increasing GHG emissions with time). Users can select results by percentiles. For example, the 75th percentile means that 75 percent of the model results are lower in value (and 25 percent are higher).",
      "source": "CLIMAID",
      "source_url": "http:\/\/www.nyserda.ny.gov\/climaid",
      "sectors": ["All Sectors"],
      "download_url": null,
      "metadata_url": "",
    },
    {
      "id": "climaid_precip",
      "folder": "Other Climate Data",
      "name": "CLIMAID Precipitation Change",
      "description": "Future precipitation projections developed for and utilized by the New York ClimAID Report. Projected precipitation change for the years 2020, 2050, and 2080, compared with the baseline period of 1971-2000. Projections are available for two different emissions scenarios, RCP 4.5 (substantial reductions in GHG emissions before 2100) and RCP 8.5 (increasing GHG emissions with time). Users can select results by percentiles. For example, the 75th percentile means that 75 percent of the model results are lower in value (and 25 percent are higher).",
      "source": "CLIMAID",
      "source_url": "http:\/\/www.nyserda.ny.gov\/climaid",
      "sectors": "",
      "sectors": ["All Sectors"],
      "download_url": null,
      "metadata_url": "",
    },
    {
      "id": "croplands",
      "folder": "Agriculture",
      "name": "Global Croplands,2000",
      "description": "The Global Croplands dataset represents the proportion of land areas used as cropland (land used for the cultivation of food) in the year 2000. Satellite data from Modetate Resolution Imaging Spectroradiometer (MODIS) and Satellite Pour l'Observation de la Terre (SPOT) Image Vegetation sensor were combined with agricultural inventory data to create a global data set. The visual presentation of this data demonstrates the extent to which human land use for agriculture has changed the Earth and in which areas this change is most intense. The data was compiled by Navin Ramankutty , et. al. (2008) and distributed by the Columbia University Center for International Earth Science Information Network (CIESIN).",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/",
      "sectors": ["Agriculture","Ecosystems"],
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/maps\/services#Global Agricultural Lands",
    },
    {
      "id": "culverts",
      "folder": "Transportation",
      "name": "Large Culverts",
      "description": "Point layer of all New York State bridge that carry or cross a public road including general inventory attributes. Bridge ID Number (BIN) attribute used to identify each bridge. ",
      "source": "NYS DOT",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1255",
      "sectors": ["Transportation"],
      "download_url": "http://gis.ny.gov/gisdata/fileserver/?DSID=1255&file=NYSDOTLargeCulverts.zip",
      "metadata_url": "http://gis.ny.gov/gisdata/metadata/dot.LargeCulverts.xml"
    },
    {
      "id": "dams",
      "folder": "Critical Infrastructure",
      "name": "Dams",
      "description": "Location of dams in New York State, with selected attributes of each dam, including relative risk level." +
        "(http://www.dec.ny.gov/docs/water_pdf/togs315.pdf)",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1130",
      "sectors": ["Water Resources"],
      "download_url": "http:\/\/www.dec.ny.gov\/maps\/nysdamslink.kmz",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.dams_KML.xml"
    },
    {
      "id": "dec_wetlands",
      "folder": "", //"Excosystems",
      "name": "Regulatory Wetlands",
      "description": "The State Legislature passed The Freshwater Wetlands Act (PDF) (129 kB)(Act) in 1975 with the intent to preserve, protect and conserve freshwater wetlands and their benefits, consistent with the general welfare and beneficial economic, social and agricultural development of the state. To be protected under the Freshwater Wetlands Act, a wetland must be 12.4 acres (5 hectares or larger). Wetlands smaller than this may be protected if they are considered of unusual local importance. Around every wetland is an 'adjacent area' of 100 feet that is also regulated to provide protection for the wetland. A permit is required to conduct any regulated activity in a protected wetland or its adjacent area. Wetlands shown on the DEC maps usually are also regulated by the Corps, but the Corps also regulates additional wetlands not shown on the DEC maps. Different wetlands provide different functions and benefits and in varying degrees. The Act requires DEC to rank wetlands in classes based on the benefits and values provided by each wetland. The wetland class helps to determine the best uses for each wetland. Higher class wetlands provide the greatest level of benefits and are afforded a higher level of protection. Lower class wetlands still provide important functions and benefits, but typically require less protection to continue to provide these functions.Digital wetlands data are not official regulatory maps and are subject to change.",
      "source": "NYS DEC",
      "source_url": "http:\/\/maps.naturalresourcenavigator.org",
      "sectors": ["Ecosystems","Water Resources"],
      "download_url": null,
      "metadata_url": "http:\/\/services.coastalresilience.org\/arcgis\/rest\/services\/New_York\/NY_CLIMAD_toolkit\/MapServer/136"
    },
    {
      "id": "dewberry_sea_level_rise",
      "folder": "Coastal Zones",
      "name": "Sea Level Rise (Dewberry)",
      "description": "NYSERDA has developed data resources for a range of future coastal flooding conditions in order to improve the ability of local and state officials, and others to assess vulnerability and inform resiliency planning. The table below provides estimated sea level rise projections by decade under low, median, and high scenarios and are representative of sea level rise projections found in the 2014 Supplement to the ClimAID Integrated Assessment for Effective Climate Change Adaptation. The Coastal New York Future Floodplain Mapper provides information for seven of these scenarios (12, 18, 24, 36, 48, 60, and 72 inches).",
      "source": "NYSERDA",
      "source_url": "http:\/\/services.nyserda.ny.gov\/SLR_Viewer\/About",
      "sectors": ["All Sectors"],
      "legend_url": "./img\/dewberry_slr.png",
      "metadata_url": "http:\/\/appealsserver.cloudapp.net\/arcgis\/rest\/services\/NYSERDA\/NYSERDA_SLR_Service\/MapServer"
    },
    {
      "id": "dow_unconsolidated_aquifers",
      "folder": "Water Resources",
      "name": "Aquifers- Unconsolidated",
      "description": "These aquifers include those in upstate NY that consist of sand and gravel and yield large supplies of water to wells. Bedrock aquifers, although significant in some areas, are not included here. Source data is 1:250,000, same scale as the NYS Geological Survey surficial and bedrock geology maps on which they were based. Together these maps form a consistent set of geologic and groundwater maps for use in regional management of the groundwater resources of the State. Long Island is represented in the separate 'Hydrogeologic Framework at 1:250,000 - Long Island, NY', published by USGS/NYSDEC. ",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1141",
      "sectors": ["Ecosystems","Water Resources"],
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1141&file=dow_uncon_aqui.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.uncon_aqui.html",
    },
    {
      "id": "electric_powerlines",
      "folder": "Energy/Communications",
      "name": "Electric Transmission Lines",
      "description": "Natural gas interstate and intrastate pipelines in the United States. Based on a variety of sources with varying scales and levels of accuracy and therefore accuracy is directly affected. This layer is not visible if zoomed in beyond 1:200,000 scale.  Collected by EIA from FERC and other external sources.",
      "source": "Homeland Infrastructure Foundation-Level Data (HIFELD)",
      "source_url": "https://hifld-geoplatform.opendata.arcgis.com/",
      "sectors": ["Energy"],
      "download_url": "https://opendata.arcgis.com/datasets/70512b03fe994c6393107cc9946e5c22_0.zip?outSR=%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/70512b03fe994c6393107cc9946e5c22/info/metadata/metadata.xml?format=default&output=html",
    },
    {
      "id": "epa_frs_facilities",
      "folder": "Critical Infrastructure",
      "name": "Federally Regulated Facilites",
      "description": "To improve public health and the environment, the EPA collects information about facilities or sites subject to environmental regulation. The EPA Geospatial Data Access Project provides downloadable files of these facilities or sites in the following formats: Extensible Markup Language (XML), Keyhole Markup Language (KML), ESRI Geodatabase, and Comma Separated Value (CSV). Within the file is key facility information, along with associated environmental interests for use in mapping and reporting applications. ",
      "source": "United States Environmental Protection Agency",
      "source_url": "https://www.epa.gov/",
      "sectors": ["Public Health"],
      "download_url": "https://www.epa.gov/enviro/geospatial-data-download-service",
      "metadata_url": "http:\/\/profiles.health.ny.gov\/hospital"
    },
    {
      "id": "extreme_precipitation",
      "folder": "Climate Projections.Precipitation",
      "name": "Extreme Precipitation",
      "description": "Natural Heritage Program: Predicted Future and Current Extreme Precipitation Events.  1) Average predicted future return frequency (in years) of a storm event with a precipitation magnitude matching that of a current 10 or 100-year event. 2)Average predicted percent increase in future precipitation amount for 10 and 100-year storm events (1 day duration). 3) Current magnitude of a 10 and 100-year precipitation event (1 day duration) in inches. (Raw data in thousandths of an inch.)",
      "source": "'Natural Resource Navigator / NY Climate Adaptation",
      "source_url": "http://maps.naturalresourcenavigator.org/",
      "sectors": ["Water Resources"],
      "metadata_url": "https://services2.coastalresilience.org/arcgis/rest/services/Natural_Resource_Navigator/Natural_Resource_Navigator/MapServer"
    },
    {
      "id": "fema_historic",
      "folder": "Water Resources",
      "name": "FEMA Historic Emergencies 1964-2014",
      "description": "This layer summarizes FEMA historic disaster declarations from 1964 through 2014, categorized by type.",
      "source": "FEMA",
      "source_url": "https:\/\/catalog.data.gov\/dataset\/fema-historical-disaster-declarations-shp",
      "sectors": ["All Sectors"],
      "legend_url": CDN("http://52.2.5.122:8080/geoserver/wms?request=GetLegendGraphic&LAYER=nyccsc:fema_historic&format=image/png"),
      "download_url": "http:\/\/gis.fema.gov\/kmz\/HistoricDeclarations.zip",
      "metadata_url": "https:\/\/www.fema.gov\/openfema-dataset-disaster-declarations-summaries-v1",
      "parameters": {
        "opacity": 70,
      }
    },
    {
      "id": "flood_exposure",
      "folder": "Coastal Zones",
      "name": "Flood Exposure",
      "description": "This map service was created to support the National Oceanic and Atmospheric Administration (NOAA) Office for Coastal Management’s (OCM) Coastal Flood Exposure Mapper. The purpose of the online mapping tool is to provide coastal managers, planners, and stakeholders a preliminary look at exposures to coastal flooding hazards. The Mapper is a screening-level tool that uses nationally consistent data sets and analyses. Data and maps provided can be used at several scales to help communities initiate resilience planning efforts. Currently the extent of this map service and the Coastal Flood Exposure Mapper is limited to U.S. coastal counties along the Gulf of Mexico and Atlantic Ocean. The purpose of this dataset is to provide boundaries and information for the county selection function within the mapping application. The dataset should be used only as a screening-level tool for management decisions. As with all remotely sensed data, all features should be verified with a site visit. The dataset is provided as is, without warranty to its performance, merchantable state, or fitness for any particular purpose. The entire risk associated with the results and performance of this dataset is assumed by the user. This dataset should be used strictly as a planning reference and not for navigation, permitting, or other legal purposes. For more information, visit the Coastal Flood Exposure Mapper (https://coast.noaa.gov/floodexposure). Send questions or comments to the NOAA Office for Coastal Management (coastal.info@noaa.gov). ",
      "source": "NOAA",
      "source_url": "https://coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CoastalFloodHazardComposite/MapServer",
      "sectors": ["All Sectors"],
      "legend_url": CDN("https://coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CoastalFloodHazardComposite/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"),
      "metadata_url": "https://coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CoastalFloodHazardComposite/MapServer"
    },
    {
      "id": "freight_stations",
      "folder": "Transportation",
      "name": "Freight Stations",
      "description": "Vector file of locations where freight traffic would be billed to. While shown as point data, it would encompass any nearby industries.",
      "source": "NYS DOT",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1262",
      "sectors": ["Transportation"],
      "download_url": "http://gis.ny.gov/gisdata/fileserver/?DSID=1262&file=FreightStations.zip",
      "metadata_url": "http://gis.ny.gov/gisdata/metadata/dot.FreightStations.shp.xml"
    },
    {
      "id": "gap_lc",
      "folder": "Land Cover",
      "name": "GAP Land Cover Dataset",
      "description": "GAP Land Cover 3 National Vegetation Classification-Formation Land Use for the contiguous United States. For more information about the National Vegetation Classification Standard please visit this link: http://usnvc.org/data-standard/",
      "source": "USGS",
      "source_url": "https://catalog.data.gov/dataset/u-s-geological-survey-gap-analysis-program-land-cover-data-v2-2",
      "sectors": ["Agriculture","Ecosystems"],
      "download_url": null,
      "metadata_url": "https://gis1.usgs.gov/arcgis/rest/services/gap/GAP_Land_Cover_NVC_Class_Landuse/MapServer",
    },
    {
      "id": "ghg_facilities",
      "folder": "Air Emissions",
      "name": "GHG Emissions from Large Facilities",
      "description": "Data for reporting year 2016 extracted from EPA's Facility Level Information on Greenhouse Gases Tool (FLIGHT).  All emissions data is presented in units of metric tons of carbon dioxide equivalent (CO2e) using GWP's from IPCC's AR4. ",
      "source": "EPA Facility Level Information on GeeenHouse gases Tool (FLIGHT)",
      "source_url": "http:\/\/ghgdata.epa.gov\/ghgp\/main.do",
      "sectors": ["Energy"],
      "download_url": null,
      "metadata_url": "http:\/\/ghgdata.epa.gov\/ghgp\/main.do",
    },
    {
      "id": "hospitals",
      "folder": "Critical Infrastructure",
      "name": "Hospitals",
      "description": "Hospitals in New York State, based on NYS Department of Health data.",
      "source": "New York State Department of Health",
      "source_url": "http:\/\/www.health.ny.gov",
      "sectors": ["Public Health"],
      "download_url": "http:\/\/maps.nysprofile.ipro.org\/live\/php\/data.php?table=hospitals",
      "metadata_url": "http:\/\/profiles.health.ny.gov\/hospital"
    },
    {
      "id": "invasive_animals",
      "folder": "",
      "name": "Invasive Animal Species",
      "description": "Summary of observations of mapped occurrence of invasive animals, including mammals, fish and bivalves, by county for New York State, provided by iMapInvasives NY -- New York's Online Invasive Species Database and Mapping System (http://imapinvasives.org) © 2016 NatureServe",
      "source": "iMapInvasives",
      "source_url": "http://imapinvasives.org",
      "metadata_url": "http://www.imapinvasives.org/new-yorklogin",
      "download_url": "http://52.2.5.122:8080/geoserver/www/invasive_animals.json",
      "sectors": ["Ecosystems", "Transportation", "Coastal Zones"],
    },
    {
      "id": "invasive_plants",
      "folder": "",
      "name": "Invasive Plant Species",
      "description": "Summary of observations of mapped locations of invasive plants by county for New York State, provided by iMapInvasives NY -- New York's Online Invasive Species Database and Mapping System (http://imapinvasives.org) © 2016 NatureServe",
      "source": "iMapInvasives",
      "source_url": "http://imapinvasives.org",
      "metadata_url": "http://www.imapinvasives.org/new-yorklogin",
      "download_url": "http://52.2.5.122:8080/geoserver/www/invasive_plants.json",
      "sectors": ["Ecosystems", "Transportation", "Coastal Zones"],
    },
    {
      "id": "invasive_insects",
      "folder": "",
      "name": "Invasive Insect Species",
      "description": "Summary of observations of mapped occurrence of invasive or exotic insect pests by county for New York State, provided by iMapInvasives NY -- New York's Online Invasive Species Database and Mapping System (http://imapinvasives.org) © 2016 NatureServe",
      "source": "iMapInvasives",
      "source_url": "http://imapinvasives.org",
      "metadata_url": "http://www.imapinvasives.org/new-yorklogin",
      "download_url": "http://52.2.5.122:8080/geoserver/www/invasive_insects.json",
      "sectors": ["Ecosystems","Transportation","Coastal Zones"]
    },
    {
      "id": "lulc_2011",
      "folder": "Land Cover",
      "name": "NY Land Use/Land Class (2011)",
      "description": "Current (2011) land use / land cover map of NY State, from the ClimAID Natural Resource Navigator site.",
      "source": "NYS",
      "source_url": "http:\/\/maps.naturalresourcenavigator.org",
      "sectors": ["Ecosystems"],
      "legend_url": null,
      "download_url": null,
      "metadata_url": "http:\/\/services.coastalresilience.org\/arcgis\/rest\/services\/New_York\/NY_CLIMAD_toolkit\/MapServer/209"
    },
    {
      "id": "lulc_2050",
      "folder": "Land Cover",
      "name": "NY Land Use/Land Class (2050)",
      "description": "Predicted future (2050) land use / land cover map of NY State, from the ClimAID Natural Resource Navigator site.",
      "source": "NYS",
      "source_url": "http:\/\/maps.naturalresourcenavigator.org",
      "sectors": ["Ecosystems"],
      "legend_url": null,
      "download_url": null,
      "metadata_url": "http:\/\/services.coastalresilience.org\/arcgis\/rest\/services\/New_York\/NY_CLIMAD_toolkit\/MapServer/208"
    },
    {
      "id": "national_flood_hazard",
      "folder": "Water Resources",
      "name": "Flood Hazard",
      "description": "FEMA National Flood Hazard Layer",
      "source": "FEMA",
      "source_url": "http:\/\/www.fema.gov\/",
      "sectors": ["Water Resources"],
      "download_url": "http:\/\/www.hazards.fema.gov\/gis\/nfhl\/rest\/services\/public\/NFHL\/MapServer",
      "metadata_url": "http:\/\/www.hazards.fema.gov\/gis\/nfhl\/rest\/services\/public\/NFHL\/MapServer",
    },
    {
      "id": "naturalgas_pipelines",
      "folder": "Energy/Communications",
      "name": "Natural Gas Pipelines",
      "description": "Natural gas interstate and intrastate pipelines in the United States. Based on a variety of sources with varying scales and levels of accuracy and therefore accuracy is directly affected. This layer is not visible if zoomed in beyond 1:200,000 scale.  Collected by EIA from FERC and other external sources.",
      "source": "US Energy Information Administration",
      "source_url": "https://www.eia.gov/",
      "sectors": ["Energy"],
      "download_url": "https://www.eia.gov/maps/map_data/NaturalGas_InterIntrastate_Pipelines_US_EIA.zip",
      "metadata_url": "https://www.eia.gov/maps/layer_info-m.php",
    },
    {
      "id": "nlcd",
      "folder": "Land Cover",
      "name": "National Land Cover Dataset",
      "description": "National Land Cover Dataset (NLCD). NLCD 2011 are National Land Cover Database classification schemes based primarily on Landsat data along with ancillary data sources, such as topography, census and agricultural statistics, soil characteristics, wetlands, and other land cover maps. NLCD 1992 is a 21-class land cover classification scheme that has been applied consistently across the conterminous U.S. at a spatial resolution of 30 meters.",
      "source": "USGS",
      "source_url": "http:\/\/www.mrlc.gov",
      "sectors": ["Agriculture","Ecosystems","Buildings", "Transportation"],
      "download_url": "https://www.mrlc.gov/nlcd11_data.php",
      "metadata_url": "https://www.mrlc.gov/index.php"
    },
    {
      "id": "noaa_sea_level_rise",
      "folder": "Coastal Zones",
      "name": "Sea Level Rise (NOAA)",
      "description": "Sea Level Rise: the maps show inland extent and relative depth of inundation from 0 to 6 feet above mean higher high water (MHHW). Areas that are hydrologically connected (according to the digital elevation model used) are shown in shades of blue. Low-lying areas, displayed in green, are considered hydrologically “unconnected” areas that may flood. The inundation maps are created by subtracting the NOAA VDATUM MHHW surface from the digital elevation model. Mapping Confidence: blue areas denote a high confidence of inundation, orange areas denote a low confidence of inundation, and unshaded areas denote a high confidence that these areas will be dry given the chosen water level.",
      "source": "NOAA",
      "source_url": "http:\/\/coast.noaa.gov\/slr\/",
      "sectors": ["All Sectors"],
      "legend_url": null,
      "download_url": null,
      "metadata_url": "https:\/\/coast.noaa.gov\/digitalcoast\/tools\/slr",
    },
    {
      "id": "ny_mask",
      "sort_key": 0,
      "folder": "Boundaries",
      "name": "NY State Mask",
      "description": "This layer masks out map features outside of the NY state boundaries.  Derived from TIGER 2013 Simplified County Boundaries, designed for 1:500k or smaller.  The cartographic boundary files are simplified representations of selected geographic areas from the Census Bureau’s MAF/TIGER geographic database.  ",
      "source": "US Census Bureau",
      "source_url": "https://www.census.gov/en.html",
      "sectors": [],
    },
    {
      "id": "nyserda_slr",
      "folder": "Coastal Zones",
      "name": "Sea Level Rise (SIT/Columbia)",
      "description": "Sea level and storm surge predictions for the lower Hudson River, based on model simulations developed for NYSERDA.",
      "source": "Stevens Institute of Technology/Columbia University/NYSERDA",
      "source_url": "http:\/\/ciesin.columbia.edu\/geoserver\/ows?service=wms&version=1.3.0&request=GetCapabilities",
      "sectors": ["All Sectors"],
      "legend_url": null,
      "download_url": "http://www.ciesin.columbia.edu/hudson-river-flood-map/",
      "metadata_url": "https:\/\/github.com\/matthiasmengel\/sealevel",
    },
    {
      "id": "pastures",
      "folder": "Agriculture",
      "name": "Global Pastures,2000",
      "description": "The Global Pastures dataset represents the proportion of land areas used as pasture land (land used to support grazing animals) in the year 2000. Satellite data from Modetate Resolution Imaging Spectroradiometer (MODIS) and Satellite Pour l'Observation de la Terre (SPOT) Image Vegetation sensor were combined with agricultural inventory data to create a global data set. The visual presentation of this data demonstrates the extent to which human land use for agriculture has changed the Earth and in which areas this change is most intense. The data was compiled by Navin Ramankutty, et. al. (2008) and distributed by the Columbia University Center for International Earth Science Information Network (CIESIN).",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/",
      "sectors": ["Agriculture","Ecosystems"],
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/maps\/services#Global Agricultural Lands",
    },
    {
      "id": "power_plants",
      "folder": "Energy/Communications",
      "name": "Power Plants",
      "description": "Operable electric generating plants in the New York by energy source. This includes all plants that are operating, on standby, or short- or long-term out of service with a combined nameplate capacity of 1 MW or more.",
      "source": "US Energy Information Administration",
      "source_url": "https://www.eia.gov/",
      "sectors": ["Energy"],
      "download_url": "https://www.eia.gov/maps/map_data/PowerPlants_US_EIA.zip",
      "metadata_url": "https://www.eia.gov/maps/layer_info-m.php",
    },
    {
    "id": "observed_precip",
    "folder": "Climate Observations.Precipitation",
    "name": "Precipitation (Observed)",
    "sectors": ["All Sectors"],
    "description": "Total precipitation summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_precip",
    "folder": "Climate Projections.Precipitation",
    "name": "Precipitation (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in annual or seasonal total precipitation. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='pcpn'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_precip",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_precip_gt_1",
    "folder": "Climate Observations.Precipitation",
    "name": "Extreme Precipitation > 1\" (Observed)",
    "sectors": ["All Sectors"],
    "description": "Days with precipitation greater than one inch summarized by area (county,basin) and decade over the period 1980-2010. Observational data: Fractional days occur as a result of the averaging process.  Since extremes do not occur in every year or in all locations within a county, state or basin, when computing an average over time or over an area, the inclusion of these zeroes can result in fractional days or even counts of days that are less than one. A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_precip_gt_1",
    "folder": "Climate Projections.Precipitation",
    "name": "Extreme Precipitation > 1\" (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in the number of days per season or annually with precipitation above or below threshold values. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). Fractional days occur as a result of the averaging process.  Since extremes do not occur in every year or in all locations within a county, state or basin, when computing an average over time or over an area, the inclusion of these zeroes can result in fractional days or even counts of days that are less than one. The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='pcpn_gt_1'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_precip_gt_1",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_precip_gt_2",
    "folder": "Climate Observations.Precipitation",
    "name": "Extreme Precipitation > 2\" (Observed)",
    "sectors": ["All Sectors"],
    "description": "Days with precipitation greater than two inches summmarized by area (state,county,basin) and decade over the period 1960-2005. Fractional days occur as a result of the averaging process.  Since extremes do not occur in every year or in all locations within a county, state or basin, when computing an average over time or over an area, the inclusion of these zeroes can result in fractional days or even counts of days that are less than one. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_precip_gt_2",
    "folder": "Climate Projections.Precipitation",
    "name": "Extreme Precipitation > 2\" (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in the number of days per season or annually with precipitation above or below threshold values. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). Fractional days occur as a result of the averaging process.  Since extremes do not occur in every year or in all locations within a county, state or basin, when computing an average over time or over an area, the inclusion of these zeroes can result in fractional days or even counts of days that are less than one. The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='pcpn_gt_2'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_precip_gt_2",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_precip_gt_3",
    "folder": "Climate Observations.Precipitation",
    "name": "Extreme Precipitation > 3\" (Observed)",
    "sectors": ["All Sectors"],
    "description": "Days with precipitation greater than three inches summarized by area (county,basin) and decade over the period 1980-2010. Fractional days occur as a result of the averaging process.  Since extremes do not occur in every year or in all locations within a county, state or basin, when computing an average over time or over an area, the inclusion of these zeroes can result in fractional days or even counts of days that are less than one. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_precip_gt_3",
    "folder": "Climate Projections.Precipitation",
    "name": "Extreme Precipitation > 3\" (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in the number of days per season or annually with precipitation above or below threshold values. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). Fractional days occur as a result of the averaging process.  Since extremes do not occur in every year or in all locations within a county, state or basin, when computing an average over time or over an area, the inclusion of these zeroes can result in fractional days or even counts of days that are less than one. The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='pcpn_gt_3'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_precip_gt_3",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_avg_temp",
    "folder": "Climate Observations.Temperature",
    "name": "Average Temperatures (Observed)",
    "sectors": ["All Sectors"],
    "description": "Average temperature summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_avg_temp",
    "folder": "Climate Projections.Temperature",
    "name": "Average Temperatures (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in annual or seasonal average temperature. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='avgt'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_avg_temp",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_max_temp",
    "folder": "Climate Observations.Temperature",
    "name": "Maximum Temperatures - Average (Observed)",
    "sectors": ["All Sectors"],
    "description": "Average maximum temperature summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_max_temp",
    "folder": "Climate Projections.Temperature",
    "name": "Maximum Temperatures - Average (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in annual or seasonal average maximum temperature. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='maxt'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_max_temp",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_min_temp",
    "folder": "Climate Observations.Temperature",
    "name": "Minimum Temperatures - Average (Observed)",
    "sectors": ["All Sectors"],
    "description": "Average minimum temperature summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_min_temp",
    "folder": "Climate Projections.Temperature",
    "name": "Minimum Temperatures - Average (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in annual or seasonal average minimum temperature. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='mint'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_min_temp",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_temp_lt_0",
    "folder": "Climate Observations.Temperature",
    "name": "Days < 0 &deg;F (Observed)",
    "sectors": ["All Sectors"],
    "description": "Days with minimum temperatures below 0&deg;F summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_temp_lt_0",
    "folder": "Climate Projections.Temperature",
    "name": "Days < 0 &deg;F (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in the number of days per season or annually with temperature below threshold values. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='mint_lt_0'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_temp_lt_0",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_temp_lt_32",
    "folder": "Climate Observations.Temperature",
    "name": "Days < 32 &deg;F (Observed)",
    "sectors": ["All Sectors"],
    "description": "Days with minimum temperatures below 32&deg;F summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_temp_lt_32",
    "folder": "Climate Projections.Temperature",
    "name": "Days < 32 &deg;F (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in the number of days per season or annually with temperature below threshold values. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='min_lt_32'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_temp_lt_32",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_temp_gt_90",
    "sort_key": 'Days > 090',
    "folder": "Climate Observations.Temperature",
    "name": "Days > 90 &deg;F (Observed)",
    "sectors": ["All Sectors"],
    "description": "Days with maximum temperatures above 90&deg;F summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_temp_gt_90",
    "sort_key": 'Days > 090',
    "folder": "Climate Projections.Temperature",
    "name": "Days > 90 &deg;F (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in the number of days per season or annually with temperature above threshold values. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='maxt_gt_90'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_temp_gt_90.zip",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_temp_gt_95",
    "sort_key": 'Days > 095',
    "folder": "Climate Observations.Temperature",
    "name": "Days > 95 &deg;F (Observed)",
    "sectors": ["All Sectors"],
    "description": "Days with maximum temperatures above 95&deg;F summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_temp_gt_95",
    "folder": "Climate Projections.Temperature",
    "sort_key": 'Days > 095',
    "name": "Days > 95 &deg;F (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in the number of days per season or annually with temperature above threshold values. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2095s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='maxt_gt_95'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_temp_gt_95",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_temp_gt_100",
    "sort_key": 'Days > 100',
    "folder": "Climate Observations.Temperature",
    "name": "Days > 100 &deg;F (Observed)",
    "sectors": ["All Sectors"],
    "description": "Days with maximum temperatures above 100&deg;F summarized by area (county,basin) and decade over the period 1980-2010. Observational data: A spatially comprehensive, meteoroLogical data set for Mexico, the U.S., and Southern CAnada (Livneh et al., 2015)",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_temp_gt_100",
    "sort_key": 'Days > 100',
    "folder": "Climate Projections.Temperature",
    "name": "Days > 100 &deg;F (Projected)",
    "sectors": ["All Sectors"],
    "description": "Projected changes in the number of days per season or annually with temperature above threshold values. Changes are relative to the 1971-2000 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (20100s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='maxt_gt_100'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_temp_gt_100",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_heating_degree_days",
    "folder": "Climate Observations.Degree Days",
    "name": "Heating Degree Days (Observed)",
    "sectors": ["All Sectors"],
    "description": " Average heating degree-days summarized by area (county,basin) and decade over the period 1980-2010. <br>Definition:  Heating degree-days are based on the assumption that when the outside temperature is above 65°F, we don't need heating to be comfortable. Heating degree days are the difference between the daily temperature mean and 65°F.  For example, if the mean temperature mean is 25°F, we subtract the mean from 65 and the result is 40 heating degree-days for that day. (Definition adapted from National Weather Service)<br>   Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_heating_degree_days",
    "folder": "Climate Projections.Degree Days",
    "name": "Heating Degree Days (Projected)",
    "sectors": ["All Sectors"],
    "description": " Projected changes in annual or seasonal mean heating degree-days.  Heating degree-days are based on the assumption that when the outside temperature is above 65°F, we don't need heating to be comfortable. Heating degree days are the difference between the daily temperature mean and 65°F.  For example, if the mean temperature mean is 25°F, we subtract the mean from 65 and the result is 40 heating degree-days for that day. (Definition adapted from National Weather Service)<br>  Projected changes are relative to the 1981-2010 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='hdd'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_heating_degree_days",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_cooling_degree_days",
    "folder": "Climate Observations.Degree Days",
    "name": "Cooling Degree Days (Observed)",
    "sectors": ["All Sectors"],
    "description": " Average cooling degree-days summarized by area (county,basin) and decade over the period 1980-2010. <br>Definition: Cooling degree days are based on the assumption that when the outside temperature is below 65°F, we don't need cooling (air-conditioning) to be comfortable. Cooling degree-days are the difference between the daily temperature mean and 65°F.  For example, if the temperature mean is 85°F, we subtract 65 from the mean and the result is 20 cooling degree-days for that day. (Definition adapted from National Weather Service) <br>  Observational data: A spatially comprehensive, meteorological data set for Mexico, the U.S., and southern Canada (Livneh et al., 2015).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/degree_days.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_cooling_degree_days",
    "folder": "Climate Projections.Degree Days",
    "name": "Cooling Degree Days (Projected)",
    "sectors": ["All Sectors"],
    "description": " Projected changes in annual or seasonal mean cooling degree-days.  Cooling degree days are based on the assumption that when the outside temperature is below 65°F, we don't need cooling (air-conditioning) to be comfortable. Cooling degree-days are the difference between the daily temperature mean and 65°F.  For example, if the temperature mean is 85°F, we subtract 65 from the mean and the result is 20 cooling degree-days for that day. (Definition adapted from National Weather Service) <br> Projected changes are relative to the 1981-2010 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='cdd'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_cooling_degree_days",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "observed_growing_degree_days",
    "folder": "Climate Observations.Degree Days",
    "name": "Growing Degree Days (Observed)",
    "sectors": ["All Sectors"],
    "description": " Average growing degree-days summarized by area (county,basin) and decade over the period 1980-2010. <br>Definition: A growing degree day (GDD) is an index used to express crop maturity. The index is computed by subtracting a base temperature of 50°F from the average of the maximum and minimum temperatures for the day. Minimum temperatures less than 50°F are set to 50, and maximum temperatures greater than 86°F are set to 86. These substitutions indicate that no appreciable growth is detected with temperatures lower than 50° or greater than 86°. (Adapted from National Weather Service) <br>  Observational data: A spatially comprehensive, meteorological data set for Mexico, the U.S., and southern Canada (Livneh et al., 2015).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    //"download_url": "https://repository.nescaum-ccsc-dataservices.com/data/ma/degree_days.json",
    "metadata_url": "http://loca.ucsd.edu/"
  },
  {
    "id": "projected_growing_degree_days",
    "folder": "Climate Projections.Degree Days",
    "name": "Growing Degree Days (Projected)",
    "sectors": ["All Sectors"],
    "description": " Projected changes in annual or seasonal mean growing degree-days.  A growing degree day (GDD) is an index used to express crop maturity. The index is computed by subtracting a base temperature of 50°F from the average of the maximum and minimum temperatures for the day. Minimum temperatures less than 50°F are set to 50, and maximum temperatures greater than 86°F are set to 86. These substitutions indicate that no appreciable growth is detected with temperatures lower than 50° or greater than 86°. (Definition adapted from National Weather Service) <br>  Projected changes are relative to the 1981-2010 mean, calculated for four periods 2020-2049 (2030s), 2040-2069 (2050s), 2060-2089 (2070s), 2080-2099 (2090s). The projections are derived from statistically downscaled (LOCA method) CMIP5 daily data. Data Source: Statistically downscaled CMIP5 daily Climate Observations using Localized Constructed Analogs (LOCA; Pierce et al., 2014).",
    "source": "University of California San Diego as provided by the Northeast Regional Climate Center Applied Climate Information System (ACIS) at Cornell University (rcc-acis.org)",
    "source_url": "http://loca.ucsd.edu/",
    "download_url": "https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ny/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ny:climate_data_projected_download&CQL_FILTER=var_name='gdd'&maxFeatures=1000&outputFormat=SHAPE-ZIP&format_options=filename:projected_growing_degree_days",
    "metadata_url": "http://loca.ucsd.edu/"
  },
    {
      "id": "public_environmental_justice_areas",
      "folder": "Public Health",
      "name": "Potential Environmental Justice Areas",
      "description": "As established in DEC Commissioner Policy 29 on Environmental Justice and Permitting (CP-29), Potential EJ Areas are 2000 U.S. Census block groups of 250 to 500 households each that, in the 2000 Census, had populations that met or exceeded at least one of the following statistical thresholds: 1) At least 51.1% of the population in an urban area reported themselves to be members of minority groups; or 2) At least 33.8% of the population in a rural area reported themselves to be members of minority groups; or 3) At least 23.59% of the population in an urban or rural area had household incomes below the federal poverty level.",
      "source": "NYS DEC",
      "source_url": "http:\/\/www.dec.ny.gov\/public\/899.html",
      "sectors": ["Public Health"],
      "download_url": "http:\/\/www.dec.ny.gov\/maps\/pejalink.kmz",
      "metadata_url": "http:\/\/www.dec.ny.gov\/public\/899.html",
    },
    /*
    {
      "id": "power_stations",
      "folder": "Energy/Communications",
      "name": "Power Plants",
      "description": "Power plants, by fuel type.",
      "source_url": "http://www.eia.gov/state/?sid=NY",
      "sectors": "Energy",
      "download_url": null,
      "metadata_url": "http://www.eia.gov/state/?sid=NY",
    },
    */
    {
      "id": "primary_aquifers",
      "folder": "Water Resources",
      "name": "Aquifers - Primary",
      "description": "This layer shows the location of primary aquifers in New York State. Primary aquifers are highly productive aquifers presently being utilized as sources of water supply by major municipal water supply systems.",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1232",
      "sectors": ["Ecosystems","Water Resources"],
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:primary_aquifers&format=image\/png"),
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1232&file=primaryaquifers.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.primary.aquifers.shp.xml",
    },
    {
      "id": "railroad_junctions",
      "folder": "Transportation",
      "name": "Railroad Junctions",
      "description": "Point shapefile of railroad junctions and locations. ",
      "source": "NYS DOT",
      "source_url": "https:\/\/www.dot.ny.gov\/index",
      "sectors": ["Transportation"],
      "download_url": "http://gis.ny.gov/gisdata/fileserver/?DSID=1102&file=Rail_Place_Locations.zip",
      "metadata_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1102"
    },
    {
      "id": "railroad_passenger_stations",
      "folder": "Transportation",
      "name": "Railroad Stations",
      "description": "Point shapefile of railroad passenger stations.",
      "source": "NYS DOT",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1263",
      "sectors": ["Transportation"],
      "download_url": "http://gis.ny.gov/gisdata/fileserver/?DSID=1263&file=PassengerStations.zip",
      "metadata_url": "http://gis.ny.gov/gisdata/metadata/dot.PassengerStations.shp.xml"
    },
    {
      "id": "railroads",
      "folder": "Transportation",
      "name": "Railroads",
      "description": "Line shapefile of active railroad lines. UTM NAD 83 Zone 18. Copyright 2001 by NYS Dept of Transportation.",
      "source": "NYS DOT",
      "source_url": "https:\/\/www.dot.ny.gov\/index",
      "sectors": ["Transportation"],
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=904&file=NYSDOTRailroad_May2013.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/dot.Railroad.shp.xml"
    },
    {
      "id": "rare_plants_and_animals",
      "folder": "Ecosystems",
      "name": "Rare Plants and Animals",
      "description": "NHP Predicted Future/Current/Delta Species Richness - Species richness of rare species (# species) within each 30m grid cell within NY State for rare species tracked by the NY Natural Heritage Program. Data represent total species or broken down by taxonomic or regulatory groups, based on predicted suitable habitat occurring under current or future climatic and landuse conditions using EDM models developed by NYNHP. Changes in species richness represent the difference between future and current predicted richness. These data represent predicted species richness assuming species precense within predicted suitable habitat. These data do not represent actual species richness based on known occurances.",
      "source": "'Natural Resource Navigator / NY Climate Adaptation",
      "source_url": "http://maps.naturalresourcenavigator.org/",
      "metadata_url": "",
      "sectors": ["Ecosystems"],
    },
    {
      "id": "regulated_wells",
      "folder": "Energy/Communications",
      "name": "Regulated Wells",
      "description": "This dataset contains locations of regulated wells. The Division of Mineral Resources maintains information and data on over 40,000 wells, categorized under New York State Article 23 Regulated wells. The dataset reflects the status of the wells as of the previous business day. The location data has not been field verified but is expected to be within 100 meters of the actual well location. The data should not be used for precise determination of distances to buildings, property boundaries or other features. This is a public dataset. Wells currently afforded confidential status are plotted but confidential data is redacted. ",
      "source": "GIS NY State",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1272",
      "metadata_url": "http://gis.ny.gov/gisdata/metadata/nysdec.dmn.oil.gas.well.forportal_prod.xml",
      "sectors": ["Energy"]
    },
    {
      "id": "remediation_sites",
      "folder": "Critical Infrastructure",
      "name": "Remediation Sites",
      "description": "The points in this file represent only the existence of a site which has cleanup currently, or has undergone cleanup under the oversight of NYS DEC. This dataset includes a single point location for a subset of sites which are currently included in one of the Remedial Programs being overseen by the Division of Environmental Remediation.",
      "source": "NYS DEC",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1097",
      "sectors": ["Public Health"],
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:remediation_sites&format=image/png"),
      "download_url": "http:\/\/www.dec.ny.gov\/derdata\/remedsiteborders.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.remedsite_borders_export.html"
    },
    {
      "id": "sandy_surge",
      "folder": "Coastal Zones",
      "name": "Hurricane Sandy Surge Extent",
      "description": "Final High Resolution (3 and 1 meter) Hurricane Sandy Storm Surge Extents, Field Verified HWMs and SSs Data 0214 ",
      "source": "FEMA",
      "source_url": "http:\/\/services.femadata.com\/",
      "sectors": ["All Sectors"],
      "download_url": null,
      "metadata_url": "http:\/\/services.femadata.com\/arcgis\/rest\/services\/2012_Sandy\/SurgeBoundaries_Final_0214\/MapServer",
    },
    {
      "id": "sewer_overflows",
      "folder": "Water Resources",
      "name": "Sewer Overflows",
      "description": "The dataset represents the locations of combined sewer overflow (CSOs) outfall locations in NYS. It also includes overflow detection capabilities of CSO communities and overflow frequency data within a specified timeframe.",
      "source": "NYS Office of Information Technology Services",
      "source_url": "https:\/\/data.ny.gov\/Energy-Environment\/Combined-Sewer-Overflows-CSOs-Map\/i8hd-rmbi",
      "sectors": ["Water Resources","Public Health"],
      "legend_url": "./img\/sewer-overflows.png",
      "download_url": "https:\/\/data.ny.gov\/resource\/5d4q-pk7d.geojson",
      "metadata_url": "https:\/\/data.ny.gov\/Energy-Environment\/Combined-Sewer-Overflows-CSOs-Map\/i8hd-rmbi"
    },
    {
      "id": "spdes",
      "folder": "Water Resources",
      "name": "Waste Treatment Plants",
      "description": "The State Pollutant Discharge Elimination System (SPDES) permit program in the Department's Division of Water regulates municipal and industrial wastewater treatment facilities that discharge directly into navigable waters. ",
      "source": "NYS DEC",
      "source_url": "https:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1010",
      "sectors": ["Water Resources","Public Health"],
      "download_url": "https:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1010&file=spdes.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.spdes.xml"
    },
    {
      "id": "sovi",
      "folder": "Public Health",
      "name": "Social Vulnerability Index for U.S. Coastal States",
      "description": "The Social Vulnerability Index (SoVI) 2006-10 measures the social vulnerability of U.S. counties to environmental hazards. The index is a comparative metric that facilitates the examination of the differences in social vulnerability among counties. SoVI is a valuable tool for policy makers and practitioners. It graphically illustrates the geographic variation in social vulnerability. It shows where there is uneven capacity for preparedness and response and where resources might be used most effectively to r",
      "source": "NOAA Office For Coastal Management",
      "source_url": "http:\/\/catalog.data.gov\/dataset\/social-vulnerability-index-sovi-for-the-u-s-coastal-states-based-on-the-2010-census-tracts",
      "sectors": ["Water Resources", "Coastal Zones"],
      "download_url": null,
      "metadata_url": "http:\/\/catalog.data.gov\/dataset\/social-vulnerability-index-sovi-for-the-u-s-coastal-states-based-on-the-2010-census-tracts"
    },
    {
      "id": "soils",
      "folder": "Ecosystems",
      "name": "Soils & Surficial Geology",
      "description": "The topographic moisture potential for the conterminous United States was derived to help contribute substrate moisture regimes into the ecosystems model (Cress and others, 2009c). The method used to produce these topographic moisture potential classes was based on the derivation of ground moisture potential using a combination of computed topographic characteristics (CTI, slope, and aspect) and mapped National Wetland Inventory boundaries. This method does not use climate or soil attributes to calculate relative topographic moisture potential since these characteristics are incorporated into the ecosystem model though other input layers. All of the topographic data used for this assessment was derived from the USGS 30-meter NED including the National Compound Topographic Index.",
      "source": "USGS Geosciences and Environmental Change Science Center",
      "source_url": "https:\/\/catalog.data.gov\/dataset\/terrestrial-ecosystems-topographic-moisture-potential-of-the-conterminous-united-states",
      "sectors": ["Agriculture","Ecosystems"],
      "download_url": null,
      "metadata_url": "https:\/\/catalog.data.gov\/dataset\/terrestrial-ecosystems-topographic-moisture-potential-of-the-conterminous-united-states",
    },
    {
      "id": "spdes",
      "folder": "Water Resources",
      "name": "Waste Treatment Plants",
      "description": "The State Pollutant Discharge Elimination System (SPDES) permit program in the Department's Division of Water regulates municipal and industrial wastewater treatment facilities that discharge directly into navigable waters. ",
      "source": "NYS DEC",
      "source_url": "https:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1010",
      "sectors": ["Water Resources","Public Health"],
      "download_url": "https:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1010&file=spdes.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.spdes.xml"
    },
    {
      "id": "subway_lines",
      "folder": "Transportation",
      "name": "NYC Subways",
      "description": "NY Metropolitan Subway Lines",
      "source": "Spatiality Blog",
      "source_url": "http:\/\/spatialityblog.com\/2010\/07\/08\/mta-gis-data-update\/#datalinks",
      "sectors": ["Transportation"],
      "download_url": "https:\/\/wfs.gc.cuny.edu\/SRomalewski\/MTA_GISdata\/June2010_update\/nyctsubwayroutes_100627.zip"
    },
    {
      "id": "superfund",
      "folder": "Critical Infrastructure",
      "name": "Superfund Sites",
      "description": "The Agency for Toxic Substances and Disease Registry (ATSDR) Hazardous Waste Site Polygon Data with CIESIN Modifications, Version 2 is a database providing georeferenced data for 1,572 National Priorities List (NPL) Superfund sites",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/superfund-atsdr-hazardous-waste-site-ciesin-mod-v2",
      "sectors": "",
      "legend_url": "http:\/\/sedac.ciesin.columbia.edu\/geoserver\/wms?request=GetLegendGraphic&LAYER=superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2&format=image\/png",
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/superfund-atsdr-hazardous-waste-site-ciesin-mod-v2"
    },
  {
    "id": "thruway_bridges",
    "folder": "Transportation",
    "name": "Thruway Bridges",
    "description": "Statewide file showing the locations of all Thruway bridges. Includes bridges that the Thruway maintains, but may be owned by other entities.",
    "source": "New York State Trhuway Authority",
    "source_url": "http://www.thruway.ny.gov/index.shtml",
    "sectors": ["Agriculture", "Ecosystems"],
    "download_url": "http://gis.ny.gov/gisdata/fileserver/?DSID=438&file=NYSTA_Bridges.gdb.zip",
    "metadata_url": "http://gis.ny.gov/gisdata/metadata/NYSTA-Bridges.xml",
  },
  {
    "id": "tree_atlas",
    "folder": "Ecosystems",
    "name": "USFS Climate Change Atlas - Tree Species",
    "description": "Modeled importance value (IV) of 20 New York native tree species for three climate conditions: 1) current climate (1961-1990 average); 2) future climate (2071-2100 average) with IPCC scenario B1 (significant conservation and reduction of CO2 emissions); and 3) future climate (2071-2100 average) with IPCC scenario A1FI (high emissions, no modification in current emission trends). Importance Value measures the dominance of a tree species in a forest, based on the relative frequency, density, and basal area of the species. For more information on the models and to explore more tree species and climate scenarios, visit the US Forest Service Climate Change Atlas: http://www.fs.fed.us/nrs/atlas/",
    "source": "USDA Forest Service Northern Research Station",
    "source_url": "http:\/\/www.fs.fed.us\/nrs\/atlas\/",
    "sectors": ["Agriculture", "Ecosystems"],
    "download_url": null,
    "metadata_url": null,
  },
  {
      "id": "trout_streams",
      "folder": "Ecosystems",
      "name": "Designated Trout Streams",
      "description": "New York State Department of Environmental Conservation Water Quality Classifications dataset. The symbol (T or TS) after any class designation means that designated waters are trout waters (T) or suitable for trout spawning (TS).",
      "source": "NYS DEC",
      "source_url": "https://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1118",
      "sectors": ["Ecosystems"],
      "legend_url": CDN("http://52.2.5.122:8080/geoserver/wms?request=GetLegendGraphic&LAYER=nyccsc:trout_streams&format=image/png"),
      "download_url": null,
      "metadata_url": null
    },
    {
      "id": "usgs_streamflow",
      "folder": "Water Resources",
      "name": "USGS Stream Gages",
      "description": "This layer depicts the location and current status of US Geological Survey stream gauges across NYS. An active link with the USGS database provides real-time data, updated hourly.  For more information on a specific guage, click on the map icon, which will provide detailed information and a link to the USGS page for that gauge.",
      "source": "USGS",
      "source_url": "http:\/\/waterwatch.usgs.gov\/index.php?r=ny&id=ww_current",
      "sectors": "Water Resources",
      "download_url": "http:\/\/waterwatch.usgs.gov\/download\/?gt=map&mt=real&st=ny&dt=site&ht=&fmt=csv",
      "metadata_url": "http:\/\/waterwatch.usgs.gov\/index.php?r=ny&id=ww_current"
    },
    {
      "id": "wtrcls_line",
      "folder": "Water Resources",
      "name": "DEC Water Quality Classifications-Lines",
      "description": "This NYS DEC data set provides the water quality classifications of New York State's lakes, rivers, streams and ponds, collectively referred to as water bodies. All water bodies in the state are provided a water quality classification based on existing, or expected best usage, of each water body or water body segment. Under New York State's Environmental Conservation Law (ECL), Title 5 of Article 15, certain waters of the state are protected on the basis of their classification. Streams and small water bodies located in the course of a stream that are designated as C (T) or higher (i.e., C (TS), B, or A) are collectively referred to as 'protected streams.'",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1118",
      "sectors": "Ecosystems,Water Resources",
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:wtrcls_line&format=image\/png"),
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1118&file=nysdec_wtrcls.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.wtrcls.xml"
    },
    {
      "id": "wtrcls_poly",
      "folder": "Water Resources",
      "name": "DEC Water Quality Classifications-Polygons",
      "description": "This NYS DEC data set provides the water quality classifications of New York State's lakes, rivers, streams and ponds, collectively referred to as water bodies. All water bodies in the state are provided a water quality classification based on existing, or expected best usage, of each water body or water body segment. Under New York State's Environmental Conservation Law (ECL), Title 5 of Article 15, certain waters of the state are protected on the basis of their classification. Streams and small water bodies located in the course of a stream that are designated as C (T) or higher (i.e., C (TS), B, or A) are collectively referred to as 'protected streams.'",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1118",
      "sectors": "Ecosystems,Water Resources",
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:wtrcls_poly&format=image\/png"),
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1118&file=nysdec_wtrcls.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.wtrcls.xml"
    },
];

var desired_active_on_load = [

];

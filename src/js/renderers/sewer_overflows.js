RendererTemplates.geojson_points('sewer_overflows',  {
  parameters: {
    // No Opacity, b/c it doesn't work on the markers.
    opacity: false,
    no_sorting: true
  },
  clustering: {
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 11,
      iconCreateFunction: function (cluster) {
        return new L.DivIcon({
          html: cluster.getChildCount(),
          className: 'sewer_overflowsCluster',
          iconSize: new L.Point(50,48)
        });
      }
  },
  url: CDN("https://api.nescaum-ccsc-dataservices.com/ny.sewer_overflows.geojson"),

  pointToLayer: function (active_layer, feature, latlng) {
      return L.marker(latlng, {
          icon: L.icon({
              iconUrl: './img/icons/sewer-overflows.png',
              iconSize: [18, 21],
              iconAnchor: [12, 28],
              opacity: 0,
              popupAnchor: [0, -25]
          }),
          title: feature.properties.name
      });
  },

  popupContents: function (feature) {
    let link = "";
    if (feature.properties.link_to_real_time_information) {
      link = `<a target="_blank" href="${feature.properties.link_to_real_time_information}">
            <strong>Link to real-time information</strong>
          </a>`;
    }
    return `
        <strong>Facility:</strong>
          ${feature.properties.facility_name} <br/>
        <strong>Owner: </strong>
          ${feature.properties.facility_owner_name} <br/>
        <strong># Of Overflow Events: </strong>
          ${feature.properties.number_of_overflow_events} <br/>
        <strong># Of Permitted Outfalls: </strong>
          ${feature.properties.number_of_permitted_outfalls} <br/>
        <strong>Outfall #: </strong>
          ${feature.properties.outfall_number}
          <br/>
        <strong>Receiving Waterbody:</strong>
          ${feature.properties.receiving_waterbody_name}
          <br/>
        <strong>Permit #: </strong>
          ${feature.properties.spdes_permit_number}
          <br/>
        ${link}
        <br>` +
        Renderers.utils.zoom_to_location_link(feature.geometry);
  },

  legend_template: `
      <div class='detail-block show-confidence'>
        <label> Showing: </label>
        <div style='text-align: center'>
          <div class='sewer_overflowsCluster' style='display: inline-block'>
            {{parameters.total_shown}}
          </div>
          <span class='legend-text'> Number of sewer overflows shown </span>
        </div>
      </div>
  `

});

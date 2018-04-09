(() => {
  let _url = CDN("https://data.ny.gov/resource/5d4q-pk7d.geojson")

  let _layer = "ny:sewer_overflows";

  RendererTemplates.geojson_points('sewer_overflows',  {
    parameters: {
      opacity: false,
      no_sorting: true
    },

    url: _url,

    clustering: {
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 40,
      disableClusteringAtZoom: 10,
      iconCreateFunction: function (cluster) {
        return new L.DivIcon({
          html: cluster.getChildCount(),
          className: 'sewer_overflowsCluster',
          iconSize: new L.Point(35,35)
        });
      }
    },

    pointToLayer: function (active_layer, feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconAnchor: [12, 28],
                iconSize: [16, 18],
                iconUrl: './img/icons/sewer-overflowsCluster.png',
                opacity: 0,
                popupAnchor: [0, -25]
            }),
            title: feature.properties.name
        });
    },
    popupContents: function (feature) {
        return `
          <strong>Facility:</strong> ${feature.properties.facility_name}<br/>
          <strong>Owner: </strong>${feature.properties.facility_owner_name}<br/>
          <strong># Of Overflow Events: </strong>${feature.properties.number_of_overflow_events}<br/>
          <strong># Of Permitted Outfalls: </strong>${feature.properties.number_of_permitted_outfalls}<br/>
          <strong>Outfall #: </strong>${feature.properties.outfall_number}<br/>
          <strong>Receiving Waterbody:</strong> ${feature.properties.receiving_waterbody_name}<br/>
          <strong>Permit #: </strong>${feature.properties.spdes_permit_number}<br/>
          ${Renderers.utils.zoom_to_location_link(feature.geometry)}
      `;
    },

    legend_template: `
      <div class='detail-block'>
        <label>Legend</label>
      </div>
      <div class='detail-block clusterlegend'>
        <img src="./img/icons/sewer-overflowsCluster.png"/>
        <br/>
        <span class='legend-text'>
          <strong>1940</strong>&nbsp;&nbsp;&nbsp; Number of sewer overflows shown
        </span>
      </div>
    `
  });
})();

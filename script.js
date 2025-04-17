mapboxgl.accessToken = 'pk.eyJ1IjoiYWgzODYzIiwiYSI6ImNtOWJ2ZzJoMDBreHIyanBuYmFvb3lvam0ifQ.Zeg12vyxmHuz86vEocSGdw'; 

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11', // or 'streets-v11'
  center: [-73.9851, 40.7589], // Times Square as a central reference point
  zoom: 11
});

map.on('load', () => {
  map.addSource('zoning', {
    type: 'geojson',
    data: 'limited_height.geojson'
  });

  map.addLayer({
    id: 'zoning-layer',
    type: 'fill',
    source: 'zoning',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'max_height'], // Adjust based on actual property name in GeoJSON
        0, '#edf8fb',
        50, '#b2e2e2',
        100, '#66c2a4',
        150, '#2ca25f',
        200, '#006d2c'
      ],
      'fill-opacity': 0.6
    }
  });

  map.addLayer({
    id: 'zoning-outline',
    type: 'line',
    source: 'zoning',
    paint: {
      'line-color': '#333',
      'line-width': 1
    }
  });

  map.on('click', 'zoning-layer', (e) => {
    const props = e.features[0].properties;
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<strong>Zoning Code:</strong> ${props.zoning}<br/><strong>Max Height:</strong> ${props.max_height} ft`)
      .addTo(map);
  });

  map.on('mouseenter', 'zoning-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'zoning-layer', () => {
    map.getCanvas().style.cursor = '';
  });
});

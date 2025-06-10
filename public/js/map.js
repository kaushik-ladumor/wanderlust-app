mapboxgl.accessToken = mapToken;

const parsedCoordinates =
  listing.geometry && Array.isArray(listing.geometry.coordinates)
    ? listing.geometry.coordinates
    : [0, 0];

const map = new mapboxgl.Map({
  container: "map", // Bootstrap handles the width
  style: "mapbox://styles/mapbox/streets-v11",
  center: parsedCoordinates,
  zoom: 10,
});

// Responsive Resize Handler (optional but helpful for mobile)
map.on('load', () => {
  map.resize();
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(parsedCoordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div>
        <h6 class="mb-1">${listing.location}</h6>
        <p class="mb-0 text-muted">Exact location provided after booking.</p>
      </div>
    `)
  )
  .addTo(map);

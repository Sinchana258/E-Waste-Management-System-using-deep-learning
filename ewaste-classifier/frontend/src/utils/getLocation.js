// src/utils/getLocation.js

export default function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: [position.coords.longitude, position.coords.latitude],
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        resolve(null); // Fallback handled in component
      }
    );
  });
}

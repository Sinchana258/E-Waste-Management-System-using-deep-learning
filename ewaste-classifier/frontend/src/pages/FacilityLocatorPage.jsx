import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Popup } from "mapbox-gl";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaDirections,
    FaRecycle,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaClock,
} from "react-icons/fa";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import getLocation from "../utils/getLocation";
import { calculateDistance } from "../utils/calculateLocation";
import { facility } from "../data/facility";

const FacilityLocatorPage = () => {
    const [facilityData, setFacilityData] = useState([]);
    const [clientLocation, setClientLocation] = useState(null); // [lon, lat]
    const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterVerified, setFilterVerified] = useState(false);
    const [filterDistance, setFilterDistance] = useState(null);

    const cardContainerRef = useRef(null);
    const mapContainerRef = useRef(null);
    const markersRef = useRef([]);
    const mapRef = useRef(null);
    const userMarkerRef = useRef(null);

    // 🔑 1. Setup Mapbox token & get user location
    useEffect(() => {
        mapboxgl.accessToken =
            "pk.eyJ1Ijoic2h1ZW5jZSIsImEiOiJjbG9wcmt3czMwYnZsMmtvNnpmNTRqdnl6In0.vLBhYMBZBl2kaOh1Fh44Bw";

        document.title = "E-Locate | E-Waste Facility Locator";

        setIsLoading(true);
        getLocation().then((coordinates) => {
            if (coordinates) {
                setClientLocation(coordinates.coordinates);
            } else {
                // Fallback: somewhere in Maharashtra (your default)
                setClientLocation([75.7139, 19.7515]);
            }
            setIsLoading(false);
        });
    }, []);

    const handleAllowLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    // Just refresh to re-trigger getLocation()
                    window.location.reload();
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("User denied the request for location.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            console.error("The request to get user location timed out.");
                            break;
                        default:
                            console.error("An unknown error occurred.");
                            break;
                    }
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Helper: filter facilities based on current filters
    const filteredFacilities = () => {
        if (!facilityData.length) return [];

        let filtered = [...facilityData];

        if (filterVerified) {
            filtered = filtered.filter((f) => f.verified);
        }

        if (filterDistance !== null) {
            filtered = filtered.filter((f) => f.distance <= filterDistance);
        }

        return filtered;
    };

    // 🔑 2. Initialize map & markers once we have clientLocation
    useEffect(() => {
        if (!clientLocation) return;

        // 1. Sort facilities by distance from current location
        const sortedFacilities = facility
            .map((f) => ({
                ...f,
                distance: calculateDistance(
                    clientLocation[1],
                    clientLocation[0],
                    f.lat,
                    f.lon
                ),
            }))
            .sort((a, b) => a.distance - b.distance);

        setFacilityData(sortedFacilities);

        // 2. Create map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: clientLocation,
            zoom: 10,
        });

        mapRef.current = map;

        // 3. Add geocoder search
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            placeholder: "Search for your location",
        });

        map.addControl(geocoder);

        geocoder.on("result", (event) => {
            const { geometry, place_name } = event.result;

            if (geometry && geometry.coordinates) {
                const center = geometry.coordinates;

                // Remove previous user marker if any
                if (userMarkerRef.current) {
                    userMarkerRef.current.remove();
                }

                const selectedLocationMarker = new mapboxgl.Marker({
                    color: "#3366ff",
                    scale: 1.2,
                })
                    .setLngLat(center)
                    .addTo(map);

                userMarkerRef.current = selectedLocationMarker;

                const popup = new Popup().setHTML(
                    `<div class="p-2">
            <h3 class="font-bold text-indigo-600 text-lg mb-1">Selected Location</h3>
            <p class="text-sm text-gray-700">Address: ${place_name || "Address not available"
                    }</p>
          </div>`
                );

                selectedLocationMarker.setPopup(popup);

                // Recalculate distances based on searched location
                const recalculated = facility
                    .map((f) => ({
                        ...f,
                        distance: calculateDistance(center[1], center[0], f.lat, f.lon),
                    }))
                    .sort((a, b) => a.distance - b.distance);

                setFacilityData(recalculated);
                setClientLocation([center[0], center[1]]);

                // Automatically route to nearest facility
                const nearest = recalculated[0];
                getDirections(center, [nearest.lon, nearest.lat]);
                setSelectedFacilityIndex(0);
            }
        });

        // 4. Navigation controls
        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

        // 5. User marker
        const userMarker = new mapboxgl.Marker({
            color: "#3366ff",
            scale: 1.2,
        })
            .setLngLat(clientLocation)
            .addTo(map);

        const userPopup = new Popup().setHTML(
            `<div class="p-2">
        <h3 class="font-bold text-indigo-600 text-lg mb-1">Your Location</h3>
      </div>`
        );

        userMarker.setPopup(userPopup);
        userMarkerRef.current = userMarker;

        // 6. Facility markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        sortedFacilities.forEach((f, index) => {
            const popup = new Popup().setHTML(
                `<div class="p-3">
          <h3 class="font-bold text-emerald-600 text-xl mb-2">${f.name}</h3>
          <div class="flex items-center text-sm mb-1">
            <span class="font-semibold mr-2">Capacity:</span>
            <span>${f.capacity} tons/month</span>
          </div>
          <div class="flex items-start text-sm mb-1">
            <span class="font-semibold mr-2">Address:</span>
            <span>${f.address}</span>
          </div>
          <div class="flex items-center text-sm mb-1">
            <span class="font-semibold mr-2">Contact:</span>
            <span>${f.contact}</span>
          </div>
          <div class="flex items-center text-sm mb-1">
            <span class="font-semibold mr-2">Hours:</span>
            <span>${f.time}</span>
          </div>
          <div class="flex items-center text-sm font-medium text-indigo-600">
            <span>${f.distance.toFixed(2)} km from your location</span>
          </div>
        </div>`
            );

            const marker = new mapboxgl.Marker({
                color: f.verified ? "#10b981" : "#f97316",
                scale: 1,
            })
                .setLngLat([f.lon, f.lat])
                .setPopup(popup)
                .addTo(map);

            markersRef.current.push(marker);

            marker.getElement().addEventListener("click", () => {
                const popup = marker.getPopup();
                if (popup) {
                    if (popup.isOpen()) {
                        popup.remove();
                    } else {
                        popup.addTo(mapRef.current);
                    }
                }
                setSelectedFacilityIndex(index);
            });

            popup.on("close", () => {
                setSelectedFacilityIndex(null);
            });
        });

        return () => {
            map.remove();
        };
    }, [clientLocation]);

    // 🔑 3. Visually highlight selected marker
    useEffect(() => {
        if (!markersRef.current || !mapRef.current) return;

        markersRef.current.forEach((marker, index) => {
            const el = marker.getElement();
            if (!el) return;

            el.className = `mapboxgl-marker mapboxgl-marker-anchor-center ${selectedFacilityIndex === index ? "pulse-marker" : ""
                }`;

            if (selectedFacilityIndex === index) {
                el.style.transform = `translate(-50%, -50%) scale(1.2)`;
            } else {
                el.style.transform = `translate(-50%, -50%) scale(1.0)`;
            }
        });
    }, [selectedFacilityIndex]);

    // 🔑 4. Directions using Mapbox Directions API
    const getDirections = async (origin, destination) => {
        try {
            const res = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=true&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`
            );

            const data = await res.json();

            if (data.code === "Ok" && mapRef.current) {
                const distanceInKm = data.routes[0].distance / 1000;
                const durationInMinutes = Math.ceil(data.routes[0].duration / 60);

                const directionsLayerId = "directions";

                if (mapRef.current.getLayer(directionsLayerId)) {
                    mapRef.current.removeLayer(directionsLayerId);
                    mapRef.current.removeSource(directionsLayerId);
                }

                mapRef.current.addSource(directionsLayerId, {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: data.routes[0].geometry,
                    },
                });

                mapRef.current.addLayer({
                    id: directionsLayerId,
                    type: "line",
                    source: directionsLayerId,
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#4f46e5",
                        "line-width": 5,
                        "line-opacity": 0.75,
                    },
                });

                const bounds = new mapboxgl.LngLatBounds();
                data.routes[0].geometry.coordinates.forEach((coord) =>
                    bounds.extend(coord)
                );
                mapRef.current.fitBounds(bounds, { padding: 60 });

                const midPoint =
                    data.routes[0].geometry.coordinates[
                    Math.floor(data.routes[0].geometry.coordinates.length / 2)
                    ];

                new mapboxgl.Popup({
                    closeButton: true,
                    closeOnClick: false,
                    offset: 25,
                    className: "directions-popup",
                })
                    .setLngLat(midPoint)
                    .setHTML(
                        `<div class="p-3">
              <h3 class="font-bold text-indigo-600 text-lg mb-1">Route Information</h3>
              <p class="text-md mb-1">Distance: <span class="font-semibold">${distanceInKm.toFixed(
                            2
                        )} km</span></p>
              <p class="text-md">Estimated time: <span class="font-semibold">${durationInMinutes} minutes</span></p>
            </div>`
                    )
                    .addTo(mapRef.current);
            }
        } catch (error) {
            console.error("Error fetching directions:", error);
        }
    };

    // 🔑 5. Scroll selected card into view + get directions
    useEffect(() => {
        if (
            selectedFacilityIndex === null ||
            !cardContainerRef.current ||
            !mapRef.current ||
            facilityData.length === 0
        ) {
            return;
        }

        const cardHeight = 220; // approx height
        const scrollPosition = selectedFacilityIndex * cardHeight;

        cardContainerRef.current.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
        });

        if (clientLocation && selectedFacilityIndex < facilityData.length) {
            const selected = facilityData[selectedFacilityIndex];
            getDirections(clientLocation, [selected.lon, selected.lat]);
        }
    }, [selectedFacilityIndex, facilityData, clientLocation]);

    return (
        <div className="min-h-screen bg-gray-50 e-facilities-container">
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-xl text-gray-600">
                            Locating the nearest e-waste facilities...
                        </p>
                    </div>
                </div>
            ) : clientLocation ? (
                <div className="pt-8 pb-16 px-4 md:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            E-Waste Recycling Facility Locator
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Find certified e-waste collection and recycling centers near
                            you. Get directions, check facility details, and book recycling
                            services.
                        </p>
                    </div>

                    {/* Legend */}
                    <div className="mb-6 flex flex-wrap gap-4 justify-center">
                        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                            <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-gray-700">Verified Facility</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                            <span className="w-4 h-4 rounded-full bg-orange-500 mr-2"></span>
                            <span className="text-gray-700">Unverified Facility</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                            <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                            <span className="text-gray-700">Your Location</span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left: Cards + filters */}
                        <div className="lg:w-1/3 flex flex-col">
                            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                                <h2 className="font-bold text-xl mb-3 text-gray-800">
                                    Filter Facilities
                                </h2>

                                <div className="flex gap-4 mb-4 flex-wrap">
                                    <button
                                        className={`px-4 py-2 rounded-md ${filterVerified
                                                ? "bg-emerald-500 text-white"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                        onClick={() => setFilterVerified(!filterVerified)}
                                    >
                                        Verified Only
                                    </button>

                                    <select
                                        className="px-4 py-2 rounded-md border border-gray-200 bg-gray-100"
                                        value={filterDistance || ""}
                                        onChange={(e) =>
                                            setFilterDistance(
                                                e.target.value ? parseInt(e.target.value) : null
                                            )
                                        }
                                    >
                                        <option value="">Distance - Any</option>
                                        <option value="5">Within 5 km</option>
                                        <option value="10">Within 10 km</option>
                                        <option value="20">Within 20 km</option>
                                        <option value="50">Within 50 km</option>
                                    </select>
                                </div>
                            </div>

                            <div
                                ref={cardContainerRef}
                                className="flex-grow bg-gray-50 rounded-lg overflow-y-auto max-h-[70vh] p-1"
                                style={{ scrollbarWidth: "thin" }}
                            >
                                {filteredFacilities().length > 0 ? (
                                    filteredFacilities().map((info, idx) => {
                                        // Map filtered item back to original index in facilityData
                                        const globalIndex = facilityData.findIndex(
                                            (f) =>
                                                f.name === info.name &&
                                                f.lon === info.lon &&
                                                f.lat === info.lat
                                        );

                                        const isSelected =
                                            globalIndex === selectedFacilityIndex;

                                        return (
                                            <div
                                                key={`${info.name}-${idx}`}
                                                className={`p-4 bg-white rounded-lg shadow-sm cursor-pointer mb-4 border-l-4 transition-all duration-200 hover:shadow-md
                          ${isSelected
                                                        ? "border-l-emerald-500 shadow-md"
                                                        : info.verified
                                                            ? "border-l-green-500"
                                                            : "border-l-orange-500"
                                                    }`}
                                                onClick={() => {
                                                    if (globalIndex !== -1) {
                                                        setSelectedFacilityIndex(globalIndex);
                                                    }
                                                }}
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <h2 className="text-xl font-bold text-gray-800">
                                                        {info.name}
                                                    </h2>
                                                    {info.verified ? (
                                                        <div className="flex items-center text-green-500 text-sm font-medium">
                                                            <FaCheckCircle className="mr-1" />
                                                            Verified
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center text-orange-500 text-sm font-medium">
                                                            <FaTimesCircle className="mr-1" />
                                                            Unverified
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mb-3 space-y-1 text-gray-600">
                                                    <div className="flex items-start">
                                                        <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                                                        <p>{info.address}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaPhoneAlt className="text-gray-400 mr-2 flex-shrink-0" />
                                                        <p>{info.contact}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaClock className="text-gray-400 mr-2 flex-shrink-0" />
                                                        <p>{info.time}</p>
                                                    </div>
                                                    <p className="font-medium text-indigo-600">
                                                        {info.distance.toFixed(2)} km away
                                                    </p>
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button
                                                        className="flex-1 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (clientLocation) {
                                                                getDirections(clientLocation, [
                                                                    info.lon,
                                                                    info.lat,
                                                                ]);
                                                            }
                                                        }}
                                                    >
                                                        <FaDirections className="mr-2" />
                                                        Directions
                                                    </button>

                                                    {/* If you later use react-router, replace this with <Link to="/recycle"> */}
                                                    <a
                                                        href="/recycle"
                                                        className="flex-1 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        <FaRecycle className="mr-2" />
                                                        Book Recycling
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-gray-600">
                                        No facilities match your current filters. Try adjusting
                                        your search criteria.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Map */}
                        <div
                            ref={mapContainerRef}
                            id="map"
                            className="lg:w-2/3 h-[75vh] rounded-lg shadow-md"
                        />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
                    <div className="max-w-md mx-auto text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-20 w-20 text-gray-400 mx-auto mb-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Location Access Required
                        </h2>

                        <p className="text-gray-600 mb-8">
                            We need access to your location to show you nearby e-waste
                            recycling facilities. Please enable location services in your
                            browser settings.
                        </p>

                        <button
                            onClick={handleAllowLocationClick}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300"
                        >
                            Allow Location Access
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacilityLocatorPage;

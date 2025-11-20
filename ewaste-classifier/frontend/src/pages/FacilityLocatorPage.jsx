// src/pages/FacilityLocatorPage.jsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Popup } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
    FaCheckCircle,
    FaTimesCircle,
    FaDirections,
    FaRecycle,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaClock,
} from "react-icons/fa";

import getLocation from "../utils/getLocation";
import { calculateDistance } from "../utils/calculateLocation";
import { facility as FACILITY_DATA } from "../data/facility";

// Read token from env (create .env: REACT_APP_MAPBOX_TOKEN=...)
mapboxgl.accessToken =
    process.env.REACT_APP_MAPBOX_TOKEN ||
    "pk.eyJ1Ijoic2h1ZW5jZSIsImEiOiJjbG9wcmt3czMwYnZsMmtvNnpmNTRqdnl6In0.vLBhYMBZBl2kaOh1Fh44Bw";

const FacilityLocatorPage = () => {
    const [facilityData, setFacilityData] = useState([]);
    const [clientLocation, setClientLocation] = useState(null); // [lng, lat]
    const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterVerified, setFilterVerified] = useState(false);
    const [filterDistance, setFilterDistance] = useState(null);

    const cardContainerRef = useRef(null);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const userMarkerRef = useRef(null);
    const markersRef = useRef([]);
    const geocoderRef = useRef(null);

    useEffect(() => {
        document.title = "E-Locate | E-Waste Facility Locator";

        setIsLoading(true);
        getLocation()
            .then((coords) => {
                if (coords && coords.coordinates) {
                    setClientLocation(coords.coordinates);
                } else {
                    setClientLocation([75.7139, 19.7515]);
                }
            })
            .catch(() => {
                setClientLocation([75.7139, 19.7515]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const filteredFacilities = React.useMemo(() => {
        if (!facilityData.length) return [];
        let filtered = facilityData;
        if (filterVerified) filtered = filtered.filter((f) => f.verified);
        if (filterDistance !== null && !Number.isNaN(filterDistance)) {
            filtered = filtered.filter((f) => f.distance <= filterDistance);
        }
        return filtered;
    }, [facilityData, filterVerified, filterDistance]);

    const formatDistance = (dKm) => `${dKm.toFixed(2)} km`;

    useEffect(() => {
        if (!clientLocation) return;

        const withDistances = FACILITY_DATA.map((f) => ({
            ...f,
            distance: calculateDistance(clientLocation[1], clientLocation[0], f.lat, f.lon),
        })).sort((a, b) => a.distance - b.distance);

        setFacilityData(withDistances);

        if (mapRef.current) {
            mapRef.current.setCenter(clientLocation);
            mapRef.current.setZoom(10);

            if (userMarkerRef.current) {
                userMarkerRef.current.setLngLat(clientLocation);
            } else {
                userMarkerRef.current = new mapboxgl.Marker({ color: "#3366ff", scale: 1.2 })
                    .setLngLat(clientLocation)
                    .addTo(mapRef.current);
            }

            markersRef.current.forEach((m) => m.remove());
            markersRef.current = [];

            withDistances.forEach((f, idx) => {
                const popup = new Popup({ offset: 12 }).setHTML(createFacilityPopupHTML(f));
                const marker = new mapboxgl.Marker({
                    color: f.verified ? "#10b981" : "#f97316",
                    scale: 1,
                })
                    .setLngLat([f.lon, f.lat])
                    .setPopup(popup)
                    .addTo(mapRef.current);

                markersRef.current.push(marker);
                marker.getElement().addEventListener("click", () => {
                    setSelectedFacilityIndex(idx);
                });
            });

            return;
        }

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: clientLocation,
            zoom: 10,
        });

        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            placeholder: "Search for your location",
            marker: false,
        });
        geocoderRef.current = geocoder;
        map.addControl(geocoder);

        const onGeocoderResult = (event) => {
            const { geometry, place_name } = event.result || {};
            if (!geometry || !geometry.coordinates) return;
            const center = geometry.coordinates;

            setClientLocation([center[0], center[1]]);

            if (userMarkerRef.current) {
                userMarkerRef.current.setLngLat(center);
            } else {
                userMarkerRef.current = new mapboxgl.Marker({ color: "#3366ff", scale: 1.2 })
                    .setLngLat(center)
                    .addTo(map);
            }

            const selectedLocationPopup = new Popup().setHTML(
                `<div class="p-2"><h3 style="margin:0;font-weight:600;color:#2563eb">Selected Location</h3><div style="font-size:13px;color:#374151">${place_name || ""}</div></div>`
            );
            userMarkerRef.current.setPopup(selectedLocationPopup).togglePopup();

            const recalculated = FACILITY_DATA.map((f) => ({
                ...f,
                distance: calculateDistance(center[1], center[0], f.lat, f.lon),
            })).sort((a, b) => a.distance - b.distance);

            setFacilityData(recalculated);

            if (recalculated.length) {
                const nearest = recalculated[0];
                getDirections(center, [nearest.lon, nearest.lat]);
                setSelectedFacilityIndex(0);
            }
        };

        geocoder.on("result", onGeocoderResult);

        userMarkerRef.current = new mapboxgl.Marker({ color: "#3366ff", scale: 1.2 })
            .setLngLat(clientLocation)
            .addTo(map);

        userMarkerRef.current.setPopup(
            new Popup().setHTML(`<div style="font-weight:600;color:#2563eb">Your Location</div>`)
        );

        withDistances.forEach((f, idx) => {
            const popup = new Popup({ offset: 12 }).setHTML(createFacilityPopupHTML(f));
            const marker = new mapboxgl.Marker({
                color: f.verified ? "#10b981" : "#f97316",
                scale: 1,
            })
                .setLngLat([f.lon, f.lat])
                .setPopup(popup)
                .addTo(map);

            markersRef.current.push(marker);
            marker.getElement().addEventListener("click", () => {
                setSelectedFacilityIndex(idx);
            });
        });

        return () => {
            try {
                geocoder.off && geocoder.off("result", onGeocoderResult);
                map.remove();
            } catch (err) {
            } finally {
                mapRef.current = null;
                geocoderRef.current = null;
                markersRef.current = [];
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientLocation]);

    useEffect(() => {
        if (!markersRef.current || !mapRef.current) return;

        markersRef.current.forEach((marker, index) => {
            const el = marker.getElement();
            if (!el) return;
            if (index === selectedFacilityIndex) {
                el.style.transform = "translate(-50%, -50%) scale(1.25)";
                el.style.zIndex = 1000;
                setTimeout(() => marker.getPopup()?.addTo(mapRef.current), 0);
            } else {
                el.style.transform = "translate(-50%, -50%) scale(1.0)";
                el.style.zIndex = "";
                marker.getPopup()?.remove();
            }
        });

        if (
            selectedFacilityIndex !== null &&
            cardContainerRef.current &&
            facilityData.length > 0
        ) {
            const cards = cardContainerRef.current.querySelectorAll(".facility-card");
            const el = cards[selectedFacilityIndex];
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [selectedFacilityIndex, facilityData]);

    const getDirections = async (origin, destination) => {
        if (!mapRef.current || !origin || !destination) return;

        try {
            const res = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${mapboxgl.accessToken}`
            );
            const data = await res.json();
            if (!data || data.code !== "Ok" || !data.routes || !data.routes[0]) return;

            const route = data.routes[0];
            const id = "directions-route";

            if (mapRef.current.getLayer(id)) {
                try {
                    mapRef.current.removeLayer(id);
                } catch (err) { }
            }
            if (mapRef.current.getSource(id)) {
                try {
                    mapRef.current.removeSource(id);
                } catch (err) { }
            }

            mapRef.current.addSource(id, {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: route.geometry,
                },
            });

            mapRef.current.addLayer({
                id,
                type: "line",
                source: id,
                layout: { "line-join": "round", "line-cap": "round" },
                paint: { "line-color": "#4f46e5", "line-width": 5, "line-opacity": 0.85 },
            });

            const bounds = new mapboxgl.LngLatBounds();
            route.geometry.coordinates.forEach((c) => bounds.extend(c));
            mapRef.current.fitBounds(bounds, { padding: 60 });

            const midIdx = Math.floor(route.geometry.coordinates.length / 2);
            const midpoint = route.geometry.coordinates[midIdx];

            const distanceKm = route.distance / 1000;
            const minutes = Math.ceil(route.duration / 60);

            new Popup({ offset: 25 })
                .setLngLat(midpoint)
                .setHTML(
                    `<div style="font-weight:600;color:#4338ca;margin-bottom:6px">Route</div>
           <div style="font-size:13px;color:#374151">Distance: <strong>${distanceKm.toFixed(
                        2
                    )} km</strong><br/>ETA: <strong>${minutes} min</strong></div>`
                )
                .addTo(mapRef.current);
        } catch (err) {
            console.error("Directions failed:", err);
        }
    };

    function createFacilityPopupHTML(f) {
        return `<div style="font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; max-width:260px">
      <h3 style="margin:0 0 0px 0;color:#059669;font-weight:700">${f.name}</h3>
      <div style="font-size:13px;color:#374151;margin-bottom:6px">${f.address}</div>
      <div style="font-size:13px;color:#374151;margin-bottom:6px"><strong>Contact:</strong> ${f.contact}</div>
      <div style="font-size:13px;color:#374151;margin-bottom:6px"><strong>Hours:</strong> ${f.time}</div>
      <div style="font-size:13px;color:#374151"><strong>Distance:</strong> ${formatDistance(
            f.distance
        )}</div>
    </div>`;
    }

    const handleAllowLocationClick = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported in this browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lng = pos.coords.longitude;
                const lat = pos.coords.latitude;
                setClientLocation([lng, lat]);
                setIsLoading(false);
                if (mapRef.current) {
                    mapRef.current.flyTo({ center: [lng, lat], zoom: 12 });
                }
            },
            (err) => {
                console.warn("Geolocation error:", err);
                alert("Unable to read your location. Please check browser permissions.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div className="min-h-screen bg-[#E2F0C9]  e-facilities-container pt-8">
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-xl text-gray-700">
                            Locating the nearest e-waste facilities...
                        </p>
                    </div>
                </div>
            ) : clientLocation ? (
                <div className=" pb-16 px-4 md:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            E-Waste Recycling Facility Locator
                        </h1>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Find certified e-waste collection and recycling centers near you. Get directions,
                            check facility details, and book recycling services.
                        </p>
                    </div>

                    {/* Legend & Filters */}
                    <div className="mb-6 flex flex-wrap gap-4 justify-center">
                        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                            <span className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                            <span className="text-gray-700">Verified Facility</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                            <span className="w-4 h-4 rounded-full bg-orange-500 mr-2" />
                            <span className="text-gray-700">Unverified Facility</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                            <span className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
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
                                        onClick={() => setFilterVerified((s) => !s)}
                                        aria-pressed={filterVerified}
                                    >
                                        Verified Only
                                    </button>

                                    <select
                                        className="px-4 py-2 rounded-md border border-gray-200 bg-gray-100"
                                        value={filterDistance || ""}
                                        onChange={(e) =>
                                            setFilterDistance(
                                                e.target.value ? Number(e.target.value) : null
                                            )
                                        }
                                        aria-label="Filter by max distance (km)"
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
                                className="flex-grow bg-[#E2F0C9] rounded-lg overflow-y-auto max-h-[70vh] p-3"
                                style={{ scrollbarWidth: "thin" }}
                                aria-live="polite"
                            >
                                {filteredFacilities.length > 0 ? (
                                    filteredFacilities.map((info, idx) => {
                                        const globalIndex = facilityData.findIndex(
                                            (f) =>
                                                f.name === info.name &&
                                                f.lat === info.lat &&
                                                f.lon === info.lon
                                        );
                                        const isSelected = globalIndex === selectedFacilityIndex;

                                        return (
                                            <div
                                                key={`${info.name}-${idx}`}
                                                className={`facility-card p-4 bg-white rounded-lg shadow-sm cursor-pointer mb-4 border-l-4 transition-all duration-200 hover:shadow-md ${isSelected
                                                    ? "border-l-emerald-500 shadow-md"
                                                    : info.verified
                                                        ? "border-l-green-500"
                                                        : "border-l-orange-500"
                                                    }`}
                                                onClick={() => {
                                                    if (globalIndex !== -1) {
                                                        setSelectedFacilityIndex(globalIndex);
                                                        mapRef.current &&
                                                            mapRef.current.flyTo({
                                                                center: [info.lon, info.lat],
                                                                zoom: 13,
                                                            });
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        if (globalIndex !== -1)
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
                                                            <FaCheckCircle className="mr-1" /> Verified
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center text-orange-500 text-sm font-medium">
                                                            <FaTimesCircle className="mr-1" /> Unverified
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
                                                        {formatDistance(info.distance)} away
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
                                                        <FaDirections className="mr-2" /> Directions
                                                    </button>

                                                    <a
                                                        href="/recycle"
                                                        className="flex-1 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <FaRecycle className="mr-2" /> Book Recycling
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-gray-700">
                                        No facilities match your current filters. Try toggling
                                        &quot;Verified Only&quot; or expanding the distance.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Map container */}
                        <div
                            ref={mapContainerRef}
                            id="map"
                            className="lg:w-2/3 h-[75vh] rounded-lg shadow-md"
                            aria-label="Facility map"
                        />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-[60vh] px-4">
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

                        <p className="text-gray-700 mb-8">
                            We need access to your location to show you nearby e-waste recycling
                            facilities. Please enable location services in your browser settings.
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

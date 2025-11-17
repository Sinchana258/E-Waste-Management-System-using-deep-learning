import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { facility } from "../data/facility";

mapboxgl.accessToken = "pk.eyJ1Ijoic2h1ZW5jZSIsImEiOiJjbG9wcmt3czMwYnZsMmtvNnpmNTRqdnl6In0.vLBhYMBZBl2kaOh1Fh44Bw";


const FacilityLocatorPage = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [clientLocation] = useState([77.5946, 12.9716]); // default Bengaluru

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: clientLocation,
            zoom: 12,
        });

        facility.forEach((f) => {
            new mapboxgl.Marker()
                .setLngLat([f.lon, f.lat])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<h3>${f.name}</h3><p>${f.address}</p><p>Capacity: ${f.capacity}</p>`
                    )
                )
                .addTo(mapRef.current);
        });

        return () => mapRef.current.remove();
    }, [clientLocation]);

    return (
        <div className="flex h-screen">
            {/* Left: Facility list */}
            <div className="w-1/3 h-full overflow-y-auto p-4 bg-gray-100">
                <h2 className="text-2xl font-bold mb-4">E-Waste Facilities</h2>
                {facility.map((f, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-4 rounded shadow mb-4 hover:shadow-lg transition"
                    >
                        <h3 className="font-semibold">{f.name}</h3>
                        <p className="text-sm text-gray-600">{f.address}</p>
                        <p className="text-sm">Capacity: {f.capacity}</p>
                        <p className="text-sm">Time: {f.time}</p>
                    </div>
                ))}
            </div>

            {/* Right: Map placeholder */}
            <div className="w-2/3 h-full p-4">
                <div
                    ref={mapContainerRef}
                    className="w-full h-full rounded shadow border border-gray-300"
                >
                    {/* Map will render inside this div */}
                </div>
            </div>
        </div>
    );
};

export default FacilityLocatorPage;

"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

interface PropertyLocationMapProps {
  location: {
    city: string;
    state: string;
    country: string;
    description: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  googleMapsUrl?: string;
}

export default function PropertyLocationMap({
  location,
  googleMapsUrl = "https://maps.app.goo.gl/S9e4x7NnxkBhvEQ28",
}: PropertyLocationMapProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize the map once the script is loaded
  useEffect(() => {
    if (!window.google || !window.google.maps || !mapRef.current) {
      return;
    }

    setMapLoaded(true);

    const initMap = () => {
      const mapOptions = {
        center: {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        },
        zoom: isZoomed ? 15 : 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      googleMapRef.current = map;

      // Add a marker with a custom icon
      new window.google.maps.Marker({
        position: {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        },
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#ff4d4f",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: `${location.city}, ${location.state}, ${location.country}`,
      });

      // Add a circle around the marker to show approximate area
      new window.google.maps.Circle({
        strokeColor: "#ff4d4f",
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: "#ff4d4f",
        fillOpacity: 0.1,
        map: map,
        center: {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        },
        radius: 500, // 500 meters radius
      });
    };

    // Initialize the map
    if (window.google && window.google.maps) {
      initMap();
    }
  }, [location, isZoomed]);

  // Update zoom level when isZoomed changes
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom(isZoomed ? 15 : 13);
    }
  }, [isZoomed]);

  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, "_blank");
  };

  // If Google Maps API is not available, use fallback
  if (!window.google || !window.google.maps) {
    return (
      <div
        className="space-y-4"
        data-pol-id="snssa9"
        data-pol-file-name="property-location-map"
        data-pol-file-type="component"
      >
        <h2
          className="text-xl font-semibold"
          data-pol-id="jdp8ky"
          data-pol-file-name="property-location-map"
          data-pol-file-type="component"
        >
          Where you'll be
        </h2>
        <p
          className="text-muted-foreground"
          data-pol-id="qi3gtt"
          data-pol-file-name="property-location-map"
          data-pol-file-type="component"
        >
          {location.city}, {location.state}, {location.country}
        </p>

        <div
          className="relative w-full h-[300px] md:h-[400px] bg-muted rounded-lg overflow-hidden"
          data-pol-id="rjcyah"
          data-pol-file-name="property-location-map"
          data-pol-file-type="component"
        >
          {/* Map placeholder */}
          <div
            className="absolute inset-0 bg-[#e0e7ff] overflow-hidden"
            data-pol-id="5cfljz"
            data-pol-file-name="property-location-map"
            data-pol-file-type="component"
          >
            <div
              className="absolute inset-0 opacity-10"
              data-pol-id="ofvst1"
              data-pol-file-name="property-location-map"
              data-pol-file-type="component"
            >
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-red-500 opacity-20"
                data-pol-id="2wfckf"
                data-pol-file-name="property-location-map"
                data-pol-file-type="component"
              ></div>
              <div
                className="grid grid-cols-8 grid-rows-8 h-full w-full"
                data-pol-id="kqvar4"
                data-pol-file-name="property-location-map"
                data-pol-file-type="component"
              >
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-blue-200"
                    data-pol-id={`aeb2p4_${i}`}
                    data-pol-file-name="property-location-map"
                    data-pol-file-type="component"
                  ></div>
                ))}
              </div>
            </div>

            {/* Location pin */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              data-pol-id="cdab75"
              data-pol-file-name="property-location-map"
              data-pol-file-type="component"
            >
              <div
                className="relative"
                data-pol-id="hkggyi"
                data-pol-file-name="property-location-map"
                data-pol-file-type="component"
              >
                <div
                  className="absolute -top-6 -left-6 w-12 h-12 bg-red-500 rounded-full opacity-20 animate-pulse"
                  data-pol-id="3mb03z"
                  data-pol-file-name="property-location-map"
                  data-pol-file-type="component"
                ></div>
                <div
                  className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full"
                  data-pol-id="passpk"
                  data-pol-file-name="property-location-map"
                  data-pol-file-type="component"
                ></div>
              </div>
            </div>

            {/* Map controls */}
            <div
              className="absolute top-4 left-4 flex flex-col gap-2"
              data-pol-id="15qxju"
              data-pol-file-name="property-location-map"
              data-pol-file-type="component"
            >
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={handleOpenGoogleMaps}
                data-pol-id="wuvfi4"
                data-pol-file-name="property-location-map"
                data-pol-file-type="component"
              >
                <MapIcon
                  className="h-4 w-4"
                  data-pol-id="8gg3zq"
                  data-pol-file-name="property-location-map"
                  data-pol-file-type="component"
                />
              </Button>
            </div>

            {/* Map attribution */}
            <div
              className="absolute bottom-1 right-1 text-[10px] text-gray-500"
              data-pol-id="pc8zqk"
              data-pol-file-name="property-location-map"
              data-pol-file-type="component"
            >
              Map data ©{new Date().getFullYear()}
            </div>
          </div>
        </div>

        <div
          className="text-sm"
          data-pol-id="okdor4"
          data-pol-file-name="property-location-map"
          data-pol-file-type="component"
        >
          <p
            className="font-medium"
            data-pol-id="dmt1x7"
            data-pol-file-name="property-location-map"
            data-pol-file-type="component"
          >
            {location.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      data-pol-id="biid84"
      data-pol-file-name="property-location-map"
      data-pol-file-type="component"
    >
      <h2
        className="text-xl font-semibold"
        data-pol-id="3v97l5"
        data-pol-file-name="property-location-map"
        data-pol-file-type="component"
      >
        Where you'll be
      </h2>
      <p
        className="text-muted-foreground"
        data-pol-id="8nzkxo"
        data-pol-file-name="property-location-map"
        data-pol-file-type="component"
      >
        {location.city}, {location.state}, {location.country}
      </p>

      <div
        className="relative w-full h-[300px] md:h-[400px] bg-muted rounded-lg overflow-hidden"
        data-pol-id="1w80k1"
        data-pol-file-name="property-location-map"
        data-pol-file-type="component"
      >
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-full"
          data-pol-id="59t6va"
          data-pol-file-name="property-location-map"
          data-pol-file-type="component"
        />

        {/* Map Controls */}
        <div
          className="absolute top-4 left-4 flex flex-col gap-2"
          data-pol-id="3e37aq"
          data-pol-file-name="property-location-map"
          data-pol-file-type="component"
        >
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={handleOpenGoogleMaps}
            data-pol-id="5lxfdv"
            data-pol-file-name="property-location-map"
            data-pol-file-type="component"
          >
            <MapIcon
              className="h-4 w-4"
              data-pol-id="cau1l2"
              data-pol-file-name="property-location-map"
              data-pol-file-type="component"
            />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={() => setIsZoomed(!isZoomed)}
            data-pol-id="0qau4x"
            data-pol-file-name="property-location-map"
            data-pol-file-type="component"
          >
            {isZoomed ? (
              <ZoomOutIcon
                className="h-4 w-4"
                data-pol-id="fdqbur"
                data-pol-file-name="property-location-map"
                data-pol-file-type="component"
              />
            ) : (
              <ZoomInIcon
                className="h-4 w-4"
                data-pol-id="vkayvi"
                data-pol-file-name="property-location-map"
                data-pol-file-type="component"
              />
            )}
          </Button>
        </div>

        {/* Map attribution */}
        <div
          className="absolute bottom-1 right-1 text-[10px] text-gray-500"
          data-pol-id="58yvr3"
          data-pol-file-name="property-location-map"
          data-pol-file-type="component"
        >
          Map data ©{new Date().getFullYear()} Google
        </div>
      </div>

      <div
        className="text-sm"
        data-pol-id="92lqb6"
        data-pol-file-name="property-location-map"
        data-pol-file-type="component"
      >
        <p
          className="font-medium"
          data-pol-id="g6wk2d"
          data-pol-file-name="property-location-map"
          data-pol-file-type="component"
        >
          {location.description}
        </p>
      </div>
    </div>
  );
}

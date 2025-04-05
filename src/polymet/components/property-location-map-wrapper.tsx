"use client";

import { useState, useEffect } from "react";
import PropertyLocationMap from "@/polymet/components/property-location-map";
import PropertyLocationMapFallback from "@/polymet/components/property-location-map-fallback";

interface PropertyLocationMapWrapperProps {
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

export default function PropertyLocationMapWrapper({
  location,
  googleMapsUrl,
}: PropertyLocationMapWrapperProps) {
  const [isGoogleMapsAvailable, setIsGoogleMapsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Google Maps API is available
    const checkGoogleMapsAvailability = () => {
      if (typeof window !== "undefined") {
        // Check if the google.maps object exists
        const mapsAvailable = !!(window.google && window.google.maps);
        setIsGoogleMapsAvailable(mapsAvailable);
        if (!mapsAvailable) {
            console.warn("Google Maps API script not loaded or API key might be missing/invalid.");
        }
      } else {
        // Cannot check on server-side
        setIsGoogleMapsAvailable(false);
      }
      setIsLoading(false);
    };

    // Run the check after a short delay to allow potential script loading
    const timer = setTimeout(checkGoogleMapsAvailability, 500);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
    
  }, []);

  if (isLoading) {
    return (
      <PropertyLocationMapFallback
        location={location}
        googleMapsUrl={googleMapsUrl}
        data-pol-id="mip3sr"
        data-pol-file-name="property-location-map-wrapper"
        data-pol-file-type="component"
      />
    );
  }

  return isGoogleMapsAvailable ? (
    <PropertyLocationMap
      location={location}
      googleMapsUrl={googleMapsUrl}
      data-pol-id="npz7jx"
      data-pol-file-name="property-location-map-wrapper"
      data-pol-file-type="component"
    />
  ) : (
    <PropertyLocationMapFallback
      location={location}
      googleMapsUrl={googleMapsUrl}
      data-pol-id="ezm11j"
      data-pol-file-name="property-location-map-wrapper"
      data-pol-file-type="component"
    />
  );
}

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
      // If we're in a browser environment
      if (typeof window !== "undefined") {
        // For demo purposes, we'll assume Google Maps is not available
        // In a real app, you would check for API key and script loading
        setIsGoogleMapsAvailable(false);
      }
      setIsLoading(false);
    };

    checkGoogleMapsAvailability();
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

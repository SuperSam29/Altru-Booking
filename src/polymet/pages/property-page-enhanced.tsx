"use client";

import { useParams } from "react-router-dom";
import PropertyHeader from "@/polymet/components/property-header";
import PropertyImageGallery from "@/polymet/components/property-image-gallery";
import PropertyAmenitiesList from "@/polymet/components/property-amenities-list";
import PropertyLocationMapWrapper from "@/polymet/components/property-location-map-wrapper";
import EnhancedPropertyBookingWidget from "@/polymet/components/enhanced-property-booking-widget";
import { PROPERTY_DATA } from "@/polymet/data/property-data";

export default function PropertyPageEnhanced() {
  const { propertyId = "1" } = useParams();

  // In a real app, we would fetch property data based on propertyId
  const property = PROPERTY_DATA;

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-pol-id="4o4cmt"
      data-pol-file-name="property-page-enhanced"
      data-pol-file-type="page"
    >
      <PropertyHeader
        title={property.title}
        location={property.location}
        details={property.details}
        data-pol-id="x7ygl0"
        data-pol-file-name="property-page-enhanced"
        data-pol-file-type="page"
      />

      <div
        className="mt-6"
        data-pol-id="pl1deh"
        data-pol-file-name="property-page-enhanced"
        data-pol-file-type="page"
      >
        <PropertyImageGallery
          images={property.images}
          title={property.title}
          data-pol-id="3ma8w2"
          data-pol-file-name="property-page-enhanced"
          data-pol-file-type="page"
        />
      </div>

      <div
        className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
        data-pol-id="vh6mp4"
        data-pol-file-name="property-page-enhanced"
        data-pol-file-type="page"
      >
        <div
          className="lg:col-span-2 space-y-8"
          data-pol-id="6krhnz"
          data-pol-file-name="property-page-enhanced"
          data-pol-file-type="page"
        >
          <div
            data-pol-id="jey25y"
            data-pol-file-name="property-page-enhanced"
            data-pol-file-type="page"
          >
            <PropertyAmenitiesList
              amenities={property.amenities}
              unavailableAmenities={property.unavailableAmenities}
              unavailableNotes={property.unavailableNotes}
              highlightedAmenities={property.highlightedAmenities}
              data-pol-id="d5lpoo"
              data-pol-file-name="property-page-enhanced"
              data-pol-file-type="page"
            />
          </div>

          <div
            data-pol-id="n6zgjx"
            data-pol-file-name="property-page-enhanced"
            data-pol-file-type="page"
          >
            <PropertyLocationMapWrapper
              location={property.location}
              googleMapsUrl={`https://maps.app.goo.gl/S9e4x7NnxkBhvEQ28`}
              data-pol-id="0qdbkm"
              data-pol-file-name="property-page-enhanced"
              data-pol-file-type="page"
            />
          </div>
        </div>

        <div
          className="lg:col-span-1"
          data-pol-id="38yfvf"
          data-pol-file-name="property-page-enhanced"
          data-pol-file-type="page"
        >
          <EnhancedPropertyBookingWidget
            pricing={property.pricing}
            propertyId={propertyId}
            data-pol-id="bncif8"
            data-pol-file-name="property-page-enhanced"
            data-pol-file-type="page"
          />
        </div>
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";
import PropertyHeader from "@/polymet/components/property-header";
import PropertyImageGallery from "@/polymet/components/property-image-gallery";
import PropertyAmenitiesList from "@/polymet/components/property-amenities-list";
import PropertyBookingWidgetUpdated from "@/polymet/components/property-booking-widget-updated";
import PropertyLocationMapWrapper from "@/polymet/components/property-location-map-wrapper";
import { PROPERTY_DATA } from "@/polymet/data/property-data";
import { Separator } from "@/components/ui/separator";

export default function PropertyPageUpdated() {
  const { propertyId = "prop123" } = useParams();

  // In a real application, you would fetch the property data based on the propertyId
  // For now, we'll use the mock data
  const property = PROPERTY_DATA;

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-7xl"
      data-pol-id="8ph1jv"
      data-pol-file-name="property-page-updated"
      data-pol-file-type="page"
    >
      {/* Property Header */}
      <PropertyHeader
        title={property.title}
        location={property.location}
        details={property.details}
        data-pol-id="e6tyv5"
        data-pol-file-name="property-page-updated"
        data-pol-file-type="page"
      />

      {/* Property Images */}
      <div
        className="mt-6"
        data-pol-id="0noaog"
        data-pol-file-name="property-page-updated"
        data-pol-file-type="page"
      >
        <PropertyImageGallery
          images={property.images}
          title={property.title}
          data-pol-id="g62pnf"
          data-pol-file-name="property-page-updated"
          data-pol-file-type="page"
        />
      </div>

      <div
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
        data-pol-id="7wyp78"
        data-pol-file-name="property-page-updated"
        data-pol-file-type="page"
      >
        <div
          className="md:col-span-2 space-y-8"
          data-pol-id="61vo5n"
          data-pol-file-name="property-page-updated"
          data-pol-file-type="page"
        >
          {/* Property Details */}
          <div
            data-pol-id="w1a8kr"
            data-pol-file-name="property-page-updated"
            data-pol-file-type="page"
          >
            <h2
              className="text-xl font-semibold"
              data-pol-id="f0wcz2"
              data-pol-file-name="property-page-updated"
              data-pol-file-type="page"
            >
              {property.details.type} in {property.location.city}
            </h2>
            <p
              className="text-muted-foreground"
              data-pol-id="yn1bxf"
              data-pol-file-name="property-page-updated"
              data-pol-file-type="page"
            >
              {property.details.guests} guests · {property.details.bedrooms}{" "}
              bedrooms · {property.details.beds} beds ·{" "}
              {property.details.bathrooms} bathrooms
            </p>
          </div>

          <Separator
            data-pol-id="j5852s"
            data-pol-file-name="property-page-updated"
            data-pol-file-type="page"
          />

          {/* Amenities */}
          <PropertyAmenitiesList
            amenities={property.amenities}
            unavailableAmenities={property.unavailableAmenities}
            unavailableNotes={property.unavailableNotes}
            highlightedAmenities={property.highlightedAmenities}
            data-pol-id="7wygl2"
            data-pol-file-name="property-page-updated"
            data-pol-file-type="page"
          />

          <Separator
            data-pol-id="2grvag"
            data-pol-file-name="property-page-updated"
            data-pol-file-type="page"
          />

          {/* Location */}
          <PropertyLocationMapWrapper
            location={property.location}
            googleMapsUrl="https://maps.app.goo.gl/S9e4x7NnxkBhvEQ28"
            data-pol-id="grtbhi"
            data-pol-file-name="property-page-updated"
            data-pol-file-type="page"
          />
        </div>

        {/* Updated Booking Widget */}
        <div
          className="md:col-span-1"
          data-pol-id="mp5e7g"
          data-pol-file-name="property-page-updated"
          data-pol-file-type="page"
        >
          <PropertyBookingWidgetUpdated
            pricing={property.pricing}
            data-pol-id="r8ck0s"
            data-pol-file-name="property-page-updated"
            data-pol-file-type="page"
          />
        </div>
      </div>
    </div>
  );
}

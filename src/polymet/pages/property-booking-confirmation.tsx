"use client";

import { useState } from "react";
// Remove react-router-dom imports
// import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BookingPriceAlert from "@/polymet/components/booking-price-alert";
import TripDetailsSummary from "@/polymet/components/trip-details-summary";
import BookingContactForm from "@/polymet/components/booking-contact-form";
import PropertyBookingSummary from "@/polymet/components/property-booking-summary";
import PropertyPriceBreakdown from "@/polymet/components/property-price-breakdown";
import { PROPERTY_DATA } from "@/polymet/data/property-data";
import Link from 'next/link'; // Import next/link

export default function PropertyBookingConfirmation() {
  // Remove useParams for now, assuming default or context-provided ID
  // const { propertyId = "prop123" } = useParams();
  const propertyId = "prop123"; // Use a default or fetch from context/props
  const property = PROPERTY_DATA; // In a real app, fetch based on propertyId

  // Mock data for the booking
  const [tripDetails, setTripDetails] = useState({
    checkIn: new Date(2023, 3, 7), // April 7, 2023
    checkOut: new Date(2023, 3, 9), // April 9, 2023
    guests: 1,
  });

  const pricing = {
    basePrice: 4875,
    currency: "₹",
    nights: 2,
    serviceFee: 1651.78,
    taxes: 1170,
    total: 12571.78,
  };

  const handleEditTripDetails = (type: "dates" | "guests") => {
    // In a real app, this would open a modal or navigate to edit page
    console.log(`Edit ${type}`);
  };

  const handleSubmitContactForm = (data: {
    countryCode: string;
    phoneNumber: string;
  }) => {
    // In a real app, this would submit the form and proceed to payment
    console.log("Contact form submitted:", data);
  };

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-6xl"
      data-pol-id="o26xg5"
      data-pol-file-name="property-booking-confirmation"
      data-pol-file-type="page"
    >
      <div
        className="mb-6"
        data-pol-id="21vizg"
        data-pol-file-name="property-booking-confirmation"
        data-pol-file-type="page"
      >
        {/* Use next/link */}
        <Link
          href={`/property/${propertyId}`} // Use href instead of to
          className="inline-flex items-center text-lg font-medium"
          data-pol-id="4st1o3"
          data-pol-file-name="property-booking-confirmation"
          data-pol-file-type="page"
        >
          <ArrowLeftIcon
            className="mr-2 h-4 w-4"
            data-pol-id="meu040"
            data-pol-file-name="property-booking-confirmation"
            data-pol-file-type="page"
          />
          Confirm and pay
        </Link>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        data-pol-id="tcgpy7"
        data-pol-file-name="property-booking-confirmation"
        data-pol-file-type="page"
      >
        <div
          className="md:col-span-2 space-y-8"
          data-pol-id="jognj6"
          data-pol-file-name="property-booking-confirmation"
          data-pol-file-type="page"
        >
          {/* Price Alert */}
          <BookingPriceAlert
            message="Lower price."
            subMessage="Your dates are 12% less than the median nightly rate of the last 60 days."
            data-pol-id="p7g5mi"
            data-pol-file-name="property-booking-confirmation"
            data-pol-file-type="page"
          />

          {/* Trip Details */}
          <Card
            data-pol-id="cybnim"
            data-pol-file-name="property-booking-confirmation"
            data-pol-file-type="page"
          >
            <CardContent
              className="p-6"
              data-pol-id="i6lr51"
              data-pol-file-name="property-booking-confirmation"
              data-pol-file-type="page"
            >
              <TripDetailsSummary
                tripDetails={tripDetails}
                onEdit={handleEditTripDetails}
                data-pol-id="49rfb6"
                data-pol-file-name="property-booking-confirmation"
                data-pol-file-type="page"
              />
            </CardContent>
          </Card>

          <Separator
            data-pol-id="9zbh73"
            data-pol-file-name="property-booking-confirmation"
            data-pol-file-type="page"
          />

          {/* Contact Form */}
          <BookingContactForm
            onSubmit={handleSubmitContactForm}
            data-pol-id="9foqjv"
            data-pol-file-name="property-booking-confirmation"
            data-pol-file-type="page"
          />
        </div>

        <div
          className="md:col-span-1"
          data-pol-id="vo66st"
          data-pol-file-name="property-booking-confirmation"
          data-pol-file-type="page"
        >
          <div
            className="sticky top-4 space-y-6"
            data-pol-id="vzw7ep"
            data-pol-file-name="property-booking-confirmation"
            data-pol-file-type="page"
          >
            <Card
              data-pol-id="f6vq2t"
              data-pol-file-name="property-booking-confirmation"
              data-pol-file-type="page"
            >
              <CardContent
                className="p-6 space-y-6"
                data-pol-id="gjkjra"
                data-pol-file-name="property-booking-confirmation"
                data-pol-file-type="page"
              >
                {/* Property Summary */}
                <PropertyBookingSummary
                  property={property}
                  rating={{ value: 5.0, count: 4 }}
                  isSuperhost={true}
                  data-pol-id="7wlqft"
                  data-pol-file-name="property-booking-confirmation"
                  data-pol-file-type="page"
                />

                <Separator
                  data-pol-id="0ozzee"
                  data-pol-file-name="property-booking-confirmation"
                  data-pol-file-type="page"
                />

                {/* Price Breakdown */}
                <PropertyPriceBreakdown
                  pricing={pricing}
                  data-pol-id="wy34wk"
                  data-pol-file-name="property-booking-confirmation"
                  data-pol-file-type="page"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

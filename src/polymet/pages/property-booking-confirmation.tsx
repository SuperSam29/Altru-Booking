"use client";

import { useState, useEffect, useRef } from "react";
// Re-introduce react-router-dom imports
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReactConfetti from "react-confetti";
import BookingPriceAlert from "@/polymet/components/booking-price-alert";
import TripDetailsSummary from "@/polymet/components/trip-details-summary";
import BookingContactForm from "@/polymet/components/booking-contact-form";
import PropertyBookingSummary from "@/polymet/components/property-booking-summary";
import PropertyPriceBreakdown from "@/polymet/components/property-price-breakdown";
import { PROPERTY_DATA } from "@/polymet/data/property-data";
import { loadScript } from "@/lib/utils"; // Import the script loader

declare global { // Declare Razorpay type globally
  interface Window { Razorpay: any; }
}

interface TripDetails {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

interface PricingDetails {
  basePrice: number;
  currency: string;
  nights: number;
  taxes: number;
  total: number;
}

// Add success popup component
interface SuccessPopupProps {
  bookingId: string;
  amount: number;
  currency: string;
  paymentId: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  onClose: () => void;
}

function SuccessPopup({ bookingId, amount, currency, paymentId, guestName, checkIn, checkOut, onClose }: SuccessPopupProps) {
  const [countdown, setCountdown] = useState(10);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // Format dates for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  useEffect(() => {
    // Update dimensions on window resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Countdown timer for redirection
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "https://altruliving.in";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <ReactConfetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />
      
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative animate-scale-up">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-green-600 mb-2">Congratulations, {guestName}!</h2>
          <p className="text-gray-600 mb-4">Your dream vacation is officially booked and waiting for you!</p>
          
          <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Booking ID:</span>
              <span className="font-medium">{bookingId.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Check-in:</span>
              <span className="font-medium">{formatDate(checkIn)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Check-out:</span>
              <span className="font-medium">{formatDate(checkOut)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="font-medium">{currency} {(amount/100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment ID:</span>
              <span className="font-medium">{paymentId.slice(0, 8)}...</span>
            </div>
          </div>
          
          <p className="text-gray-500 mb-6">Your adventure begins {formatDate(checkIn)}. Get ready for an unforgettable experience!</p>
          
          <Button onClick={onClose} className="w-full bg-black hover:bg-gray-800 text-white">
            View Booking Details
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to Altru Living in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PropertyBookingConfirmation() {
  // Re-introduce useParams
  const { propertyId = "prop123" } = useParams();
  const property = PROPERTY_DATA; // In a real app, fetch based on propertyId
  const [hotelId, setHotelId] = useState<string | null>(null); // State for hotel ID

  // Initialize state with null/defaults
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    checkIn: null,
    checkOut: null,
    guests: 1,
  });
  // Add state for pricing details
  const [pricing, setPricing] = useState<PricingDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showMissingHotelIdError, setShowMissingHotelIdError] = useState(false); // Error state for missing hotel ID
  const [successDetails, setSuccessDetails] = useState<{
    bookingId: string;
    amount: number;
    currency: string;
    paymentId: string;
    guestName: string;
    checkIn: Date;
    checkOut: Date;
  } | null>(null);

  // Fetch data from localStorage on component mount
  useEffect(() => {
    const storedCheckIn = localStorage.getItem('bookingCheckIn');
    const storedCheckOut = localStorage.getItem('bookingCheckOut');
    const storedGuests = localStorage.getItem('bookingGuests');
    const storedBasePrice = localStorage.getItem('bookingBasePrice');
    const storedHotelId = localStorage.getItem('bookingHotelId');

    // Check if hotel ID exists
    if (!storedHotelId) {
      console.error("Hotel ID not found in localStorage");
      setShowMissingHotelIdError(true);
    } else {
      setHotelId(storedHotelId);
    }

    const checkIn = storedCheckIn ? new Date(storedCheckIn) : null;
    const checkOut = storedCheckOut ? new Date(storedCheckOut) : null;
    const guests = storedGuests ? parseInt(storedGuests, 10) : 1;
    const basePrice = storedBasePrice ? parseFloat(storedBasePrice) : 0; // Default to 0 if not found

    setTripDetails({
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
    });

    if (checkIn && checkOut && basePrice > 0) {
      const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const nightlyTotal = basePrice * nights;
      const taxes = nightlyTotal * 0.12; // Calculate 12% tax
      const total = nightlyTotal + taxes; // Calculate total (no service fee)
      
      setPricing({
        basePrice: basePrice,
        currency: "₹", // Assuming currency is fixed for now
        nights: nights,
        taxes: taxes,
        total: total,
      });
    } else {
      // Handle cases where data might be missing or invalid
      console.error("Could not calculate pricing due to missing data from localStorage");
      setPricing(null); 
    }

    // Optional: Clear localStorage after reading if desired
    // localStorage.removeItem('bookingCheckIn');
    // localStorage.removeItem('bookingCheckOut');
    // localStorage.removeItem('bookingGuests');

  }, []); // Empty dependency array ensures this runs only once on mount

  const handleEditTripDetails = (type: "dates" | "guests") => {
    // Navigate back to the property page to allow edits
    // Use window.history.back() or navigate specifically
    window.location.href = `/property/${propertyId}`;
    // console.log(`Edit ${type}`);
  };

  const handleSubmitContactForm = async (formData: {
    fullName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
  }) => {
    setIsSubmitting(true);

    // Check if hotel ID is available
    if (!hotelId) {
      alert("Hotel ID is missing. Please go back and try selecting dates again.");
      setIsSubmitting(false);
      return;
    }

    let customerId: string | null = null;
    let bookingDetails: any = null; // To store booking response
    const contactNumber = `${formData.countryCode}${formData.phoneNumber.replace(/\D/g, '')}`;

    try {
      // 1. Call Customer API
      const customerPayload = {
        customers: [{
          name: formData.fullName,
          contactNumber: contactNumber,
          email: formData.email,
        }]
      };

      console.log("Submitting customer data:", JSON.stringify(customerPayload));
      const customerResponse = await fetch("https://api-nami.lucify.in/api/v1/customer/nami-ota", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerPayload),
      });

      if (!customerResponse.ok) {
        const errorData = await customerResponse.json().catch(() => ({}));
        console.error("Customer API Error Response:", errorData);
        throw new Error(`Customer API failed! Status: ${customerResponse.status}`);
      }

      const customerResponseData = await customerResponse.json();
      console.log("Customer API Success Response:", customerResponseData);
      
      // Extract customer ID using the correct path
      customerId = customerResponseData?.data?.[0]?._id; 
      if (!customerId) {
        console.warn("Customer ID (_id) not found in response.");
        throw new Error("Could not retrieve customer ID.");
      }
      console.log("Received Customer ID:", customerId);

      // 2. Check if necessary booking details are available
      if (!tripDetails.checkIn || !tripDetails.checkOut) {
        throw new Error("Missing check-in or check-out date for booking.");
      }

      // 3. Call Booking API
      const bookingPayload = {
        hotelId: hotelId, // Use the hotelId from state
        checkInAt: tripDetails.checkIn.toISOString().split('T')[0], // YYYY-MM-DD
        checkOutAt: tripDetails.checkOut.toISOString().split('T')[0], // YYYY-MM-DD
        customerId: customerId, // Use fetched customerId
        guestCount: tripDetails.guests,
      };

      console.log("Submitting booking data:", JSON.stringify(bookingPayload));
      const bookingResponse = await fetch("https://api-nami.lucify.in/api/v1/booking/nami-ota", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json().catch(() => ({}));
        console.error("Booking API Error Response:", errorData);
        throw new Error(`Booking API failed! Status: ${bookingResponse.status}`);
      }

      bookingDetails = await bookingResponse.json(); // Store the response
      console.log("Booking API Success Response:", bookingDetails);

      // 4. Extract payment details from booking response
      const orderId = bookingDetails?.data?.paymentDetails?.orderId;
      const amount = bookingDetails?.data?.paymentDetails?.amountPending; // Amount in smallest unit (paise)
      const currency = bookingDetails?.data?.paymentDetails?.currency;

      if (!orderId || !amount || !currency) {
        console.error("Payment details missing in booking response:", bookingDetails);
        throw new Error("Could not retrieve payment details for Razorpay.");
      }

      // 5. Load Razorpay Script
      const razorpayScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!razorpayScriptLoaded) {
        throw new Error("Could not load Razorpay checkout script.");
      }

      // 6. Configure and Open Razorpay Checkout
      const options = {
        key: "rzp_test_sUTYh8mAnAEc1M", // Your Razorpay Key ID
        amount: amount, // amount in smallest currency unit (paise)
        currency: currency,
        name: "Altru Living Booking", // Your company name
        description: `Booking for ${property.title}`,
        order_id: orderId, // Razorpay order_id from booking API
        handler: async function (response: any) {
          // Payment successful (client-side capture)
          console.log("Razorpay Payment Success Response:", response);

          // Extract bookingId from the bookingDetails variable (captured earlier)
          const bookingId = bookingDetails?.data?._id;
          if (!bookingId) {
            console.error("Could not find bookingId after successful payment!");
            alert("Payment captured, but booking confirmation failed. Please contact support.");
            setIsSubmitting(false); // Allow user to potentially retry or contact support
            return; // Stop further processing
          }

          // Prepare payload for the payment success API
          const paymentSuccessPayload = {
            bookingId: bookingId, 
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          };

          try {
            console.log("Submitting payment success data:", JSON.stringify(paymentSuccessPayload));
            const paymentSuccessResponse = await fetch("https://api-nami.lucify.in/api/v1/payment/success", {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(paymentSuccessPayload),
            });

            if (!paymentSuccessResponse.ok) {
              const errorData = await paymentSuccessResponse.json().catch(() => ({}));
              console.error("Payment Success API Error Response:", errorData);
              // Inform user, but payment was already captured by Razorpay
              alert("Payment successful, but there was an issue confirming the booking. Please contact support.");
              throw new Error(`Payment Success API failed! Status: ${paymentSuccessResponse.status}`);
            }

            const paymentSuccessData = await paymentSuccessResponse.json();
            console.log("Payment Success API Response:", paymentSuccessData);

            // Show success popup instead of alert
            setSuccessDetails({
              bookingId: bookingId,
              amount: amount,
              currency: currency,
              paymentId: response.razorpay_payment_id,
              guestName: formData.fullName,
              checkIn: tripDetails.checkIn!,
              checkOut: tripDetails.checkOut!
            });
            setShowSuccessPopup(true);

          } catch (error) {
            console.error("Error submitting payment success data:", error);
            // Alert the user, payment was successful but confirmation failed
            alert("Payment successful, but confirmation step failed. Please contact support with Payment ID: " + response.razorpay_payment_id);
          } finally {
            // Consider where to navigate or what state to set after final confirmation/error
            setIsSubmitting(false); // Re-enable form submission ability eventually
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: contactNumber, // Use combined contact number
        },
        theme: {
          color: "#000000" // Example: Black theme color
        }
      };

      const razorpay = new window.Razorpay(options);
      
      // Add async to the payment failed handler
      razorpay.on('payment.failed', async function (response: any) { 
          console.error("Razorpay Payment Failed Response:", response);
          // Handle payment failure (e.g., show error message, allow retry?)
          alert(`Payment Failed: ${response.error.description} (Code: ${response.error.code})`);

          // Extract bookingId from the bookingDetails captured earlier in the outer scope
          const bookingId = bookingDetails?.data?._id;
          if (bookingId) {
            // Call the payment failure API
            try {
              const failurePayload = { bookingId: bookingId };
              console.log("Submitting payment failure data:", JSON.stringify(failurePayload));
              const failureResponse = await fetch("https://api-nami.lucify.in/api/v1/payment/failure", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(failurePayload),
              });

              if (!failureResponse.ok) {
                const errorData = await failureResponse.json().catch(() => ({}));
                console.error("Payment Failure API Error Response:", errorData);
                // Log error but don't necessarily block user further, payment already failed
              } else {
                const failureData = await failureResponse.json();
                console.log("Payment Failure API Success Response:", failureData);
              }
            } catch (error) {
              console.error("Error submitting payment failure data:", error);
            }
          } else {
             console.error("Could not find bookingId to report payment failure.");
          }
          
          // Ensure button is re-enabled after failure handling
          setIsSubmitting(false); 
      });
      
      razorpay.open();

    } catch (error) {
      console.error("Error during booking/payment process:", error);
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false); // Re-enable button on error only
    }
  };

  // Handle popup close with redirect
  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    window.location.href = "https://altruliving.in";
  };

  // Show error message if hotel ID is missing
  if (showMissingHotelIdError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="p-6 border rounded-lg bg-red-50 border-red-200">
          <div className="text-red-600 font-medium mb-2">Hotel ID Not Found</div>
          <p className="text-gray-700 mb-4">
            Unable to complete your booking. The hotel ID is missing from the booking data.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Please go back to the property page and try selecting dates again.
          </p>
          <Link to={`/property/${propertyId}`} className="inline-flex items-center text-white bg-black px-4 py-2 rounded-md">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Return to Property Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-6xl"
      data-pol-id="o26xg5"
      data-pol-file-name="property-booking-confirmation"
      data-pol-file-type="page"
    >
      {/* Show success popup if payment is successful */}
      {showSuccessPopup && successDetails && (
        <SuccessPopup
          bookingId={successDetails.bookingId}
          amount={successDetails.amount}
          currency={successDetails.currency}
          paymentId={successDetails.paymentId}
          guestName={successDetails.guestName}
          checkIn={successDetails.checkIn}
          checkOut={successDetails.checkOut}
          onClose={handleCloseSuccessPopup}
        />
      )}

      <div
        className="mb-6"
        data-pol-id="21vizg"
        data-pol-file-name="property-booking-confirmation"
        data-pol-file-type="page"
      >
        {/* Use react-router-dom Link */}
        <Link
          to={`/property/${propertyId}`} // Use to instead of href
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
            message="Lowest price guarantee"
            subMessage="The rates listed in Altru Living website are minimum 5% less than those on Airbnb"
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
              {tripDetails.checkIn && tripDetails.checkOut ? (
              <TripDetailsSummary
                tripDetails={tripDetails}
                onEdit={handleEditTripDetails}
                data-pol-id="49rfb6"
                data-pol-file-name="property-booking-confirmation"
                data-pol-file-type="page"
              />
              ) : (
                <p>Loading trip details...</p> // Or some other loading/error state
              )}
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
            isSubmitting={isSubmitting}
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
                {pricing ? (
                <PropertyPriceBreakdown
                  pricing={pricing}
                  data-pol-id="wy34wk"
                  data-pol-file-name="property-booking-confirmation"
                  data-pol-file-type="page"
                />
                ) : (
                  <p>Calculating price...</p> // Show loading state for price
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

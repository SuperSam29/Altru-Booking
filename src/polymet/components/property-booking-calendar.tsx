"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { fetchAirbnbCalendar, getBlockedDates } from '../utils/airbnb-calendar';

// Hardcoded hotelId
const hotelId = "67eb400244436b877c006482";

// Helper function to get dates before today
function getPastDates(): Date[] {
  const pastDates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today

  // Go back a certain period, e.g., 1 year, adjust as needed
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - 1); // Start from yesterday
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  while (currentDate >= oneYearAgo) {
    pastDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return pastDates;
}

interface PropertyBookingCalendarProps {
  onChange?: (checkIn?: Date, checkOut?: Date) => void;
  defaultCheckInDate?: Date;
  defaultCheckOutDate?: Date;
  className?: string;
  propertyId: string;
}

// Hardcoded Airbnb iCal URL - (Keep commented out)
// const AIRBNB_ICAL_URL = "https://www.airbnb.co.uk/calendar/ical/1194779357845731963.ics?s=ca2a7532c96d1edb8cb1a49c80862fd1";

export default function PropertyBookingCalendar({
  onChange,
  defaultCheckInDate,
  defaultCheckOutDate,
  className,
  propertyId,
}: PropertyBookingCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(defaultCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(defaultCheckOutDate);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarMessage, setCalendarMessage] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [numNights, setNumNights] = useState(0);
  const [isInitialSelection, setIsInitialSelection] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);

  // State for dynamic pricing
  const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Handle check-in date change
  const handleDateSelect = (date: Date | { from?: Date; to?: Date } | undefined) => {
    if (!date) return;
    
    // If we have a date object (single date clicked)
    if (date instanceof Date) {
      // Direct field selection mode
      if (!isInitialSelection) {
        if (selectingCheckIn) {
          setCheckInDate(date);
          // If the new check-in date is after check-out date, clear check-out
          if (checkOutDate && date >= checkOutDate) {
            setCheckOutDate(undefined);
          }
        } else {
          // Selecting check-out date directly
          if (checkInDate && date <= checkInDate) {
            // Can't select a checkout date before checkin
            return;
          }
          setCheckOutDate(date);
        }
        // Don't close calendar automatically in direct selection mode
      } 
      // Initial sequential selection mode
      else {
        // If both dates already selected, reset and start over
        if (checkInDate && checkOutDate) {
          setCheckInDate(date);
          setCheckOutDate(undefined);
          return;
        }
        
        // First click or reset just happened
        if (!checkInDate) {
          setCheckInDate(date);
        } 
        // Second click
        else {
          // If selecting a date before check-in, use it as new check-in
          if (date <= checkInDate) {
            setCheckInDate(date);
            setCheckOutDate(undefined);
          } else {
            setCheckOutDate(date);
          }
        }
      }
    } 
    // If we have a date range object (range selected via drag)
    else if ('from' in date && date.from) {
      setCheckInDate(date.from);
      setCheckOutDate(date.to);
    }
  };

  // Check-in/Check-out selector
  const handleFieldClick = (isCheckIn: boolean) => {
    setIsCalendarOpen(true);
    setSelectingCheckIn(isCheckIn);
    setIsInitialSelection(false); // Switch to direct field selection mode
  };

  // Create a DateRange object for the calendar
  const selectedDateRange = checkInDate 
    ? { from: checkInDate, to: checkOutDate } 
    : undefined;

  // Function to fetch price from the new API
  const fetchPriceForDates = async (checkIn: Date, checkOut: Date) => {
    setIsPriceLoading(true);
    setPriceError(null);
    setDynamicPrice(null); // Clear previous price

    const checkInFormatted = checkIn.toISOString().split('T')[0]; // YYYY-MM-DD
    const checkOutFormatted = checkOut.toISOString().split('T')[0]; // YYYY-MM-DD

    const apiUrl = `https://api-nami.lucify.in/api/v1/booking/availability-pricing?hotelId=${hotelId}&checkInAt=${checkInFormatted}&checkOutAt=${checkOutFormatted}`;

    try {
      console.log("Fetching price from:", apiUrl);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Price API response:", data);

      // *** CORRECTED PATH: Access data.data ***
      const price = data?.data;
      
      if (typeof price === 'number') {
        setDynamicPrice(price);
      } else {
        console.error("Price not found or invalid format in API response:", data);
        throw new Error("Could not retrieve price.");
      }
    } catch (error) {
      console.error("Error fetching price:", error);
      setPriceError(error instanceof Error ? error.message : "Failed to fetch price.");
    } finally {
      setIsPriceLoading(false);
    }
  };

  // useEffect for initial setup (blocking past dates)
  useEffect(() => {
    // loadCalendarData(); // Keep commented out
    setBlockedDates(getPastDates()); 
    setIsLoading(false); 
    setCalendarMessage("Select your desired dates."); 
  }, []);

  // Update numNights and fetch dynamic price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      setNumNights(nights);
      // Fetch price when both dates are selected
      fetchPriceForDates(checkInDate, checkOutDate);
    } else {
      setNumNights(0);
      // Clear dynamic price if dates are incomplete
      setDynamicPrice(null);
      setPriceError(null);
      setIsPriceLoading(false);
    }
  }, [checkInDate, checkOutDate]);

  // Function to load calendar data - (Keep commented out)
  // const loadCalendarData = async () => { ... };

  // Update parent component when dates change
  useEffect(() => {
    if (onChange) {
      onChange(checkInDate, checkOutDate);
    }
  }, [checkInDate, checkOutDate, onChange]);

  // Handle calendar close
  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };
  
  // Clear dates
  const handleClearDates = () => {
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setSelectingCheckIn(true);
  };

  // Function to handle navigation to booking confirmation
  const handleBookingConfirmation = () => {
    // Check if dates, guests, and dynamic price are ready
    if (checkInDate && checkOutDate && guestCount > 0 && dynamicPrice !== null && !isPriceLoading && !priceError) {
      // Store booking details in localStorage
      localStorage.setItem('bookingCheckIn', checkInDate.toISOString());
      localStorage.setItem('bookingCheckOut', checkOutDate.toISOString());
      localStorage.setItem('bookingGuests', guestCount.toString());
      // Store the DYNAMIC price (total for the stay) as bookingBasePrice for confirmation page logic
      // NOTE: Confirmation page calculates tax based on this being the *nightly* price. 
      // We need to adjust either here (pass nightly) or on confirmation page (use total).
      // Let's calculate and pass the average nightly price for consistency with previous logic.
      const nightlyPrice = numNights > 0 ? dynamicPrice / numNights : 0;
      localStorage.setItem('bookingBasePrice', nightlyPrice.toString()); 

      // Use propertyId in the navigation path
      window.location.href = `/property/${propertyId}/booking`;
    } else {
      console.error('Booking details incomplete (dates, guests, or price fetching issue), cannot proceed.');
      // Optionally show an error message to the user
      if (priceError) setCalendarMessage(`Error: ${priceError}`);
      else if (isPriceLoading) setCalendarMessage("Still calculating price...");
      else setCalendarMessage("Please select dates and ensure price is loaded.");
    }
  };

  // Function to increment guest count
  const incrementGuests = () => {
    if (guestCount < 10) {
      setGuestCount(prev => prev + 1);
    }
  };

  // Function to decrement guest count
  const decrementGuests = () => {
    if (guestCount > 1) {
      setGuestCount(prev => prev - 1);
    }
  };

  // Check if all required data is selected for booking
  const isBookingReady = checkInDate && checkOutDate && guestCount > 0 && dynamicPrice !== null && !isPriceLoading && !priceError;

  return (
    <div className={`${className}`}>
      {/* Nights display when dates are selected */}
      {numNights > 0 && (
        <div className="mb-4">
          <div className="text-lg font-semibold">{numNights} nights</div>
          <div className="text-sm text-gray-500">
            {checkInDate && format(checkInDate, "d MMM yyyy")} - {checkOutDate && format(checkOutDate, "d MMM yyyy")}
          </div>
        </div>
      )}
      
      {/* Check-in/Check-out selector */}
      <div className="grid grid-cols-2 border rounded-lg divide-x mb-4 relative">
        {/* Check-in field */}
        <div 
          onClick={() => handleFieldClick(true)}
          className="p-3 cursor-pointer hover:bg-gray-50 relative"
        >
          <div className="text-sm font-medium">CHECK-IN</div>
          <div className="mt-1">
            {checkInDate ? format(checkInDate, "dd/MM/yyyy") : "Select date"}
          </div>
          {checkInDate && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                setCheckInDate(undefined);
                setSelectingCheckIn(true);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Check-out field */}
        <div 
          onClick={() => handleFieldClick(false)}
          className="p-3 cursor-pointer hover:bg-gray-50 relative"
        >
          <div className="text-sm font-medium">CHECKOUT</div>
          <div className="mt-1">
            {checkOutDate ? format(checkOutDate, "dd/MM/yyyy") : "Select date"}
          </div>
          {checkOutDate && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                setCheckOutDate(undefined);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {/* Guest selector */}
      <div className="border rounded-lg mb-4">
        <div 
          onClick={() => setIsGuestSelectorOpen(!isGuestSelectorOpen)}
          className="p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
        >
          <div>
            <div className="text-sm font-medium">GUESTS</div>
            <div className="mt-1">
              {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
            </div>
          </div>
          <div className={`transition-transform duration-200 ${isGuestSelectorOpen ? 'rotate-180' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {isGuestSelectorOpen && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center">
              <span>Guests</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={decrementGuests}
                  disabled={guestCount <= 1}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${guestCount <= 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:border-gray-500'}`}
                >
                  -
                </button>
                <span>{guestCount}</span>
                <button
                  onClick={incrementGuests}
                  disabled={guestCount >= 10}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${guestCount >= 10 ? 'text-gray-300 cursor-not-allowed' : 'hover:border-gray-500'}`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Price and booking button */}
      <div>
        {/* Display Dynamic Price Info */} 
        {isPriceLoading && (
          <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
            <span>Calculating price...</span>
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        {priceError && (
          <div className="flex justify-between items-center mb-2 text-sm text-red-600">
            <span>Error loading price</span>
            {/* Optionally add retry button? */}
          </div>
        )}
        {dynamicPrice !== null && numNights > 0 && (
          <div className="flex justify-between items-center mb-2">
            {/* Display total price for the stay */}
            <span>Total for {numNights} nights</span> 
            <span>₹{dynamicPrice.toLocaleString()}</span>
          </div>
        )}
        
        <button
          onClick={handleBookingConfirmation}
          disabled={!isBookingReady}
          className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${isBookingReady ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {isBookingReady ? 'Reserve' : (isPriceLoading ? 'Calculating...' : (priceError ? 'Try Again Later' : 'Select dates'))}
        </button>
        
        <div className="text-center mt-2 text-sm text-gray-500">
          You won't be charged yet
        </div>
      </div>
      
      {/* Calendar Content - As a fixed overlay */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-[720px] w-[90%] max-h-[90vh] overflow-auto">
            <div className="p-6">
              {numNights > 0 && (
                <div className="mb-5">
                  <div className="text-lg font-semibold">{numNights} nights</div>
                  <div className="text-sm text-gray-500">
                    {checkInDate && format(checkInDate, "d MMM yyyy")} - {checkOutDate && format(checkOutDate, "d MMM yyyy")}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-semibold">
                  {!numNights ? "Select dates" : ""}
                </h3>
                <button
                  onClick={handleCalendarClose}
                  className="text-base font-medium"
                >
                  Close
                </button>
              </div>
              
              {isLoading ? (
                // This might not be reached anymore unless loadCalendarData is called elsewhere
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-3 text-base">Loading calendar data...</span>
                </div>
              ) : (
                <div className="w-full">
                  <Calendar 
                    mode="range"
                    selected={selectedDateRange}
                    onSelect={handleDateSelect}
                    // Use blockedDates prop with past dates
                    blockedDates={blockedDates} 
                    // Remove disabled prop
                    // disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))} 
                    className="w-full"
                    defaultMonth={checkInDate || new Date()}
                  />
                  
                  {/* Restore the legend for blocked dates */}
                  <div className="mt-6 flex items-center">
                    <div className="flex items-center mr-8">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">Blocked dates</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                      <span className="text-sm">Selected date</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6 pt-4 border-t">
                <button 
                  onClick={handleClearDates}
                  className="text-sm font-medium underline"
                >
                  Clear dates
                </button>
                {checkInDate && checkOutDate ? (
                  <button
                    onClick={handleCalendarClose}
                    className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium"
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={handleCalendarClose}
                    className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Guest selector would go here */}
    </div>
  );
}

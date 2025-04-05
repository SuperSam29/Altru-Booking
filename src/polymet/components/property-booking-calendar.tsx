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
import { useRouter } from "next/navigation";

interface PropertyBookingCalendarProps {
  onChange?: (checkIn?: Date, checkOut?: Date) => void;
  defaultCheckInDate?: Date;
  defaultCheckOutDate?: Date;
  className?: string;
  price?: number;
}

// Hardcoded Airbnb iCal URL
const AIRBNB_ICAL_URL = "https://www.airbnb.co.uk/calendar/ical/1194779357845731963.ics?s=ca2a7532c96d1edb8cb1a49c80862fd1";

export default function PropertyBookingCalendar({
  onChange,
  defaultCheckInDate,
  defaultCheckOutDate,
  className,
  price = 4500,
}: PropertyBookingCalendarProps) {
  const router = useRouter();
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

  // Load the calendar data when the component mounts
  useEffect(() => {
    loadCalendarData();
  }, []);

  // Update numNights when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      setNumNights(nights);
    } else {
      setNumNights(0);
    }
  }, [checkInDate, checkOutDate]);

  // Function to load calendar data
  const loadCalendarData = async () => {
    setCalendarMessage(null);
    setIsLoading(true);
    
    try {
      console.log('Fetching calendar data from Airbnb URL:', AIRBNB_ICAL_URL);
      
      // Fetch the calendar data
      const calendarData = await fetchAirbnbCalendar(AIRBNB_ICAL_URL);
      
      if (calendarData.success) {
        console.log('Successfully fetched calendar data');
        
        // Get the blocked dates
        const dates = getBlockedDates(calendarData);
        console.log(`Found ${dates.length} blocked dates`);
        
        // Get available dates count for messaging
        const availableDatesCount = calendarData.availableDates ? calendarData.availableDates.length : 0;
        
        // Update state
        setBlockedDates(dates);
        setLastRefreshed(new Date());
        
        // Set appropriate message based on the results
        if (availableDatesCount === 0) {
          setCalendarMessage('No available dates found.');
        } else {
          // Include information about booking periods and available dates
          const bookingPeriodsCount = calendarData.bookingPeriods ? calendarData.bookingPeriods.length : 0;
          setCalendarMessage(
            `${availableDatesCount} available dates shown with ${bookingPeriodsCount} booking periods.`
          );
        }
      } else {
        console.error('Failed to fetch calendar data');
        setCalendarMessage('Failed to fetch calendar data.');
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
      setCalendarMessage(`Error connecting to the calendar`);
      setBlockedDates([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    // Navigate to booking confirmation page using Next.js router
    router.push("/booking-confirmation");
    
    // Keep the old code commented out for reference if needed
    // window.location.href = "/booking-confirmation";
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
  const isBookingReady = checkInDate && checkOutDate && guestCount > 0;

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
        {numNights > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span>₹{price} × {numNights} nights</span>
            <span>₹{price * numNights}</span>
          </div>
        )}
        
        <button
          onClick={handleBookingConfirmation}
          disabled={!isBookingReady}
          className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${isBookingReady ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {isBookingReady ? 'Reserve' : 'Select dates'}
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
                    blockedDates={blockedDates}
                    className="w-full"
                    defaultMonth={checkInDate || new Date()}
                  />
                  
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

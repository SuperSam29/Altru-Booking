"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { differenceInDays, addDays } from "date-fns";

interface AvailabilityCalendarProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  onCheckInChange?: (date: Date | undefined) => void;
  onCheckOutChange?: (date: Date | undefined) => void;
  blockedDates?: Date[];
}

export default function AvailabilityCalendar({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  blockedDates = [],
}: AvailabilityCalendarProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectingCheckIn, setSelectingCheckIn] = useState(!checkInDate);

  // Calculate the number of nights between check-in and check-out
  const numNights = checkInDate && checkOutDate
    ? differenceInDays(checkOutDate, checkInDate)
    : 0;

  // Check if a date is blocked (unavailable)
  const isDateBlocked = (date: Date) => {
    // With our updated approach:
    // - dates in the blockedDates array (which are dates NOT in the availableDates array) are blocked
    // - dates before today are blocked
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Block dates in the past
    if (date < today) {
      return true;
    }
    
    // Normalize the date to noon to avoid timezone issues
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, 0, 0
    );
    
    // Check if this date is in our blocked dates list
    return blockedDates.some(blockedDate => {
      // Create noon timestamp for comparison
      const normalizedBlockedDate = new Date(
        blockedDate.getFullYear(),
        blockedDate.getMonth(),
        blockedDate.getDate(),
        12, 0, 0
      );
      
      return normalizedDate.getTime() === normalizedBlockedDate.getTime();
    });
  };

  const handleDateSelect = (date: Date | { from?: Date; to?: Date } | undefined) => {
    // If we get a date range object or undefined, ignore it
    if (!date || typeof date !== 'object' || !(date instanceof Date)) {
      return;
    }
    
    // Now we know date is a Date object
    
    // Clear any existing errors
    setError(null);
    
    // If the date is blocked, show an error and don't allow selection
    if (isDateBlocked(date)) {
      setError("This date is not available for booking");
      return;
    }
    
    if (selectingCheckIn) {
      // If selecting check-in date
      onCheckInChange?.(date);
      setSelectingCheckIn(false);
      
      // If there's already a check-out date that's before the new check-in date,
      // clear the check-out date
      if (checkOutDate && checkOutDate <= date) {
        onCheckOutChange?.(undefined);
      }
    } else {
      // If selecting check-out date
      
      // Ensure the check-out date is after check-in date
      if (checkInDate && date <= checkInDate) {
        setError("Check-out date must be after check-in date");
        return;
      }
      
      // Check if there are any blocked dates between check-in and check-out
      if (checkInDate) {
        const dayAfterCheckIn = addDays(checkInDate, 1);
        let currentDate = dayAfterCheckIn;
        
        while (currentDate < date) {
          if (isDateBlocked(currentDate)) {
            setError("Your stay includes unavailable dates");
            return;
          }
          currentDate = addDays(currentDate, 1);
        }
      }
      
      onCheckOutChange?.(date);
      setSelectingCheckIn(true);
    }
  };

  const resetSelection = () => {
    onCheckInChange?.(undefined);
    onCheckOutChange?.(undefined);
    setSelectingCheckIn(true);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className={`p-3 border rounded-lg cursor-pointer ${selectingCheckIn ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onClick={() => setSelectingCheckIn(true)}
        >
          <div className="text-sm font-medium mb-1">Check-in</div>
          <div className="text-lg">
            {checkInDate ? checkInDate.toLocaleDateString() : 'Select date'}
          </div>
        </div>
        
        <div 
          className={`p-3 border rounded-lg cursor-pointer ${!selectingCheckIn ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onClick={() => checkInDate && setSelectingCheckIn(false)}
        >
          <div className="text-sm font-medium mb-1">Check-out</div>
          <div className="text-lg">
            {checkOutDate ? checkOutDate.toLocaleDateString() : 'Select date'}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {numNights > 0 && (
        <div className="p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
          {numNights} night{numNights !== 1 ? 's' : ''} selected
        </div>
      )}
      
      <Calendar 
        mode="single"
        selected={selectingCheckIn ? checkInDate : checkOutDate}
        onSelect={handleDateSelect}
        blockedDates={blockedDates}
        className="rounded-md border"
      />
      
      {(checkInDate || checkOutDate) && (
        <div className="flex justify-end">
          <button 
            onClick={resetSelection}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear dates
          </button>
        </div>
      )}
    </div>
  );
}

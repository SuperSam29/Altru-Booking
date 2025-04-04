"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateRange, Calendar } from "@/components/ui/calendar";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  addMonths,
  isSameDay,
  isBefore,
  isAfter,
  differenceInDays,
  isWithinInterval,
} from "date-fns";

interface AvailabilityCalendarProps {
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
  className?: string;
  blockedDates?: Date[];
  onClose?: () => void;
}

export default function AvailabilityCalendar({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  className,
  blockedDates = [],
  onClose,
}: AvailabilityCalendarProps) {
  const [nightsCount, setNightsCount] = useState<number | null>(null);
  
  // Calculate nights count when both dates are selected
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      setNightsCount(differenceInDays(checkOutDate, checkInDate));
    } else {
      setNightsCount(null);
    }
  }, [checkInDate, checkOutDate]);
  
  // Convert individual dates to DateRange format
  const selected: DateRange = {
    from: checkInDate,
    to: checkOutDate
  };
  
  // Handle date selection from the calendar
  const handleSelect = (value: DateRange | Date | undefined) => {
    if (!value) {
      onCheckInChange(undefined);
      onCheckOutChange(undefined);
      return;
    }
    
    if (value instanceof Date) {
      onCheckInChange(value);
      onCheckOutChange(undefined);
      return;
    }
    
    onCheckInChange(value.from);
    onCheckOutChange(value.to);
  };
  
  const handleClearDates = () => {
    onCheckInChange(undefined);
    onCheckOutChange(undefined);
  };
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <div
      className={cn(
        "bg-white rounded-lg",
        className,
      )}
      data-pol-id="fnv83e"
      data-pol-file-name="availability-calendar"
      data-pol-file-type="component"
    >
      {/* Summary header - show only if there are dates selected */}
      {(checkInDate || checkOutDate) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {nightsCount !== null && nightsCount > 0
                ? `${nightsCount} ${nightsCount === 1 ? "night" : "nights"}`
                : "Select dates"}
            </p>
            {checkInDate && checkOutDate && (
              <p className="text-sm text-muted-foreground">
                {format(checkInDate, "d MMM yyyy")} -{" "}
                {format(checkOutDate, "d MMM yyyy")}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Use our custom calendar component */}
      <Calendar
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        blockedDates={blockedDates}
        onApply={handleClose}
        onClose={handleClose}
        className="border-none shadow-none p-0"
        showKeyboard={checkInDate && checkOutDate ? true : false}
      />
    </div>
  );
}

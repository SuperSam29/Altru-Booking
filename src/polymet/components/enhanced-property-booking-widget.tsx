"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyBookingCalendar from "@/polymet/components/property-booking-calendar";
import { BLOCKED_DATES } from "@/polymet/data/blocked-dates";
import { differenceInDays } from "date-fns";

interface EnhancedPropertyBookingWidgetProps {
  pricing: {
    basePrice: number;
    currency: string;
    includesFees: boolean;
  };
}

export default function EnhancedPropertyBookingWidget({
  pricing,
}: EnhancedPropertyBookingWidgetProps) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [nightsCount, setNightsCount] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  // Calculate nights count and total price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = differenceInDays(checkOutDate, checkInDate);
      setNightsCount(nights);
      setTotalPrice(nights * pricing.basePrice);
    } else {
      setNightsCount(null);
      setTotalPrice(null);
    }
  }, [checkInDate, checkOutDate, pricing.basePrice]);

  const handleDateChange = (checkIn?: Date, checkOut?: Date) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
  };

  const handleCheckAvailability = () => {
    console.log("Checking availability for:", {
      checkInDate,
      checkOutDate,
      guests,
      nightsCount,
      totalPrice,
    });
  };

  return (
    <div
      className="border rounded-xl shadow-sm p-6 space-y-4 sticky top-4"
      data-pol-id="gi6wo9"
      data-pol-file-name="enhanced-property-booking-widget"
      data-pol-file-type="component"
    >
      <div
        className="flex items-baseline justify-between"
        data-pol-id="ci4b8l"
        data-pol-file-name="enhanced-property-booking-widget"
        data-pol-file-type="component"
      >
        <div
          className="flex items-baseline gap-1"
          data-pol-id="z7pntj"
          data-pol-file-name="enhanced-property-booking-widget"
          data-pol-file-type="component"
        >
          <span
            className="text-xl font-bold"
            data-pol-id="cd7ws5"
            data-pol-file-name="enhanced-property-booking-widget"
            data-pol-file-type="component"
          >
            {pricing.currency}
            {pricing.basePrice}
          </span>
          <span
            className="text-muted-foreground"
            data-pol-id="rxhc0v"
            data-pol-file-name="enhanced-property-booking-widget"
            data-pol-file-type="component"
          >
            night
          </span>
        </div>
        {pricing.includesFees && (
          <span
            className="text-sm text-muted-foreground"
            data-pol-id="l18427"
            data-pol-file-name="enhanced-property-booking-widget"
            data-pol-file-type="component"
          >
            Prices include all fees
          </span>
        )}
      </div>

      <div
        className="space-y-2"
        data-pol-id="e4j8ky"
        data-pol-file-name="enhanced-property-booking-widget"
        data-pol-file-type="component"
      >
        <PropertyBookingCalendar
          onChange={handleDateChange}
          data-pol-id="er0dig"
          data-pol-file-name="enhanced-property-booking-widget"
          data-pol-file-type="component"
        />
      </div>

      <div
        className="text-center text-sm text-muted-foreground"
        data-pol-id="isdbjm"
        data-pol-file-name="enhanced-property-booking-widget"
        data-pol-file-type="component"
      >
        You won't be charged yet
      </div>
    </div>
  );
}

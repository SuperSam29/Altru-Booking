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
          onDateChange={handleDateChange}
          data-pol-id="er0dig"
          data-pol-file-name="enhanced-property-booking-widget"
          data-pol-file-type="component"
        />

        <div
          className="border rounded-b-md p-3"
          data-pol-id="6kn4qf"
          data-pol-file-name="enhanced-property-booking-widget"
          data-pol-file-type="component"
        >
          <div
            className="space-y-1"
            data-pol-id="9roogy"
            data-pol-file-name="enhanced-property-booking-widget"
            data-pol-file-type="component"
          >
            <p
              className="text-xs font-medium"
              data-pol-id="8r82u7"
              data-pol-file-name="enhanced-property-booking-widget"
              data-pol-file-type="component"
            >
              GUESTS
            </p>
            <Select
              value={guests}
              onValueChange={setGuests}
              data-pol-id="2oyuf7"
              data-pol-file-name="enhanced-property-booking-widget"
              data-pol-file-type="component"
            >
              <SelectTrigger
                className="border-0 p-0 h-auto shadow-none focus:ring-0"
                data-pol-id="l4iyfg"
                data-pol-file-name="enhanced-property-booking-widget"
                data-pol-file-type="component"
              >
                <SelectValue
                  placeholder="Select guests"
                  data-pol-id="6mcycl"
                  data-pol-file-name="enhanced-property-booking-widget"
                  data-pol-file-type="component"
                />
              </SelectTrigger>
              <SelectContent
                data-pol-id="hic44v"
                data-pol-file-name="enhanced-property-booking-widget"
                data-pol-file-type="component"
              >
                {[...Array(10)].map((_, i) => (
                  <SelectItem
                    key={i}
                    value={(i + 1).toString()}
                    data-pol-id={`oh1789_${i}`}
                    data-pol-file-name="enhanced-property-booking-widget"
                    data-pol-file-type="component"
                  >
                    {i + 1} {i === 0 ? "guest" : "guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {nightsCount !== null && totalPrice !== null && (
        <div
          className="border-t pt-4"
          data-pol-id="glsxcs"
          data-pol-file-name="enhanced-property-booking-widget"
          data-pol-file-type="component"
        >
          <div
            className="flex justify-between items-center mb-2"
            data-pol-id="9gw9th"
            data-pol-file-name="enhanced-property-booking-widget"
            data-pol-file-type="component"
          >
            <div
              className="text-sm"
              data-pol-id="tq8sl3"
              data-pol-file-name="enhanced-property-booking-widget"
              data-pol-file-type="component"
            >
              {pricing.currency}
              {pricing.basePrice} × {nightsCount} nights
            </div>
            <div
              className="text-sm"
              data-pol-id="k6vwxo"
              data-pol-file-name="enhanced-property-booking-widget"
              data-pol-file-type="component"
            >
              {pricing.currency}
              {totalPrice}
            </div>
          </div>
          <div
            className="flex justify-between items-center font-semibold"
            data-pol-id="p1h13f"
            data-pol-file-name="enhanced-property-booking-widget"
            data-pol-file-type="component"
          >
            <div
              data-pol-id="w0cb6n"
              data-pol-file-name="enhanced-property-booking-widget"
              data-pol-file-type="component"
            >
              Total
            </div>
            <div
              data-pol-id="ixcpir"
              data-pol-file-name="enhanced-property-booking-widget"
              data-pol-file-type="component"
            >
              {pricing.currency}
              {totalPrice}
            </div>
          </div>
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleCheckAvailability}
        disabled={!checkInDate || !checkOutDate}
        data-pol-id="du87h9"
        data-pol-file-name="enhanced-property-booking-widget"
        data-pol-file-type="component"
      >
        {checkInDate && checkOutDate ? "Check availability" : "Select dates"}
      </Button>

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

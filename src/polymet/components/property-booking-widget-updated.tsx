"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import DateRangeCalendar from "@/polymet/components/date-range-calendar";
import { BLOCKED_DATES } from "@/polymet/data/blocked-dates";

interface PropertyBookingWidgetProps {
  pricing: {
    basePrice: number;
    currency: string;
    includesFees: boolean;
  };
}

export default function PropertyBookingWidget({
  pricing,
}: PropertyBookingWidgetProps) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>(BLOCKED_DATES);
  const [isLoadingBlockedDates, setIsLoadingBlockedDates] = useState(false);

  // Simulate fetching blocked dates from an API
  useEffect(() => {
    const fetchBlockedDates = async () => {
      setIsLoadingBlockedDates(true);

      try {
        // In a real app, this would be an API call
        // await fetch('/api/blocked-dates')

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // We're using our mock data directly
        setBlockedDates(BLOCKED_DATES);
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      } finally {
        setIsLoadingBlockedDates(false);
      }
    };

    fetchBlockedDates();
  }, []);

  const handleCheckAvailability = () => {
    console.log("Checking availability for:", {
      checkInDate,
      checkOutDate,
      guests,
    });
  };

  return (
    <div
      className="border rounded-xl shadow-sm p-6 space-y-4 sticky top-4"
      data-pol-id="vx5ajd"
      data-pol-file-name="property-booking-widget-updated"
      data-pol-file-type="component"
    >
      <div
        className="flex items-baseline justify-between"
        data-pol-id="pfm8n4"
        data-pol-file-name="property-booking-widget-updated"
        data-pol-file-type="component"
      >
        <div
          className="flex items-baseline gap-1"
          data-pol-id="r2zsw7"
          data-pol-file-name="property-booking-widget-updated"
          data-pol-file-type="component"
        >
          <span
            className="text-xl font-bold"
            data-pol-id="5va4ib"
            data-pol-file-name="property-booking-widget-updated"
            data-pol-file-type="component"
          >
            {pricing.currency}
            {pricing.basePrice}
          </span>
          <span
            className="text-muted-foreground"
            data-pol-id="qqob8k"
            data-pol-file-name="property-booking-widget-updated"
            data-pol-file-type="component"
          >
            night
          </span>
        </div>
        {pricing.includesFees && (
          <span
            className="text-sm text-muted-foreground"
            data-pol-id="oxb0uj"
            data-pol-file-name="property-booking-widget-updated"
            data-pol-file-type="component"
          >
            Prices include all fees
          </span>
        )}
      </div>

      <div
        className="space-y-2"
        data-pol-id="flbrs8"
        data-pol-file-name="property-booking-widget-updated"
        data-pol-file-type="component"
      >
        <Popover
          open={isCalendarOpen}
          onOpenChange={setIsCalendarOpen}
          data-pol-id="5scic9"
          data-pol-file-name="property-booking-widget-updated"
          data-pol-file-type="component"
        >
          <PopoverTrigger
            asChild
            data-pol-id="bp1lgv"
            data-pol-file-name="property-booking-widget-updated"
            data-pol-file-type="component"
          >
            <div
              className="grid grid-cols-2 rounded-t-md overflow-hidden border cursor-pointer"
              data-pol-id="qsjf1q"
              data-pol-file-name="property-booking-widget-updated"
              data-pol-file-type="component"
            >
              <div
                className="p-3 border-r"
                data-pol-id="2yigab"
                data-pol-file-name="property-booking-widget-updated"
                data-pol-file-type="component"
              >
                <div
                  className="space-y-1"
                  data-pol-id="8sf51c"
                  data-pol-file-name="property-booking-widget-updated"
                  data-pol-file-type="component"
                >
                  <p
                    className="text-xs font-medium"
                    data-pol-id="3hn3ak"
                    data-pol-file-name="property-booking-widget-updated"
                    data-pol-file-type="component"
                  >
                    CHECK-IN
                  </p>
                  <div
                    className="flex items-center gap-2"
                    data-pol-id="fd1o28"
                    data-pol-file-name="property-booking-widget-updated"
                    data-pol-file-type="component"
                  >
                    {checkInDate ? (
                      format(checkInDate, "MMM d, yyyy")
                    ) : (
                      <span
                        className="text-muted-foreground"
                        data-pol-id="e6cdsp"
                        data-pol-file-name="property-booking-widget-updated"
                        data-pol-file-type="component"
                      >
                        Add date
                      </span>
                    )}
                    <CalendarIcon
                      className="h-4 w-4 opacity-50"
                      data-pol-id="j29e1d"
                      data-pol-file-name="property-booking-widget-updated"
                      data-pol-file-type="component"
                    />
                  </div>
                </div>
              </div>
              <div
                className="p-3"
                data-pol-id="netnfl"
                data-pol-file-name="property-booking-widget-updated"
                data-pol-file-type="component"
              >
                <div
                  className="space-y-1"
                  data-pol-id="nixt3l"
                  data-pol-file-name="property-booking-widget-updated"
                  data-pol-file-type="component"
                >
                  <p
                    className="text-xs font-medium"
                    data-pol-id="js1dbe"
                    data-pol-file-name="property-booking-widget-updated"
                    data-pol-file-type="component"
                  >
                    CHECKOUT
                  </p>
                  <div
                    className="flex items-center gap-2"
                    data-pol-id="v7e4hi"
                    data-pol-file-name="property-booking-widget-updated"
                    data-pol-file-type="component"
                  >
                    {checkOutDate ? (
                      format(checkOutDate, "MMM d, yyyy")
                    ) : (
                      <span
                        className="text-muted-foreground"
                        data-pol-id="1c1f38"
                        data-pol-file-name="property-booking-widget-updated"
                        data-pol-file-type="component"
                      >
                        Add date
                      </span>
                    )}
                    <CalendarIcon
                      className="h-4 w-4 opacity-50"
                      data-pol-id="9kk7yv"
                      data-pol-file-name="property-booking-widget-updated"
                      data-pol-file-type="component"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="center"
            data-pol-id="p645ak"
            data-pol-file-name="property-booking-widget-updated"
            data-pol-file-type="component"
          >
            {isLoadingBlockedDates ? (
              <div
                className="p-8 flex items-center justify-center"
                data-pol-id="q51i38"
                data-pol-file-name="property-booking-widget-updated"
                data-pol-file-type="component"
              >
                <div
                  className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"
                  data-pol-id="u9ixq8"
                  data-pol-file-name="property-booking-widget-updated"
                  data-pol-file-type="component"
                ></div>
              </div>
            ) : (
              <DateRangeCalendar
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onCheckInChange={setCheckInDate}
                onCheckOutChange={setCheckOutDate}
                blockedDates={blockedDates}
                data-pol-id="n38qbu"
                data-pol-file-name="property-booking-widget-updated"
                data-pol-file-type="component"
              />
            )}
          </PopoverContent>
        </Popover>

        <div
          className="border rounded-b-md p-3"
          data-pol-id="my6vgi"
          data-pol-file-name="property-booking-widget-updated"
          data-pol-file-type="component"
        >
          <div
            className="space-y-1"
            data-pol-id="088to5"
            data-pol-file-name="property-booking-widget-updated"
            data-pol-file-type="component"
          >
            <p
              className="text-xs font-medium"
              data-pol-id="ml0pey"
              data-pol-file-name="property-booking-widget-updated"
              data-pol-file-type="component"
            >
              GUESTS
            </p>
            <Select
              value={guests}
              onValueChange={setGuests}
              data-pol-id="66gtex"
              data-pol-file-name="property-booking-widget-updated"
              data-pol-file-type="component"
            >
              <SelectTrigger
                className="border-0 p-0 h-auto shadow-none focus:ring-0"
                data-pol-id="4ryvxx"
                data-pol-file-name="property-booking-widget-updated"
                data-pol-file-type="component"
              >
                <SelectValue
                  placeholder="Select guests"
                  data-pol-id="8t6e2g"
                  data-pol-file-name="property-booking-widget-updated"
                  data-pol-file-type="component"
                />
              </SelectTrigger>
              <SelectContent
                data-pol-id="zq2lv4"
                data-pol-file-name="property-booking-widget-updated"
                data-pol-file-type="component"
              >
                {[...Array(10)].map((_, i) => (
                  <SelectItem
                    key={i}
                    value={(i + 1).toString()}
                    data-pol-id={`fhmsn7_${i}`}
                    data-pol-file-name="property-booking-widget-updated"
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

      <Button
        className="w-full"
        size="lg"
        onClick={handleCheckAvailability}
        disabled={!checkInDate || !checkOutDate}
        data-pol-id="a4aaut"
        data-pol-file-name="property-booking-widget-updated"
        data-pol-file-type="component"
      >
        {checkInDate && checkOutDate ? "Check availability" : "Select dates"}
      </Button>

      <div
        className="text-center text-sm text-muted-foreground"
        data-pol-id="cqnzqh"
        data-pol-file-name="property-booking-widget-updated"
        data-pol-file-type="component"
      >
        You won't be charged yet
      </div>
    </div>
  );
}

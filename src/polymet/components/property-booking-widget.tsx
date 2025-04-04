"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
      data-pol-id="9et66s"
      data-pol-file-name="property-booking-widget"
      data-pol-file-type="component"
    >
      <div
        className="flex items-baseline justify-between"
        data-pol-id="xgydvs"
        data-pol-file-name="property-booking-widget"
        data-pol-file-type="component"
      >
        <div
          className="flex items-baseline gap-1"
          data-pol-id="swxl1c"
          data-pol-file-name="property-booking-widget"
          data-pol-file-type="component"
        >
          <span
            className="text-xl font-bold"
            data-pol-id="gomxu2"
            data-pol-file-name="property-booking-widget"
            data-pol-file-type="component"
          >
            {pricing.currency}
            {pricing.basePrice}
          </span>
          <span
            className="text-muted-foreground"
            data-pol-id="5xv8qa"
            data-pol-file-name="property-booking-widget"
            data-pol-file-type="component"
          >
            night
          </span>
        </div>
        {pricing.includesFees && (
          <span
            className="text-sm text-muted-foreground"
            data-pol-id="o8k3mq"
            data-pol-file-name="property-booking-widget"
            data-pol-file-type="component"
          >
            Prices include all fees
          </span>
        )}
      </div>

      <div
        className="grid grid-cols-2 gap-2"
        data-pol-id="agk96w"
        data-pol-file-name="property-booking-widget"
        data-pol-file-type="component"
      >
        <div
          className="col-span-2 grid grid-cols-2 rounded-t-md overflow-hidden border"
          data-pol-id="4e9fqb"
          data-pol-file-name="property-booking-widget"
          data-pol-file-type="component"
        >
          <div
            className="p-3 border-r"
            data-pol-id="dkw09j"
            data-pol-file-name="property-booking-widget"
            data-pol-file-type="component"
          >
            <Popover
              data-pol-id="zvw2hs"
              data-pol-file-name="property-booking-widget"
              data-pol-file-type="component"
            >
              <PopoverTrigger
                asChild
                data-pol-id="z3zoah"
                data-pol-file-name="property-booking-widget"
                data-pol-file-type="component"
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal p-0 h-auto"
                  data-pol-id="iorni8"
                  data-pol-file-name="property-booking-widget"
                  data-pol-file-type="component"
                >
                  <div
                    className="space-y-1"
                    data-pol-id="3f2pkx"
                    data-pol-file-name="property-booking-widget"
                    data-pol-file-type="component"
                  >
                    <p
                      className="text-xs font-medium"
                      data-pol-id="eal0ry"
                      data-pol-file-name="property-booking-widget"
                      data-pol-file-type="component"
                    >
                      CHECK-IN
                    </p>
                    <div
                      className="flex items-center gap-2"
                      data-pol-id="8i6h7b"
                      data-pol-file-name="property-booking-widget"
                      data-pol-file-type="component"
                    >
                      {checkInDate ? (
                        format(checkInDate, "MMM d, yyyy")
                      ) : (
                        <span
                          className="text-muted-foreground"
                          data-pol-id="8cunu9"
                          data-pol-file-name="property-booking-widget"
                          data-pol-file-type="component"
                        >
                          Add date
                        </span>
                      )}
                      <CalendarIcon
                        className="h-4 w-4 opacity-50"
                        data-pol-id="i9asp6"
                        data-pol-file-name="property-booking-widget"
                        data-pol-file-type="component"
                      />
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                data-pol-id="z0qv4d"
                data-pol-file-name="property-booking-widget"
                data-pol-file-type="component"
              >
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  data-pol-id="56hf9e"
                  data-pol-file-name="property-booking-widget"
                  data-pol-file-type="component"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div
            className="p-3"
            data-pol-id="jcl6ad"
            data-pol-file-name="property-booking-widget"
            data-pol-file-type="component"
          >
            <Popover
              data-pol-id="t6unqj"
              data-pol-file-name="property-booking-widget"
              data-pol-file-type="component"
            >
              <PopoverTrigger
                asChild
                data-pol-id="aho2ux"
                data-pol-file-name="property-booking-widget"
                data-pol-file-type="component"
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal p-0 h-auto"
                  data-pol-id="i0q2gn"
                  data-pol-file-name="property-booking-widget"
                  data-pol-file-type="component"
                >
                  <div
                    className="space-y-1"
                    data-pol-id="msu1io"
                    data-pol-file-name="property-booking-widget"
                    data-pol-file-type="component"
                  >
                    <p
                      className="text-xs font-medium"
                      data-pol-id="4sgxay"
                      data-pol-file-name="property-booking-widget"
                      data-pol-file-type="component"
                    >
                      CHECKOUT
                    </p>
                    <div
                      className="flex items-center gap-2"
                      data-pol-id="ln5iqb"
                      data-pol-file-name="property-booking-widget"
                      data-pol-file-type="component"
                    >
                      {checkOutDate ? (
                        format(checkOutDate, "MMM d, yyyy")
                      ) : (
                        <span
                          className="text-muted-foreground"
                          data-pol-id="i75faq"
                          data-pol-file-name="property-booking-widget"
                          data-pol-file-type="component"
                        >
                          Add date
                        </span>
                      )}
                      <CalendarIcon
                        className="h-4 w-4 opacity-50"
                        data-pol-id="z3vz8j"
                        data-pol-file-name="property-booking-widget"
                        data-pol-file-type="component"
                      />
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                data-pol-id="cbfyfh"
                data-pol-file-name="property-booking-widget"
                data-pol-file-type="component"
              >
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  initialFocus
                  disabled={(date) =>
                    date < new Date() || (checkInDate && date <= checkInDate)
                  }
                  data-pol-id="y22gun"
                  data-pol-file-name="property-booking-widget"
                  data-pol-file-type="component"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div
          className="col-span-2 border rounded-b-md p-3"
          data-pol-id="r3mqzk"
          data-pol-file-name="property-booking-widget"
          data-pol-file-type="component"
        >
          <div
            className="space-y-1"
            data-pol-id="jgqa0r"
            data-pol-file-name="property-booking-widget"
            data-pol-file-type="component"
          >
            <p
              className="text-xs font-medium"
              data-pol-id="jp3hnu"
              data-pol-file-name="property-booking-widget"
              data-pol-file-type="component"
            >
              GUESTS
            </p>
            <Select
              value={guests}
              onValueChange={setGuests}
              data-pol-id="m5kccf"
              data-pol-file-name="property-booking-widget"
              data-pol-file-type="component"
            >
              <SelectTrigger
                className="border-0 p-0 h-auto shadow-none focus:ring-0"
                data-pol-id="yh3q4u"
                data-pol-file-name="property-booking-widget"
                data-pol-file-type="component"
              >
                <SelectValue
                  placeholder="Select guests"
                  data-pol-id="suvmac"
                  data-pol-file-name="property-booking-widget"
                  data-pol-file-type="component"
                />
              </SelectTrigger>
              <SelectContent
                data-pol-id="2rd12o"
                data-pol-file-name="property-booking-widget"
                data-pol-file-type="component"
              >
                {[...Array(10)].map((_, i) => (
                  <SelectItem
                    key={i}
                    value={(i + 1).toString()}
                    data-pol-id={`aukd7s_${i}`}
                    data-pol-file-name="property-booking-widget"
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
        data-pol-id="y7ru1x"
        data-pol-file-name="property-booking-widget"
        data-pol-file-type="component"
      >
        Check availability
      </Button>

      <div
        className="text-center text-sm text-muted-foreground"
        data-pol-id="kwzvpk"
        data-pol-file-name="property-booking-widget"
        data-pol-file-type="component"
      >
        You won't be charged yet
      </div>
    </div>
  );
}

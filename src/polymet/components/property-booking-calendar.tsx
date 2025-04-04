"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, XIcon, RefreshCw, Loader2 } from "lucide-react";
import { format } from "date-fns";
import AvailabilityCalendar from "@/polymet/components/availability-calendar";
import { BLOCKED_DATES } from "@/polymet/data/blocked-dates";
import { fetchBlockedDatesFromIcal } from "@/polymet/utils/ical-parser";
import IcalSettings from "@/polymet/components/ical-settings";

interface PropertyBookingCalendarProps {
  onChange?: (checkIn?: Date, checkOut?: Date) => void;
  defaultCheckInDate?: Date;
  defaultCheckOutDate?: Date;
  className?: string;
}

export default function PropertyBookingCalendar({
  onChange,
  defaultCheckInDate,
  defaultCheckOutDate,
  className,
}: PropertyBookingCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(defaultCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(defaultCheckOutDate);
  const [blockedDates, setBlockedDates] = useState<Date[]>(BLOCKED_DATES);
  const [icalUrl, setIcalUrl] = useState<string>("");
  const [isLoadingBlockedDates, setIsLoadingBlockedDates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [showIcalSettings, setShowIcalSettings] = useState(false);

  // Fetch blocked dates from the API
  const fetchBlockedDates = async (url?: string) => {
    setIsLoadingBlockedDates(true);
    setError(null);

    try {
      if (url) {
        // Fetch real data from the API
        const dates = await fetchBlockedDatesFromIcal(url);
        setBlockedDates(dates);
        setLastRefreshed(new Date());
      } else {
        // Use mock data as fallback
        setBlockedDates(BLOCKED_DATES);
      }
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
      setError("Failed to load availability data. Using default blocked dates.");
      // Use mock data as fallback
      setBlockedDates(BLOCKED_DATES);
    } finally {
      setIsLoadingBlockedDates(false);
    }
  };

  // Fetch blocked dates when component mounts or icalUrl changes
  useEffect(() => {
    fetchBlockedDates();
  }, [icalUrl]);

  // Update parent component when dates change
  useEffect(() => {
    if (onChange) {
      onChange(checkInDate, checkOutDate);
    }
  }, [checkInDate, checkOutDate, onChange]);

  // Handle check-in date change
  const handleCheckInChange = (date: Date | undefined) => {
    setCheckInDate(date);
    if (!date) {
      setCheckOutDate(undefined);
    }
  };

  // Handle check-out date change
  const handleCheckOutChange = (date: Date | undefined) => {
    setCheckOutDate(date);
    if (date && checkInDate) {
      // Close the calendar when both dates are selected
      setIsCalendarOpen(false);
    }
  };

  // Handle calendar close
  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  return (
    <div className={className}>
      {showIcalSettings ? (
        <div className="space-y-4">
          <IcalSettings 
            initialUrl={icalUrl}
            onUrlChange={(url) => {
              setIcalUrl(url);
              setShowIcalSettings(false);
              // Refetch blocked dates when URL changes
              fetchBlockedDates(url);
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIcalSettings(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm mb-4">
            <p><strong>Note:</strong> This calendar is currently showing <strong>mock blocked dates</strong> for demonstration purposes. 
            In a production environment, real blocked dates would be fetched from the iCal URL.</p>
            
            {icalUrl && (
              <div className="mt-2">
                <p className="font-medium">Connected iCal URL:</p>
                <p className="text-xs break-all">{icalUrl}</p>
              </div>
            )}
            
            <div className="mt-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIcalSettings(true)}
              >
                {icalUrl ? "Change iCal URL" : "Connect iCal Calendar"}
              </Button>
              
              {icalUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchBlockedDates(icalUrl)}
                >
                  Refresh Dates
                </Button>
              )}
            </div>
          </div>
          
          <Popover
            open={isCalendarOpen}
            onOpenChange={setIsCalendarOpen}
          >
            <PopoverTrigger asChild>
              <div className="grid grid-cols-2 rounded-t-md overflow-hidden border cursor-pointer">
                <div className="p-3 border-r">
                  <div className="space-y-1">
                    <p className="text-xs font-medium">
                      CHECK-IN
                    </p>
                    <div className="flex items-center gap-2">
                      {checkInDate ? (
                        format(checkInDate, "dd/MM/yyyy")
                      ) : (
                        <span className="text-muted-foreground">
                          Add date
                        </span>
                      )}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium">
                      CHECKOUT
                    </p>
                    <div className="flex items-center gap-2">
                      {checkOutDate ? (
                        format(checkOutDate, "dd/MM/yyyy")
                      ) : (
                        <span className="text-muted-foreground">
                          Add date
                        </span>
                      )}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              {isLoadingBlockedDates ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading availability...
                  </p>
                </div>
              ) : error ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <p className="text-sm text-red-500 mb-2">{error}</p>
                  <Button variant="outline" size="sm" onClick={() => setIsCalendarOpen(false)}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <div className="p-2 flex justify-between items-center border-b">
                    <div className="text-xs text-muted-foreground">
                      {lastRefreshed ? (
                        <span>Last refreshed: {format(lastRefreshed, "MMM d, yyyy HH:mm")}</span>
                      ) : (
                        <span>Availability data loaded</span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => fetchBlockedDates(icalUrl)} 
                      disabled={isLoadingBlockedDates}
                      className="h-7 w-7 p-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <AvailabilityCalendar 
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    onCheckInChange={handleCheckInChange}
                    onCheckOutChange={handleCheckOutChange}
                    blockedDates={blockedDates}
                    onClose={handleCalendarClose}
                  />
                </>
              )}
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PropertyBookingCalendar from "@/polymet/components/property-booking-calendar";
import IcalSettings from "@/polymet/components/ical-settings";

export default function BookingWithIcalPage() {
  const [icalUrl, setIcalUrl] = useState<string>(
    "https://www.airbnb.co.uk/calendar/ical/1194779357845731963.ics?s=ca2a7532c96d1edb8cb1a49c80862fd1"
  );
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);

  const handleDateChange = (checkIn?: Date, checkOut?: Date) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
  };

  const handleIcalUrlChange = (url: string) => {
    setIcalUrl(url);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Property Booking with iCal Integration</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Property Image</span>
              </div>
              <p className="text-gray-700 mb-6">
                This is a beautiful property with stunning views. Book your stay now by selecting
                available dates in the calendar. The calendar shows real-time availability data
                fetched from an iCal feed.
              </p>

              <h3 className="text-lg font-medium mb-3">Check Availability</h3>
              <PropertyBookingCalendar 
                onDateChange={handleDateChange} 
                icalUrl={icalUrl}
              />

              {checkInDate && checkOutDate && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Your Selection</h3>
                  <p>
                    Check-in: <span className="font-medium">{checkInDate.toLocaleDateString()}</span>
                  </p>
                  <p>
                    Check-out: <span className="font-medium">{checkOutDate.toLocaleDateString()}</span>
                  </p>
                  <p className="mt-2">
                    Total nights:{" "}
                    <span className="font-medium">
                      {Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <IcalSettings 
            initialUrl={icalUrl} 
            onUrlChange={handleIcalUrlChange} 
          />
          
          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-3">About iCal Integration</h3>
            <p className="text-sm text-gray-600">
              This demo shows how to integrate external calendar data using iCal feeds. The
              calendar displays blocked dates from the iCal feed, preventing users from
              selecting dates that are already booked or unavailable.
            </p>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Real-time availability from external calendars</li>
              <li>Prevents double bookings</li>
              <li>Compatible with major booking platforms</li>
              <li>Easily update the calendar source</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
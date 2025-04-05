/**
 * Airbnb Calendar API Client
 * Provides utilities for fetching and processing Airbnb calendar data
 */

// Types for the calendar data
export interface AirbnbCalendarData {
  success: boolean;
  availableDates: string[];
  unavailableDates: string[];
  bookingPeriods: BookingPeriod[];
}

export interface BookingPeriod {
  start: string;
  end: string;
  type: 'booked' | 'unavailable';
}

export interface CalendarApiResponse {
  success: boolean;
  calendar?: AirbnbCalendarData;
  error?: string;
  message?: string;
}

/**
 * Fetch calendar data from Airbnb iCal URL
 * @param icalUrl The Airbnb iCal URL
 * @returns Calendar data including available/unavailable dates and booking periods
 */
export async function fetchAirbnbCalendar(icalUrl: string): Promise<AirbnbCalendarData> {
  console.log('Fetching Airbnb calendar data from:', icalUrl);
  
  try {
    // Call our custom API endpoint
    const response = await fetch(`/api/airbnb-calendar?url=${encodeURIComponent(icalUrl)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: CalendarApiResponse = await response.json();
    console.log('Received calendar API response:', data);
    
    if (!data.success || !data.calendar) {
      throw new Error(data.error || 'Failed to fetch calendar data');
    }
    
    // Return the calendar data directly - we'll process available/blocked dates in the specific functions
    return data.calendar;
  } catch (error) {
    console.error('Error fetching Airbnb calendar:', error);
    // Return empty data on error
    return {
      success: false,
      availableDates: [],
      unavailableDates: [],
      bookingPeriods: []
    };
  }
}

/**
 * Convert string dates to Date objects
 * @param dateStrings Array of date strings in YYYY-MM-DD format
 * @returns Array of Date objects
 */
export function convertToDateObjects(dateStrings: string[]): Date[] {
  return dateStrings.map(dateStr => {
    // Create date at noon to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day, 12, 0, 0);
    return date;
  });
}

/**
 * Get all available dates from the calendar data
 * @param calendarData The calendar data
 * @returns Array of Date objects for all available dates
 */
export function getAvailableDates(calendarData: AirbnbCalendarData): Date[] {
  if (!calendarData || !calendarData.availableDates) {
    return [];
  }
  
  return convertToDateObjects(calendarData.availableDates);
}

/**
 * Get all blocked dates from the calendar data
 * Now returns all dates NOT in availableDates
 * @param calendarData The calendar data
 * @returns Array of Date objects for all blocked dates
 */
export function getBlockedDates(calendarData: AirbnbCalendarData): Date[] {
  console.log('Getting blocked dates - displaying only availableDates as available, rest as blocked');
  
  if (!calendarData || !calendarData.availableDates) {
    return [];
  }
  
  // Create a Set of available dates for efficient lookup
  const availableDatesSet = new Set(calendarData.availableDates);
  
  // Get the range of dates to consider (1 year from now)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(today.getFullYear() + 1);
  
  // Generate all dates in the range
  const allDates = getAllDatesInRange(today, oneYearFromNow);
  
  // Filter out the available dates to get blocked dates
  const blockedDates = allDates.filter(date => {
    const formattedDate = formatDate(date);
    
    // Check if the date is not in the availableDates set
    return !availableDatesSet.has(formattedDate);
  });
  
  // Create a set of dates before today
  const pastDates: Date[] = [];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Generate all past dates within a reasonable range (1 year back)
  // for display purposes in the calendar
  const pastDatesInRange = getAllDatesInRange(oneYearAgo, today);
  pastDates.push(...pastDatesInRange);
  
  console.log(`Found ${blockedDates.length} blocked dates (unavailable) and ${pastDates.length} past dates`);
  
  // Combine blocked dates and past dates
  return [...blockedDates, ...pastDates];
}

/**
 * Get all dates in a range (inclusive start, exclusive end)
 * @param startDate The start date (inclusive)
 * @param endDate The end date (exclusive)
 * @returns Array of dates in the range
 */
export function getAllDatesInRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  // Loop until we reach the end date (exclusive)
  while (currentDate < endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * Check if a date is blocked (unavailable)
 * @param date The date to check
 * @param blockedDates Array of blocked dates
 * @returns true if the date is blocked, false otherwise
 */
export function isDateBlocked(date: Date, blockedDates: Date[]): boolean {
  // Normalize the date to noon to match how we store our dates
  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12, 0, 0
  );
  
  // Check if any of the blocked dates match this day
  return blockedDates.some(blockedDate => {
    // Normalize the blocked date to noon as well
    const normalizedBlockedDate = new Date(
      blockedDate.getFullYear(),
      blockedDate.getMonth(),
      blockedDate.getDate(),
      12, 0, 0
    );
    
    // Compare the dates based on timestamp at noon
    return normalizedDate.getTime() === normalizedBlockedDate.getTime();
  });
}

/**
 * Check if a date is available for booking
 * @param date The date to check
 * @param blockedDates Array of blocked dates
 * @returns true if the date is available, false otherwise
 */
export function isDateAvailable(date: Date, blockedDates: Date[]): boolean {
  return !isDateBlocked(date, blockedDates);
}

/**
 * Format a Date object to YYYY-MM-DD string
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
} 
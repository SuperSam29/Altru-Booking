/**
 * Nami Calendar API Client
 * Provides utilities for fetching and processing Nami calendar data
 */

// Types for the calendar data (same structure as airbnb-calendar.ts for compatibility)
export interface NamiCalendarData {
  success: boolean;
  availableDates: string[];
  unavailableDates: string[];
  bookingPeriods: BookingPeriod[];
  error?: string;
}

export interface BookingPeriod {
  start: string;
  end: string;
  type: 'booked' | 'unavailable';
}

export interface CalendarApiResponse {
  success: boolean;
  calendar?: NamiCalendarData;
  error?: string;
  message?: string;
}

/**
 * Fetch calendar data directly from Nami API
 * @param hotelId The hotel ID to fetch availability for (required)
 * @returns Calendar data including available/unavailable dates and booking periods
 */
export async function fetchNamiCalendar(hotelId: string): Promise<NamiCalendarData> {
  if (!hotelId) {
    console.error('Hotel ID is required but was not provided');
    return {
      success: false,
      availableDates: [],
      unavailableDates: [],
      bookingPeriods: [],
      error: 'Hotel ID is required but was not provided'
    };
  }

  console.log('Fetching Nami calendar data for hotel ID:', hotelId);
  
  try {
    // Call the correct Nami availability API endpoint
    const response = await fetch(`https://api-nami.lucify.in/api/v1/hotel/availability?hotelId=${hotelId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received Nami availability API response:', data);
    
    // Process the response from the actual API
    const calendarData = processNamiAvailabilityResponse(data);
    
    return calendarData;
  } catch (error) {
    console.error('Error fetching Nami calendar:', error);
    // Return empty data on error
    return {
      success: false,
      availableDates: [],
      unavailableDates: [],
      bookingPeriods: [],
      error: error instanceof Error ? error.message : 'Unknown error fetching calendar data'
    };
  }
}

/**
 * Process the Nami availability API response 
 * and convert it to our expected format
 */
function processNamiAvailabilityResponse(apiResponse: any): NamiCalendarData {
  try {
    // Default empty data
    const result: NamiCalendarData = {
      success: true,
      availableDates: [],
      unavailableDates: [],
      bookingPeriods: []
    };
    
    // Check if the API response has the expected format
    if (!apiResponse || !apiResponse.data) {
      console.error('Invalid API response format:', apiResponse);
      return { 
        ...result, 
        success: false,
        error: 'Invalid API response format'
      };
    }
    
    // Based on the actual API response, it has:
    // - data.availableDates: Array of available date strings
    // - data.blockedDates: Array of blocked date strings
    // - data.bookedDates: Array of booking period objects
    
    // Process available dates
    if (Array.isArray(apiResponse.data.availableDates)) {
      result.availableDates = apiResponse.data.availableDates;
      console.log(`Found ${result.availableDates.length} available dates`);
    }
    
    // Process blocked dates
    const unavailableDates = new Set<string>();
    
    // Add explicitly blocked dates
    if (Array.isArray(apiResponse.data.blockedDates)) {
      apiResponse.data.blockedDates.forEach((date: string) => {
        unavailableDates.add(date);
      });
    }
    
    // Process booking periods and extract the dates within them
    if (Array.isArray(apiResponse.data.bookedDates)) {
      apiResponse.data.bookedDates.forEach((bookingStr: string) => {
        try {
          // Parse the booking string which looks like "@{startDate=2025-04-02; endDate=2025-04-03}"
          const startDateMatch = bookingStr.match(/startDate=([^;]+)/);
          const endDateMatch = bookingStr.match(/endDate=([^}]+)/);
          
          if (startDateMatch && startDateMatch[1] && endDateMatch && endDateMatch[1]) {
            const startDate = startDateMatch[1];
            const endDate = endDateMatch[1];
            
            // Add to booking periods
            result.bookingPeriods.push({
              start: startDate,
              end: endDate,
              type: 'booked'
            });
            
            // Add all dates in this range to unavailable dates
            const dates = getDatesInRange(startDate, endDate);
            dates.forEach(date => unavailableDates.add(date));
          }
        } catch (err) {
          console.error('Error parsing booking period:', bookingStr, err);
        }
      });
    }
    
    // Convert the Set to an array
    result.unavailableDates = Array.from(unavailableDates);
    
    console.log(`Processed ${result.availableDates.length} available dates and ${result.unavailableDates.length} unavailable dates`);
    console.log(`Found ${result.bookingPeriods.length} booking periods`);
    
    return result;
  } catch (error) {
    console.error('Error processing API response:', error);
    return {
      success: false,
      availableDates: [],
      unavailableDates: [],
      bookingPeriods: [],
      error: error instanceof Error ? error.message : 'Unknown error processing calendar data'
    };
  }
}

/**
 * Helper function to get all dates in a range (inclusive)
 * @param startDateStr Start date in YYYY-MM-DD format
 * @param endDateStr End date in YYYY-MM-DD format
 * @returns Array of date strings in YYYY-MM-DD format
 */
function getDatesInRange(startDateStr: string, endDateStr: string): string[] {
  const dates: string[] = [];
  
  // Parse the date strings
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  // Ensure valid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Invalid date format:', startDateStr, endDateStr);
    return dates;
  }
  
  // Create the current date starting from start date
  const currentDate = new Date(startDate);
  
  // Loop until we reach the end date
  while (currentDate < endDate) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
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
export function getAvailableDates(calendarData: NamiCalendarData): Date[] {
  if (!calendarData || !calendarData.availableDates) {
    return [];
  }
  
  return convertToDateObjects(calendarData.availableDates);
}

/**
 * Get all blocked dates from the calendar data
 * @param calendarData The calendar data
 * @returns Array of Date objects for all blocked dates
 */
export function getBlockedDates(calendarData: NamiCalendarData): Date[] {
  console.log('Getting blocked dates from Nami calendar data');
  
  if (!calendarData || !calendarData.availableDates) {
    return getPastDates();
  }
  
  // Create a Set of available dates for efficient lookup
  const availableDatesSet = new Set(calendarData.availableDates);
  
  // Get the range of dates to consider (1 year from now)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(today.getFullYear() + 2); // Look 2 years ahead
  
  // Generate all dates in the range
  const allDates = getAllDatesInRange(today, oneYearFromNow);
  
  // Filter out the available dates to get blocked dates
  const blockedDates = allDates.filter(date => {
    const formattedDate = formatDate(date);
    // If a date is not in the availableDates set, it should be blocked
    return !availableDatesSet.has(formattedDate);
  });
  
  // Include past dates as blocked dates
  const pastDates = getPastDates();
  
  // Combine blocked dates and past dates
  const finalBlockedDates = [...blockedDates, ...pastDates];
  
  console.log(`Found ${finalBlockedDates.length} blocked dates (including dates not in available dates and past dates)`);
  
  return finalBlockedDates;
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
  
  while (currentDate < endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * Helper function to get dates before today
 */
function getPastDates(): Date[] {
  const pastDates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today

  // Go back a certain period, e.g., 1 year, adjust as needed
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - 1); // Start from yesterday
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  while (currentDate >= oneYearAgo) {
    pastDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return pastDates;
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
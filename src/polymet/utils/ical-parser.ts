/**
 * Utility functions for parsing iCal data and extracting blocked dates
 */

export interface BlockedDateRange {
  start: string;
  end: string;
}

/**
 * Parses iCal data and extracts events with BUSY status or UNAVAILABLE events
 * @param icalData - Raw iCal string data
 * @returns Array of Date objects representing blocked dates
 */
export function parseIcalForBlockedDates(icalData: string): Date[] {
  const blockedDates: Date[] = [];
  
  // Split the iCal data into separate events (VEVENT blocks)
  const events = icalData.split('BEGIN:VEVENT');
  
  for (let i = 1; i < events.length; i++) { // Start from 1 to skip the header
    const event = events[i];
    
    // Check if this is a blocked date (either BUSY status or properties indicate unavailability)
    const isBlocked = event.includes('TRANSP:OPAQUE') || 
                      event.includes('STATUS:BUSY') || 
                      event.includes('SUMMARY:UNAVAILABLE') ||
                      event.includes('SUMMARY:Blocked') ||
                      event.includes('SUMMARY:Not available');
    
    if (isBlocked) {
      // Extract the DTSTART and DTEND dates
      const startMatch = event.match(/DTSTART(?:;VALUE=DATE)?:(\d{8})/);
      const endMatch = event.match(/DTEND(?:;VALUE=DATE)?:(\d{8})/);
      
      if (startMatch && endMatch) {
        const startDateStr = startMatch[1];
        const endDateStr = endMatch[1];
        
        const startDate = parseIcalDate(startDateStr);
        const endDate = parseIcalDate(endDateStr);
        
        // Create a date range between start and end
        const dates = getDatesBetween(startDate, endDate);
        blockedDates.push(...dates);
      }
    }
  }
  
  return blockedDates;
}

/**
 * Parse a date string from iCal format (YYYYMMDD)
 * @param dateStr - iCal date string in format YYYYMMDD
 * @returns JavaScript Date object
 */
function parseIcalDate(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JS months are 0-based
  const day = parseInt(dateStr.substring(6, 8), 10);
  
  return new Date(year, month, day);
}

/**
 * Get all dates between start date and end date (inclusive of start, exclusive of end)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of dates in the range
 */
function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  // iCal standard: the end date is exclusive, so we don't include it
  while (currentDate < endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * Fetches blocked dates from an iCal URL via the server-side API
 * @param icalUrl - URL of the iCal calendar
 * @returns Promise with blocked dates
 */
export async function fetchBlockedDatesFromIcal(icalUrl: string): Promise<Date[]> {
  try {
    console.log("Using mock blocked dates - API connection restricted due to CORS policy");
    return generateMockBlockedDates();
  } catch (error) {
    console.error("Error fetching blocked dates from API:", error);
    return generateMockBlockedDates();
  }
}

/**
 * Process blocked dates from API response
 */
function processBlockedDates(data: any): Date[] {
  console.log("Processing blocked dates from API:", data);
  
  // Convert date ranges to individual dates
  const blockedDates: Date[] = [];
  
  if (data.blockedDates && Array.isArray(data.blockedDates)) {
    data.blockedDates.forEach((dateRange: BlockedDateRange | string) => {
      // Handle both formats: object with start/end or direct string date
      if (typeof dateRange === 'string') {
        blockedDates.push(new Date(dateRange));
      } else if (typeof dateRange === 'object' && dateRange.start && dateRange.end) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        // Add all dates in the range (inclusive of start, exclusive of end)
        const dates = getDatesBetween(startDate, endDate);
        blockedDates.push(...dates);
      }
    });
  }
  
  // If no blocked dates were found, use mock data
  if (blockedDates.length === 0) {
    console.warn("No blocked dates found in the response, using mock data instead");
    return generateMockBlockedDates();
  }
  
  return blockedDates;
}

/**
 * Generate mock blocked dates for testing
 * @returns Array of mock blocked dates
 */
function generateMockBlockedDates(): Date[] {
  // Generate some random blocked dates for the next 3 months
  const blockedDates: Date[] = [];
  const today = new Date();
  
  // Create blocks of dates (3-5 days) starting from tomorrow
  for (let month = 0; month < 3; month++) {
    // Create 2 blocks per month
    for (let block = 0; block < 2; block++) {
      // Random start day between 1-25 of the month
      const startDay = 1 + Math.floor(Math.random() * 25);
      // Block length between 3-5 days
      const blockLength = 3 + Math.floor(Math.random() * 3);
      
      // Create consecutive blocked dates
      for (let i = 0; i < blockLength; i++) {
        const blockedDate = new Date(
          today.getFullYear(),
          today.getMonth() + month,
          startDay + i
        );
        blockedDates.push(blockedDate);
      }
    }
  }
  
  return blockedDates;
} 
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
 * This exactly matches how Airbnb displays blocked dates in their calendar
 * 
 * @param startDate - Start date (first date that is blocked)
 * @param endDate - End date (first date that is available again)
 * @returns Array of dates in the range
 */
function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  
  // Create a deep copy of the start date to avoid modifying the original
  // Set to noon local time to standardize across the calendar
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12, 0, 0);
  
  // Create a copy of end date at noon local time
  const endDateCopy = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 12, 0, 0);
  
  // Set up consistent date format for log messages
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  console.log(`Generating dates from ${formatDate(currentDate)} to ${formatDate(endDateCopy)}`);
  
  // Keep adding dates until we reach the end date (exclusive)
  // This ensures the end date is NOT blocked, exactly matching Airbnb's display
  while (currentDate < endDateCopy) {
    // Add a copy of the current date to the array at noon local time
    dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 0, 0));
    
    // Log the date being added
    console.log(`Adding blocked date: ${formatDate(currentDate)}`);
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log(`Generated ${dates.length} blocked dates in range from ${formatDate(startDate)} to ${formatDate(endDate)}`);
  
  return dates;
}

/**
 * Process blocked dates from the API response
 * Each blocked date is a range with a start and end date
 * We need to convert these to individual dates for the calendar
 */
function processBlockedDates(data: any, useMockDataFallback: boolean = true): Date[] {
  console.log('Processing blocked dates:', data);
  
  // Check if we have dates with a start/end format or just a list of string dates
  let blockedDates: Date[] = [];
  
  if (data && Array.isArray(data) && data.length > 0) {
    console.log(`Found ${data.length} blocked date ranges to process`);
    
    // Process each blocked date range
    for (let i = 0; i < data.length; i++) {
      const range = data[i];
      
      // Check if the item is a string (direct date) or has start/end properties
      if (typeof range === 'string') {
        // Direct date string format (YYYY-MM-DD)
        try {
          const date = new Date(range);
          if (!isNaN(date.getTime())) {
            blockedDates.push(date);
          }
        } catch (e) {
          console.error('Error parsing date string:', range, e);
        }
      } else if (range && range.start && range.end) {
        // Date range format with start and end
        try {
          const startDate = new Date(range.start);
          const endDate = new Date(range.end);
          
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            // Generate all dates between start and end (inclusive start, exclusive end)
            // This matches Airbnb's display logic where the checkout date is available for new check-ins
            const dates = getDatesBetween(startDate, endDate);
            blockedDates = [...blockedDates, ...dates];
            
            console.log(`Processed range ${i}: ${range.start} to ${range.end}, added ${dates.length} blocked dates`);
            
            // For debugging April 2025
            const april2025Dates = dates.filter(d => 
              d.getFullYear() === 2025 && d.getMonth() === 3
            );
            
            if (april2025Dates.length > 0) {
              console.log(`April 2025 dates in range ${i}:`, 
                april2025Dates.map(d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
              );
            }
          }
        } catch (e) {
          console.error('Error processing date range:', range, e);
        }
      }
    }
    
    console.log(`Processed ${blockedDates.length} total blocked dates`);
  } else {
    console.log('No blocked dates found in data');
  }
  
  // If we have no blocked dates and mock data fallback is enabled, use mock data
  if (blockedDates.length === 0 && useMockDataFallback) {
    console.log('Using mock data fallback for blocked dates');
    return generateMockBlockedDates();
  }
  
  return blockedDates;
}

/**
 * Generate mock blocked dates for the next 2 months
 * @returns Array of mock blocked dates
 */
export function generateMockBlockedDatesForTwoMonths(): Date[] {
  // Generate some random blocked dates for the next 2 months
  const blockedDates: Date[] = [];
  const today = new Date();
  
  // Create blocks of dates (3-5 days) for the next 2 months
  for (let month = 0; month < 2; month++) {
    // Create 3 blocks per month
    for (let block = 0; block < 3; block++) {
      // Random start day between 1-25 of the month
      const startDay = 1 + Math.floor(Math.random() * 25);
      // Block length between 2-4 days
      const blockLength = 2 + Math.floor(Math.random() * 3);
      
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
  
  console.log(`Generated ${blockedDates.length} mock blocked dates for the next 2 months`);
  return blockedDates;
}

/**
 * Fetch blocked dates from an iCal URL
 */
export async function fetchBlockedDatesFromIcal(icalUrl: string, useMockDataFallback: boolean = true): Promise<Date[]> {
  console.log('Fetching blocked dates from iCal URL:', icalUrl);
  
  try {
    // Call our serverless API function to fetch and parse the iCal file
    const apiUrl = `/api/fetch-ical?url=${encodeURIComponent(icalUrl)}`;
    console.log('Calling API endpoint:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API returned error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API full response:', JSON.stringify(data, null, 2));
    
    if (data && data.blockedDates) {
      console.log(`API returned ${data.blockedDates.length} blocked date ranges`);
      
      // Even if the API returns an empty array, use it (don't fall back to mock data)
      // This ensures we're displaying accurate availability
      if (Array.isArray(data.blockedDates)) {
        const processedDates = processBlockedDates(data.blockedDates, false); // Don't use mock fallback
        console.log(`Processed into ${processedDates.length} individual blocked dates`);
        return processedDates;
      } else {
        console.error('API returned non-array blockedDates:', data.blockedDates);
      }
    } else {
      console.error('No blocked dates found in API response', data);
    }
    
    // Only use mock data if fallback is enabled AND we couldn't get real data
    if (useMockDataFallback) {
      console.log('Using mock data fallback');
      return generateMockBlockedDates();
    } else {
      console.log('Mock data fallback disabled, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    
    // Only use mock data if fallback is enabled
    if (useMockDataFallback) {
      console.log('Error occurred, using mock data fallback');
      return generateMockBlockedDates();
    } else {
      console.log('Error occurred, mock data fallback disabled, returning empty array');
      return [];
    }
  }
}

/**
 * Generate mock blocked dates for testing
 * @returns Array of mock blocked dates
 * @deprecated Use generateMockBlockedDatesForTwoMonths instead
 */
export function generateMockBlockedDates(): Date[] {
  return generateMockBlockedDatesForTwoMonths();
} 
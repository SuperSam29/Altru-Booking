// api/airbnb-calendar.js - Dedicated Airbnb iCal parser for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get the iCal URL from the query parameters
  const { url } = req.query;

  console.log('[SERVER] Processing Airbnb iCal URL:', url);

  if (!url) {
    console.log('[SERVER] Missing URL parameter');
    return res.status(400).json({ 
      error: 'Missing URL parameter',
      success: false
    });
  }

  try {
    // Fetch the iCal data from Airbnb
    console.log('[SERVER] Fetching iCal data from Airbnb...');
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log('[SERVER] Failed to fetch from Airbnb:', response.status, response.statusText);
      throw new Error(`Failed to fetch iCal data: ${response.status} ${response.statusText}`);
    }
    
    // Extract the raw iCal text
    const icalData = await response.text();
    console.log('[SERVER] Received iCal data from Airbnb, length:', icalData.length);
    
    // Parse the calendar data
    const calendar = parseAirbnbCalendar(icalData);
    
    // Return the processed calendar data
    return res.status(200).json({ 
      success: true,
      calendar,
      message: 'Successfully processed Airbnb calendar'
    });
  } catch (error) {
    console.error('[SERVER] Error processing Airbnb calendar:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process Airbnb calendar',
      success: false
    });
  }
}

/**
 * Parse Airbnb iCal data with precision
 * Returns object with available/unavailable dates and booking periods
 */
function parseAirbnbCalendar(icalData) {
  // Quick validation - ensure this is a valid iCal file
  if (!icalData.includes('BEGIN:VCALENDAR') || !icalData.includes('END:VCALENDAR')) {
    console.log('[SERVER] Invalid iCal data, missing VCALENDAR tags');
    return {
      success: false,
      availableDates: [],
      unavailableDates: [],
      bookingPeriods: []
    };
  }
  
  console.log('[SERVER] Parsing Airbnb calendar data...');
  
  // Extract all events from the calendar
  const events = extractEvents(icalData);
  console.log(`[SERVER] Found ${events.length} events in the calendar`);
  
  // Process the dates from each event
  const results = processDates(events);
  
  // Fix the naming mismatch - swap available and unavailable dates
  // This is because in our API response, "unavailableDates" are actually dates available in Airbnb
  return {
    success: true,
    availableDates: results.unavailableDates, // These are actually available dates that didn't have bookings
    unavailableDates: results.availableDates, // These are actually unavailable dates
    bookingPeriods: results.bookingPeriods
  };
}

/**
 * Extract all VEVENT entries from the iCal data
 */
function extractEvents(icalData) {
  const events = [];
  const eventBlocks = icalData.split('BEGIN:VEVENT').slice(1);
  
  for (const block of eventBlocks) {
    const endIndex = block.indexOf('END:VEVENT');
    if (endIndex !== -1) {
      const eventData = block.substring(0, endIndex);
      
      // Extract key fields
      const summary = extractField(eventData, 'SUMMARY');
      const dtstart = extractField(eventData, 'DTSTART');
      const dtend = extractField(eventData, 'DTEND');
      const uid = extractField(eventData, 'UID');
      const description = extractField(eventData, 'DESCRIPTION');
      
      if (dtstart && dtend) {
        events.push({
          summary,
          start: parseIcalDate(dtstart),
          end: parseIcalDate(dtend),
          uid,
          description,
          raw: eventData
        });
      }
    }
  }
  
  // Sort events by start date
  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * Extract a field value from iCal event data
 */
function extractField(eventData, fieldName) {
  const regex = new RegExp(`${fieldName}(?:;[^:]*)?:([^\\r\\n]+)`);
  const match = eventData.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Parse an iCal date string to a JavaScript Date
 * Handles both basic date (YYYYMMDD) and date-time (YYYYMMDDTHHMMSSZ) formats
 */
function parseIcalDate(dateStr) {
  // Strip any property parameters before the colon
  if (dateStr.includes(':')) {
    dateStr = dateStr.split(':')[1];
  }
  
  // Basic date format: YYYYMMDD
  if (dateStr.length === 8) {
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JavaScript months are 0-based
    const day = parseInt(dateStr.substring(6, 8), 10);
    
    // Set to noon to avoid timezone issues
    return new Date(year, month, day, 12, 0, 0);
  }
  
  // Date-time format: YYYYMMDDTHHMMSSZ
  else if (dateStr.length > 8 && dateStr.includes('T')) {
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    
    // Check if there's time info
    if (dateStr.length >= 15) {
      const hour = parseInt(dateStr.substring(9, 11), 10);
      const minute = parseInt(dateStr.substring(11, 13), 10);
      const second = parseInt(dateStr.substring(13, 15), 10);
      
      // If Z is present, it's UTC time
      if (dateStr.endsWith('Z')) {
        const date = new Date(Date.UTC(year, month, day, hour, minute, second));
        return date;
      } else {
        return new Date(year, month, day, hour, minute, second);
      }
    }
    
    return new Date(year, month, day, 12, 0, 0);
  }
  
  // Default parse as ISO string
  return new Date(dateStr);
}

/**
 * Process all events to identify available and unavailable dates
 */
function processDates(events) {
  // Create sets to track dates
  const availableDates = new Set();
  const unavailableDates = new Set();
  const bookingPeriods = [];
  
  // Today's date - we'll only process dates from today onwards
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // One year from today - we'll only process dates up to this point
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(today.getFullYear() + 1);
  
  // First, identify explicitly available and unavailable dates from the events
  for (const event of events) {
    // Skip events in the past
    if (event.end < today) {
      continue;
    }
    
    // Determine event type based on summary
    const eventType = getEventType(event);
    
    // Create date range for this event
    const current = new Date(event.start);
    
    // For bookings/unavailable periods
    if (eventType === 'unavailable' || eventType === 'booked') {
      // Add to booking periods
      bookingPeriods.push({
        start: formatDate(event.start),
        end: formatDate(event.end),
        type: eventType
      });
      
      // Mark all dates in this period as unavailable (except checkout day)
      while (current < event.end) {
        unavailableDates.add(formatDate(current));
        current.setDate(current.getDate() + 1);
      }
    }
    // For available periods
    else if (eventType === 'available') {
      // Mark all dates in this period as available
      while (current < event.end) {
        availableDates.add(formatDate(current));
        current.setDate(current.getDate() + 1);
      }
    }
  }
  
  // Check for dates not explicitly mentioned in the calendar
  // In Airbnb, these are implicitly unavailable
  const allDates = getAllDatesInRange(today, oneYearFromNow);
  
  for (const date of allDates) {
    // If a date is not explicitly marked as available or unavailable, mark it as unavailable
    if (!availableDates.has(date) && !unavailableDates.has(date)) {
      unavailableDates.add(date);
    }
  }
  
  console.log(`[SERVER] Processed dates: ${Array.from(availableDates).length} available dates and ${Array.from(unavailableDates).length} unavailable dates`);
  
  // Remove booked dates from the available dates
  // First, extract all the dates from the booking periods
  const bookedDatesSet = new Set();
  
  for (const period of bookingPeriods) {
    const start = new Date(period.start);
    const end = new Date(period.end);
    const current = new Date(start);
    
    // Add all dates in the booking period to the set
    while (current < end) {
      bookedDatesSet.add(formatDate(current));
      current.setDate(current.getDate() + 1);
    }
  }
  
  console.log(`[SERVER] Found ${bookedDatesSet.size} dates in booking periods`);
  
  // Remove booked dates from the available dates
  const finalAvailableDates = Array.from(unavailableDates).filter(date => !bookedDatesSet.has(date));
  
  console.log(`[SERVER] Final available dates: ${finalAvailableDates.length}`);
  
  // Convert sets to arrays for the response
  return {
    availableDates: Array.from(availableDates).sort(),
    unavailableDates: finalAvailableDates.sort(),
    bookingPeriods: bookingPeriods.sort((a, b) => a.start.localeCompare(b.start))
  };
}

/**
 * Get the event type based on summary, uid, and description
 */
function getEventType(event) {
  const summary = (event.summary || '').toLowerCase();
  const uid = (event.uid || '').toLowerCase();
  const description = (event.description || '').toLowerCase();
  
  // Check if this is an "available" event
  if (
    summary.includes('available') || 
    uid.includes('available') || 
    description.includes('available')
  ) {
    return 'available';
  }
  
  // Check if this is a booking
  if (
    summary.includes('reservation') || 
    summary.includes('booking') || 
    summary.includes('booked') ||
    uid.includes('reservation') || 
    description.includes('reservation')
  ) {
    return 'booked';
  }
  
  // Check if this is an unavailable/blocked period
  if (
    summary.includes('unavailable') || 
    summary.includes('not available') || 
    summary.includes('blocked') ||
    uid.includes('unavailable') || 
    uid.includes('blocked')
  ) {
    return 'unavailable';
  }
  
  // Default to unavailable for unknown events
  return 'unavailable';
}

/**
 * Format a date as YYYY-MM-DD
 */
function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Get all dates in a range as YYYY-MM-DD strings
 */
function getAllDatesInRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  
  while (current < endDate) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
} 
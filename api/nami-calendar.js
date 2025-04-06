// api/nami-calendar.js - Dedicated Nami iCal parser for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get the hotelId from the query parameters
  const { hotelId } = req.query;

  console.log('[SERVER] Processing Nami calendar for hotelId:', hotelId);

  if (!hotelId) {
    console.log('[SERVER] Missing hotelId parameter');
    return res.status(400).json({ 
      error: 'Missing hotelId parameter',
      success: false
    });
  }

  try {
    // Construct the Nami iCal URL
    const icalUrl = `https://api-nami.lucify.in/api/v1/hotel/nami-calendar/${hotelId}.ics`;
    
    // Fetch the iCal data from Nami API
    console.log('[SERVER] Fetching iCal data from Nami API:', icalUrl);
    const response = await fetch(icalUrl);
    
    if (!response.ok) {
      console.log('[SERVER] Failed to fetch from Nami API:', response.status, response.statusText);
      throw new Error(`Failed to fetch iCal data: ${response.status} ${response.statusText}`);
    }
    
    // Extract the raw iCal text
    const icalData = await response.text();
    console.log('[SERVER] Received iCal data from Nami API, length:', icalData.length);
    
    // Parse the calendar data
    const calendar = parseNamiCalendar(icalData);
    
    // Return the processed calendar data
    return res.status(200).json({ 
      success: true,
      calendar,
      message: 'Successfully processed Nami calendar'
    });
  } catch (error) {
    console.error('[SERVER] Error processing Nami calendar:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process Nami calendar',
      success: false
    });
  }
}

/**
 * Parse Nami iCal data with precision
 * Returns object with available/unavailable dates and booking periods
 */
function parseNamiCalendar(icalData) {
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
  
  console.log('[SERVER] Parsing Nami calendar data...');
  
  // Extract all events from the calendar
  const events = extractEvents(icalData);
  console.log(`[SERVER] Found ${events.length} events in the calendar`);
  
  // Process the dates from each event
  const results = processDates(events);
  
  return {
    success: true,
    availableDates: results.availableDates,
    unavailableDates: results.unavailableDates,
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
    
    // Determine event type - in Nami calendar, assume events represent unavailable dates
    // The summary might contain information about the event type
    const eventType = 'unavailable';
    
    // Create date range for this event
    const current = new Date(event.start);
    
    // For unavailable periods (all events in Nami calendar are considered booking blocks)
    // Mark all dates in this period as unavailable (except checkout day)
    while (current < event.end) {
      unavailableDates.add(formatDate(current));
      current.setDate(current.getDate() + 1);
    }
    
    // Add to booking periods
    bookingPeriods.push({
      start: formatDate(event.start),
      end: formatDate(event.end),
      type: eventType
    });
  }
  
  // All dates that are not in unavailableDates are considered available
  const allDates = getAllDatesInRange(today, oneYearFromNow);
  
  for (const date of allDates) {
    if (!unavailableDates.has(date)) {
      availableDates.add(date);
    }
  }
  
  return {
    availableDates: Array.from(availableDates),
    unavailableDates: Array.from(unavailableDates),
    bookingPeriods
  };
}

/**
 * Format a Date object to YYYY-MM-DD string
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get all dates in a range (inclusive start, exclusive end)
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
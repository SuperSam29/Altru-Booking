// api/fetch-ical.js - Server-side API route for Vercel
export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get the iCal URL from the query parameters
  const { url } = req.query;

  console.log('[SERVER] API route called with URL:', url);

  if (!url) {
    console.log('[SERVER] Missing URL parameter');
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    console.log('[SERVER] Attempting to fetch iCal data from:', url);
    // Fetch the iCal data from the provided URL
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log('[SERVER] Failed to fetch iCal data:', response.status, response.statusText);
      throw new Error(`Failed to fetch iCal data: ${response.status} ${response.statusText}`);
    }
    
    // Parse the iCal data to extract blocked dates
    const icalData = await response.text();
    console.log('[SERVER] iCal data fetched successfully, length:', icalData.length);
    
    // Log the entire iCal data for debugging
    console.log('[SERVER] FULL iCal data:');
    console.log(icalData);
    
    // Extract dates from the iCal data
    const blockedDates = parseIcalData(icalData);
    console.log('[SERVER] Parsed blocked dates:', blockedDates.length, blockedDates);
    
    // Return the blocked dates as JSON
    return res.status(200).json({ 
      blockedDates,
      message: 'Successfully fetched and parsed iCal data',
      source: 'Vercel API route'
    });
  } catch (error) {
    console.error('[SERVER] Error fetching iCal data:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to fetch iCal data',
      source: 'Vercel API route'
    });
  }
}

/**
 * Parse iCal data the Airbnb way - following Airbnb's exact rules
 * 
 * Airbnb's calendar follows these rules:
 * 1. "Available" events mean the property is available for booking
 * 2. "Reserved" or "Not available" events mean the property is booked or blocked
 * 3. For bookings, the checkout date is available for new check-ins
 */
function parseIcalData(icalData) {
  // First, check if we received valid iCal data
  if (!icalData.includes('BEGIN:VCALENDAR') || !icalData.includes('END:VCALENDAR')) {
    console.log('[SERVER] Invalid iCal data format, missing VCALENDAR tags');
    return [];
  }
  
  // Log a full event from the data to understand its format
  const firstEvent = icalData.split('BEGIN:VEVENT')[1]?.split('END:VEVENT')[0];
  console.log('[SERVER] First event in iCal:', firstEvent);

  // Split the iCal data into separate events (VEVENT blocks)
  const events = icalData.split('BEGIN:VEVENT').slice(1);
  console.log('[SERVER] Total events found:', events.length);
  
  // Log the first few events for debugging
  events.slice(0, 5).forEach((event, i) => {
    console.log(`[SERVER] Event ${i}:`, event);
  });

  // Direct approach: track all dates as either available or unavailable
  const dateStatus = new Map(); // Maps YYYY-MM-DD -> 'available' or 'unavailable'
  
  // Get current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Set date range (today to one year from now)
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(today.getFullYear() + 1);
  
  // Process each event to identify dates' status
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    
    // Extract summary/status for this event
    const summaryMatch = event.match(/SUMMARY:([^\r\n]+)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : 'No summary';
    
    // Look for different date formats in Airbnb feeds
    const startMatch = event.match(/DTSTART(?:;[^:]*)?:(\d{8}(?:T\d{6}Z?)?)/);
    const endMatch = event.match(/DTEND(?:;[^:]*)?:(\d{8}(?:T\d{6}Z?)?)/);
    
    if (!startMatch || !endMatch) {
      console.log(`[SERVER] Event ${i}: Missing date range, skipping.`);
      continue;
    }
    
    const startDateStr = startMatch[1];
    const endDateStr = endMatch[1];
    
    console.log(`[SERVER] Event ${i}: "${summary}" from ${startDateStr} to ${endDateStr}`);
    
    // Parse dates handling various formats
    let startDate, endDate;
    
    // Handle both YYYYMMDD and YYYYMMDDTHHMMSSZ formats
    if (startDateStr.includes('T')) {
      // ISO format with time
      startDate = parseISOTimeString(startDateStr);
    } else {
      // Simple YYYYMMDD format
      startDate = new Date(
        parseInt(startDateStr.substring(0, 4), 10),
        parseInt(startDateStr.substring(4, 6), 10) - 1, // JS months are 0-based
        parseInt(startDateStr.substring(6, 8), 10)
      );
    }
    
    if (endDateStr.includes('T')) {
      // ISO format with time
      endDate = parseISOTimeString(endDateStr);
    } else {
      // Simple YYYYMMDD format
      endDate = new Date(
        parseInt(endDateStr.substring(0, 4), 10),
        parseInt(endDateStr.substring(4, 6), 10) - 1, // JS months are 0-based
        parseInt(endDateStr.substring(6, 8), 10)
      );
    }
    
    // Skip past events
    if (endDate < today) {
      console.log(`[SERVER] Event ${i}: In the past, skipping`);
      continue;
    }
    
    // Determine the status of this event (available or unavailable)
    // Airbnb uses specific keywords in event summaries
    const isAvailable = 
      summary === 'Available' || 
      summary.toLowerCase().includes('available');
    
    const isUnavailable = 
      summary === 'UNAVAILABLE' || 
      summary === 'Unavailable' || 
      summary === 'Not available' || 
      summary === 'Blocked' || 
      summary.toLowerCase().includes('unavailable') ||
      summary.toLowerCase().includes('not available') || 
      summary.toLowerCase().includes('blocked');
    
    const isReserved = 
      summary.toLowerCase().includes('reservation') ||
      summary.toLowerCase().includes('booked') ||
      summary.toLowerCase().includes('booking') ||
      summary.toLowerCase().includes('reserved');
    
    console.log(`[SERVER] Event ${i} classification - Available: ${isAvailable}, Unavailable: ${isUnavailable}, Reserved: ${isReserved}`);
    
    // If status is still unclear, check other event fields for clues
    if (!isAvailable && !isUnavailable && !isReserved) {
      // Check UID field (sometimes contains clues)
      const uidMatch = event.match(/UID:([^\r\n]+)/);
      if (uidMatch) {
        const uid = uidMatch[1];
        console.log(`[SERVER] Checking UID: ${uid}`);
        
        if (uid.includes('_AVAILABLE') || uid.includes('_AVAIL_') || uid.includes('-available')) {
          console.log(`[SERVER] UID suggests availability`);
          isAvailable = true;
        }
      }
      
      // Check description field
      const descMatch = event.match(/DESCRIPTION:([^\r\n]+)/);
      if (descMatch) {
        const desc = descMatch[1].toLowerCase();
        console.log(`[SERVER] Description: ${desc}`);
        
        if (desc.includes('available')) {
          console.log(`[SERVER] Description suggests availability`);
          isAvailable = true;
        }
      }
      
      // If still unclear, default to treating as unavailable
      if (!isAvailable && !isUnavailable && !isReserved) {
        console.log(`[SERVER] Treating unclear event as unavailable by default`);
        isUnavailable = true;
      }
    }
    
    // Process all dates in this event range
    const currentDate = new Date(startDate);
    
    // Important: For bookings in Airbnb, the checkout date is actually available
    // for new bookings to start on that day
    while (currentDate < endDate) {
      const dateStr = formatDate(currentDate);
      
      // Apply Airbnb's rules:
      // - Available events mark dates as available
      // - Unavailable or reserved events mark dates as unavailable
      if (isAvailable) {
        dateStatus.set(dateStr, 'available');
        console.log(`[SERVER] Marked ${dateStr} as AVAILABLE`);
      } else if (isUnavailable || isReserved) {
        dateStatus.set(dateStr, 'unavailable');
        console.log(`[SERVER] Marked ${dateStr} as UNAVAILABLE`);
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Special handling for checkout date in reservations
    // In Airbnb, the checkout date is available for new check-ins
    if (isReserved) {
      const checkoutDateStr = formatDate(endDate);
      console.log(`[SERVER] Checkout date ${checkoutDateStr} is available for new reservations`);
      dateStatus.set(checkoutDateStr, 'available');
    }
  }
  
  // Log all dates and their status
  console.log('[SERVER] Date status map size:', dateStatus.size);
  
  // For debugging, log the first 10 entries
  let counter = 0;
  for (const [date, status] of dateStatus.entries()) {
    if (counter < 10) {
      console.log(`[SERVER] Date ${date}: ${status}`);
      counter++;
    } else {
      break;
    }
  }
  
  // Specifically log all April 2025 dates for debugging
  let april2025dates = [];
  for (const [date, status] of dateStatus.entries()) {
    if (date.startsWith('2025-04')) {
      april2025dates.push({ date, status });
      console.log(`[SERVER] April 2025 - ${date}: ${status}`);
    }
  }
  console.log(`[SERVER] April 2025 dates found: ${april2025dates.length}`);
  
  // Build blocked date ranges from the dateStatus map
  // We only need to return the unavailable/blocked dates
  const blockedDates = [];
  let blockStart = null;
  let prevDate = null;
  
  // Process all dates in chronological order
  const allDates = Array.from(dateStatus.keys()).sort();
  console.log(`[SERVER] Sorted all dates: ${allDates.length} entries`);
  
  for (let i = 0; i < allDates.length; i++) {
    const currentDate = allDates[i];
    const status = dateStatus.get(currentDate);
    
    // For debugging
    if (currentDate.startsWith('2025-04')) {
      console.log(`[SERVER] Processing April 2025 date ${currentDate}: ${status}`);
    }
    
    // Start a new blocked range when we find an unavailable date
    if (status === 'unavailable' && (blockStart === null)) {
      blockStart = currentDate;
      console.log(`[SERVER] Started blocked range at ${blockStart}`);
    } 
    // End the current blocked range when we find an available date
    else if (status === 'available' && blockStart !== null) {
      blockedDates.push({
        start: blockStart,
        end: currentDate,
        type: 'blocked'
      });
      console.log(`[SERVER] Ended blocked range: ${blockStart} to ${currentDate}`);
      blockStart = null;
    }
    
    prevDate = currentDate;
  }
  
  // If we ended with an active block, close it with the next date
  if (blockStart !== null) {
    const nextDay = new Date(prevDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    blockedDates.push({
      start: blockStart,
      end: formatDate(nextDay),
      type: 'blocked'
    });
    console.log(`[SERVER] Ended final blocked range: ${blockStart} to ${formatDate(nextDay)}`);
  }
  
  // Fill in blocked dates for any dates not explicitly mentioned in the feed
  // This ensures we block dates that aren't specifically marked as available
  
  // Create a set of all dates in our desired range
  const allPossibleDates = new Set();
  const currentDate = new Date(today);
  while (currentDate <= oneYearFromNow) {
    allPossibleDates.add(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Remove all dates that we already have a status for
  for (const date of dateStatus.keys()) {
    allPossibleDates.delete(date);
  }
  
  // Any remaining dates should be blocked by default
  // (i.e., dates not explicitly mentioned in the feed)
  const remainingDates = Array.from(allPossibleDates).sort();
  
  if (remainingDates.length > 0) {
    console.log(`[SERVER] ${remainingDates.length} dates not mentioned in feed - blocking by default`);
    
    let currentBlockStart = remainingDates[0];
    let prevRemaining = new Date(remainingDates[0]);
    
    for (let i = 1; i < remainingDates.length; i++) {
      const currentRemaining = new Date(remainingDates[i]);
      const prevPlusOneDay = new Date(prevRemaining);
      prevPlusOneDay.setDate(prevPlusOneDay.getDate() + 1);
      
      // If there's a gap, end the current block and start a new one
      if (currentRemaining.getTime() !== prevPlusOneDay.getTime()) {
        blockedDates.push({
          start: currentBlockStart,
          end: formatDate(prevPlusOneDay),
          type: 'blocked'
        });
        console.log(`[SERVER] Added block for unmentioned dates: ${currentBlockStart} to ${formatDate(prevPlusOneDay)}`);
        currentBlockStart = remainingDates[i];
      }
      
      prevRemaining = currentRemaining;
    }
    
    // Add the final block
    const finalEnd = new Date(prevRemaining);
    finalEnd.setDate(finalEnd.getDate() + 1);
    
    blockedDates.push({
      start: currentBlockStart,
      end: formatDate(finalEnd),
      type: 'blocked'
    });
    console.log(`[SERVER] Added final block for unmentioned dates: ${currentBlockStart} to ${formatDate(finalEnd)}`);
  }
  
  // Special debug logging for April 2025 blocked ranges
  console.log('[SERVER] April 2025 blocked ranges:');
  const april2025ranges = blockedDates.filter(range => {
    const rangeStart = new Date(range.start);
    const rangeEnd = new Date(range.end);
    const april2025start = new Date('2025-04-01');
    const april2025end = new Date('2025-05-01');
    
    return (rangeStart < april2025end && rangeEnd > april2025start);
  });
  
  april2025ranges.forEach((range, i) => {
    console.log(`[SERVER] April 2025 range ${i}: ${range.start} to ${range.end}`);
  });
  
  return blockedDates;
}

/**
 * Parse an ISO-style time string in YYYYMMDDTHHMMSSZ format
 */
function parseISOTimeString(timeString) {
  // Extract date and time parts
  const year = parseInt(timeString.substring(0, 4), 10);
  const month = parseInt(timeString.substring(4, 6), 10) - 1; // JS months are 0-based
  const day = parseInt(timeString.substring(6, 8), 10);
  
  // Check if there's a time component
  if (timeString.length > 8) {
    const hour = parseInt(timeString.substring(9, 11), 10);
    const minute = parseInt(timeString.substring(11, 13), 10);
    const second = parseInt(timeString.substring(13, 15), 10);
    return new Date(year, month, day, hour, minute, second);
  } else {
    return new Date(year, month, day);
  }
}

/**
 * Format a date object to YYYY-MM-DD format
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
} 
// Generate some blocked dates for the next 3 months
const generateBlockedDates = () => {
  const blockedDates: Date[] = [];
  const today = new Date();

  // Block some random dates in the current month and next two months
  for (let month = 0; month < 3; month++) {
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + month + 1,
      0,
    ).getDate();

    // Block 5-10 random days per month
    const numberOfBlockedDays = 5 + Math.floor(Math.random() * 6);

    // Create a set of already blocked days to avoid duplicates
    const blockedDaysSet = new Set<number>();

    while (blockedDaysSet.size < numberOfBlockedDays) {
      // Start from day 5 to avoid blocking dates too close to today
      const day = 5 + Math.floor(Math.random() * (daysInMonth - 5));
      blockedDaysSet.add(day);
    }

    // Convert the set to actual Date objects
    blockedDaysSet.forEach((day) => {
      blockedDates.push(
        new Date(today.getFullYear(), today.getMonth() + month, day),
      );
    });

    // Block some consecutive dates to simulate longer bookings
    if (month > 0) {
      const startDay = 10 + Math.floor(Math.random() * 10);
      for (let i = 0; i < 3; i++) {
        blockedDates.push(
          new Date(today.getFullYear(), today.getMonth() + month, startDay + i),
        );
      }
    }
  }

  return blockedDates;
};

export const BLOCKED_DATES = generateBlockedDates();

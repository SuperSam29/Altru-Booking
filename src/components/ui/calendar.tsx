"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, X, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Days of week abbreviations
const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export type CalendarProps = {
  className?: string;
  selected?: Date | DateRange;
  onSelect?: (date: Date | DateRange | undefined) => void;
  mode?: "single" | "range" | "multiple";
  defaultMonth?: Date;
  onDayClick?: (day: Date) => void;
  fromDate?: Date;
  toDate?: Date;
  blockedDates?: Date[];
  onApply?: () => void;
  onClose?: () => void;
  showKeyboard?: boolean;
}

function Calendar({
  className,
  selected,
  onSelect,
  mode = "single",
  defaultMonth = new Date(),
  onDayClick,
  blockedDates = [],
  onApply,
  onClose,
  showKeyboard = false,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(defaultMonth);
  const [error, setError] = React.useState<string | null>(null);
  
  // Type guards
  const isDateRange = (value: any): value is DateRange => {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && ('from' in value || 'to' in value);
  };
  
  // Function to check if a date is blocked (unavailable)
  function isDateBlocked(date: Date, blockedDates?: Date[]) {
    // In our updated approach:
    // - blockedDates contains ALL dates that should be blocked (not in availableDates)
    // - we just need to check if the date exists in blockedDates
    // - dates before today are also blocked
    
    // Block dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return true;
    }
    
    if (!blockedDates || blockedDates.length === 0) {
      // If no blocked dates provided, assume date is available (except past dates)
      return false;
    }
    
    // Normalize the date to noon for consistent comparison
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, 0, 0
    );
    
    // Check if this date exists in our blocked dates array
    return blockedDates.some(blockedDate => {
      const normalizedBlockedDate = new Date(
        blockedDate.getFullYear(),
        blockedDate.getMonth(),
        blockedDate.getDate(),
        12, 0, 0
      );
      
      return normalizedDate.getTime() === normalizedBlockedDate.getTime();
    });
  }
  
  // Generate days for a given month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay();
    
    const daysInMonth = lastDay.getDate();
    
    // Create array for days
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Check if a date is selected (for range selection)
  const isDateSelected = (date: Date) => {
    if (!selected) return false;
    
    if (mode === "single" && selected instanceof Date) {
      return isSameDay(selected, date);
    }
    
    if (mode === "range" && isDateRange(selected)) {
      return (selected.from && isSameDay(selected.from, date)) || 
             (selected.to && isSameDay(selected.to, date));
    }
    
    return false;
  };
  
  // Check if a date is in range (between start and end dates)
  const isDateInRange = (date: Date) => {
    if (mode !== "range" || !selected || selected instanceof Date) return false;
    
    if (isDateRange(selected)) {
      const { from, to } = selected;
      if (!from || !to) return false;
      
      return date > from && date < to;
    }
    
    return false;
  };

  // Check if date is the start of range
  const isRangeStart = (date: Date) => {
    if (mode !== "range" || !selected || selected instanceof Date) return false;
    
    if (isDateRange(selected) && selected.from) {
      return isSameDay(date, selected.from);
    }
    
    return false;
  };
  
  // Check if date is the end of range
  const isRangeEnd = (date: Date) => {
    if (mode !== "range" || !selected || selected instanceof Date) return false;
    
    if (isDateRange(selected) && selected.to) {
      return isSameDay(date, selected.to);
    }
    
    return false;
  };
  
  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };
  
  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  };
  
  // Check if there are blocked dates between two dates
  const hasBlockedDatesBetween = (start: Date, end: Date): boolean => {
    return blockedDates.some(date => 
      date > start && date < end
    );
  };
  
  // Handle day click
  const handleDayClick = (day: Date) => {
    if (isDateBlocked(day, blockedDates)) {
      setError("This date is blocked and cannot be selected");
      return;
    }
    
    setError(null);
    
    if (onDayClick) {
      onDayClick(day);
    } else if (onSelect) {
      if (mode === "single") {
        onSelect(day);
      } else if (mode === "range") {
        if (!selected || selected instanceof Date) {
          onSelect({ from: day, to: undefined });
        } else if (isDateRange(selected)) {
          const { from } = selected;
          if (!from) {
            onSelect({ from: day, to: undefined });
          } else {
            // Determine the correct from/to dates based on which is earlier
            const rangeStart = day < from ? day : from;
            const rangeEnd = day < from ? from : day;
            
            // Check if there are blocked dates between the range
            if (hasBlockedDatesBetween(rangeStart, rangeEnd)) {
              // If blocked dates exist in range, don't allow selection
              // Just update with the new date as "from" and clear "to"
              setError("Cannot select a range with blocked dates between");
              onSelect({ from: day, to: undefined });
            } else {
              onSelect({ from: rangeStart, to: rangeEnd });
            }
          }
        }
      }
    }
  };
  
  const renderDaysOfWeek = () => {
    return DAYS_OF_WEEK.map((day) => (
      <div
        key={day}
        className="h-9 flex items-center justify-center text-sm font-medium text-gray-500"
      >
        {day}
      </div>
    ));
  };
  
  // Render each calendar day
  const renderDay = (day: Date | null, index: number) => {
    if (!day) {
      return <div key={`empty-${index}`} className="h-10 w-10"></div>;
    }
    
    const isBlocked = isDateBlocked(day, blockedDates);
    const isSelected = isDateSelected(day);
    const isInRange = isDateInRange(day);
    const startDate = isRangeStart(day);
    const endDate = isRangeEnd(day);
    
    const isToday = isSameDay(day, new Date());
    
    return (
      <div 
        key={day.toISOString()} 
        className={cn(
          "h-10 w-10 p-0 relative",
          isInRange && "bg-gray-100",
          startDate && "rounded-l-full",
          endDate && "rounded-r-full"
        )}
      >
        <button
          type="button"
          onClick={() => handleDayClick(day)}
          disabled={isBlocked}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors hover:bg-gray-200",
            isBlocked 
              ? "text-gray-300 cursor-not-allowed bg-red-50" 
              : startDate || endDate
                ? "bg-black text-white hover:bg-gray-800" 
                : isInRange 
                  ? "hover:bg-gray-300" 
                  : "hover:bg-gray-200",
            isToday && !isSelected && "border border-gray-300",
            isSelected && !startDate && !endDate && "bg-gray-200 font-bold"
          )}
        >
          {day.getDate()}
        </button>
      </div>
    );
  };
  
  // Render the calendar grid for a specific month
  const renderCalendarGrid = (monthOffset: number) => {
    const monthDate = new Date(currentMonth);
    monthDate.setMonth(currentMonth.getMonth() + monthOffset);
    const days = getDaysInMonth(monthDate);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {renderDaysOfWeek()}
        {days.map((day, index) => renderDay(day, index))}
      </div>
    );
  };
  
  const handleClearDates = () => {
    setError(null);
    if (onSelect) {
      if (mode === "single") {
        onSelect(undefined);
      } else if (mode === "range") {
        onSelect({ from: undefined, to: undefined });
      }
    }
  };
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  
  const handleApply = () => {
    if (onApply) {
      onApply();
    }
  };
  
  // Add debugging for the blockedDates prop to ensure it's being passed correctly
  // Inside the Calendar component, right after destructuring props
  // Log blocked dates when in range mode to help with debugging
  React.useEffect(() => {
    if (mode === "range" && blockedDates && blockedDates.length > 0) {
      console.log(`Calendar received ${blockedDates.length} blocked dates`);
      
      // Log a few samples of April 2025 dates if they exist
      const april2025Dates = blockedDates.filter(
        date => date.getFullYear() === 2025 && date.getMonth() === 3
      );
      
      if (april2025Dates.length > 0) {
        console.log(`Found ${april2025Dates.length} blocked dates in April 2025:`);
        april2025Dates.slice(0, 5).forEach(date => {
          console.log(`- ${date.toISOString().split('T')[0]}`);
        });
        if (april2025Dates.length > 5) {
          console.log(`... and ${april2025Dates.length - 5} more`);
        }
      }
    }
  }, [mode, blockedDates]);

  // Render the month header and grid
  const renderMonth = (monthOffset: number) => {
    const monthDate = new Date(currentMonth);
    monthDate.setMonth(currentMonth.getMonth() + monthOffset);
    const monthName = getMonthName(monthDate);
    const year = monthDate.getFullYear();
    
    return (
      <div className="space-y-4">
        <div className="text-center font-medium text-base">
          {monthName} {year}
        </div>
        {renderCalendarGrid(monthOffset)}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "p-3 bg-white w-full flex flex-col",
        className
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-9 w-9 p-0 rounded-full"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-9 w-9 p-0 rounded-full"
            )}
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <button
          type="button"
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-9 w-9 p-0 rounded-full"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-10">
        {renderMonth(0)}
        {renderMonth(1)}
      </div>
      
      {/* Display error message */}
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      {/* Additional buttons */}
      {(onApply || onClose) && (
        <div className="flex justify-end mt-4 gap-3">
          {onApply && (
            <button
              type="button"
              onClick={onApply}
              className={cn(
                "px-4 py-2 bg-black text-white rounded-md text-sm font-medium"
              )}
            >
              Apply
            </button>
          )}
        </div>
      )}
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar }

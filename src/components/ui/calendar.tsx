"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, X, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type DateRange = {
  from?: Date;
  to?: Date;
}

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
  
  // Check if date is blocked
  const isDateBlocked = (date: Date): boolean => {
    return blockedDates.some(blockedDate => isSameDay(date, blockedDate));
  };
  
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
    if (isDateBlocked(day)) {
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
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return daysOfWeek.map((day, index) => (
      <div key={index} className="text-center text-[10px] text-muted-foreground font-medium">
        {day}
      </div>
    ));
  };
  
  const renderMonth = (monthOffset: number) => {
    const monthDate = new Date(currentMonth);
    monthDate.setMonth(currentMonth.getMonth() + monthOffset);
    const monthName = getMonthName(monthDate);
    const year = monthDate.getFullYear();
    const days = getDaysInMonth(monthDate);
    
    return (
      <div className="space-y-1">
        <div className="text-center font-medium text-xs">
          {monthName} {year}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {renderDaysOfWeek()}
          
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="p-0.5"></div>;
            }
            
            const isToday = isSameDay(day, new Date());
            const isSelected = isDateSelected(day);
            const isInRange = isDateInRange(day);
            const isBlocked = isDateBlocked(day);
            
            // Check if the date is the start or end of a range
            const isSelectionStart = mode === "range" && 
              isDateRange(selected) && 
              selected.from && 
              isSameDay(day, selected.from);
              
            const isSelectionEnd = mode === "range" && 
              isDateRange(selected) && 
              selected.to && 
              isSameDay(day, selected.to);
            
            // Style for days that aren't in current month
            const isPastMonth = monthOffset === 0 && day.getDate() > 20 && index < 10;
            const isNextMonth = monthOffset === 0 && day.getDate() < 10 && index > 20;
            const isOutsideCurrentMonth = isPastMonth || isNextMonth;
            
            return (
              <button
                key={day.toString()}
                type="button"
                disabled={isBlocked}
                className={cn(
                  "h-6 w-6 p-0 font-normal rounded-full flex items-center justify-center text-xs",
                  isOutsideCurrentMonth && "text-gray-300",
                  isToday && !isSelected && "border border-black",
                  isSelected && "bg-black text-white font-medium",
                  isInRange && "bg-gray-100",
                  isBlocked && "line-through text-gray-300 cursor-not-allowed",
                  !isSelected && !isInRange && !isBlocked && "hover:bg-gray-100"
                )}
                onClick={() => handleDayClick(day)}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
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
  
  return (
    <div className={cn("p-3 select-none bg-white shadow-lg rounded-lg max-w-[700px]", className)}>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          className={buttonVariants({ variant: "outline", size: "icon", className: "h-7 w-7 p-0 rounded-full border-none hover:bg-gray-100" })}
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        {/* Always render exactly 2 months side by side (April and May) to match the design */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {renderMonth(0)}
          {renderMonth(1)}
        </div>
        <button
          type="button"
          className={buttonVariants({ variant: "outline", size: "icon", className: "h-7 w-7 p-0 rounded-full border-none hover:bg-gray-100" })}
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      
      <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4">
        <div className="flex items-center">
          <Circle className="h-2 w-2 fill-red-400 text-red-400 mr-1" />
          <span>Blocked dates</span>
        </div>
        
        {error && (
          <div className="text-red-500 font-medium mt-1">{error}</div>
        )}
      </div>
      
      <div className="flex justify-between mt-3">
        {showKeyboard ? (
          <button
            type="button"
            className={buttonVariants({ variant: "outline", size: "icon", className: "h-8 w-8 p-1 rounded border-gray-300" })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <path d="M6 8h.001"></path>
              <path d="M10 8h.001"></path>
              <path d="M14 8h.001"></path>
              <path d="M18 8h.001"></path>
              <path d="M6 12h.001"></path>
              <path d="M10 12h.001"></path>
              <path d="M14 12h.001"></path>
              <path d="M18 12h.001"></path>
              <path d="M6 16h12"></path>
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className={buttonVariants({ variant: "outline", className: "text-xs h-8 py-0 px-3 border-gray-300" })}
            onClick={handleClearDates}
          >
            Clear dates
          </button>
        )}
        
        <div className="flex space-x-2">
          {showKeyboard ? (
            <button
              type="button"
              className={buttonVariants({ variant: "outline", className: "text-xs h-8 py-0 px-3 border-gray-300" })}
              onClick={handleClearDates}
            >
              Clear dates
            </button>
          ) : null}
          <button
            type="button"
            className={buttonVariants({ variant: showKeyboard ? "default" : "outline", className: "text-xs h-8 py-0 px-3 border-gray-300" })}
            onClick={handleClose}
          >
            Close
          </button>
          
          {!showKeyboard && (
            <button
              type="button"
              className={buttonVariants({ className: "text-xs h-8 py-0 px-3 bg-black hover:bg-black/90" })}
              onClick={handleApply}
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar }

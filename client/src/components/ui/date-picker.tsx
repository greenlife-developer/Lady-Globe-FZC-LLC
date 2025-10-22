
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  date?: Date | undefined;
  setDate?: (date: Date | undefined) => void;
  mode?: "single" | "range";
  selected?: Date | DateRange | undefined;
  onSelect?: (date: Date | DateRange | undefined) => void;
  id?: string;
  placeholder?: string;
  numberOfMonths?: number;
  defaultMonth?: Date;
}

export function DatePicker({
  date,
  setDate,
  mode = "single",
  selected,
  onSelect,
  id,
  placeholder = "Pick a date",
  numberOfMonths = 1,
  defaultMonth,
}: DatePickerProps) {
  // Determine which props to use based on mode
  const finalSelected = mode === "single" ? date : selected;
  
  // Create type-safe handlers
  const handleSingleSelect = (date: Date | undefined) => {
    if (mode === "single" && setDate) {
      setDate(date);
    }
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (mode === "range" && onSelect) {
      onSelect(range);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !finalSelected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {mode === "single" && finalSelected ? (
            format(finalSelected as Date, "PPP")
          ) : mode === "range" && finalSelected ? (
            <>
              {format((finalSelected as DateRange).from as Date, "PPP")} -{" "}
              {(finalSelected as DateRange).to
                ? format((finalSelected as DateRange).to as Date, "PPP")
                : ""}
            </>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === "single" ? (
          <Calendar
            mode="single"
            selected={finalSelected as Date}
            onSelect={handleSingleSelect}
            initialFocus
            numberOfMonths={numberOfMonths}
            defaultMonth={defaultMonth}
            className={cn("p-3 pointer-events-auto")}
          />
        ) : (
          <Calendar
            mode="range"
            selected={finalSelected as DateRange}
            onSelect={handleRangeSelect}
            initialFocus
            numberOfMonths={numberOfMonths}
            defaultMonth={defaultMonth}
            className={cn("p-3 pointer-events-auto")}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

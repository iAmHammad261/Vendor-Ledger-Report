import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import useVendorStore from "@/store/vendorLedgerStore";

const calendarClassNames = {
  caption_label: "hidden",
  caption: "flex items-center justify-center gap-1 py-2 px-1 ",
  caption_dropdowns: "flex items-center gap-1",
  dropdown:
    "appearance-none bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-800 " +
    "px-2 py-1 pr-6 cursor-pointer outline-none " +
    "hover:border-gray-400 focus:border-gray-800 focus:ring-1 focus:ring-gray-800 " +
    "transition-colors duration-150 " +
    "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")] " +
    "bg-no-repeat bg-[right_6px_center]",
  dropdown_month: "w-[108px]",
  dropdown_year: "w-[76px]",
  nav_button:
    "inline-flex items-center justify-center rounded-md border border-gray-200 bg-white " +
    "h-7 w-7 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-150",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
};

const CalendarWithFooter = ({
  selected,
  onSelect,
  disabled,
  onClear,
}: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled: (date: Date) => boolean;
  onClear: () => void;
}) => (
  <div>
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      captionLayout="dropdown"
      startMonth={new Date(2023, 0)}
      endMonth={new Date()}
      classNames={calendarClassNames}
    />
    {/* Footer inside popover */}
    <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
      <span className="text-xs text-gray-400">
        {selected ? format(selected, "dd MMM yyyy") : "No date selected"}
      </span>
      <button
        onClick={onClear}
        disabled={!selected}
        className={
          "flex items-center gap-1 text-xs font-medium rounded px-2 py-1 transition-colors duration-150 " +
          (selected
            ? "text-gray-500 hover:text-red-500 hover:bg-red-50 cursor-pointer"
            : "text-gray-300 cursor-not-allowed")
        }
      >
        <X className="h-3 w-3" />
        Clear
      </button>
    </div>
  </div>
);

export const DateRangePicker = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const setFromDateInStore = useVendorStore((s) => s.setFromDate);
  const setToDateInStore = useVendorStore((s) => s.setToDate);

  const clearFrom = () => {
    setFromDate(undefined);
    setFromDateInStore(null);
  };
  const clearTo = () => {
    setToDate(undefined);
    setToDateInStore(null);
  };

  return (
    <div className="flex items-center gap-2">
      {/* FROM */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">From</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={
                "w-40 justify-start text-left font-normal " +
                (fromDate ? "text-gray-900" : "text-gray-400")
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              {fromDate ? format(fromDate, "dd-MMM-yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 shadow-md rounded-lg overflow-hidden">
            <CalendarWithFooter
              selected={fromDate}
              onSelect={(date) => {
                setFromDate(date);
                setFromDateInStore(date ?? null);
              }}
              disabled={(date) => (toDate ? date > toDate : false)}
              onClear={clearFrom}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* TO */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">To</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={
                "w-40 justify-start text-left font-normal " +
                (toDate ? "text-gray-900" : "text-gray-400")
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              {toDate ? format(toDate, "dd-MMM-yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 shadow-md rounded-lg overflow-hidden">
            <CalendarWithFooter
              selected={toDate}
              onSelect={(date) => {
                setToDate(date);
                setToDateInStore(date ?? null);
              }}
              disabled={(date) => (fromDate ? date < fromDate : false)}
              onClear={clearTo}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

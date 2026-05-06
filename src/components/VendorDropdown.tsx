import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import useVendorList from "../hooks/useVendorList";
import useVendorStore from "../store/vendorLedgerStore";

export function VendorDropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { vendorList, loading, error } = useVendorList();
  const setSelectedVendor = useVendorStore((s) => s.setSelectedVendor);

  if (loading) return <p>Loading vendors...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-64 justify-between overflow-hidden"
        >
          <span className="truncate">
            {value
              ? vendorList.find((v) => v.id === parseInt(value))?.entityid
              : "Select vendor..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search vendor" />
          <CommandEmpty>No vendor found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {vendorList.map((vendor) => (
              <CommandItem
                key={vendor.id}
                value={vendor.entityid}
                onSelect={() => {
                  setValue(vendor.id.toString());
                  setOpen(false);
                  setSelectedVendor(vendor.id, vendor.entityid);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${value === vendor.id.toString() ? "opacity-100" : "opacity-0"}`}
                />
                {vendor.entityid}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

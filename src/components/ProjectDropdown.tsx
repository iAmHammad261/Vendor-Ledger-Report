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
import useProjectList from "../hooks/useProjectList";
import useVendorStore from "../store/vendorLedgerStore";

export function ProjectDropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  
  const { data: projectList = [], isLoading, error } = useProjectList();
  const setSelectedProject = useVendorStore((s) => s.setSelectedProject);

  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects.</p>;

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
              ? projectList.find((p) => p.projectid === parseInt(value))?.projectname  
              : "Select project..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search project" />
          <CommandEmpty>No project found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {projectList.map((project) => (
              <CommandItem
                key={project.projectid}
                value={project.projectname}
                onSelect={() => {
                  setValue(project.projectid.toString());
                  setOpen(false);
                  setSelectedProject(project.projectid, project.projectname);  
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${value === project.projectid.toString() ? "opacity-100" : "opacity-0"}`}
                />
                {project.projectname} 
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
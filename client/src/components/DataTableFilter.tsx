
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface FilterOption {
  name: string;
  type: "select" | "text" | "date" | "date-range";
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface DataTableFilterProps {
  filters: FilterOption[];
  onFilterChange: (filters: Record<string, any>) => void;
}

const DataTableFilter = ({ filters, onFilterChange }: DataTableFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (name: string, value: any) => {
    const updatedFilters = {
      ...activeFilters,
      [name]: value,
    };
    
    if (value === undefined || value === "" || value === null) {
      delete updatedFilters[name];
    }
    
    setActiveFilters(updatedFilters);
  };
  
  const applyFilters = () => {
    onFilterChange(activeFilters);
    setIsOpen(false);
  };
  
  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
    setIsOpen(false);
  };
  
  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter</span>
          {getActiveFilterCount() > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[11px] flex items-center justify-center text-primary-foreground">
              {getActiveFilterCount()}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {getActiveFilterCount() > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-muted-foreground"
                onClick={clearFilters}
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear all</span>
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.name} className="space-y-2">
                <Label htmlFor={filter.name}>{filter.name}</Label>
                
                {filter.type === 'select' && filter.options && (
                  <Select 
                    value={activeFilters[filter.name] || ""}
                    onValueChange={(value) => handleFilterChange(filter.name, value)}
                  >
                    <SelectTrigger id={filter.name}>
                      <SelectValue placeholder={filter.placeholder || `Select ${filter.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {filter.type === 'text' && (
                  <Input
                    id={filter.name}
                    placeholder={filter.placeholder || `Search ${filter.name}`}
                    value={activeFilters[filter.name] || ""}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  />
                )}
                
                {filter.type === 'date' && (
                  <DatePicker
                    id={filter.name}
                    date={activeFilters[filter.name]}
                    setDate={(date) => handleFilterChange(filter.name, date)}
                    placeholder={filter.placeholder || "Pick a date"}
                  />
                )}
                
                {/* Add support for date-range if needed */}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DataTableFilter;

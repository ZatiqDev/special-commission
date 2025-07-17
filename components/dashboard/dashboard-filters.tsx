import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DashboardFilters as Filters } from "@/types/api";

interface DashboardFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onApplyFilters: () => void;
}

export const DashboardFilters = ({
  filters,
  onFiltersChange,
  onApplyFilters,
}: DashboardFiltersProps) => {
  const [fromDate, setFromDate] = useState<Date>(new Date(filters.from));
  const [toDate, setToDate] = useState<Date>(new Date(filters.to));

  const handleFromDateChange = (date: Date | undefined) => {
    if (date) {
      setFromDate(date);
      onFiltersChange({
        ...filters,
        from: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handleToDateChange = (date: Date | undefined) => {
    if (date) {
      setToDate(date);
      onFiltersChange({
        ...filters,
        to: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handlePromoIdChange = (value: string) => {
    onFiltersChange({
      ...filters,
      promo_id: value || undefined,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-medium">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div className="space-y-2">
          <Label htmlFor="promo_id">Promo ID</Label>
          <Input
            id="promo_id"
            placeholder="Enter promo ID"
            value={filters.promo_id || ""}
            onChange={(e) => handlePromoIdChange(e.target.value)}
          />
        </div> */}

        <div className="space-y-2">
          <Label>From Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={handleFromDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>To Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={handleToDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={onApplyFilters} className="w-full md:w-auto">
        Apply Filters
      </Button>
    </div>
  );
};
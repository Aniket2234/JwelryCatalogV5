import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterOptions {
  purity: string[];
  weight: string[];
  stone: string[];
  gender: string[];
  occasion: string[];
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  priceRange,
  onPriceRangeChange,
  filters,
  onFiltersChange,
}: FilterDrawerProps) {
  const handlePriceChange = (value: number[]) => {
    onPriceRangeChange([value[0], value[1]]);
  };

  const handleCheckboxChange = (filterType: keyof FilterOptions, value: string, checked: boolean) => {
    const updatedFilters = { ...filters };
    if (checked) {
      if (!updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
    } else {
      updatedFilters[filterType] = updatedFilters[filterType].filter((v) => v !== value);
    }
    onFiltersChange(updatedFilters);
  };

  const handleResetFilters = () => {
    onPriceRangeChange([0, 500000]);
    onFiltersChange({ purity: [], weight: [], stone: [], gender: [], occasion: [] });
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-amber-100/30">
                <h2 className="font-serif text-2xl font-bold text-foreground">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-muted rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Price Range
                    </Label>
                    <div className="mb-4 p-3 bg-secondary/50 rounded-lg border border-primary/20">
                      <p className="text-center text-lg font-semibold text-primary">
                        ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                      </p>
                    </div>
                    <Slider
                      min={0}
                      max={500000}
                      step={5000}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>₹0</span>
                      <span>MAX</span>
                    </div>
                  </div>

                  {/* Purity/Karat Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Purity / Karat</Label>
                    <div className="space-y-2">
                      {["22K", "18K", "14K", "24K"].map((purity) => (
                        <div key={purity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`purity-${purity}`}
                            checked={filters.purity.includes(purity)}
                            onCheckedChange={(checked) => handleCheckboxChange("purity", purity, checked as boolean)}
                          />
                          <label htmlFor={`purity-${purity}`} className="text-sm cursor-pointer">
                            {purity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weight Range Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Weight Range</Label>
                    <div className="space-y-2">
                      {["<5g", "5g-10g", "10g-20g", "20g+"].map((weight) => (
                        <div key={weight} className="flex items-center space-x-2">
                          <Checkbox
                            id={`weight-${weight}`}
                            checked={filters.weight.includes(weight)}
                            onCheckedChange={(checked) => handleCheckboxChange("weight", weight, checked as boolean)}
                          />
                          <label htmlFor={`weight-${weight}`} className="text-sm cursor-pointer">
                            {weight}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stone/Gem Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Stone / Gem</Label>
                    <div className="space-y-2">
                      {["Diamond", "Emerald", "Ruby", "Sapphire", "Pearl", "None"].map((stone) => (
                        <div key={stone} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stone-${stone}`}
                            checked={filters.stone.includes(stone)}
                            onCheckedChange={(checked) => handleCheckboxChange("stone", stone, checked as boolean)}
                          />
                          <label htmlFor={`stone-${stone}`} className="text-sm cursor-pointer">
                            {stone}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Gender</Label>
                    <div className="space-y-2">
                      {["Men", "Women", "Kids"].map((gender) => (
                        <div key={gender} className="flex items-center space-x-2">
                          <Checkbox
                            id={`gender-${gender}`}
                            checked={filters.gender.includes(gender)}
                            onCheckedChange={(checked) => handleCheckboxChange("gender", gender, checked as boolean)}
                          />
                          <label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                            {gender}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Occasion Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Occasion</Label>
                    <div className="space-y-2">
                      {["Daily Wear", "Bridal", "Office Wear", "Festive"].map((occasion) => (
                        <div key={occasion} className="flex items-center space-x-2">
                          <Checkbox
                            id={`occasion-${occasion}`}
                            checked={filters.occasion.includes(occasion)}
                            onCheckedChange={(checked) => handleCheckboxChange("occasion", occasion, checked as boolean)}
                          />
                          <label htmlFor={`occasion-${occasion}`} className="text-sm cursor-pointer">
                            {occasion}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-secondary/30">
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="w-full border-primary/30 hover:bg-primary/10"
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilterDialog: boolean;
  onToggleFilter: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  showFilterDialog,
  onToggleFilter,
  priceRange,
  onPriceRangeChange,
}: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Sync local query with parent when it changes externally
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const handleClearSearch = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  const handlePriceChange = (value: number[]) => {
    onPriceRangeChange([value[0], value[1]]);
  };

  const handleResetFilters = () => {
    onPriceRangeChange([0, 500000]);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN'; // Indian English

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setLocalQuery(transcript);
          onSearchChange(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          toast({
            title: "Voice search failed",
            description: "Please try again or type your search",
            variant: "destructive",
          });
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [onSearchChange, toast]);

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak now to search",
        });
      }
    } else {
      toast({
        title: "Voice search not supported",
        description: "Your browser doesn't support voice search",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <section className="bg-background sticky top-[73px] z-40 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for necklaces, rings, earrings..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 pr-28 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              data-testid="input-search"
            />
            {localQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-20 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              className={`absolute right-11 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors ${
                isListening ? "bg-red-100 text-red-600" : ""
              }`}
              aria-label="Voice search"
              data-testid="button-voice-search"
            >
              <Mic className={`h-5 w-5 ${isListening ? "animate-pulse" : "text-muted-foreground"}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFilter}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors ${
                showFilterDialog ? "bg-muted" : ""
              }`}
              aria-label="Filter options"
              data-testid="button-filter"
            >
              <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Dialog */}
      {showFilterDialog && (
        <div className="bg-background border-b border-border sticky top-[145px] z-30">
          <div className="container mx-auto px-4 py-6">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Reset All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                      {priceRange[1].toLocaleString()}
                    </Label>
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
                      <span>₹5,00,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

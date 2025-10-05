import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, ChevronDown, Mic, X, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import SideDrawer from "@/components/SideDrawer";
import FilterDrawer, { FilterOptions } from "@/components/FilterDrawer";
import { Product, Category } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type SortOption = "default" | "price-low" | "price-high" | "name-asc" | "name-desc";

export default function Products() {
  const [locationPath, setLocation] = useLocation();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [isListening, setIsListening] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    purity: [],
    weight: [],
    stone: [],
    gender: [],
    occasion: [],
  });

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [locationPath]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearchQuery]);

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory && selectedCategory !== "all"
        ? `/api/products?category=${selectedCategory}`
        : "/api/products";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  // Fetch categories for display
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsMenuOpen(false);
    setLocation(`/products?category=${category}`);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleVoiceSearch = () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && !isListening) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setLocalSearchQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          toast({
            title: "Voice search failed",
            description: "Please try again or type your search",
            variant: "destructive",
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak now to search",
        });
      }
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description || "").toLowerCase().includes(query) ||
          (product.category || "").toLowerCase().includes(query)
      );
    }

    // Apply price range filter
    if (priceRange) {
      filtered = filtered.filter(
        (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // Apply purity filter
    if (filters?.purity && filters.purity.length > 0) {
      filtered = filtered.filter(
        (product) => product.purity && filters.purity.includes(product.purity)
      );
    }

    // Apply weight filter
    if (filters?.weight && filters.weight.length > 0) {
      filtered = filtered.filter(
        (product) => product.weight && filters.weight.includes(product.weight)
      );
    }

    // Apply stone filter
    if (filters?.stone && filters.stone.length > 0) {
      filtered = filtered.filter((product) => product.stone && filters.stone.includes(product.stone));
    }

    // Apply gender filter
    if (filters?.gender && filters.gender.length > 0) {
      filtered = filtered.filter(
        (product) => product.gender && filters.gender.includes(product.gender)
      );
    }

    // Apply occasion filter
    if (filters?.occasion && filters.occasion.length > 0) {
      filtered = filtered.filter(
        (product) => product.occasion && filters.occasion.includes(product.occasion)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting by displayOrder
        filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }

    return filtered;
  }, [products, searchQuery, priceRange, filters, sortBy]);

  const handleProductClick = (productId: string) => {
    setLocation(`/product/${productId}`);
  };

  const currentCategoryName = useMemo(() => {
    if (selectedCategory === "all") return "All Products";
    const category = categories.find((cat) => cat.slug === selectedCategory);
    return category?.name || "Products";
  }, [selectedCategory, categories]);

  const sortLabel = useMemo(() => {
    switch (sortBy) {
      case "price-low":
        return "Price: Low to High";
      case "price-high":
        return "Price: High to Low";
      case "name-asc":
        return "Name: A to Z";
      case "name-desc":
        return "Name: Z to A";
      default:
        return "Sort by";
    }
  }, [sortBy]);

  return (
    <>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <SideDrawer isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} onCategorySelect={handleCategorySelect} />

      {/* Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMenu} data-testid="overlay-menu" />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
        {/* Spacer for fixed header */}
        <div className="h-[73px]" />

        {/* Back Button and Title - Mobile */}
        <div className="md:hidden sticky top-[73px] z-30 bg-background border-b border-border">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Go back"
              data-testid="button-back-mobile"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="font-serif text-xl font-semibold" data-testid="text-category-name-mobile">
              {currentCategoryName}
            </h2>
          </div>
        </div>

        {/* Back Button - Desktop */}
        <div className="hidden md:block container mx-auto px-4 pt-6 pb-2">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-muted"
            data-testid="button-back-desktop"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Search Bar */}
        <div className="sticky top-[73px] md:top-[73px] z-20 bg-background border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="relative max-w-2xl mx-auto md:max-w-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10 pr-20 h-12 rounded-lg border-border bg-background"
                data-testid="input-search"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {localSearchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLocalSearchQuery("")}
                    className="h-8 w-8"
                    data-testid="button-clear-search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceSearch}
                  className={`h-8 w-8 ${isListening ? "text-red-500" : ""}`}
                  data-testid="button-voice-search"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort Bar */}
        <div className="sticky top-[189px] md:top-[145px] z-10 bg-background border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Filters Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilterDrawer(true)}
                className="flex items-center gap-2 flex-1 md:flex-none justify-center"
                data-testid="button-filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 flex-1 md:flex-none justify-between"
                    data-testid="button-sort"
                  >
                    <span>{sortLabel}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSortBy("default")} data-testid="sort-default">
                    Default
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-low")} data-testid="sort-price-low">
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-high")} data-testid="sort-price-high">
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-asc")} data-testid="sort-name-asc">
                    Name: A to Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-desc")} data-testid="sort-name-desc">
                    Name: Z to A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop: Show category title and product count */}
            <div className="hidden md:flex items-center justify-between mt-4">
              <h2 className="font-serif text-2xl font-semibold" data-testid="text-category-name-desktop">
                {currentCategoryName}
              </h2>
              <p className="text-sm text-muted-foreground" data-testid="text-product-count">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="container mx-auto px-4 py-6">
          {/* Mobile: Product count */}
          <div className="md:hidden mb-4">
            <p className="text-sm text-muted-foreground text-center" data-testid="text-product-count-mobile">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-lg" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg" data-testid="text-no-products">
                No products found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                  data-testid={`product-card-${product._id}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/300x400?text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {product.isNewArrival && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3
                      className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors"
                      data-testid={`text-product-name-${product._id}`}
                    >
                      {product.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <p
                        className="font-semibold text-base md:text-lg text-foreground"
                        data-testid={`text-product-price-${product._id}`}
                      >
                        ₹ {product.price.toLocaleString("en-IN")}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <p className="text-xs md:text-sm text-muted-foreground line-through">
                            ₹ {product.originalPrice.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs md:text-sm text-red-600 font-medium">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            off
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </>
  );
}

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import SideDrawer from "@/components/SideDrawer";
import ImageCarousel from "@/components/ImageCarousel";
import SearchBar from "@/components/SearchBar";
import FilterDrawer, { FilterOptions } from "@/components/FilterDrawer";
import FilterBar from "@/components/FilterBar";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import HorizontalProductScroll from "@/components/HorizontalProductScroll";
import Footer from "@/components/Footer";
import { Product } from "@shared/schema";

export default function Catalog() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [filters, setFilters] = useState<FilterOptions>({
    purity: [],
    weight: [],
    stone: [],
    gender: [],
    occasion: [],
  });
  const [viewMode, setViewMode] = useState<"home" | "new-arrivals" | "trending" | "exclusive">("home");

  // Fetch new arrivals
  const { data: newArrivals = [], isLoading: loadingNewArrivals } = useQuery<Product[]>({
    queryKey: ["/api/products/new-arrivals"],
  });

  // Fetch trending products
  const { data: trendingProducts = [], isLoading: loadingTrending } = useQuery<Product[]>({
    queryKey: ["/api/products/trending"],
  });

  // Fetch exclusive products
  const { data: exclusiveProducts = [], isLoading: loadingExclusive } = useQuery<Product[]>({
    queryKey: ["/api/products/exclusive"],
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setViewMode("home");
      
      setTimeout(() => {
        const productsSection = document.querySelector("#products-section");
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setViewMode("home");
    setIsMenuOpen(false);
  };

  const handleViewAllNewArrivals = () => {
    setLocation("/products?collection=new-arrivals");
  };

  const handleViewAllTrending = () => {
    setLocation("/products?collection=trending");
  };

  const handleViewAllExclusive = () => {
    setLocation("/products?collection=exclusive");
  };

  const handleBackToHome = () => {
    setViewMode("home");
    setSelectedCategory("all");
  };

  // Filter products based on search query and price range
  const filterProducts = (products: Product[]) => {
    let filtered = products;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    if (priceRange) {
      filtered = filtered.filter(
        (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    return filtered;
  };

  const filteredNewArrivals = filterProducts(newArrivals);
  const filteredTrending = filterProducts(trendingProducts);
  const filteredExclusive = filterProducts(exclusiveProducts);

  const showBackButton = selectedCategory !== "all" || viewMode !== "home";

  return (
    <>
      <Header 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu}
        showBackButton={showBackButton}
        onBack={handleBackToHome}
      />
      <SideDrawer
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        onCategorySelect={handleCategorySelect}
      />

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
          data-testid="overlay-menu"
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-background"
      >
        {/* Spacer for fixed header */}
        <div className="h-[73px]" />

        <ImageCarousel />
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilterDialog={showFilterDialog}
          onToggleFilter={() => setShowFilterDialog(!showFilterDialog)}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />
        <CategoryGrid
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <div id="products-section">
          {/* Show New Arrivals and Trending sections when in home view */}
          {selectedCategory === "all" && viewMode === "home" && (
            <>
              {!loadingNewArrivals && filteredNewArrivals.length > 0 && (
                <HorizontalProductScroll
                  title="New Arrival"
                  products={filteredNewArrivals}
                  showViewAll={true}
                  onViewAll={handleViewAllNewArrivals}
                />
              )}

              {!loadingTrending && filteredTrending.length > 0 && (
                <HorizontalProductScroll
                  title="Trending Collection"
                  products={filteredTrending}
                  showViewAll={true}
                  onViewAll={handleViewAllTrending}
                />
              )}

              {!loadingExclusive && filteredExclusive.length > 0 && (
                <HorizontalProductScroll
                  title="Exclusive Collection"
                  products={filteredExclusive}
                  showViewAll={true}
                  onViewAll={handleViewAllExclusive}
                />
              )}

              {/* Show message when search returns no results */}
              {(searchQuery.trim() || priceRange[0] > 0 || priceRange[1] < 500000) && 
               filteredNewArrivals.length === 0 && 
               filteredTrending.length === 0 && 
               filteredExclusive.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No products match your search criteria. Try adjusting your filters.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Show all New Arrivals in grid view */}
          {selectedCategory === "all" && viewMode === "new-arrivals" && (
            <ProductGrid
              selectedCategory="new-arrivals"
              searchQuery={searchQuery}
              priceRange={priceRange}
              filters={filters}
            />
          )}

          {/* Show all Trending products in grid view */}
          {selectedCategory === "all" && viewMode === "trending" && (
            <ProductGrid
              selectedCategory="trending"
              searchQuery={searchQuery}
              priceRange={priceRange}
              filters={filters}
            />
          )}

          {/* Show all Exclusive products in grid view */}
          {selectedCategory === "all" && viewMode === "exclusive" && (
            <ProductGrid
              selectedCategory="exclusive"
              searchQuery={searchQuery}
              priceRange={priceRange}
              filters={filters}
            />
          )}

          {/* Show product grid only when a specific category is selected */}
          {selectedCategory !== "all" && (
            <ProductGrid
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              priceRange={priceRange}
              filters={filters}
            />
          )}
        </div>

        {/* Show Footer only on main screen (when in home view) */}
        {selectedCategory === "all" && viewMode === "home" && <Footer />}
      </motion.div>

      <FilterDrawer
        isOpen={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </>
  );
}

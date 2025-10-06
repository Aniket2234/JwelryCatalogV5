import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { useMemo } from "react";
import type { FilterOptions } from "@/components/FilterDrawer";
import { useLocation } from "wouter";
import ShareButton from "@/components/ShareButton";

interface ProductGridProps {
  selectedCategory: string;
  searchQuery?: string;
  priceRange?: [number, number];
  filters?: FilterOptions;
}

export default function ProductGrid({ selectedCategory, searchQuery = "", priceRange, filters }: ProductGridProps) {
  const [, setLocation] = useLocation();

  const handleProductClick = (product: Product) => {
    setLocation(`/product/${product._id}`);
  };
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory],
    queryFn: async () => {
      let url = "/api/products";
      
      if (selectedCategory === "new-arrivals") {
        url = "/api/products/new-arrivals";
      } else if (selectedCategory === "trending") {
        url = "/api/products/trending";
      } else if (selectedCategory === "exclusive") {
        url = "/api/products/exclusive";
      } else if (selectedCategory !== "all") {
        url = `/api/products?category=${selectedCategory}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  // Filter products based on search query, price range, and other filters
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description || '').toLowerCase().includes(query) ||
          (product.category || '').toLowerCase().includes(query)
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
      filtered = filtered.filter((product) => 
        product.purity && filters.purity.includes(product.purity)
      );
    }

    // Apply weight filter
    if (filters?.weight && filters.weight.length > 0) {
      filtered = filtered.filter((product) => 
        product.weight && filters.weight.includes(product.weight)
      );
    }

    // Apply stone filter
    if (filters?.stone && filters.stone.length > 0) {
      filtered = filtered.filter((product) => 
        product.stone && filters.stone.includes(product.stone)
      );
    }

    // Apply gender filter
    if (filters?.gender && filters.gender.length > 0) {
      filtered = filtered.filter((product) => 
        product.gender && filters.gender.includes(product.gender)
      );
    }

    // Apply occasion filter
    if (filters?.occasion && filters.occasion.length > 0) {
      filtered = filtered.filter((product) => 
        product.occasion && filters.occasion.includes(product.occasion)
      );
    }

    return filtered;
  }, [products, searchQuery, priceRange, filters]);

  const getCategoryName = (slug: string): string => {
    const categoryNames: Record<string, string> = {
      all: "All Jewelry",
      "new-arrivals": "New Arrivals",
      trending: "Trending Collection",
      necklaces: "Necklaces",
      earrings: "Earrings",
      rings: "Rings",
      bracelets: "Bracelets",
      bangles: "Bangles",
      pendants: "Pendants",
      sets: "Jewelry Sets",
    };
    return categoryNames[slug] || "All Jewelry";
  };

  if (isLoading) {
    return (
      <section className="bg-background py-12" id="products-section">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-10 w-64 bg-muted animate-pulse rounded mx-auto mb-2" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded mb-3 w-2/3" />
                  <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12" id="products-section">
      <div className="container mx-auto px-4">
        {/* Category Title */}
        <div className="mb-8">
          <h2
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-2"
            data-testid="text-category-title"
          >
            {getCategoryName(selectedCategory)}
          </h2>
          <p className="text-center text-muted-foreground" data-testid="text-product-count">
            {filteredProducts && filteredProducts.length > 0
              ? `Showing ${filteredProducts.length} exquisite ${filteredProducts.length === 1 ? "piece" : "pieces"}`
              : searchQuery
              ? "No products match your search"
              : "No products found in this category"}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts && filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="product-card overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all flex flex-col h-full"
                  data-testid={`card-product-${product._id}`}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      data-testid={`img-product-${product._id}`}
                    />
                    {product.isNewArrival && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        NEW
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge className={`absolute ${product.isNewArrival ? 'top-12' : 'top-3'} right-3 bg-destructive text-destructive-foreground`}>
                        SALE
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3 md:p-4 flex flex-col flex-1">
                    <h3
                      className="font-serif text-sm md:text-lg font-semibold mb-1 md:mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem]"
                      data-testid={`text-product-name-${product._id}`}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]"
                      data-testid={`text-product-description-${product._id}`}
                    >
                      {product.description}
                    </p>
                    <div className="flex flex-col gap-2 mt-auto">
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold text-sm md:text-lg text-primary break-words leading-tight"
                          data-testid={`text-product-price-${product._id}`}
                        >
                          ₹{product.price.toLocaleString()}
                        </p>
                        {product.originalPrice && (
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            <p className="text-xs text-muted-foreground line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </p>
                            <p className="text-xs text-destructive font-medium">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <ShareButton
                          productName={product.name}
                          productUrl={`/product/${product._id}`}
                          productImage={product.imageUrl}
                        />
                        <ShareButton
                          productName={product.name}
                          productUrl={`/product/${product._id}`}
                          variant="icon"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {filteredProducts.length >= 8 && (
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  data-testid="button-load-more"
                >
                  Load More Products
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery
                ? "No products match your search criteria. Try adjusting your filters."
                : "No products available in this category yet."}
            </p>
            {!searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Please add products to your MongoDB database.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import SideDrawer from "@/components/SideDrawer";
import type { Product } from "@shared/schema";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.id]);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', params?.id],
    enabled: !!params?.id,
    queryFn: async () => {
      const response = await fetch(`/api/products/${params?.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBack = () => {
    setLocation("/catalog");
  };

  const handleCategorySelect = (category: string) => {
    setIsMenuOpen(false);
    setLocation(`/catalog?category=${category}`);
  };

  if (isLoading) {
    return (
      <>
        <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} showBackButton={true} onBack={handleBack} />
        <SideDrawer
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCategorySelect={handleCategorySelect}
        />
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMenu}
            data-testid="overlay-menu"
          />
        )}
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 mt-20">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-[600px] w-full" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} showBackButton={true} onBack={handleBack} />
        <SideDrawer
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCategorySelect={handleCategorySelect}
        />
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMenu}
            data-testid="overlay-menu"
          />
        )}
        <div className="min-h-screen bg-background">
          <div className="flex items-center justify-center mt-32">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  const allImages = product.subImages && product.subImages.length > 0 
    ? product.subImages 
    : [product.imageUrl];

  return (
    <>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} showBackButton={true} onBack={handleBack} />
      <SideDrawer
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        onCategorySelect={handleCategorySelect}
      />
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
          data-testid="overlay-menu"
        />
      )}
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 mt-20">

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={allImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                data-testid="product-main-image"
              />
              
              {product.featured && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm px-3 py-1">
                  NEW
                </Badge>
              )}
              {product.originalPrice && (
                <Badge className={`absolute ${product.featured ? 'top-14' : 'top-4'} right-4 bg-destructive text-destructive-foreground text-sm px-3 py-1`}>
                  SALE
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid={`product-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="flex-1">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground mb-4 capitalize">
                {product.category}
              </p>

              <div className="flex items-baseline gap-3 mb-6">
                <p className="font-bold text-4xl text-primary">
                  ₹{product.price.toLocaleString()}
                </p>
                {product.originalPrice && (
                  <p className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-lg border-b pb-2">Product Specifications</h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.purity && (
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-primary/10">
                      <span className="text-sm text-muted-foreground font-medium">Purity / Karat</span>
                      <span className="font-semibold text-primary">{product.purity}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-primary/10">
                      <span className="text-sm text-muted-foreground font-medium">Weight Range</span>
                      <span className="font-semibold">{product.weight}</span>
                    </div>
                  )}
                  {product.stone && (
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-primary/10">
                      <span className="text-sm text-muted-foreground font-medium">Stone / Gemstone</span>
                      <span className="font-semibold">{product.stone}</span>
                    </div>
                  )}
                  {product.gender && (
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-primary/10">
                      <span className="text-sm text-muted-foreground font-medium">Designed For</span>
                      <span className="font-semibold">{product.gender}</span>
                    </div>
                  )}
                  {product.occasion && (
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-primary/10">
                      <span className="text-sm text-muted-foreground font-medium">Best For Occasion</span>
                      <span className="font-semibold">{product.occasion}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-primary/10">
                    <span className="text-sm text-muted-foreground font-medium">Category</span>
                    <span className="font-semibold capitalize">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-primary/10">
                    <span className="text-sm text-muted-foreground font-medium">Availability</span>
                    <span className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

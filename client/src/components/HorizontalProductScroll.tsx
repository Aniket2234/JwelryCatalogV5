import { useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface HorizontalProductScrollProps {
  title: string;
  products: Product[];
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function HorizontalProductScroll({
  title,
  products,
  showViewAll = true,
  onViewAll,
}: HorizontalProductScrollProps) {
  const [, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per interval
    const scrollInterval = 30; // milliseconds

    const startAutoScroll = () => {
      scrollIntervalRef.current = setInterval(() => {
        if (!container) return;

        scrollPosition += scrollSpeed;
        
        // When we reach the end, smoothly loop back to start
        if (scrollPosition >= container.scrollWidth - container.clientWidth) {
          scrollPosition = 0;
        }

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }, scrollInterval);
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    // Start auto-scroll
    startAutoScroll();

    // Pause auto-scroll on hover
    container.addEventListener("mouseenter", stopAutoScroll);
    container.addEventListener("mouseleave", startAutoScroll);

    // Cleanup
    return () => {
      stopAutoScroll();
      container.removeEventListener("mouseenter", stopAutoScroll);
      container.removeEventListener("mouseleave", startAutoScroll);
    };
  }, [products]);

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-8 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl md:text-3xl font-serif text-primary font-bold border-b-2 border-primary pb-2"
              data-testid={`section-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {title}
            </h2>
            {showViewAll && (
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                onClick={onViewAll}
                data-testid={`button-view-all-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              data-testid={`scroll-container-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="flex-shrink-0 w-64 cursor-pointer hover:shadow-lg transition-shadow duration-300 snap-start"
                  onClick={() => setLocation(`/product/${product._id}`)}
                  data-testid={`product-card-${product._id}`}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        data-testid={`product-image-${product._id}`}
                      />
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div
                          className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold"
                          data-testid={`badge-sale-${product._id}`}
                        >
                          SALE
                        </div>
                      )}
                      {!product.inStock && (
                        <div
                          className="absolute inset-0 bg-black/50 flex items-center justify-center"
                          data-testid={`overlay-out-of-stock-${product._id}`}
                        >
                          <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3
                        className="font-semibold text-base mb-2 line-clamp-2 min-h-[48px]"
                        data-testid={`product-name-${product._id}`}
                      >
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span
                          className="text-lg font-bold text-primary"
                          data-testid={`product-price-${product._id}`}
                        >
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span
                            className="text-sm text-muted-foreground line-through"
                            data-testid={`product-original-price-${product._id}`}
                          >
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {product.originalPrice && product.originalPrice > product.price && (
                        <div
                          className="mt-1 text-sm text-green-600 font-semibold"
                          data-testid={`product-discount-${product._id}`}
                        >
                          {Math.round(
                            ((product.originalPrice - product.price) / product.originalPrice) * 100
                          )}
                          % off
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

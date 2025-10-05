import { useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  // Auto-scroll disabled per user request

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-8 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <h2
                className="text-2xl md:text-4xl font-serif font-bold pb-2 tracking-wide"
                data-testid={`section-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {title.split(' ').map((word, index) => (
                  <span
                    key={index}
                    className={index === 0 ? "text-primary" : "text-black dark:text-white"}
                  >
                    {word}{index < title.split(' ').length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h2>
              <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>
            </div>
            {showViewAll && (
              <Button
                variant="outline"
                className="border-primary text-black dark:text-white hover:bg-primary hover:text-white transition-colors"
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
                <div
                  key={product._id}
                  className="flex-shrink-0 w-56 cursor-pointer group snap-start"
                  onClick={() => setLocation(`/product/${product._id}`)}
                  data-testid={`product-card-${product._id}`}
                >
                  <div className="relative overflow-hidden aspect-[3/4] rounded-lg mb-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      data-testid={`product-image-${product._id}`}
                    />
                    {product.featured && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        NEW
                      </Badge>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Badge className={`absolute ${product.featured ? 'top-12' : 'top-3'} right-3 bg-destructive text-destructive-foreground`}>
                        SALE
                      </Badge>
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

                  <div>
                    <h3
                      className="font-serif text-base font-semibold mb-2 line-clamp-2"
                      data-testid={`product-name-${product._id}`}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg font-semibold text-black dark:text-white"
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
                  </div>
                </div>
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

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

interface SimilarProductsProps {
  currentProductId: string;
  category: string;
}

export default function SimilarProducts({
  currentProductId,
  category,
}: SimilarProductsProps) {
  const [, setLocation] = useLocation();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", category],
    queryFn: async () => {
      const url =
        category !== "all"
          ? `/api/products?category=${category}`
          : "/api/products";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  const similarProducts =
    products?.filter((p) => p._id !== currentProductId).slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">
          Similar Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12" data-testid="section-similar-products">
      <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">
        Similar Products
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similarProducts.map((product) => (
          <Card
            key={product._id}
            className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
            onClick={() => setLocation(`/product/${product._id}`)}
            data-testid={`similar-product-${product._id}`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-serif text-sm font-semibold mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="font-bold text-lg text-primary">
                ₹{product.price.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

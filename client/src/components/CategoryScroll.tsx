import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Category } from "@shared/schema";

interface CategoryScrollProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryScroll({
  selectedCategory,
  onCategorySelect,
}: CategoryScrollProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const allCategories = [
    { _id: "all", name: "All", slug: "all", imageUrl: undefined },
    ...(categories || []),
  ];

  if (isLoading) {
    return (
      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-muted animate-pulse rounded-full"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {allCategories.map((category) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <button
                key={category._id}
                onClick={() => onCategorySelect(category.slug)}
                className={`flex-shrink-0 transition-transform ${
                  isSelected ? "scale-110" : "hover:scale-105"
                }`}
                data-testid={`button-category-scroll-${category.slug}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-16 h-16 rounded-full overflow-hidden ${
                      isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  >
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                        <span className="text-xl">✨</span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? "text-primary" : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

interface CategoryGridProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryGrid({
  selectedCategory,
  onCategorySelect,
}: CategoryGridProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-48 h-64 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6 bg-white relative overflow-hidden">
      {/* Top Golden Scrolling Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-600 to-transparent animate-scroll-line"></div>
      
      {/* Bottom Golden Scrolling Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-600 to-transparent animate-scroll-line-reverse"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category.slug)}
              className="flex-shrink-0 w-48 group"
              data-testid={`category-card-${category.slug}`}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    src={
                      category.imageUrl ||
                      `https://via.placeholder.com/200x250?text=${category.name}`
                    }
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="py-3 text-center">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

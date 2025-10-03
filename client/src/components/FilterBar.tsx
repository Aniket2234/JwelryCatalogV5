import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Category } from "@shared/schema";

interface FilterBarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function FilterBar({
  selectedCategory,
  onCategorySelect,
}: FilterBarProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filterOptions = [
    { slug: "all", name: "All" },
    ...(categories || []),
  ];

  if (isLoading) {
    return (
      <section className="py-6 bg-secondary/50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[...Array(5)].map((_, i) => (
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
    <section className="py-8 bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-y border-primary/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Filter Collections
            </span>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-primary rounded-full" />
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap max-w-4xl">
            {filterOptions.map((option) => {
              const isSelected = selectedCategory === option.slug;
              return (
                <Button
                  key={option.slug}
                  onClick={() => onCategorySelect(option.slug)}
                  variant={isSelected ? "default" : "outline"}
                  className={`
                    group relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 overflow-hidden
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xl shadow-primary/40 scale-105 border-0 hover:shadow-2xl hover:shadow-primary/50"
                        : "bg-white dark:bg-gray-800 text-foreground hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 dark:hover:from-gray-700 dark:hover:to-gray-600 border-2 border-border hover:border-primary/60 hover:scale-105 hover:shadow-md"
                    }
                  `}
                  data-testid={`filter-${option.slug}`}
                >
                  {isSelected && (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 opacity-30 animate-pulse" />
                      <span className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
                    </>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {isSelected && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {option.name}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

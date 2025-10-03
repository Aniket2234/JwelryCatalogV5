import { useQuery } from "@tanstack/react-query";
import { X, Gem, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Category, ShopInfo } from "@shared/schema";

interface SideDrawerProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onCategorySelect: (category: string) => void;
}

export default function SideDrawer({
  isMenuOpen,
  toggleMenu,
  onCategorySelect,
}: SideDrawerProps) {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: shopInfo, isLoading: shopInfoLoading } = useQuery<ShopInfo>({
    queryKey: ["/api/shop-info"],
  });

  const handleCategoryClick = (slug: string) => {
    onCategorySelect(slug);
    toggleMenu();
    setTimeout(() => {
      const productsSection = document.querySelector("#products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-background shadow-2xl transform transition-transform duration-300 ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      data-testid="drawer-side-menu"
    >
      <div className="h-full flex flex-col">
        {/* Drawer Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-primary" data-testid="text-menu-title">
            Menu
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close menu"
            data-testid="button-close-menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Categories Section */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Categories
              </h3>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : categories && categories.length > 0 ? (
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 group"
                      data-testid={`button-category-${category.slug}`}
                    >
                      <Gem className="text-primary group-hover:scale-110 transition-transform h-5 w-5" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </nav>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No categories available. Please add categories to your MongoDB database.
                </p>
              )}
            </div>

            <Separator className="my-6" />

            {/* Shop Information */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Shop Information
              </h3>
              {shopInfoLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-5 h-5 bg-muted animate-pulse rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                        <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : shopInfo ? (
                <div className="space-y-4">
                  <div className="flex gap-3" data-testid="info-address">
                    <MapPin className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {shopInfo.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3" data-testid="info-phone">
                    <Phone className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {shopInfo.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3" data-testid="info-email">
                    <Mail className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {shopInfo.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3" data-testid="info-hours">
                    <Clock className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {shopInfo.hours}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No shop information available. Please add shop info to your MongoDB database.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Drawer Footer - Social Media Icons */}
        <div className="p-6 border-t border-border bg-secondary/30">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 text-center">
            Connect With Us
          </h3>
          <div className="flex gap-6 justify-center">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 bg-background border border-border rounded-full hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
              data-testid="link-instagram-menu"
            >
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 bg-background border border-border rounded-full hover:border-green-600 hover:bg-green-50 transition-all duration-300 hover:scale-110"
              aria-label="WhatsApp"
              data-testid="link-whatsapp-menu"
            >
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-green-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 bg-background border border-border rounded-full hover:border-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
              data-testid="link-youtube-menu"
            >
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

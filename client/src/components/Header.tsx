import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function Header({ isMenuOpen, toggleMenu }: HeaderProps) {
  const [location] = useLocation();
  const showBackButton = location !== "/";

  const handleBack = () => {
    window.history.back();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="w-10">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Go back"
              data-testid="button-back"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
        </div>

        <Link href="/">
          <div className="relative">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-center flex-1 cursor-pointer pb-1" data-testid="text-brand-name">
              <span className="text-primary">Jewellery</span>{" "}
              <span className="text-foreground">Catalog</span>
            </h1>
            <div className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className={`hamburger p-2 hover:bg-muted rounded-lg transition-colors ${
              isMenuOpen ? "hamburger-active" : ""
            }`}
            aria-label="Toggle menu"
            data-testid="button-toggle-menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className="hamburger-line h-0.5 w-full bg-foreground rounded" />
              <span className="hamburger-line h-0.5 w-full bg-foreground rounded" />
              <span className="hamburger-line h-0.5 w-full bg-foreground rounded" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}

import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail } from "lucide-react";
import type { ShopInfo } from "@shared/schema";

export default function Footer() {
  const { data: shopInfo } = useQuery<ShopInfo>({
    queryKey: ["/api/shop-info"],
  });

  return (
    <footer className="bg-secondary border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4" data-testid="text-footer-brand">
              <span className="text-primary">Jewelry</span> Catalog
            </h3>
            <p className="text-muted-foreground mb-4">
              Discover timeless elegance with our curated collection of fine
              jewelry, crafted with precision and passion.
            </p>
            <div className="flex gap-4">
              {shopInfo?.facebookUrl && (
                <a
                  href={shopInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Facebook"
                  data-testid="link-footer-facebook"
                >
                  <i className="fab fa-facebook-f" />
                </a>
              )}
              {shopInfo?.instagramUrl && (
                <a
                  href={shopInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Instagram"
                  data-testid="link-footer-instagram"
                >
                  <i className="fab fa-instagram" />
                </a>
              )}
              {shopInfo?.pinterestUrl && (
                <a
                  href={shopInfo.pinterestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Pinterest"
                  data-testid="link-footer-pinterest"
                >
                  <i className="fab fa-pinterest" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Our Collections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Custom Design
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Care Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            {shopInfo ? (
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-pre-line">{shopInfo.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>{shopInfo.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>{shopInfo.email}</span>
                </li>
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Contact information not available.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>
            &copy; {new Date().getFullYear()} Jewelry Catalog. All rights
            reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}

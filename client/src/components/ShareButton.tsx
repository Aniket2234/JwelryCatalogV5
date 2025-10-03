import { useState } from "react";
import { Share2, MessageCircle } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  productName: string;
  productUrl: string;
  productImage?: string;
  variant?: "default" | "icon";
  className?: string;
}

export default function ShareButton({
  productName,
  productUrl,
  productImage,
  variant = "default",
  className = "",
}: ShareButtonProps) {
  const shareText = `Check out ${productName}`;
  const fullUrl = window.location.origin + productUrl;

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
  };

  const shareOnInstagram = () => {
    const instagramText = `${shareText}\n\n${fullUrl}`;
    navigator.clipboard.writeText(instagramText);
    alert("Link copied! You can now paste it on Instagram");
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText} - ${fullUrl}`)}`,
      "_blank"
    );
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          shareOnWhatsApp();
        }}
        className={`p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors ${className}`}
        data-testid="button-whatsapp-direct"
      >
        <FaWhatsapp className="h-5 w-5 text-green-600" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => e.stopPropagation()}
          className={`p-2 hover:bg-accent rounded-full transition-colors ${className}`}
          data-testid="button-share"
        >
          <Share2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            shareOnFacebook();
          }}
          className="cursor-pointer"
          data-testid="share-facebook"
        >
          <FaFacebook className="mr-2 h-5 w-5 text-[#1877F2]" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            shareOnInstagram();
          }}
          className="cursor-pointer"
          data-testid="share-instagram"
        >
          <div className="mr-2 h-5 w-5 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] rounded flex items-center justify-center">
            <FaInstagram className="h-4 w-4 text-white" />
          </div>
          Share on Instagram
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            shareOnWhatsApp();
          }}
          className="cursor-pointer"
          data-testid="share-whatsapp"
        >
          <FaWhatsapp className="mr-2 h-5 w-5 text-[#25D366]" />
          Share on WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

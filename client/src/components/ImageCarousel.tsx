import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CarouselImage } from "@shared/schema";

export default function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: carouselImages, isLoading } = useQuery<CarouselImage[]>({
    queryKey: ["/api/carousel"],
  });

  const images = carouselImages || [];

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <section className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="relative rounded-xl overflow-hidden shadow-lg h-64 md:h-96 lg:h-[500px] bg-muted animate-pulse" />
        </div>
      </section>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-64 md:h-96 lg:h-[500px]">
            {images.map((image, index) => (
              <div
                key={image._id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                data-testid={`carousel-slide-${index}`}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <div className="px-8 md:px-16 max-w-2xl">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4" data-testid={`text-carousel-title-${index}`}>
                      {image.title}
                    </h2>
                    {image.subtitle && (
                      <p className="text-white/90 text-lg mb-6" data-testid={`text-carousel-subtitle-${index}`}>
                        {image.subtitle}
                      </p>
                    )}
                    {image.buttonText && (
                      <Button
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
                        data-testid={`button-carousel-${index}`}
                      >
                        {image.buttonText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`carousel-dot w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "active bg-primary scale-110"
                    : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`button-carousel-dot-${index}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={previousSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white"
            aria-label="Previous slide"
            data-testid="button-carousel-previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white"
            aria-label="Next slide"
            data-testid="button-carousel-next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}

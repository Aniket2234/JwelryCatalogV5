import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface GoogleReviewProps {
  googleReviewUrl?: string;
}

export default function GoogleReview({
  googleReviewUrl = "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID",
}: GoogleReviewProps) {
  // To get your Google Place ID and review URL:
  // 1. Go to Google Maps and search for your business
  // 2. Click on your business listing
  // 3. Scroll down and click "Share" → "Share review form"
  // 4. Copy the URL and replace YOUR_PLACE_ID in the default URL above
  // Or pass a custom googleReviewUrl prop to this component
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedStar, setSelectedStar] = useState<number>(0);

  const handleStarClick = (rating: number) => {
    setSelectedStar(rating);
    setTimeout(() => {
      window.open(googleReviewUrl, "_blank");
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="flex flex-col items-center gap-3"
    >
      <p className="text-white/90 text-sm font-medium">Rate Your Experience</p>
      <div
        className="flex items-center gap-2"
        data-testid="google-review-stars"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = selectedStar >= star || hoveredStar >= star;
          return (
            <motion.button
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="focus:outline-none"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              data-testid={`star-${star}`}
            >
              <Star
                className={`w-8 h-8 transition-all duration-200 ${
                  isActive
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                    : "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                }`}
              />
            </motion.button>
          );
        })}
      </div>
      <p className="text-white/70 text-xs">Click to leave a Google review</p>
    </motion.div>
  );
}

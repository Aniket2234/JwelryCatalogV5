// import { motion } from "framer-motion";
// import { useLocation } from "wouter";
// import { ArrowRight, TrendingUp } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useQuery } from "@tanstack/react-query";
// import { Skeleton } from "@/components/ui/skeleton";

// interface RatesData {
//   gold_24k: string;
//   gold_22k: string;
//   silver: string;
//   lastUpdated?: string;
//   isCached?: boolean;
//   cacheAge?: number;
// }

// export default function Welcome() {
//   const [, setLocation] = useLocation();

//   const { data: rates, isLoading: ratesLoading } = useQuery<RatesData>({
//     queryKey: ['/api/rates'],
//     refetchInterval: 60 * 60 * 1000, // Refetch every hour
//   });

//   const handleExploreCatalog = () => {
//     setLocation("/catalog");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.8 }}
//       className="relative w-full h-screen overflow-hidden"
//     >
//       {/* Video Background */}
//       <div className="video-container">
//         <video
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//           data-testid="welcome-video"
//         >
//           <source src="/VID.mp4" type="video/mp4" />
//         </video>
//         <div className="video-overlay" />
//       </div>

//       {/* Welcome Content */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3, duration: 0.8 }}
//         className="absolute inset-0 flex flex-col items-center justify-between z-10 px-4 py-12"
//       >
//         <div className="w-full">
//           {/* Live Rates Bar */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.8 }}
//             className="backdrop-blur-md bg-black/40 border border-white/20 rounded-2xl px-6 py-4 max-w-5xl mx-auto mb-8"
//             data-testid="rates-container"
//           >
//             <div className="flex items-center justify-center gap-2 mb-3">
//               <TrendingUp className="w-5 h-5 text-primary" />
//               <h3 className="text-white font-semibold text-sm md:text-base">
//                 Live IBJA Rates (India)
//               </h3>
//             </div>

//             {ratesLoading ? (
//               <div className="flex flex-wrap justify-center gap-6">
//                 <Skeleton className="h-16 w-40 bg-white/20" />
//                 <Skeleton className="h-16 w-40 bg-white/20" />
//                 <Skeleton className="h-16 w-40 bg-white/20" />
//               </div>
//             ) : (
//               <div className="flex flex-wrap justify-center gap-4 md:gap-8">
//                 <div className="text-center" data-testid="rate-gold-24k">
//                   <p className="text-xs md:text-sm text-white/80 mb-1">24K Gold (10g)</p>
//                   <p className="text-lg md:text-2xl font-bold text-primary">
//                     {rates?.gold_24k || 'N/A'}
//                   </p>
//                 </div>
//                 <div className="text-center" data-testid="rate-gold-22k">
//                   <p className="text-xs md:text-sm text-white/80 mb-1">22K Gold (10g)</p>
//                   <p className="text-lg md:text-2xl font-bold text-primary">
//                     {rates?.gold_22k || 'N/A'}
//                   </p>
//                 </div>
//                 <div className="text-center" data-testid="rate-silver">
//                   <p className="text-xs md:text-sm text-white/80 mb-1">Silver (1kg)</p>
//                   <p className="text-lg md:text-2xl font-bold text-white">
//                     {rates?.silver === 'N/A' ? 'Not Available' : rates?.silver || 'Loading...'}
//                   </p>
//                 </div>
//               </div>
//             )}
//             <p className="text-xs text-white/60 text-center mt-3">
//               Rates updated hourly from IBJA.co
//               {rates?.isCached && rates?.cacheAge ? ` (cached ${rates.cacheAge} min ago)` : ''}
//             </p>
//           </motion.div>

//           <div className="text-center">
//             <h1
//               className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-4 text-white tracking-wide text-shadow-lg"
//               data-testid="text-welcome-title"
//             >
//               <span className="text-primary">Jewelry</span> Catalog
//             </h1>
//             <p
//               className="font-display text-xl md:text-2xl text-white text-center max-w-2xl text-shadow-md mx-auto"
//               data-testid="text-welcome-subtitle"
//             >
//               Discover Timeless Elegance and Exquisite Craftsmanship
//             </p>
//           </div>
//         </div>

//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="mb-12"
//         >
//           <Button
//             onClick={handleExploreCatalog}
//             size="lg"
//             className="group relative px-10 py-6 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-full shadow-2xl hover:bg-white/10 hover:shadow-white/50 transition-all duration-300 flex items-center justify-center"
//             data-testid="button-explore-catalog"
//           >
//             <span className="transition-transform duration-300 group-hover:scale-110">
//               Explore Catalog
//             </span>
//             <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:scale-125 group-hover:translate-x-1" />
//           </Button>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// }
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import GoogleReview from "@/components/GoogleReview";

interface RatesData {
  gold_24k: string;
  gold_22k: string;
  silver: string;
  lastUpdated?: string;
  isCached?: boolean;
  cacheAge?: number;
}

export default function Welcome() {
  const [, setLocation] = useLocation();

  const { data: rates, isLoading: ratesLoading } = useQuery<RatesData>({
    queryKey: ["/api/rates"],
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  });

  const handleExploreCatalog = () => {
    setLocation("/catalog");
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Video Background */}
      <div className="video-container">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="welcome-video"
        >
          <source src="/VID.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" />
      </div>

      {/* Welcome Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute inset-0 flex flex-col items-center justify-between z-10 px-4 py-12"
      >
        <div className="w-full">
          {/* Title Section - Now First */}
          <div className="text-center mb-8">
            <h1
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-4 text-white tracking-wide text-shadow-lg"
              data-testid="text-welcome-title"
            >
              <span className="text-primary">Jewelry</span> Catalog
            </h1>
            <p
              className="font-display text-xl md:text-2xl text-white text-center max-w-2xl text-shadow-md mx-auto"
              data-testid="text-welcome-subtitle"
            >
              Discover Timeless Elegance and Exquisite Craftsmanship
            </p>
          </div>

          {/* Live Rates Bar - Now Second */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-black/40 border border-white/20 rounded-2xl px-6 py-4 max-w-5xl mx-auto"
            data-testid="rates-container"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-white font-semibold text-sm md:text-base">
                Live Rates (India)
              </h3>
            </div>

            {ratesLoading ? (
              <div className="flex flex-wrap justify-center gap-6">
                <Skeleton className="h-16 w-40 bg-white/20" />
                <Skeleton className="h-16 w-40 bg-white/20" />
                <Skeleton className="h-16 w-40 bg-white/20" />
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <div className="text-center" data-testid="rate-gold-24k">
                  <p className="text-xs md:text-sm text-white/80 mb-1">
                    24K Gold (10g)
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-primary">
                    {rates?.gold_24k || "N/A"}
                  </p>
                </div>
                <div className="text-center" data-testid="rate-gold-22k">
                  <p className="text-xs md:text-sm text-white/80 mb-1">
                    22K Gold (10g)
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-primary">
                    {rates?.gold_22k || "N/A"}
                  </p>
                </div>
                <div className="text-center" data-testid="rate-silver">
                  <p className="text-xs md:text-sm text-white/80 mb-1">
                    Silver (10g)
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-white">
                    {rates?.silver === "N/A"
                      ? "Not Available"
                      : rates?.silver || "Loading..."}
                  </p>
                </div>
              </div>
            )}
            <p className="text-xs text-white/60 text-center mt-3">
              Rates updated hourly from Moneycontrol.com
              {rates?.isCached && rates?.cacheAge
                ? ` (cached ${rates.cacheAge} min ago)`
                : ""}
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-6 mt-8">
          {/* Social Media Icons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300"
              aria-label="Instagram"
              data-testid="link-instagram-welcome"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/917507219775"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 bg-[#25D366] backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300"
              aria-label="WhatsApp"
              data-testid="link-whatsapp-welcome"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 bg-[#FF0000] backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300"
              aria-label="YouTube"
              data-testid="link-youtube-welcome"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </motion.div>

          {/* Explore Catalog Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleExploreCatalog}
              size="lg"
              className="group relative px-10 py-6 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-full shadow-2xl hover:bg-white/10 hover:shadow-white/50 transition-all duration-300 flex items-center justify-center"
              data-testid="button-explore-catalog"
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                Explore Catalog
              </span>
              <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:scale-125 group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Google Review Section */}
          <GoogleReview googleReviewUrl="https://g.page/r/CQ_kIy8zvyEaEBM/review" />
        </div>
      </motion.div>
    </motion.div>
  );
}

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full bg-primary/10 ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const portfolioItems = [
  { title: "Social Media Campaign", category: "Social Media", color: "from-primary/80 to-primary/40", behance: "https://www.behance.net/deatordesign" },
  { title: "E-Commerce Redesign", category: "Web Design", color: "from-secondary to-secondary/60", behance: "https://www.behance.net/deatordesign" },
  { title: "Brand Identity System", category: "Branding", color: "from-primary/60 to-primary/20", behance: "https://www.behance.net/deatordesign" },
  { title: "Product Launch Poster", category: "Graphic Design", color: "from-secondary/80 to-primary/40", behance: "https://www.behance.net/deatordesign" },
  { title: "Marketing Campaign", category: "Digital Marketing", color: "from-primary/70 to-secondary/50", behance: "https://www.behance.net/deatordesign" },
  { title: "Corporate Video", category: "Video Production", color: "from-secondary/60 to-primary/30", behance: "https://www.behance.net/deatordesign" },
  { title: "Restaurant Branding", category: "Branding", color: "from-primary/50 to-secondary/70", behance: "https://www.behance.net/deatordesign" },
  { title: "Fitness App UI", category: "Web Design", color: "from-secondary/90 to-primary/50", behance: "https://www.behance.net/deatordesign" },
  { title: "Fashion Lookbook", category: "Graphic Design", color: "from-primary/90 to-secondary/40", behance: "https://www.behance.net/deatordesign" },
  { title: "Startup Social Launch", category: "Social Media", color: "from-secondary/50 to-primary/60", behance: "https://www.behance.net/deatordesign" },
  { title: "Event Promo Reel", category: "Video Production", color: "from-primary/40 to-secondary/80", behance: "https://www.behance.net/deatordesign" },
  { title: "SEO Case Study", category: "Digital Marketing", color: "from-secondary/70 to-primary/70", behance: "https://www.behance.net/deatordesign" },
];

const categories = ["All", ...Array.from(new Set(portfolioItems.map((p) => p.category)))];

const PortfolioSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filtered = activeCategory === "All" ? portfolioItems : portfolioItems.filter((p) => p.category === activeCategory);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      {/* Floating shapes */}
      <FloatingShape className="w-20 h-20 top-[15%] left-[8%]" delay={0} />
      <FloatingShape className="w-14 h-14 top-[55%] right-[12%]" delay={1} />
      <FloatingShape className="w-32 h-32 bottom-[10%] left-[80%] bg-primary/5" delay={2} />
      <FloatingShape className="w-10 h-10 top-[25%] right-[25%]" delay={0.5} />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Portfolio</span>
          <h2 className="section-heading mt-3 text-3xl md:text-4xl lg:text-5xl">
            Our <span className="text-gradient">Work</span>
          </h2>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="relative h-[350px] sm:h-[450px] md:h-[500px] w-full max-w-4xl mx-auto flex items-center justify-center mt-8 md:mt-12 perspective-[1000px]">
          {filtered.map((item, index) => {
            const isFront = index === currentIndex;
            
            // Calculate offset relative to current index
            let offset = index - currentIndex;
            
            // Handle wrapping conceptually for visual calculation
            if (offset < 0 && Math.abs(offset) > filtered.length / 2) {
              offset += filtered.length;
            } else if (offset > 0 && offset > filtered.length / 2) {
              offset -= filtered.length;
            }

            // Determine states
            let scale = 0.75;
            let y = 0;
            let x = 0;
            let rotateY = 0;
            let zIndex = 0;
            let opacity = 0;
            
            const absOffset = Math.abs(offset);

            if (isFront) {
              scale = 1;
              x = 0;
              y = 0;
              rotateY = 0;
              zIndex = 10;
              opacity = 1;
            } else if (absOffset <= 2) { // Show up to 2 cards on each side
              scale = 1 - absOffset * 0.15;
              x = offset > 0 ? absOffset * 35 : absOffset * -35; // Move left or right (percentage-like via vw or custom calc, but we use a multiplier for translate)
              x = offset * 180; // 180px offset per card
              rotateY = offset > 0 ? -25 : 25; // Rotate inward
              zIndex = 10 - absOffset;
              opacity = 1 - absOffset * 0.3;
            }

            return (
              <motion.a
                key={`${item.title}-${index}`} // Use index in key to force re-render if needed, but item.title is better
                href={item.behance}
                target="_blank"
                rel="noopener noreferrer"
                initial={false}
                animate={{ scale, y, x, rotateY, opacity, zIndex }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} // Spring-like beautiful ease
                className={`absolute shadow-2xl aspect-[4/3] w-full max-w-[600px] rounded-2xl overflow-hidden cursor-pointer block ${
                  isFront ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{ transformOrigin: "center center" }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary-foreground/30 font-heading text-6xl font-black">D</span>
                </div>

                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/80 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <ExternalLink className="text-primary-foreground mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" size={28} />
                    <h3 className="text-primary-foreground font-bold font-heading text-lg">{item.title}</h3>
                    <p className="text-primary-foreground/80 text-sm mt-1">{item.category}</p>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_60px_hsl(346,82%,46%,0.3)]" />
              </motion.a>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center mt-12 md:mt-16 gap-6"
        >
          <button 
            onClick={handlePrev}
            className="p-4 rounded-full bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-x-1 transition-all duration-300 shadow-sm hover:shadow-lg"
            aria-label="Previous work"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-muted-foreground font-medium min-w-[3rem] text-center tracking-widest">
            {currentIndex + 1} <span className="text-muted-foreground/40">/</span> {filtered.length}
          </div>

          <button 
            onClick={handleNext}
            className="p-4 rounded-full bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:translate-x-1 transition-all duration-300 shadow-sm hover:shadow-lg"
            aria-label="Next work"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;

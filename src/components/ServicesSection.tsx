import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Megaphone,
  Share2,
  Monitor,
  Palette,
  Video,
  Search,
} from "lucide-react";

const services = [
  { icon: Megaphone, title: "Digital Marketing", desc: "Strategic campaigns that reach the right audience and drive conversions across all digital channels." },
  { icon: Share2, title: "Social Media Management", desc: "Engaging content strategies and community management that build loyal brand followings." },
  { icon: Monitor, title: "Website Design & Dev", desc: "Beautiful, responsive websites built with modern tech that convert visitors into customers." },
  { icon: Palette, title: "Branding & Graphic Design", desc: "Distinctive visual identities and design systems that make your brand unforgettable." },
  { icon: Video, title: "Video & Content Creation", desc: "Compelling video content and creative assets that tell your brand story and captivate." },
  { icon: Search, title: "SEO Optimization", desc: "Data-driven SEO strategies that improve visibility and drive organic traffic growth." },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Our Services</span>
          <h2 className="section-heading mt-3 text-3xl md:text-4xl lg:text-5xl">
            What We <span className="text-gradient">Offer</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="glass-card p-8 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-500">
                <svc.icon className="text-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" size={26} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3 text-foreground">{svc.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

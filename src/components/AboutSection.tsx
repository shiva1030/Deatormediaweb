import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Target, Users, Zap } from "lucide-react";

const stats = [
  { icon: Lightbulb, label: "Creative Ideas", value: "500+" },
  { icon: Target, label: "Projects Delivered", value: "200+" },
  { icon: Users, label: "Happy Clients", value: "150+" },
  { icon: Zap, label: "Years Experience", value: "5+" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[150px]" />

      <div className="container mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="text-primary font-semibold tracking-wider uppercase text-sm"
            >
              About Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-heading mt-3 mb-6 text-3xl md:text-4xl lg:text-5xl"
            >
              Crafting Digital <span className="text-gradient">Excellence</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed mb-6"
            >
              DeatorMedia is a creative digital agency dedicated to helping businesses 
              thrive in the digital landscape. We blend innovation with strategy to 
              deliver unforgettable brand experiences.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground leading-relaxed"
            >
              From startups to established brands, we bring trust, creativity, and 
              cutting-edge technology together to build solutions that truly resonate 
              with your audience and drive measurable growth.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-card p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_hsl(346,82%,46%,0.4)] transition-all duration-500">
                  <stat.icon className="text-primary group-hover:scale-110 transition-transform duration-500" size={24} />
                </div>
                <div className="text-3xl font-bold font-heading text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

import logo from "@/assets/logo.png";
import { Instagram, Facebook, Linkedin, MapPin } from "lucide-react";
import BehanceIcon from "./icons/BehanceIcon";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="DeatorMedia" className="h-8 w-auto" />
            <span className="font-heading font-bold text-lg text-foreground">DeatorMedia</span>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            {["Home", "About", "Services", "Portfolio", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const id = item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "contact" ? "contactus" : item.toLowerCase();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-primary transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {[
              { Icon: Instagram, href: "https://www.instagram.com/deatormedia/" },
              { Icon: Facebook, href: "https://www.facebook.com/share/1NjsuMprN3/?mibextid=wwXIfr" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/deator-designs-b04b24324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" },
              { Icon: BehanceIcon, href: "https://www.behance.net/deatordesign" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-muted-foreground"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10 text-sm text-muted-foreground">
          <span className="inline-block animate-bounce text-primary">
            <MapPin size={16} />
          </span>
          <span>Pushpanjali Baikunth Phase-1, Vrindavan Dham (City of Lord Krishna)</span>
        </div>

        <div className="text-center mt-4 text-sm text-muted-foreground">
          © {new Date().getFullYear()} DeatorMedia. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

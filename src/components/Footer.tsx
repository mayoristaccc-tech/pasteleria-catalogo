import { Heart, Phone } from "lucide-react";
import logo from "@/assets/logo-dolcce-vitta.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/50 py-8">
      <div className="container">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <img
            src={logo}
            alt="Dolcce Vitta+ Logo"
            className="h-16 w-auto object-contain"
          />

          {/* Teléfono */}
          <a
            href="tel:+5411-5379-0146"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            <span>11-5379-0146</span>
          </a>

          {/* Mensaje con corazón */}
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            Hecho con <Heart className="h-4 w-4 fill-primary text-primary" /> por Dolcce Vitta+
          </p>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} Dolcce Vitta+ Pastelería Artesanal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

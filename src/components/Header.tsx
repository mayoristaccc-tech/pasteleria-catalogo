import defaultLogo from "@/assets/logo-dolcce-vitta.png";
import ImageUploadButton from "./ImageUploadButton";
import LogoPositionControl, { LogoPosition } from "./LogoPositionControl";
interface HeaderProps {
  modoCreador?: boolean;
  logoUrl?: string | null;
  coverUrl?: string | null;
  logoPosition?: LogoPosition;
  onLogoChange?: (url: string | null) => void;
  onCoverChange?: (url: string | null) => void;
  onLogoPositionChange?: (position: LogoPosition) => void;
  onLogoPositionReset?: () => void;
}
const Header = ({
  modoCreador = false,
  logoUrl,
  coverUrl,
  logoPosition = {
    x: 0,
    y: 0
  },
  onLogoChange,
  onCoverChange,
  onLogoPositionChange,
  onLogoPositionReset
}: HeaderProps) => {
  const currentLogo = logoUrl || defaultLogo;
  const hasCustomLogo = !!logoUrl;

  // Calcular object-position basado en la posición
  const logoObjectPosition = `${50 + logoPosition.x}% ${50 + logoPosition.y}%`;
  return <header className="relative overflow-hidden gradient-hero pb-8 pt-6">
      {/* Fondo de portada personalizado */}
      {coverUrl && <div className="absolute inset-0 bg-cover bg-center" style={{
      backgroundImage: `url(${coverUrl})`
    }}>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        </div>}

      {/* Decoración de fondo (solo si no hay portada) */}
      {!coverUrl && <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-20 top-10 h-48 w-48 rounded-full bg-accent/40 blur-3xl" />
        </div>}

      <div className="container relative">
        {/* Botones de edición en modo creador */}
        {modoCreador && <div className="mb-4 flex flex-wrap justify-center gap-3">
            <ImageUploadButton label="Cambiar Logo" removeLabel="Quitar Logo" hasImage={!!logoUrl} onImageUpload={url => onLogoChange?.(url)} onImageRemove={() => onLogoChange?.(null)} variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm" />
            <ImageUploadButton label="Cambiar Portada" removeLabel="Quitar Portada" hasImage={!!coverUrl} onImageUpload={url => onCoverChange?.(url)} onImageRemove={() => onCoverChange?.(null)} variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm" />
          </div>}

        {/* Logo y nombre */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 animate-float">
            <img src={currentLogo} alt="Dolcce Vitta+ Pastelería Artesanal" className="h-32 w-32 shadow-elevated sm:h-40 sm:w-40 object-scale-down border-0 rounded" style={{
            objectPosition: hasCustomLogo ? logoObjectPosition : 'center'
          }} />
          </div>

          {/* Controles de posición del logo - solo en modo creador con logo personalizado */}
          {modoCreador && hasCustomLogo && onLogoPositionChange && onLogoPositionReset && <div className="mb-4">
              <LogoPositionControl position={logoPosition} onPositionChange={onLogoPositionChange} onReset={onLogoPositionReset} />
            </div>}

          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Dolcce Vitta<span className="text-gold">+</span>
          </h1>
          <p className="mt-2 text-lg font-medium sm:text-xl text-pink-600">
            🧁Pastelería Artesanal🧁
          </p>

          {/* Slogan */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary/80 px-6 py-2.5 shadow-soft backdrop-blur-sm">
            <span className="animate-shimmer bg-clip-text text-sm font-medium tracking-wide sm:text-base">
              ✨ RENOVÁ TUS MOMENTOS DULCES ✨
            </span>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;
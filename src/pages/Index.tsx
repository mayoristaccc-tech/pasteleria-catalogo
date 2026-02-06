import { useState } from "react";
import { Plus, LogOut, Settings, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import PasswordModal from "@/components/PasswordModal";
import EmptyState from "@/components/EmptyState";
import AboutUsModal from "@/components/AboutUsModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useCreatorMode } from "@/hooks/useCreatorMode";
import { useAboutUs } from "@/hooks/useAboutUs";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { Product } from "@/types/product";

const Index = () => {
  const { productos, cargando, agregarProducto, editarProducto, eliminarProducto } = useProducts();
  const {
    modoCreador,
    mostrarModal,
    error,
    abrirModalPassword,
    cerrarModalPassword,
    verificarPassword,
    salirModoCreador,
  } = useCreatorMode();
  const { aboutText, guardarAboutText } = useAboutUs();
  const { logoUrl, coverUrl, logoPosition, actualizarLogo, actualizarLogoPosition, resetearLogoPosition, actualizarCover } = useSiteConfig();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Product | null>(null);
  const [mostrarAboutUs, setMostrarAboutUs] = useState(false);

  const abrirFormularioNuevo = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (producto: Product) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {modoCreador && (
        <div className="sticky top-0 z-40 bg-accent/90 px-4 py-2 text-center shadow-soft backdrop-blur-sm">
          <div className="container flex items-center justify-center gap-2">
            <Settings className="h-4 w-4 animate-spin text-accent-foreground" style={{ animationDuration: '3s' }} />
            <span className="text-sm font-medium text-accent-foreground">
              Modo Creador Activo
            </span>
          </div>
        </div>
      )}

      <Header
        modoCreador={modoCreador}
        logoUrl={logoUrl}
        coverUrl={coverUrl}
        logoPosition={logoPosition}
        onLogoChange={actualizarLogo}
        onCoverChange={actualizarCover}
        onLogoPositionChange={actualizarLogoPosition}
        onLogoPositionReset={resetearLogoPosition}
      />

      <main className="container flex-1 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Nuestros Productos
            </h2>
            <p className="text-muted-foreground">
              {productos.length > 0
                ? `${productos.length} delicia${productos.length !== 1 ? "s" : ""} artesanal${productos.length !== 1 ? "es" : ""}`
                : "Descubre nuestras creaciones"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setMostrarAboutUs(true)}
              className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Info className="h-4 w-4" />
              Sobre Nosotros
            </Button>

            {modoCreador ? (
              <>
                <Button
                  onClick={abrirFormularioNuevo}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Producto
                </Button>
                <Button
                  variant="outline"
                  onClick={salirModoCreador}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={abrirModalPassword}
                className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
                Modo Creador
              </Button>
            )}
          </div>
        </div>

        {cargando ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : productos.length === 0 ? (
          <EmptyState />
        ) : (
          /* GALERÍA DE PRODUCTOS CON LOGO DE PRUEBA */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto, index) => (
              <div
                key={producto.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >

                {/* LOGO DE PRUEBA */}
                <div className="mb-2 flex justify-center">
                  <img
                    src="/logo.png"
                    alt="Logo de prueba"
                    className="h-12 w-auto"
                  />
                </div>

                <ProductCard
                  producto={producto}
                  modoCreador={modoCreador}
                  onEdit={abrirFormularioEditar}
                  onDelete={eliminarProducto}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />

      <AboutUsModal
        isOpen={mostrarAboutUs}
        onClose={() => setMostrarAboutUs(false)}
        aboutText={aboutText}
        onSave={guardarAboutText}
        modoCreador={modoCreador}
      />

      {mostrarModal && (
        <PasswordModal
          onSubmit={verificarPassword}
          onClose={cerrarModalPassword}
          error={error}
        />
      )}

      {mostrarFormulario && (
        <ProductForm
          onSubmit={agregarProducto}
          onClose={cerrarFormulario}
          productoEditar={productoEditando || undefined}
          onUpdate={editarProducto}
        />
      )}
    </div>
  );
};

export default Index;


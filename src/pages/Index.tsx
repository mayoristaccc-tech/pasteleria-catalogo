import { useState } from "react";
import { Plus, LogOut, Info, User } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import EmptyState from "../components/EmptyState";
import AboutUsModal from "../components/AboutUsModal";
import WhatsAppButton from "../components/WhatsAppButton";
import LoginModal from "../components/LoginModal";

import { Button } from "../components/ui/button";

import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { useAboutUs } from "../hooks/useAboutUs";
import { useSiteConfig } from "../hooks/useSiteConfig";

import { Product } from "../types/product";

const Index = () => {
  const {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  } = useProducts();

  const { isAuthenticated, login, logout } = useAuth();

  const { aboutText, guardarAboutText } = useAboutUs();

  const {
    logoUrl,
    coverUrl,
    logoPosition,
    actualizarLogo,
    actualizarLogoPosition,
    resetearLogoPosition,
    actualizarCover,
  } = useSiteConfig();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Product | null>(null);
  const [mostrarAboutUs, setMostrarAboutUs] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);

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
      {isAuthenticated && (
        <div className="sticky top-0 z-40 bg-accent/90 px-4 py-2 text-center shadow-soft backdrop-blur-sm">
          <div className="container flex items-center justify-center gap-2">
            <User className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">
              Administrador conectado
            </span>
          </div>
        </div>
      )}

      <Header
        modoCreador={isAuthenticated}
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
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setMostrarAboutUs(true)}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              Sobre Nosotros
            </Button>

            {isAuthenticated ? (
              <>
                <Button onClick={abrirFormularioNuevo} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Producto
                </Button>

                <Button variant="outline" onClick={logout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setMostrarLogin(true)}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Iniciar Sesión
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto, index) => (
              <div
                key={producto.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  producto={producto}
                  modoCreador={isAuthenticated}
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
        modoCreador={isAuthenticated}
      />

      {mostrarLogin && (
        <LoginModal
          onLogin={login}
          onClose={() => setMostrarLogin(false)}
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

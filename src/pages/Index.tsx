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
import { useAuthContext } from "../context/AuthContext";
import { useAboutUs } from "../hooks/useAboutUs";
import { useSiteConfig } from "../hooks/useSiteConfig";

import { Product } from "../types/product";

const Index = () => {

  const { isAuthenticated, logout, loading: authLoading } = useAuthContext();

  const {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  } = useProducts();

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"desc" | "asc">("desc");

  const productosFiltrados = productos
    .filter((producto) => {
      const texto = `${producto.nombre} ${producto.descripcion}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    })
    .sort((a, b) => {
      const fechaA = new Date(a.creado_en || "").getTime();
      const fechaB = new Date(b.creado_en || "").getTime();

      return orden === "desc" ? fechaB - fechaA : fechaA - fechaB;
    });

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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

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
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">

          <h2 className="font-display text-2xl font-semibold text-foreground">
            Nuestros Productos
          </h2>

          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-64"
          />

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as "asc" | "desc")}
            className="border rounded-lg px-3 py-2 w-full md:w-48"
          >
            <option value="desc">Más recientes primero</option>
            <option value="asc">Más antiguos primero</option>
          </select>

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
                <Button onClick={() => setMostrarFormulario(true)} className="gap-2">
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
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                modoCreador={isAuthenticated}
                onEdit={() => setProductoEditando(producto)}
                onDelete={eliminarProducto}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />

      {/* MODALES */}
      {mostrarLogin && (
        <LoginModal
          onClose={() => setMostrarLogin(false)}
        />
      )}

      {mostrarFormulario && (
        <ProductForm
          onSubmit={agregarProducto}
          onClose={() => setMostrarFormulario(false)}
          productoEditar={productoEditando || undefined}
          onUpdate={editarProducto}
        />
      )}

      <AboutUsModal
        isOpen={mostrarAboutUs}
        onClose={() => setMostrarAboutUs(false)}
        aboutText={aboutText}
        onSave={guardarAboutText}
        modoCreador={isAuthenticated}
      />

    </div>
  );
};

export default Index;

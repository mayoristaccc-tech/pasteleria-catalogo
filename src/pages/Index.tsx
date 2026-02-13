import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import LoginModal from "@/components/LoginModal";

const Index = () => {
  const { isAuthenticated, logout, loading: authLoading } =
    useAuthContext();

  const {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    eliminarImagenProducto,
  } = useProducts();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] =
    useState<Product | null>(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Product | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"desc" | "asc">("desc");

  const productosFiltrados = productos
    .filter((producto) => {
      const texto =
        `${producto.nombre ?? ""} ${producto.descripcion ?? ""}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    })
    .sort((a, b) => {
      const fechaA = new Date(a.creado_en || "").getTime();
      const fechaB = new Date(b.creado_en || "").getTime();
      return orden === "desc" ? fechaB - fechaA : fechaA - fechaB;
    });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold">Nuestros Productos</h2>

        <div className="flex flex-wrap items-center gap-3">

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="rounded-lg border px-3 py-2"
          />

          {/* Orden */}
          <select
            value={orden}
            onChange={(e) =>
              setOrden(e.target.value as "asc" | "desc")
            }
            className="rounded-lg border px-3 py-2"
          >
            <option value="desc">Más nuevos</option>
            <option value="asc">Más antiguos</option>
          </select>

          {/* Siempre visible */}
          <button
            onClick={() => (window.location.href = "/sobre-nosotros")}
            className="rounded-lg border px-4 py-2"
          >
            Sobre Nosotros
          </button>

          {/* Admin si NO autenticado */}
          {!isAuthenticated && (
            <button
              onClick={() => setMostrarLogin(true)}
              className="rounded-lg border px-4 py-2"
            >
              Admin
            </button>
          )}

          {/* Botones si autenticado */}
          {isAuthenticated && (
            <>
              <button
                onClick={() => {
                  setProductoEditando(null);
                  setMostrarFormulario(true);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-white"
              >
                + Nuevo
              </button>

              <button
                onClick={logout}
                className="rounded-lg bg-destructive px-4 py-2 text-white"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal Login */}
      {mostrarLogin && (
        <LoginModal onClose={() => setMostrarLogin(false)} />
      )}

      {/* Formulario producto */}
      {mostrarFormulario && (
        <ProductForm
          onSubmit={agregarProducto}
          onUpdate={editarProducto}
          productoEditar={productoEditando || undefined}
          onClose={() => setMostrarFormulario(false)}
        />
      )}

      {/* Modal flotante del producto */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-xl relative">

            <button
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm shadow"
            >
              ✕
            </button>

            {productoSeleccionado.imagen_url && (
              <img
                src={productoSeleccionado.imagen_url}
                alt={productoSeleccionado.nombre}
                className="w-full h-80 object-cover"
              />
            )}

            <div className="p-6">
              <h3 className="text-2xl font-semibold">
                {productoSeleccionado.nombre}
              </h3>

              {productoSeleccionado.descripcion && (
                <p className="mt-3 text-gray-600 whitespace-pre-line">
                  {productoSeleccionado.descripcion}
                </p>
              )}

              <button
                onClick={() => {
                  const mensaje = encodeURIComponent(
                    `Hola! Quiero comprar este producto:\n\n🧁 ${productoSeleccionado.nombre}\n${productoSeleccionado.descripcion ?? ""}`
                  );

                  window.open(
                    `https://api.whatsapp.com/send?phone=541153790146&text=${mensaje}`,
                    "_blank"
                  );
                }}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Quiero comprar este producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Productos */}
      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              modoCreador={isAuthenticated}
              onEdit={(producto) => {
                setProductoEditando(producto);
                setMostrarFormulario(true);
              }}
              onDelete={eliminarProducto}
              onDeleteImage={eliminarImagenProducto}
              onClickImage={(producto) =>
                setProductoSeleccionado(producto)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;

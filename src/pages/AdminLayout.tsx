import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen">
      <nav className="p-4 bg-gray-100 flex gap-4">
        <Link to="/admin">Productos</Link>
        <Link to="/admin/usuarios">Usuarios</Link>
        <Link to="/">Volver al sitio</Link>
      </nav>

      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

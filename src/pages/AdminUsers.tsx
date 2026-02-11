import { useState } from "react";
import { useAdmins } from "../hooks/useAdmins";
import { useAuthContext } from "../context/AuthContext";
import CreateAdminModal from "../components/CreateAdminModal";
import { Button } from "../components/ui/button";

const AdminUsers = () => {
  const { admins, loading, eliminarAdmin, cargarAdmins } = useAdmins();
  const { role } = useAuthContext();

  const [mostrarModal, setMostrarModal] = useState(false);

  if (loading) {
    return <div>Cargando administradores...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Administradores</h1>

      {role === "superadmin" && (
        <Button onClick={() => setMostrarModal(true)} className="mb-4">
          Crear nuevo administrador
        </Button>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Rol</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td className="p-2 border">{admin.email}</td>
              <td className="p-2 border">{admin.role}</td>

              <td className="p-2 border">
                {role === "superadmin" && (
                  <Button
                    variant="outline"
                    onClick={() => eliminarAdmin(admin.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <CreateAdminModal
          onClose={() => setMostrarModal(false)}
          onCreated={cargarAdmins}
        />
      )}
    </div>
  );
};

export default AdminUsers;

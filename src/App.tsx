import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";

import AdminLayout from "./pages/AdminLayout";
import AdminUsers from "./pages/AdminUsers";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>

      <AuthProvider>

        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Rutas admin */}
            <Route
            path="/admin"
          element={
          <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route
    path="usuarios"
    element={<AdminUsers />}
  />
</Route>


            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>

      </AuthProvider>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

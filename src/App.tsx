import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import AdminLayout from "@/pages/AdminLayout";
import AdminUsers from "@/pages/AdminUsers";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import SobreNosotros from "@/pages/SobreNosotros";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* Rutas públicas con Layout */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Index />
                </MainLayout>
              }
            />
            <Route
              path="/sobre-nosotros"
              element={
                <MainLayout>
                <SobreNosotros />
                </MainLayout>
              }
            />

            <Route
              path="/producto/:id"
              element={
                <MainLayout>
                  <Index />
                </MainLayout>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <MainLayout>
                  <ForgotPassword />
                </MainLayout>
              }
            />

            <Route
              path="/reset-password"
              element={
                <MainLayout>
                  <ResetPassword />
                </MainLayout>
              }
            />

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

            {/* 404 */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <NotFound />
                </MainLayout>
              }
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import "./global.css";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { SettingsProvider } from "./contexts/SettingsContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import MenuProducts from "./pages/MenuProducts";
import GalleryPage from "./pages/GalleryPage";
import OffersPage from "./pages/OffersPage";
import ContactPage from "./pages/ContactPage";
import OurStoryPage from "./pages/OurStoryPage";
import LoginSignin from "./pages/Login&Signin";
import AdminLoginSignin from "./pages/Adminlogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Keep-alive ping to prevent Render backend from sleeping
  useEffect(() => {
    const BACKEND_URL = "https://cafes-20-main-6.onrender.com";
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

    const pingBackend = async () => {
      try {
        await fetch(`${BACKEND_URL}/api/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("[Keep-Alive] Backend pinged successfully");
      } catch (error) {
        console.warn("[Keep-Alive] Failed to ping backend:", error);
      }
    };

    // Ping immediately on mount
    pingBackend();

    // Set up interval for periodic pings
    const intervalId = window.setInterval(pingBackend, PING_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      window.clearInterval(intervalId);
      console.log("[Keep-Alive] Cleanup completed");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SettingsProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Routes>
              {/* PUBLIC WEBSITE ROUTES */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Index />} />
                <Route path="menu" element={<Menu />} />
                <Route path="menu-products" element={<MenuProducts />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="offers" element={<OffersPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="our-story" element={<OurStoryPage />} />
              </Route>

              {/* USER AUTH ROUTES */}
              <Route path="/login" element={<LoginSignin />} />

              {/* ADMIN ROUTES */}
              <Route path="/admin/login" element={<AdminLoginSignin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

import "./global.css";

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

const App = () => (
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

export default App;

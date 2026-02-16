import { useLocation, Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
 
export function MainLayout() {
  const location = useLocation();

  // Hide navbar on /menu route
  const shouldShowNavbar = location.pathname !== "/menu";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

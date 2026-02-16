# React Router v6 - Complete Fix Guide

## ✅ What Was Fixed

### Issue: `/admin/login` returning 404

**Root Cause**: Route was defined as `/admin` but accessed as `/admin/login`

**Solution**: Changed route from `/admin` to `/admin/login`

---

## 🗺️ Current Route Structure

```
/                       → Index (Home page)
/menu                   → Menu page
/auth                   → User Login/Signin
/admin/login            → Admin Login ✅ FIXED
/admin/dashboard        → Admin Dashboard
/*                      → 404 Not Found
```

---

## 📝 Fixed App.tsx

```tsx
<BrowserRouter>
  <Routes>
    {/* Auth pages - standalone without MainLayout */}
    <Route path="/auth" element={<LoginSignin />} />
    <Route path="/admin/login" element={<AdminLoginSignin />} />
    
    {/* Admin Dashboard - standalone without MainLayout */}
    <Route path="/admin/dashboard" element={<AdminDashboard />} />

    {/* Main pages */}
    <Route path="/" element={<Index />} />
    <Route path="/menu" element={<Menu />} />
    
    {/* 404 - Must be last */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

---

## 🎯 Better Approach: Nested Routes with Layouts

### Option 1: Using Outlet (Recommended)

Create a proper layout structure:

```tsx
// App.tsx
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<MainLayout><Outlet /></MainLayout>}>
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<Menu />} />
      </Route>

      {/* Auth routes - no layout */}
      <Route path="/auth" element={<LoginSignin />} />
      <Route path="/admin/login" element={<AdminLoginSignin />} />

      {/* Admin routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="menu" element={<AdminMenu />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
```

### Option 2: Protected Routes

```tsx
// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { apiService } from "@/services/api";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!apiService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// App.tsx
<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🏗️ Layout Components

### MainLayout (Already exists)

```tsx
// components/layout/MainLayout.tsx
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

### AdminLayout (Create this)

```tsx
// components/layout/AdminLayout.tsx
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Settings, Menu } from "lucide-react";
import { apiService } from "@/services/api";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    apiService.logout(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>
        
        <nav className="space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-accent">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/admin/menu" className="flex items-center gap-2 p-2 rounded hover:bg-accent">
            <Menu className="w-4 h-4" />
            Menu Management
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-2 p-2 rounded hover:bg-accent">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="absolute bottom-4 left-4 right-4 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
```

---

## 🔒 Protected Routes Implementation

### Create ProtectedRoute Component

```tsx
// components/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      if (requireAdmin) {
        navigate('/admin/login', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }
  }, [navigate, requireAdmin]);

  if (!apiService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};
```

### Usage in App.tsx

```tsx
import { ProtectedRoute } from "./components/ProtectedRoute";

<Route path="/admin/dashboard" element={
  <ProtectedRoute requireAdmin>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🧪 Testing Routes

### Test in Browser Console

```javascript
// Navigate programmatically
window.location.href = '/admin/login';

// Or using React Router
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/admin/login');
```

### Test All Routes

```
✅ http://localhost:8080/                → Home
✅ http://localhost:8080/menu            → Menu
✅ http://localhost:8080/auth            → User Login
✅ http://localhost:8080/admin/login     → Admin Login (FIXED)
✅ http://localhost:8080/admin/dashboard → Admin Dashboard
❌ http://localhost:8080/invalid         → 404 Not Found
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Nested Routes Not Working

**Problem**: Routes inside `<MainLayout>` not rendering

**Solution**: Use `<Outlet />` instead of
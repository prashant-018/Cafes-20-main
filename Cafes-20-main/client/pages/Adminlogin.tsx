import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft, User, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

export default function AdminLoginSignin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    secretKey: ""
  });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const data = await apiService.adminLogin(adminData.email, adminData.password);

      if (data.success) {
        // Store JWT token and admin data in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('admin', JSON.stringify(data.admin));

        setMessage({ type: 'success', text: 'Admin login successful! Redirecting...' });

        // Redirect to admin dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid credentials' });
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="flex flex-col items-center text-center pb-6 pt-8">
            {/* Logo and Brand Header */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                <img
                  src="/the himalya image.jpg"
                  alt="The Himalayan Pizza Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-serif text-2xl font-bold text-white">
                  The Himalayan <span className="text-primary">Pizza</span>
                </span>
              </div>
            </div>

            <CardTitle className="text-3xl font-serif font-bold text-white mb-2">
              Admin Login
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Authorized access only
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Success/Error Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4" autoComplete="off">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-white">Email / Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    name="admin-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={adminData.email}
                    onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-secondary/20 border-white/10 text-white placeholder:text-muted-foreground"
                    autoComplete="new-email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    name="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={adminData.password}
                    onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 bg-secondary/20 border-white/10 text-white placeholder:text-muted-foreground"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-secret" className="text-white flex items-center gap-2">
                  Security Key
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-secret"
                    type={showSecretKey ? "text" : "password"}
                    placeholder="Enter security key"
                    value={adminData.secretKey}
                    onChange={(e) => setAdminData(prev => ({ ...prev, secretKey: e.target.value }))}
                    className="pl-10 pr-10 bg-secondary/20 border-white/10 text-white placeholder:text-muted-foreground"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                Not an admin?
              </p>
              <Link
                to="/login"
                className="text-sm text-white/70 hover:text-primary transition-colors flex items-center justify-center gap-2 font-medium group"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Login as User
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
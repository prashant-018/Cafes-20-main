import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";

export default function LoginSignin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [signupData, setSignupData] = useState({
    name: "", // Changed from fullName to name to match backend
    email: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const data = await apiService.userLogin(loginData.email, loginData.password);

      if (data.success) {
        // Store JWT token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });

        // Redirect after success
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const data = await apiService.register(
        signupData.name,
        signupData.email,
        signupData.password
      );

      if (data.success) {
        // Store JWT token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        setMessage({ type: 'success', text: 'Account created successfully! Welcome!' });

        // Redirect after success
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        // Handle validation errors or other errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          setMessage({ type: 'error', text: errorMessages });
        } else {
          setMessage({ type: 'error', text: data.message || 'Registration failed' });
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Sign in to your account or create a new one
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

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/20">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 bg-secondary/20 border-white/10 text-white placeholder:text-muted-foreground"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 bg-secondary/20 border-white/10 text-white placeholder:text-muted-foreground"
                        autoComplete="current-password"
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

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center">
                  <button className="text-sm text-primary hover:underline">
                    Forgot your password?
                  </button>
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        value={signupData.name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10 bg-secondary/20 border-white/10 text-white placeholder:text-muted-foreground"
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 bg-secondary/20 border-white/10 text-white placeholder:text-muted-foreground"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
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

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </div>
              </TabsContent>
            </Tabs>

            {/* Admin Login Access */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                Are you an admin?
              </p>
              <Link
                to="/admin/login"
                className="text-sm text-white/70 hover:text-primary transition-colors flex items-center justify-center gap-2 font-medium group"
              >
                <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Login as Admin
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
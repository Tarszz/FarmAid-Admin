
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      // Check if we should use Firebase auth or mock auth
      if (email.includes('admin@farmaid')) {
        // Use Firebase auth
        await login(email, password);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        // Mock authentication for demo
        // For demo purposes: if email contains "admin", login succeeds
        setTimeout(() => {
          if (email.includes('admin')) {
            toast.success('Login successful!');
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/dashboard');
          } else {
            toast.error('Invalid credentials. Try using an email with "admin" in it.');
          }
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      setIsLoading(false);
      // Error is already handled in the login function
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-green-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 text-white text-center">
            <h1 className="text-3xl font-bold mb-1">FarmAid</h1>
            <p className="text-green-100">City Agriculture Office Admin</p>
          </div>
          
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Admin Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </span>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Demo credentials:</p>
                <p>Email: admin@farmaid.gov</p>
                <p>Password: any password</p>
              </div>
            </form>
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-sm mt-6">
          © {new Date().getFullYear()} FarmAid - City Agriculture Office
        </p>
      </div>
    </div>
  );
};

export default Login;

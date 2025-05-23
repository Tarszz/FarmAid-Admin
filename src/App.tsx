
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminSidebar from "./components/AdminSidebar";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import Donations from "./pages/Donations";
import Deliveries from "./pages/Deliveries";
import Approvals from "./pages/Approvals";
import Notifications from "./pages/Notifications";
import Complaints from "./pages/Complaints";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Broadcasts from "./pages/Broadcasts";
import Collaborations from "./pages/Collaborations";

const queryClient = new QueryClient();

// Admin layout component with authentication check
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-background dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-admin-primary mb-4 animate-float dark:text-admin-secondary">
            Farm<span className="text-admin-secondary dark:text-white">Aid</span>
          </h1>
          <p className="text-xl text-admin-textSecondary animate-pulse dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-admin-background dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin dashboard routes */}
            <Route path="/dashboard" element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            } />
            <Route path="/analytics" element={
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            } />
            <Route path="/users" element={
              <AdminLayout>
                <Users />
              </AdminLayout>
            } />
            <Route path="/transactions" element={
              <AdminLayout>
                <Transactions />
              </AdminLayout>
            } />
            <Route path="/donations" element={
              <AdminLayout>
                <Donations />
              </AdminLayout>
            } />
            <Route path="/deliveries" element={
              <AdminLayout>
                <Deliveries />
              </AdminLayout>
            } />
            <Route path="/approvals" element={
              <AdminLayout>
                <Approvals />
              </AdminLayout>
            } />
            <Route path="/notifications" element={
              <AdminLayout>
                <Notifications />
              </AdminLayout>
            } />
            <Route path="/complaints" element={
              <AdminLayout>
                <Complaints />
              </AdminLayout>
            } />
            <Route path="/settings" element={
              <AdminLayout>
                <Settings />
              </AdminLayout>
            } />
            <Route path="/reports" element={
              <AdminLayout>
                <Reports />
              </AdminLayout>
            } />
            <Route path="/broadcasts" element={
              <AdminLayout>
                <Broadcasts />
              </AdminLayout>
            } />
            <Route path="/collaborations" element={
              <AdminLayout>
                <Collaborations />
              </AdminLayout>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

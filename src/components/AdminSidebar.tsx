import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  Users,
  ShoppingCart,
  FileCheck,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  HandHeart,
  Truck,
  Radio,
  Users2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

type SidebarItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sidebarSections: SidebarSection[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: Home },
      { title: 'Analytics', path: '/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Management',
    items: [
      { title: 'Users', path: '/users', icon: Users },
      { title: 'Transactions', path: '/transactions', icon: ShoppingCart },
      { title: 'Donations', path: '/donations', icon: HandHeart },
      { title: 'Deliveries', path: '/deliveries', icon: Truck },
      { title: 'Approvals', path: '/approvals', icon: FileCheck },
    ]
  },
  {
    title: 'Communication',
    items: [
      { title: 'Notifications', path: '/notifications', icon: Bell },
      { title: 'Broadcasts', path: '/broadcasts', icon: Radio },
      { title: 'Messages', path: '/complaints', icon: MessageSquare },
      { title: 'Collaborations', path: '/collaborations', icon: Users2 },
    ]
  },
  {
    title: 'System',
    items: [
      { title: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <aside className="h-screen w-[280px] bg-admin-primary flex flex-col border-r border-admin-primary/20 shadow-lg">
      <div className="flex items-center justify-start p-4 border-b border-sidebar-border">
        <h1 className="text-white font-semibold text-xl ml-2">
          Farm<span className="text-admin-secondary">Aid</span>
        </h1>
      </div>

  <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
        {sidebarSections.map((section, idx) => (
          <div key={idx} className="mb-6 px-4">
            <h2 className="text-admin-secondary text-xs font-semibold uppercase tracking-wider mb-3 pl-2">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center py-2 px-3 rounded-md transition-all group relative',
                      isActive
                        ? 'bg-admin-secondary text-white'
                        : 'text-white/70 hover:text-white hover:bg-sidebar-accent'
                    )}
                  >
                    <Icon size={20} className="mr-3 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-medium">{item.title}</span>

                    {item.badge && (
                      <span className={cn(
                        'ml-auto flex items-center justify-center text-xs font-bold rounded-full w-5 h-5 transition-all',
                        isActive
                          ? 'bg-white text-admin-secondary'
                          : 'bg-admin-secondary text-white'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center w-full py-2 px-3 rounded-md text-white/70 hover:text-white hover:bg-sidebar-accent transition-all"
        >
          <LogOut size={20} className="mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

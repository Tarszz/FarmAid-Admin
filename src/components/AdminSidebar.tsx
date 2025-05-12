
import React, { useState } from 'react';
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
  ChevronLeft, 
  ChevronRight, 
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
      { title: 'Users', path: '/users', icon: Users, badge: 5 },
      { title: 'Transactions', path: '/transactions', icon: ShoppingCart },
      { title: 'Donations', path: '/donations', icon: HandHeart },
      { title: 'Deliveries', path: '/deliveries', icon: Truck },
      { title: 'Approvals', path: '/approvals', icon: FileCheck, badge: 12 },
    ]
  },
  {
    title: 'Communication',
    items: [
      { title: 'Notifications', path: '/notifications', icon: Bell },
      { title: 'Broadcasts', path: '/broadcasts', icon: Radio, badge: 2 },
      { title: 'Complaints', path: '/complaints', icon: MessageSquare, badge: 3 },
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
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  
  // Get from localStorage or default to light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode === 'true';
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    // Apply dark mode class to document
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: newMode ? "Dark mode enabled" : "Light mode enabled",
      description: newMode ? "You've switched to dark mode" : "You've switched to light mode",
    });
  };

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

  // Apply dark mode on component mount
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <aside 
      className={cn(
        'h-screen bg-admin-primary flex flex-col transition-all duration-300 ease-in-out border-r border-admin-primary/20 shadow-lg',
        collapsed ? 'w-[80px]' : 'w-[280px]'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn('flex items-center', collapsed ? 'justify-center w-full' : '')}>
          {!collapsed && (
            <h1 className="text-white font-semibold text-xl ml-2">
              Farm<span className="text-admin-secondary">Aid</span>
            </h1>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-full bg-admin-secondary flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-2 rounded-full hover:bg-sidebar-accent text-white transition-colors duration-200"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {sidebarSections.map((section, idx) => (
          <div key={idx} className="mb-6 px-4">
            {!collapsed && (
              <h2 className="text-admin-secondary text-xs font-semibold uppercase tracking-wider mb-3 pl-2">
                {section.title}
              </h2>
            )}
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
                    <Icon 
                      size={20} 
                      className={cn(
                        "transition-transform", 
                        collapsed ? 'mx-auto' : 'mr-3', 
                        isActive ? '' : 'group-hover:scale-110'
                      )} 
                    />
                    
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                    
                    {item.badge && (
                      <span className={cn(
                        'ml-auto flex items-center justify-center text-xs font-bold rounded-full w-5 h-5 transition-all',
                        isActive 
                          ? 'bg-white text-admin-secondary' 
                          : 'bg-admin-secondary text-white',
                        collapsed ? 'absolute -right-1 -top-1' : ''
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
          onClick={toggleDarkMode}
          className={cn(
            "flex items-center w-full py-2 px-3 rounded-md text-white/70 hover:text-white hover:bg-sidebar-accent transition-all mb-2",
            collapsed ? 'justify-center' : ''
          )}
        >
          <svg 
            viewBox="0 0 24 24" 
            className={cn(
              "w-5 h-5 transition-transform", 
              collapsed ? 'mx-auto' : 'mr-3'
            )}
            stroke="currentColor" 
            fill="none" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {isDarkMode ? (
              // Sun icon
              <>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </>
            ) : (
              // Moon icon
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            )}
          </svg>
          {!collapsed && (
            <span className="text-sm font-medium">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
        
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full py-2 px-3 rounded-md text-white/70 hover:text-white hover:bg-sidebar-accent transition-all",
            collapsed ? 'justify-center' : ''
          )}
        >
          <LogOut size={20} className={cn(collapsed ? 'mx-auto' : 'mr-3')} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

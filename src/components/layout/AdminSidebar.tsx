import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, GlassCard } from '../ui';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Sparkles,
  X,
  Link
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Invoices',
      href: '/admin/invoices',
      icon: FileText,
    },
    {
      name: 'Menu Links',
      href: '/admin/menu-links',
      icon: Link,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    onClose();
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <GlassCard variant="strong" className="h-full rounded-none lg:rounded-r-3xl flex flex-col bg-white/80 backdrop-blur-md border border-gray-200/50">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="font-bold font-heading text-black">
                    BOLA LOGOS
                  </h2>
                  <p className="text-xs text-gray-600">Admin Panel</p>
                </div>
              </div>

              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden p-2 text-black hover:bg-black hover:text-white"
              >
                <X size={20} />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-black/10 text-black border-l-4 border-black'
                            : 'text-gray-700 hover:bg-black/5 hover:text-black'
                        }`
                      }
                    >
                      <Icon size={20} />
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-6 border-t border-gray-200">
            {/* User info */}
            <div className="mb-4 p-3 bg-black/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-black">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-gray-700 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              Sign Out
            </Button>
          </div>
        </GlassCard>
      </div>
    </>
  );
};

export default AdminSidebar;
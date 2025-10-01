import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';
import { Button, Squares } from '../ui';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Animated Grid Background - covers entire admin area */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(0, 0, 0, 0.025)"
          squareSize={40}
          hoverFillColor="rgba(0, 0, 0, 0.015)"
        />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen relative z-10">
        {/* Mobile header */}
        <div className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-black hover:bg-black hover:text-white"
              >
                <Menu size={20} />
                <span className="sr-only">Open sidebar</span>
              </Button>
              <h1 className="text-lg font-semibold font-heading text-black">
                BOLA LOGOS Admin
              </h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 lg:p-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                © 2025 BOLA LOGOS. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                Inspiring Visual Storytelling
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
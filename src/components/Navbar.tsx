import React, { useState } from 'react';
import { Target, Menu, X, LogOut } from 'lucide-react';
import { Link, To, useLocation } from 'react-router-dom';

export default function Navbar({ onLogout, items }) {
  const userName = localStorage.getItem('userName') || 'Usuario';
  const email = localStorage.getItem('email') || 'usuario@example.com';
  const IdUser = localStorage.getItem('IdUser') || '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Obtén la ubicación actual
  const location = useLocation();

  return (
    <nav className="bg-white/70 backdrop-blur-md rounded-xl fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-[95%] md:max-w-[95%] z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Left - Brand */}
          <div className="flex items-center">
            <Target className="w-6 h-6 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">TaskMaster</span>
          </div>

          {/* Center - Navigation (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-4">
              {items.map((item: { icon: any; path: To; id: React.Key | null | undefined; label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => {
                const Icon = item.icon;
                
                // Determina si este item está activo comparando la ruta actual
                const isActive = location.pathname === item.path;

                return (
                  <Link 
                    to={item.path}
                    replace
                    key={item.id}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="ml-2 font-medium">{item.label}</span>
                  </Link>
                );
              })}
              {/* Logout button for Desktop */}
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 transition-colors "
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="ml-2 font-medium text-red-600">Salir</span>
              </button>
            </div>
          </div>

          {/* Right - Profile */}
          <div className="flex items-center">
            {/* Desktop - Profile */}
            <div className="hidden md:flex items-center">
              <span className="ml-2 font-medium text-gray-700">Hola! {userName}</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden ml-2 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {items.map((item: { icon: any; path: To; id: React.Key | null | undefined; label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    to={item.path}
                    key={item.id}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Salir</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

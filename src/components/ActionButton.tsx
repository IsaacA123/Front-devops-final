import React, { useState, useEffect, useRef } from 'react';
import { Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FloatingActionButtonProps {
  activeView: string;
}

export default function ActionButton({children}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {children}
          <button
          onClick ={ () => navigate('/settings')}
          className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50"
        >
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="ml-3 mr-10 text-gray-700">Configuración</span>
        </button>
        </div>
      )}
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

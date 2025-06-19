import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, Heart, Disc3 } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Music },
    { name: 'Albums', href: '/albums', icon: Disc3 },
    { name: 'Lyrics', href: '/lyrics', icon: Heart },
    { name: 'Ilse DeLange', href: '/artist/ilse-delange', icon: null },
    { name: 'The Common Linnets', href: '/artist/the-common-linnets', icon: null },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Ilse DeLange Records
              </h1>
              <p className="text-sm text-slate-600">Official Discography</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors font-medium group"
                >
                  {Icon && <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


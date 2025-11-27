import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/images/maferme237_logo.png'; // remplace par ton chemin réel

export default function MainLayout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/precommandes' },
    { name: 'Souhaits', path: '/souhaits' },
    { name: 'Connexion', path: '/connexion' },
    { name: 'Inscription', path: '/inscription' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="bg-green-800 text-yellowGeneral shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="maferme237" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 text-base font-medium">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`hover:pb-1 hover:border-b-2 hover:border-yellowGeneral ${
                  location.pathname === item.path ? 'pb-1 border-b-2 border-yellowGeneral' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-yellow-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Overlay noir */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Mobile Slider Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-green-900 text-yellowGeneral transform transition-transform duration-300 z-50 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b border-green-700">
            <img src={logo} alt="maferme237" className="h-8" />
            <button onClick={() => setMenuOpen(false)} className="text-yellow-300 text-xl">
              ✕
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`hover:pb-1 hover:border-b-2 hover:border-yellowGeneral ${
                  location.pathname === item.path ? 'pb-1 border-b-2 border-yellowGeneral' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-greenFooter text-yellowGeneral mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <img src={logo} alt="maferme237" className="h-8" />
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link to="/contact" className="hover:text-yellow-300">Contact</Link>
            <Link to="/faq" className="hover:text-yellow-300">FAQ</Link>
          </div>
        </div>
        <div className="text-center text-xs text-gray-300 py-2">
          © 2025, maferme237. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

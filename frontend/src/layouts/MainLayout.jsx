import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/images/maferme237_logo.png'; // remplace par ton chemin réel

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/precommandes' },
    { name: 'Souhaits', path: '/souhaits' },
    { name: 'Connexion', path: '/auth/connexion' },
    { name: 'Inscription', path: '/auth/inscription' },
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
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const isLast = index === navItems.length - 1;

              if (isLast) {
                // Dernier élément → bouton
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)} // utilise useNavigate de react-router-dom
                    className={`px-4 py-2 rounded bg-yellowGeneral text-white font-semibold hover:bg-yellow-500 ${
                      isActive ? 'ring-2 ring-yellowGeneral' : ''
                    }`}
                  >
                    {item.name}
                  </button>
                );
              }

              // Les autres → Link
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`py-2 hover:pb-1 hover:border-b-2 hover:border-yellowGeneral ${
                    isActive ? 'border-b-2 border-yellowGeneral' : ''
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-yellowGeneral text-2xl"
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
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const isLast = index === navItems.length - 1;

              if (isLast) {
                // Dernier élément → bouton
                return (
                  <button
                    key={item.name}
                    onClick={() => {navigate(item.path);setMenuOpen(false);}} // utilise useNavigate de react-router-dom
                    className={`px-4 py-2 rounded bg-yellowGeneral text-white font-semibold hover:bg-yellow-500 ${
                      isActive ? 'ring-2 ring-yellowGeneral' : ''
                    }`}
                  >
                    {item.name}
                  </button>
                );
              }

              // Les autres → Link
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`py-2 hover:pb-1 hover:border-b-2 hover:border-yellowGeneral ${
                    isActive ? 'border-b-2 border-yellowGeneral' : ''
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
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

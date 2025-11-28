import { Outlet, Link } from "react-router-dom";
import logo from "../assets/images/maferme237_logo.png"; // remplace par ton chemin réel

export default function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="maferme237" className="h-10 w-auto" />
          </Link>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          {/* Outlet pour Connexion / Inscription */}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          © {new Date().getFullYear()} maferme237 — Tous droits réservés
        </div>
      </footer>
    </div>
  );
}

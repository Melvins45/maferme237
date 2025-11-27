import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ClientEntreprise from "./pages/ClientEntreprise";
import ClientParticulier from "./pages/ClientParticulier";
import Fournisseur from "./pages/Fournisseur";
import Gestion from "./pages/Gestion";
import Production from "./pages/Production";
import Investisseur from "./pages/Investisseur";

export default function AppRoutes() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="entreprises" element={<ClientEntreprise />} />
            <Route path="clients" element={<ClientParticulier />} />
            <Route path="fournisseur" element={<Fournisseur />} />
            <Route path="production" element={<Production />} />
          </Route>
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<Admin />} />
            <Route path="gestion" element={<Gestion />} />
            <Route path="investisseur" element={<Investisseur />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

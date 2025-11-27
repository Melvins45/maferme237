import React from "react";
import { Helmet } from "react-helmet-async";
import titlePrefix from "../utils/strings";

export default function Fournisseur() {
  return (
    <div>
          <Helmet>
            <title> {titlePrefix("Fournisseur")} </title>
          </Helmet>
      <h2>Bienvenue sur la page des fournisseurs</h2>
      <p>Ceci est ma première page avec React et un layout CSS 🎨</p>
    </div>
  );
}

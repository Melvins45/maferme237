import React from "react";
import { Helmet } from "react-helmet-async";
import titlePrefix from "../utils/strings";

export default function ClientParticulier() {
  return (
    <div>
          <Helmet>
            <title> {titlePrefix("Particulier")} </title>
          </Helmet>
      <h2>Bienvenue sur la page des clients particuliers</h2>
      <p>Ceci est ma première page avec React et un layout CSS 🎨</p>
    </div>
  );
}

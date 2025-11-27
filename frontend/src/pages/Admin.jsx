import React from "react";
import { Helmet } from "react-helmet-async";
import titlePrefix from "../utils/strings";

export default function Admin() {
  return (
    <div>
          <Helmet>
            <title> {titlePrefix("Admin")} </title>
          </Helmet>
      <h2>Bienvenue sur la page d'admin</h2>
      <p>Ceci est ma première page avec React et un layout CSS 🎨</p>
    </div>
  );
}

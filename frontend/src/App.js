import React from "react";
import AppRoutes from "./routes";
import { HelmetProvider } from "react-helmet-async";
//import About from "./pages/About";
//import Contact from "./pages/Contact";

// <Route path="about" element={<About />} />
// <Route path="contact" element={<Contact />} />

function App() {
  return (
    <HelmetProvider>
      <AppRoutes />
    </HelmetProvider>
  );
}

export default App;

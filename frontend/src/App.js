// src/App.js
import React from "react";
import { Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.js";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import { publicRoutes, privateRoutes } from "./routes/index.jsx";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Header />
        <Routes>
          {publicRoutes}
          {privateRoutes}
        </Routes>
        <Footer />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

// src/App.js
import React from "react";
import { Routes } from "react-router-dom";

import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";

import { publicRoutes, privateRoutes } from "./routes/index.jsx";

function App() {
  return (
    <ErrorBoundary>
      <Header />
      <Routes>
        {publicRoutes}
        {privateRoutes}
      </Routes>
      <Footer />
    </ErrorBoundary>
  );
}

export default App;

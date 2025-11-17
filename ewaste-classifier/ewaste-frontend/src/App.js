import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import ClassifierPage from "./pages/ClassifierPage";
import FacilityLocatorPage from "./pages/FacilityLocatorPage";
import CostEstimatorPage from "./pages/CostEstimatorPage";
import SlotSchedulingPage from "./pages/SlotSchedulingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/classifier" element={<ClassifierPage />} />
          <Route path="/facility-locator" element={<FacilityLocatorPage />} />
          <Route path="/cost-estimator" element={<CostEstimatorPage />} />
          <Route path="/slot-scheduling" element={<SlotSchedulingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

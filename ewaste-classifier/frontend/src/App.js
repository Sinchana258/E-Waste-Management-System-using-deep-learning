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

// ✅ NEW: import recycle pages
import LaptopRecyclePage from "./pages/recycle/LaptopRecyclePage";
import AccessoriesRecyclePage from "./pages/recycle/AccessoriesRecyclePage";
import RefrigeratorRecyclePage from "./pages/recycle/RefrigeratorRecyclePage";
import SmartphoneRecyclePage from "./pages/recycle/SmartphoneRecyclePage";
import TelevisionRecyclePage from "./pages/recycle/TelevisionRecyclePage";

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

          {/* ✅ NEW routes */}
          <Route path="/recycle/laptop" element={<LaptopRecyclePage />} />
          <Route path="/recycle/accessories" element={<AccessoriesRecyclePage />} />
          <Route path="/recycle/refrigerator" element={<RefrigeratorRecyclePage />} />
          <Route path="/recycle/smartphone" element={<SmartphoneRecyclePage />} />
          <Route path="/recycle/television" element={<TelevisionRecyclePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

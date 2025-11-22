// src/App.jsx
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastProvider } from "./context/ToastContext";


import LandingPage from "./pages/LandingPage";
import ClassifierPage from "./pages/ClassifierPage";
import FacilityLocatorPage from "./pages/FacilityLocatorPage";
import ValueEstimatorPage from "./pages/ValueEstimatorPage";
import SlotSchedulingPage from "./pages/SlotSchedulingPage";

//market place pages
import MarketplacePage from "./pages/Marketplace/MarketplacePage";
import ListingDetails from "./pages/Marketplace/ListingDetails";
import OrderSuccess from "./pages/Marketplace/OrderSuccess";
import CartPage from "./pages/Marketplace/CartPage";
import UserProfile from "./pages/Marketplace/UserProfile";
import OrderHistory from "./pages/Marketplace/OrderHistory";


import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";


import NotFoundPage from "./pages/NotFoundPage";
import Recycle from "./pages/recycle/Recycle";
import Education from "./education/Education";
import Blog from "./education/[id]/Blog";

// Recycle pages
import LaptopRecyclePage from "./pages/recycle/LaptopRecyclePage";
import AccessoriesRecyclePage from "./pages/recycle/AccessoriesRecyclePage";
import RefrigeratorRecyclePage from "./pages/recycle/RefrigeratorRecyclePage";
import SmartphoneRecyclePage from "./pages/recycle/SmartphoneRecyclePage";
import TelevisionRecyclePage from "./pages/recycle/TelevisionRecyclePage";

// Auth pages (match filenames you provided)
import SignIn from "./pages/AUTH/SignIn";
import SignUp from "./pages/AUTH/SignUp";

// Auth & protection
import ProtectedRoute from "./components/ProtectedRoute";



function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/classifier" element={<ClassifierPage />} />
            <Route path="/facility-locator" element={<FacilityLocatorPage />} />
            <Route path="/value-estimator" element={<ValueEstimatorPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/recycle" element={<Recycle />} />
            <Route path="/education" element={<Education />} />
            <Route path="/education/:id" element={<Blog />} />

            {/* Protected routes */}
            <Route
              path="/slot-scheduling"
              element={
                <ProtectedRoute>
                  <SlotSchedulingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <MarketplacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace/:id"
              element={
                <ProtectedRoute>
                  <ListingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* Recycle Pages */}
            <Route path="/recycle/laptop" element={<LaptopRecyclePage />} />
            <Route path="/recycle/accessories" element={<AccessoriesRecyclePage />} />
            <Route path="/recycle/refrigerator" element={<RefrigeratorRecyclePage />} />
            <Route path="/recycle/smartphone" element={<SmartphoneRecyclePage />} />
            <Route path="/recycle/television" element={<TelevisionRecyclePage />} />

            {/* Auth Pages */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;

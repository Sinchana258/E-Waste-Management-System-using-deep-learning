// src/pages/recycle/LaptopRecyclePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { facility } from "../../data/facility";

/**
 * Decorative logo (local uploaded asset). Developer note: tool will transform this path to a served URL.
 * Path provided in conversation: /mnt/data/31139e21-fece-4d9c-abef-f65c1c8bd0d0.png
 */
const LOGO_URL = "/mnt/data/31139e21-fece-4d9c-abef-f65c1c8bd0d0.png";

const LAPTOP_BRANDS = [
  {
    brand: "Dell",
    models: [
      "Dell XPS 13",
      "Dell Inspiron 14",
      "Dell G3",
      "Dell Latitude",
      "Dell Alienware M15",
    ],
  },
  {
    brand: "HP",
    models: [
      "HP Spectre x360",
      "HP Pavilion",
      "HP Omen",
      "HP Elite Dragonfly",
      "HP Envy",
    ],
  },
  {
    brand: "Lenovo",
    models: [
      "Lenovo ThinkPad X1 Carbon",
      "Lenovo Legion Y540",
      "Lenovo IdeaPad",
      "Lenovo Yoga",
      "Lenovo ThinkBook",
    ],
  },
  {
    brand: "Asus",
    models: [
      "Asus ROG Zephyrus G14",
      "Asus VivoBook",
      "Asus TUF Gaming",
      "Asus ZenBook",
      "Asus ROG Strix",
    ],
  },
  {
    brand: "Acer",
    models: [
      "Acer Predator Helios 300",
      "Acer Aspire",
      "Acer Swift",
      "Acer Nitro",
      "Acer Chromebook",
    ],
  },
  {
    brand: "Apple",
    models: ["MacBook Air", "MacBook Pro"],
  },
  {
    brand: "MSI",
    models: ["MSI GS65 Stealth", "MSI Prestige", "MSI Modern", "MSI Alpha"],
  },
  {
    brand: "Sony",
    models: ["Sony VAIO S", "Sony VAIO E"],
  },
  {
    brand: "LG",
    models: ["LG Gram"],
  },
];

// attempt to use a shared axiosInstance if available, otherwise fallback
let axiosInstance = axios;
try {
  // eslint-disable-next-line global-require
  const maybe = require("../../utils/axiosInstance");
  if (maybe && maybe.default) axiosInstance = maybe.default;
  else if (maybe) axiosInstance = maybe;
} catch {
  // fallback to axios
}

const LaptopRecyclePage = () => {
  const location = useLocation();
  const mountedRef = useRef(true);

  // Prefill brand from router state (e.g., SlotSchedulingPage -> navigate('/recycle/laptop', { state: { selectedBrand: 'Laptop' } }))
  const initialBrand = location?.state?.selectedBrand || "";

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [recycleItemPrice, setRecycleItemPrice] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [address, setAddress] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastBookingSummary, setLastBookingSummary] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (initialBrand) {
      const found = LAPTOP_BRANDS.find((b) => b.brand === initialBrand);
      setModels(found ? found.models : []);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [initialBrand]);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedFacility("");

    const found = LAPTOP_BRANDS.find((b) => b.brand === brand);
    setModels(found ? found.models : []);
  };

  const validateEmail = (str) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(str).toLowerCase());

  const validatePhone = (str) =>
    /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(String(str));

  const handleSubmit = async () => {
    const recycleItem = `${selectedBrand} ${selectedModel}`.trim();

    if (
      !recycleItem ||
      !selectedFacility ||
      !recycleItemPrice ||
      !pickupDate ||
      !pickupTime ||
      !fullName ||
      !email ||
      !phone ||
      !address
    ) {
      toast.error("Please fill in all required fields.", { autoClose: 3000 });
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.", { autoClose: 3000 });
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Please enter a valid phone number (10 digits).", {
        autoClose: 3000,
      });
      return;
    }

    const storedUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();
    const userId = storedUser?.id || "";

    const newBooking = {
      userId,
      userEmail: email,
      recycleItem,
      recycleItemPrice: Number(recycleItemPrice),
      pickupDate,
      pickupTime,
      facility: selectedFacility,
      fullName,
      address,
      phone,
    };

    try {
      setIsLoading(true);
      const resp = await axiosInstance.post(
        `${process.env.REACT_APP_API_BASE || "http://localhost:8000"}/api/v1/booking`,
        newBooking,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 15000,
        }
      );

      if (resp.status >= 200 && resp.status < 300) {
        const summary = {
          recycleItem,
          pickupDate,
          pickupTime,
          facility: selectedFacility,
          address,
          userEmail: email,
        };

        setLastBookingSummary(summary);
        setShowSuccessModal(true);

        toast.success("Booking confirmed! Confirmation email sent.", {
          autoClose: 3000,
        });

        // clear form
        setSelectedBrand("");
        setSelectedModel("");
        setSelectedFacility("");
        setRecycleItemPrice("");
        setPickupDate("");
        setPickupTime("");
        setAddress("");
        setFullName("");
        setEmail("");
        setPhone("");
        setModels([]);
      } else {
        console.error("Booking failed:", resp);
        toast.error("Error submitting booking. Try again.", { autoClose: 3000 });
      }
    } catch (err) {
      console.error("Submit error:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Network error. Please try again.";
      toast.error(msg, { autoClose: 4000 });
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="container mx-auto p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center gap-4 p-6 border-b">
          <div className="w-16 h-16 rounded-full bg-[#E2F0C9] p-2 flex items-center justify-center">
            <img
              src={LOGO_URL}
              alt="Ecycle logo"
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Laptop Recycling</h1>
            <p className="text-sm text-gray-600">
              Schedule pickup for your laptop — we'll handle safe recycling or resale.
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6" onSubmit={onSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              placeholder="Jane Doe"
              aria-required="true"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              placeholder="you@example.com"
              aria-required="true"
            />
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand <span className="text-red-500">*</span>
            </label>
            <select
              id="brand"
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              aria-required="true"
            >
              <option value="">Select brand</option>
              {LAPTOP_BRANDS.map((b) => (
                <option key={b.brand} value={b.brand}>
                  {b.brand}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Model <span className="text-red-500">*</span>
            </label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              aria-required="true"
              disabled={!models.length}
            >
              <option value="">{models.length ? "Select model" : "Choose brand first"}</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Approx value */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Approx value (₹) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              value={recycleItemPrice}
              onChange={(e) => setRecycleItemPrice(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              placeholder="e.g., 2500"
              aria-required="true"
            />
          </div>

          {/* Pickup Date */}
          <div>
            <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup date <span className="text-red-500">*</span>
            </label>
            <input
              id="pickupDate"
              name="pickupDate"
              type="date"
              min={currentDate}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              aria-required="true"
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup time <span className="text-red-500">*</span>
            </label>
            <input
              id="pickupTime"
              name="pickupTime"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              aria-required="true"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              placeholder="House no, street, area, city"
              aria-required="true"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              placeholder="+911234567890 or 1234567890"
              aria-required="true"
            />
          </div>

          {/* Facility */}
          <div>
            <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-1">
              Facility <span className="text-red-500">*</span>
            </label>
            <select
              id="facility"
              name="facility"
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
              aria-required="true"
            >
              <option value="">Select facility</option>
              {facility.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name} — {f.address}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full inline-flex items-center justify-center gap-3 rounded-md px-4 py-3 text-white font-medium transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#5a8807] hover:bg-[#86c418]"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5a8807]`}
              aria-disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Schedule Pickup"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success modal */}
      {showSuccessModal && lastBookingSummary && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-confirmation-title"
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>

              <h2 id="booking-confirmation-title" className="text-xl font-semibold text-gray-800">
                Booking Confirmed!
              </h2>

              <p className="text-sm text-gray-600 text-center">
                A confirmation email has been sent to{" "}
                <span className="font-medium">{lastBookingSummary.userEmail}</span>.
              </p>

              <div className="w-full bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Item</span>
                  <span className="text-gray-800">{lastBookingSummary.recycleItem}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Slot</span>
                  <span className="text-gray-800">
                    {lastBookingSummary.pickupDate} at {lastBookingSummary.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Facility</span>
                  <span className="text-gray-800">{lastBookingSummary.facility}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Pickup Address</span>
                  <p className="text-gray-800 text-right">{lastBookingSummary.address}</p>
                </div>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#5a8807] hover:bg-[#86c418] text-white font-semibold py-2.5 rounded-xl transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaptopRecyclePage;

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { facility } from "../../data/facility";

const LOGO_URL = "/mnt/data/31139e21-fece-4d9c-abef-f65c1c8bd0d0.png";
let axiosInstance = axios;
try {
  // eslint-disable-next-line global-require
  const maybe = require("../../utils/axiosInstance");
  if (maybe && maybe.default) axiosInstance = maybe.default;
  else if (maybe) axiosInstance = maybe;
} catch { }

const TelevisionPage = () => {
  const location = useLocation();
  const mountedRef = useRef(true);
  const initialBrand = location?.state?.selectedBrand || "";

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [recycleItemPrice, setRecycleItemPrice] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastBookingSummary, setLastBookingSummary] = useState(null);


  // populate default TV brands & models (use your full list from earlier)

  // Populate TV brands & models
  useEffect(() => {
    const televisionData = [
      {
        brand: "Samsung",
        models: [
          "Samsung QN90A Neo QLED 4K TV",
          "Samsung TU8000 Crystal UHD 4K TV",
          "Samsung Frame QLED 4K TV",
          "Samsung Q70T QLED 4K TV",
          "Samsung TU8500 Crystal UHD 4K TV",
        ],
      },
      {
        brand: "LG",
        models: [
          "LG C1 OLED 4K TV",
          "LG NanoCell 85 Series 4K TV",
          "LG GX OLED 4K TV",
          "LG UN7300 4K UHD TV",
          "LG B9 OLED 4K TV",
        ],
      },
      {
        brand: "Sony",
        models: [
          "Sony A80J OLED 4K TV",
          "Sony X90J Bravia XR 4K TV",
          "Sony X800H 4K UHD TV",
          "Sony A9G Master Series OLED 4K TV",
          "Sony X950H 4K UHD TV",
        ],
      },
      {
        brand: "TCL",
        models: [
          "TCL 6-Series 4K QLED TV",
          "TCL 5-Series 4K QLED TV",
          "TCL 4-Series 4K UHD TV",
          "TCL 8-Series QLED 4K TV",
          "TCL 3-Series HD LED Roku Smart TV",
        ],
      },
      {
        brand: "Vizio",
        models: [
          "Vizio P-Series Quantum X 4K TV",
          "Vizio M-Series Quantum 4K TV",
          "Vizio OLED 4K TV",
          "Vizio V-Series 4K UHD TV",
          "Vizio D-Series HD LED TV",
        ],
      },
      {
        brand: "Hisense",
        models: [
          "Hisense U8G Quantum Series 4K ULED TV",
          "Hisense H9G Quantum Series 4K ULED TV",
          "Hisense H8G Quantum Series 4K ULED TV",
          "Hisense H65G Series 4K UHD TV",
          "Hisense H4G Series HD LED Roku TV",
        ],
      },
      {
        brand: "Panasonic",
        models: [
          "Panasonic JX800 4K UHD TV",
          "Panasonic HX800 4K UHD TV",
          "Panasonic HZ2000 OLED 4K TV",
          "Panasonic GX800 4K UHD TV",
          "Panasonic FX800 4K UHD TV",
        ],
      },
    ];

    setBrands(televisionData);

    if (initialBrand) {
      const found = televisionData.find((b) => b.brand === initialBrand);
      setModels(found ? found.models : []);
    }

    return () => { mountedRef.current = false; };
  }, [initialBrand]);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedFacility("");
    const found = brands.find((b) => b.brand === brand);
    setModels(found ? found.models : []);
  };

  const validateEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).toLowerCase());
  const validatePhone = (s) => /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(String(s));
  const currentDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const recycleItem = `${selectedBrand} ${selectedModel}`.trim();
    if (!recycleItem || !selectedFacility || !recycleItemPrice || !pickupDate || !pickupTime || !fullName || !email || !phone || !address) {
      toast.error("Please fill in all required fields.", { autoClose: 3000 });
      return;
    }
    if (!validateEmail(email)) { toast.error("Enter a valid email."); return; }
    if (!validatePhone(phone)) { toast.error("Enter a valid phone number."); return; }

    const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
    const userId = storedUser?.id || "guest";

    const payload = {
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
      const base = process.env.REACT_APP_API_BASE || "http://localhost:8000";
      const resp = await axiosInstance.post(`${base}/api/v1/booking`, payload, { headers: { "Content-Type": "application/json" }, timeout: 15000 });

      if (resp.status >= 200 && resp.status < 300) {
        const summary = { recycleItem, pickupDate, pickupTime, facility: selectedFacility, address, userEmail: email };
        setLastBookingSummary(summary);
        setShowSuccessModal(true);
        toast.success("Booking confirmed! Confirmation email sent.", { autoClose: 3000 });
        // reset
        setSelectedBrand(""); setSelectedModel(""); setSelectedFacility(""); setRecycleItemPrice(""); setPickupDate(""); setPickupTime(""); setAddress(""); setFullName(""); setEmail(""); setPhone(""); setModels([]);
      } else {
        toast.error("Booking failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.detail || "Network error. Try again.", { autoClose: 4000 });
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center gap-4 p-6 border-b">
          <div className="w-14 h-14 rounded-full bg-[#E2F0C9] p-2 flex items-center justify-center">
            <img src={LOGO_URL} alt="logo" className="object-contain w-full h-full" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Television Recycling</h1>
            <p className="text-sm text-gray-600">Schedule pickup for TVs of any size — we handle disposal safely.</p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <select value={selectedBrand} onChange={handleBrandChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]">
              <option value="">Select Brand</option>
              {brands.map((b) => <option key={b.brand} value={b.brand}>{b.brand}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" disabled={!models.length}>
              <option value="">{models.length ? "Select model" : "Choose brand first"}</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approx value (₹) *</label>
            <input type="number" min="0" value={recycleItemPrice} onChange={(e) => setRecycleItemPrice(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup date *</label>
            <input type="date" min={currentDate} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup time *</label>
            <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup address *</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facility *</label>
            <select value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]">
              <option value="">Select facility</option>
              {facility.map((f) => <option key={f.name} value={f.name}>{f.name} — {f.address}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 mt-2">
            <button type="submit" disabled={isLoading} className={`w-full py-3 rounded-md text-white ${isLoading ? "bg-gray-400" : "bg-[#5a8807] hover:bg-[#86c418]"}`}>
              {isLoading ? "Submitting..." : "Schedule Pickup"}
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && lastBookingSummary && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">✅</div>
              <h2 className="text-lg font-semibold">Booking Confirmed!</h2>
              <p className="text-sm text-gray-600 text-center">A confirmation was sent to <strong>{lastBookingSummary.userEmail}</strong>.</p>
              <div className="w-full bg-gray-50 rounded-xl p-4 text-sm">
                <div className="flex justify-between"><span className="font-medium">Item</span><span>{lastBookingSummary.recycleItem}</span></div>
                <div className="flex justify-between"><span className="font-medium">Slot</span><span>{lastBookingSummary.pickupDate} at {lastBookingSummary.pickupTime}</span></div>
                <div className="flex justify-between"><span className="font-medium">Facility</span><span>{lastBookingSummary.facility}</span></div>
                <div className="mt-2"><span className="font-medium">Address</span><p className="text-right">{lastBookingSummary.address}</p></div>
              </div>
              <button onClick={() => setShowSuccessModal(false)} className="w-full bg-[#5a8807] text-white py-2 rounded-xl">Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelevisionPage;

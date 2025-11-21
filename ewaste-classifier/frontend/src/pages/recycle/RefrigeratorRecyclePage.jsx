import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { facility } from "../../data/facility";

const LOGO_URL = "/mnt/data/31139e21-fece-4d9c-abef-f65c1c8bd0d0.png";

// try to use centralized axiosInstance if provided
let axiosInstance = axios;
try {
  // eslint-disable-next-line global-require
  const maybe = require("../../utils/axiosInstance");
  if (maybe && maybe.default) axiosInstance = maybe.default;
  else if (maybe) axiosInstance = maybe;
} catch { }

const Refrigerator = () => {
  const location = useLocation();
  const mountedRef = useRef(true);
  const initialBrand = location?.state?.selectedBrand || "";

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [recycleItemPrice, setRecycleItemPrice] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [brands] = useState([
    {
      brand: "Samsung",
      models: [
        "Samsung RT28M3022S8 Double Door Refrigerator",
        "Samsung RT42M553ES8 Top Freezer Refrigerator",
        "Samsung RS74T5F01B4 Side-by-Side Refrigerator",
        "Samsung RT65K7058BS Frost-Free Double Door Refrigerator",
        "Samsung RR20T182XR8/NL Single Door Refrigerator",
      ],
    },
    {
      brand: "LG",
      models: [
        "LG GL-I292RPZL Double Door Refrigerator",
        "LG GL-T292RPZY Double Door Frost-Free Refrigerator",
        "LG GC-B247SLUV Side-by-Side Refrigerator",
        "LG GL-B201AHPY Single Door Refrigerator",
        "LG GL-D201ASOX Single Door Refrigerator",
      ],
    },
    {
      brand: "Whirlpool",
      models: [
        "Whirlpool IF INV CNV 278 ELT Double Door Refrigerator",
        "Whirlpool NEO IF 278 ELT Double Door Refrigerator",
        "Whirlpool FP 263D Protton Roy Triple Door Refrigerator",
        "Whirlpool WDE 205 CLS 3S Single Door Refrigerator",
        "Whirlpool WDE 205 ROY 3S Single Door Refrigerator",
      ],
    },
    {
      brand: "Haier",
      models: [
        "Haier HRF 618SS Side-by-Side Refrigerator",
        "Haier HRB-2764PBG-E Double Door Refrigerator",
        "Haier HED-20FDS Single Door Refrigerator",
        "Haier HRD-2204BS-R 5 Star Single Door Refrigerator",
        "Haier HRF-619KS Side-by-Side Refrigerator",
      ],
    },
    {
      brand: "Godrej",
      models: [
        "Godrej RT EON 311 PD 3.4 Double Door Refrigerator",
        "Godrej RD EDGEPRO 225 C 33 TAFQ Single Door Refrigerator",
        "Godrej RF GF 2362PTH 236 L Double Door Refrigerator",
        "Godrej RT EON 241 P 3.4 Double Door Refrigerator",
        "Godrej RD EDGESX 185 CT 2.2 Single Door Refrigerator",
      ],
    },
    {
      brand: "Panasonic",
      models: [
        "Panasonic NR-BG311VSS3 Double Door Refrigerator",
        "Panasonic NR-BR347VSX1 Double Door Refrigerator",
        "Panasonic NR-A195STWRT Single Door Refrigerator",
        "Panasonic NR-BS60MSX1 Side-by-Side Refrigerator",
        "Panasonic NR-A195RSTL Single Door Refrigerator",
      ],
    },
    {
      brand: "Bosch",
      models: [
        "Bosch KDN43VS30I Double Door Refrigerator",
        "Bosch KDN56XI30I Side-by-Side Refrigerator",
        "Bosch KDN30VS30I Double Door Refrigerator",
        "Bosch KAN56V40AU Side-by-Side Refrigerator",
        "Bosch KDN46XI30I Double Door Refrigerator",
      ],
    },
    {
      brand: "SAMSUNG",
      models: [
        "SAMSUNG RS73R5561M9 689 L Frost Free Side-by-Side Refrigerator",
        "SAMSUNG RT28T3483S8 253 L 3 Star Double Door Refrigerator",
        "SAMSUNG RR21T2G2X9U 198 L 5 Star Single Door Refrigerator",
        "SAMSUNG RT30T3743S9 275 L 3 Star Double Door Refrigerator",
        "SAMSUNG RR22T272YS8 212 L 3 Star Single Door Refrigerator",
      ],
    },
  ]);
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastBookingSummary, setLastBookingSummary] = useState(null);

  useEffect(() => {
    if (initialBrand) {
      const found = brands.find((b) => b.brand === initialBrand);
      setModels(found ? found.models : []);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [initialBrand, brands]);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");
    const found = brands.find((b) => b.brand === brand);
    setModels(found ? found.models : []);
  };

  const validateEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).toLowerCase());
  const validatePhone = (s) => /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(String(s));

  const currentDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

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
      toast.error("Enter a valid email.", { autoClose: 3000 });
      return;
    }
    if (!validatePhone(phone)) {
      toast.error("Enter a valid phone number (10 digits).", { autoClose: 3000 });
      return;
    }

    const storedUser = (() => {
      try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    })();
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
      const resp = await axiosInstance.post(`${base}/api/v1/booking`, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

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
        toast.success("Booking confirmed! Confirmation email sent.", { autoClose: 3000 });
        // reset
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
        toast.error("Failed to submit booking. Try again.", { autoClose: 3000 });
      }
    } catch (err) {
      console.error("Booking error:", err);
      const msg = err?.response?.data?.detail || "Network error. Try again.";
      toast.error(msg, { autoClose: 4000 });
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
            <img src={LOGO_URL} alt="logo" className="object-contain w-full h-full" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Refrigerator Recycling</h1>
            <p className="text-sm text-gray-600">Schedule bulk pickup for refrigerators and large appliances.</p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" placeholder="Jane Doe" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <select value={selectedBrand} onChange={handleBrandChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]">
              <option value="">Select brand</option>
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
            <input type="number" min="0" value={recycleItemPrice} onChange={(e) => setRecycleItemPrice(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" placeholder="e.g., 3000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup date *</label>
            <input type="date" min={currentDate} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup time *</label>
            <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup address *</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" placeholder="House no, street, city" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]" placeholder="10-digit" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facility *</label>
            <select value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#5a8807]">
              <option value="">Select facility</option>
              {facility.map((f) => <option key={f.name} value={f.name}>{f.name} — {f.address}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 mt-2">
            <button type="submit" disabled={isLoading} className={`w-full rounded-md py-3 text-white font-medium ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#5a8807] hover:bg-[#86c418]"}`}>
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

export default Refrigerator;

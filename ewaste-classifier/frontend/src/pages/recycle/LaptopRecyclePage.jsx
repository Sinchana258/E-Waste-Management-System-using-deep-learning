import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { facility } from "../../data/facility"; // adjust path if needed

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

const LaptopRecyclePage = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [recycleItemPrice, setRecycleItemPrice] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [address, setAddress] = useState("");

  // user info (no auth, just fields)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastBookingSummary, setLastBookingSummary] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedFacility("");

    const found = LAPTOP_BRANDS.find((b) => b.brand === brand);
    setModels(found ? found.models : []);
  };

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
      toast.error("Please fill in all the required fields.", {
        autoClose: 3000,
      });
      return;
    }

    const newBooking = {
      userId: "", // optional
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

      const response = await fetch("http://localhost:8000/api/v1/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });


      if (response.ok) {
        // ✨ Build a small summary for the modal
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

        // ✅ nicer toast
        toast.success("Booking confirmed! A confirmation email has been sent.", {
          autoClose: 3000,
        });
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
        setIsLoading(false);

      } else {
        toast.error("Error submitting data.", { autoClose: 3000 });
      }

    } catch (err) {
      console.error(err);
      toast.error("Error submitting data.", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container h-screen flex flex-col items-center justify-center">
        <div className="loader mb-4" />
        <div className="loading-text text-lg">Submitting...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />

      <h1 className="text-4xl font-bold mb-6 p-6 text-center">
        Laptop Recycling
      </h1>

      <form
        className="grid grid-cols-1 md:grid-cols-2 mx-8 md:mx-0 gap-4 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">
            Full Name:
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Brand */}
        <div className="mb-4">
          <label
            htmlFor="brand"
            className="block text-2xl font-medium text-gray-600"
          >
            Select Brand:
          </label>
          <select
            id="brand"
            value={selectedBrand}
            onChange={handleBrandChange}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
          >
            <option value="">Select Brand</option>
            {LAPTOP_BRANDS.map((brand) => (
              <option key={brand.brand} value={brand.brand}>
                {brand.brand}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div className="mb-4">
          <label
            htmlFor="model"
            className="block text-2xl font-medium text-gray-600"
          >
            Select Model:
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label
            htmlFor="recycleItemPrice"
            className="block text-2xl font-medium text-gray-600"
          >
            Recycle Item Price:
          </label>
          <input
            type="number"
            id="recycleItemPrice"
            value={recycleItemPrice}
            onChange={(e) => setRecycleItemPrice(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
            placeholder="Enter approx value (₹)"
          />
        </div>

        {/* Pickup Date */}
        <div className="mb-4">
          <label
            htmlFor="pickupDate"
            className="block text-2xl font-medium text-gray-600"
          >
            Pickup Date:
          </label>
          <input
            type="date"
            id="pickupDate"
            value={pickupDate}
            min={currentDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
          />
        </div>

        {/* Pickup Time */}
        <div className="mb-4">
          <label
            htmlFor="pickupTime"
            className="block text-2xl font-medium text-gray-600"
          >
            Pickup Time:
          </label>
          <input
            type="time"
            id="pickupTime"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-2xl font-medium text-gray-600"
          >
            Location:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
            placeholder="House no, street, area, city"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-2xl font-medium text-gray-600"
          >
            Phone:
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Facility */}
        <div className="mb-4">
          <label
            htmlFor="facility"
            className="block text-2xl font-medium text-gray-600"
          >
            Select Facility:
          </label>
          <select
            id="facility"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
          >
            <option value="">Select Facility</option>
            {facility.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="mb-4 md:col-span-2">
          <button
            type="submit"
            className="bg-emerald-700 text-xl text-white px-6 py-3 rounded-md w-full"
          >
            Submit
          </button>
        </div>
      </form>
      {showSuccessModal && lastBookingSummary && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-fade-in-up">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-center text-gray-600 mb-4">
              We’ve sent a confirmation email to{" "}
              <span className="font-semibold">{lastBookingSummary.userEmail}</span>.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Item</span>
                <span className="text-gray-800">
                  {lastBookingSummary.recycleItem}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Slot</span>
                <span className="text-gray-800">
                  {lastBookingSummary.pickupDate} at {lastBookingSummary.pickupTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Facility</span>
                <span className="text-gray-800">
                  {lastBookingSummary.facility}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Pickup Address</span>
                <p className="text-gray-800 text-right">
                  {lastBookingSummary.address}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LaptopRecyclePage;

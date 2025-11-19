import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { facility } from "../../data/facility"; // adjust path if needed

const TelevisionPage = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
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
  }, []);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedFacility("");

    const selected = brands.find((b) => b.brand === brand);
    if (selected) {
      setModels(selected.models);
    } else {
      setModels([]);
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];

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
      userId: null, // you can replace this with real user id if you add auth
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
      <div className="loader-container flex flex-col items-center justify-center h-screen">
        <div className="loader mb-4" />
        <div className="loading-text text-xl">Submitting...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />

      <h1 className="text-4xl font-bold mb-6 p-6 text-center">
        Television Recycling
      </h1>

      <form
        className="grid grid-cols-1 md:grid-cols-2 mx-8 md:mx-0 gap-4 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
            {brands.map((brand) => (
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

        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-2xl font-medium text-gray-600"
          >
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-2xl font-medium text-gray-600"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-2xl font-medium text-gray-600"
          >
            Location / Address:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
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

export default TelevisionPage;

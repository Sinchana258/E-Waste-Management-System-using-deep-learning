import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { facility } from "../../data/facility"; // adjust path if needed

function Refrigerator() {
  const [selectedBrand, setSelectedBrand] = useState("");
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

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");

    const selectedBrandObj = brands.find((b) => b.brand === brand);
    if (selectedBrandObj) {
      setModels(selectedBrandObj.models);
    } else {
      setModels([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recycleItem = `${selectedBrand} ${selectedModel}`.trim();

    if (
      !(
        recycleItem &&
        selectedFacility &&
        recycleItemPrice &&
        pickupDate &&
        pickupTime &&
        fullName &&
        email &&
        phone &&
        address
      )
    ) {
      toast.error("Please fill in all the required fields.", {
        autoClose: 3000,
      });
      return;
    }

    const newBooking = {
      userId: "guest", // manual entry, no auth
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

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      if (response.ok) {
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

        toast.success(
          "Booking confirmed! A confirmation email has been sent.",
          { autoClose: 3000 }
        );

        // reset form
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

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />

      {/* optional loader overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="loader-container">
            <div className="loader" />
            <div className="loading-text text-white text-lg mt-2">
              Submitting...
            </div>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6 p-6 text-center">
        Refrigerator Recycling
      </h1>

      <form
        className="grid grid-cols-1 md:grid-cols-2 mx-8 md:mx-0 gap-4 justify-center"
        onSubmit={handleSubmit}
      >
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
            placeholder="Enter your full name"
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

        {/* Recycle Price */}
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

        {/* Address */}
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
            placeholder="Your pickup address"
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

        {/* Submit Button */}
        <div className="mb-4 md:col-span-2">
          <button
            className="bg-[#5a8807] text-xl text-white px-6 py-3 rounded-md w-full"


          >
            Submit
          </button>
        </div>
      </form>

      {/* Success Modal */}
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
              <span className="font-semibold">
                {lastBookingSummary.userEmail}
              </span>
              .
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
                  {lastBookingSummary.pickupDate} at{" "}
                  {lastBookingSummary.pickupTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Facility</span>
                <span className="text-gray-800">
                  {lastBookingSummary.facility}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Pickup Address
                </span>
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
}

export default Refrigerator;

// import React, { useState } from "react";
// import {
//     FaTruck,
//     FaCalendarAlt,
//     FaClock,
//     FaMapMarkerAlt,
//     FaPhoneAlt,
//     FaRecycle,
// } from "react-icons/fa";

// const SlotSchedulingPage = () => {
//     const [formData, setFormData] = useState({
//         category: "",
//         itemType: "",
//         quantity: 1,
//         pickupDate: "",
//         timeSlot: "",
//         name: "",
//         phone: "",
//         email: "",
//         addressLine1: "",
//         addressLine2: "",
//         city: "",
//         pincode: "",
//         notes: "",
//     });

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");
//     const [errorMessage, setErrorMessage] = useState("");

//     const categories = [
//         { value: "accessories", label: "Accessories" },
//         { value: "refrigerator", label: "Refrigerator" },
//         { value: "laptop", label: "Laptop" },
//         { value: "smartphone", label: "Smartphone" },
//         { value: "tv", label: "TV" },
//     ];

//     const timeSlots = [
//         "09:00 AM - 11:00 AM",
//         "11:00 AM - 01:00 PM",
//         "01:00 PM - 03:00 PM",
//         "03:00 PM - 05:00 PM",
//         "05:00 PM - 07:00 PM",
//     ];

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setFormData((prev) => ({
//             ...prev,
//             [name]:
//                 name === "quantity"
//                     ? Math.max(1, Number(value) || 1)
//                     : value,
//         }));
//     };

//     const validateForm = () => {
//         if (!formData.category) return "Please select a waste category.";
//         if (!formData.pickupDate) return "Please select a pickup date.";
//         if (!formData.timeSlot) return "Please select a time slot.";
//         if (!formData.name.trim()) return "Please enter your name.";
//         if (!formData.phone.trim()) return "Please enter your phone number.";
//         if (!formData.addressLine1.trim()) return "Please enter address line 1.";
//         if (!formData.city.trim()) return "Please enter your city.";
//         if (!formData.pincode.trim()) return "Please enter your pincode.";
//         return null;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSuccessMessage("");
//         setErrorMessage("");

//         const validationError = validateForm();
//         if (validationError) {
//             setErrorMessage(validationError);
//             return;
//         }

//         try {
//             setIsSubmitting(true);

//             // TODO: When your FastAPI endpoint is ready,
//             // replace this with a real API call, e.g.
//             //
//             // const res = await fetch("http://localhost:8000/api/schedule-pickup", {
//             //   method: "POST",
//             //   headers: { "Content-Type": "application/json" },
//             //   body: JSON.stringify(formData),
//             // });
//             // if (!res.ok) throw new Error("Failed to schedule pickup");

//             // Simulate success for now
//             await new Promise((resolve) => setTimeout(resolve, 800));

//             setSuccessMessage(
//                 "Your e-waste pickup slot has been scheduled successfully! You will receive a confirmation shortly."
//             );
//             setFormData((prev) => ({
//                 ...prev,
//                 itemType: "",
//                 quantity: 1,
//                 pickupDate: "",
//                 timeSlot: "",
//                 notes: "",
//             }));
//         } catch (err) {
//             setErrorMessage(
//                 "Something went wrong while scheduling. Please try again."
//             );
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
//             <div className="max-w-5xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8 text-center">
//                     <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
//                         <FaTruck className="text-emerald-500" />
//                         Schedule E-Waste Pickup
//                     </h1>
//                     <p className="text-gray-600 max-w-2xl mx-auto">
//                         Book a doorstep pickup for your e-waste. Choose the device
//                         category, preferred date & time slot, and our partner will come
//                         to collect it.
//                     </p>
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-6">
//                     {/* Info panel */}
//                     <div className="md:col-span-1">
//                         <div className="bg-white rounded-lg shadow-md p-5 mb-4">
//                             <h2 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
//                                 <FaRecycle className="text-emerald-500" />
//                                 Why schedule a pickup?
//                             </h2>
//                             <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
//                                 <li>Safe & responsible recycling of e-waste.</li>
//                                 <li>Doorstep collection at your convenient time.</li>
//                                 <li>Helps reduce landfill and environmental damage.</li>
//                             </ul>
//                         </div>

//                         <div className="bg-white rounded-lg shadow-md p-5">
//                             <h3 className="font-semibold text-lg text-gray-800 mb-3">
//                                 Pickup guidelines
//                             </h3>
//                             <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
//                                 <li>Ensure the items are packed or grouped together.</li>
//                                 <li>Keep the invoice/bill handy if available.</li>
//                                 <li>Data devices (phones/laptops) should be factory-reset.</li>
//                             </ul>
//                         </div>
//                     </div>

//                     {/* Form */}
//                     <div className="md:col-span-2">
//                         <form
//                             onSubmit={handleSubmit}
//                             className="bg-white rounded-lg shadow-md p-6 space-y-5"
//                         >
//                             {/* Messages */}
//                             {errorMessage && (
//                                 <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
//                                     {errorMessage}
//                                 </div>
//                             )}
//                             {successMessage && (
//                                 <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-md">
//                                     {successMessage}
//                                 </div>
//                             )}

//                             {/* Category & item details */}
//                             <div>
//                                 <h2 className="font-semibold text-lg text-gray-800 mb-3">
//                                     1. E-Waste Details
//                                 </h2>
//                                 <div className="grid md:grid-cols-3 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Category<span className="text-red-500">*</span>
//                                         </label>
//                                         <select
//                                             name="category"
//                                             value={formData.category}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         >
//                                             <option value="">Select category</option>
//                                             {categories.map((cat) => (
//                                                 <option key={cat.value} value={cat.value}>
//                                                     {cat.label}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Item / Model
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="itemType"
//                                             value={formData.itemType}
//                                             onChange={handleChange}
//                                             placeholder="e.g., Dell Laptop, LG TV"
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Quantity
//                                         </label>
//                                         <input
//                                             type="number"
//                                             name="quantity"
//                                             min="1"
//                                             value={formData.quantity}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Date & time */}
//                             <div>
//                                 <h2 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
//                                     <FaCalendarAlt className="text-emerald-500" />
//                                     2. Pickup Date & Time
//                                 </h2>
//                                 <div className="grid md:grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Pickup Date<span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="date"
//                                             name="pickupDate"
//                                             value={formData.pickupDate}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Time Slot<span className="text-red-500">*</span>
//                                         </label>
//                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                                             {timeSlots.map((slot) => (
//                                                 <button
//                                                     key={slot}
//                                                     type="button"
//                                                     onClick={() =>
//                                                         setFormData((prev) => ({
//                                                             ...prev,
//                                                             timeSlot: slot,
//                                                         }))
//                                                     }
//                                                     className={`text-xs sm:text-sm border rounded-md px-2 py-2 flex items-center justify-center gap-2 ${formData.timeSlot === slot
//                                                         ? "border-emerald-500 bg-emerald-50 text-emerald-700"
//                                                         : "border-gray-300 text-gray-700 hover:border-emerald-400"
//                                                         }`}
//                                                 >
//                                                     <FaClock className="hidden sm:inline" />
//                                                     {slot}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Contact & address */}
//                             <div>
//                                 <h2 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
//                                     <FaMapMarkerAlt className="text-emerald-500" />
//                                     3. Pickup Address
//                                 </h2>
//                                 <div className="grid md:grid-cols-2 gap-4 mb-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Name<span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             value={formData.name}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Phone<span className="text-red-500">*</span>
//                                         </label>
//                                         <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-emerald-500">
//                                             <FaPhoneAlt className="text-gray-400 mr-2" />
//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={formData.phone}
//                                                 onChange={handleChange}
//                                                 className="w-full focus:outline-none"
//                                                 placeholder="10-digit mobile number"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="grid md:grid-cols-2 gap-4 mb-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Email (optional)
//                                         </label>
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             City<span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="city"
//                                             value={formData.city}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid md:grid-cols-2 gap-4 mb-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Address Line 1<span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="addressLine1"
//                                             value={formData.addressLine1}
//                                             onChange={handleChange}
//                                             placeholder="House / Flat no, Street"
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Address Line 2
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="addressLine2"
//                                             value={formData.addressLine2}
//                                             onChange={handleChange}
//                                             placeholder="Area, Landmark"
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid md:grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Pincode<span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="pincode"
//                                             value={formData.pincode}
//                                             onChange={handleChange}
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Additional Notes
//                                         </label>
//                                         <textarea
//                                             name="notes"
//                                             value={formData.notes}
//                                             onChange={handleChange}
//                                             rows={2}
//                                             placeholder="Any special instructions for pickup..."
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Submit */}
//                             <div className="pt-4 border-t border-gray-100 flex justify-end">
//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className={`px-6 py-2.5 rounded-md text-white text-sm font-semibold flex items-center gap-2 ${isSubmitting
//                                         ? "bg-emerald-400 cursor-not-allowed"
//                                         : "bg-emerald-500 hover:bg-emerald-600"
//                                         }`}
//                                 >
//                                     {isSubmitting ? "Scheduling..." : "Confirm Pickup Slot"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SlotSchedulingPage;


import React from "react";
import { Link } from "react-router-dom";
import {
    FaHeadphones,
    FaLaptop,
    FaSnowflake,
    FaMobileAlt,
    FaTv,
} from "react-icons/fa";

const SlotSchedulingPage = () => {
    const categories = [
        {
            id: "accessories",
            name: "Accessories",
            description: "Headphones, chargers, power banks, smartwatches & more.",
            icon: FaHeadphones,
            link: "/recycle/accessories",
            badge: "Small Gadgets",
        },
        {
            id: "laptop",
            name: "Laptops",
            description: "Old or damaged laptops, notebooks, ultrabooks.",
            icon: FaLaptop,
            link: "/recycle/laptop",
            badge: "High Value",
        },
        {
            id: "refrigerator",
            name: "Refrigerators",
            description: "Double door, single door & mini fridges.",
            icon: FaSnowflake,
            link: "/recycle/refrigerator",
            badge: "Bulk Pickup",
        },
        {
            id: "smartphone",
            name: "Smartphones",
            description: "Android phones, iPhones & other mobile devices.",
            icon: FaMobileAlt,
            link: "/recycle/smartphone",
            badge: "Most Common",
        },
        {
            id: "television",
            name: "Televisions",
            description: "LED, LCD, smart TVs & older models.",
            icon: FaTv,
            link: "/recycle/television",
            badge: "Large Appliance",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-2">
                        Slot Scheduling
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Choose what you want to recycle
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Select a category to schedule a doorstep pickup for your e-waste.
                        You’ll be able to enter item details, pickup date & time in the next step.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.id}
                                to={category.link}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-emerald-500 transition-all duration-200 flex flex-col"
                            >
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                                                <Icon className="text-xl" />
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {category.name}
                                            </h2>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                            {category.badge}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 flex-1">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="px-5 pb-4 pt-2">
                                    <button
                                        type="button"
                                        className="w-full inline-flex items-center justify-center text-sm font-medium rounded-lg bg-emerald-600 text-white py-2.5 group-hover:bg-emerald-700 transition-colors"
                                    >
                                        Continue with {category.name}
                                        <span className="ml-2 text-base group-hover:translate-x-0.5 transition-transform">
                                            →
                                        </span>
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Helper text */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Not sure which category to choose? Start with the closest match –
                    our team will verify and handle it correctly during pickup.
                </div>
            </div>
        </div>
    );
};

export default SlotSchedulingPage;

import React, { useState } from "react";
import {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaWhatsapp,
} from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * ContactUs (React + react-icons)
 *
 * Notes:
 * - Ensure emailjs/react-toastify are installed and configured.
 * - Social links open in a new tab; replace hrefs with your real profiles.
 */

const PRIMARY = "#5A8807";
const PRIMARY_LIGHT = "#E8F4D7"; // lighter tint used as soft bg

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const SendMsg = (e) => {
        e.preventDefault();

        const templateParams = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
        };

        emailjs
            .send(
                "service_q9unfiy",
                "template_757yvgl",
                templateParams,
                "-UivJttGWuWGT84ak"
            )
            .then(() => {
                setFormData({ name: "", email: "", phone: "", message: "" });
                toast.success("Message received — our team will reply shortly.");
            })
            .catch(() => {
                toast.error(
                    "We encountered an issue. Please try again or email us directly."
                );
            });
    };

    return (
        <>
            <ToastContainer
                className="text-2xl"
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <div className="max-w-6xl mx-auto px-6 lg:py-8 md:pb-32 contactus-container">

                <div className="flex flex-col items-center justify-center px-6">
                    <div
                        className="section-subtitle text-center font-bold text-2xl md:text-4xl 2xl:text-6xl uppercase tracking-widest"
                        style={{ color: PRIMARY }}
                    >
                        —Connect With Us—
                    </div>

                    <div className="text-black text-center text-xl md:text-3xl mt-4">
                        Partner with us in building a sustainable future for electronics
                    </div>

                    <p className="text-gray-600 text-center max-w-3xl mt-4 text-lg">
                        Whether you have questions about our services, want to suggest a
                        recycling facility, or need assistance with e-waste management, our
                        dedicated team is here to help you make environmentally responsible
                        choices.
                    </p>
                </div>

                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-8 mt-10">
                        {/* MESSAGE FORM */}
                        <div
                            className="p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
                            style={{ background: "white" }}
                        >
                            <h3 className="md:text-4xl text-2xl text-center font-semibold py-4 mb-4">
                                Reach Out to Our Team
                            </h3>

                            <form
                                className="newsletter-form mb-0 mx-auto md:mb-4"
                                onSubmit={SendMsg}
                            >
                                <div className="mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block text-gray-800 font-semibold mb-2 text-xl"
                                    >
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="email-field border rounded-md px-4 py-2 w-full"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-gray-800 font-semibold mb-2 text-xl"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="email-field border rounded-md px-4 py-2 w-full"
                                        placeholder="Your email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="phone"
                                        className="block text-gray-800 font-semibold mb-2 text-xl"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="email-field border rounded-md px-4 py-2 w-full"
                                        placeholder="Your contact number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="message"
                                        className="block text-gray-800 font-semibold mb-2 text-xl"
                                    >
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="border rounded-md py-3 text-lg px-4 w-full resize-none focus:outline-none focus:ring focus:border-blue-300"
                                        placeholder="How can we assist with your e-waste management needs?"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="text-white font-bold py-3 px-6 rounded-md"
                                    style={{
                                        backgroundColor: PRIMARY,
                                        boxShadow: "0 6px 18px rgba(90,136,7,0.18)",
                                    }}
                                >
                                    Send Your Message
                                </button>
                            </form>
                        </div>

                        {/* CONTACT INFO */}
                        <div
                            className="p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
                            style={{ background: PRIMARY_LIGHT }}
                        >
                            <h3 className="md:text-4xl text-2xl text-center font-semibold py-4 mb-4 text-gray-900">
                                Direct Contact Information
                            </h3>

                            <ul className="footer footer-list space-y-6">
                                {/* Location */}
                                <li className="footer-item flex items-start">
                                    <div
                                        className="w-10 h-10 mt-1 mr-3 rounded-full flex items-center justify-center"
                                        style={{ background: "white", color: PRIMARY }}
                                        aria-hidden="true"
                                    >
                                        <FaMapMarkerAlt />
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-xl mb-1 text-gray-900">
                                            Our Location
                                        </h4>
                                        <address className="contact-link address text-gray-700 not-italic">
                                            Main Office: BMSIT&M , Avalahalli  (Yelahanka),
                                            <br />
                                            Karnataka, India 560064
                                        </address>
                                    </div>
                                </li>

                                {/* Phone */}
                                <li className="footer-item flex items-start">
                                    <div
                                        className="w-10 h-10 mt-1 mr-3 rounded-full flex items-center justify-center"
                                        style={{ background: "white", color: PRIMARY }}
                                        aria-hidden="true"
                                    >
                                        <FaPhone />
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-xl mb-1 text-gray-900">
                                            Phone Support
                                        </h4>
                                        <a
                                            href="tel:+911234567890"
                                            className="contact-link text-gray-700 hover:text-emerald-700 transition-colors duration-300"
                                        >
                                            +91 123 456 7890
                                        </a>
                                        <p className="text-sm text-gray-600">Mon–Fri: 9 AM to 6 PM IST</p>
                                    </div>
                                </li>

                                {/* Email */}
                                <li className="footer-item flex items-start">
                                    <div
                                        className="w-10 h-10 mt-1 mr-3 rounded-full flex items-center justify-center"
                                        style={{ background: "white", color: PRIMARY }}
                                        aria-hidden="true"
                                    >
                                        <FaEnvelope />
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-xl mb-1 text-gray-900">Email Us</h4>
                                        <a
                                            href="mailto:contactus.e.cycle@gmail.com"
                                            className="contact-link text-gray-700 hover:text-emerald-700 transition-colors duration-300"
                                        >
                                            contactus.e.cycle@gmail.com
                                        </a>
                                        <p className="text-sm text-gray-600">We respond within 24 hours</p>
                                    </div>
                                </li>

                                {/* Social Media */}
                                <li className="footer-item mt-6">
                                    <h4 className="font-semibold text-xl mb-3 text-center text-gray-900">
                                        Connect on Social Media
                                    </h4>

                                    <ul className="social-list flex justify-center space-x-4">
                                        <li>
                                            <a
                                                href="https://www.linkedin.com"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="social-link inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-emerald-50 transition"
                                                aria-label="LinkedIn"
                                                title="LinkedIn"
                                            >
                                                <FaLinkedin style={{ color: PRIMARY }} />
                                            </a>
                                        </li>

                                        <li>
                                            <a
                                                href="https://www.instagram.com"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="social-link inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-emerald-50 transition"
                                                aria-label="Instagram"
                                                title="Instagram"
                                            >
                                                <FaInstagram style={{ color: PRIMARY }} />
                                            </a>
                                        </li>

                                        <li>
                                            <a
                                                href="https://twitter.com"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="social-link inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-emerald-50 transition"
                                                aria-label="Twitter"
                                                title="Twitter"
                                            >
                                                <FaTwitter style={{ color: PRIMARY }} />
                                            </a>
                                        </li>

                                        <li>
                                            <a
                                                href="https://wa.me/911234567890"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="social-link inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-emerald-50 transition"
                                                aria-label="WhatsApp"
                                                title="WhatsApp"
                                            >
                                                <FaWhatsapp style={{ color: PRIMARY }} />
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Small footer note */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    Built for sustainability — certified partners, secure handling and practical e-waste solutions.
                </div>
            </div>
        </>
    );
};

export default ContactUs;

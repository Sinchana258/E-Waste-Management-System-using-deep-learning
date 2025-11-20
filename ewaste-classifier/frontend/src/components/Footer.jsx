import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import {
    paperPlane,
    location,
    call,
    mail,
    logoLinkedin,
    logoTwitter,
    logoInstagram,
    logoWhatsapp,
} from "ionicons/icons";
import { Link } from "react-router-dom";

import Logo from "../assets/e-cycle.png"; // ← replace with your actual logo file

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Subscribed with ${email}`);
        setEmail("");
    };

    return (
        <footer className="bg-[#1E1E1E] text-white pt-16 mt-20">
            <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Brand + Newsletter */}
                <div>
                    <div className="flex items-center mb-4">
                        <img
                            src={Logo}
                            alt="Ecycle Logo"
                            className="h-16 w-auto rounded-md object-contain"
                        />
                    </div>

                    <p className="text-gray-400 leading-relaxed mb-6">
                        ECycle connects you with certified recycling facilities and empowers
                        responsible e-waste management.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center bg-[#2A2A2A] rounded-lg overflow-hidden"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Subscribe for updates"
                            className="flex-1 p-3 bg-transparent text-gray-300 placeholder-gray-500 outline-none"
                        />
                        <button className="bg-[#BBC863] text-black p-3 px-4 hover:bg-[#a7b65d] transition">
                            <IonIcon icon={paperPlane} className="text-lg" />
                        </button>
                    </form>
                </div>

                {/* Recycling Solutions */}
                <div>
                    <h3 className="font-semibold mb-4 text-[#BBC863] text-lg">
                        Recycling Solutions
                    </h3>
                    <ul className="space-y-3 text-gray-400">
                        <li>
                            <Link to="/recycle/smartphone" className="hover:text-white transition">
                                Smartphone
                            </Link>
                        </li>
                        <li>
                            <Link to="/recycle/laptop" className="hover:text-white transition">
                                Laptop
                            </Link>
                        </li>
                        <li>
                            <Link to="/recycle/accessories" className="hover:text-white transition">
                                Accessories
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Platform */}
                <div>
                    <h3 className="font-semibold mb-4 text-[#BBC863] text-lg">
                        Platform
                    </h3>
                    <ul className="space-y-3 text-gray-400">
                        <li>
                            <Link to="/about" className="hover:text-white transition">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/education" className="hover:text-white transition">
                                Education
                            </Link>
                        </li>
                        <li>
                            <Link to="/facilities" className="hover:text-white transition">
                                Facilities
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="font-semibold mb-4 text-[#BBC863] text-lg">
                        Connect
                    </h3>

                    <div className="space-y-3 text-gray-400">
                        <p className="flex items-center gap-2">
                            <IonIcon icon={location} />
                            Avalahalli, Bengaluru
                        </p>
                        <p className="flex items-center gap-2">
                            <IonIcon icon={call} />
                            +91 1234567890
                        </p>
                        <p className="flex items-center gap-2">
                            <IonIcon icon={mail} />
                            contact@ecycle.com
                        </p>
                    </div>

                    <div className="flex gap-5 mt-4 text-2xl">
                        <IonIcon
                            icon={logoLinkedin}
                            className="hover:text-[#BBC863] cursor-pointer transition"
                        />
                        <IonIcon
                            icon={logoInstagram}
                            className="hover:text-[#BBC863] cursor-pointer transition"
                        />
                        <IonIcon
                            icon={logoTwitter}
                            className="hover:text-[#BBC863] cursor-pointer transition"
                        />
                        <IonIcon
                            icon={logoWhatsapp}
                            className="hover:text-[#BBC863] cursor-pointer transition"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#262626] py-5 mt-12 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} ECycle — All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;

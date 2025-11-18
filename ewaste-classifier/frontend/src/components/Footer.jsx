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
// import logo from "../assets/ELocate-s.png";

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Subscribed with ${email}`);
        setEmail("");
    };

    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    {/* <img src={logo} alt="ELocate" className="h-12 mb-4" /> */}
                    <p className="text-gray-300 mb-4">
                        ELocate connects you with certified recycling facilities and empowers responsible e-waste management.
                    </p>
                    <form className="flex" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            className="p-2 rounded-l-lg text-black flex-1"
                            required
                        />
                        <button className="bg-green-500 p-2 rounded-r-lg">
                            <IonIcon icon={paperPlane} />
                        </button>
                    </form>
                </div>

                <div>
                    <h3 className="font-semibold mb-4">Recycling Solutions</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link to="/recycle/smartphone">Smartphone</Link></li>
                        <li><Link to="/recycle/laptop">Laptop</Link></li>
                        <li><Link to="/recycle/accessories">Accessories</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4">Platform</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/education">Education</Link></li>
                        <li><Link to="/facilities">Facilities</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4">Connect</h3>
                    <p className="flex items-center gap-2"><IonIcon icon={location} /> Avalahalli , Bengaluru</p>
                    <p className="flex items-center gap-2"><IonIcon icon={call} /> +91 1234567890</p>
                    <p className="flex items-center gap-2"><IonIcon icon={mail} /> contact@Ecycle.com</p>
                    <div className="flex gap-4 mt-4">
                        <IonIcon icon={logoLinkedin} />
                        <IonIcon icon={logoInstagram} />
                        <IonIcon icon={logoTwitter} />
                        <IonIcon icon={logoWhatsapp} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 py-4 text-center text-gray-400">
                &copy; 2025 ELocate | All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;

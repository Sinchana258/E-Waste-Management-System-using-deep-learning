import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/e-cycle.png";// move image into src/assets
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navItems = [
        { label: "Home", path: "/" },
        { label: "Facility Locator", path: "/facility-locator" },
        { label: "E-Waste Classifier", path: "/classifier" },
        { label: "Cost Estimator", path: "/cost-estimator" },
        { label: "Market Place", path: "/ewaste-marketplace" },
        { label: "Slot Scheduling", path: "/slot-scheduling" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" },
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-4 py-3">
                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="ELocate" className="h-12 w-auto" />
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex space-x-6 items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="text-gray-700 hover:text-green-600 font-medium"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-2xl text-gray-700"
                    onClick={toggleMenu}
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <nav className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="block text-gray-700 hover:text-green-600 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default Header;

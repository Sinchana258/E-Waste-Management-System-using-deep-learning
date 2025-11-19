// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/e-cycle.png";
import { FiMenu, FiX } from "react-icons/fi";
import { getUser, isLoggedIn, clearAuth } from "../utils/auth";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const user = getUser();
        setLoggedIn(isLoggedIn());
        setUserName(user?.fullName || "");
    }, [location.pathname]);

    const handleLogout = () => {
        clearAuth();
        setLoggedIn(false);
        setUserName("");
        navigate("/");
    };

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
                    <img src={logo} alt="ECycle" className="h-12 w-auto" />
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

                    {/* Auth buttons / user info */}
                    {!loggedIn ? (
                        <>
                            <Link
                                to="/sign-in"
                                className="text-sm font-medium text-gray-700 border px-3 py-1 rounded-lg hover:bg-gray-100"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/sign-up"
                                className="text-sm font-medium text-white bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-700">
                                Hi, <span className="font-semibold">{userName || "User"}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-700 border px-3 py-1 rounded-lg hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
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

                    <div className="mt-4 border-t pt-3 flex flex-col gap-2">
                        {!loggedIn ? (
                            <>
                                <Link
                                    to="/sign-in"
                                    className="block text-gray-700 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="block text-green-600 font-semibold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="block text-gray-700 font-medium">
                                    Hi, {userName || "User"}
                                </span>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="text-left text-red-500 font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;

// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiLogOut } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

// use the uploaded logo file (dev env will transform the path to a URL)
import logoSrc from "../assets/e-cycle.png";

const NAV_ITEMS = [
    { label: "Home", path: "/", protected: false },
    { label: "Facility Locator", path: "/facility-locator", protected: false },
    { label: "E-Waste Classifier", path: "/classifier", protected: false },
    { label: "Cost Estimator", path: "/value-estimator", protected: false },
    { label: "Market Place", path: "/ewaste-marketplace", protected: true },
    { label: "Slot Scheduling", path: "/slot-scheduling", protected: true },
    { label: "About", path: "/about", protected: false },
    { label: "Contact", path: "/contact", protected: false },
];

const Header = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const avatarRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // close mobile/avatar when route changes
    useEffect(() => {
        setMobileOpen(false);
        setAvatarOpen(false);
    }, [location.pathname]);

    // click outside avatar to close
    useEffect(() => {
        function onDocClick(e) {
            if (!avatarRef.current) return;
            if (!avatarRef.current.contains(e.target)) {
                setAvatarOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const handleLogout = async () => {
        try {
            await logout?.();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            navigate("/");
        }
    };

    const handleNavClick = (item) => {
        if (item.protected && !isLoggedIn) {
            // send user to sign-in and preserve intended route
            navigate("/sign-in", { state: { from: item.path } });
            return;
        }
        navigate(item.path);
    };

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const initials = (name = "") => {
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "U";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur bg-white/70 shadow-md" : "bg-[#5a8807]/80"
                }`}
            aria-label="Main navigation"
        >
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                {/* Logo (only image, larger placeholder) */}
                <Link to="/" className="flex items-center gap-3" aria-label="Ecycle home">
                    <div className="bg-white rounded-md p-1 h-14 w-auto flex items-center justify-center shadow-sm">
                        <img
                            src={logoSrc}
                            alt="Ecycle logo"
                            className="h-12 w-auto object-contain"
                        />
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Primary">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleNavClick(item)}
                            className={`text-sm font-medium px-2 py-3 rounded-md transition ${isActive(item.path)
                                ? "text-[#0f3d14]   hover:text-[#ffffff] underline decoration-2 underline-offset-4"
                                : "text-[#0f3d14]/100 hover:text-[#ffffff]"
                                }`}
                            aria-current={isActive(item.path) ? "page" : undefined}
                        >
                            {item.label}
                        </button>
                    ))}

                    {/* Auth area */}
                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/sign-in"
                                className="ml-3 text-sm px-4 py-1 rounded-full bg-[#5a8807] text-white hover:bg-[#a6b554]"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/sign-up"
                                className="ml-2 text-sm px-4 py-1 rounded-full bg-[#5a8807] text-white hover:bg-[#a6b554]"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="relative ml-4 flex items-center gap-3" ref={avatarRef}>
                            <button
                                onClick={() => setAvatarOpen((s) => !s)}
                                className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-white/40 transition"
                                aria-expanded={avatarOpen}
                                aria-haspopup="true"
                            >
                                <div className="h-9 w-9 rounded-full bg-[#dff3dc] flex items-center justify-center text-sm font-semibold text-[#18421b]">
                                    {initials(user?.fullName || user?.name || "")}
                                </div>
                                <span className="text-sm text-[#18421b] hidden lg:inline">Hi, {user?.fullName?.split(" ")[0] || user?.name || "User"}</span>
                                <FiChevronDown className="text-[#18421b]" />
                            </button>

                            {avatarOpen && (
                                <div
                                    className="absolute right-0 mt-12 w-48 bg-white rounded-xl shadow-lg border py-2 z-50"
                                    role="menu"
                                    aria-label="User menu"
                                >
                                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50" role="menuitem">
                                        Profile
                                    </Link>
                                    <Link to="/bookings" className="block px-4 py-2 text-sm hover:bg-gray-50" role="menuitem">
                                        My Bookings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                        role="menuitem"
                                    >
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-2xl p-2 rounded-md hover:bg-white/30"
                    onClick={() => setMobileOpen((s) => !s)}
                    aria-label="Toggle navigation"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile panel */}
            {mobileOpen && (
                <div className="md:hidden bg-[#E2F0C9]/95 border-t">
                    <div className="px-4 py-4 space-y-3">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleNavClick(item);
                                }}
                                className="w-full text-left text-[#18421b] px-3 py-2 rounded-md hover:bg-white/30"
                            >
                                {item.label} {item.protected && !isLoggedIn ? <span className="text-xs text-gray-500 ml-2">(sign in)</span> : null}
                            </button>
                        ))}

                        <div className="pt-2 border-t mt-2 flex items-center justify-between gap-3">
                            {!isLoggedIn ? (
                                <>
                                    <Link to="/sign-in" className="flex-1 text-center px-3 py-2 rounded-md border bg-white" onClick={() => setMobileOpen(false)}>
                                        Sign In
                                    </Link>
                                    <Link to="/sign-up" className="flex-1 text-center px-3 py-2 rounded-md bg-[#BBC863] text-white" onClick={() => setMobileOpen(false)}>
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-[#dff3dc] flex items-center justify-center text-sm font-semibold text-[#18421b]">
                                            {initials(user?.fullName || user?.name || "")}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-[#18421b]">{user?.fullName?.split(" ")[0] || user?.name || "User"}</div>
                                            <div className="text-xs text-gray-600">View account</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileOpen(false);
                                        }}
                                        className="px-3 py-2 rounded-md text-sm text-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="px-4 w-full py-20 md:py-28 bg-[#E2F0C9] flex items-center justify-center">
            <div className="max-w-2xl text-center">

                {/* Heading */}
                <h1 className="text-gray-800 font-extrabold text-3xl md:text-5xl tracking-wide uppercase">
                    🚧 Page Under Construction 🚧
                </h1>

                {/* Subtext */}
                <p className="text-gray-700 text-lg md:text-xl mt-4 leading-relaxed">
                    Oops! The page you're trying to reach is not ready yet.
                    <br />
                    We're working hard to bring it live soon!
                </p>

                {/* CTA Button */}
                <Link to="/">
                    <button
                        className="
                            mt-8 px-8 py-3 rounded-full 
                            bg-[#5a8807] text-white text-lg font-semibold 
                            transition-all duration-300
                            hover:bg-[#86c418] hover:shadow-lg
                            focus:outline-none focus:ring-4 focus:ring-lime-300
                        "
                    >
                        Go Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;

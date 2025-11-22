import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ToastBar from "./ToastBar";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <ToastBar />
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;

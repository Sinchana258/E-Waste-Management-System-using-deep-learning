// src/components/UploadForm.jsx
import React, { useState } from "react";

const UploadForm = ({ onUpload }) => {
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent GET request
        if (file) onUpload(file);
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center w-full h-full bg-white p-4 rounded-lg shadow-lg"
        >
            <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
            >
                {file ? (
                    <p className="text-gray-700">{file.name}</p>
                ) : (
                    <p className="text-gray-400 text-center">
                        Click or drag file to upload the image of e-waste
                    </p>
                )}
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                />
            </label>

            <button
                type="submit"
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
                disabled={!file}
            >
                Upload
            </button>
        </form>
    );
};

export default UploadForm;

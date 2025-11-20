// src/components/UploadForm.jsx
import React, { useCallback, useRef, useState } from "react";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
const logoSrc = "/mnt/data/31139e21-fece-4d9c-abef-f65c1c8bd0d0.png";

const UploadForm = ({ onUpload }) => {
    const inputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const [localProgress, setLocalProgress] = useState(0);
    const [error, setError] = useState("");

    const reset = () => {
        try {
            if (preview) URL.revokeObjectURL(preview);
        } catch { }
        setPreview(null);
        setLocalProgress(0);
        setError("");
    };

    const validateFile = (file) => {
        if (!file) return "No file provided";
        if (!file.type.startsWith("image/")) return "File must be an image";
        // optional: size limit e.g., 8MB
        if (file.size > 8 * 1024 * 1024) return "Image must be smaller than 8 MB";
        return null;
    };

    const handleFiles = useCallback(
        (file) => {
            const validationErr = validateFile(file);
            if (validationErr) {
                setError(validationErr);
                return;
            }
            setError("");
            // preview
            const url = URL.createObjectURL(file);
            setPreview(url);

            // small local animation to show progress (visual only)
            setLocalProgress(6);
            const iv = setInterval(() => {
                setLocalProgress((p) => {
                    if (p >= 90) {
                        clearInterval(iv);
                        return p;
                    }
                    return p + Math.floor(Math.random() * 18) + 6;
                });
            }, 220);

            // pass file up so parent does the real upload / inference
            try {
                onUpload(file);
            } catch (e) {
                console.error(e);
            } finally {
                // allow parent to complete real upload; here we cap progress visually
                setTimeout(() => setLocalProgress(100), 1200);
            }
        },
        [onUpload]
    );

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const file = e.dataTransfer.files?.[0];
        if (file) handleFiles(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const onChoose = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFiles(file);
    };

    return (
        <div className="w-full max-w-md">
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
                }}
                onClick={() => inputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`relative rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center p-6 bg-white shadow-md ${isDragOver ? "border-dashed border-green-500 ring-2 ring-green-200" : "border-gray-200"
                    }`}
            >
                {/* Hidden file input */}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChoose} />

                {/* Preview or placeholder */}
                <div className="w-full flex flex-col items-center gap-4">
                    <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                        {preview ? (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                            />
                        ) : (
                            <img src={logoSrc} alt="placeholder" className="w-full h-full object-contain p-4 opacity-90" />
                        )}
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {preview ? "Image ready for classification" : "Drag & drop an image here"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {preview ? "Drop a different image or click to choose another file." : "Supported: JPG, PNG. Max 8MB."}
                        </p>
                    </div>

                    {/* Error */}
                    {error && <div className="text-sm text-red-500">{error}</div>}

                    {/* Local progress bar (visual) */}
                    {localProgress > 0 && localProgress < 100 && (
                        <div className="w-full mt-3">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-2 rounded-full bg-green-600 transform transition-all" style={{ width: `${localProgress}%` }} />
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-right">{Math.min(localProgress, 99)}%</div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                        {preview && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    reset();
                                }}
                                className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                                aria-label="Remove selected image"
                            >
                                <span className="flex items-center gap-2">
                                    <XMarkIcon className="w-4 h-4" /> Remove
                                </span>
                            </button>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                inputRef.current?.click();
                            }}
                            className="px-4 py-2 rounded-md bg-[#5a8807] text-white text-sm hover:bg-[#4a6e05] transition flex items-center gap-2"
                        >
                            <CloudArrowUpIcon className="w-4 h-4" />
                            {preview ? "Replace" : "Choose image"}
                        </button>
                    </div>
                </div>
            </div>

            {/* small helper */}
            <div className="mt-3 text-xs text-gray-500">
                Tip: take a clear photo of the item on a plain background for best results.
            </div>
        </div>
    );
};

export default UploadForm;

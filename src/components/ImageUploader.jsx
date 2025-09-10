import React, { useState } from "react";
import { Upload, Loader, X } from "lucide-react";
import axiosInstance from "../auth/axiosInstance";

const ImageUploader = () => {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post("/auth/uploadImage", formData);
    return response.data;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError(null);

    const previewUrl = URL.createObjectURL(selectedFile);

    const newUpload = {
      id: Date.now(),
      file: selectedFile,
      preview: previewUrl,
      uploading: true,
      uploadedUrl: null,
      error: null,
    };

    setUploads((prev) => [...prev, newUpload]);

    try {
      const result = await uploadImage(selectedFile);
      const imageUrl = result.imageUrl || result.url;

      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === newUpload.id
            ? { ...upload, uploading: false, uploadedUrl: imageUrl }
            : upload
        )
      );
    } catch (err) {
      console.error("Upload failed:", err);
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === newUpload.id
            ? { ...upload, uploading: false, error: "Upload failed" }
            : upload
        )
      );
      setError("Image upload failed. Please try again.");
    }
  };

  const handleRemove = (id) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <label
        htmlFor="multi-image-upload-input"
        className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-6 cursor-pointer hover:border-blue-400"
      >
        <Upload size={24} className="text-gray-400 mb-2" />
        <span className="text-sm text-gray-500">Click to upload an image</span>
        <input
          id="multi-image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {uploads.map((upload) => (
          <div key={upload.id} className="relative w-32 h-32">
            {upload.uploading ? (
              <div className="w-full h-full flex items-center justify-center border rounded-md bg-gray-50">
                <Loader className="animate-spin text-blue-500" size={24} />
              </div>
            ) : upload.uploadedUrl ? (
              <img
                src={upload.uploadedUrl}
                alt="Uploaded"
                className="w-32 h-32 object-cover rounded-md"
              />
            ) : upload.preview ? (
              <img
                src={upload.preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md opacity-50"
              />
            ) : null}

            <button
              type="button"
              onClick={() => handleRemove(upload.id)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <X size={18} className="text-red-500" />
            </button>

            {upload.error && (
              <p className="absolute bottom-1 left-1 right-1 text-xs text-red-500 text-center bg-white bg-opacity-80 rounded-sm">
                {upload.error}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;

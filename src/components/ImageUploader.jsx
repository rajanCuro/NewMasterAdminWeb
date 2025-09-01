import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { X } from "lucide-react"; // using lucide-react for icons (or use any icon lib)

const ImageUploader = ({ onUploadSuccess }) => {
  const { uploadImage } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");
    setIsUploading(true);

    try {
      const result = await uploadImage(file);
      console.log("Upload successful:", result);
      const imageUrl = result.imageUrl || result.url; // Adjust based on API response
      setUploadedUrl(imageUrl);
      onUploadSuccess(imageUrl); // pass URL back to parent
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setUploadedUrl(null);
    onUploadSuccess(""); // reset in parent form
  };

  return (
    <div className="flex flex-col gap-3">
      {!uploadedUrl && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </>
          )}
        </>
      )}

      {uploadedUrl && (
        <div className="relative w-32 h-32">
          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="w-32 h-32 object-cover rounded-md"
          />
          {/* Cut icon */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
          >
            <X size={18} className="text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../auth/axiosInstance";
import { FiSearch, FiGrid, FiList, FiFolder, FiFile, FiTrash2, FiEye } from "react-icons/fi";

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // Grid or list view
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch files on load
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/getAllFilesForFileManager");
      setFiles(res.data.files); // Assuming API returns list of URLs
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (url) => {
    try {
      await axios.delete("http://localhost:8082/auth/deleteFileFromS3", {
        params: { url },
      });
      setFiles(files.filter((file) => file !== url));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center bg-white rounded-lg shadow-sm w-1/2">
            <FiSearch className="ml-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search files..."
              className="p-2 w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              <FiList />
            </button>
          </div>
        </div>

        {/* File Display */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading files...</p>
        ) : filteredFiles.length === 0 ? (
          <p className="text-gray-500 text-center">No files found</p>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file, idx) => (
              <div
                key={idx}
                className="bg-white shadow-sm rounded-lg p-4 flex flex-col items-center space-y-3 hover:shadow-md transition"
              >
                {file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <img
                    src={file}
                    alt="Uploaded"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md">
                    <FiFile className="text-4xl text-gray-400" />
                  </div>
                )}
                <p className="text-sm text-gray-600 truncate w-full text-center">
                  {file.split("/").pop()}
                </p>
                <div className="flex space-x-2">
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  >
                    <FiEye className="mr-1" /> View
                  </a>
                  <button
                    onClick={() => deleteFile(file)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                  >
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-gray-600">Name</th>
                  <th className="p-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center">
                      {file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img
                          src={file}
                          alt="Uploaded"
                          className="w-8 h-8 object-cover rounded-md mr-2"
                        />
                      ) : (
                        <FiFile className="text-xl text-gray-400 mr-2" />
                      )}
                      {file.split("/").pop()}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                        >
                          <FiEye className="mr-1" /> View
                        </a>
                        <button
                          onClick={() => deleteFile(file)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
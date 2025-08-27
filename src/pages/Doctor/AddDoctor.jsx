import React, { useState, useEffect } from "react";

const DoctorOnboarding = ({ EditData }) => {
  console.log("edit doctor", EditData);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    status: "active",
    documents: null,
  });

  // Auto-fill form when EditData changes
  useEffect(() => {
    if (EditData) {
      setFormData({
        name: EditData.name || "",
        email: EditData.email || "",
        phone: EditData.phone || "",
        specialization: EditData.specialization || "",
        licenseNumber: EditData.licenseNumber || "",
        experience: EditData.experience?.toString() || "",
        status: EditData.status || "active",
        documents: null,
      });
    }
  }, [EditData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documents") {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle file upload and API submission here
    console.log("Doctor Onboarding Data:", formData);
    alert(EditData ? "Doctor updated successfully!" : "Doctor onboarding submitted successfully!");
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="float-container w-full">
            <input
              type="text"
              name="name"
              className="float-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder=""
            />
            <label htmlFor="name" className="float-label">Full Name</label>
          </div>
          <div className="float-container w-full">
            <input
              type="email"
              name="email"
              className="float-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=""
            />
            <label htmlFor="email" className="float-label">Email</label>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="float-container w-full">
            <input
              type="tel"
              name="phone"
              className="float-input"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder=""
            />
            <label htmlFor="phone" className="float-label">Phone Number</label>
          </div>

          <div className="float-container w-full">
            <select
              name="specialization"
              className="float-input"
              value={formData.specialization}
              onChange={handleChange}
              required
            >
              <option value="">Select Specialization</option>
              <option value="Oncologist">Oncologist</option>
              <option value="Radiologist">Radiologist</option>
              <option value="Hematologist">Hematologist</option>
              <option value="Surgeon">Surgeon</option>
              <option value="Pathologist">Pathologist</option>
            </select>
            <label htmlFor="specialization" className="float-label">Specialization</label>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="float-container w-full">
            <input
              type="text"
              name="licenseNumber"
              className="float-input"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              placeholder=""
            />
            <label className="float-label">License Number</label>
          </div>

          <div className="float-container w-full">
            <input
              type="number"
              name="experience"
              className="float-input"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              max="50"
              placeholder=""
            />
            <label className="float-label">Years of Experience</label>
          </div>
        </div>

        {EditData && (
          <div className="float-container w-full">
            <select
              name="status"
              className="float-input"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <label className="float-label">Status</label>
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Upload Documents</label>
          <input
            type="file"
            name="documents"
            multiple
            className="w-full px-2 py-2 border border-gray-200 rounded-md focus:outline-none"
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="cancle-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
          >
            {EditData ? "Update Doctor" : "Add Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorOnboarding;
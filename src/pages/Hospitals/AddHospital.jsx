import React, { useState } from "react";

function AddHospital() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    registrationNumber: "",
    features: [],
  });

  const featuresList = ["ICU", "Emergency", "Pharmacy", "Ambulance", "Blood Bank"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureChange = (feature) => {
    setFormData((prev) => {
      if (prev.features.includes(feature)) {
        return { ...prev, features: prev.features.filter((f) => f !== feature) };
      } else {
        return { ...prev, features: [...prev.features, feature] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Hospital Data Submitted:", formData);
    alert("Hospital added successfully!");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2">
      
        {/* Hospital Name */}
        <div className="float-container">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="float-input"
            required
            placeholder=" "
          />
          <label htmlFor="name" className="float-label">
            Hospital Name
          </label>
        </div>

        {/* Email */}
        <div className="float-container">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="float-input"
            required
            placeholder=" "
          />
          <label htmlFor="email" className="float-label">
            Email
          </label>
        </div>

        {/* Phone */}
        <div className="float-container">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="float-input"
            required
            placeholder=" "
          />
          <label htmlFor="phone" className="float-label">
            Phone
          </label>
        </div>

        {/* Address */}
        <div className="float-container">
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="float-input"
            required
            placeholder=" "
          />
          <label htmlFor="address" className="float-label">
            Address
          </label>
        </div>

        {/* City + State + Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="float-container">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="float-input"
              required
              placeholder=" "
            />
            <label htmlFor="city" className="float-label">
              City
            </label>
          </div>

          <div className="float-container">
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="float-input"
              required
              placeholder=" "
            />
            <label htmlFor="state" className="float-label">
              State
            </label>
          </div>

          <div className="float-container">
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="float-input"
              required
              placeholder=" "
            />
            <label htmlFor="pincode" className="float-label">
              Pincode
            </label>
          </div>
        </div>

        {/* Registration Number */}
        <div className="float-container">
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="float-input"
            required
            placeholder=" "
          />
          <label htmlFor="registrationNumber" className="float-label">
            Registration Number
          </label>
        </div>

        {/* Features */}

        <div className="float-container">
          <div className="flex flex-wrap gap-3 mt-2">
            {featuresList.map((feature) => (
              <label key={feature} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                  className="h-4 w-4 text-purple-600"
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Save Hospital
          </button>
        </div>
      </form>

    </div>
  );
}

export default AddHospital;

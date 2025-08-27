import React, { useEffect, useState } from 'react';

function AddAmbulance({ ambulanceData, isEditing }) {
  console.log(ambulanceData)
  useEffect(() => {
    if (ambulanceData) {
      // Map the incoming data to the form structure
      setFormData({
        ambulanceId: ambulanceData.ambulanceId || '',
        vehicleDetails: {
          registrationNumber: ambulanceData.vehicleDetails?.registrationNumber || '',
          vehicleType: ambulanceData.vehicleDetails?.vehicleType || '',
          model: ambulanceData.vehicleDetails?.model || '',
          manufacturer: ambulanceData.vehicleDetails?.manufacturer || '',
          yearOfManufacture: ambulanceData.vehicleDetails?.yearOfManufacture || '',
          capacity: ambulanceData.vehicleDetails?.capacity || '',
        },
        driverDetails: {
          name: ambulanceData.driverDetails?.name || '',
          phone: ambulanceData.driverDetails?.phone || '',
          licenseNumber: ambulanceData.driverDetails?.license || '',
          licenseExpiry: ambulanceData.driverDetails?.licenseExpiry || '',
          aadhaarNumber: ambulanceData.driverDetails?.aadhaarNumber || '',
          photoUrl: ambulanceData.driverDetails?.photoUrl || '',
        },
        documents: {
          rcBookUrl: ambulanceData.documents?.rcBookUrl || '',
          insuranceUrl: ambulanceData.documents?.insuranceUrl || '',
          pollutionCertificateUrl: ambulanceData.documents?.pollutionCertificateUrl || '',
          driverLicenseUrl: ambulanceData.documents?.driverLicenseUrl || '',
          ambulancePermitUrl: ambulanceData.documents?.ambulancePermitUrl || '',
        },
        location: {
          city: ambulanceData.location?.city || '',
          state: ambulanceData.location?.state || '',
          pinCode: ambulanceData.location?.pinCode || '',
          gpsCoordinates: {
            latitude: ambulanceData.location?.gpsCoordinates?.latitude || '',
            longitude: ambulanceData.location?.gpsCoordinates?.longitude || '',
          },
        },
        availabilityStatus: ambulanceData.availabilityStatus || 'unavailable',
        isVerified: ambulanceData.isVerified || false,
        ratings: ambulanceData.ratings || 4.0,
      });
    }
  }, [ambulanceData]);
  const [formData, setFormData] = useState({
    ambulanceId: '',
    vehicleDetails: {
      registrationNumber: '',
      vehicleType: '',
      model: '',
      manufacturer: '',
      yearOfManufacture: '',
      capacity: '',
    },
    driverDetails: {
      name: '',
      phone: '',
      licenseNumber: '',
      licenseExpiry: '',
      aadhaarNumber: '',
      photoUrl: '',
    },
    documents: {
      rcBookUrl: '',
      insuranceUrl: '',
      pollutionCertificateUrl: '',
      driverLicenseUrl: '',
      ambulancePermitUrl: '',
    },
    location: {
      city: '',
      state: '',
      pinCode: '',
      gpsCoordinates: {
        latitude: '',
        longitude: '',
      },
    },
    availabilityStatus: 'unavailable',
    isVerified: false,
    ratings: 4.0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const keys = name.split('.');

    if (keys.length === 1) {
      setFormData({ ...formData, [name]: value });
    } else if (keys.length === 2) {
      setFormData({
        ...formData,
        [keys[0]]: {
          ...formData[keys[0]],
          [keys[1]]: value,
        },
      });
    } else if (keys.length === 3) {
      setFormData({
        ...formData,
        [keys[0]]: {
          ...formData[keys[0]],
          [keys[1]]: {
            ...formData[keys[0]][keys[1]],
            [keys[2]]: value,
          },
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ambulance submitted:', formData);
    alert('Ambulance added successfully!');
    // Add API call or state update logic here
  };

  return (
    <div className=" ">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Ambulance ID */}
        {/* <div className='float-container'>
          <input
            type="text"
            name="ambulanceId"
            value={formData.ambulanceId}
            onChange={handleChange}
            required
            className="float-input"
            placeholder=''
          />
          <label htmlFor='ambulanceId' className="float-label">Ambulance ID</label>
        </div> */}

        {/* Vehicle Details */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Vehicle Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="float-container">
              <input
                type="text"
                name="vehicleDetails.registrationNumber"
                value={formData.vehicleDetails.registrationNumber}
                onChange={handleChange}
                className="float-input"
                placeholder=""
                required
              />
              <label className="float-label">Registration Number</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="vehicleDetails.vehicleType"
                value={formData.vehicleDetails.vehicleType}
                onChange={handleChange}
                className="float-input"
                placeholder=""
                required
              />
              <label className="float-label">Vehicle Type</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="vehicleDetails.model"
                value={formData.vehicleDetails.model}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Model</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="vehicleDetails.manufacturer"
                value={formData.vehicleDetails.manufacturer}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Manufacturer</label>
            </div>

            <div className="float-container">
              <input
                type="number"
                name="vehicleDetails.yearOfManufacture"
                value={formData.vehicleDetails.yearOfManufacture}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Year of Manufacture</label>
            </div>

            <div className="float-container">
              <input
                type="number"
                name="vehicleDetails.capacity"
                value={formData.vehicleDetails.capacity}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Capacity</label>
            </div>
          </div>
        </div>

        {/* Driver Details */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Driver Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="float-container">
              <input
                type="text"
                name="driverDetails.name"
                value={formData.driverDetails.name}
                onChange={handleChange}
                className="float-input"
                placeholder=""
                required
              />
              <label className="float-label">Driver Name</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="driverDetails.phone"
                value={formData.driverDetails.phone}
                onChange={handleChange}
                className="float-input"
                placeholder=""
                required
              />
              <label className="float-label">Phone</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="driverDetails.licenseNumber"
                value={formData.driverDetails.licenseNumber}
                onChange={handleChange}
                className="float-input"
                placeholder=""
                required
              />
              <label className="float-label">License Number</label>
            </div>

            <div className="float-container">
              <input
                type="date"
                name="driverDetails.licenseExpiry"
                value={formData.driverDetails.licenseExpiry}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">License Expiry</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="driverDetails.aadhaarNumber"
                value={formData.driverDetails.aadhaarNumber}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Aadhaar Number</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="driverDetails.photoUrl"
                value={formData.driverDetails.photoUrl}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Photo URL</label>
            </div>
          </div>
        </div>


        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Documents (URLs)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="float-container">
              <input
                type="text"
                name="documents.rcBookUrl"
                value={formData.documents.rcBookUrl}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">RC Book URL</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="documents.insuranceUrl"
                value={formData.documents.insuranceUrl}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Insurance URL</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="documents.pollutionCertificateUrl"
                value={formData.documents.pollutionCertificateUrl}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Pollution Certificate URL</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="documents.driverLicenseUrl"
                value={formData.documents.driverLicenseUrl}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Driver License URL</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="documents.ambulancePermitUrl"
                value={formData.documents.ambulancePermitUrl}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Ambulance Permit URL</label>
            </div>

          </div>
        </div>


        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="float-container">
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">City</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">State</label>
            </div>

            <div className="float-container">
              <input
                type="text"
                name="location.pinCode"
                value={formData.location.pinCode}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Pin Code</label>
            </div>

            <div className="float-container">
              <input
                type="number"
                name="location.gpsCoordinates.latitude"
                value={formData.location.gpsCoordinates.latitude}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Latitude</label>
            </div>

            <div className="float-container">
              <input
                type="number"
                name="location.gpsCoordinates.longitude"
                value={formData.location.gpsCoordinates.longitude}
                onChange={handleChange}
                className="float-input"
                placeholder=""
              />
              <label className="float-label">Longitude</label>
            </div>

          </div>
        </div>


        {/* Submit Button */}
        <div className="text-right">
          <button type="submit" className="submit-btn">
            {isEditing ? "Updaet" : "Add"} Ambulance
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAmbulance;

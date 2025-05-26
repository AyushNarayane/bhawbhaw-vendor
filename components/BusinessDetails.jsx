import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA-O7p9yeKtwXARkjn3bXy5phdyDUS-RF8';

const BusinessDetails = ({ data, setData, nextStep, prevStep, isEcommerce, isService }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    establishmentYear: "",
    brandName: "",
    pickupAddress: "",
    gstNumber: "",
    panNumber: "",
    pinCode: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  }); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState('');

  useEffect(() => {
    setFormData(data);
    
    if (!GOOGLE_MAPS_API_KEY) {
      setMapsError('Google Maps API key is not configured');
      console.error('Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.');
      return;
    }

    // Check if Google Maps API is already loaded
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setMapsLoaded(true);
        setMapsError('');
      };
      
      script.onerror = () => {
        setMapsError('Failed to load Google Maps API');
        console.error('Failed to load Google Maps API');
      };
      
      document.head.appendChild(script);
    } else {
      setMapsLoaded(true);
    }
  }, [data]);

  const getCoordinates = async () => {
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error('Google Maps API key is not configured');
      return;
    }

    if (!formData.pickupAddress) {
      toast.error('Please enter a pickup address first');
      return;
    }
    
    if (!window.google?.maps) {
      toast.error('Google Maps is still loading. Please try again in a moment.');
      return;
    }
    
    setGeocoding(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: formData.pickupAddress }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0]);
          } else {
            reject(status);
          }
        });
      });

      const { lat, lng } = result.geometry.location;
      const newFormData = {
        ...formData,
        latitude: lat().toString(),
        longitude: lng().toString()
      };
      setFormData(newFormData);
      setData(newFormData);
      toast.success('Coordinates updated successfully');
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error(error === 'ZERO_RESULTS' 
        ? 'No coordinates found for this address' 
        : 'Could not get coordinates from address');
    } finally {
      setGeocoding(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setData({ ...formData, [name]: value });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const validateGst = (gst) => gst.length === 15;

  const validateEstablishmentYear = (year) => year >= 1950 && year <= 2025;

  const validatePinCode = async (pincode) => {
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setPincodeError('PIN code must be 6 digits');
      return false;
    }

    setPincodeLoading(true);
    setPincodeError('');

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      
      setPincodeLoading(false);
      
      if (data && data[0]?.Status === "Success") {
        const postOffice = data[0]?.PostOffice?.[0];
        if (postOffice) {
          setFormData(prev => ({
            ...prev,
            city: postOffice.District || "",
            state: postOffice.State || "",
          }));
          return true;
        }
      }
      
      setPincodeError('Invalid PIN code');
      return false;
    } catch (error) {
      console.error("Failed to validate pincode:", error);
      setPincodeError('Failed to validate PIN code');
      setPincodeLoading(false);
      return false;
    }
  };

  const handleSave = async () => {
    const requiredFields = isService && !isEcommerce
      ? ["businessName", "establishmentYear", "brandName", "pickupAddress", "panNumber", "pinCode"]
      : ["businessName", "establishmentYear", "brandName", "pickupAddress", "panNumber", "pinCode"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error("Please fill in all fields");
        return;
      }
    }

    if (!validateEstablishmentYear(formData.establishmentYear)) {
      toast.error("Year of establishment must be between 1950 and 2025.");
      return;
    }

    setPincodeLoading(true);
    const isPinCodeValid = await validatePinCode(formData.pinCode);
    setPincodeLoading(false);

    if (!isPinCodeValid) {
      toast.error("Please enter a valid PIN code");
      return;
    }

    if (!validatePan(formData.panNumber)) {
      toast.error("Invalid PAN number format. Please enter a valid PAN.");
      return;
    }

    if (formData.gstNumber && !validateGst(formData.gstNumber)) {
      toast.error("Invalid GST number. GST number should be 15 characters.");
      return;
    }

    setIsSubmitted(true);
    nextStep();
  };

  const isEmpty = (field) => isSubmitted && formData[field].trim() === "";

  return (
    <div className="bg-white sm:px-8 py-8 px-3 rounded-lg shadow-lg font-montserrat">
      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4">
        <div>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            onFocus={() => handleFocus("businessName")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty("businessName")
                ? "border-red-500"
                : focusedField === "businessName"
                  ? "border-gray-100"
                  : "border-gray-300"
              } mt-1`}
            placeholder="Name of Business"
          />
          {isEmpty("businessName") && (
            <p className="text-red-500 text-sm mt-1 text-end">
              Required field!
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="establishmentYear"
            value={formData.establishmentYear}
            onChange={handleChange}
            onFocus={() => handleFocus("establishmentYear")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty("establishmentYear")
                ? "border-red-500"
                : focusedField === "establishmentYear"
                  ? "border-gray-100"
                  : "border-gray-300"
              } mt-1`}
            placeholder="Year of Establishment"
          />
          {isEmpty("establishmentYear") && (
            <p className="text-red-500 text-sm mt-1 text-end">
              Required field!
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4">
        <div>
          <input
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            onFocus={() => handleFocus("brandName")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty("brandName")
                ? "border-red-500"
                : focusedField === "brandName"
                  ? "border-gray-100"
                  : "border-gray-300"
              } mt-1`}
            placeholder="Brand Name"
          />
          {isEmpty("brandName") && (
            <p className="text-red-500 text-sm mt-1 text-end">
              Required field!
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type="text"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              onFocus={() => handleFocus("pickupAddress")}
              onBlur={handleBlur}
              className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty("pickupAddress")
                  ? "border-red-500"
                  : focusedField === "pickupAddress"
                    ? "border-gray-100"
                    : "border-gray-300"
                } mt-1`}
              placeholder="Pickup Address"
            />
            <button
              onClick={getCoordinates}
              disabled={geocoding || !mapsLoaded || !!mapsError}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-[#85716B] text-white rounded disabled:opacity-50"
              type="button"
              title={mapsError || (geocoding ? 'Getting coordinates...' : 'Get coordinates from address')}
            >
              {geocoding ? 'Getting...' : 'Get Coordinates'}
            </button>
          </div>
          {isEmpty("pickupAddress") && (
            <p className="text-red-500 text-sm mt-1 text-end">
              Required field!
            </p>
          )}
          {mapsError && (
            <p className="text-red-500 text-sm mt-1">
              {mapsError}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4">
        <div>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            onFocus={() => handleFocus("pinCode")}
            onBlur={async (e) => {
              handleBlur();
              if (e.target.value) {
                await validatePinCode(e.target.value);
              }
            }}
            maxLength={6}
            className={`w-full p-3 sm:text-md text-sm border-b ${
              pincodeError ? 'border-red-500' : 
              isEmpty("pinCode") ? "border-red-500" :
              focusedField === "pinCode" ? "border-gray-100" : "border-gray-300"
            } mt-1`}
            placeholder="PIN Code"
          />
          {pincodeLoading && (
            <span className="absolute right-3 transform -translate-y-8">
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
          {pincodeError && <p className="text-red-500 text-sm mt-1">{pincodeError}</p>}
          {isEmpty("pinCode") && !pincodeError && (
            <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            onFocus={() => handleFocus("panNumber")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty("panNumber")
                ? "border-red-500"
                : focusedField === "panNumber"
                  ? "border-gray-100"
                  : "border-gray-300"
              } mt-1`}
            placeholder="PAN Number"
          />
          {isEmpty("panNumber") && (
            <p className="text-red-500 text-sm mt-1 text-end">
              Required field!
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4">
        <div>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            onFocus={() => handleFocus("gstNumber")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${
              focusedField === "gstNumber" ? "border-gray-100" : "border-gray-300"
            } mt-1`}
            placeholder="GST Number (if applicable)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4">
        <div>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            onFocus={() => handleFocus("latitude")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${
              focusedField === "latitude" ? "border-gray-100" : "border-gray-300"
            } mt-1`}
            placeholder="Latitude"
            readOnly
          />
        </div>
        <div>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            onFocus={() => handleFocus("longitude")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${
              focusedField === "longitude" ? "border-gray-100" : "border-gray-300"
            } mt-1`}
            placeholder="Longitude"
            readOnly
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded xs:text-sm text-xs"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="px-4 py-2 bg-[#85716B] xs:text-sm text-xs text-white rounded disabled:opacity-50"
          onClick={handleSave}
        >
          Proceed to Bank Details
        </button>
      </div>
    </div>
  );
};

export default BusinessDetails;

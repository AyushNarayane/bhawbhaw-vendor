// BusinessDetails.js
import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';

const BusinessDetails = ({ data, setData, nextStep, prevStep, isEcommerce, isService }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    establishmentYear: "",
    brandName: "",
    pickupAddress: "",
    gstNumber: "",
    panNumber: "",
    pinCode: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    setFormData(data);
  }, [data]);

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
  const validatePinCode = async (pincode) => {
    try {
      const response = await fetch(
        `https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${pincode}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "f124f1d4b3msh88b845451b505a0p18243bjsnce20548aafe4",
            "X-RapidAPI-Host": "india-pincode-with-latitude-and-longitude.p.rapidapi.com",
          },
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Failed to validate pincode:", error);
      return false;
    }
  };

  const handleSave = async () => {
    const requiredFields = isService && !isEcommerce
      ? ["businessName", "establishmentYear", "brandName", "pickupAddress", "panNumber", "pinCode"]
      : ["businessName", "establishmentYear", "brandName", "pickupAddress", "gstNumber", "panNumber", "pinCode"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error("Please fill in all fields");
        return;
      }
    }

    const isPinCodeValid = await validatePinCode(formData.pinCode);
    if (!isPinCodeValid) {
      toast.error("Invalid PIN code.");
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
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty("businessName")
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
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty("establishmentYear")
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
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty("brandName")
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
          <input
            type="text"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            onFocus={() => handleFocus("pickupAddress")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty("pickupAddress")
                ? "border-red-500"
                : focusedField === "pickupAddress"
                ? "border-gray-100"
                : "border-gray-300"
            } mt-1`}
            placeholder="Pickup Address"
          />
          {isEmpty("pickupAddress") && (
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
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            onFocus={() => handleFocus("pinCode")}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty("pinCode")
                ? "border-red-500"
                : focusedField === "pinCode"
                ? "border-gray-100"
                : "border-gray-300"
            } mt-1`}
            placeholder="PIN Code"
          />
          {isEmpty("pinCode") && (
            <p className="text-red-500 text-sm mt-1 text-end">
              Required field!
            </p>
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
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty("panNumber")
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
      {!isService || isEcommerce ? (
          <div>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              onFocus={() => setFocusedField("gstNumber")}
              onBlur={() => setFocusedField("")}
              className={`w-full p-3 sm:text-md text-sm border-b ${
                isEmpty("gstNumber") ? "border-red-500" : focusedField === "gstNumber" ? "border-gray-100" : "border-gray-300"
              } mt-1`}
              placeholder="GST Number"
            />
            {isEmpty("gstNumber") && (
              <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>
            )}
          </div>
        ) : null}
        
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#85716B] text-white rounded xs:text-sm text-xs"
        >
          Proceed to Bank Details
        </button>
      </div>
    </div>
  );
};

export default BusinessDetails;

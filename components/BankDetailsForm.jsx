import React, { useState } from 'react';
import toast from 'react-hot-toast';

const BankDetailsForm = ({ nextStep, prevStep, data, setData, isEcommerce, isService }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const validateIfscCode = async (ifscCode) => {
        try {
            const response = await fetch(`https://api.transferwise.com/v1/validators/ifsc-code?ifscCode=${ifscCode}`, {
                method: "GET",
            });
            return response.ok;
        } catch (error) {
            console.error("Failed to validate IFSC code:", error);
            return false;
        }
    };

    const validateForm = () => {
        return Object.values(data).some((value) => value.trim() === '');
    };

    const handleNext = async () => {
        setIsSubmitted(true);

        if (!data.ifsc || !data.accountNumber || !data.holderName || !data.confirmAccountNumber) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (data.accountNumber !== data.confirmAccountNumber) {
            toast.error("Account numbers do not match.");
            return;
        }

        const isIfscValid = await validateIfscCode(data.ifsc);
        if (!isIfscValid) {
            toast.error("Invalid IFSC code.");
            return;
        }

        if (!validateForm()) {
            nextStep();
        } else {
            toast.error("Please fill out all fields.");
        }
    };

    const isEmpty = (field) => isSubmitted && data[field] === '';

    return (
        <div className="bg-white sm:px-8 py-8 px-3 rounded-lg shadow-lg font-montserrat">
            <div className="mb-4">
                <input
                    type="text"
                    name="ifsc"
                    value={data.ifsc}
                    onChange={handleChange}
                    className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('ifsc') ? 'border-red-500' : 'border-gray-300'} mt-1`}
                    placeholder="Enter IFSC Code"
                />
                {isEmpty('ifsc') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    name="holderName"
                    value={data.holderName}
                    onChange={handleChange}
                    className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('holderName') ? 'border-red-500' : 'border-gray-300'} mt-1`}
                    placeholder="Enter Account Holder Name"
                />
                {isEmpty('holderName') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    name="accountNumber"
                    value={data.accountNumber}
                    onChange={handleChange}
                    className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('accountNumber') ? 'border-red-500' : 'border-gray-300'} mt-1`}
                    placeholder="Enter Account Number"
                />
                {isEmpty('accountNumber') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    name="confirmAccountNumber"
                    value={data.confirmAccountNumber}
                    onChange={handleChange}
                    className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('confirmAccountNumber') ? 'border-red-500' : 'border-gray-300'} mt-1`}
                    placeholder="Confirm Account Number"
                />
                {isEmpty('confirmAccountNumber') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
            </div>
            <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded xs:text-sm text-xs">
                    Back
                </button>
                <button 
                    onClick={handleNext} 
                    disabled={validateForm()}
                    className="px-4 py-2 bg-[#85716B] xs:text-sm text-xs text-white rounded disabled:opacity-50"
                >
                    Proceed to Document Upload
                </button>
            </div>
        </div>
    );
};

export default BankDetailsForm;

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const BankDetailsForm = ({ nextStep, prevStep, data, setData, isEcommerce, isService }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ifscLoading, setIfscLoading] = useState(false);
    const [ifscError, setIfscError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'ifsc') {
            setIfscError('');
            // Convert to uppercase for IFSC
            setData({ ...data, [name]: value.toUpperCase() });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const validateIfscCode = async (ifscCode) => {
        // First check the IFSC format
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(ifscCode)) {
            setIfscError('Invalid IFSC format');
            return false;
        }

        setIfscLoading(true);
        setIfscError('');

        try {
            const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
            const data = await response.json();
            
            setIfscLoading(false);
            
            if (response.ok && data.BANK) {
                setIfscError('');
                return true;
            } else {
                setIfscError('Invalid IFSC code');
                return false;
            }
        } catch (error) {
            console.error("Failed to validate IFSC code:", error);
            setIfscError('Failed to validate IFSC code');
            setIfscLoading(false);
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

        // Add loading state while validating IFSC
        setIfscLoading(true);
        const isIfscValid = await validateIfscCode(data.ifsc);
        setIfscLoading(false);

        if (!isIfscValid) {
            toast.error("Please enter a valid IFSC code");
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
            <div className="mb-4 relative">
                <input
                    type="text"
                    name="ifsc"
                    value={data.ifsc}
                    onChange={handleChange}
                    className={`w-full p-3 sm:text-md text-sm border-b ${
                        ifscError ? 'border-red-500' : isEmpty('ifsc') ? 'border-red-500' : 'border-gray-300'
                    } mt-1`}
                    placeholder="Enter IFSC Code"
                    maxLength={11}
                />
                {ifscLoading && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </span>
                )}
                {ifscError && <p className="text-red-500 text-sm mt-1">{ifscError}</p>}
                {isEmpty('ifsc') && !ifscError && <p className="text-red-500 text-sm mt-1">Required field!</p>}
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

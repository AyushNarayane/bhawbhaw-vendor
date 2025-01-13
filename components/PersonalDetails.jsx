import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
const PersonalDetails = ({ nextStep, data, setData, userId, setUid }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    refCode: '',  
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    const updatedFormData = { ...formData, [name]: newValue };
    setFormData(updatedFormData);
    setData(updatedFormData);
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField('');

  const handleSave = async () => {
    const { fullName, email, phoneNumber, password, confirmPassword, refCode } = formData;

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Only validate refCode if it's not empty
    if (refCode && (refCode.length !== 6 || /\d/.test(refCode))) {
      toast.error("Referral code must be 6 characters long and contain no numbers");
      return;
    }

    try {
      setIsSubmitted(true);
      setLoading(true);

      // Create new user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      setUid(uid);

      const response = await fetch('/api/auth/addPersonalDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalDetails: {
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          },
          userId,
          uid: userCredential.user.uid,
          status: 'isInitiated'
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save personal details");
      }

      await signOut(auth);
      nextStep();

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error("Email is already registered. Please use a different email.");
          break;
        case 'auth/invalid-email':
          toast.error("Invalid email format. Please enter a valid email.");
          break;
        case 'auth/weak-password':
          toast.error("Password is too weak. Use a stronger password.");
          break;
        case 'auth/operation-not-allowed':
          toast.error("This operation is not allowed. Please contact support.");
          break;
        case 'auth/network-request-failed':
          toast.error("Network error. Please check your internet connection.");
          break;
        default:
          toast.error(error.message || "Failed to complete registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = (field) => isSubmitted && formData[field].trim() === '';

  return (
    <div className="bg-white sm:px-8 py-8 px-3 rounded-lg shadow-lg font-montserrat">
      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4">
        <div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onFocus={() => handleFocus('fullName')}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('fullName') ? 'border-red-500' : focusedField === 'fullName' ? 'border-gray-100' : 'border-gray-300'} mt-1`}
            placeholder="Full Name"
          />
          {isEmpty('fullName') && <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('email') ? 'border-red-500' : focusedField === 'email' ? 'border-gray-100' : 'border-gray-300'} mt-1`}
            placeholder="Email Address"
          />
          {isEmpty('email') && <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4 items-center">
        <div>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onFocus={() => handleFocus('phoneNumber')}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('phoneNumber') ? 'border-red-500' : focusedField === 'phoneNumber' ? 'border-gray-100' : 'border-gray-300'} mt-1`}
            placeholder="Phone Number"
          />
          {isEmpty('phoneNumber') && <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('password') ? 'border-red-500' : focusedField === 'password' ? 'border-gray-100' : 'border-gray-300'} mt-1`}
            placeholder="Password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
          </span>
          {isEmpty('password') && <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4">
        <div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${isEmpty('confirmPassword') ? 'border-red-500' : focusedField === 'confirmPassword' ? 'border-gray-100' : 'border-gray-300'} mt-1`}
            placeholder="Confirm Password"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          >
           
          </span>
          {isEmpty('confirmPassword') && <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>}
        </div>

        <div>
          <input
            type="text"
            name="refCode"
            value={formData.refCode}
            onChange={handleChange}
            onFocus={() => handleFocus('refCode')}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${focusedField === 'refCode' ? 'border-gray-100' : 'border-gray-300'} mt-1`}
            placeholder="Referral Code (Optional)"
          />
          
        </div>
      </div>

      <div className="w-full flex justify-end">
        <button
          className="bg-[#85716B] text-white px-4 py-2 rounded mt-4 xs:text-sm text-xs"
          onClick={handleSave}
        >
          {loading ? 'Loading...' : 'Proceed to Category Details'}
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
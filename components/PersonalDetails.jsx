import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { db } from '@/firebase';
import { doc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const PersonalDetails = ({ nextStep, data, setData, userId, setUid }) => {
  const [formData, setFormData] = useState({
    name: '',
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
    const { name, email, phoneNumber, password, confirmPassword, refCode } = formData;

    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
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

    if (!/\d/.test(password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    if (!/[a-zA-Z]/.test(password)) {
      toast.error("Password must contain at least one letter");
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

      // Check if the email is already in use
      const vendorsRef = collection(db, 'vendors');
      const emailQuery = query(vendorsRef, where("personalDetails.email", "==", email));
      const querySnapshot = await getDocs(emailQuery);
      
      if (!querySnapshot.empty) {
        toast.error("This email is already in use. Please use a different email.");
        setLoading(false);
        return;
      }

      // Save to Firestore with password
      const vendorRef = doc(db, 'vendors', userId);
      await setDoc(vendorRef, {
        personalDetails: {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          password: password // Add password to the document
        },
        status: 'initiated',
        createdAt: serverTimestamp(),
        id: userId
      }, { merge: true });

      toast.success("Personal details saved successfully!");
      nextStep();

    } catch (error) {
      console.error('Error saving personal details:', error);
      toast.error("Failed to save personal details");
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = (field) => isSubmitted && formData[field].trim() === '';

  return (
    <div className="bg-white sm:px-8 px-4 py-8 rounded-lg shadow-lg font-montserrat">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-14">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => handleFocus('name')}
            onBlur={handleBlur}
            className={`w-full p-3 text-sm sm:text-md border-b ${
              isEmpty('name') ? 'border-red-500' : 
              focusedField === 'name' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
            placeholder="Full Name"
          />
          {isEmpty('name') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            className={`w-full p-3 text-sm sm:text-md border-b ${
              isEmpty('email') ? 'border-red-500' : 
              focusedField === 'email' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
            placeholder="Email Address"
          />
          {isEmpty('email') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-14 mt-6">
        <div>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onFocus={() => handleFocus('phoneNumber')}
            onBlur={handleBlur}
            className={`w-full p-3 text-sm sm:text-md border-b ${
              isEmpty('phoneNumber') ? 'border-red-500' : 
              focusedField === 'phoneNumber' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
            placeholder="Phone Number"
          />
          {isEmpty('phoneNumber') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={handleBlur}
            className={`w-full p-3 text-sm sm:text-md border-b ${
              isEmpty('password') ? 'border-red-500' : 
              focusedField === 'password' ? 'border-gray-100' : 'border-gray-300'
            } mt-1 pr-10`}
            placeholder="Password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </span>
          {isEmpty('password') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-14 mt-6">
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={handleBlur}
            className={`w-full p-3 text-sm sm:text-md border-b ${
              isEmpty('confirmPassword') ? 'border-red-500' : 
              focusedField === 'confirmPassword' ? 'border-gray-100' : 'border-gray-300'
            } mt-1 pr-10`}
            placeholder="Confirm Password"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </span>
          {isEmpty('confirmPassword') && <p className="text-red-500 text-sm mt-1">Required field!</p>}
        </div>

        <div>
          <input
            type="text"
            name="refCode"
            value={formData.refCode}
            onChange={handleChange}
            onFocus={() => handleFocus('refCode')}
            onBlur={handleBlur}
            className={`w-full p-3 text-sm sm:text-md border-b ${
              focusedField === 'refCode' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
            placeholder="Referral Code (Optional)"
          />
        </div>
      </div>

      <div className="w-full flex justify-end mt-8">
        <button
          className="bg-[#85716B] text-white px-6 py-3 rounded-lg text-sm sm:text-base w-full sm:w-auto"
          onClick={handleSave}
        >
          {loading ? 'Loading...' : 'Proceed to Category Details'}
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
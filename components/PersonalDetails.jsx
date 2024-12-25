import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '@/firebase';

const PersonalDetails = ({ nextStep, data, setData, userId, setUid}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [data]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');

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
    const { fullName, email, phoneNumber, password, confirmPassword } = formData;

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
  
    try {
      setIsSubmitted(true);
      setLoading(true);

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
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await signOut(auth);
        nextStep();
      } else {
        toast.error(result.error || "Failed to save personal details");
      }

    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error("Email is already in use. Please use a different email.");
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
          toast.error("An error occurred. Please try again later.");
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
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty('fullName') ? 'border-red-500' : focusedField === 'fullName' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
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
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty('email') ? 'border-red-500' : focusedField === 'email' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
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
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty('phoneNumber') ? 'border-red-500' : focusedField === 'phoneNumber' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
            placeholder="Phone Number"
          />
          {isEmpty('phoneNumber') && <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>}
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty('password') ? 'border-red-500' : focusedField === 'password' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
            placeholder="Password"
          />
          {isEmpty('password') && <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-14 gap-5 mb-4">
        <div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={handleBlur}
            className={`w-full p-3 sm:text-md text-sm border-b ${
              isEmpty('confirmPassword') ? 'border-red-500' : focusedField === 'confirmPassword' ? 'border-gray-100' : 'border-gray-300'
            } mt-1`}
            placeholder="Confirm Password"
          />
          {isEmpty('confirmPassword') && <p className="text-red-500 text-sm mt-1 text-end">Required field!</p>}
        </div>
      </div>

      <div className="w-full flex justify-end">
        <button
          className="bg-[#85716B] text-white px-4 py-2 rounded mt-4 xs:text-sm text-xs"
          onClick={handleSave}
        >
          {loading ? 'Loading...' : 'Proceed to Business Details'}
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;

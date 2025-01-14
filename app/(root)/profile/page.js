"use client";

import { useAuth } from "@/hooks/auth-context";
import { useEffect, useState } from "react";
import { FiMail, FiUser, FiBriefcase, FiAward, FiShield, FiDollarSign, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';

const InfoRow = ({ icon, label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-gray-50 rounded-lg text-[#B29581]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-gray-900 mt-1">{value || 'Not provided'}</p>
      </div>
    </div>
  </motion.div>
);

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      console.log('Current User Data:', currentUser); // For debugging
      setUserData({
        name: currentUser.personalDetails?.name || '',
        email: currentUser.personalDetails?.email || '',
        brandName: currentUser.businessDetails?.brandName || '',
        businessName: currentUser.businessDetails?.businessName || '',
        subscription: currentUser.businessDetails?.subscription || '',
        id: currentUser?.id || '',
        bankName: currentUser.bankDetails?.bankName || currentUser.bankingDetails?.bankName || '',
        accountNumber: currentUser.bankDetails?.accountNumber || currentUser.bankingDetails?.accountNumber || '',
        ifscCode: currentUser.bankDetails?.ifsc || currentUser.bankingDetails?.ifsc || '',
        accountHolderName: currentUser.bankDetails?.holderName || currentUser.bankingDetails?.holderName || '',
        categories: currentUser.businessDetails?.categories || [],
        gst: currentUser.businessDetails?.gstNumber || currentUser.taxDetails?.gst || '',
        pan: currentUser.businessDetails?.panNumber || currentUser.taxDetails?.pan || '',

      });
    }
  }, [currentUser]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#B29581] to-[#C5A88F] rounded-3xl p-12 mb-12 shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome Back, {userData?.name}!
            </h1>
            <p className="text-xl text-white/80">
              Manage your vendor profile and view your business details
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#B29581] to-[#C5A88F] p-8">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-xl overflow-hidden">
                  <img
                    src={currentUser?.documents?.photo || '/default-avatar.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">{userData?.brandName}</h2>
                <p className="text-gray-500 mt-2">Brand ID: {userData?.id}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800">
                    {userData?.subscription} Plan
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiUser className="mr-2" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow icon={<FiUser />} label="Name" value={userData?.name} />
                <InfoRow icon={<FiMail />} label="Email" value={userData?.email} />
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiBriefcase className="mr-2" /> Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow icon={<FiBriefcase />} label="Brand" value={userData?.brandName} />
                <InfoRow icon={<FiAward />} label="Business" value={userData?.businessName} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiDollarSign className="mr-2" /> Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow
                  icon={<FiDollarSign />}
                  label="Bank Name"
                  value={userData?.ifscCode ? userData.ifscCode.slice(0, 4) : 'Not provided'}
                />
                <InfoRow
                  icon={<FiDollarSign />}
                  label="Account Number"
                  value={userData?.accountNumber ? `XXXX${userData.accountNumber.slice(-4)}` : 'Not provided'}
                />
                <InfoRow
                  icon={<FiDollarSign />}
                  label="IFSC Code"
                  value={userData?.ifscCode}
                />
                <InfoRow
                  icon={<FiUser />}
                  label="Account Holder"
                  value={userData?.accountHolderName}
                />
              </div>
            </div>

            {/* Tax Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiBriefcase className="mr-2" /> Tax Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow
                  icon={<FiBriefcase />}
                  label="GST Number"
                  value={userData?.gst}
                />
                <InfoRow
                  icon={<FiBriefcase />}
                  label="PAN Number"
                  value={userData?.pan && `XXXXX${userData.pan.slice(-4)}`}
                />
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiTag className="mr-2" /> Product Categories
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex flex-wrap gap-3">
                  {userData?.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#B29581]/10 text-[#B29581] rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiShield className="mr-2" /> Security
              </h3>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-600 mb-4">Protect your account with a strong password</p>
                <button
                  onClick={() => window.location.href = '/forgot-password'}
                  className="bg-[#B29581] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#A08471] transition-colors duration-300 flex items-center"
                >
                  <FiShield className="mr-2" /> Reset Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
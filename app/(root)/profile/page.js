"use client";

import { useAuth } from "@/hooks/auth-context";
import { useEffect, useState } from "react";
import { FiMail, FiUser, FiBriefcase, FiAward, FiShield, FiDollarSign, FiTag, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from "react-hot-toast";
import { updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";

// Password Reset Modal Component
const PasswordResetModal = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [needsReauth, setNeedsReauth] = useState(false);
  const { currentUser } = useAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in both password fields');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current user from Firebase Auth
      const user = auth.currentUser;
      
      if (!user) {
        toast.error('You must be logged in to change your password');
        onClose();
        return;
      }
      
      // Update the password
      await updatePassword(user, newPassword);
      
      toast.success('Password updated successfully!');
      onClose();
      
    } catch (error) {
      console.error('Error updating password:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        setNeedsReauth(true);
      } else {
        toast.error('Failed to update password. Please try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!currentUser?.personalDetails?.email) {
      toast.error('Email address not found');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.personalDetails.email);
      toast.success('Password reset link sent to your email');
      onClose();
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        
        {needsReauth ? (
          <div className="text-center">
            <FiAlertCircle className="mx-auto text-amber-500 text-4xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              For security reasons, you need to re-authenticate before changing your password. 
              We can send a password reset link to your email instead.
            </p>
            <button
              onClick={handleSendResetEmail}
              disabled={loading}
              className={`w-full bg-[#B29581] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#A08471] transition-colors duration-300 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sending...' : 'Send Reset Link to Email'}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>
            
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B29581]"
                  placeholder="Enter new password"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B29581]"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
                  <FiAlertCircle className="mr-2" />
                  {passwordError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#B29581] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#A08471] transition-colors duration-300 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

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
  const [bankName, setBankName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBankName = async (ifscCode) => {
    try {
      const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      const data = await response.json();
      return data.BANK;
    } catch (error) {
      console.error('Error fetching bank name:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (currentUser) {
        const ifscCode = currentUser.bankDetails?.ifsc || currentUser.bankingDetails?.ifsc;
        let bankNameFromIfsc = '';
        
        if (ifscCode) {
          bankNameFromIfsc = await fetchBankName(ifscCode);
        }

        setUserData({
          name: currentUser.personalDetails?.name || '',
          email: currentUser.personalDetails?.email || '',
          brandName: currentUser.businessDetails?.brandName || '',
          businessName: currentUser.businessDetails?.businessName || '',
          subscription: currentUser.businessDetails?.subscription || '',
          id: currentUser?.id || '',
          bankName: bankNameFromIfsc || 'Not available',
          accountNumber: currentUser.bankDetails?.accountNumber || currentUser.bankingDetails?.accountNumber || '',
          ifscCode: currentUser.bankDetails?.ifsc || currentUser.bankingDetails?.ifsc || '',
          accountHolderName: currentUser.bankDetails?.holderName || currentUser.bankingDetails?.holderName || '',
          categories: currentUser.businessDetails?.categories || [],
          gst: currentUser.businessDetails?.gstNumber || currentUser.taxDetails?.gst || '',
          pan: currentUser.businessDetails?.panNumber || currentUser.taxDetails?.pan || '',
        });
      }
    };

    initializeData();
  }, [currentUser]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
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
                  value={userData?.bankName}
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
           

            {/* Security Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiShield className="mr-2" /> Security
              </h3>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-600 mb-4">Protect your account with a strong password</p>
                <button
                  onClick={() => setIsModalOpen(true)}
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
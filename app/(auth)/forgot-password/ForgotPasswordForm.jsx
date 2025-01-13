"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logoHeader.png";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        toast.error("Please enter a valid email.");
        return;
      }

      // Check if user exists
      const usersRef = collection(db, "vendors");
      const q = query(usersRef, where("personalDetails.email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("No vendor found with this email.");
        return;
      }

      // Send password reset email if user exists
      await sendPasswordResetEmail(auth, email);
      toast.success("Check your email for further instructions.");
    } catch (err) {
      console.error("Error sending reset email:", err);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-h-screen p-8 rounded-3xl shadow-lg w-3/4 my-8 mx-4 max-lg:w-full lg:pt-10 lg:px-20 lg:pb-32">
      <div className="flex justify-start mb-7">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <h2 className="text-left text-lg text-gray-600 mb-5">Reset Your Password</h2>
      <p className="text-left text-sm font-medium mb-6 text-gray-500">
        Enter your email address to receive password reset instructions.
      </p>
      <form className="mt-10" onSubmit={handlePasswordReset}>
        <div className="mb-4">
          <label
            className="block text-black text-sm mb-2 font-poppins"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className={`w-full lg:w-fit lg:rounded-full ${
              loading ? "bg-gray-400" : "bg-red-500"
            } text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-yellow-400`}
            disabled={loading}
          >
            <span>{loading ? "Loading..." : "Send Link"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>
      </form>
      <div>
        <p className="text-center mt-4 text-gray-500">
          <span>Back to login? </span>
          <Link href="/signin" className="text-red-500 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

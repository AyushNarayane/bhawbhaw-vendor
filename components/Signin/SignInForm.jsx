"use client";

import React, { useEffect, useState } from "react";
import logo from "../../public/logoHeader.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const SignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && user?.name) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
        // You might want to show a loading state here
      }
    });
    return () => unsubscribe();
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First attempt to sign in
      await signInWithEmailAndPassword(auth, email, password);

      // If sign in successful, check user status
      const usersRef = collection(db, "vendors");
      const q = query(usersRef, where("personalDetails.email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("No vendor found with this email");
        await auth.signOut(); // Sign out if no vendor record found
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const status = userData.status;

      if (status !== "verified") {
        toast.error("Your account is pending verification. Please wait for admin approval.");
        await auth.signOut(); // Sign out if not verified
        setLoading(false);
        return;
      }

      // If everything is okay, dispatch user data and redirect
      dispatch(
        setUser({
          userData: {
            name: userData.personalDetails?.name || "Unknown",
            email: userData.personalDetails?.email,
            status: status,
          },
          userId: userDoc.id,
        })
      );

      toast.success("Login successful");
      router.push("/dashboard");

    } catch (error) {
      console.error("Error signing in:", error);
      if (error.code === 'auth/invalid-login-credentials') {
        toast.error("Incorrect email or password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        toast.error("No user found with this email.");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-h-screen p-8 rounded-3xl shadow-lg w-3/4 my-8 mx-4 max-lg:w-full lg:pt-10 lg:px-20 lg:pb-32">
      <Toaster />
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
      <h2 className="text-left text-lg text-baw-light-gray mb-5">Welcome back !!!</h2>
      <h1 className="text-left text-4xl font-bold mb-6">Seller Sign in</h1>
      <form className="mt-10" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black text-sm mb-2 font-poppins" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6 font-poppins mt-10">
          <label className="text-black text-sm mb-2 font-poppins flex justify-between" htmlFor="password">
            Password
            <Link href="/forgot-password" className="text-sm text-gray-500 ml-4">Forgot Password?</Link>
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              id="password"
              className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400 pr-12"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className="w-full lg:w-fit lg:rounded-full bg-red-500 text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-yellow-400"
            disabled={loading}
          >
            <span>{loading ? "Signing In..." : "SIGN IN"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>
      </form>

      <div>
        <p className="text-center mt-4 text-gray-500">
          <span>Don&apos;t have an account? </span>
          <Link href="/signup" className="text-red-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

SignInForm.displayName = "SignInForm";

export default SignInForm;

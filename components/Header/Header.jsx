"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/auth-context";
import ClipLoader from "react-spinners/ClipLoader";
import { FaBars, FaHome, FaUser, FaInfoCircle, FaSignOutAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import logo from "../../public/logoHeader.png";
import Noti from "../../public/Notification.png";
import Link from 'next/link';
import profile from "../../public/profile.png";
import darrow from "../../public/darrow.png";

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }
  }, [currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  if (loading) {
    return (
      <div className="absolute top-[50%] left-[50%] items-center justify-center w-screen h-20 z-10">
        <ClipLoader
          color={"#85716B"}
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="md:min-h-[4rem] fixed left-0 min-h-[5rem] z-20 w-full flex md:flex-row justify-between items-center py-2 md:py-1 md:px-12 px-2 flex-col-reverse gap-4 bg-white border-b-2 border-gray-200">
      <div className="flex justify-center items-center w-full md:w-auto">
        <Link href="/">
          <Image src={logo} height={100} width={100} alt="Logo" />
        </Link>
      </div>

      <div className="flex justify-end lg:flex-1">
        <div className="lg:flex gap-5 items-center hidden relative" ref={dropdownRef}>
          {/* <Image src={Noti} width={25} height={25} alt="Notification" /> */}
          <div className="flex gap-3 items-center cursor-pointer" onClick={toggleDropdown}>
            <h1 className="font-semibold">Hello {currentUser?.personalDetails?.name}!!</h1>
            <Image src={currentUser?.documents?.photo} height={40} width={40} alt="Profile" className="h-10 w-10 max-h-10 rounded-full" />
            {/* {isOpen ? (
              <FaChevronUp className="h-4 w-4 text-slate-300" />
            ) : (
              <FaChevronDown className="h-4 w-4 text-slate-300" />
            )} */}
          </div>

          {/* {isOpen && (
            <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg z-40">
              <button
                onClick={() => router.push("/")}
                className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
              >
                <FaHome className="mr-2" /> Home
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
              >
                <FaUser className="mr-2" /> Profile
              </button>
              <button
                onClick={() => router.push("/about")}
                className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
              >
                <FaInfoCircle className="mr-2" /> About
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Header;

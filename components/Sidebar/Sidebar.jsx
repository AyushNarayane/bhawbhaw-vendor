"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/auth-context";
import { FaRegUser } from "react-icons/fa";
import {
  FiHome,
  FiHelpCircle,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { BsBoxSeam, BsBox2, BsWallet2 } from "react-icons/bs";
import { PiWalletThin } from "react-icons/pi";
import { RiCoupon2Line } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { isEcommerce, isService } = currentUser?.personalDetails || {};

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={`w-[15rem] shadow-lg bg-white fixed left-0 transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="p-4 sidebar-scrollbar h-full max-h-screen overflow-y-auto flex flex-col">
          <div className="mb-6">
            <div
              className="flex items-center space-x-2 mb-4 cursor-pointer"
              onClick={toggleSidebar}
            >
              <FiX className="block lg:hidden h-6 w-6 text-gray-700" />
            </div>

            <div className="space-y-5 mb-15">
              <SidebarLink Icon={FiHome} label="Dashboard" href="/dashboard" />
              <SidebarLink Icon={BsBoxSeam} label="Products" href="/products" />

              {(isEcommerce || (isEcommerce && isService)) && (
                <SidebarLink Icon={BsBox2} label="Orders" href="/orders" />
              )}
              {(isService || (isEcommerce && isService)) && (
                <>
                  <SidebarLink Icon={PiWalletThin} label="Bookings" href="/bookings" />
                  <SidebarLink Icon={PiWalletThin} label="Services" href="/services" />
                </>
              )}

              <SidebarLink Icon={BsWallet2} label="Payments" href="/payments" />
              <SidebarLink Icon={FiHelpCircle} label="Helpdesk" href="/helpdesk" />
              <SidebarLink Icon={RiCoupon2Line} label="Coupons" href="/coupons" />
              <SidebarLink Icon={FaRegUser} label="Profile" href="/profile" />
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex mb-4 items-center space-x-2 text-gray-700 hover:bg-[#F3EAE7] px-2 py-2 rounded-md cursor-pointer w-full"
            >
              <FiLogOut className="h-5 w-5" />
              <span className="text-gray-700">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

const SidebarLink = ({ Icon, label, href }) => (
  <Link href={href}>
    <div className="flex mb-4 items-center space-x-2 text-gray-700 hover:bg-[#F3EAE7] px-2 py-2 rounded-md cursor-pointer">
      <Icon className="h-5 w-5" />
      <span className="text-gray-700">{label}</span>
    </div>
  </Link>
);

export default Sidebar;

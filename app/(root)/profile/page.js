"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/hooks/auth-context";
import { useEffect} from "react";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Handle change detection for "Save Changes" and "Cancel Changes" buttons
  const handleGstChange = (e) => {
    setGstNumber(e.target.value);
    setIsDirty(e.target.value !== currentUser?.businessDetails?.gstNumber);
  };

  // Open/Close Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Confirm sending the password reset link
  const confirmSendPasswordLink = () => {
    // Trigger password reset logic here
    console.log("Password reset link sent to:", currentUser.personalDetails?.email);
    closeModal();
  };

  const handleConfirmSendLink = () => {
    // Logic to send password reset link
    closeModal();
    // toast.success("Password reset link sent to your email.");
  };


  useEffect(()=>{
    if(currentUser){
      setGstNumber(currentUser.businessDetails?.gstNumber)
    }
  },[currentUser])

  return (
    <div className="flex flex-col items-center justify-center pt-14">
      <div className="max-w-[65rem] w-full justify-start">
        <h1 className="text-4xl font-bold text-[#B29581] mb-2">
        Hello {currentUser?.personalDetails?.name}!
        </h1>
        <p className="text-md text-[#C5A88F] mb-8">Welcome Back!</p>
      </div>
      <div className="max-w-[65rem] flex w-full bg-white shadow-sm rounded-lg p-8 border border-slate-50">
        {/* First Column */}
        <div className="flex flex-col items-center mx-10">
          <img
            src={currentUser?.documents?.photo}
            alt="Profile Picture"
            className="min-w-36 max-w-40 h-40 rounded-xl object-cover mb-4"
          />
          <button className="-mt-14 px-6 py-2 text-[12px] bg-white rounded-full">
            Change Logo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Second Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm text-[#C5A88F]">
                Name of POC
              </Label>
              <Input
                id="name"
                placeholder="Enter Name of person of contact"
                className="mt-2 rounded-full text-[12px] text-[#C4B0A9] bg-[#F3EAE7]"
                defaultValue={currentUser?.personalDetails?.name}
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-sm text-[#C5A88F]">
                Email
              </Label>
              <Input
                id="name"
                placeholder="Enter Email"
                className="mt-2 rounded-full text-[12px] text-[#C4B0A9] bg-[#F3EAE7]"
                defaultValue={currentUser?.personalDetails?.email}
              />
            </div>

            <div>
              <Label htmlFor="brand-name" className="text-sm text-[#C5A88F]">
                Brand Name
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-2 flex items-center w-full justify-between text-[#C4B0A9]"
                  >
                    {selectedBrand ? selectedBrand : "Select a brand"}
                    <FiChevronDown className="ml-2" /> {/* Arrow Icon */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem
                    onSelect={() => setSelectedBrand("Brand 1")}
                  >
                    Brand 1
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedBrand("Brand 2")}
                  >
                    Brand 2
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Save and Cancel Buttons */}
            <div className="">
              <Label
                htmlFor="brand-name"
                className="text-lg font-light -tracking-tight text-[#85716B]"
              >
                Change Password
              </Label>
              <div className="flex justify-between items-center">
                <p className="text-[11px] text-[#C5A88F]">
                  Change your current password
                </p>
                {/* <button
                  variant="solid"
                  className="bg-[#85716B] px-4 py-1 text-[12px] rounded-full text-white"
                >
                  Change
                </button> */}
                <button onClick={openModal} className="bg-[#85716B] px-4 py-1 text-[12px] rounded-full text-white">Change</button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="current-password"
                className="text-sm text-[#C5A88F]"
              >
                Subscription
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-2 flex items-center w-full justify-between text-[#C4B0A9]"
                  >
                    {selectedBrand ? selectedBrand : "Select a brand"}
                    <FiChevronDown className="ml-2" /> {/* Arrow Icon */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem
                    onSelect={() => setSelectedBrand("Brand 1")}
                  >
                    Brand 1
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedBrand("Brand 2")}
                  >
                    Brand 2
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Change Password */}
            <div>
              <Label htmlFor="name" className="text-sm text-[#C5A88F]">
                Business Name
              </Label>
              <Input
                id="name"
                placeholder="Enter Business Name"
                value={currentUser?.businessDetails?.businessName}
                className="mt-2 rounded-full text-[12px] text-[#C4B0A9] bg-[#F3EAE7]"
                defaultValue={currentUser?.businessDetails?.nameOfBusiness}
              />
            </div>
            <div>
              <Label htmlFor="name" className="text-sm text-[#C5A88F]">
                Brand Id
              </Label>
              <Input
                id="name"
                placeholder=""
                className="mt-2 rounded-full text-[12px] text-[#C4B0A9] bg-[#F3EAE7]"
                defaultValue={currentUser?.id}
              />
            </div>
            <div>
              <div className="mt-4 text-[12px] text-right text-[#C5A88F]">
                If you wish to change any details, please raise a ticket by
                <a href="" className="text-[#C37D64] underline">
                  {" "}
                  clicking here
                </a>
                .
              </div>
              <div className="flex justify-between mt-2">
                <button
                  variant="solid"
                  className="bg-[#85716B] px-4 py-1.5 text-[12px] rounded-md text-white"
                >
                  Save Changes
                </button>
                <button
                  variant="solid"
                  className="bg-[#F81F1F] px-4 py-1.5 text-[12px] rounded-md text-white"
                >
                  Cancel Changes
                </button>
              </div>
            </div>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-md">
                <p className="mb-4 text-lg">Are you sure you want to send a password reset link?</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={closeModal} className="px-4 py-2 rounded-md bg-gray-200">Cancel</button>
                  <button onClick={handleConfirmSendLink} className="px-4 py-2 rounded-md bg-[#85716B] text-white">Confirm</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

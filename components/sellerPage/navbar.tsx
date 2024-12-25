"use client";

import React, { useState, useEffect } from "react";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SellerSideBar } from "./sellerSideBar";
import { sellerOptions } from "./types/types";
import { SellerSideBarMobile } from "./sellerSideBarMobile";
import { useState } from "react";
import { useAuth } from "@/hooks/auth-context";
import ClipLoader from "react-spinners/ClipLoader";

export const Navbar = ({ user, active }: any) => {
  const [mobileSideBarOpen, setMobileSideBarOpen] = useState(false);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <div className="absolute top-[50%] left-[50%] items-center justify-center w-screen h-20 z-10">
      <ClipLoader
        color={"#85716B"}
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>;
  }

  return (
    <>
      <nav className=" p-4 h-20 flex justify-between items-center ">
        <div className="flex gap-3 justify-center items-center">
          <Sheet>
            <SheetTrigger>
              <AlignJustify className="cursor-pointer block md:hidden" />
            </SheetTrigger>
            <SheetContent
              onClick={close}
              side={"left"}
              className="w-72  shadow-lg"
            >
              <SellerSideBarMobile
                 setMobileSideBarOpen={setMobileSideBarOpen}
                sellerSideBarOptions={sellerOptions}
                active={active}
              />
            </SheetContent>
          </Sheet>
          <h1 className=" text-xl  sm:text-3xl  font-semibold text-black shadow-md p-2 rounded-lg">
            GetJewels Sellers
          </h1>
        </div>
        <p className="font-semibold text-black shadow-md p-2 rounded-lg sm::text-lg md:text-3xl ">
          <span className="font-semibold text-3xl">Hii</span>{" "}
          {user && user.ownerName}!
        </p>
      </nav>
    </>
  );
};

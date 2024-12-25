import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";

import { useAuth } from "@/hooks/auth-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { SellerSideBarMobile } from "./sellerSideBarMobile";
import { sellerOptions } from "./types/types";
import { useState } from "react";
import logo from "../../public/gjlogo.jpeg";
export const Navbar_test = ({ user, active }: any) => {
  const [mobileSideBarOpen, setMobileSideBarOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const handleClick = async (e: any) => {
    if (e != "logout") {
      try {
        const url = qs.stringifyUrl({
          url: "/seller",
          query: { option: e },
        });
        router.push(url);
        router.refresh();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Logging out");
      await logout();
      router.refresh();
    }
  };

  return (
    <div className="w-full h-auto flex-col mb-3  ">
      <div className=" py-3 w-full h-12 flex justify-start">
        <div className="flex gap-3 justify-center items-center h-full">
          <Sheet open={mobileSideBarOpen} onOpenChange={setMobileSideBarOpen}>
            <SheetTrigger>
              {" "}
              <AlignJustify className="cursor-pointer hidden md:block sm:block xs:block " />
            </SheetTrigger>
            <SheetContent
              onClick={close}
              side={"left"}
              className="w-56 sm:w-72 h-auto bg-[#ffff]"
            >
              <SellerSideBarMobile
                setMobileSideBarOpen={setMobileSideBarOpen}
                sellerSideBarOptions={sellerOptions}
                active={active}
              />
            </SheetContent>
          </Sheet>
          <div className="flex flex-col  w-full h-full text-black text-xl  sm:text-3xl  font-medium">
            <div className="flex gap-2">
              <img height={30} width={30} src="/gjlogo1.png" alt="logo" />
              <span>GETJWELS</span>
            </div>
          </div>
        </div>
        {/* <p className="text-white text-sm sm::text-lg md:text-2xl">
          {user && user.email}
        </p> */}
      </div>
      <div className="w-full h-[80px] gap-8 mx-4 ml-0 flex flex-1 ">
        <div className="w-1/6 h-full flex  justify-between flex-col md:hidden sm:hidden xs:hidden ">
          {/* <div className="flex w-full h-1/2 p-4 pt-2  mb-2 rounded-2xl "></div> */}
          <div className="flex w-full h-full p-4 pt-2  rounded-2xl bg-[#CADCB6]">
            <div className="flex font-medium h-full text-black  text-lg w-full ">
              <div className="flex w-full justify-between items-center h-full  ">
                <p className=" basis-2/3  mt-2">Add Product</p>
                <div
                  onClick={() => handleClick("addProduct")}
                  className="flex basis-1/3 hover:shadow-md  hover:grow cursor-pointer p-4  mt-2 scale-75 justify-center items-center bg-[#A7C585] rounded-full "
                >
                  <img
                    src="/+.png"
                    alt="add"
                    className="text-white w-10 h-auto flex "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* bg-[#c6e0a6] */}
        <div className="w-5/6 md:w-full sm:w-full xs:w-full  h-full  flex justify-around  bg-[#A7C585] rounded-2xl  bg-opacity-60 relative">
          <div className="flex flex-col   justify-center md:items-start items-center pl-10  w-full ">
            <div className="text-3xl w-full text-white font-bold flex items-end gap-4">
              {user.buissnessName}
            </div>
            <div className="text-[1rem] w-full font-light text-white">
              {user.vendorId}
            </div>
          </div>
          <div className=" -top-16 right-14 md:w-80 md:right-7 sm:hidden xs:hidden   block z-10 bg-transparent absolute">
            <Image
              src="/seller/displayProfile.png"
              alt="profile"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

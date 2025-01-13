"use client";

import { useAuth } from "@/hooks/auth-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface SellerSideBarProps {
  iconName: string;
  title: string;
}
export const SellerSideBarMobile = ({
  sellerSideBarOptions,
  active,
  setMobileSideBarOpen,
}: {
  sellerSideBarOptions: SellerSideBarProps[];
  active: string;
  setMobileSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleClick = async (e: any) => {
    if (e.id != "logout") {
      try {
        const url = qs.stringifyUrl({
          url: "/seller",
          query: { option: e.id },
        });
        router.push(url);
        router.refresh();
        setMobileSideBarOpen(false);
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
    <>
      <aside className=" h-auto p-4 ">
        <div>
          {sellerSideBarOptions.length > 0 &&
            sellerSideBarOptions.map((option, i) => (
              <div
                key={i}
                id={option.title.split(" ").join("").toLowerCase()}
                onClick={(e) => handleClick(e.target)}
                className={cn(
                  "flex items-center gap-3 my-3 rounded-l-full  rounded-lg transition duration-300 ease-in-out hover:shadow-md hover:shadow-gray-300 cursor-pointer",
                  option.title.split(" ").join("").toLowerCase() == active &&
                    "bg-[#d6e7c3] rounded-l-full"
                )}
              >
                <div
                  id={option.title.split(" ").join("").toLowerCase()}
                  className="bg-slate-100 p-3 rounded-full w-10 h-10"
                >
                  <Image
                    src={option.iconName}
                    alt="option Images"
                    width={100}
                    height={100}
                  />
                </div>

                <p
                  id={option.title.split(" ").join("").toLowerCase()}
                  className="text-black font-semibold text-md"
                >
                  {option.title}
                </p>
              </div>
            ))}
        </div>
      </aside>
    </>
  );
};

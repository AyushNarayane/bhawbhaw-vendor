"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import shake from "../../public/Dashboard.png";
import up from "../../public/up.png";
import service from "../../public/services.png";
import user from "../../public/user.png";
import downt from "../../public/downt.png";
import dollar from "../../public/dollar-sign.png";
import Card from "../Card";
import TransactionsTable from "../TransactionsTable";
import { useAuth } from "@/hooks/auth-context";
import ClipLoader from "react-spinners/ClipLoader";
import Protected from "../Protected/Protected";
import { useRouter } from "next/navigation";

const GradientBarChart = dynamic(() => import("../GradientBarChart"), {
  ssr: false,
});
const Map = dynamic(() => import("../Map"), { ssr: false });
const SpiderChart = dynamic(() => import("../SpiderChart"), { ssr: false });
const LineGraph = dynamic(() => import("../LineGraph"), { ssr: false });
const BarGraph = dynamic(() => import("../BarGraph"), { ssr: false });
const PieCharts = dynamic(() => import("../PieCharts"), { ssr: false });

const DashBoard = () => {
  const { currentUser } = useAuth();
  const router = useRouter()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }else{
      router.push('/login')
    }
  }, [currentUser]);

  const data = [
    {
      vendor1: "Total Sellers",
      num_vendor1: "600",
      vendor2: "New Sellers",
      num_vendor2: "150",
      img1: shake,
      img2: up,
    },
    {
      vendor1: "Total Orders",
      num_vendor1: "120",
      vendor2: "Active Orders",
      num_vendor2: "5",
      img1: service,
      img2: up,
    },
    {
      vendor1: "Total Buyers",
      num_vendor1: "120",
      vendor2: "Products",
      num_vendor2: "5",
      img1: user,
      img2: downt,
    },
    {
      vendor1: "Net Income",
      num_vendor1: "Rs. 67584",
      vendor2: "Monthly Income",
      num_vendor2: "Rs. 5678",
      img1: dollar,
      img2: downt,
    },
    {
      vendor1: "Avg Order Value",
      num_vendor1: "Rs. 675",
      vendor2: "Orders Completed",
      num_vendor2: "6576",
      img1: shake,
      img2: up,
    },
  ];

  if (loading) {
    return <div className="absolute top-[50%] left-[50%] items-center justify-center w-screen h-screen z-10">
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
    <div className="max-lg:py-5 w-full">
      <p className="text-3xl mt-8 font-extrabold text-[#4D413E]">
      Hello {currentUser?.personalDetails?.name}!
      </p>
      <div className="w-full flex flex-col items-start justify-start gap-4 mt-6">
        <div className="w-full flex lg:justify-between justify-around items-center gap-10 lg:gap-5 max-lg:flex-col">
          {data.map((item, index) => (
            <Card
              key={index}
              vendor1={item.vendor1}
              num_vendor1={item.num_vendor1}
              vendor2={item.vendor2}
              num_vendor2={item.num_vendor2}
              img1={item.img1}
              img2={item.img2}
            />
          ))}
        </div>
      </div>
      <div className="-z-1 w-full flex max-lg:flex-col lg:justify-between justify-around items-center gap-4 lg:gap-5 mt-5">
        <GradientBarChart
          head="Revenue"
          count="90"
          Icon={true}
          darkColor="#E57373"
          lightColor="#DFA5A5"
        />
        <GradientBarChart
          head="Total Users"
          count="7000"
          Icon={false}
          darkColor="#FFEB3B"
          lightColor="#EFE16C"
        />
        <SpiderChart />
        <Map />
        <LineGraph />
      </div>
      <div className=" w-full flex lg:justify-between justify-around items-center gap-4 lg:gap-5 mt-5 max-lg:flex-col">
        <BarGraph />
        <PieCharts />
      </div>
      <div className="mt-8 pb-8">
        <TransactionsTable />
      </div>
    </div>
  );
};

export default Protected(DashBoard , ["Ecommerce", "Service"]);

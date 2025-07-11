"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-context";
import ClipLoader from "react-spinners/ClipLoader";
import Protected from "../Protected/Protected";

// Images
import shake from "../../public/Dashboard.png";
import up from "../../public/up.png";
import service from "../../public/services.png";
import user from "../../public/user.png";
import downt from "../../public/downt.png";
import dollar from "../../public/dollar-sign.png";

// Components
import Card from "../Card";
import TransactionsTable from "../TransactionsTable";

// Dynamically imported components with loading optimization
const DynamicComponents = {
  GradientBarChart: dynamic(() => import("../GradientBarChart"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="300px" />
  }),
  Map: dynamic(() => import("../Map"), { 
    ssr: false,
    loading: () => <ComponentSkeleton height="400px" />
  }),
  SpiderChart: dynamic(() => import("../SpiderChart"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="300px" />
  }),
  LineGraph: dynamic(() => import("../LineGraph"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="300px" />
  }),
  BarGraph: dynamic(() => import("../BarGraph"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="300px" />
  }),
  PieCharts: dynamic(() => import("../PieCharts"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="300px" />
  })
};

// Skeleton loader component
const ComponentSkeleton = ({ height }) => (
  <div 
    className="animate-pulse bg-gray-200 rounded-lg w-full"
    style={{ height }}
  />
);

// Custom Card wrapper component for mobile-specific styling
const CardWrapper = ({ children }) => (
  <div className="w-[calc(100%-10px)] sm:w-full max-w-sm mx-auto">
    {children}
  </div>
);

const DashBoard = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    } 
    }, [currentUser]);

  const dashboardData = [
    {
      vendor1: "Total Sellers",
      num_vendor1: "0",
      vendor2: "New Sellers",
      num_vendor2: "0",
      img1: shake,
      img2: up,
    },
    {
      vendor1: "Total Orders",
      num_vendor1: "0",
      vendor2: "Active Orders",
      num_vendor2: "0",
      img1: service,
      img2: up,
    },
    {
      vendor1: "Total Buyers",
      num_vendor1: "0",
      vendor2: "Products",
      num_vendor2: "0",
      img1: user,
      img2: downt,
    },
    {
      vendor1: "Net Income",
      num_vendor1: "Rs. 0",
      vendor2: "Monthly Income",
      num_vendor2: "Rs. 0",
      img1: dollar,
      img2: downt,
    },
    {
      vendor1: "Avg Order Value",
      num_vendor1: "Rs. 0",
      vendor2: "Orders Completed",
      num_vendor2: "0",
      img1: shake,
      img2: up,
    },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
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
    <div className="w-full max-w-[100vw] px-3 sm:px-4 md:px-6 overflow-x-hidden">
      {/* Header Section */}
      <header className="py-4 md:py-8">
        <h1 className="text-xl md:text-3xl font-extrabold text-[#4D413E] break-words">
          Hello {currentUser?.personalDetails?.name}!
        </h1>
      </header>

      {/* Cards Grid - Single column on mobile with reduced width */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-4 md:mb-6">
        {dashboardData.map((item, index) => (
          <CardWrapper key={index}>
            <Card
              vendor1={item.vendor1}
              num_vendor1={item.num_vendor1}
              vendor2={item.vendor2}
              num_vendor2={item.num_vendor2}
              img1={item.img1}
              img2={item.img2}
              className="transform transition-transform hover:scale-105"
            />
          </CardWrapper>
        ))}
      </section>

      {/* Primary Charts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="w-full">
          <DynamicComponents.GradientBarChart
            head="Revenue"
            count="90"
            Icon={true}
            darkColor="#E57373"
            lightColor="#DFA5A5"
          />
        </div>
        <div className="w-full">
          <DynamicComponents.GradientBarChart
            head="Total Users"
            count="7000"
            Icon={false}
            darkColor="#FFEB3B"
            lightColor="#EFE16C"
          />
        </div>
        <div className="w-full">
          <DynamicComponents.SpiderChart />
        </div>
      </section>

      {/* Secondary Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="w-full">
          <DynamicComponents.Map />
        </div>
        <div className="w-full">
          <DynamicComponents.LineGraph />
        </div>
      </section>

      {/* Additional Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="w-full">
          <DynamicComponents.BarGraph />
        </div>
        <div className="w-full">
          <DynamicComponents.PieCharts />
        </div>
      </section>

      {/* Transactions Section */}
      <section className="mb-4 md:mb-8">
        <TransactionsTable />
      </section>
    </div>
  );
};

export default Protected(DashBoard, ["Ecommerce", "Service"]);
import AllBlogs from "@/components/Allblogs";
import Appointment from "@/components/Appointment";
import React from "react";

const page = () => {
  return (
    <div className="bg-white pb-10 ml-32 mr-2">
      <AllBlogs />
      <Appointment />
    </div>
  );
};

export default page;

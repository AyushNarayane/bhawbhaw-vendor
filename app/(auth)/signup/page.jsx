"use client";
import Signup from "@/components/Signup/Signup";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="App">
      <Signup />
      <Toaster />
    </div>
  );
}

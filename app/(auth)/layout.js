import Footer from "@/components/Footer/Footer";
import React from "react";
import { Toaster } from "react-hot-toast";
const LoginLayout = ({ children }) => {
  return (
    <div>
      {children}
      <Toaster />
      <Footer/>
    </div>
  );
};

export default LoginLayout;

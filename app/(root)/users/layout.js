import React from "react";

export const metadata = {
  title: "Bhaw Bhaw | Seller Users",
  description: "Understand your customers better with the Bhaw Bhaw Seller Dashboard's user management tools. Access customer profiles, review order history, and tailor your offerings to meet their needs. Strengthen your customer relationships and deliver personalized experiences that drive loyalty and satisfaction.",
  keywords: "user management, customer profiles, order history, personalized services"
};

const UsersLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default UsersLayout;

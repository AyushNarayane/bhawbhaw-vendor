import React from "react";

export const metadata = {
  title: "Product Management | Showcase and Update Your Pet Products",
  description: "Manage your products effortlessly with the Bhaw Bhaw Seller Dashboard. Add new items, update , and monitor to ensure uninterrupted sales. Showcase your offerings with detailed descriptions and images, ensuring customers find what they need. Stay organized and deliver quality pet care products to a growing customer base.",
  keywords: "product management, seller products, pet care products, inventory management"
};

const ProductsLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default ProductsLayout;

import React from "react";

export const metadata = {
  title: "Order Tracking | Manage Your Customer Orders Seamlessly",
  description: "Monitor and manage all orders for your products efficiently with the Bhaw Bhaw Seller Dashboard. Stay on top of your customer orders with real-time updates. Bhaw Bhaw's Vendor Panel lets you process, track, and complete orders effortlessly to enhance customer satisfaction.",
  keywords: "order management, pet product orders, seller orders, order tracking"
};

const OrdersLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default OrdersLayout;

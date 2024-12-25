import React from "react";

export const metadata = {
  title: "Bhaw Bhaw | Seller Payments",
  description: "Track and manage your earnings with the Bhaw Bhaw Seller Dashboard payments section. Access detailed records of completed transactions, pending payments, and payouts. Ensure financial transparency and stay updated on your revenue from product sales and services. With an intuitive interface, managing your finances has never been easier for pet care sellers.",
  keywords: "seller payments, transaction tracking, earnings, payouts, revenue management"
};

const PaymentsLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default PaymentsLayout;

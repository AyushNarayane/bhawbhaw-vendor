import React from "react";

export const metadata = {
  title: "Vendor Dashboard | Bhaw Bhaw Business Insights at Your Fingertips",
  description: "Your Bhaw Bhaw Vendor Dashboard offers an intuitive interface to monitor sales, track orders, and view performance metrics. Analyze trends and take informed decisions for business growth.",
  keywords: "seller dashboard, business analytics, product management, seller tools"
};

const DashboardLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default DashboardLayout;

import React from "react";

export const metadata = {
  title: "Vendor Profile | Personalize Your Business Details",
  description: "Keep your business profile up-to-date on the Bhaw Bhaw Seller Dashboard. Manage personal and business details, including contact information, and branding elements. Create a professional and trustworthy presence that helps you stand out in the competitive pet care market.",
  keywords: "seller profile, business details, store branding, profile management"
};

const ProfileLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default ProfileLayout;

import React from "react";

export const metadata = {
  title: "Booking Management | Simplify Your Service Scheduling",
  description: "Organize and manage customer bookings for your pet care services with ease. View schedules, confirm appointments, and deliver exceptional services through Bhaw Bhaw's Vendor Panel.",
  keywords: "seller bookings, pet care scheduling, service management, appointment tracking, booking system"
};

const BookingsLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default BookingsLayout;

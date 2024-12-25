import localFont from "next/font/local";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import { AuthProvider } from "@/hooks/auth-context";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Bhaw Bhaw Vendor Panel | Simplify Your Business Management",
  description: "The Bhaw Bhaw Vendor Panel is your all-in-one platform to manage products, services, orders, and business analytics. Access real-time data, monitor performance, update offerings, and respond to customer inquiries. Streamline operations and drive growth while delivering top-notch pet care.",
  keywords: "seller dashboard home, business analytics, pet care management, seller tools"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Toaster />
          <ClientProvider>{children}</ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

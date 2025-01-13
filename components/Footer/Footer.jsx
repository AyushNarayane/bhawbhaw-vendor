import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <div className="hidden sm:block bg-[#85716B] text-white py-16 px-5 md:px-10 font-light text-sm">
      {/* Main Content */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 lg:px-16">
        
        {/* Logo Section */}
        <div className="flex justify-center lg:justify-start mb-8 lg:mb-0">
          <Image
            width="300"
            height="300"
            src="/logoFooter.png"
            className="w-36 max-h-20"
            alt="Footer Logo"
          />
        </div>

        {/* Quick Links */}
        <div className="text-center lg:text-left">
          <h3 className="font-semibold text-base mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/directories">Directories</Link></li>
          </ul>
        </div>

        {/* Directories */}
        <div className="text-center lg:text-left">
          <h3 className="font-semibold text-base mb-4">Directories</h3>
          <ul className="space-y-2">
            <li><Link href="/directory?option=sellers">Sellers</Link></li>
            <li><Link href="/directory?option=jobs">Jobs</Link></li>
            <li><Link href="/directory?option=newsletters">Newsletters</Link></li>
            <li><Link href="/directory?option=services">Services</Link></li>
            <li><Link href="/directory?option=products">Products</Link></li>
          </ul>
        </div>

        {/* Contacts */}
        <div className="text-center lg:text-left">
          <h3 className="font-semibold text-base">Contacts</h3>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center justify-center lg:justify-start space-x-2">
              <Image
                width="300"
                height="300"
                src="/Call.png"
                className="w-7 h-7 border border-white rounded-md p-[5px]"
                alt="Call Icon"
              />
              <span>8390637497<br />8318571489</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start space-x-2">
              <Image
                width="300"
                height="300"
                src="/Email.png"
                className="w-7 h-7 border border-white rounded-md p-[5px]"
                alt="Email Icon"
              />
              <span>info@bhawbhaw.com<br />www.bhawbhaw.com</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start space-x-2">
              <Image
                width="300"
                height="300"
                src="/Location.png"
                className="w-7 h-7 border border-white rounded-md p-[5px]"
                alt="Location Icon"
              />
              <span>Bandra W , Mumbai</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-gray-300 mt-6 pt-4 text-center mx-auto w-full sm:flex sm:justify-between sm:px-10">
        <p className="text-white mb-4 sm:mb-0">
          © 2025 Bhawbhaw.com
        </p>
        <div className="text-white">
          <ul className="flex justify-center sm:justify-start space-x-4">
            <li><Link href="/"><FaTwitter size={20} /></Link></li>
            <li><Link href="/"><FaLinkedin size={20} /></Link></li>
            <li><Link href="/"><FaFacebook size={20} /></Link></li>
            <li><Link href="/"><FaInstagram size={20} /></Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('');

  const handleScrollToSection = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'howItWorks', label: 'How It Works' },
    { id: 'services', label: 'Services' },
    { id: 'highlight', label: 'Highlight' },
    { id: 'resources', label: 'Resources', isRoute: true }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 rounded-full mb-8 sticky top-4 z-50 mx-auto max-w-4xl">
      <div className="hidden md:flex justify-center space-x-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.isRoute ? router.push('/resources') : handleScrollToSection(item.id)}
            className={`
              relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out
              ${activeSection === item.id ? 'text-[#695d56]' : 'text-gray-600 hover:text-[#695d56]'}
              group
            `}
          >
            {item.label}
            <span className={`
              absolute bottom-0 left-0 w-full h-0.5 bg-[#695d56] transform origin-left
              transition-all duration-300 ease-out
              ${activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
            `}></span>
          </button>
        ))}
      </div>
    </nav>
  );
}

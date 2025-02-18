'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogCard from './Blogcard';
import Navigation from './Navigation';
import Header from './Header/Header';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

const AllBlogs = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, 'blogs');
        const blogsSnapshot = await getDocs(blogsCollection);
        const blogsData = blogsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogPosts(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleMenuItemClick = (section) => {
    handleScrollToSection(section);
    setMenuOpen(false);
  };

  const handleScrollToSection = (section) => {
    router.push(`/#${section}`);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='-mt-20'>
      <header className="flex items-center justify-between px-5 py-1 bg-white shadow-md sticky top-0 z-10">
                      {/* Logo */}
                      <div className="flex items-center">
                          <Image
                              src='/logoHeader.png'
                              width="120"
                              height="120"
                              className="sm:w-24 w-20 cursor-pointer"
                              onClick={() => handleScrollToSection('home')}
                              alt="Logo"
                          />
                      </div>
      
                      <nav className="hidden md:flex space-x-6 lg:text-lg text-sm font-medium">
                          <button onClick={() => handleScrollToSection('ecommerce')} className="text-gray-700 hover:text-black transition">E-Commerce</button>
                          <button onClick={() => handleScrollToSection('howItWorks')} className="text-gray-700 hover:text-black transition">How It Works</button>
                          <button onClick={() => handleScrollToSection('services')} className="text-gray-700 hover:text-black transition">Services</button>
                          <button onClick={() => handleScrollToSection('highlight')} className="text-gray-700 hover:text-black transition">Highlight</button>
                          <button
                              onClick={() => router.push('/resources')}
                              className="text-gray-700 hover:text-black transition"
                          >
                              Resources
                          </button>
      
                      </nav>
      
                      <div className='flex gap-5'>
                          <button className="hidden md:block bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4" onClick={() => router.push('/dashboard')}>
                              Dashboard
                          </button>
                          <button className="hidden md:block bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4" onClick={() => router.push('/signup')}>
                              Become a Seller
                          </button>
                      </div>
      
                      <div className="md:hidden">
                          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                              </svg>
                          </button>
                      </div>
      
                      {menuOpen && (
                          <div ref={menuRef} className="absolute top-16 left-0 w-full bg-white shadow-md z-10 flex flex-col items-center space-y-4 py-4 md:hidden">
                              <button onClick={() => handleMenuItemClick('ecommerce')} className="text-gray-700 hover:text-black transition">E-Commerce</button>
                              <button onClick={() => handleMenuItemClick('howItWorks')} className="text-gray-700 hover:text-black transition">How It Works</button>
                              <button onClick={() => handleMenuItemClick('services')} className="text-gray-700 hover:text-black transition">Services</button>
                              <button onClick={() => handleMenuItemClick('highlight')} className="text-gray-700 hover:text-black transition">Highlight</button>
                              <button className="bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4" onClick={() => router.push('/dashboard')}>
                                  Dashboard
                              </button>
                              <button className="bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4" onClick={() => { router.push('/signup'); setMenuOpen(false); }}>
                                  Become a Seller
                              </button>
                          </div>
                      )}
                  </header>
    <div >
      <div className="text-center mb-8 mt-6 ">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-[#4D413E]">Latest blog posts</h2>
      </div>

      {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D413E]"></div>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                category={post.category}
                date={new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}
                image={post.image || '/blogs/default-blog.png'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No blog posts available at the moment.
          </div>
        )}
    </div>
    </div>
  );
};

export default AllBlogs;

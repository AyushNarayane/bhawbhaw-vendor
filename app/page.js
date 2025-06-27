"use client"

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import Footer from '@/components/Footer/Footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/auth-context';
import FadeInUp from '@/components/FadeInUp';
import { motion } from 'framer-motion';
import FadeInUp from '@/components/FadeInUp';
import { motion } from 'framer-motion';

export default function HomePage() {
    const router = useRouter();
    const { currentUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleScrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuItemClick = (section) => {
        handleScrollToSection(section);
        setMenuOpen(false);
    };

    return (
        <div className="bg-[#F8F7F5]">
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
                    <button
                        className="hidden md:block bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4"
                        onClick={() => router.push('/dashboard')}
                    >
                        Dashboard
                    </button>
                    {!currentUser && (
                        <button
                            className="hidden md:block bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4"
                            onClick={() => router.push('/signup')}
                        >
                            Become a Seller
                        </button>
                    )}
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
                        <button
                            className="bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4"
                            onClick={() => router.push('/dashboard')}
                        >
                            Dashboard
                        </button>
                        {!currentUser && (
                            <button
                                className="bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4"
                                onClick={() => { router.push('/signup'); setMenuOpen(false); }}
                            >
                                Become a Seller
                            </button>
                        )}
                    </div>
                )}
            </header>

            <div className="flex max-w-6xl mx-auto flex-col md:flex-row justify-start items-center w-full min-h-[80vh] px-5 pe-0 md:px-0 pt-10 md:pt-0">
                <div className="relative w-full md:w-3/6 md:ml-10 mb-10 md:mb-0">
                    <Image
                        src='/cat.png'
                        width={400}
                        height={400}
                        className='mx-auto w-[300px] h-[400px] md:w-[430px] md:h-[500px]'
                        alt="Cat Image"
                    />
                </div>


                <div className="w-full md:text-left text-center max-w-xl md:w-1/2 pe-10 md:px-10 relative mx-auto md:pl-20">
                    <h1 className="text-2xl lg:text-5xl md:text-4xl sm:text-3xl !leading-tight font-extrabold text-black mb-4 md:mb-6 relative">
                        <Image
                            width="300"
                            height="300"
                            src='/glitterR.png'
                            className='absolute right-0 w-12 md:w-16'
                            alt="Decorative glitter"
                        />
                        Connecting Pet Sellers with Pet Lovers <br /> Everywhere
                    </h1>

                    <p className="text-sm md:text-md text-gray-600 mb-4 md:mb-6 pr-0 md:pr-24">
                        Sell pet products, offer services, and grow your business with ease.
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <button className="bg-[#FFEB3B] hover:bg-yellow-500 text-black py-2 px-10 md:px-16 rounded-full font-bold" onClick={() => router.push('/signin')}>
                            Get Started Today
                        </button>
                    </div>
                </div>
            </div>

            <FadeInUp>
            <section id="ecommerce" className="flex justify-center items-center pt-20">
                <div className="flex flex-col lg:flex-row items-center justify-between p-10 lg:p-20">
                    <div className="w-full lg:w-1/2 lg:pr-10 mb-8 lg:mb-0">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Get Edge In Delivering E-Commerce Services
                        </h2>
                        <p className="text-gray-600 text-base lg:text-lg mb-6">
                            Expand your pet business with our e-commerce platform designed specifically for pet sellers. Easily list and manage products like food, toys, accessories, and health items through a customizable storefront. With seamless inventory management and secure payments, you can reach more customers and grow your sales, all in one place.
                        </p>
                        <button className="bg-[#FFEB3B] text-black py-2 px-6 rounded-full hover:bg-yellow-500 transition">
                            Discover
                        </button>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <Image width="300" height="300" src='/ecomServices.png' className="rounded-lg w-[50rem]" alt="E-Commerce Services Image " />
                    </div>
                </div>
            </section>
            </FadeInUp>


            <section id="howItWorks" className="py-20 px-6">
                <div className="py-8 px-10 relative">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-black">
                        How It Works
                    </h2>
                    <Image
                        width="300"
                        height="300"
                        src="/shine1.png"
                        className="absolute top-20 mx-auto right-0 left-0 w-7"
                    />
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-between items-center lg:items-start"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{}}
                    >
                        {[{
                            img: "/work1.png",
                            title: "Sign Up",
                            desc: "Create your vendor account in a few easy steps."
                        }, {
                            img: "/work2.png",
                            title: "Set Up Your Store",
                            desc: "Add your products or services and customize your storefront."
                        }, {
                            img: "/work3.png",
                            title: "Start Selling And Offering Services",
                            desc: "Customers can browse and book, while you manage everything from your dashboard."
                        }, {
                            img: "/work4.png",
                            title: "Grow Your Business",
                            desc: "Use our tools to track sales, manage bookings, and scale your business."
                        }].map((step, idx) => (
                            <motion.div
                                key={step.title}
                                className="flex flex-col items-center text-center mb-8 lg:mb-0"
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: idx * 0.25 }}
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <Image
                                    width="300"
                                    height="300"
                                    src={step.img}
                                    layout="intrinsic"
                                    className="mb-4 w-32"
                                />
                                <h3 className="text-xl font-semibold mb-2 text-black">{step.title}</h3>
                                <p className="text-gray-600 text-sm md:text-base max-w-xs">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>


            <div className='flex flex-row sm:m-16 m-1 pb-20 gap-7 items-center justify-center relative '>
                <Image width="300" height="300" src='/staggered1.png' className="w-24 md:w-32 " />
                <Image width="300" height="300" src='/shine1.png' className="w-6 md:w-8 top-0 left-20 absolute" />
                <Image width="300" height="300" src='/shine.png' className="w-6 md:w-8 bottom-10 left-20 absolute" />
                <Image width="300" height="300" src='/bubble.png' className="w-6 md:w-8 bottom-28 left-11 absolute" />
                <Image width="300" height="300" src='/shine.png' className="w-6 md:w-8 bottom-36 right-24 absolute" />
                <Image width="300" height="300" src='/shine1.png' className="w-4 md:w-5 bottom-28 right-0 left-80 mx-auto absolute" />
                <Image width="300" height="300" src='/bubble.png' className="w-6 md:w-8 top-16 right-20 absolute" />
                <Image width="300" height="300" src='/shine.png' className="w-4 md:w-5 top-12 right-96 absolute" />

                <div>
                    <Image width="300" height="300" src='/staggered2.png' className="w-28 md:w-40 mb-10 " />
                    <Image width="300" height="300" src='/staggered3.png' className="w-28 md:w-40 " />
                </div>
                <div>
                    <Image width="300" height="300" src='/staggered4.png' className="w-24 md:w-32 mb-6" />
                    <Image width="300" height="300" src='/staggered5.png' className="w-24 md:w-32 " />
                </div>
                <Image width="300" height="300" src='/staggered6.png' className="hidden md:block w-28 md:w-40 " />
                <div>
                    <Image width="300" height="300" src='/staggered7.png' className="w-24 md:w-32 mb-6" />
                    <Image width="300" height="300" src='/staggered8.png' className="w-24 md:w-32 " />
                </div>
                <Image width="300" height="300" src='/staggered9.png' className="hidden md:block w-24 md:w-32 " />
            </div>

            <FadeInUp>
            <section id="services" className="py-32 px-6">
                <div className="px-6 sm:px-10 lg:px-20 flex flex-col lg:flex-row justify-center items-start md:pb-16 pb-5">
                    <div className="lg:w-1/2">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            &quot;Simplify Pet Care Bookings And Grow Your Services&quot;
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
                            &quot;Offer your pet services online with our streamlined booking system. Whether you provide grooming, training, or veterinary services, our platform makes it easy for customers to book and pay, while you manage appointments and schedules effortlessly. Reach a wider audience and provide top-notch services to pet owners, all from one convenient platform.&quot;
                        </p>
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-6 sm:px-8 rounded-full font-bold">
                            DISCOVER
                        </button>
                    </div>

                    <div className="mt-10 lg:mt-0 lg:w-1/2 flex flex-col items-start px-4 sm:px-10 lg:px-32 ">
                        <h2 className="text-gray-900 font-bold text-lg mb-4 uppercase">Your Services</h2>
                        <ul className="space-y-3 text-gray-800">
                            <li className="flex items-center">
                                <Image src='/paw.png' width={16} height={16} className="mr-2" />
                                <span className="text-base sm:text-lg">Pet Grooming</span>
                            </li>
                            <li className="flex items-center">
                                <Image src='/paw.png' width={16} height={16} className="mr-2" />
                                <span className="text-base sm:text-lg">Pet Boarding</span>
                            </li>
                            <li className="flex items-center">
                                <Image src='/paw.png' width={16} height={16} className="mr-2" />
                                <span className="text-base sm:text-lg">Pet Training</span>
                            </li>
                            <li className="flex items-center">
                                <Image src='/paw.png' width={16} height={16} className="mr-2" />
                                <span className="text-base sm:text-lg">Pet Transportation</span>
                            </li>
                            <li className="flex items-center">
                                <Image src='/paw.png' width={16} height={16} className="mr-2" />
                                <span className="text-base sm:text-lg">Pet Massage Therapy</span>
                            </li>
                            <li className="flex items-center">
                                <Image src='/paw.png' width={16} height={16} className="mr-2" />
                                <span className="text-base sm:text-lg">Pet Health Monitoring</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            </FadeInUp>


            {/* <div className='flex flex-row pb-10 gap-10 items-center justify-center relative p-10 '>
                <Image width="300" height="300" src='/service1.png' className="w-20 md:w-44 h-auto -mb-28" />
                <Image width="300" height="300" src='/service2.png' className="w-56 md:w-[40rem] rounded-full h-auto" />
                <Image width="300" height="300" src='/shine.png' className="md:block w-6 md:w-8 md:bottom-36 left-24 absolute" />
                <Image width="300" height="300" src='/bubble.png' className="hidden md:block w-6 md:w-8 top-28 left-72 absolute" />
                <Image width="300" height="300" src='/shine1.png' className="hidden md:block w-5 md:w-7 top-0 left-96 absolute" />
                <Image width="300" height="300" src='/curl.png' className="bottom-0 right-5 md:block w-8 md:w-12 md:bottom-32 md:right-32 absolute" />
            </div> */}



            <FadeInUp>
            <section id="highlight" className="py-20 px-6 bg-gray-100">
                <div className="flex flex-col sm:flex-row  items-center justify-between p-5 lg:p-20 pb-16 ">
                    <div className="w-full md:w-1/2 flex justify-center lg:mr-20">
                        <Image width="300" height="300" src='/highlight.png' className="w-80 md:w-[40rem] lg:w-[50rem]" />
                    </div>
                    <div className="sm:w-2/3 lg:w-1/2 mt-8 lg:mt-0">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black text-left">Feature Highlight</h2>

                        <div className="mb-6">
                            <div className='flex items-center justify-start lg:justify-start -ml-7 mb-5'>
                                <Image width="300" height="300" src='/clock.png' className='w-3 h-3 mr-3' />
                                <h3 className="text-lg font-medium text-gray-800">Our Services</h3>
                            </div>
                            <ul className="text-gray-600 list-disc list-inside text-xs lg:text-lg mt-2 text-start ">
                                <li>Seamless e-commerce setup for pet products.</li>
                                <li>Service booking system for grooming, training, and vet services.</li>
                                <li>Analytics and insights to track your business performance.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="py-8 px-10 relative">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-black">
                        Why Choose Us?
                    </h2>
                    <Image
                        width="300"
                        height="300"
                        src="/shine1.png"
                        className="absolute top-20 mx-auto right-0 left-0 w-7"
                    />
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-between items-center lg:items-start"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{}}
                    >
                        {[
                            {
                                img: "/work4.png",
                                desc: "Reach more pet lovers and grow your customer base."
                            },
                            {
                                img: "/tool.png",
                                desc: "Simple, efficient tools for managing your store and services."
                            },
                            {
                                img: "/work1.png",
                                desc: "24/7 support to help you every step of the way."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={item.img}
                                className="flex flex-col items-center text-center mb-8 lg:mb-0"
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: idx * 0.25 }}
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <Image
                                    width="300"
                                    height="300"
                                    src={item.img}
                                    layout="intrinsic"
                                    className={item.img === "/work1.png" ? "mb-4 w-48" : "w-52 min-h-36"}
                                />
                                <p className="text-gray-900 text-sm md:text-lg max-w-xs">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            </FadeInUp>

            <section className='relative max-w-4xl mx-auto sm:px-20 px-8'>
                <h3 className='text-center text-3xl font-bold mt-20 mb-8'>FaQ</h3>
                <Image
                    width="300"
                    height="300"
                    src="/shine1.png"
                    className="absolute mx-auto -top-10 xl:-right-20 right-20 w-5"
                />
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is the best type of food for my pet?</AccordionTrigger>
                        <AccordionContent>
                            The best food depends on your pet&apos;s species, breed, age, and health needs. Consult your vet for tailored recommendations.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How often should I feed my pet?</AccordionTrigger>
                        <AccordionContent>
                            Most pets thrive on two meals per day. Puppies and kittens may require more frequent feeding, while some adults can eat once daily.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Are grain-free diets good for pets?</AccordionTrigger>
                        <AccordionContent>
                            Grain-free diets may benefit pets with grain allergies, but they’re not necessary for all pets. Always consult your vet before making changes.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>What services are available for pet grooming?</AccordionTrigger>
                        <AccordionContent>
                            Common services include bathing, hair trimming, nail clipping, ear cleaning, and flea/tick treatments.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>How can I ensure my pet stays healthy?</AccordionTrigger>
                        <AccordionContent>
                            Regular vet check-ups, balanced diets, exercise, vaccinations, and preventive treatments for parasites help maintain pet health.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>Do pets need dental care?</AccordionTrigger>
                        <AccordionContent>
                            Yes, pets need regular dental care to prevent gum disease and tooth decay. Brush their teeth or provide dental chews as recommended by your vet.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            <div className='flex flex-row flex-wrap  gap-5 md:gap-10 items-center justify-center  relative pt-20'>
                <Image width="300" height="300" src='/highlight1.png' className="sm:w-20 w-20 lg:w-36 h-auto" />
                <Image width="300" height="300" src='/highlight2.png' className="sm:w-24 w-20 lg:w-44 h-auto" />
                <Image width="300" height="300" src='/highlight3.png' className="sm:w-20 w-20 lg:w-36 h-auto" />
                <Image width="300" height="300" src='/highlight4.png' className="sm:w-24 w-20 lg:w-44 h-auto" />
                <Image width="300" height="300" src='/highlight5.png' className="sm:w-20 w-20 lg:w-36 h-auto" />
                <Image width="300" height="300" src='/shine1.png' className="w-6 top-0 left-16 absolute" />
                <Image width="300" height="300" src='/shine.png' className="w-6 bottom-0 right-14 absolute" />
            </div>
            <div className='h-32'></div>
            <Footer />
        </div >
    );
}
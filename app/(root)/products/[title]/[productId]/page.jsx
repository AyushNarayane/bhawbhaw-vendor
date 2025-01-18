"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LoadingSkeleton = () => (
  <div className="container mx-auto p-6 animate-pulse">
    <div className="flex flex-col lg:flex-row lg:space-x-12">
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
        <div className="bg-gray-200 rounded-2xl h-[500px]"></div>
      </div>
      <div className="w-full lg:w-1/2">
        <div className="bg-gray-200 rounded-2xl h-[600px]"></div>
      </div>
    </div>
  </div>
);

const ProductDetailsPage = ({ params }) => {
  const router = useRouter();
  const { productId } = params;
  const [product, setProduct] = useState(null);
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    if (!productId) {
      console.error("Product ID is missing.");
      router.push("/");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          console.error("Product not found.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchSalesData = async () => {
      try {
        const salesRef = collection(db, "sales");
        const q = query(salesRef, where("productId", "==", productId));
        const querySnapshot = await getDocs(q);
        
        const monthlySales = {};
        querySnapshot.forEach((doc) => {
          const sale = doc.data();
          const date = new Date(sale.date.toDate());
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          monthlySales[monthYear] = (monthlySales[monthYear] || 0) + sale.quantity;
        });

        setSalesData({
          labels: Object.keys(monthlySales),
          datasets: [
            {
              label: 'Monthly Sales',
              data: Object.values(monthlySales),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchProductDetails();
    if (productId) {
      fetchSalesData();
    }
  }, [productId]);

  if (!product) return <LoadingSkeleton />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white to-gray-50"
    >
      {/* Header Section */}
      <div className="w-full bg-white shadow-sm mb-6 ml-16">
        <div className="container mx-auto py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {product.title}
          </h1>
          <div className="flex items-center mt-2">
            <div className="flex mr-2">
              {Array.from({ length: 5 }, (_, index) => (
                index < product.rating ? (
                  <AiFillStar key={index} size={20} className="text-[#FFAD33]" />
                ) : (
                  <CiStar key={index} size={20} className="text-[#FFAD33]" />
                )
              ))}
            </div>
            <span className="text-gray-600">({product.reviews} Reviews)</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Product Image */}
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
              <img
                className="w-full h-[500px] object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                src={product.images[0]}
                alt={product.title}
              />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-semibold capitalize">{product.status}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Min. Order</p>
                  <p className="font-semibold">{product.minOrderQty} units</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Product Details */}
          <motion.div 
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="lg:col-span-7"
          >
            <div className="grid gap-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">MRP</p>
                    <p className="text-3xl font-bold">₹{product.maxRetailPrice}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">Selling Price</p>
                    <p className="text-3xl font-bold text-green-600">₹{product.sellingPrice}</p>
                  </div>
                </div>
              </div>

              {/* Product Details Card */}
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Category', value: product.subCategory },
                    { label: 'Material', value: product.material },
                    { label: 'Size', value: product.size },
                    { label: 'Product ID', value: product.productId },
                    { label: 'Vendor ID', value: product.vendorId },
                    { label: 'Last Updated', value: new Date(product.updatedAt.toDate()).toLocaleString() }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-600 text-sm">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analytics Section - Full Width */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 mb-12"
        >
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Sales Analytics
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Sales Line Chart */}
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4">Monthly Sales Trend</h3>
                {salesData && (
                  <Line
                    data={salesData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Monthly Sales History' }
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                      }
                    }}
                  />
                )}
              </div>

              {/* Sales Distribution Bar Chart */}
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4">Sales Distribution</h3>
                {salesData && (
                  <Bar
                    data={{
                      ...salesData,
                      datasets: [{
                        ...salesData.datasets[0],
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        hoverBackgroundColor: 'rgba(53, 162, 235, 0.7)'
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Sales Distribution by Month' }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;
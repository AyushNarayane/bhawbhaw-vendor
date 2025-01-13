"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";

const ProductDetailsPage = ({ params }) => {
  const router = useRouter();
  const { productId } = params;
  const [product, setProduct] = useState(null);

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

    fetchProductDetails();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-white text-black font-poppins">
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg">
            <img
              className="w-full h-[500px] object-contain rounded-xl"
              src={product.images[0]}
              alt={product.title}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            <div className="flex items-center mb-4">
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

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">MRP</span>
                <span className="text-2xl font-bold text-gray-900">₹{product.maxRetailPrice}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Selling Price</span>
                <span className="text-2xl font-bold text-gray-900">₹{product.sellingPrice}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Category</span>
                <span className="text-gray-900">{product.subCategory}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Material</span>
                <span className="text-gray-900">{product.material}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Size</span>
                <span className="text-gray-900">{product.size}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Minimum Order Quantity</span>
                <span className="text-gray-900">{product.minOrderQty}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Product ID</span>
                <span className="text-gray-900">{product.productId}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Vendor ID</span>
                <span className="text-gray-900">{product.vendorId}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Status</span>
                <span className="text-gray-900 capitalize">{product.status}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">
                  {new Date(product.updatedAt.toDate()).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
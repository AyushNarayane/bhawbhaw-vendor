"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRedirect = async () => {
    try {
      setIsLoading(true);
      await router.push("/");
    } catch (error) {
      console.error("Navigation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-gray-600 mb-6">You are not authorized to access this page.</p>
      <button
        onClick={handleRedirect}
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Redirecting..." : "Go to Home"}
      </button>
    </div>
  );
}

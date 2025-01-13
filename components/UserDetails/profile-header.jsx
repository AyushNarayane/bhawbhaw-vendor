'use client';

import React from "react";
import { ArrowLeftIcon } from "lucide-react";

export function ProfileHeader() {
  return (
    <div
      className="flex items-center justify-between bg-gray-200  p-4 rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-full bg-white dark:bg-gray-700"
        >
          <ArrowLeftIcon
            className="h-6 w-6 text-gray-600 dark:text-gray-300"
          />
        </button>
        <div>
          <h1 className="text-xl font-semibold">
            Meet Kritika!
          </h1>
          <p
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            KRIT84867784
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Block
        </button>
        <img
          src="https://github.com/yusufhilmi.png"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
}

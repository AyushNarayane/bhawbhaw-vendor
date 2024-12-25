"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Button } from "@/components/users/uiTwo/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Default");
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const tabs = ["Pending", "Completed"];

  const orders = [
    {
      bookingId: "YGSBGFCNDB",
      status: "Pending",
      amount: "Rs. 678",
      date: "11-09-2024 18:00:00",
    },
    {
      bookingId: "YGSBGFCNDB",
      status: "Pending",
      amount: "Rs. 678",
      date: "11-09-2024 18:00:00",
    },
    {
      bookingId: "YGSBGFCNDB",
      status: "Pending",
      amount: "Rs. 678",
      date: "11-09-2024 18:00:00",
    },
  ];

  // Calculate total pages based on the number of orders
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Get the current page's orders
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-3">
        <h1 className="text-4xl font-bold mb-6">Payments</h1>

        {/* Top Controls: Sort, Filter, Search */}
        <div className="flex justify-between items-center mb-4">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 flex items-center">
                Sort
                <FiChevronDown className="ml-2" /> {/* Arrow Icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onSelect={() => setSortOption("Ascending")}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortOption("Descending")}>
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 flex items-center">
                Filter
                <FiChevronDown className="ml-2" /> {/* Arrow Icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onSelect={() => setFilterOption("All")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterOption("Completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterOption("Pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Input */}
          <div className="flex items-center">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-4"
            />
            <Button variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582a9.977 9.977 0 00-2.614 6.319A10.014 10.014 0 1012 2.05V7h4"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 me-4 py-2 ${
              selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
            }`}
            variant={selectedTab === tab ? "solid" : "outline"}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Orders Table */}

      <div className="mt-8 bg-white px-6 pb-6 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-[#C9ABA0]">
              <TableHead className="text-[#C9ABA0] py-6">Booking ID</TableHead>
              <TableHead className="text-[#C9ABA0]">Status</TableHead>
              <TableHead className="text-[#C9ABA0]">Amount</TableHead>
              <TableHead className="text-[#C9ABA0]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((product) => (
              <TableRow key={product.id} className="border-none">
                <TableCell className="pt-5">{product.bookingId}</TableCell>
                <TableCell className="pt-5">{product.status}</TableCell>
                <TableCell className="pt-5">{product.amount}</TableCell>
                <TableCell className="pt-5">{product.data}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

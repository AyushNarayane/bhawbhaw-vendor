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

  const pendingPayments = [
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

  const completedPayments = [
    {
      bookingId: "COMPLETED01",
      status: "Completed",
      amount: "Rs. 890",
      date: "10-09-2024 15:30:00",
    },
    {
      bookingId: "COMPLETED02",
      status: "Completed",
      amount: "Rs. 1200",
      date: "09-09-2024 14:20:00",
    },
  ];

  // Calculate total pages based on the selected tab's data
  const currentData = selectedTab === "Pending" ? pendingPayments : completedPayments;
  const totalPages = Math.ceil(currentData.length / ordersPerPage);

  // Get the current page's orders
  const currentOrders = currentData.slice(
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
               { /* Arrow Icon */}
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
                        placeholder="Search by Booking ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mr-4"
                      />
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
      <div className="bg-[#F3EAE7] rounded-lg shadow-md mt-4">
        <Table className="border-none">
          <TableHeader className="min-w-10">
            <TableRow className="border-b transition-colors hover:bg-muted/50">
              <TableHead className="py-4 font-semibold">Booking ID</TableHead>
              <TableHead className="py-4 font-semibold">Status</TableHead>
              <TableHead className="py-4 font-semibold">Amount</TableHead>
              <TableHead className="py-4 font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((payment, index) => (
              <TableRow 
                key={`${payment.bookingId}-${index}`} 
                className="my-2 shadow-sm border-none overflow-hidden rounded-xl bg-transparent"
              >
                {[
                  { id: 'bookingId', content: payment.bookingId },
                  { 
                    id: 'status',
                    content: <span className={`px-2 py-1 rounded ${
                      payment.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {payment.status}
                    </span>
                  },
                  { id: 'amount', content: payment.amount },
                  { id: 'date', content: payment.date }
                ].map((cell, cellIndex) => (
                  <TableCell 
                    key={`${payment.bookingId}-${cell.id}`}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F3EAE7]'} px-4 py-4 ${
                      cellIndex === 0 ? 'rounded-s-xl' : ''
                    } ${
                      cellIndex === 3 ? 'rounded-e-xl' : ''
                    }`}
                  >
                    {cell.content}
                  </TableCell>
                ))}
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

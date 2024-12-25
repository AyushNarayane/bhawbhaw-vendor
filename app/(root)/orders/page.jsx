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
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import Protected from "@/components/Protected/Protected";
import { useAuth } from "@/hooks/auth-context";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const OrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState("Initiated");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Descending");
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorId, setVendorId] = useState('');
  const [orders, setOrders] = useState([]);
  const ordersPerPage = 5;
  const { currentUser } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(()=>{
    if(currentUser){
      setVendorId(currentUser.id)
      fetchOrders(currentUser.id);
    }
  },[currentUser])

  const tabs = [
    "Initiated",
    "Captured",
    "Manifested",
    "Ready for Pickup",
    "Pickup Raised",
    "Cancelled",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Returned",
    "Rejected",
  ];

  const statusMapping = {
    "Initiated": "initiated",
    "Captured": "captured",
    "Manifested": "manifested",
    "Ready for Pickup": "readyForPickup",
    "Pickup Raised": "pickupRaised",
    "Cancelled": "cancelled",
    "In Transit": "inTransit",
    "Out for Delivery": "outForDelivery",
    "Delivered": "delivered",
    "Returned": "returned",
    "Rejected": "rejected",
  };

  const fetchOrders = async (vendorId) => {
    try {
      const response = await fetch(`/api/orders/getOrdersByVendorId?vendorId=${vendorId}`);
      const data = await response.json();
      setAllOrders(data.orders || []);
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    let filtered = [...allOrders];

    const dbStatus = statusMapping[selectedTab];
    if (dbStatus && dbStatus !== "All") {
      filtered = filtered.filter((order) => order.status === dbStatus);
    }
  
    // Additional filter based on other criteria if needed
    if (filterOption !== "All") {
      filtered = filtered.filter((order) => order.status === filterOption);
    }
  
    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || // Check for orderId match
        (order.orderId && order.orderId.toLowerCase().includes(searchQuery.toLowerCase())) || // Check for customer name match
        (order?.shippingDetails && order?.shippingDetails?.address?.toLowerCase().includes(searchQuery.toLowerCase())) // Check for product name match
      );
    }

    
    // Sort the filtered orders
    if (sortOption === "Ascending") {
      filtered = filtered.sort((a, b) =>
        a.updatedAt && b.updatedAt ? new Date(a.updatedAt).toISOString().localeCompare(new Date(b.updatedAt).toISOString()) : 0
      );
    } else if (sortOption === "Descending") {
      filtered = filtered.sort((a, b) =>
        b.updatedAt && a.updatedAt ? new Date(b.updatedAt).toISOString().localeCompare(new Date(a.updatedAt).toISOString()) : 0
      );
    }
    
  
     // For debugging
    setOrders(filtered); // Update the orders to display
  }, [allOrders, filterOption, selectedTab, searchQuery, sortOption]);
  


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const totalPages = Math.ceil((orders?.length || 0) / ordersPerPage);

  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleChangeStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const response = await fetch("/api/orders/updateOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder.orderId, data: { status: newStatus } }),
      });
      if (response.ok) {
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === selectedOrder.orderId ? { ...order, status: newStatus } : order
          )
        );
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleConfirmStatusChange = () => {
    handleChangeStatus(selectedStatus);
    setModalOpen(false);
  };


  return (
    <div className="p-6">
      <div className="flex justify-between mb-3">
        <h1 className="text-4xl font-bold mb-6">Orders</h1>

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
      <div
        className="flex flex-wrap mb-6 overflow-x-auto"
        style={{ maxWidth: "calc(100vw - 20rem)" }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 mb-5 me-4 py-2 ${
              selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
            }`}
            variant={selectedTab === tab ? "solid" : "outline"}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
      <Table className="border-none">
        <TableHeader>
          <TableRow>
            <TableHead className="border-none">Product Title</TableHead>
            <TableHead className="border-none">Category</TableHead>
            <TableHead className="border-none">Quantity</TableHead>
            <TableHead className="border-none">Selling Price</TableHead>
            <TableHead className="border-none">Shipping Address</TableHead>
            <TableHead className="border-none">Status</TableHead>
            <TableHead className="border-none">Total Amount</TableHead>
            <TableHead className="border-none">Order Date</TableHead>
            <TableHead className="border-none">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentOrders.map((order, index) => (
            <TableRow key={index} className="border-none">
              <TableCell className="border-none">
                {order.products[0]?.title || "N/A"}
              </TableCell>
              <TableCell className="border-none">
                {order.products[0]?.category || "N/A"}
              </TableCell>
              <TableCell className="border-none">
                {order.products[0]?.quantity || "N/A"}
              </TableCell>
              <TableCell className="border-none">
                {order.products[0]?.sellingPrice || "N/A"}
              </TableCell>
              <TableCell className="border-none">
                {`${order.shippingDetails?.address || ""}, ${order.shippingDetails?.city || ""}, ${order.shippingDetails?.state || ""}`}
              </TableCell>
              <TableCell className="border-none">
                {order.status || "N/A"}
              </TableCell>
              <TableCell className="border-none">
                {order.totalAmount || "N/A"}
              </TableCell>
              <TableCell className="border-none">
                {order.createdAt && order.createdAt.seconds ? (
                  (() => {
                    const timestampSeconds = order.createdAt.seconds;
                    const timestampNanoseconds = order.createdAt.nanoseconds || 0;
                    const totalMilliseconds =
                      timestampSeconds * 1000 + timestampNanoseconds / 1000000;
                    const date = new Date(totalMilliseconds);
                    return new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    }).format(date);
                  })()
                ) : (
                  new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  }).format(new Date(order.createdAt)) || "N/A"
                )}
              </TableCell>
              <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedOrder(order);
                      setModalOpen(true);
                    }}
                  >
                    Change Status
                  </Button>
                </TableCell>
                <TableCell className="border-none">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                      <DialogDescription>
                        <p><strong>Product Title:</strong> {selectedOrder?.products[0]?.title || "N/A"}</p>
                        <p><strong>Category:</strong> {selectedOrder?.products[0]?.category || "N/A"}</p>
                        <p><strong>Description:</strong> {selectedOrder?.products[0]?.description || "N/A"}</p>
                        <p><strong>Quantity:</strong> {selectedOrder?.products[0]?.quantity || "N/A"}</p>
                        <p><strong>Selling Price:</strong> {selectedOrder?.products[0]?.sellingPrice || "N/A"}</p>
                        <p><strong>Shipping Address:</strong> {`${selectedOrder?.shippingDetails?.address || ""}, ${selectedOrder?.shippingDetails?.city || ""}, ${selectedOrder?.shippingDetails?.state || ""}`}</p>
                        <p><strong>Status:</strong> {selectedOrder?.status || "N/A"}</p>
                        <p><strong>Total Amount:</strong> {selectedOrder?.totalAmount || "N/A"}</p>
                        <p><strong>Order Date:</strong> {new Date(selectedOrder?.createdAt).toLocaleDateString() || "N/A"}</p>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
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
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Change Order Status</DialogTitle>
            <DialogDescription>
              Select a new status for order #{selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <select
              className="border border-gray-300 rounded px-4 py-2 w-full"
              onChange={(e) => setSelectedStatus(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select status
              </option>
              {Object.keys(statusMapping).map((status) => (
                <option key={status} value={statusMapping[status]}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmStatusChange}
              disabled={!selectedStatus}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}

export default Protected(OrdersPage , ["Ecommerce"]);

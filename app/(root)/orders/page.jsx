"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  getCoreRowModel, 
  useReactTable, 
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel 
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
import Image from "next/image";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const OrderTable = ({ data, columns, onView, onChangeStatus }) => {
  const [search, setSearch] = useState("orderId");
  const searchTitles = ["orderId", "productTitle", "status", "shippingAddress"];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <Input
            placeholder="Search by search type..."
            value={table.getColumn(search)?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn(search)?.setFilterValue(event.target.value)
            }
            className="w-full md:w-[300px]"
          />
        </div>
        <Select
          onValueChange={(e) => {
            setSearch(e);
          }}
        >
          <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none w-1/4">
            <SelectValue placeholder="Select a search type" />
          </SelectTrigger>

          <SelectContent>
            {searchTitles.map((mt) => (
              <SelectItem key={mt} value={mt} className="capitalize">
                {mt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="p-4">
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        className="hover:bg-muted/50"
                        onClick={() => onView(row.original)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        className="hover:bg-muted/50"
                        onClick={() => onChangeStatus(row.original)}
                      >
                        Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-[400px] text-center"
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="relative w-48 h-48">
                      <Image
                        src="/empty-products.svg"  // Make sure this image exists in your public folder
                        alt="No orders"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800">No Orders Found</h3>
                      <p className="text-gray-500">You dont have any orders at the moment.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

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

  const fetchOrders = async () => {
    try {
      console.log("Fetching all orders"); // Debug log
      const ordersRef = collection(db, 'orders');
      
      // Remove the vendorId filter to get all orders
      const querySnapshot = await getDocs(ordersRef);
      console.log("Number of orders found:", querySnapshot.size); // Debug log
      
      const ordersData = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const orderData = docSnapshot.data();
        console.log("Raw order data:", orderData); // Debug log
        
        const products = orderData.products || [];
        const productsWithDetails = [];
        
        for (const product of products) {
          try {
            if (product.productId) {
              const productRef = doc(db, 'products', product.productId);
              const productSnap = await getDoc(productRef);
              
              if (productSnap.exists()) {
                const productData = productSnap.data();
                productsWithDetails.push({
                  ...product,
                  title: productData.title || 'N/A',
                  category: productData.category || 'N/A',
                  description: productData.description || '',
                  images: productData.images || []
                });
              } else {
                productsWithDetails.push({
                  ...product,
                  title: 'Product Not Found',
                  category: 'N/A'
                });
              }
            }
          } catch (error) {
            console.error("Error fetching product details:", error);
            productsWithDetails.push({
              ...product,
              title: 'Error Loading Product',
              category: 'N/A'
            });
          }
        }
        
        ordersData.push({
          ...orderData,
          orderId: docSnapshot.id,
          products: productsWithDetails
        });
      }
      
      console.log("Processed orders data:", ordersData); // Debug log
      setAllOrders(ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Remove currentUser dependency

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

  // Add this function to refresh orders after status update
  const refreshOrders = () => {
    if (currentUser?.id) {
      fetchOrders(currentUser.id);
    }
  };

  // Modify handleChangeStatus to refresh orders after update
  const handleChangeStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const response = await fetch("/api/orders/updateOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId: selectedOrder.orderId, 
          data: { status: newStatus } 
        }),
      });
      
      if (response.ok) {
        refreshOrders(); // Refresh orders after successful update
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

  const columns = useMemo(
    () => [
      {
        header: "Product Title",
        accessorFn: (row) => row.products[0]?.title || "N/A",
      },
      {
        header: "category",
        accessorFn: (row) => row.products[0]?.category || "N/A",
      },
      {
        header: "Quantity",
        accessorFn: (row) => row.products[0]?.quantity || "N/A",
      },
      {
        header: "Selling Price",
        accessorFn: (row) => row.products[0]?.sellingPrice || "N/A",
      },
      {
        header: "Shipping Address",
        accessorFn: (row) => 
          `${row.shippingDetails?.address || ""}, ${row.shippingDetails?.city || ""}, ${row.shippingDetails?.state || ""}`,
      },
      {
        header: "Status",
        accessorKey: "status",
      },
      {
        header: "Total Amount",
        accessorKey: "totalAmount",
      },
      {
        header: "Order Date",
        accessorFn: (row) => {
          if (row.createdAt?.seconds) {
            const timestampSeconds = row.createdAt.seconds;
            const timestampNanoseconds = row.createdAt.nanoseconds || 0;
            const totalMilliseconds = timestampSeconds * 1000 + timestampNanoseconds / 1000000;
            const date = new Date(totalMilliseconds);
            return new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            }).format(date);
          }
          return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
          }).format(new Date(row.createdAt)) || "N/A";
        },
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="text-4xl font-bold">Orders</h1>
        {/* Tabs in scrollable container */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 min-w-max pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`whitespace-nowrap px-3 py-1.5 text-sm ${
                  selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
                }`}
                variant={selectedTab === tab ? "solid" : "outline"}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <OrderTable 
            data={currentOrders}
            columns={columns}
            onView={(order) => setSelectedOrder(order)}
            onChangeStatus={(order) => {
              setSelectedOrder(order);
              setModalOpen(true);
            }}
          />
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white max-w-[90%] md:max-w-[600px]">
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

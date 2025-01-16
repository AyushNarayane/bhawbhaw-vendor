"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  getCoreRowModel, 
  useReactTable, 
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel 
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Pagination } from "@/components/ui/pagination";
import { FiChevronDown } from "react-icons/fi";
import Protected from "@/components/Protected/Protected";
import { useAuth } from "@/hooks/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const BookingTable = ({ data, columns, onView, onChangeStatus }) => {
  const [search, setSearch] = useState("bookingID");
  const searchTitles = ["bookingID", "serviceName", "name", "phoneNumber"];

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
            className="w-full md:w-[300px] focus:outline-none rounded-lg bg-[#F3EAE7] text-[#85716B]"
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg shadow-md shadow-md w-full max-w-[95vw] overflow-x-auto">
        <Table className="border-none  min-w-[800px]">
          <TableHeader className="min-w-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-9 m-0 p-0 bg-[#F3EAE7]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 font-semibold text-[#4D413E]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                <TableHead className="py-3 font-semibold text-[#4D413E]">Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
                return (
                  <TableRow
                    key={row.id}
                    className="my-1 shadow-sm border-none overflow-hidden rounded-xl bg-transparent"
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell 
                        key={cell.id} 
                        className={`${bgColor} px-3 py-1 ${cellIndex === 0 ? 'rounded-s-xl' : ''}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell className={`${bgColor} px-3 py-2 rounded-e-xl`}>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => onView(row.original)}
                          className="bg-[#B29581] hover:bg-[#a0846f] text-white"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => onChangeStatus(row.original)}
                          className="bg-white hover:bg-[#a0846f] text-black"
                        >
                          Change Status
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-[#85716B]"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-[#85716B]">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-[#B29581] border-[#B29581] hover:bg-[#F3EAE7]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-[#B29581] border-[#B29581] hover:bg-[#F3EAE7]"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const BookingPage = () => {
  const [selectedTab, setSelectedTab] = useState("Incoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Default");
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [viewBooking, setViewBooking] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const ordersPerPage = 5;
  const tabs = ["Completed", "Cancelled", "Incoming"];
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `/api/services/getBookingsByVendorId?vendorId=${currentUser.id}`
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const applyFilters = (data) => {
    let filteredData = data;

    // Filter by tab status
    filteredData = filteredData.filter(
      (booking) => booking.status === selectedTab.toLowerCase()
    );

    // Search by booking ID or name
    if (searchQuery) {
      filteredData = filteredData.filter(
        (booking) =>
          booking.bookingID.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.selectedService.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Sort by selected option
    if (sortOption === "Ascending") {
      filteredData.sort((a, b) =>
        a.bookingID.localeCompare(b.bookingID, "en", { numeric: true })
      );
    } else if (sortOption === "Descending") {
      filteredData.sort((a, b) =>
        b.bookingID.localeCompare(a.bookingID, "en", { numeric: true })
      );
    }

    return filteredData;
  };

  const filteredBookings = applyFilters(orders);
  const totalPages = Math.ceil(filteredBookings.length / ordersPerPage);

  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleStatusChange = (status) => {
    // Set the selected status for updating
    setNewStatus(status);
  };

  const saveStatusChange = async () => {
    if(newStatus === ""){
      return
    }
    try {
      const response = await fetch(`/api/services/updateBooking?serviceID=${viewBooking.bookingID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceData: { status: newStatus } }),
      });

      if (response.ok) {
        console.log(`Status updated to: ${newStatus}`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.bookingID === viewBooking.bookingID ? { ...order, status: newStatus } : order
          )
        );
        setViewBooking(false);
        setIsStatusModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Error updating status:", errorData.message);
      }
    } catch (error) {
      console.error("Failed to update status:", error.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Booking ID",
        accessorKey: "bookingID",
      },
      {
        header: "Service",
        accessorKey: "selectedService.serviceName",
      },
      {
        header: "Full Name",
        accessorKey: "contactInfo.name",
      },
      {
        header: "Contact",
        accessorKey: "contactInfo.phoneNumber",
      },
      {
        header: "Date",
        accessorKey: "calendarAndSlot.date",
      },
    ],
    []
  );

  return (
    <div className="sm:px-6 py-6 px-2">
      <div className="flex flex-wrap justify-between mb-3">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Bookings</h1>

        <div className="flex sm:flex-nowrap flex-wrap sm:justify-between justify-start items-center mb-4">
          {/* Controls section */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 sm:mt-0 mt-2 flex items-center">
                Sort
                <FiChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            {/* ...existing dropdown content... */}
          </DropdownMenu>

          {/* ...existing controls... */}
        </div>
      </div>

      {/* Tab buttons */}
      <div className="flex md:flex-wrap flex-nowrap sm:mb-6 mb-2 table-scrollbar overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 mb-5 me-4 py-2 ${
              selectedTab === tab ? "bg-[#B29581] text-white" : "text-[#B29581]"
            } hover:bg-[#a0846f]`}
            variant={selectedTab === tab ? "solid" : "outline"}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg ">        <BookingTable 
          data={currentBookings}
          columns={columns}
          onView={(booking) => setViewBooking(booking)}
          onChangeStatus={(booking) => {
            setViewBooking(booking);
            setIsStatusModalOpen(true);
          }}
        />
      </div>

      {viewBooking && !isStatusModalOpen && (
        <Dialog open={viewBooking} onOpenChange={() => setViewBooking(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                <div className="space-y-2">
                  <p><strong>Booking ID:</strong> {viewBooking.bookingID}</p>
                  <p><strong>Service:</strong> {viewBooking.selectedService.serviceName}</p>
                  <p><strong>Full Name:</strong> {viewBooking.contactInfo.name}</p>
                  <p><strong>Email:</strong> {viewBooking.contactInfo.email}</p>
                  <p><strong>Phone:</strong> {viewBooking.contactInfo.phoneNumber}</p>
                  <p><strong>Address:</strong> {viewBooking.contactInfo.address}</p>
                  <p><strong>Date:</strong> {viewBooking.calendarAndSlot.date}</p>
                  <p><strong>Time Slot:</strong> {viewBooking.calendarAndSlot.timeSlot}</p>
                  <p><strong>Duration:</strong> {viewBooking.calendarAndSlot.duration}</p>
                  <p><strong>Price Per Hour:</strong> {viewBooking.selectedService.pricePerHour}</p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setViewBooking(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {isStatusModalOpen && viewBooking && (
        <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Change Status</DialogTitle>
              <DialogDescription>
                <p>Select a new status for this booking:</p>
                <select
                  value={newStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="mt-2 p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="incoming">Incoming</option>
                </select>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => {
                setViewBooking(false)
                setIsStatusModalOpen(false)
              }}>Cancel</Button>
              <Button onClick={saveStatusChange}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default Protected(BookingPage, ["Service"]);

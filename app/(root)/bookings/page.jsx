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
import { useEffect, useState } from "react";
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


  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-4xl font-bold">Bookings</h1>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Sort <FiChevronDown className="ml-2" />
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Filter <FiChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onSelect={() => setFilterOption("All")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterOption("Completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterOption("Incoming")}>
                Incoming
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Search by service or booking ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex mb-4 space-x-4">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`${
              selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>

      <Table className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBookings.map((booking, index) => (
            <TableRow key={index}>
              <TableCell>{booking.bookingID}</TableCell>
              <TableCell>{booking.selectedService.serviceName}</TableCell>
              <TableCell>{booking.contactInfo.fullName}</TableCell>
              <TableCell>{booking.contactInfo.phoneNumber}</TableCell>
              <TableCell>{booking.calendarAndSlot.date}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => setViewBooking(booking)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => {
                    setViewBooking(booking);
                    setIsStatusModalOpen(true);
                  }}
                >
                  Change Status
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
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
                  <p><strong>Full Name:</strong> {viewBooking.contactInfo.fullName}</p>
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

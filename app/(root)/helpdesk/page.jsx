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
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/auth-context";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  X,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import { doc, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";

const EmptyState = ({ onAddClick }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Image
      src="/empty-coupon.svg"
      alt="No queries"
      width={192}
      height={192}
      className="mb-8"
    />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Queries Found</h3>
    <p className="text-gray-500 text-center max-w-sm mb-8">
      You havent raised any queries yet. Click the button below to raise your first query.
    </p>
    <Button 
      className="bg-[#B29581] hover:bg-[#a0846f] text-white"
      onClick={onAddClick}
    >
      Raise Your First Query
    </Button>
  </div>
);

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Raise new issue");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Default");
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("active");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [changed, setChanged] = useState(false);
  const [isQueryAdded, setIsQueryAdded] = useState(false);
  const [data, setData] = useState([]);
  const [item, setItem] = useState();
  const [sendModal, setSendModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedQueries, setSelectedQueries] = useState([]);
  const [reopenMsg, setReopenedMsg] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [search, setSearch] = useState("id");

  const ordersPerPage = 5;

  const tabs = ["Raise new issue"];

  const getQueries = async () => {
    setLoading(true);
    try {
      if(currentUser){
        const response = await fetch(`/api/getAllQueries?vendorId=${currentUser?.uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const queries = data.queries.map((query) => {
            const timestampSeconds = query?.createdAt.seconds;
            const timestampMilliseconds = query?.createdAt.nanoseconds;
            const totalMilliseconds =
              timestampSeconds * 1000 + timestampMilliseconds / 1000000;
  
            const date = new Date(totalMilliseconds);
            return {
              ...query,
              createdAt: date.toLocaleString(),
            };
          });
  
          setData(queries);
        } else {
          console.log("Failed to fetch queries");
        }
      }      
    } catch (error) {
      console.log("Error fetching queries", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getQueries();
  }, [changed, currentUser]);  

  const queryTitles = [
    "Account",
    "Tech Support",
    "Complaint and Feedback",
    "Order related issue",
  ];

  const handleViewClick = async (queryId) => {
    console.log(queryId);
    try {
      const response = await fetch(`/api/getQueryFromId?id=${queryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setItem(data.query);
        setSelectedQueries([queryId]);
        setViewModal(true);
      } else {
        console.log("Query not found");
      }
    } catch (error) {
      console.log("Error getting details for viewing a query", error);
    }
  };
  

  const handleSendClick = async (queryId) => {
    console.log(queryId)
    try {
      const response = await fetch(`/api/getQueryFromId?id=${queryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItem(data.query); // Fix: set data.query instead of data
        setSelectedQuery(queryId);
        setSelectedQueries([queryId]);
        setSendModal(true);
      }
    } catch (error) {
      console.log("Error getting details for viewing a query");
    }
  };

  const handleReopen = async () => {
    try {
      setSendModal(false);
      const response = await fetch(`/api/reopenQuery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedQuery,
          reopenMsg,
        }),
      });
  
      if (response.ok) {
        console.log("Resolve Message Sent");
        getQueries()
      } else {
        console.log("Error reopening query");
      }
    } catch (error) {
      console.log("Error Sending Resolve Message", error);
    }
  };

  const handleViewClose = () => {
    setViewModal(false);
    setSelectedQueries([]);
    setItem({}); // Clear the item state
  };
  
  const handleSendClose = () => {
    setSendModal(false);
    setSelectedQueries([]);
    setItem({}); // Clear the item state
    setReopenedMsg(''); // Clear the reopen message
    setSelectedQuery(''); // Clear the selected query
  };

  const columns = [
    { accessorKey: "id", header: "Query ID" },
    { accessorKey: "title", header: "Category" },
    { accessorKey: "createdAt", header: "Date" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => (
        <div className="pt-5 text-red-400 flex items-center gap-1 ">
          <p className="h-2 w-2 bg-red-500 rounded-full mb-4"></p>{" "}
          <div className=" mb-4">
          {row.original.status}
        </div>
        </div>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Dialog onOpenChange={handleViewClose} open={viewModal}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full flex justify-center items-center"
                onClick={() => handleViewClick(row.original.id)}>
                View
              </Button>
            </DialogTrigger>
          </Dialog>
          
          {row.original.status === "resolved" && (
            <Dialog onOpenChange={handleSendClose} open={sendModal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full flex justify-center items-center"
                  onClick={() => handleSendClick(row.original.id)}>
                  Re-Open
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    globalFilterFn: (row, columnId, filterValue) => {
      const id = row.original.id.toLowerCase();
      return id.includes(filterValue.toLowerCase());
    },
  });

  const searchTitles = ["id", "title", "status", "createdAt"];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Add console.log to debug currentUser data
      console.log("Current user data:", currentUser);
      console.log("Personal details:", currentUser?.personalDetails);

      const payload = {
        vendorId: currentUser?.id,
        vendorUId: currentUser?.uid,
        title,
        description,
        vendorDetails: {
          name: currentUser?.personalDetails?.name || '',
          email: currentUser?.personalDetails?.email || '',
          phoneNumber: currentUser?.personalDetails?.phoneNumber || '',
          address: currentUser?.personalDetails?.address || '',
          businessName: currentUser?.personalDetails?.businessName || '',
          vendorType: currentUser?.personalDetails?.vendorType || '',
          gstin: currentUser?.personalDetails?.gstin || '',
          // Add any other relevant personal details
        }
      };

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch('/api/addVendorQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Query added successfully:", result);
        setTitle("");
        setDescription("");
        setChanged((curr) => !curr);
        setIsQueryAdded(true);
        toast.success("Successfully Generated the Query");
      } else {
        const error = await response.json();
        console.error("Failed to generate query:", error);
        toast.error("Failed to generate the query");
      }
    } catch (error) {
      console.error("Error in adding query:", error);
      toast.error("Error generating query");
    }
    setLoading(false);
    setOpenDialogue(false);
  };

  const ViewDialog = () => (
    <Dialog open={viewModal} onOpenChange={handleViewClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Query Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Vendor Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-700">Vendor Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p>{item?.vendorDetails?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Business</p>
                <p>{item?.vendorDetails?.businessName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p>{item?.vendorDetails?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p>{item?.vendorDetails?.phoneNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Query Details */}
          <div className="flex flex-col">
            <span className="m-2">Query Title</span>
            <Input readOnly value={item?.title || ''} className="rounded-xl" />
          </div>
          {/* ... rest of the existing dialog content ... */}
        </div>
        <DialogFooter>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-3">
        <h1 className="text-4xl font-bold mb-6">Helpdesk</h1>
            <div className="flex justify-between items-center">
            <div className="flex flex-wrap overflow-x-auto">
            <div>
              <Dialog onOpenChange={setOpenDialogue} open={openDialogue}>
                <DialogTrigger asChild>
                  <Button className="rounded-md text-sm bg-[#695d56] text-white mr-3">
                    Raise an issue
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle>Raise a query</DialogTitle>
                    <DialogDescription>
                      Write the title and description of the query.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <Label
                        htmlFor="title"
                        className="flex justify-start w-full ml-1"
                      >
                        Title
                      </Label>
                      <Select
                        onValueChange={(e) => {
                          setTitle(e);
                        }}
                      >
                        <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a query type" />
                        </SelectTrigger>

                        <SelectContent>
                          {queryTitles.map((mt) => (
                            <SelectItem
                              key={mt}
                              value={mt}
                              className="capitalize bg-white"
                            >
                              {mt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Label
                        htmlFor="description"
                        className="flex w-full justify-start"
                      >
                        Description
                      </Label>
                      <Textarea
                        value={description}
                        id="description"
                        placeholder="Enter the description"
                        className="col-span-3"
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 flex flex-col">
                    <Button
                      disabled={title === "" || description === ""}
                      type="button"
                      className="bg-baw-baw-g3 text-white"
                      onClick={handleSubmit}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Generate Query"
                      )}
                    </Button>

                    <Button
                      onClick={() => {
                        setTitle("");
                        setDescription("");
                        setOpenDialogue(false);
                        setIsQueryAdded(false);
                        }}
                        variant="outline"
                      >
                        Close
                      </Button>
                      </DialogFooter>
                    </DialogContent>
                    </Dialog>
                  </div>
                  </div>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="mr-4 flex items-center">
                    Sort by Date
                    <FiChevronDown className="ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    <DropdownMenuItem onSelect={() => {
                    const sorted = [...data].sort((a, b) => {
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                      return dateB - dateA; // For newest first
                    });
                    setData(sorted);
                    }}>
                    Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {
                    const sorted = [...data].sort((a, b) => {
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                      return dateA - dateB; // For oldest first
                    });
                    setData(sorted);
                    }}>
                      Oldest First
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
          <div className="flex items-center">
            <Input
              placeholder="Search by Query ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-4"
            />
            <Button variant="outline" onClick={()=> getQueries()}>
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

      {/* Orders Table */}

      <div className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
         
          
          

        </div>

        <div className="bg-[#F3EAE7] rounded-lg shadow-md mt-4">
          <Table className="border-none">
            <TableHeader className="min-w-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-3 font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => {
                  const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
                  return (
                    <TableRow key={row.id} className="my-1 shadow-sm border-none overflow-hidden rounded-xl bg-transparent">
                      {row.getVisibleCells().map((cell, cellIndex) => (
                        <TableCell 
                          key={cell.id} 
                          className={`${bgColor} px-3 py-1 ${cellIndex === 0 ? 'rounded-s-xl' : ''} ${
                            cellIndex === row.getVisibleCells().length - 1 ? 'rounded-e-xl' : ''
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[400px] text-center"
                  >
                    <EmptyState onAddClick={() => setOpenDialogue(true)} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
           
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

      <ViewDialog />

      <Dialog open={sendModal} onOpenChange={handleSendClose}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Re-Open Query</DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex flex-col">
              <span className="m-2">Subject</span>
              <div className="rounded-xl border-solid border border-gray-400 p-4"></div>
                {item?.queryId}: Issue Re-Opened
              </div>
            </div>

            {(item?.status === "closed" || item?.status === "reopened") && (
              <div className="flex flex-col">
                <span className="m-2">Previous Re-Opened Message</span>
                <Textarea
                  readOnly
                  value={item?.reopenMsg || ''}
                  className="rounded-xl"
                />
              </div>
            )}

            <div className="flex flex-col">
              <span className="m-2">Re-Open Message</span>
              <Textarea
                value={reopenMsg}
                onChange={(e) => setReopenedMsg(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleReopen} className="bg-baw-baw-g3 text-white">
                Re-Open
              </Button>
              <Button variant="outline" onClick={handleSendClose}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
}

export default OrdersPage;

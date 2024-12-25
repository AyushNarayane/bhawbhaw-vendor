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
} from "lucide-react";
import toast from "react-hot-toast";
import { doc, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function OrdersPage() {
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
        setItem(data);
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
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const response = await fetch('/api/addVendorQuery', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              vendorId: currentUser?.id,
                              title,
                              description,
                              vendorUId: currentUser?.uid,
                            }),
                          });

                          if (response.ok) {
                            setTitle("");
                            setDescription("");
                            setChanged((curr) => !curr);
                            setIsQueryAdded(true);
                            toast.success("Successfully Generated the Query");
                          } else {
                            toast.error("Failed to generate the query");
                          }
                        } catch (error) {
                          console.log("Error in adding query", error);
                        }
                        setLoading(false);
                        setOpenDialogue(false);
                      }}
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

      <div className="mt-8 bg-white px-6 pb-6 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-[#C9ABA0]">
              <TableHead className="text-[#C9ABA0] py-6">Query ID</TableHead>
              <TableHead className="text-[#C9ABA0]">Category</TableHead>
              <TableHead className="text-[#C9ABA0]">Date</TableHead>
              <TableHead className="text-[#C9ABA0]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product) => (
              <TableRow key={product.id} className="border-none">
                <TableCell className="pt-5">{product.id}</TableCell>
                <TableCell className="pt-5">{product.title}</TableCell>
                <TableCell className="pt-5">{product.createdAt}</TableCell>
                <TableCell className="pt-5 text-red-400 flex items-center gap-1">
                  <p className="h-2 w-2 bg-red-500 rounded-full"></p>{" "}
                  {product.status}
                </TableCell>
                <TableCell className="pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-full flex justify-center items-center"
                      onClick={() => handleViewClick(product.id)}>
                        View
                    </Button>
                    {product.status === "resolved" && (
                      <Button
                      variant="outline"
                      className="rounded-full flex justify-center items-center"
                      onClick={() =>
                        handleSendClick(product.id)
                      }
                      >
                        Re-Open
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {viewModal && (
        <div
          className="fixed z-[9999] inset-0 z-10 overflow-y-auto flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white p-6 max-w-2xl rounded-xl shadow-xl w-3/4 max-h-4/5 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="flex justify-end pb-0">
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedQueries([]);
                }}
                className="focus:outline-none"
              >
                <X />
              </button>
            </div>
            <div className="flex justify-center items-center text-2xl font-semibold mb-4">
              Query Details
            </div>
            <div>
              <div className="flex flex-col">
                <span className="m-2">Query Title</span>
                <Input readOnly value={item.title} className="rounded-xl" />
              </div>
              <div className="flex flex-col">
                <span className="m-2">Query Description</span>
                <Textarea
                  readOnly
                  value={item.description}
                  className="rounded-xl"
                />
              </div>
            </div>
            {item.status === "active" ? (
              <></>
            ) : (
              <div className="flex flex-col">
                <span className="m-2">Resolved Message</span>
                <Textarea
                  readOnly
                  value={item.resolveMsg}
                  className="rounded-xl"
                />
              </div>
            )}
            {item.status === "reopened" ||
            (item.status === "closed" && item.reopenMsg) ? (
              <div className="flex flex-col">
                <span className="m-2">Re-Opened Message</span>
                <Textarea
                  readOnly
                  value={item.reopenMsg}
                  className="rounded-xl"
                />
              </div>
            ) : (
              <></>
            )}
            {item.status === "closed" ? (
              <div className="flex flex-col">
                <span className="m-2">Closed Message</span>
                <Textarea
                  readOnly
                  value={item.closeMsg}
                  className="rounded-xl"
                />
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-row justify-end mt-10">
              <Button
                type="submit"
                className="mx-2 text-white bg-baw-baw-g3"
                onClick={() => {
                  setViewModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {sendModal && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-3/4 max-h-4/5 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="flex justify-end pb-0">
              <button
                onClick={() => {
                  setSendModal(false);
                  setSelectedQueries([]);
                }}
                className="focus:outline-none"
              >
                <X />
              </button>
            </div>
            {/* <div className="flex justify-center items-center text-2xl font-semibold mb-4">
                Query Details
              </div> */}
            <div>
              <div className="flex flex-col">
                <span className="m-2">Subject</span>
                {/* <Input
                    readOnly
                    value={item.queryId}
                    className="rounded-xl"
                  /> */}
                <div className="rounded-xl border-solid border border-gray-400 p-4">
                  {item.queryId}: Issue Re-Opened
                </div>
              </div>

              {item.status === "closed" || item.status === "reopened" ? (
                <div className="flex flex-col">
                  <span className="m-2">Re-Opened Message</span>
                  <Textarea
                    readOnly
                    value={item.reopenMsg}
                    className="rounded-xl"
                  />
                </div>
              ) : (
                <></>
              )}

              <div className="flex flex-col">
                <span className="m-2">Re-Opened Message</span>
                <Textarea
                  value={reopenMsg}
                  onChange={(e) => setReopenedMsg(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="flex flex-row justify-end mt-10">
              <Button
                type="submit"
                className="mx-2 bg-baw-baw-g3 text-white"
                onClick={() => {
                  handleReopen();
                }}
              >
                Re-Open
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

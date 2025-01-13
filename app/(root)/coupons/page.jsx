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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/hooks/auth-context";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { IoMdRefresh } from "react-icons/io";
import Protected from "@/components/Protected/Protected";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Image from 'next/image';

const EmptyState = ({ onAddClick, activeTab }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Image
      src="/empty-coupon.svg"
      alt="No coupons"
      width={192}
      height={192}
      className="mb-8"
    />
    {activeTab === "Active" ? (
      <>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Coupons</h3>
        <p className="text-gray-500 text-center max-w-sm mb-8">
          You havent created any coupons yet. Start by creating your first coupon to attract more customers.
        </p>
        <Button 
          className="bg-[#B29581] hover:bg-[#a0846f] text-white"
          onClick={onAddClick}
        >
          Create Your First Coupon
        </Button>
      </>
    ) : (
      <>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Inactive Coupons</h3>
        <p className="text-gray-500 text-center max-w-sm mb-8">
          You dont have any inactive coupons yet. Coupons that you disable will appear here.
        </p>
      </>
    )}
  </div>
);

const CouponTable = ({ data, columns, onToggleStatus, onAddClick, activeTab }) => {
  const [search, setSearch] = useState("couponTitle");
  const searchTitles = ["couponTitle", "id", "discount", "minPrice"];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        
        
        

       
      </div>

      <div className="bg-white rounded-lg shadow-md mt-4">
        <Table className="border-none">
          <TableHeader className="min-w-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b transition-colors hover:bg-gray-50">
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
                <TableHead className="py-3 font-semibold">Actions</TableHead>
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
                    className={`${bgColor} my-1 shadow-sm border-none overflow-hidden rounded-xl`}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell 
                        key={cell.id} 
                        className={`px-3 py-1 ${cellIndex === 0 ? 'rounded-s-xl' : ''}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="px-3 py-2 rounded-e-xl">
                      <Button
                        onClick={() => onToggleStatus(row.original.id, row.original.status)}
                        className="bg-red-500 text-white"
                      >
                        {row.original.status === "Active" ? "Disable" : "Active"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-[400px] text-center"
                >
                  <EmptyState onAddClick={onAddClick} activeTab={activeTab} />
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

const CouponsPage = () => {

  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialogue, setOpenDialogue] = useState(false);
  const [couponTitle, setCouponTitle] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [discount, setDiscount] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const tabs = ["Active", "Inactive"];

  // useEffect(()=>{
  //   const filteredCoupons = coupons.filter(coupon => coupon.status === activeTab);
  // },[activeTab])

  const fetchCoupons = async () => {
    if (currentUser?.id) {
      const userId = currentUser?.id
      try {
        setRefresh(true)
        const response = await fetch(`/api/coupon/getCouponsByVendorId?vendorId=${userId}`);
        const result = await response.json();
        if (response.ok) {
          const fetchedCoupons = result.coupons;
          console.log(fetchedCoupons);
          setCoupons(fetchedCoupons);
          setFilteredCoupons(fetchedCoupons.filter(coupon => coupon.status === activeTab));
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally{
        setRefresh(false)
      }
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentUser]);

  useEffect(() => {
    setFilteredCoupons(coupons.filter(coupon => coupon.status === activeTab));
  }, [activeTab, coupons]);

  const handleToggleDisable = async (couponID, status) => {
    try {
      setLoading(true)
      const response = await fetch('/api/coupon/updateCoupon', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponID,
          updatedFields: { status: status === "Active" ? 'Inactive': "Active" },
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success('Coupon status updated');
        fetchCoupons();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Failed to update coupon:', error);
    } finally {
      setLoading(false)
    }
  };

  const isValidCouponTitle = (title) => /^[A-Z]{4}\d{2}$/.test(title);
  
  const columns = useMemo(
    () => [
      {
        header: "Coupon ID",
        accessorKey: "id",
      },
      {
        header: "Coupon Name",
        accessorKey: "couponTitle",
      },
      {
        header: "Percentage Discount",
        accessorKey: "discount",
      },
      {
        header: "Min. Price",
        accessorKey: "minPrice",
      },
      {
        header: "Number of times used",
        accessorKey: "timesUsed",
      },
      {
        header: "Created at",
        accessorFn: (row) => {
          const { createdAt } = row;
          if (createdAt?.seconds && createdAt?.nanoseconds) {
            return new Date(
              createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
            ).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            });
          }
          return new Date(createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
          });
        },
      },
    ],
    []
  );
  
  return (
    <div className="sm:px-6 py-6 px-2">
      <div className="flex flex-wrap justify-between mb-3">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Coupons</h1>

        {/* Top Controls */}
        <div className="flex sm:flex-nowrap flex-wrap sm:justify-between justify-start items-center mb-4">
          {/* Add Coupon */}
          <Dialog onOpenChange={setOpenDialogue} open={openDialogue}>
            <DialogTrigger asChild>
              <Button className="rounded-md text-sm bg-[#695d56] text-white mr-3">
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Add a Coupon</DialogTitle>
                <DialogDescription>
                  Enter details for the new coupon.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="couponTitle" className="flex justify-start w-full ml-1">
                  Coupon Name
                  </Label>
                  <Input
                    id="couponTitle"
                    placeholder="Coupon Name"
                    value={couponTitle}
                    onChange={(e) => setCouponTitle(e.target.value)}
                    className="bg-zinc-100"
                  />
                  {error && <span className="text-red-500 text-start w-full text-[10px]">{error}</span>}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="discount" className="flex w-full justify-start">
                  Percentage Discount
                  </Label>
                  <Input
                    id="discount"
                    placeholder="e.g., 20%"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="bg-zinc-100"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="minPrice" className="flex w-full justify-start">
                    Minimum Price
                  </Label>
                  <Input
                    id="minPrice"
                    placeholder="e.g., Rs. 500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-zinc-100"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 flex flex-col">
                <Button
                  disabled={!couponTitle || !discount || !minPrice}
                  className="bg-baw-baw-g3 text-white"
                  onClick={async () => {
                    if (!isValidCouponTitle(couponTitle)) {
                      setError("Coupon name must have 4 uppercase letters and 2 digits.");
                      return;
                    }
                    setError("");       
                    setLoading(true);
                    try {
                      const response = await fetch('/api/coupon/addCoupon', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          couponTitle: couponTitle,
                          discount: parseInt(discount),
                          timesUsed:0,
                          minPrice: parseInt(minPrice),
                          vendorId: currentUser?.id,
                        }),
                      });
                      if (response.ok) {
                        const newCoupon = await response.json();
                        console.log(newCoupon)
                        setCoupons((prevCoupons) => [...prevCoupons, newCoupon.data]);
                        setCouponTitle("");
                        setDiscount("");
                        setMinPrice("");
                        toast.success("Coupon added successfully!")
                      } else {
                        console.error("Failed to add the coupon");
                      }
                    } catch (error) {
                      console.error("Error adding coupon", error);
                    }
                    setLoading(false);
                    setOpenDialogue(false);
                  }}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Coupon"}
                </Button>
                <Button variant="outline" onClick={() => setOpenDialogue(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <Button variant="outline" onClick={fetchCoupons}>
              {refresh ? (
                  <ClipLoader size={17} color={"#000"} loading={refresh} />
              ) : (
                  <IoMdRefresh className="text-xl" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="flex md:flex-wrap flex-nowrap sm:mb-6 mb-2 table-scrollbar overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 mb-5 me-4 py-2 ${
              activeTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
            }`}
            variant={activeTab === tab ? "solid" : "outline"}
          >
            {tab}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="items-center justify-center flex py-2 h-[50vh] w-full rounded z-10">
          <ClipLoader
            color={"#000"}
            loading={loading}
            size={24}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <CouponTable 
            data={filteredCoupons}
            columns={columns}
            onToggleStatus={handleToggleDisable}
            onAddClick={() => setOpenDialogue(true)}
            activeTab={activeTab}
          />
        </div>
      )}
    </div>
  );
}

export default Protected(CouponsPage , ["Ecommerce", "Service"]);

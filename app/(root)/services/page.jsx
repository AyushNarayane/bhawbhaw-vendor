"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  getCoreRowModel, 
  useReactTable, 
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel 
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/users/uiTwo/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/users/uiTwo/table";
import { useAuth } from "@/hooks/auth-context";
import toast from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import Protected from "@/components/Protected/Protected";
import Image from "next/image";

const ServiceTable = ({ data, columns, onEdit, onDelete }) => {
  const [search, setSearch] = useState("serviceName");
  const searchTitles = ["serviceName", "title", "address", "phoneNumber"];

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
            console.log(e);
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
              .map((column) => {
                return (
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
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-[#F3EAE7] rounded-lg shadow-md">
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
                <TableHead className="py-3 font-semibold">Actions</TableHead>
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
                        className={`${bgColor} px-3 py-1 ${cellIndex === 0 ? 'rounded-s-xl' : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                    <TableCell className={`${bgColor} px-3 py-2 rounded-e-xl`}>
                      <div className="flex gap-4 justify-center">
                        <Button
                          variant="outline"
                          className="hover:bg-muted/50"
                          onClick={() => onEdit(row.original)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="hover:bg-muted/50"
                          onClick={() => onDelete(row.original.id)}
                        >
                          Delete
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
                  className="h-[400px] text-center"
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="relative w-48 h-48">
                      <Image
                        src="/empty-services.svg"
                        alt="No services"
                        width={192}
                        height={192}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800">No Services Found</h3>
                      <p className="text-gray-500">You havent added any services yet.</p>
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

const AddServicePage = () => {
  const { currentUser } = useAuth();
  const [serviceData, setServiceData] = useState({
    address: "",
    phoneNumber: "",
    pricePerHour: "",
    serviceName: "",
    title: "",
    image: null,
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [providerData, setProviderData] = useState({
    name: "",
    serviceType: "",
    experience: "",
    qualification: "",
    specialization: "",
    availability: "",
    expectedSalary: "",
  });

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/services/getServiceByVendorId?vendorId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        toast.error("Failed to fetch services.");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchServices();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setServiceData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = (service) => { 
    setServiceData({
      address: service.address,
      phoneNumber: service.phoneNumber,
      pricePerHour: service.pricePerHour,
      serviceName: service.serviceName,
      title: service.title,
      image: null,
    });
    setImagePreview(service.image?.[0] || null);
    setEditingServiceId(service.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (serviceId) => {
    setDeletingServiceId(serviceId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/services/deleteService?serviceID=${deletingServiceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Service deleted successfully!");
        fetchServices();
      } else {
        toast.error("Failed to delete service.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("An error occurred.");
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleUpload = async (sellerId, productId) => {
    if (!serviceData.image) return null;

    try {
      const storageRef = ref(storage, `productImages/SID${sellerId}/${productId}/${serviceData.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, serviceData.image);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Error during upload: ", error.message);
            reject(error);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    } catch (error) {
      console.error("Error in uploading image: ", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!serviceData.image && !isEditMode) {
      toast.error("Please upload an image!");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = serviceData.image ? await handleUpload(currentUser.id, Date.now().toString()) : imagePreview;
      if (!imageUrl) {
        toast.error("Image upload failed.");
        return;
      }

      const payload = {
        vendorId: currentUser.id,
        vendorName: currentUser.personalDetails.name,
        vendorEmail: currentUser.personalDetails.email,
        vendorPhoneNumber: currentUser.personalDetails.phoneNumber,
        serviceData: { ...serviceData, image: [imageUrl] },
      };

      const url = isEditMode ? `/api/services/updateService?serviceID=${editingServiceId}` : "/api/services/addService";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(isEditMode ? "Service updated successfully!" : "Service added successfully!");
        setServiceData({
          address: "",
          phoneNumber: "",
          pricePerHour: "",
          serviceName: "",
          title: "",
          image: null,
        });
        setIsEditMode(false);
        setIsDialogOpen(false);
        setEditingServiceId(null);
        setImagePreview(null);
        fetchServices();
      } else {
        toast.error("Failed to save service.");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (e) => {
    const { name, value } = e.target;
    setProviderData(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderSubmit = async () => {
    try {
      const response = await fetch('/api/serviceProvider/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...providerData,
          vendorId: currentUser.id,
          status: 'unverified'
        }),
      });

      if (response.ok) {
        toast.success("Service provider registration submitted!");
        setProviderData({
          name: "",
          serviceType: "",
          experience: "",
          qualification: "",
          specialization: "",
          availability: "",
          expectedSalary: "",
        });
        setIsProviderDialogOpen(false);
      } else {
        toast.error("Failed to register service provider");
      }
    } catch (error) {
      console.error("Error registering provider:", error);
      toast.error("An error occurred");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Service Name",
        accessorKey: "serviceName",
      },
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Price Per Hour",
        accessorKey: "pricePerHour",
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNumber",
      },
      {
        header: "Address",
        accessorKey: "address",
      },
      {
        header: "Image",
        cell: ({ row }) => (
          row.original.image && row.original.image[0] && (
            <img src={row.original.image[0]} alt="Service" width="50" height="50" />
          )
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
<div className="flex justify-between items-center w-full">
  <h1 className="text-4xl font-bold text-[#3f3f3f]">Services</h1>
  <div className="flex space-x-4">
    <Button
      variant="primary"
      className="bg-[#85716B] text-white hover:bg-[#6b5a55]"
      onClick={() => {
        setIsDialogOpen(true);
        setIsEditMode(false);
        setServiceData({
          address: "",
          phoneNumber: "",
          pricePerHour: "",
          serviceName: "",
          title: "",
          image: null,
        });
        setImagePreview(null);
      }}
    >
      Add New Service
    </Button>
    <Button
      variant="secondary"
      className="bg-[#85716B] text-white hover:bg-[#6b5a55]"
      onClick={() => setIsProviderDialogOpen(true)}
    >
      Register as Service Provider
    </Button>
  </div>
</div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Service" : "Add New Service"}</DialogTitle>
            <DialogDescription>Enter service details and upload an image.</DialogDescription>
          </DialogHeader>
          <Input 
            label="Service Name" 
            name="serviceName" 
            value={serviceData.serviceName} 
            onChange={handleChange} 
            required 
            placeholder="Enter the service name" 
          />

          <Input 
            label="Title" 
            name="title" 
            value={serviceData.title} 
            onChange={handleChange} 
            required 
            placeholder="Enter the title" 
          />

          <Input 
            label="Address" 
            name="address" 
            value={serviceData.address} 
            onChange={handleChange} 
            required 
            placeholder="Enter the address" 
          />

          <Input 
            label="Phone Number" 
            name="phoneNumber" 
            value={serviceData.phoneNumber} 
            onChange={handleChange} 
            required 
            placeholder="Enter the phone number" 
          />

          <Input 
            label="Price Per Hour" 
            name="pricePerHour" 
            type="number" 
            value={serviceData.pricePerHour} 
            onChange={handleChange} 
            required 
            placeholder="Enter the price per hour" 
          />

          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            placeholder="Upload an image" 
          />

          {imagePreview && <img src={imagePreview} alt="Preview" width="50" height="50" className="mt-2" />}

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : isEditMode ? "Save Changes" : "Submit"}
            </Button>
          </DialogFooter>

      
      
        </DialogContent>
      </Dialog>


      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>Are you sure you want to delete this service?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
            <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Service Provider Registration</DialogTitle>
            <DialogDescription>Enter your details to register as a service provider.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input 
              label="Full Name" 
              name="name" 
              value={providerData.name} 
              onChange={handleProviderChange} 
              required 
              placeholder="Enter your full name" 
            />

            <Input 
              label="Service Type" 
              name="serviceType" 
              value={providerData.serviceType} 
              onChange={handleProviderChange} 
              required 
              placeholder="Type of service you provide" 
            />

            <Input 
              label="Experience (years)" 
              name="experience" 
              type="number" 
              value={providerData.experience} 
              onChange={handleProviderChange} 
              required 
              placeholder="Years of experience" 
            />

            <Input 
              label="Qualification" 
              name="qualification" 
              value={providerData.qualification} 
              onChange={handleProviderChange} 
              required 
              placeholder="Your highest qualification" 
            />

            <Input 
              label="Specialization" 
              name="specialization" 
              value={providerData.specialization} 
              onChange={handleProviderChange} 
              required 
              placeholder="Your area of specialization" 
            />

            <Input 
              label="Availability" 
              name="availability" 
              value={providerData.availability} 
              onChange={handleProviderChange} 
              required 
              placeholder="Your working hours/days" 
            />

            <Input 
              label="Expected Salary" 
              name="expectedSalary" 
              type="number" 
              value={providerData.expectedSalary} 
              onChange={handleProviderChange} 
              required 
              placeholder="Expected monthly salary" 
            />
          </div>

          <DialogFooter>
            <Button onClick={handleProviderSubmit}>
              Submit Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6">
        <ServiceTable 
          data={services}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default Protected(AddServicePage, ["Service"]);
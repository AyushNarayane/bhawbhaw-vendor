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
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

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
    serviceName: "",
    serviceDetails: "",
    timeSlots: "",
    sessionCharges: "",
    sessionTiming: "",
    monthlyCharges: "",
    certification: null,
    image: null,
    teamMember: "",
    department: ""
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
    image: null // Add this field
  });
  const [providerImagePreview, setProviderImagePreview] = useState(null);
  const [providerStatus, setProviderStatus] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

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

  const fetchTeamMembers = async () => {
    try {
      const teamsQuery = query(
        collection(db, "team-vendor"),
        where("vendorId", "==", currentUser.id)
      );

      const querySnapshot = await getDocs(teamsQuery);
      const teamMembers = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          role: data.role,
          // Add any other fields you need from the team-vendor document
        };
      });

      setTeamMembers(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchServices();
      fetchTeamMembers(); // Add this if not already present
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchProviderStatus = async () => {
      if (currentUser?.id) {
        try {
          const response = await fetch(`/api/serviceProvider/status?vendorId=${currentUser.id}`);
          if (response.ok) {
            const data = await response.json();
            setProviderStatus(data.status);
          }
        } catch (error) {
          console.error("Error fetching provider status:", error);
          setProviderStatus('Not Registered');
        }
      }
    };
    fetchProviderStatus();
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

  const handleCertificationChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setServiceData(prev => ({ ...prev, certification: file }));
    } else {
      toast.error("Please upload a PDF file");
    }
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

  // Add image upload handler for provider
  const handleProviderImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProviderData(prev => ({ ...prev, image: file }));
      setProviderImagePreview(URL.createObjectURL(file));
    }
  };

  // Modify handleProviderSubmit to include image upload
  const handleProviderSubmit = async () => {
    setIsProviderLoading(true);
    try {
      let imageUrl = null;
      
      // Upload image if exists
      if (providerData.image instanceof File) {
        const timestamp = Date.now();
        const imagePath = `serviceProviders/${currentUser.id}/${timestamp}_${providerData.image.name}`;
        const storageRef = ref(storage, imagePath);
        
        await uploadBytesResumable(storageRef, providerData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const response = await fetch('/api/serviceProvider/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...providerData,
          imageUrl, // Add the image URL
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
          image: null
        });
        setProviderImagePreview(null);
        setIsProviderDialogOpen(false);
      } else {
        toast.error("Failed to register service provider");
      }
    } catch (error) {
      console.error("Error registering provider:", error);
      toast.error("An error occurred");
    } finally {
      setIsProviderLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Service Name",
        accessorKey: "serviceName",
      },
      {
        header: "Department",
        accessorKey: "department",
        cell: ({ row }) => (
          <span className="inline-block bg-[#F3EAE7] text-[#85716B] px-2 py-1 rounded-full text-sm">
            {row.original.department}
          </span>
        )
      },
      {
        header: "Details",
        accessorKey: "serviceDetails",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate" title={row.original.serviceDetails}>
            {row.original.serviceDetails}
          </div>
        ),
      },
      {
        header: "Time Slots",
        accessorKey: "timeSlots",
      },
      {
        header: "Session Info",
        cell: ({ row }) => (
          <div className="space-y-1">
            <div>₹{row.original.sessionCharges} per session</div>
            <div className="text-sm text-gray-500">{row.original.sessionTiming} mins</div>
          </div>
        ),
      },
      {
        header: "Monthly Charges",
        accessorKey: "monthlyCharges",
        cell: ({ row }) => (
          <div>
            {row.original.monthlyCharges ? `₹${row.original.monthlyCharges}` : '-'}
          </div>
        ),
      },
      {
        header: "Team Member",
        accessorKey: "teamMember",
        cell: ({ row }) => {
          const member = teamMembers.find(m => m.id === row.original.teamMember);
          return member ? (
            <div className="space-y-1">
              <div>{member.name}</div>
              <div className="text-sm text-gray-500">{member.role}</div>
            </div>
          ) : '-';
        },
      },
      {
        header: "Image",
        cell: ({ row }) => (
          row.original.image && row.original.image[0] && (
            <img 
              src={row.original.image[0]} 
              alt="Service" 
              className="w-12 h-12 object-cover rounded-lg"
            />
          )
        ),
      },
    ],
    [teamMembers] // Add teamMembers as dependency since we're using it in the cell render
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold text-[#3f3f3f]">Services</h1>
          <span className="text-gray-400 text-2xl">•</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            providerStatus === 'verified' ? 'bg-green-100 text-green-800' :
            providerStatus === 'unverified' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {providerStatus === 'verified' ? 'Verified Provider' :
             providerStatus === 'unverified' ? 'Pending Verification' :
             'Not Registered'}
          </span>
        </div>
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
          {providerStatus !== 'verified' && (
            <Button
              variant="secondary"
              className="bg-[#85716B] text-white hover:bg-[#6b5a55]"
              onClick={() => setIsProviderDialogOpen(true)}
            >
              Register as Service Provider
            </Button>
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Service" : "Add New Service"}</DialogTitle>
            <DialogDescription>Enter service details and required documentation.</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Service Information</h3>
              
              <Input 
                label="Service Name" 
                name="serviceName" 
                value={serviceData.serviceName} 
                onChange={handleChange} 
                required 
                placeholder="Enter service name" 
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select
                  name="department"
                  value={serviceData.department}
                  onValueChange={(value) => 
                    setServiceData(prev => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-white border border-gray-200">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-white">
                    {[
                      "Pet Grooming Services",
                      "Pet Boarding and Daycare",
                      "Pet Training Services",
                      "Pet Walking and Exercise",
                      "Veterinary and Health Services",
                      "Pet Transportation Services",
                      "Pet Nutrition Services",
                      "Specialized Care",
                      "Pet Adoption and Rescue Services",
                      "Pet Photography and Art",
                      "Pet Accessories and Supplies",
                      "Other"
                    ].map((dept) => (
                      <SelectItem 
                        key={dept} 
                        value={dept}
                        className="hover:bg-gray-100"
                      >
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <textarea
                name="serviceDetails"
                value={serviceData.serviceDetails}
                onChange={handleChange}
                placeholder="Enter service details"
                className="w-full p-2 border rounded-md"
                rows={3}
              />

              <Input 
                label="Time Slots" 
                name="timeSlots" 
                value={serviceData.timeSlots} 
                onChange={handleChange} 
                required 
                placeholder="Available time slots" 
              />

              <Input 
                label="Per Session Charges (₹)" 
                name="sessionCharges" 
                type="number" 
                value={serviceData.sessionCharges} 
                onChange={handleChange} 
                required 
                placeholder="Enter charges per session" 
              />

              <Input 
                label="Session Timing (minutes)" 
                name="sessionTiming" 
                value={serviceData.sessionTiming} 
                onChange={handleChange} 
                required 
                placeholder="Session Timing: (e.g., 45 minutes)" 
              />

              <Input 
                label="Monthly Charges (₹)" 
                name="monthlyCharges" 
                type="number" 
                value={serviceData.monthlyCharges} 
                onChange={handleChange} 
                placeholder="Optional: Enter monthly charges" 
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Team Member</label>
                <Select
                  name="teamMember"
                  value={serviceData.teamMember}
                  onValueChange={(value) => 
                    setServiceData(prev => ({ ...prev, teamMember: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-white border border-gray-200">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {teamMembers.map((member) => (
                      <SelectItem 
                        key={member.id} 
                        value={member.id}
                        className="capitalize hover:bg-gray-100"
                      >
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                    {teamMembers.length === 0 && (
                      <SelectItem value="none" disabled className="text-gray-400">
                        No team members available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {teamMembers.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Add team members in the Team Management section first
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Documentation & Media</h3>
              
              <div className="border-2 border-dashed p-4 rounded-lg">
                <label className="block mb-2">Certification (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleCertificationChange} 
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Optional: Upload certification document</p>
              </div>

              <div className="border-2 border-dashed p-4 rounded-lg">
                <label className="block mb-2">Service Photo</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  required={!isEditMode}
                  className="w-full"
                />
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="mt-2 max-h-40 object-contain" 
                  />
                )}
              </div>
            </div>
          </div>

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
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Service Provider Registration</DialogTitle>
            <DialogDescription>Enter your details to register as a service provider.</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Form Fields */}
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

            {/* Right Column - Image Upload */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {providerImagePreview ? (
                  <div className="relative">
                    <Image
                      src={providerImagePreview}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="max-h-[200px] mx-auto rounded-lg object-contain"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProviderData(prev => ({ ...prev, image: null }));
                        setProviderImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size <= 10 * 1024 * 1024) {
                          handleProviderImageChange(e);
                        } else {
                          toast.error("File size must be less than 10MB");
                        }
                      }}
                      className="hidden"
                      id="provider-image-upload"
                    />
                    <label
                      htmlFor="provider-image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <div className="p-2 rounded-full bg-gray-100">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">Upload your photo</span>
                      <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={handleProviderSubmit} 
              disabled={!providerData.image || isProviderLoading}
              className="relative"
            >
              {isProviderLoading ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
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
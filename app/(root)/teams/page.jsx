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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/users/uiTwo/table";
import { useAuth } from "@/hooks/auth-context";
import toast from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import Protected from "@/components/Protected/Protected";
import Image from "next/image";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from "@/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TeamTable = ({ data, columns, onEdit, onDelete }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end space-x-2">
        <div className="relative w-[300px]">
          <Input
            type="search"
            placeholder="Search by name..."
            className="pl-10 pr-4 py-2 border rounded-lg bg-[#F3EAE7] text-[#85716B] focus:outline-none focus:ring-2 focus:ring-[#B29581]"
            value={table.getColumn('name')?.getFilterValue() ?? ''}
            onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#85716B]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter(column => column.getCanHide()).map(column => (
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

      {/* Table Component */}
      <div className="bg-[#F3EAE7] rounded-lg shadow-md">
        <Table className="border-none">
          {/* ... existing table structure ... */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 font-semibold">
                    {header.isPlaceholder ? null : 
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
                <TableHead className="py-3 font-semibold">Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`border-b transition-colors hover:bg-muted/50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F3EAE7]'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell className="p-2">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        className="hover:bg-muted/50"
                        onClick={() => onEdit(row.original)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="hover:bg-muted/50 hover:text-red-600"
                        onClick={() => onDelete(row.original.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No team members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
};

const TeamsPage = () => {
  const { currentUser } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    departments: [],
    joiningDate: "",
    image: null
  });

  const fetchTeamMembers = async () => {
    try {
      console.log("Fetching team members for vendor:", currentUser.id); // Debug log
      
      const teamsQuery = query(
        collection(db, "team-vendor"),
        where("vendorId", "==", currentUser.id)
      );
      
      const querySnapshot = await getDocs(teamsQuery);
      const members = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Team member data:", data); // Debug log
        
        members.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null
        });
      });
      
      console.log("Processed team members:", members); // Debug log
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchTeamMembers();
    }
  }, [currentUser]);

  const handleUpload = async (vendorId, memberId) => {
    if (!memberData.image) return null;

    try {
      const storageRef = ref(storage, `teamMembers/VID${vendorId}/${memberId}/${memberData.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, memberData.image);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Error during upload: ", error);
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
    if (!memberData.name || !memberData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      
      // Handle image upload first if there is an image
      if (memberData.image instanceof File) {
        const timestamp = Date.now();
        const imagePath = `teamMembers/${currentUser.id}/${timestamp}_${memberData.image.name}`;
        const storageRef = ref(storage, imagePath);
        
        try {
          await uploadBytesResumable(storageRef, memberData.image);
          imageUrl = await getDownloadURL(storageRef);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image");
          setLoading(false);
          return;
        }
      }

      // Prepare the data object, excluding the File object
      const teamMemberData = {
        name: memberData.name,
        email: memberData.email,
        phoneNumber: memberData.phoneNumber,
        departments: memberData.departments,
        joiningDate: memberData.joiningDate,
        status: "verified", // Automatically set as verified
        imageUrl: imageUrl || memberData.imageUrl,
        vendorId: currentUser.id,
        vendorName: currentUser?.personalDetails?.name || '',
        vendorEmail: currentUser?.personalDetails?.email || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (isEditMode) {
        // Update existing member
        const memberRef = doc(db, "team-vendor", editingMemberId);
        await updateDoc(memberRef, {
          ...teamMemberData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new member
        await addDoc(collection(db, "team-vendor"), teamMemberData);
      }

      toast.success(isEditMode ? "Member updated successfully!" : "Member added successfully!");
      setIsDialogOpen(false);
      fetchTeamMembers();
      resetForm();
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error(error.message || "Failed to save team member");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMemberData({
      name: "",
      email: "",
      phoneNumber: "",
      departments: [],
      joiningDate: "",
      image: null
    });
    setIsEditMode(false);
    setEditingMemberId(null);
  };

  const handleDelete = async (memberId) => {
    try {
      await deleteDoc(doc(db, "team-vendor", memberId)); // Fix collection name
      toast.success("Team member deleted successfully!");
      fetchTeamMembers();
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("An error occurred while deleting");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Departments",
        accessorKey: "departments",
        cell: ({ row }) => {
          const departments = row.original.departments || [];
          return (
            <div className="space-y-1">
              {departments.map((dept, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-[#F3EAE7] text-[#85716B] text-xs px-2 py-1 rounded-full mr-1 mb-1"
                >
                  {dept}
                </span>
              ))}
            </div>
          );
        }
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Joining Date",
        accessorKey: "joiningDate",
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#3f3f3f]">Team Members</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#85716B] text-white hover:bg-[#6b5a55]"
        >
          Add New Member
        </Button>
      </div>

   { /* Add/Edit Member Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Member" : "Add New Member"}</DialogTitle>
            <DialogDescription className="text-red-600 font-medium">
              Team Members should be verified by the Owner of the Account. BhawBhaw will take action against the Account Owner on any inappropriate actions.
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={memberData.name}
              onChange={(e) => setMemberData({...memberData, name: e.target.value})}
            />
           
            <div className="space-y-2">
              <label className="text-sm font-medium">Departments</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {memberData.departments.length > 0 
                      ? `${memberData.departments.length} department(s) selected`
                      : "Select departments"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto bg-white p-2">
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
                    <DropdownMenuCheckboxItem
                      key={dept}
                      checked={memberData.departments.includes(dept)}
                      onCheckedChange={(checked) => {
                        setMemberData(prev => ({
                          ...prev,
                          departments: checked 
                            ? [...prev.departments, dept]
                            : prev.departments.filter(d => d !== dept)
                        }));
                      }}
                      className="hover:bg-gray-100"
                    >
                      {dept}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Input
              placeholder="Email"
              type="email"
              value={memberData.email}
              onChange={(e) => setMemberData({...memberData, email: e.target.value})}
            />
            <Input
              placeholder="Phone Number"
              value={memberData.phoneNumber}
              onChange={(e) => setMemberData({...memberData, phoneNumber: e.target.value})}
            />
            <Input
              type="date"
              value={memberData.joiningDate}
              onChange={(e) => setMemberData({...memberData, joiningDate: e.target.value})}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setMemberData({...memberData, image: e.target.files[0]})}
            />
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Team Members Table */}
      <TeamTable
        data={teamMembers}
        columns={columns}
        onEdit={(member) => {
          setMemberData(member);
          setEditingMemberId(member.id);
          setIsEditMode(true);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Add Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(editingMemberId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Protected(TeamsPage, ["Service"]);

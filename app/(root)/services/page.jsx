"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/users/uiTwo/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/users/uiTwo/table";
import { useAuth } from "@/hooks/auth-context";
import toast from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import Protected from "@/components/Protected/Protected";

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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // New state for delete confirmation modal
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [deletingServiceId, setDeletingServiceId] = useState(null); // New state for storing service ID to delete
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleDeleteConfirm = (serviceID) => {
    setDeletingServiceId(serviceID);
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

  return (
    <div className="p-6">
      <Button
        variant="primary"
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

      {/* Delete Confirmation Dialog */}
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

      {/* Services Table */}
      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price Per Hour</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.serviceName}</TableCell>
                <TableCell>{service.title}</TableCell>
                <TableCell>{service.pricePerHour}</TableCell>
                <TableCell>{service.phoneNumber}</TableCell>
                <TableCell>{service.address}</TableCell>
                <TableCell>
                  {service.image && service.image[0] && (
                    <img src={service.image[0]} alt="Service" width="50" height="50" />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="secondary" onClick={() => handleEdit(service)}>Edit</Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteConfirm(service.id)}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Protected(AddServicePage, ["Service"]);

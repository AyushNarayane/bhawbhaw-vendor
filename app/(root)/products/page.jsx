"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/users/uiTwo/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/users/uiTwo/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";
import { useAuth } from "@/hooks/auth-context";
import { useModel } from "@/hooks/model-context";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation"; // Add this import
import Image from "next/image"; // Add this import

const ProductTable = ({ data, columns, onEdit }) => {
  const [search, setSearch] = useState("title");
  const searchTitles = ["title", "category", "subCategory", "sellingPrice", "maxRetailPrice"];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Image
            src="/empty-products.svg"
            alt="No products"
            width={300}
            height={300}
            priority
          />
          <p className="mt-4 text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400">Add some products to see them here</p>
        </div>
      ) : (
        <>
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
              <SelectTrigger className="bg-white border focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none w-1/4">
                <SelectValue placeholder="Select a search type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {searchTitles.map((mt) => (
                  <SelectItem key={mt} value={mt} className="capitalize hover:bg-gray-100">
                    {mt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto bg-white">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize hover:bg-gray-100"
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

          <div className="rounded-lg shadow-md">
            <Table className="border-none">
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
                          <Button
                            onClick={() => onEdit(row.original)}
                            className="bg-[#B29581] hover:bg-[#a0846f] text-white"
                          >
                            Edit
                          </Button>
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
                      No products found.
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
        </>
      )}
    </div>
  );
};

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("bulk");
  const [activeSection, setActiveSection] = useState("My Products"); // Changed default
  const [showProducts, setShowProducts] = useState("My Products"); // Changed default
  const [productStatus, setProductStatus] = useState("approved");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [maxRetailPrice, setMaxRetailPrice] = useState("");
  const [description, setDescription] = useState("");
  const [minOrderQty, setMinOrderQty] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [dispatchDays, setDispatchDays] = useState("");
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");
  const [warranty, setWarranty] = useState("");
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const { currentUser } = useAuth();
  const { isOpen, currentModel, setClose, setOpen, data, setData } = useModel();

  const userId = currentUser?.id;
  const router = useRouter(); // Add this line

  const Categories = [
    "Dog Food",
    "Cat Food",
    "Bird Food",
    "Small Animal Food",
    "Fish Food",
    "Pet Supplies",
    "Grooming Supplies",
    "Health and Wellness",
    "Training Supplies",
  ];

  const subCategories = [
    "Dry Dog Food",
    "Wet Dog Food",
    "Dog Treats",
    "Cat Food",
    "Dry Cat Food",
    "Wet Cat Food",
    "Cat Treats",
    "Seed Mixes",
    "Pellets (Bird)",
    "Rabbit Food",
    "Guinea Pig Food",
    "Hamster Food",
    "Flakes (Fish)",
    "Pellets (Fish)",
    "Freeze-Dried Food",
    "Bowls and Feeders",
    "Leashes and Collars",
    "Beds and Crates",
    "Toys",
    "Brushes",
    "Shampoos",
    "Nail Clippers",
    "Vitamins",
    "Dental Care",
    "Flea and Tick Prevention",
    "Training Pads",
    "Clickers",
    "Behavior Aids",
    "Organic Pet Food",
    "Grain-Free Options",
    "Diet-Specific Food",
    "Portable Water Bottles",
    "Pet Bowls (Slow Feeders, Elevated)",
    "Pet Carriers",
  ];
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages(files);
    } else {
      console.error("No files selected");
    }
  };
  

  const handleUpload = async (sellerId, productId) => {
    try {
      setLoading(true)
      let DocumentLinks = [];
      if (images.length > 0) {
        const filesArray = Array.from(images);
        
        await Promise.all(
          filesArray.map((image, i) => {
            const storageRef = ref(
              storage,
              `productImages/${sellerId}/${productId}/${image.name}_${i}`
            );
            return new Promise((resolve, reject) => {
              const uploadTask = uploadBytesResumable(storageRef, image);
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                  console.error("Error during upload: ", error.message);
                  reject(error);
                },
                async () => {
                  // Get the download URL after the upload is complete
                  const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  DocumentLinks.push(downloadUrl);
                  console.log(`File available at: ${downloadUrl}`);
                  resolve(downloadUrl);
                }
              );
            });
          })
        );
  
        console.log("Uploaded document links: ", DocumentLinks);
      } else {
        console.warn("No images selected for upload");
      }
  
      return DocumentLinks;
    } catch (error) {
      console.error("Error in uploading images: ", error);
    } finally {
      setLoading(false)
    }
  };

  const handleSubmit = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const productId = `PID${timestamp}`;

    if (!title ||
      !category ||
      !subCategory ||
      !maxRetailPrice ||
      !description ||
      !minOrderQty ||
      !sellingPrice ||
      !dispatchDays ||
      !size ||
      !material
    ) {
      toast.error("Missing details!")
      return ;
    }

    if(images.length < 1){
      toast.error("Image is missing!")
      return
    }
  
    const imagesURL = await handleUpload(userId, productId);
  
    if (!imagesURL || imagesURL.length === 0) {
      console.error("Image upload failed");
      return;
    }
  
    const productData = {
      title,
      category,
      subCategory,
      maxRetailPrice,
      description,
      minOrderQty,
      sellingPrice,
      dispatchDays,
      size,
      material,
      warranty,
      images: imagesURL,
      productId,
      vendorId: userId,
    };
  
    try {
      const response = await fetch('/api/addProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
  
      const result = await response.json();
      if (response.ok) {
        setModalOpen(false);
        console.log(result.message);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const fetchProducts = async () => {
    if (userId) {
      console.log(userId)
      try {
        const response = await fetch(`/api/getProductsByVendorId?vendorId=${userId}`);
        const result = await response.json();
        if (response.ok) {
          const fetchedProducts = result.products;
          const filteredProducts = fetchedProducts.filter(
            (product) => product.status === productStatus
          );

          setProducts(fetchedProducts);
          setFilteredProducts(filteredProducts);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [showProducts, userId]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.status === productStatus
    );
    setFilteredProducts(filtered);
  }, [productStatus, products]);

  

const handleEdit = (product) => {
  console.log(product)
  setSelectedProduct(product);
  setModalOpen(true);
};


const handleUpdate = async () => {
  if (selectedProduct) {
    try {
      if (!title ||
        !category ||
        !subCategory ||
        !maxRetailPrice ||
        !description ||
        !minOrderQty ||
        !sellingPrice ||
        !dispatchDays ||
        !size ||
        !material
      ) {
        toast.error("Missing details!")
        return ;
      }
      setLoading(true)
      const response = await fetch('/api/products/updateProduct', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.productId,
          data: selectedProduct,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setModalOpen(false);
        fetchProducts();
        console.log(result.message);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false)
    }
  }
};


useEffect(() => {
  if (selectedProduct) {
    setTitle(selectedProduct.title || "");
    setCategory(selectedProduct.category || "");
    setSubCategory(selectedProduct.subCategory || "");
    setMaxRetailPrice(selectedProduct.maxRetailPrice || "");
    setMinOrderQty(selectedProduct.minOrderQty || "");
    setSellingPrice(selectedProduct.sellingPrice || "");
    setDescription(selectedProduct.description || "");
    setMaterial(selectedProduct.material || "");
    setSize(selectedProduct.size || "");
    setDispatchDays(selectedProduct.dispatchDays || "");
    setWarranty(selectedProduct.warranty || "");
    setImagePreviews(selectedProduct.images || []);
    setImages(selectedProduct.images || []);
    console.log(selectedProduct.images)
  }else {
    setTitle("");
    setCategory("");
    setSubCategory("");
    setMaxRetailPrice("");
    setMinOrderQty("");
    setSellingPrice("");
    setDescription("");
    setMaterial("");
    setSize("");
    setDispatchDays("");
    setWarranty("");
    setImagePreviews([]);
    setImages([]);
  }
}, [selectedProduct]);

const handleDownload = () => {
  const fileUrl =
    "https://docs.google.com/spreadsheets/d/1apsXcvFKR8sNfGAVZOfXKOTyLLaGRErU9f70p00CJh0/edit?usp=sharing&ouid=103883976639323731670&rtpof=true&sd=true";
  window.open(fileUrl, "_blank");
};

const handleFileUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const binaryStr = e.target?.result;
    if (typeof binaryStr !== "string") return;

    const workbook = XLSX.read(binaryStr, { type: "binary" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet);

    const camelCaseData = sheetData.map((row) => {
      const camelCaseRow = {};
      Object.keys(row).forEach((key) => {
        const camelCaseKey = key
          .replace(/[^a-zA-Z]/g, "")
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          });

        if (camelCaseKey === "targetedGender") {
          camelCaseRow[camelCaseKey] = [row[key]];
        } else {
          camelCaseRow[camelCaseKey] = row[key];
        }
      });

      return camelCaseRow;
    });

    const requiredFields = [
      "grossWeightIngm",
      "gstPercentage",
      "reportNumber",
      "finalPrice",
      "title",
      "size",
      "numberofDiamonds",
      "grossWeightIngm",
      "netWeightIngm",
      "metal",
      "makingCharges",
      "gstCharges",
      "goldPurity",
      "goldPricePergm",
      "targetedGender",
      "daysofDispatch",
      "diamondWeightInCarat",
      "diamondPricePerCarat",
      "diamondColor",
      "description",
      "category",
    ];
    const isValid = camelCaseData.every((row) =>
      requiredFields.every(
        (field) =>
          row[field] !== undefined && row[field] !== null && row[field] !== ""
      )
    );

    if (!isValid) {
      toast.error("Error: Some required fields are missing.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setData(camelCaseData);
    console.log(camelCaseData);
    setOpen("bulkUploadForm");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  reader.readAsBinaryString(file);
};

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title", 
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/products/${row.original.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}/${row.original.productId}`)}
            className="text-blue-600 hover:text-blue-800 hover:underline text-left"
          >
            {row.original.title}
          </button>
        ),
      },
      {
        header: "Category",
        accessorKey: "category",
      },
      {
        header: "Subcategory",
        accessorKey: "subCategory",
      },
      {
        header: "SP",
        accessorKey: "sellingPrice",
      },
      {
        header: "MRP",
        accessorKey: "maxRetailPrice",
      }
    ],
    [router]
  );

  return (
    <div className="sm:px-6 py-6 px-2">
      {/* Page Title */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-[#3f3f3f]">Products</h1>
        <div className="flex items-center gap-4">
          <Button
            className="px-4 py-2 bg-[#695d56] text-white hover:bg-[#574941]"
            onClick={() => {
              setShowProducts("Add Product");
              setActiveSection("Add Product");
              setModalOpen(true);
            }}
          >
            Add Product
          </Button>
          <div className="flex space-x-2 items-center">
            <Input 
              type="text" 
              placeholder="Search" 
              className="w-64 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="px-3 py-2" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582a9.977 9.977 0 00-2.614 6.319A10.014 10.014 0 1012 2.05V7h4"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Rest of the component */}
      {showProducts === "My Products" ? (
        <>
          <div className="flex space-x-4 mb-6">
            <Button
              className={`px-4 py-2 ${
                productStatus === "approved" 
                ? "bg-[#B29581] text-white hover:bg-[#a0846f]" 
                : "text-[#B29581] hover:bg-[#F3EAE7]"
              }`}
              onClick={() => setProductStatus("approved")}
            >
              Approved
            </Button>
            <Button
              className={`px-4 py-2 ${
                productStatus === "disabled" 
                ? "bg-[#B29581] text-white hover:bg-[#a0846f]" 
                : "text-[#B29581] hover:bg-[#F3EAE7]"
              }`}
              onClick={() => setProductStatus("disabled")}
            >
              Disabled
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg">            <ProductTable 
              data={filteredProducts}
              columns={columns}
              onEdit={handleEdit}
            />
          </div>
        </>
      ) : (
        <>
          <div className="bg-white pt-6 rounded-2xl shadow-md max-w-[30rem] mx-auto border-t border-slate-50">
            <div className="flex mx-auto justify-center border border-[#F3EAE7] max-w-[12rem] space-x-4 bg-[#faf6f4] p-1 rounded-full mb-6">
              <button
                className={`px-4 w-20 py-2 rounded-full text-sm font-semibold ${
                  activeTab === "bulk"
                    ? "bg-[#3C2218] text-white"
                    : "text-[#3C2218]"
                }`}
                onClick={() => setActiveTab("bulk")}
              >
                Bulk
              </button>
              <button
                className={`px-4 w-20 py-2 rounded-full text-sm font-semibold ${
                  activeTab === "single"
                    ? "bg-[#3C2218] text-white"
                    : "text-[#3C2218]"
                }`}
                onClick={() => setActiveTab("single")}
              >
                Single
              </button>
            </div>

            {activeTab === "bulk" && (
              <div className="bg-[#f2e9e6] p-12 rounded-b-lg ">
                <div className="border-dashed border-2 border-[#d8c4b3] flex flex-col items-center p-10 rounded-2xl">
                  <h2 className="text-xl font-semibold text-[#695d56] mb-4">
                    Bulk Product Upload
                  </h2>
                  <p className="text-[#a19794] mb-6 text-md text-center">
                    You can upload the products in bulk through an excel sheet
                    or create a single product.
                  </p>
                  <div className="flex flex-col items-center">
                  <input
                      ref={fileInputRef}
                      id="fileInput"
                      type="file"
                      accept=".xlsx, .xls"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                    <Button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                      className="bg-[#695d56] text-white mb-4">
                      Upload File
                    </Button>
                    <Button onClick={handleDownload} className="text-[#695d56] underline shadow-none">
                      Download Sample File
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "single" && (
              <div className="bg-[#f2e9e6] p-12 rounded-lg">
                <div className="border-dashed border-2 border-[#d8c4b3] flex flex-col items-center p-10 rounded-2xl">
                  <h2 className="text-xl font-semibold text-[#695d56] mb-4">
                    Single Product Upload
                  </h2>
                  <p className="text-[#a19794] mb-6 text-md text-center">
                    Fill up the form to create single product.
                  </p>
                  <div
                    className="flex flex-col items-center"
                    onClick={() => setModalOpen(true)}
                  >
                    <Button className="bg-[#695d56] text-white mb-4" 
                    // onClick={() => setOpen("singleUploadForm")}
                    >
                      Add Product Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </>
      )}
      {modalOpen && (
      <Dialog open={modalOpen} onOpenChange={() => setModalOpen(false)}>
        <DialogContent className="max-w-[70rem] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#4D413E] font-bold">
              Upload Product
            </DialogTitle>
          </DialogHeader>
        <div className="relative grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className="bg-[#F3EAE7] rounded-full w-full p-2 "
            />
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="category">
              Category
            </label>
            <Select
              value={category}
              onValueChange={(e) => setCategory(e)}
              className="max-h-10 "
            >
              <SelectTrigger className="rounded-full w-full p-2 bg-[#F3EAE7]">
                <SelectValue placeholder="Select category"/>
              </SelectTrigger>
              <SelectContent side="bottom" className="bg-white">
                <SelectGroup className="bg-white max-h-24 ">
                    {Categories.map((category, i) => (
                      <SelectItem key={i} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="category">
              Sub Category
            </label>
            <Select
              value={subCategory}
              onValueChange={(e) => setSubCategory(e)}
              className="max-h-10 "
            >
              <SelectTrigger className="rounded-full w-full p-2 bg-[#F3EAE7]">
                <SelectValue placeholder="Select subCategory"/>
              </SelectTrigger>
              <SelectContent side="bottom" className="bg-white">
                <SelectGroup className="bg-white max-h-24 ">
                    {subCategories.map((category, i) => (
                      <SelectItem key={i} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="maxRetailPrice">
              Maximum Retail Price
            </label>
            <input
              id="maxRetailPrice"
              type="text"
              value={maxRetailPrice}
              onChange={(e) => setMaxRetailPrice(e.target.value)}
              placeholder="Enter Maximum Retail Price"
              className="bg-[#F3EAE7] rounded-full w-full p-2 "
            />
          </div>


          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="minOrderQty">
              Minimum Order Quantity
            </label>
            <input
              id="minOrderQty"
              type="text"
              value={minOrderQty}
              onChange={(e) => setMinOrderQty(e.target.value)}
              placeholder="Enter Minimum Order Quantity"
              className="bg-[#F3EAE7] rounded-full w-full p-2 "
            />
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="sellingPrice">
              Selling Price
            </label>
            <input
              id="sellingPrice"
              type="text"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="Enter Selling Price"
              className="bg-[#F3EAE7] rounded-full w-full p-2 "
            />
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="description">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              className="bg-[#F3EAE7] rounded-full w-full p-2 "
            />
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="material">
              Material
            </label>
            <input
              id="material"
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Enter Material"
              className="bg-[#F3EAE7] rounded-full w-full p-2 "
            />
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="size">
              Size
            </label>
            <input
              id="size"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Enter Size"
              className="bg-[#F3EAE7] rounded-full w-full p-2 "
            />
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="dispatchDays">
              Days of Dispatch
            </label>
            <input
              id="dispatchDays"
              type="text"
              value={dispatchDays}
              onChange={(e) => setDispatchDays(e.target.value)}
              placeholder="Enter Days of Dispatch"
              className="bg-[#F3EAE7] rounded-full w-full p-2 "
            />
          </div>

          <div>
            <label className="text-sm text-[#C5A88F]" htmlFor="warranty">
              Warranty (optional)
            </label>
            <input
              id="warranty"
              type="text"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder="Enter Warranty if any"
              className="bg-[#F3EAE7] rounded-full w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-[#C5A88F]">
              Upload Images (Max. 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mt-1 bg-[#F3EAE7] rounded-full w-full py-[6px] px-3"
            />

            {imagePreviews.length > 0 && (
              <div
                style={{ margin: '0 2rem' }}
                className="absolute left-14 flex justify-center items-center w-[4rem] h-28 pb-1"
              >
                <Carousel>
                  <CarouselContent className="w-40 object-cover ">
                    {imagePreviews.map((file, i) => (
                      <CarouselItem key={i} className="flex items-center ">
                        <img className="max-h-20 mx-auto" alt="image preview" src={file} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious type="button" className="bg-yellow-300 z-30 " />
                  <CarouselNext type="button" className="bg-yellow-300 z-30" />
                </Carousel>
              </div>
            )}

          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <button
            onClick={() => {setModalOpen(false)
              setSelectedProduct(null)
            }}
            className="bg-red-500 text-white rounded-lg px-4 py-2"
          >
            Cancel
          </button>
          {selectedProduct ? (
             <>
             {
               loading ? (
                 <div className="items-center justify-center flex w-20 bg-baw-baw-g3 rounded-lg z-10">
                   <ClipLoader
                     color={"#fff"}
                     loading={loading}
                     size={20}
                     aria-label="Loading Spinner"
                     data-testid="loader"
                   />
                 </div>
               ) : (
                <button
                  onClick={handleUpdate}
                  className="bg-baw-baw-g3 text-white rounded-lg px-4 py-2"
                >
                  Update
                </button>
               )
             }
           </>
            ) :(
            <>
              {
                loading ? (
                  <div className="items-center justify-center flex w-20 bg-baw-baw-g3 rounded-lg z-10">
                    <ClipLoader
                      color={"#fff"}
                      loading={loading}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-baw-baw-g3 text-white rounded-lg px-4 py-2"
                  >
                    Upload
                  </button>
                )
              }
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

    )}
    </div>
  );
};

export default ProductPage;

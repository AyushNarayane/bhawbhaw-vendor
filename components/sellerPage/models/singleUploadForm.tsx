rnfe


// "use client";

// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { storage } from "@/firebase";
// import { useAuth } from "@/hooks/auth-context";
// import { useModel } from "@/hooks/model-context";
// import { addProductToFireStore } from "@/lib/firebaseFunc";
// import { cn } from "@/lib/utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { Bot, Loader2, ShieldAlert, ShieldQuestion } from "lucide-react";
// import { ChangeEvent, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { z } from "zod";
// import {
//   Categories,
//   gender,
//   gold_purity,
//   gstPercentageOptions,
//   metal_options,
//   size,
// } from "../types/types";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { Separator } from "@/components/ui/separator";

// const formSchema = z.object({
//   reportNo: z.string().min(16, { message: "Enter a valid report no" }),
//   title: z.string().min(1, { message: "Title is required" }),
//   description: z.string(),
//   goldPurity: z.string(),
//   netWeight: z.string(),
//   grossWeight: z.string(),
//   noOfDiamonds: z.string(),
//   diamondColor: z.string(),
//   diamondWeight: z.string(),
//   goldPricePerGram: z.string(),
//   diamondPricePerGram: z.string(),
//   makingCharges: z.string(),
//   metalOption: z.string(),
//   gstPrice: z.string(),
//   dod: z.string(),
//   size: z.string(),
//   category: z.string(),
// });

// export const SingleUploadForm = () => {
//   const { currentUser } = useAuth();
//   const [isMounted, setIsMounted] = useState(false);
//   const { isOpen, currentModel, setClose, setOpen } = useModel();
//   const isModelOpen = isOpen && currentModel === "singleUploadForm";
//   const modelOpen = isOpen && currentModel === "singleUploadForm";

//   const [images, setImages] = useState<any>([]);
//   const [urls, setUrls] = useState<any>([]);
//   const [uuid, setUUID] = useState<string>("");
//   const [selectedFiles, setSelectedFiles] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [uploaded, setUploaded] = useState<boolean>(false);
//   // State to store file previews (URLs)
//   const [filePreviews, setFilePreviews] = useState<any>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
//   const [is_Open, setIsOpen] = useState(false);
//   const [productCustomId, setProductCustomId] = useState("");
//   const [documentLinksForFiserestore, setDocumentLinksForFiserestore] =
//     useState<any>([]);

//   const [makingCharges, setMakingCharges] = useState<number>(0);
//   const [diamondPricePerGram, setDiamondPricePerGram] = useState<number>(0);
//   const [diamondWeight, setDiamondWeight] = useState<number>(0);
//   const [goldPricePerGram, setGoldPricePerGram] = useState<number>(0);
//   const [netWeight, setNetWeight] = useState<number>(0);
//   const [grossWeight, setGrossWeight] = useState<number>(0);
//   const [gstPrice, setGstPrice] = useState<number>(0);
//   const [finalPrice, setFinalPrice] = useState<number>(0);
//   const [internationalPrice, setInternationalPrice] = useState<number>(0);
//   const [openDialogue, setOpenDialogue] = useState<boolean>(false);
//   const [finalGoldPrice, setFinalGoldPrice] = useState<number>(0);
//   const [finalDiamondPrice, setFinalDiamondPrice] = useState<number>(0);
//   const [gstPercentage, setGstPercentage] = useState<number>(0);

//   const internationalPercentageHike = 120;

//   useEffect(() => {
//     const cost =
//       makingCharges +
//       gstPrice +
//       goldPricePerGram * netWeight +
//       diamondPricePerGram * diamondWeight;

//     const FinalGoldCost = goldPricePerGram * netWeight;
//     const FinalDiamondPrice = diamondPricePerGram * diamondWeight;
//     if (gstPercentage != 0) {
//       const totalSum = FinalGoldCost + FinalDiamondPrice + makingCharges;
//       const FinalGstPrice = (totalSum * gstPercentage) / 100;

//       setGstPrice(Math.round(FinalGstPrice * 100) / 100);
//     }

//     setFinalGoldPrice(Math.round(FinalGoldCost * 100) / 100);

//     setFinalDiamondPrice(Math.round(FinalDiamondPrice * 100) / 100);

//     setFinalPrice(Math.round(cost * 100) / 100);
//   }, [
//     gstPercentage,
//     makingCharges,
//     diamondPricePerGram,
//     diamondWeight,
//     goldPricePerGram,
//     netWeight,
//     gstPrice,
//   ]);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const removeOption = (option: string) => {
//     setSelectedOptions(selectedOptions.filter((item) => item !== option));
//   };


//   const handleSelectOption = (option: string) => {
//     if (selectedOptions.includes(option)) {
//       setSelectedOptions(selectedOptions.filter((item) => item !== option));
//     } else {
//       setSelectedOptions([...selectedOptions, option]);
//     }
//   };

//   const handleConfirmSelection = () => {
//     setIsOpen(false);
//   };

//   const toggleDialog = () => {
//     setIsOpen(!is_Open);
//   };

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleImageSubmit = (e: ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     if (e.target.files) {
//       setImages(e.target.files);
//       const files = e.target.files;

//       setSelectedFiles(files);

//       // Clear previous previews
//       setFilePreviews([]);

//       // Create file previews using URLs
//       const previews: string[] = [];
//       //@ts-ignore
//       for (const file of files) {
//         const fileURL = URL.createObjectURL(file);
//         previews.push(fileURL);
//       }
//       setFilePreviews(previews);
//     }
//   };

//   const removeFile = (index: number) => {
//     if (images) {
//       // Convert FileList to an array to remove the file
//       const filesArray = Array.from(images);

//       // Remove the file from the files array
//       filesArray.splice(index, 1);

//       // Create a new FileList from the remaining files
//       const dataTransfer = new DataTransfer();
//       //@ts-ignore
//       filesArray.forEach((file) => dataTransfer.items.add(file));
//       const updatedFiles = dataTransfer.files;

//       // Update the selected files state
//       setImages(updatedFiles);

//       // Update file previews state by removing the file at the specified index
//       //@ts-ignore
//       const updatedPreviews = filePreviews.filter((_, idx) => idx !== index);
//       setFilePreviews(updatedPreviews);
//     }
//   };

//   const handleUpload = async (sellerId: string, productId: string) => {
//     try {
//       const time = productId;
//       //@ts-ignore
//       let DocumentLinks = [];
//       if (images.length > 0) {
//         const filesArray = Array.from(
//           { length: images.length },
//           (_, index) => images[index]
//         );

//         setProductCustomId(time);
//         //@ts-ignore
//         await Promise.all(
//           filesArray.map((image: any, i: number) => {
//             const storageRef = ref(
//               storage,
//               `productImages/${sellerId}/${time}/${image.name}_${i}`
//             );
//             const uploadTask = uploadBytesResumable(storageRef, image);
//             uploadTask.on(
//               "state_changed",
//               () => {
//                 const progress =
//                   (uploadTask.snapshot.bytesTransferred /
//                     uploadTask.snapshot.totalBytes) *
//                   100;
//                 console.log(`Upload is ${progress}% done`);
//               },
//               (error) => {
//                 console.log(error.message);
//               },
//               () => {
//                 setUploaded(true);

//                 console.log("Upload completed");
//               }
//             );
//             return uploadTask;
//           })
//         );

//         await Promise.all(
//           filesArray.map(async (file, i) => {
//             const storageRef = ref(
//               storage,
//               `productImages/${sellerId}/${time}/${file.name}_${i}`
//             ); // Specify the path where each file is stored
//             const downloadUrl = await getDownloadURL(storageRef);
//             DocumentLinks.push(downloadUrl);
//             return true;
//           })
//         );
//         console.log(
//           //@ts-ignore
//           DocumentLinks
//         );
//       }
//       //@ts-ignore
//       return DocumentLinks;
//     } catch (error) {
//       console.log("Error in creating products", error);
//     }
//   };

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       reportNo: "",
//       title: "",
//       description: "",
//       goldPurity: "",
//       netWeight: "",
//       grossWeight: "",
//       noOfDiamonds: "",
//       diamondColor: "white",
//       diamondWeight: "",
//       goldPricePerGram: "",
//       diamondPricePerGram: "",
//       makingCharges: "",
//       metalOption: "",
//       gstPrice: "",
//       dod: "",
//       size: "",
//       category: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   if (!isMounted) {
//     return null;
//   }
//   //@ts-ignore
//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       setLoading(true);
//       const productId = `PID${Date.now()}`;
//       const imagesURL = await handleUpload(currentUser.id, productId);

//       const finalProductDetails = {
//         ...values,
//         finalPrice,
//         gstPercentage,
//         makingCharges,
//         diamondPricePerGram,
//         diamondWeight,
//         goldPricePerGram,
//         grossWeight,
//         netWeight,
//         gstPrice,
//         images: imagesURL,
//         productId: productId,
//         gender: selectedOptions,
//         vendorUId: currentUser.vendorUId,
//         vendorId: currentUser.id,
//       };

//       await addProductToFireStore(
//         //@ts-ignore
//         finalProductDetails
//       );
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//       setMakingCharges(0),
//         setGstPercentage(0),
//         setDiamondPricePerGram(0),
//         setDiamondWeight(0),
//         setGoldPricePerGram(0),
//         setNetWeight(0),
//         setGstPrice(0),
//         setFinalPrice(0),
//         setInternationalPrice(0);
//       setImages([]);
//       setFilePreviews([]);
//       setSelectedOptions([]);
//       form.reset();
//       setClose();
//       toast.success("Product added");
//     }
//   };

//   // const handleSubmit = async () => {
//   //   const timestamp = Math.floor(Date.now()/1000)
//   //   const productId = `PID${timestamp}`

//   //   const imagesURL = await handleUpload(userId, productId);

//   //   if (!imagesURL || imagesURL.length === 0) {
//   //     console.error("Image upload failed");
//   //     return;
//   //   }

//   //   const productData = {
//   //     title,
//   //     category,
//   //     subCategory,
//   //     maxRetailPrice,
//   //     description,
//   //     minOrderQty,
//   //     sellingPrice,
//   //     dispatchDays,
//   //     size,
//   //     material,
//   //     warranty,
//   //     images: imagesURL,
//   //     productId,
//   //     vendorId: userId
//   //   };

//   //   console.log(productData)

//   //   const success = await addProductToFireStore(productData);
//   //   if (success) {
//   //     setModalOpen(false);
//   //   } else {
//   //     // console.log(error)
//   //   }
//   // };

//   return (
//     <div className="">
//     <Dialog open={isModelOpen} onOpenChange={setClose}>
//         <DialogContent className="max-w-[70rem] p-6 bg-white rounded-lg shadow-lg">
//           <DialogHeader>
//             <DialogTitle className="text-3xl text-[#4D413E] font-bold">
//               Upload Product
//             </DialogTitle>
//           </DialogHeader>
//         {/* <div className="grid grid-cols-3 gap-4 mt-4">
//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="title">
//               Title
//             </label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter Title"
//               className="bg-[#F3EAE7] rounded-full w-full p-2 "
//             />
//           </div>

//           <FormField
//                         control={form.control}
//                         name="title"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 relative">
//                               Title{" "}
//                               <p className="absolute -top-1 text-red-300 -right-2">
//                                 *
//                               </p>
//                             </FormLabel>
//                             <FormControl>
//                               <Input
//                                 disabled={isLoading}
//                                 className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
//                                 placeholder="Enter product title"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       /> */}

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="category">
//               Category
//             </label>
//             <Select
//               value={category}
//               onValueChange={(e) => setCategory(e)}
//               className="max-h-10 "
//             >
//               <SelectTrigger className="rounded-full w-full p-2 bg-[#F3EAE7]">
//                 <SelectValue placeholder="Select category"/>
//               </SelectTrigger>
//               <SelectContent side="bottom" className="bg-white">
//                 <SelectGroup className="bg-white max-h-24 ">
//                     {Categories.map((category, i) => (
//                       <SelectItem key={i} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="category">
//               Sub Category
//             </label>
//             <Select
//               value={subCategory}
//               onValueChange={(e) => setSubCategory(e)}
//               className="max-h-10 "
//             >
//               <SelectTrigger className="rounded-full w-full p-2 bg-[#F3EAE7]">
//                 <SelectValue placeholder="Select subCategory"/>
//               </SelectTrigger>
//               <SelectContent side="bottom" className="bg-white">
//                 <SelectGroup className="bg-white max-h-24 ">
//                     {subCategories.map((category, i) => (
//                       <SelectItem key={i} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="maxRetailPrice">
//               Maximum Retail Price
//             </label>
//             <input
//               id="maxRetailPrice"
//               type="text"
//               value={maxRetailPrice}
//               onChange={(e) => setMaxRetailPrice(e.target.value)}
//               placeholder="Enter Maximum Retail Price"
//               className="bg-[#F3EAE7] rounded-full w-full p-2 "
//             />
//           </div>


//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="minOrderQty">
//               Minimum Order Quantity
//             </label>
//             <input
//               id="minOrderQty"
//               type="text"
//               value={minOrderQty}
//               onChange={(e) => setMinOrderQty(e.target.value)}
//               placeholder="Enter Minimum Order Quantity"
//               className="bg-[#F3EAE7] rounded-full w-full p-2 "
//             />
//           </div>

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="sellingPrice">
//               Selling Price
//             </label>
//             <input
//               id="sellingPrice"
//               type="text"
//               value={sellingPrice}
//               onChange={(e) => setSellingPrice(e.target.value)}
//               placeholder="Enter Selling Price"
//               className="bg-[#F3EAE7] rounded-full w-full p-2 "
//             />
//           </div>

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="description">
//               Description
//             </label>
//             <input
//               id="description"
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter Description"
//               className="bg-[#F3EAE7] rounded-full w-full p-2 "
//             />
//           </div>

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="material">
//               Material
//             </label>
//             <input
//               id="material"
//               type="text"
//               value={material}
//               onChange={(e) => setMaterial(e.target.value)}
//               placeholder="Enter Material"
//               className="bg-[#F3EAE7] rounded-full w-full p-2 "
//             />
//           </div>

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="size">
//               Size
//             </label>
//             <input
//               id="size"
//               type="text"
//               value={size}
//               onChange={(e) => setSize(e.target.value)}
//               placeholder="Enter Size"
//               className="bg-[#F3EAE7] rounded-full w-full p-2 "
//             />
//           </div>

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="dispatchDays">
//               Days of Dispatch
//             </label>
//             <input
//               id="dispatchDays"
//               type="text"
//               value={dispatchDays}
//               onChange={(e) => setDispatchDays(e.target.value)}
//               placeholder="Enter Days of Dispatch"
//               className="bg-[#F3EAE7] rounded-full w-full p-2 "
//             />
//           </div>

//           <div>
//             <label className="text-sm text-[#C5A88F]" htmlFor="warranty">
//               Warranty (optional)
//             </label>
//             <input
//               id="warranty"
//               type="text"
//               value={warranty}
//               onChange={(e) => setWarranty(e.target.value)}
//               placeholder="Enter Warranty if any"
//               className="bg-[#F3EAE7] rounded-full w-full p-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-[#C5A88F]">
//               Upload Images (Max. 5)
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageUpload}
//               className="mt-1 bg-[#F3EAE7] rounded-full w-full py-[6px] px-3"
//             />
//           </div>
//         </div>

//         {/* <DialogFooter className="flex justify-between mt-6">
//           <button
//             onClick={() => {setModalOpen(false)
//               setSelectedProduct(null)
//             }}
//             className="bg-red-500 text-white rounded-lg px-4 py-2"
//           >
//             Cancel
//           </button>
//           {selectedProduct ? (<button
//             onClick={handleUpdate}
//             className="bg-baw-baw-g5 text-white rounded-lg px-4 py-2"
//           >
//             Update
//           </button>) :(
//             <button
//             onClick={handleSubmit}
//             className="bg-baw-baw-g5 text-white rounded-lg px-4 py-2"
//           >
//             Upload
//           </button>
//           )}
//         </DialogFooter> */}
//       </DialogContent>
//     </Dialog>
//     </div>
//   )
// };

"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/firebase";
import { useAuth } from "@/hooks/auth-context";
import { useModel } from "@/hooks/model-context";
import { getUserFromFireBase, updateProductDetails } from "@/lib/firebaseFunc";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Bot, Loader2, ShieldQuestion } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Categories,
  gender,
  gold_purity,
  gstPercentageOptions,
  metal_options,
  size,
} from "../types/types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  goldPurity: z.string(),
  gstPercentage: z.string(),
  netWeight: z.string(),
  grossWeight: z.string(),
  noOfDiamonds: z.string(),
  diamondColor: z.string(),
  diamondWeight: z.string(),
  goldPricePerGram: z.string(),
  diamondPricePerGram: z.string(),
  makingCharges: z.string(),
  metalOption: z.string(),
  gstPrice: z.string(),
  dod: z.string(),
  size: z.string(),
  category: z.string(),
});

export const EditProductForm = () => {
  const { currentUser } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const {
    isOpen,
    currentModel,
    setClose,
    setProducts,
    setSelectedEditProduct,
    editSelectedProduct,
    setIsUpdated,
  } = useModel();
  const isModelOpen = isOpen && currentModel === "editProductPage";
  const [images, setImages] = useState<any>([]);
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  // State to store file previews (URLs)
  const [filePreviews, setFilePreviews] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [is_Open, setIsOpen] = useState(false);
  const [productCustomId, setProductCustomId] = useState("");
  const [documentLinksForFiserestore, setDocumentLinksForFiserestore] =
    useState<any>([]);

  const [makingCharges, setMakingCharges] = useState<number>(0);
  const [diamondPricePerGram, setDiamondPricePerGram] = useState<number>(0);
  const [diamondWeight, setDiamondWeight] = useState<number>(0);
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(0);
  const [netWeight, setNetWeight] = useState<number>(0);
  const [gstPrice, setGstPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [internationalPrice, setInternationalPrice] = useState<number>(0);
  const [openDialogue, setOpenDialogue] = useState<boolean>(false);
  const [finalGoldPrice, setFinalGoldPrice] = useState<number>(0);
  const [finalDiamondPrice, setFinalDiamondPrice] = useState<number>(0);
  const [gstPercentage, setGstPercentage] = useState<number>(0);

  const internationalPercentageHike = 120;

  useEffect(() => {
    if (editSelectedProduct) {
      setFilePreviews(editSelectedProduct.images || []);
      form.setValue("description", editSelectedProduct.description);
      setGstPercentage(editSelectedProduct.gstPercentage);
      form.setValue("category", editSelectedProduct.category);
      form.setValue("metalOption", editSelectedProduct.metalOption);
      setSelectedOptions(editSelectedProduct.gender);
      form.setValue("size", editSelectedProduct.size);
      form.setValue("dod", editSelectedProduct.dod);
      form.setValue("noOfDiamonds", editSelectedProduct.noOfDiamonds);
      form.setValue("diamondColor", editSelectedProduct.diamondColor);
      form.setValue("goldPurity", editSelectedProduct.goldPurity);
      form.setValue("title", editSelectedProduct.title);
      setMakingCharges(editSelectedProduct.makingCharges);
      setDiamondPricePerGram(editSelectedProduct.diamondPricePerGram);
      setDiamondWeight(editSelectedProduct.diamondWeight);
      setNetWeight(editSelectedProduct.netWeight);
      setGoldPricePerGram(editSelectedProduct.goldPricePerGram);
      setGstPrice(editSelectedProduct.gstPrice);
      setFinalPrice(editSelectedProduct.finalPrice);
      setInternationalPrice(
        editSelectedProduct.finalPrice +
          editSelectedProduct.finalPrice * (internationalPercentageHike / 100)
      );
    }
  }, [editSelectedProduct]);

  // useEffect(() => {
  //   const cost =
  //     makingCharges +
  //     gstPrice +
  //     goldPricePerGram * netWeight +
  //     diamondPricePerGram * diamondWeight;
  //   const ICost = cost + cost * (internationalPercentageHike / 100);
  //   setFinalPrice(cost);
  //   setInternationalPrice(ICost);
  // }, [
  //   makingCharges,
  //   diamondPricePerGram,
  //   diamondWeight,
  //   goldPricePerGram,
  //   netWeight,
  //   gstPrice,
  // ]);

  useEffect(() => {
    const cost =
      makingCharges +
      gstPrice +
      goldPricePerGram * netWeight +
      diamondPricePerGram * diamondWeight;

    const FinalGoldCost = goldPricePerGram * netWeight;
    const FinalDiamondPrice = diamondPricePerGram * diamondWeight;
    if (gstPercentage != 0) {
      const totalSum = FinalGoldCost + FinalDiamondPrice + makingCharges;
      const FinalGstPrice = (totalSum * gstPercentage) / 100;

      setGstPrice(Math.round(FinalGstPrice * 100) / 100);
    }

    setFinalGoldPrice(Math.round(FinalGoldCost * 100) / 100);

    setFinalDiamondPrice(Math.round(FinalDiamondPrice * 100) / 100);

    setFinalPrice(Math.round(cost * 100) / 100);
  }, [
    gstPercentage,
    makingCharges,
    diamondPricePerGram,
    diamondWeight,
    goldPricePerGram,
    netWeight,
    gstPrice,
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const removeOption = (option: string) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  };
  const handleSelectOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleConfirmSelection = () => {
    // Do something with selected options (e.g., send to server)
    setIsOpen(false);
  };
  const toggleDialog = () => {
    setIsOpen(!is_Open);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleImageSubmit = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      setImages(e.target.files);
      const files = e.target.files;

      setSelectedFiles(files);

      // Clear previous previews
      setFilePreviews([]);

      // Create file previews using URLs
      const previews: string[] = [];
      //@ts-ignore
      for (const file of files) {
        const fileURL = URL.createObjectURL(file);
        previews.push(fileURL);
      }
      setFilePreviews(previews);
    }
  };

  const removeFile = (index: number) => {
    if (images) {
      // Convert FileList to an array to remove the file
      const filesArray = Array.from(images);

      // Remove the file from the files array
      filesArray.splice(index, 1);

      // Create a new FileList from the remaining files
      const dataTransfer = new DataTransfer();
      //@ts-ignore
      filesArray.forEach((file) => dataTransfer.items.add(file));
      const updatedFiles = dataTransfer.files;

      // Update the selected files state
      setImages(updatedFiles);

      // Update file previews state by removing the file at the specified index
      //@ts-ignore
      const updatedPreviews = filePreviews.filter((_, idx) => idx !== index);
      setFilePreviews(updatedPreviews);
    }
  };

  // const handleImageSubmit =async (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {

  //     setImages(e.target.files);
  //     const files = e.target.files;
  //     const reader =await new FileReader();
  //     reader.onload =  function () {
  //       setImagePreview((data: any) => [...data, reader.result]);
  //     };

  //     const filesArray = Array.from(
  //       { length: files.length },
  //       (_, index) => files[index]
  //     );
  //     filesArray.map((file) => reader.readAsDataURL(file));

  //     handleUpload();
  //   }
  // };

  const handleUpload = async (sellerUid: string, productId: string) => {
    try {
      const time = productId;
      //@ts-ignore
      let DocumentLinks = [];
      if (images.length > 0) {
        const filesArray = Array.from(
          { length: images.length },
          (_, index) => images[index]
        );

        setProductCustomId(time);
        //@ts-ignore
        await Promise.all(
          filesArray.map((image: any, i: number) => {
            const storageRef = ref(
              storage,
              `productImages/${sellerUid}/${time}/${image.name}_${i}`
            );
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
              "state_changed",
              () => {
                const progress =
                  (uploadTask.snapshot.bytesTransferred /
                    uploadTask.snapshot.totalBytes) *
                  100;
                console.log(`Upload is ${progress}% done`);
              },
              (error) => {
                console.log(error.message);
              },
              () => {
                setUploaded(true);

                console.log("Upload completed");
              }
            );
            return uploadTask;
          })
        );

        await Promise.all(
          filesArray.map(async (file, i) => {
            const storageRef = ref(
              storage,
              `productImages/${sellerUid}/${time}/${file.name}_${i}`
            ); // Specify the path where each file is stored
            const downloadUrl = await getDownloadURL(storageRef);
            DocumentLinks.push(downloadUrl);
            return true;
          })
        );
      }
      //@ts-ignore
      return DocumentLinks;
    } catch (error) {
      console.log("Error in creating products", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportNo: "",
      title: "",
      description: "",
      goldPurity: "",
      netWeight: "",
      grossWeight: "",
      noOfDiamonds: "",
      diamondColor: "white",
      diamondWeight: "",
      goldPricePerGram: "",
      diamondPricePerGram: "",
      makingCharges: "",
      metalOption: "",
      gstPrice: "",
      dod: "",
      size: "",
      category: "",
      gstPercentage: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  if (!isMounted) {
    return null;
  }
  //@ts-ignore
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const productId = editSelectedProduct.productId;
      let imagesURL = editSelectedProduct.images;
      if (images.length > 0) {
        //@ts-ignore
        imagesURL = await handleUpload(currentUser.uid, productId);
      }

      const finalProductDetails = {
        ...values,
        finalPrice,
        makingCharges,
        diamondPricePerGram,
        diamondWeight,
        goldPricePerGram,
        netWeight,
        gstPrice,
        images: imagesURL,
        gender: selectedOptions,
      };

      await updateProductDetails(
        productId,
        //@ts-ignore
        finalProductDetails,
        editSelectedProduct.id
      );
      toast.success("Product edited successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdated((curr: boolean) => !curr);

      setImages([]);
      setClose();
      setLoading(false);
    }
    // await addProductToFireStore({
    //   sellerUID: currentUser?.uid,
    //   daysOfDispatch: values.daysOfDispatch,
    //   description: values.description,
    //   featured: values.featured == "true" ? true : false,
    //   images: uuid,
    //   material: values.material,
    //   maxRetailPrice: values.maxRetailPrice,
    //   minOrderQuantity: values.minOrderQuantity,
    //   sellingPrice: values.sellingPrice,
    //   size: values.size,
    //   title: values.title,
    //   warranty: values.warrenty,
    //   category: values.category,
    // });
    // form.reset();
    // form.setValue("maxRetailPrice", undefined);
    // form.setValue("sellingPrice", undefined);
    // form.setValue("daysOfDispatch", undefined);

    // setImages([]);
    // setSelectedFiles([]);
    // setFilePreviews([]);
    // setUploaded(false);
    // setClose();
  };

  return (
    <div className="">
      <Dialog open={isModelOpen} onOpenChange={setClose}>
        <DialogContent
          className={cn(
            " text-black bg-slate-100   flex max-h-[35rem] max-w-[70rem] "
          )}
        >
          <div className="flex flex-col justify-center items-center w-full h-full">
            <DialogHeader className="w-full  px-2">
              <DialogTitle className="w-full text-xl text-center mb-2 items-center justify-center flex flex-col font-semibold ">
                <span>Upload Product</span>
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                // @ts-ignore
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col w-full  "
              >
                <div className="w-full ">
                  <ScrollArea className=" h-[29rem] p-3">
                    <div className="flex flex-col gap-4  w-full max-h-full">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                                placeholder="Enter product title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={isLoading}
                                className=" bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                                placeholder="Enter Product Description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                  category
                                </FormLabel>
                                <Select
                                  disabled={isLoading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="w-full h-40">
                                    {Categories.map((category) => (
                                      <SelectItem
                                        key={category}
                                        value={category}
                                        className="capitalize"
                                      >
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="metalOption"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                  metal option
                                </FormLabel>
                                <Select
                                  disabled={isLoading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                      <SelectValue placeholder="Select a metal option" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {metal_options.map((mt) => (
                                      <SelectItem
                                        key={mt}
                                        value={mt}
                                        className="capitalize"
                                      >
                                        {mt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormItem>
                            <div>
                              <FormLabel className="flex justify-between items-center mt-2 uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Gender
                              </FormLabel>
                              <div className="w-full h-auto mt-3 "></div>

                              <div className="relative">
                                <div className="flex flex-wrap w-full">
                                  {selectedOptions.map((option, i) => (
                                    <div
                                      key={i}
                                      className="bg-gray-200 m-1 p-1 rounded"
                                    >
                                      {option}
                                      <span
                                        className="ml-1 text-red-600 cursor-pointer"
                                        onClick={() => removeOption(option)}
                                      >
                                        &#10005;
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <input
                                  disabled={loading}
                                  type="text"
                                  className="cursor-pointer border-gray-300 p-2 rounded-md w-full bg-zinc-300/50  border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                  placeholder="Select Gender"
                                  value={searchTerm}
                                  onChange={handleSearch}
                                  onClick={toggleDialog}
                                />
                                {is_Open && (
                                  <div className=" top-12 w-full right-0 border border-gray-300 bg-white p-2 ">
                                    <ul className="max-h-40 overflow-y-auto">
                                      {gender.map((option: any, i: number) => (
                                        <li
                                          key={i}
                                          className={`cursor-pointer p-2 ${
                                            selectedOptions.includes(option)
                                              ? "bg-blue-200"
                                              : "hover:bg-gray-100"
                                          }`}
                                          onClick={() =>
                                            handleSelectOption(option)
                                          }
                                        >
                                          {option}
                                        </li>
                                      ))}
                                    </ul>
                                    <button
                                      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                                      onClick={handleConfirmSelection}
                                    >
                                      Confirm Selection
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                          <FormField
                            control={form.control}
                            name="goldPurity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                  Gold purity
                                </FormLabel>
                                <Select
                                  disabled={isLoading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                      <SelectValue placeholder="Select a gold purity" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {gold_purity.map((mt) => (
                                      <SelectItem
                                        key={mt}
                                        value={mt}
                                        className="capitalize"
                                      >
                                        {mt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="border border-gray-200 rounded-lg">
                          {/* //Nandini */}
                          <div className="w-full h-full flex justify-center items-center ">
                            <div className=" w-full h-full  ">
                              <div className="relative w-full flex justify-center items-center flex-col ">
                                <div className="bg-[#c2e09f] hover:bg-[#9fbe7c] rounded-t-lg     w-full p-1 flex justify-center items-center ">
                                  Upload New Images
                                </div>
                                <input
                                  className="cursor-pointer top-0 left-0 absolute w-full h-full opacity-0 z-10"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleImageSubmit}
                                  id="upload-btn"
                                />
                              </div>
                              <div className=" flex justify-center items-center w-full h-[88%] ">
                                {filePreviews.length > 0 && (
                                  <div className="flex justify-center items-center w-full h-full pt-5">
                                    <Carousel>
                                      <CarouselContent className="max-w-96 max-h-72 object-cover ">
                                        {filePreviews.map(
                                          (file: any, i: number) => (
                                            <CarouselItem
                                              key={i}
                                              className="flex  items-center "
                                            >
                                              <img
                                                className=" max-h-full  mx-auto "
                                                alt="image preview"
                                                src={file}
                                              />
                                            </CarouselItem>
                                          )
                                        )}
                                      </CarouselContent>
                                      <CarouselPrevious
                                        type="button"
                                        className="bg-[#c2e09f]  z-10 "
                                      />
                                      <CarouselNext
                                        type="button"
                                        className="bg-[#c2e09f]  z-10"
                                      />
                                    </Carousel>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="size"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Size
                              </FormLabel>
                              <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent className="w-full h-40">
                                  {size.map((mt) => (
                                    <SelectItem
                                      key={mt}
                                      value={mt}
                                      className="capitalize"
                                    >
                                      {mt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Days of Dispatch
                              </FormLabel>
                              <FormControl>
                                <Input
                                  min={0}
                                  type="number"
                                  disabled={isLoading}
                                  className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                                  placeholder="Enter Days of dispatch"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="reportNo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Report No.
                              </FormLabel>
                              <FormControl>
                                <Input
                                  min={13}
                                  max={13}
                                  type="text"
                                  disabled={isLoading}
                                  className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                                  placeholder="Enter Days of dispatch"
                                  {...field}
                                />
                              </FormControl>
                              {form.getValues("reportNo") &&
                                form.getValues("reportNo").length !== 13 &&
                                form.getValues("reportNo").length !== 0 && (
                                  <p className="text-xs text-red-300">
                                    Enter a valid report no
                                  </p>
                                )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-3 flex-col flex gap-3">
                        <p className="flex w-full justify-center items-center font-semibold">
                          Gold Details
                        </p>
                        <div className="grid grid-cols-3 gap-3 ">
                          <div className="flex flex-col gap-2">
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              ₹ Gold Price / g
                            </FormLabel>

                            <Input
                              min={0}
                              type="number"
                              value={goldPricePerGram}
                              onChange={(e) =>
                                setGoldPricePerGram(parseFloat(e.target.value))
                              }
                              step="any"
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                              placeholder="₹ Enter price per gram"
                            />
                            {!goldPricePerGram && (
                              <>
                                {goldPricePerGram != 0 && (
                                  <p className="text-red-300 text-xs ">
                                    Should not be undefined if not in use keep
                                    it 0
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Total Gold Weight (g)
                            </FormLabel>
                            <Input
                              step="any"
                              type="number"
                              value={netWeight}
                              onChange={(e) =>
                                setNetWeight(parseFloat(e.target.value))
                              }
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                              placeholder="Enter net weigth in gram"
                            />
                            {!netWeight && (
                              <>
                                {netWeight != 0 && (
                                  <p className="text-red-300 text-xs ">
                                    Should not be undefined if not in use keep
                                    it 0
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Total Gold Price
                            </FormLabel>
                            <Input
                              readOnly
                              value={`₹ ${finalGoldPrice}`}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                              placeholder="Enter net weigth in gram"
                            />
                          </div>
                        </div>
                        <p className="mt-2 flex w-full justify-center items-center font-semibold">
                          Diamond Details
                        </p>

                        <div className="grid grid-cols-3 gap-3 ">
                          <div className="flex flex-col gap-2 mt-2">
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              ₹ Diamond Price / carat
                            </FormLabel>
                            <Input
                              step="any"
                              value={diamondPricePerGram}
                              onChange={(e) =>
                                setDiamondPricePerGram(
                                  parseFloat(e.target.value)
                                )
                              }
                              min={0}
                              type="number"
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                              placeholder="₹ Enter price per gram"
                            />
                            {!diamondPricePerGram && (
                              <>
                                {diamondPricePerGram != 0 && (
                                  <p className="text-red-300 text-xs ">
                                    Should not be undefined if not in use keep
                                    it 0
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 mt-2">
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Diamonds Weight (Total) in Carat
                            </FormLabel>
                            <Input
                              value={diamondWeight}
                              onChange={(e) =>
                                setDiamondWeight(parseFloat(e.target.value))
                              }
                              step="any"
                              type="number"
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                              placeholder="Total weight of diamonds in gram"
                            />
                            {!diamondWeight && (
                              <>
                                {diamondWeight != 0 && (
                                  <p className="text-red-300 text-xs ">
                                    Should not be undefined if not in use keep
                                    it 0
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 mt-2">
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Total Diamond Price
                            </FormLabel>
                            <Input
                              value={`₹ ${finalDiamondPrice}`}
                              readOnly
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                              placeholder="Total weight of diamonds in gram"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 ">
                          <FormField
                            control={form.control}
                            name="noOfDiamonds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                  No of diamonds
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    disabled={isLoading}
                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                                    placeholder="Enter no of diamonds"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="diamondColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                  Diamonds Color
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={isLoading}
                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                                    placeholder="Total weight of diamonds in gram"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 px-3 ">
                        <div className="flex flex-col gap-2">
                          <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Making Charges
                          </FormLabel>
                          <Input
                            step="any"
                            value={makingCharges}
                            onChange={(e) =>
                              setMakingCharges(parseFloat(e.target.value))
                            }
                            min={0}
                            type="number"
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                            placeholder="Total making charges"
                          />
                          {!makingCharges && (
                            <>
                              {makingCharges != 0 && (
                                <p className="text-red-300 text-xs ">
                                  Should not be undefined if not in use keep it
                                  0
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex flex-col ">
                          <FormLabel className="flex text-xs font-bold text-zinc-500 dark:text-secondary/70 mb-2">
                            GST Charges
                            {gstPercentage != 0 && (
                              <p className="ml-2">( {gstPercentage} % )</p>
                            )}
                            <HoverCard>
                              <HoverCardTrigger>
                                <ShieldQuestion className="h-4 w-4 flex justify-center items-center text-red-400 ml-1" />
                              </HoverCardTrigger>
                              <HoverCardContent
                                side="top"
                                align="center"
                                className="w-auto "
                              >
                                <div className="flex flex-col w-full">
                                  <div className="flex flex-col">
                                    <p className="flex w-full justify-center items-center text-sm">
                                      GST Rates
                                    </p>
                                    <div className="grid grid-cols-2 mt-2 ">
                                      <p className="flex justify-center items-center flex-col">
                                        <p>3 %</p>
                                        <p>(Jwellery Items)</p>
                                      </p>
                                      <p className="flex justify-center items-center flex-col">
                                        <p>18 %</p>
                                        <p>(Accessories)</p>
                                      </p>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex w-full flex-col justify-center items-center">
                                      <p className="flex w-full justify-center items-center text-sm">
                                        GST Calculation
                                      </p>
                                      <p className="text-xs font-normal justify-center items-center">
                                        (Total Gold Price + Total Diamond Price
                                        + Making Charges) % (GST Rate)
                                      </p>
                                    </div>
                                  </div>
                                  <div></div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </FormLabel>
                          <Input
                            value={`₹ ${gstPrice}`}
                            readOnly
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                          />
                        </div>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-3 flex-col flex gap-3">
                        <p className="mt-2 flex w-full justify-center items-center font-semibold">
                          Final Price Details
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Total Gold Price
                            </FormLabel>
                            <Input
                              value={
                                finalGoldPrice ? `₹ ${finalGoldPrice}` : "₹ 0"
                              }
                              contentEditable="false"
                              readOnly
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                            />
                          </div>
                          <div>
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Total Diamond Price
                            </FormLabel>
                            <Input
                              value={
                                finalDiamondPrice
                                  ? `₹ ${finalDiamondPrice}`
                                  : "₹ 0"
                              }
                              contentEditable="false"
                              readOnly
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                            />
                          </div>
                          <div>
                            <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Making Charges
                            </FormLabel>
                            <Input
                              value={
                                makingCharges ? `₹ ${makingCharges}` : "₹ 0"
                              }
                              contentEditable="false"
                              readOnly
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                            />
                          </div>
                          <div>
                            <FormLabel className="flex mt-1 mb-1 text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              GST Charges{" "}
                              {gstPercentage != 0 && (
                                <p className="ml-2">( {gstPercentage} % )</p>
                              )}
                              <HoverCard>
                                <HoverCardTrigger>
                                  <ShieldQuestion className="h-4 w-4 flex justify-center items-center text-red-400 ml-1" />
                                </HoverCardTrigger>
                                <HoverCardContent
                                  side="top"
                                  align="center"
                                  className="w-auto "
                                >
                                  <div className="flex flex-col w-full">
                                    <div className="flex flex-col">
                                      <p className="flex w-full justify-center items-center text-sm">
                                        GST Rates
                                      </p>
                                      <div className="grid grid-cols-2 mt-2 ">
                                        <p className="flex justify-center items-center flex-col">
                                          <p>3 %</p>
                                          <p>(Jwellery Items)</p>
                                        </p>
                                        <p className="flex justify-center items-center flex-col">
                                          <p>18 %</p>
                                          <p>(Accessories)</p>
                                        </p>
                                      </div>
                                      <Separator className="my-2" />
                                      <div className="flex w-full flex-col justify-center items-center">
                                        <p className="flex w-full justify-center items-center text-sm">
                                          GST Calculation
                                        </p>
                                        <p className="text-xs font-normal justify-center items-center">
                                          (Total Gold Price + Total Diamond
                                          Price + Making Charges) % (GST Rate)
                                        </p>
                                      </div>
                                    </div>
                                    <div></div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </FormLabel>
                            <Input
                              value={gstPrice ? `₹ ${gstPrice}` : "₹ 0"}
                              contentEditable="false"
                              readOnly
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                            />
                          </div>
                        </div>
                        <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                          Final Price
                        </FormLabel>
                        <Input
                          value={finalPrice ? `₹ ${finalPrice}` : "₹ 0"}
                          contentEditable="false"
                          readOnly
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                        />
                      </div>
                    </div>
                    <div className="space-y-8  px-8 flex justify-end items-center  bottom-3 right-8  ">
                      {!isLoading ? (
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={() => {
                              setImages([]);
                              setClose();
                            }}
                            className=" text-black mt-5 dark:text-white font-semibold"
                            variant="outline"
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <AlertDialog
                            onOpenChange={setOpenDialogue}
                            open={openDialogue}
                          >
                            <AlertDialogTrigger asChild>
                              <Button className=" text-white mt-5 dark:text-white font-semibold">
                                {loading ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                  "Edit Product"
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Edit the product
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>

                                <Button
                                  disabled={loading}
                                  onClick={() => {
                                    setOpenDialogue(false);
                                    //@ts-ignore
                                    onSubmit(form.control._formValues);
                                  }}
                                >
                                  Save Changes
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ) : (
                        <div>
                          <Bot className=" animate-bounce"></Bot>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/auth-context";
import { useModel } from "@/hooks/model-context";
import { db, storage } from "@/firebase";
import { setDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const BulkUploadForm = () => {
  const { currentUser } = useAuth();
  const { isOpen, currentModel, setClose, setOpen, data, setData } = useModel();
  const isModelOpen = isOpen && currentModel === "bulkUploadForm";
  const [isAdding, setIsAdding] = useState([]);
  const [isAddingg, setIsAddingg] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRefs = useRef([]);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const initialArray =
      data.length > 1 ? [false, ...Array(data.length - 1).fill(true)] : [false];
    setIsAdding(initialArray);
  }, [data]);

  const uploadImage = async (file, time, sellerId, i) => {
    const storageRef = ref(storage, `productImages/${sellerId}/${time}/${i}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleAdd = async (pr, index) => {
    setIsAdding((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });

    const productId = `PID${Date.now()}`;
    const sellerId = currentUser.id;
    const files = selectedFiles; // Retrieve files from state
    const downloadURLs = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const downloadURL = await uploadImage(file, productId, sellerId, i);
      downloadURLs.push(downloadURL);
    }

    try {
      await setDoc(doc(db, "products", productId), {
        vendorUId: currentUser.vendorUId,
        category: pr.category,
        description: pr.description,
        diamondColor: pr.diamondColor,
        diamondPricePerGram: pr.diamondPricePerCarat,
        diamondWeight: pr.diamondWeightInCarat,
        totalDiamondPrice: pr.totalDiamondPrice,
        dod: pr.daysofDispatch,
        gender: pr.targetedGender,
        goldPricePerGram: pr.goldPricePergm,
        goldWeight: pr.goldWeightIngm,
        totalGoldPrice: pr.totalGoldPrice,
        goldPurity: pr.goldPurity,
        gstPrice: pr.gstCharges,
        images: downloadURLs,
        makingCharges: pr.makingCharges,
        metalOption: pr.metal,
        netWeight: pr.netWeightIngm,
        grossWeight: pr.grossWeightIngm,
        noOfDiamonds: pr.numberofDiamonds,
        productId: productId,
        size: pr.size,
        title: pr.title,
        vendorId: currentUser.id,
        finalPrice: pr.finalPrice,
        reportNo: pr.reportNumber,
        gstPercentage: pr.gstPercentage,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "disabled",
      });
      console.log("Product written with ID: ", productId);
    } catch (error) {
      console.log("Error in adding Product", error);
    }

    setIsAdding((prevState) => {
      const newState = [...prevState];
      newState[index + 1] = false;
      return newState;
    });

    setData((prevState) => prevState.filter((_, i) => i !== index));
    setIsAddingg(false);
    setUrls([]);
    setImagePreviews([]);
  };

  const handleImageUpload = (e, index) => {
    const files = e.target.files;
    const updatedFiles = [];
    const updatedPreviews = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      updatedFiles[i] = file;
      updatedPreviews[index + i] = URL.createObjectURL(file);
    }

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    e.target.files = null;

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
  };

  return (
    <div>
      <Dialog
        open={isModelOpen}
        onOpenChange={() => {
          setImagePreviews([]);
          setSelectedFiles([]);
          setClose();
        }}
      >
        <DialogContent className="text-black bg-slate-100 flex max-h-[35rem] max-w-[60rem]">
          <div className="flex flex-col justify-center items-center w-full h-full">
            <DialogHeader className="w-full px-2">
              <DialogTitle className="w-full text-xl text-center mb-2 items-center justify-center flex flex-col font-semibold">
                <span>Upload Products</span>
              </DialogTitle>
            </DialogHeader>
            <div className="w-full">
              <ScrollArea className="h-[29rem] p-3">
                <div className="flex gap-4 flex-col w-full max-h-full">
                  {data.map((pr, i) => (
                    <div
                      style={isAdding[i] ? { opacity: "30%" } : {}}
                      onClick={() => {
                        if (isAdding[i]) {
                          setIsAdding((prevState) =>
                            prevState.map((item, index) =>
                              index === i ? false : true
                            )
                          );
                        }
                      }}
                      key={i}
                      className="flex gap-4 w-[80%] justify-between items-end rounded-md border border-black border-solid p-4"
                    >
                      <div className="flex gap-6 justify-center items-center">
                        {!isAdding[i] && (
                          <>
                            {imagePreviews.length > 0 && (
                              <div
                                style={{ margin: "0 2rem" }}
                                className="flex justify-center items-center w-[4rem] h-full pb-1"
                              >
                                <Carousel>
                                  <CarouselContent className="w-24 object-cover ">
                                    {imagePreviews &&
                                      imagePreviews.map((file, i) => (
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
                                      ))}
                                  </CarouselContent>

                                  <CarouselPrevious
                                    type="button"
                                    className="bg-yellow-300 z-30 "
                                  />
                                  <CarouselNext
                                    type="button"
                                    className="bg-yellow-300 z-30"
                                  />
                                </Carousel>
                              </div>
                            )}
                          </>
                        )}

                        <div className="flex flex-col gap-1">
                          <p className="text-2xl">
                            {i + 1}
                            {".) "}
                            {pr.title}
                          </p>
                          <p className="text-xs">{pr.description}</p>
                          <p className="text-xs italic">₹{pr.finalPrice}</p>
                        </div>
                      </div>
                      <div>
                        <input
                          ref={(el) => (fileInputRefs.current[i] = el)}
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, i)}
                          multiple
                        />
                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={() => {
                              if (fileInputRefs.current[i]) {
                                fileInputRefs.current[i].click();
                              }
                              if (!isAdding[i]) {
                                setIsAdding((prevState) =>
                                  prevState.map((item, index) =>
                                    index === i ? false : true
                                  )
                                );
                              }
                            }}
                            disabled={isAdding[i]}
                            className="text-white font-semibold"
                          >
                            Upload Image
                          </Button>
                          <Button
                            disabled={isAdding[i] || (imagePreviews.length < 1)}
                            className="text-white font-semibold"
                            onClick={() => {
                              setIsAddingg(true);
                              handleAdd(pr, i);
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isAddingg && (
                    <div className="absolute top-[50%] left-[50%] items-center justify-center w-screen h-screen z-10">
                      <ClipLoader
                        color={"black"}
                        loading={isAddingg}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};


// import { useEffect, useRef, useState, ChangeEvent } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useAuth } from "@/hooks/auth-context";
// import { useModel } from "@/hooks/model-context";
// import { db, storage } from "@/firebase";
// import { setDoc, doc } from "firebase/firestore";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import ClipLoader from "react-spinners/ClipLoader";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export const BulkUploadForm = () => {
//   const { currentUser } = useAuth();
//   const { isOpen, currentModel, setClose, setOpen, data, setData } = useModel();
//   const isModelOpen = isOpen && currentModel === "bulkUploadForm";
//   const [isAdding, setIsAdding] = useState([]);
//   const [isAddingg, setIsAddingg] = useState(false);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const fileInputRefs = useRef([]);
//   const [urls, setUrls] = useState([]);

//   useEffect(() => {
//     const initialArray =
//       data.length > 1 ? [false, ...Array(data.length - 1).fill(true)] : [false];
//     setIsAdding(initialArray);
//   }, [data]);

//   const uploadImage = async (file, time, sellerId, i) => {
//     const storageRef = ref(storage, `productImages/${sellerId}/${time}/${i}`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);
//     return downloadURL;
//   };

//   const handleAdd = async (pr, index) => {
//     setIsAdding((prevState) => {
//       const newState = [...prevState];
//       newState[index] = true;
//       return newState;
//     });

//     const productId = `PID${Date.now()}`;
//     const sellerId = currentUser.id;
//     const files = selectedFiles; // Retrieve files from state
//     const downloadURLs = [];

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const downloadURL = await uploadImage(file, productId, sellerId, i);
//       downloadURLs.push(downloadURL);
//     }

//     try {
//       await setDoc(doc(db, "products", productId), {
//         vendorUId: currentUser.vendorUId,
//         category: pr.category,
//         description: pr.description,
//         diamondColor: pr.diamondColor,
//         diamondPricePerGram: pr.diamondPricePerCarat,
//         diamondWeight: pr.diamondWeightInCarat,
//         totalDiamondPrice: pr.totalDiamondPrice,
//         dod: pr.daysofDispatch,
//         gender: pr.targetedGender,
//         goldPricePerGram: pr.goldPricePergm,
//         goldWeight: pr.goldWeightIngm,
//         totalGoldPrice: pr.totalGoldPrice,
//         goldPurity: pr.goldPurity,
//         gstPrice: pr.gstCharges,
//         images: downloadURLs,
//         makingCharges: pr.makingCharges,
//         metalOption: pr.metal,
//         netWeight: pr.netWeightIngm,
//         grossWeight: pr.grossWeightIngm,
//         noOfDiamonds: pr.numberofDiamonds,
//         productId: productId,
//         size: pr.size,
//         title: pr.title,
//         vendorId: currentUser.id,
//         finalPrice: pr.finalPrice,
//         reportNo: pr.reportNumber,
//         gstPercentage: pr.gstPercentage,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         status: "disabled",
//       });
//       console.log("Product written with ID: ", productId);
//     } catch (error) {
//       console.log("Error in adding Product", error);
//     }
// ``
//     setIsAdding((prevState) => {
//       const newState = [...prevState];
//       newState[index + 1] = false;
//       return newState;
//     });

//     setData((prevState) => prevState.filter((_, i) => i !== index));
//     setIsAddingg(false);
//     setUrls([]);
//     setImagePreviews([]);
//   };

//   const handleImageUpload = (e, index) => {
//     const files = e.target.files;
//     const updatedFiles = [];
//     const updatedPreviews = [];

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       updatedFiles[i] = file;
//       updatedPreviews[index + i] = URL.createObjectURL(file);
//     }

//     setSelectedFiles(updatedFiles);
//     setImagePreviews(updatedPreviews);
//     e.target.files = null;

//     if (fileInputRefs.current[index]) {
//       fileInputRefs.current[index].value = "";
//     }
//   };

//   return (
//     <div>
//       <Dialog open={isModelOpen} onOpenChange={setClose}>
//         <DialogContent className="max-w-[70rem] p-6 bg-white rounded-lg shadow-lg">
//           <DialogHeader>
//             <DialogTitle className="text-3xl text-[#4D413E] font-bold">
//               Upload Product
//             </DialogTitle>
//           </DialogHeader>
  
//           {/* Product form content */}
  
//           <div className="grid grid-cols-3 gap-4 mt-4">
//             {/* Various input fields like Category, Sub Category, Title, etc. */}
//             <div>
//               <label className="text-sm text-[#C5A88F]" htmlFor="category">Category</label>
//               <Select value={category} onValueChange={setCategory} className="max-h-10">
//                 <SelectTrigger className="rounded-full w-full p-2 bg-[#F3EAE7]">
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent side="bottom" className="bg-white">
//                   <SelectGroup className="bg-white max-h-24">
//                     {Categories.map((category, i) => (
//                       <SelectItem key={i} value={category}>{category}</SelectItem>
//                     ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
  
//             {/* Other form fields for inputs, prices, and more */}
  
//             <div>
//               <label className="block text-sm text-[#C5A88F]">Upload Images (Max. 5)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageUpload}
//                 className="mt-1 bg-[#F3EAE7] rounded-full w-full py-[6px] px-3"
//               />
//             </div>
//           </div>
  
//           {/* Uncommented DialogFooter for buttons */}
//           <DialogFooter className="flex justify-between mt-6">
//             <button
//               onClick={() => {setModalOpen(false); setSelectedProduct(null);}}
//               className="bg-red-500 text-white rounded-lg px-4 py-2"
//             >
//               Cancel
//             </button>
//             {selectedProduct ? (
//               <button onClick={handleUpdate} className="bg-baw-baw-g5 text-white rounded-lg px-4 py-2">
//                 Update
//               </button>
//             ) : (
//               <button onClick={handleSubmit} className="bg-baw-baw-g5 text-white rounded-lg px-4 py-2">
//                 Upload
//               </button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
  
// };

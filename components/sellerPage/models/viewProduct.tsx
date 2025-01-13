"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/auth-context";
import { useModel } from "@/hooks/model-context";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ImageViewer from "../viewImage";

export const ViewProduct = () => {
  const { currentUser } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, currentModel, setClose, setOpen, editSelectedProduct } =
    useModel();
  const isModelOpen = isOpen && currentModel === "viewProduct";

  return (
    <div className="">
      <Dialog open={isModelOpen} onOpenChange={setClose}>
        <DialogContent
          className={cn(
            " text-black bg-slate-100   flex max-h-[45rem] max-w-[60rem] "
          )}
        >
          <div className="flex flex-col justify-center items-center w-full h-full">
          
            {editSelectedProduct && (
              <ScrollArea className="w-full h-[32rem]">
                <div className=" flex w-full h-full items-center justify-center">
                  <div className="w-full bg-white p-6 rounded-xl relative">
                    <p
                      className={cn(
                        "absolute top-4 left-4 font-medium",
                        editSelectedProduct.status == "active"
                          ? "text-yellow-300"
                          : editSelectedProduct.status == "approved"
                          ? "text-green-300"
                          : "text-red-300"
                      )}
                    >
                      {" "}
                      {editSelectedProduct.status == "active"
                        ? "Active"
                        : editSelectedProduct.status == "approved"
                        ? "Approved"
                        : "Disabled"}
                    </p>
                    <div className="flex justify-end pb-0 mb-2"></div>
                    <div className="flex   justify-center items-center w-full">
                      <div className="flex flex-col w-1/2  ">
                        <div className="flex justify-center mt-4 pl-6 mb-4 items-center text-2xl font-semibold">
                          <div className="text-gray-700">
                            {editSelectedProduct.id}
                          </div>
                        </div>
                        <div>
                          <div className="flex  flex-col">
                            <span className="m-2">Title</span>
                            <Input
                              readOnly
                              value={editSelectedProduct.title}
                              className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2">Description</span>
                            <Textarea
                              readOnly
                              value={editSelectedProduct.description}
                              className="h-auto resize-none rounded-xl border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2">Category</span>
                            <Input
                              readOnly
                              value={editSelectedProduct.category}
                              className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center ml-4 w-1/2 ">
                        <ImageViewer images={editSelectedProduct.images} />
                      </div>
                    </div>

                    <div className="flex  w-full h-3/4 flex-col">
                      <div className="flex  w-full flex-col justify-start pr-2">
                        <div className="flex font-semibold justify-center p-2 mt-2">
                          Diamond Details
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="m-2">Diamond Weight</span>
                            <Input
                              readOnly
                              value={`${editSelectedProduct.diamondWeight} g`}
                              className="rounded-xl"
                            />
                          </div>{" "}
                          <div className="flex flex-col">
                            <span className="m-2">Diamond Price per Gram</span>
                            <Input
                              readOnly
                              value={`₹ ${editSelectedProduct.diamondPricePerGram}`}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2">Number of Diamonds</span>
                            <Input
                              readOnly
                              value={editSelectedProduct.noOfDiamonds}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2 ">Diamond Color</span>
                            <Input
                              readOnly
                              value={editSelectedProduct.diamondColor}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex  w-full flex-col justify-start pl-2">
                        <div className="flex font-semibold justify-center p-2 mt-2">
                          Gold Details
                        </div>
                        <div className="grid grid-cols-2 gap-4 ">
                          <div className="flex flex-col">
                            <span className="m-2">Gold Weight</span>
                            <Input
                              readOnly
                              value={`${editSelectedProduct.netWeight} g`}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2">Gold Price per Gram</span>
                            <Input
                              readOnly
                              value={`₹ ${editSelectedProduct.goldPricePerGram}`}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2">Gold Purity</span>
                            <Input
                              readOnly
                              value={editSelectedProduct.goldPurity}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2">Metal Option</span>
                            <Input
                              readOnly
                              value={editSelectedProduct.metalOption}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex font-semibold justify-center p-2 mt-2">
                        Other Details
                      </div>
                      <div className="flex flex-col ">
                        <div className="grid grid-cols-2  w-full gap-4 justify-start ">
                          <div className="flex flex-col">
                            <span className="m-2">Size</span>
                            <Input
                              readOnly
                              value={editSelectedProduct.size}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2">Date of Dispatch</span>
                            <Input
                              readOnly
                              value={editSelectedProduct.dod}
                              className="rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid w-full grid-cols-2 gap-4 justify-start ">
                          <div className="flex flex-col">
                            <span className="m-2">Making Charges</span>
                            <Input
                              readOnly
                              value={`₹ ${editSelectedProduct.makingCharges}`}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="m-2">GST Price</span>
                            <Input
                              readOnly
                              value={`₹ ${editSelectedProduct.gstPrice}`}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col mt-2">
                          <span className="m-2 font-semibold">Final Price</span>
                          <Input
                            readOnly
                            value={`₹ ${editSelectedProduct.finalPrice}`}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

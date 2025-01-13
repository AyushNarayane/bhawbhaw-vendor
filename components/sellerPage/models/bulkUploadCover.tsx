"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModel } from "@/hooks/model-context";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Query name is required" }),
});

export const BulkUploadCover = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, currentModel, setClose, setOpen } = useModel();
  const isModelOpen = isOpen && currentModel === "singleUploadCover";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};

  const isLoading = form.formState.isSubmitting;

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Dialog open={isModelOpen} onOpenChange={setClose}>
        <DialogContent
          className={cn(
            " text-black bg-slate-100 pb-6 overflow-hidden flex flex-col"
          )}
        >
          <div className=" ">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-xl text-center items-center justify-center flex flex-col font-semibold">
                <span>Upload Product</span>
              </DialogTitle>
              <DialogDescription className="w-full text-center text-zinc-500 flex flex-col">
                <div className="w-full gap-16  flex justify-between items-center mt-3">
                  <div className="flex relative">
                    <Image
                      className="w-[8.3rem]"
                      src="/seller/order.png"
                      alt="image"
                      width={50}
                      height={50}
                    />
                    <div className="w-24 h-24 bg-white absolute -z-10 rounded-full -top-4 -left-[0.9rem]"></div>
                  </div>
                  <div className=" flex flex-col  text-left">
                    <p className="font-bold text-2xl text-black">
                      Bulk Product Upload
                    </p>
                    <p className="text-black w-full">
                      You can upload the products in bulk through excel sheet or
                      create single product
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            {/* <BulkUpload/> */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

{
  /* <Form {...form}>
<form
  onSubmit={form.handleSubmit(onSubmit)}
  className="space-y-8 "
>
  <div className="space-y-8  px-6 flex justify-center items-center">
    {!isLoading ? (
      <Button
        className=" text-white mt-5 dark:text-white font-semibold"
        variant="default"
        disabled={isLoading}
        onClick={() => setOpen("")}
      >
        Next
      </Button>
    ) : (
      <div>
        <Bot className=" animate-bounce"></Bot>
      </div>
    )}
  </div>
</form>
</Form> */
}

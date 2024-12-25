"use client";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ImageViewer = ({ images }: any) => {
  console.log("rendering image viewer");
  const [currImage, setCurrImage] = useState(0);

  const onForwardClick = () => {
    setCurrImage((prev) => (prev + 1) % images.length);
  };

  const onBackClick = () => {
    if (currImage == 0) {
      setCurrImage(images.length - 1);
      return;
    }

    setCurrImage((prev) => prev - 1);
  };
  return (
    <div className="flex md:justify-center items-center w-full border-2 border-dashed rounded-md p-1">
      {!images || !images.length ? (
        <div>No image selected</div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-center items-center gap-2 w-full">
            <ArrowLeftCircle
              onClick={onBackClick}
              className=" h-[30px] w-[30px] cursor-pointer rounded-full"
            />

            {images.length && (
              <div className="m-2 flex justify-center items-center w-full">
                
                  <Image
                    src={images[currImage]}
                    alt={"post image"}
            width={400}
            height={400}
            className="object-contain w-[500px] h-[300px] m-0 md:mx-2"
                  />
              
              </div>
            )}

            <ArrowRightCircle
              onClick={onForwardClick}
              className=" h-[30px] w-[30px] cursor-pointer rounded-full"
            />
          </div>
          <div className="text-xs text-gray-400 text-center">
            {currImage + 1}/{images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
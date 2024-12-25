"use client";

import { useEffect, useState } from "react";
import { EditProductForm } from "../models/editProductForm";
// import { SingleUploadForm } from "../models/singleUploadForm";
import { ViewProduct } from "../models/viewProduct";
import { BulkUploadForm } from "../models/bulkUploadForm";

export const ModelProviderPages = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      {/* <BulkUploadCover /> */}
      <BulkUploadForm />
      {/* <SingleUploadForm /> */}
      <EditProductForm />
      <ViewProduct />
    </>
  );
};

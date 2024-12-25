"use client";
import React, { useContext, useState } from "react";

const ModelContext = React.createContext();

export function useModel() {
  return useContext(ModelContext);
}

export function ModelProvider({ children }) {
  const [data, setData] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editSelectedProduct, setEditProduct] = useState();

  function setProducts(products) {
    setSelectedProducts(products);
    return;
  }
  function setSelectedEditProduct(product) {
    setEditProduct(product);
    return;
  }

  function setOpen(type) {
    setCurrentModel(type);
    setIsOpen(true);
    return;
  }

  function setClose() {
    setCurrentModel(null);
    setIsOpen(false);
    return;
  }

  const value = {
    isOpen,
    currentModel,
    setClose,
    setOpen,
    selectedProducts,
    setProducts,
    isUpdated,
    setIsUpdated,
    setSelectedEditProduct,
    editSelectedProduct,
    data,
    setData,
  };

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
}

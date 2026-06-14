import { useState, useEffect } from "react";

const getUnitPrice = (item) => Number(item?.discountPrice || item?.price || 0);

const getItemImages = (item) => {
  if (!item) return [];
  const images = [
    item.selectedOptions?.image,
    item.selectedImage,
    item.thumbnail,
    item.image,
    ...(Array.isArray(item.images) ? item.images : [item.images]),
  ].filter(Boolean);

  return [...new Set(images)];
};

export const useOrderDrawer = (orderFormHook) => {
  const {
    selectedProduct,
    setSelectedProduct,
    orderInfo,
    handleOrderChange,
    handleOrderSubmit,
  } = orderFormHook;

  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (selectedProduct) {
      const shipping = Number(orderInfo.shippingCharge) || 0;
      setGrandTotal(getUnitPrice(selectedProduct) * quantity + shipping);
    }
  }, [selectedProduct, quantity, orderInfo.shippingCharge]);

  const openDrawer = (product, initialQuantity = 1) => {
    setSelectedProduct(product);
    setQuantity(Math.max(1, Number(initialQuantity) || 1));

    // reset shipping & payment
    handleOrderChange({ target: { name: "shippingCharge", value: 70 } });
    handleOrderChange({
      target: { name: "paymentMethod", value: "Cash on Delivery" },
    });

    setIsOpen(true);
  };

  const closeDrawer = () => setIsOpen(false);
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const productTotal = selectedProduct ? getUnitPrice(selectedProduct) * quantity : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const payload = {
      ...orderInfo,
      items: [
        {
          productId: selectedProduct._id || selectedProduct.id,
          productName: selectedProduct.name,
          unitPrice: getUnitPrice(selectedProduct),
          quantity,
          finalPrice: productTotal,
          images: getItemImages(selectedProduct),
          selectedOptions: selectedProduct.selectedOptions || {},
          variation: selectedProduct.selectedOptions?.size || "",
          color: selectedProduct.selectedOptions?.color || "",
          selectedImage: selectedProduct.selectedOptions?.image || selectedProduct.selectedImage || "",
          status: "pending",
        },
      ],
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    handleOrderSubmit(payload);
    closeDrawer();
  };

  return {
    selectedProduct,
    isOpen,
    quantity,
    grandTotal,
    productTotal,
    shippingCharge: Number(orderInfo.shippingCharge),
    openDrawer,
    closeDrawer,
    increaseQuantity,
    decreaseQuantity,
    handleOrderChange,
    handleSubmit,
  };
};

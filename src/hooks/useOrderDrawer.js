import { useState, useEffect } from "react";

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
      setGrandTotal(selectedProduct.discountPrice? selectedProduct.discountPrice * quantity + shipping : selectedProduct.price * quantity + shipping);
    }
  }, [selectedProduct, quantity, orderInfo.shippingCharge]);

  const openDrawer = (product) => {
    setSelectedProduct(product);
    setQuantity(1);

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

  const productTotal = selectedProduct ? (selectedProduct.discountPrice ? selectedProduct.discountPrice * quantity : selectedProduct.price * quantity) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const payload = {
      ...orderInfo,
      items: [
        {
          productId: selectedProduct._id || selectedProduct.id,
          productName: selectedProduct.name,
          unitPrice: selectedProduct.price,
          quantity,
          finalPrice: productTotal,
          images: Array.isArray(selectedProduct.images)
            ? selectedProduct.images
            : [selectedProduct.images],
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
    openDrawer,
    closeDrawer,
    increaseQuantity,
    decreaseQuantity,
    handleOrderChange,
    handleSubmit,
  };
};

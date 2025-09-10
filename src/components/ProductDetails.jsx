import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductDetails from "../hooks/useProductDetails";
import useOrderForm from "../hooks/useOrderForm";
import { useOrderDrawer } from "../hooks/useOrderDrawer";
import OrderDrawer from "../components/OrderDrawer";
import design from "../styles/design";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, mainImage, setMainImage } = useProductDetails(id);
  const orderFormHook = useOrderForm(product);

  // Drawer Hook
  const {
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
  } = useOrderDrawer(orderFormHook);

  if (!product) {
    return (
      <div className="text-center text-xl text-[#318fe8] font-medium mt-10">
        Loading Product Details...
      </div>
    );
  }

  return (
    <div className="relative">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Product Card */}
      <div className="min-h-[calc(100vh-48px)] my-6 flex items-center justify-center bg-gradient-to-b from-[#06b5d4] to-[#3b82f5] p-4 rounded-xl max-w-4xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-2xl">
          <div className="p-8 max-w-md w-full">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
            <div className="flex gap-2 overflow-x-auto mb-4">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumbnail-${idx}`}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 object-cover rounded border cursor-pointer ${
                    mainImage === img
                      ? "ring-2 ring-blue-500"
                      : "opacity-80 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-[#0c2955] mb-2">
              {product.name}
            </h2>
            <p className="text-[#0c2955] text-base mb-1">
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
            <p className="text-[#0c2955] text-base mb-1">
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
            <p className="text-[#0c2955] text-base mb-1">
              <span className="font-semibold">Weight:</span>{" "}
              {product.weight || product.volume}
            </p>
            <p className="text-[#0c2955] text-base mb-1">
              <span className="font-semibold">Price:</span> BDT {product.price}
            </p>
            <p className="text-[#0c2955] text-base mb-3">
              <span className="font-semibold">In Stock:</span>{" "}
              {product.inStock ? "Yes" : "No"}
            </p>
            <p className="text-[#4a4a4a] text-base font-normal mb-4">
              {product.description}
            </p>

            <button
              onClick={() => openDrawer(product)}
              className={`w-full ${design.buttons}`}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* ✅ OrderDrawer Component */}
      <OrderDrawer
        selectedProduct={selectedProduct}
        isOpen={isOpen}
        quantity={quantity}
        grandTotal={grandTotal}
        productTotal={productTotal}
        closeDrawer={closeDrawer}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        handleOrderChange={handleOrderChange}
        handleSubmit={handleSubmit}
        orderInfo={orderFormHook.orderInfo}
      />
    </div>
  );
};

export default ProductDetails;

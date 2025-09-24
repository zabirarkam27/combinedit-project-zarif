import { useParams, useNavigate } from "react-router-dom";
import useProductDetails from "../hooks/useProductDetails";
import useOrderForm from "../hooks/useOrderForm";
import { useOrderDrawer } from "../hooks/useOrderDrawer";
import OrderDrawer from "../components/OrderDrawer";
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
    handleSubmit: originalHandleSubmit,
  } = useOrderDrawer(orderFormHook);

  // ✅ Wrapped handleSubmit for toast & navigate
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await originalHandleSubmit(e); // call original submit from hook
      toast.success("✅ Order placed successfully!", { autoClose: 2000 });
      closeDrawer();
      setTimeout(() => navigate("/"), 2100); // navigate after toast
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("❌ Failed to place order. Try again!");
    }
  };

  if (!product) {
    return (
      <div className="text-center text-xl text-[#318fe8] font-medium mt-10">
        Loading Product Details...
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-[#ff8d13]/65 to-[#fc4706]/65 py-6 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Product Card */}
      <div className="min-h-[calc(100vh-48px)] bg-gradient-to-b from-[#ff8d13] to-[#fc4706] max-w-2xl mx-auto flex rounded-xl items-center justify-center">
        <div className="bg-white/35 rounded-2xl shadow-2xl">
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

            <div className="text-white">
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
                <span className="font-semibold">Price:</span> BDT{" "}
                {product.price}
              </p>
              <p className="text-[#0c2955] text-base mb-3">
                <span className="font-semibold">In Stock:</span>{" "}
                {product.inStock ? "Yes" : "No"}
              </p>
              <p className="text-[#4a4a4a] text-base font-normal mb-4">
                {product.description}
              </p>
            </div>

            <button
              onClick={() => openDrawer(product)}
              className="btn text-center text-white font-semibold px-4 py-3 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right w-full border-0 shadow-none"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* OrderDrawer Component */}
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

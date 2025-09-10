import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/products";
import design from "../styles/design";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useOrderForm from "../hooks/useOrderForm";
import { useOrderDrawer } from "../hooks/useOrderDrawer";
import OrderDrawer from "../components/OrderDrawer";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const orderFormHook = useOrderForm();
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

  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setProducts(data);
      })
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  return (
    <div className="sm:mb-18 md:mb-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id || product.id}
              className="bg-white/50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col"
            >
              <Link
                to={`/products/${product._id}`}
                className="group relative overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={product.images}
                  alt={product.name}
                  className="w-full h-[200px] sm:h-[200px] md:h-[220px] object-cover lg:h-[240px] transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h1 className="text-[#0c2955] md:text-lg mb-1 font-bold">
                    {product.name}
                  </h1>
                  <p className="text-[#0c2955] text-xs md:text-sm mb-1">
                    <span className="font-semibold">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p className="text-[#0c2955] text-xs md:text-sm mb-4">
                    <span className="font-semibold">Price:</span> BDT{" "}
                    {product.price}
                  </p>
                </div>
                <div className="flex gap-0 md:gap-3 items-center">
                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success(`🛒 ${product.name} added to cart!`);
                    }}
                    className="bg-transparent hover:scale-110 transition cursor-pointer"
                  >
                    <img
                      src="/cart-icon.png"
                      alt="cart icon"
                      className="w-12"
                    />
                  </button>
                  <button
                    onClick={() => openDrawer(product)}
                    className={`w-full text-xs md:text-sm p-0 ${design.buttons}`}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-2 text-gray-500">
            No products found.
          </p>
        )}
      </div>

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

export default AllProducts;

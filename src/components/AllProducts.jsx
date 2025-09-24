import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/products";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useOrderForm from "../hooks/useOrderForm";
import { useOrderDrawer } from "../hooks/useOrderDrawer";
import OrderDrawer from "../components/OrderDrawer";

// ✅ Reusable product card (memoized)
const ProductCard = React.memo(({ product, onAddToCart, onOrderNow }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col relative">
      <div>
        <Link
          to={`/products/${product._id}`}
          className="group relative overflow-hidden shadow-md hover:shadow-xl transition"
        >
          <img
            src={product.thumbnail || product.image || product.images}
            alt={product.name}
            loading="lazy"
            className="w-full h-[200px] sm:h-[200px] md:h-[220px] object-cover lg:h-[240px] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out border-0 hover:bg-right h-1 max-w-full w-10/12 mx-auto"></div>

          {product.discountPrice ? (
            <div
              className="absolute top-3 right-3 bg-red-600 text-white text-xs h-10 w-10 rounded-full shadow-xl flex items-center justify-center transform hover:scale-125 transition-all duration-300 ease-in-out bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out border-0 hover:bg-right shadow-xl">
              <p className="font-bold">
                -{Math.round(((product.price - product.discountPrice) * 100) / product.price)}%
              </p>
            </div>
          ):""}
        </Link>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="text-left">
          <div className="space-y-0 mb-1">
            <h1 className="text-[#0c2955] md:text-lg font-bold">
              {product.name.length > 10
                ? product.name.substring(0, 10) + "..."
                : product.name}
            </h1>
            <p className="text-gray-500 text-xs md:text-sm">{product.category}</p>
          </div>
        </div>

        <div>
          {/* Price & discount price */}
          <div className="mb-1">
            {product.discountPrice ? (
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-xs md:text-sm line-through">
                  ৳{product.price}
                </p>
                <p className="font-semibold text-red-700">
                  ৳{product.discountPrice}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-[#03ac9c] text-xs font-semibold">Special Price</p>
                <p className="font-semibold text-red-700">
                  ৳{product.price}
                </p>
              </div>
            )}
          </div>



          {/* Cart & Order now btn */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => onAddToCart(product)}
              className="hover:scale-110 hover:cursor-pointer transition-all duration-500 ease-in-out transition"
            >
              <img src="/cart-icon.svg" alt="cart icon" className="w-12 p-1" />
            </button>
            <button
              onClick={() => onOrderNow(product)}
              className="w-6/8 text-xs md:text-sm p-0 btn text-center text-white font-semibold px-4 py-3 rounded-md bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out border-0 hover:bg-right shadow-none hover:scale-105 transition"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

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

  // ✅ Memoized handlers
  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
      toast.success(`🛒 ${product.name} added to cart!`);
    },
    [addToCart]
  );

  const handleOrderNow = useCallback(
    (product) => {
      openDrawer(product);
    },
    [openDrawer]
  );

  // ✅ Optimized API fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        toast.error("❌ Failed to load products. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="sm:mb-18 md:mb-0">
      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-3">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
              />
            ))
          ) : (
            <p className="text-center col-span-2 text-gray-500">
              No products found.
            </p>
          )}
        </div>
      )}

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

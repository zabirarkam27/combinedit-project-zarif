import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCart } from "../context/CartContext";
import useOrderForm from "../hooks/useOrderForm";
import { useOrderDrawer } from "../hooks/useOrderDrawer";
import { getProducts } from "../services/products";
import OrderDrawer from "../components/OrderDrawer";

const ProductCard = React.memo(({ product, onAddToCart, onOrderNow }) => {
  const productImage = Array.isArray(product.images)
    ? product.images[0]
    : product.thumbnail || product.image || product.images;
  const discount =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) * 100) / product.price)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col relative">
      <Link
        to={`/products/${product._id}`}
        className="group relative block overflow-hidden shadow-md hover:shadow-xl transition"
      >
        <img
          src={productImage || "/nav-icon/logo.png"}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-[200px] sm:h-[200px] md:h-[220px] lg:h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="theme-gradient theme-gradient-hover border-0 h-1 max-w-full w-10/12 mx-auto" />

        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs h-10 w-10 rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 ease-in-out">
            <p className="font-bold">-{discount}%</p>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="text-left">
          <h1 className="theme-text md:text-lg font-bold leading-tight">
            {product.name?.length > 18
              ? `${product.name.substring(0, 18)}...`
              : product.name}
          </h1>
          <p className="text-gray-500 text-xs md:text-sm">{product.category}</p>
        </div>

        <div className="mt-3">
          <div className="mb-2 min-h-6">
            {product.discountPrice ? (
              <div className="flex items-center justify-between gap-2">
                <p className="text-gray-500 text-xs md:text-sm line-through">
                  ৳{product.price}
                </p>
                <p className="font-semibold text-red-700">৳{product.discountPrice}</p>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <p className="text-[var(--theme-accent)] text-xs font-semibold">Special Price</p>
                <p className="font-semibold text-red-700">৳{product.price}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="shrink-0 hover:scale-110 hover:cursor-pointer transition-all duration-500 ease-in-out"
              aria-label={`Add ${product.name} to cart`}
            >
              <img src="/cart-icon.svg" alt="" className="w-12 p-1" />
            </button>
            <button
              type="button"
              onClick={() => onOrderNow(product)}
              className="flex-1 min-w-0 text-xs md:text-sm btn text-center text-white font-semibold px-4 py-3 rounded-md theme-gradient theme-gradient-hover border-0 shadow-none hover:scale-105"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-[200px] md:h-[220px] lg:h-[240px] bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-9 bg-slate-200 rounded" />
    </div>
  </div>
);

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    },
    [addToCart]
  );

  const handleOrderNow = useCallback(
    (product) => {
      openDrawer(product);
    },
    [openDrawer]
  );

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const data = Array.isArray(res.data) ? res.data : [];
        const visibleProducts = data
          .filter((product) => product.active !== false)
          .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
        if (!ignore) setProducts(visibleProducts);
      } catch (err) {
        console.error("Failed to load products:", err);
        toast.error("Failed to load products. Try again later.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="md:mb-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-3">
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}

        {!loading &&
          products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onOrderNow={handleOrderNow}
            />
          ))}

        {!loading && products.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
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
      <div className="h-3 md:h-6" />
    </div>
  );
};

export default AllProducts;

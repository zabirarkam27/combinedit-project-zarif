import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCart } from "../context/CartContext";
import useOrderForm from "../hooks/useOrderForm";
import { useOrderDrawer } from "../hooks/useOrderDrawer";
import { getProducts } from "../services/products";
import OrderDrawer from "../components/OrderDrawer";

const formatPrice = (value) => {
  const number = Number(value) || 0;
  return number.toLocaleString("en-US");
};

const getProductImage = (product) => {
  if (Array.isArray(product.images)) return product.images.find(Boolean);
  return product.thumbnail || product.image || product.images;
};

const ProductCard = React.memo(({ product, onAddToCart, onOrderNow }) => {
  const productImage = getProductImage(product);
  const regularPrice = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;
  const hasDiscount = discountPrice > 0 && discountPrice < regularPrice;
  const displayPrice = hasDiscount ? discountPrice : regularPrice;
  const discount = hasDiscount
    ? Math.round(((regularPrice - discountPrice) * 100) / regularPrice)
    : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--theme-border-color)] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.16)]">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link
          to={`/products/${product._id}`}
          className="block h-full w-full"
          aria-label={`Quick view - ${product.name}`}
        >
          <img
            src={productImage || "/nav-icon/logo.png"}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          aria-label={`Add ${product.name} to cart`}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white text-[var(--theme-primary)] shadow-[0_12px_24px_rgba(15,23,42,0.16)] transition-transform hover:scale-110 active:scale-95"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        </button>

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-lg bg-[var(--theme-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          to={`/products/${product._id}`}
          className="text-left text-base font-semibold leading-tight tracking-tight theme-text transition-colors hover:text-[var(--theme-primary)]"
        >
          {product.name}
        </Link>

        {product.category && (
          <p className="-mt-1 text-xs font-medium text-slate-500">
            {product.category}
          </p>
        )}

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-xl font-extrabold text-[var(--theme-primary)]">
            ৳{formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm font-medium text-slate-400 line-through">
              ৳{formatPrice(regularPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOrderNow(product)}
          className="mt-auto w-full rounded-lg bg-[var(--theme-primary)] py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(11,125,35,0.18)] transition-colors hover:bg-[var(--theme-accent-hover)] active:scale-[0.98]"
        >
          Order Now
        </button>
      </div>
    </article>
  );
});

ProductCard.displayName = "ProductCard";

const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)] animate-pulse">
    <div className="aspect-square bg-slate-200" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="h-3 w-1/2 rounded bg-slate-200" />
      <div className="h-6 w-2/5 rounded bg-slate-200" />
      <div className="h-10 rounded-xl bg-slate-200" />
    </div>
  </div>
);

const AllProducts = ({ pageSize = 6, initialProducts = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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
    if (Array.isArray(initialProducts)) {
      setProducts(initialProducts.filter((product) => product.active !== false));
      setLoading(false);
      return undefined;
    }

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

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [currentPage, pageSize, products]);

  return (
    <div className="md:mb-0">
      <div className="grid grid-cols-1 gap-4 py-3 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}

        {!loading &&
          paginatedProducts.map((product) => (
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

      {!loading && products.length > pageSize && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-[var(--theme-border-color)] bg-white px-4 py-2 text-sm font-bold text-[var(--theme-text)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition ${
                  currentPage === page
                    ? "bg-[var(--theme-primary)] text-white"
                    : "border border-[var(--theme-border-color)] bg-white text-[var(--theme-text)] hover:border-[var(--theme-primary)]"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            className="rounded-lg border border-[var(--theme-border-color)] bg-white px-4 py-2 text-sm font-bold text-[var(--theme-text)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
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
      <div className="h-3 md:h-6" />
    </div>
  );
};

export default AllProducts;

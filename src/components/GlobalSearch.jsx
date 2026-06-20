import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { getProducts } from "../services/products";

const getProductImage = (product) => {
  if (Array.isArray(product.images)) return product.images.find(Boolean);
  return product.thumbnail || product.image || product.images;
};

const getPrice = (product) =>
  Number(product.discountPrice) > 0 && Number(product.discountPrice) < Number(product.price)
    ? Number(product.discountPrice)
    : Number(product.price) || 0;

const GlobalSearch = ({ open, onClose }) => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (!open || products.length > 0) return;

    getProducts()
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        console.error("Failed to load search data:", error);
        setProducts([]);
      });
  }, [open, products.length]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    ).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const min = Number(minPrice);
    const max = Number(maxPrice);

    return products
      .filter((product) => product.active !== false)
      .filter((product) => {
        const price = getPrice(product);
        if (minPrice && price < min) return false;
        if (maxPrice && price > max) return false;
        if (!term) return true;

        return [product.name, product.category, product.brand, product.volume, product.weight]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      })
      .slice(0, 8);
  }, [maxPrice, minPrice, products, query]);

  const filteredCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return categories.slice(0, 8);
    return categories
      .filter((category) => category.toLowerCase().includes(term))
      .slice(0, 8);
  }, [categories, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/45 p-3 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="mx-auto mt-16 max-h-[82vh] max-w-3xl overflow-y-auto rounded-3xl bg-white p-4 shadow-[0_30px_90px_rgba(15,23,42,0.28)] md:p-6">
        <div className="flex items-center gap-3">
          <Search className="text-[var(--theme-primary)]" size={24} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, categories, brand..."
            className="min-w-0 flex-1 border-0 bg-transparent text-base font-semibold outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Min price"
            className="input input-bordered bg-white"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max price"
            className="input input-bordered bg-white"
          />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-slate-950">Products</p>
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <Link
                key={product._id || product.id}
                to={`/products/${product._id || product.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl border border-[var(--theme-border-color)] p-2 transition hover:border-[var(--theme-primary)]"
              >
                <img
                  src={getProductImage(product) || "/nav-icon/logo.png"}
                  alt={product.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-bold text-slate-950">{product.name}</p>
                  <p className="text-sm text-[var(--theme-muted-text)]">{product.category}</p>
                </div>
                <p className="font-extrabold text-[var(--theme-primary)]">
                  ৳{getPrice(product).toLocaleString("en-US")}
                </p>
              </Link>
            ))}
            {filteredProducts.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                No products matched.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-slate-950">Categories</p>
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                onClick={onClose}
                className="rounded-full bg-[var(--theme-muted-bg)] px-4 py-2 text-sm font-bold text-[var(--theme-primary)]"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;


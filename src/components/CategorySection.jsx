import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Grid2X2, Leaf } from "lucide-react";
import { getProducts } from "../services/products";

const getProductImage = (product) => {
  if (Array.isArray(product.images)) return product.images.find(Boolean);
  return product.thumbnail || product.image || product.images;
};

const CategorySection = ({ limit = 6, showViewAll = true }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    getProducts()
      .then((res) => {
        if (ignore) return;
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
        if (!ignore) setProducts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => {
    const map = new Map();

    products
      .filter((product) => product.active !== false && product.category)
      .forEach((product) => {
        const name = product.category.trim();
        const existing = map.get(name) || {
          name,
          count: 0,
          image: getProductImage(product),
        };
        existing.count += 1;
        existing.image = existing.image || getProductImage(product);
        map.set(name, existing);
      });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const visibleCategories = categories.slice(0, limit);

  if (loading) {
    return (
      <section className="my-8 text-left">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="my-8 text-left">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-950 md:text-3xl">
            Categories <Leaf className="text-[#66c35d]" size={24} fill="currentColor" />
          </h2>
          <p className="mt-1 text-sm font-medium text-[var(--theme-muted-text)]">
            Browse products by daily needs
          </p>
        </div>
        {showViewAll && (
          <Link
            to="/categories"
            className="w-fit rounded-lg border border-[var(--theme-primary)] px-5 py-2.5 text-sm font-bold text-[var(--theme-primary)] transition-colors hover:bg-[var(--theme-primary)] hover:text-white"
          >
            View Categories
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {visibleCategories.map((category) => (
          <Link
            key={category.name}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="group overflow-hidden rounded-2xl border border-[var(--theme-border-color)] bg-white p-3 shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.14)]"
          >
            <div className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-[var(--theme-muted-bg)]">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <Grid2X2 className="text-[var(--theme-primary)]" size={34} />
              )}
            </div>
            <p className="mt-3 line-clamp-1 font-bold text-slate-950">
              {category.name}
            </p>
            <p className="text-sm text-[var(--theme-muted-text)]">
              {category.count} products
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

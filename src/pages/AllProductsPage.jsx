import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AllProducts from "../components/AllProducts";
import { getProducts } from "../services/products";

const AllProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get("category") || "";

  useEffect(() => {
    let ignore = false;

    getProducts()
      .then((res) => {
        if (!ignore) setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        if (!ignore) setProducts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.active === false) return false;
      if (!category) return true;
      return product.category?.toLowerCase() === category.toLowerCase();
    });
  }, [category, products]);

  return (
    <div className="theme-page-bg min-h-screen px-3 pb-10 pt-24 md:px-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-5 text-left">
          <h1 className="text-3xl font-extrabold text-slate-950">
            {category ? `${category} Products` : "All Products"}
          </h1>
          <p className="mt-1 text-[var(--theme-muted-text)]">
            {loading
              ? "Loading products..."
              : `${filteredProducts.length} products available`}
          </p>
        </div>
        {!loading && <AllProducts pageSize={12} initialProducts={filteredProducts} />}
      </div>
    </div>
  );
};

export default AllProductsPage;

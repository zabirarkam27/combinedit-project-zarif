import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { deleteProduct, getProducts } from "../../services/products";
import { downloadCsv } from "../../utils/csv";
import { confirmPopup } from "../../utils/popups";

const AllProductsAdminView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const stockFilter = searchParams.get("stock") || "";
  const viewFilter = searchParams.get("view") || "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getProducts();
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load products.");
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        if (stockFilter === "out" && product?.inStock) return false;

        if (!query) return true;

        return [product?.name, product?.brand, product?.category, product?.volume]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      })
      .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
  }, [products, search, stockFilter]);

  const activeFilterLabel = useMemo(() => {
    if (stockFilter === "out") return "Out of stock products";
    if (viewFilter === "categories") return "Products grouped by category";
    if (viewFilter === "brands") return "Products grouped by brand";
    return "";
  }, [stockFilter, viewFilter]);

  const clearRouteFilters = () => {
    setSearchParams({});
  };

  const exportProductsCsv = () => {
    const exported = downloadCsv(
      "products.csv",
      filteredProducts.map((product) => ({
        Name: product.name || "",
        Brand: product.brand || "",
        Category: product.category || "",
        Volume: product.volume || "",
        Price: product.price ?? "",
        DiscountPrice: product.discountPrice ?? "",
        InStock: product.inStock ? "Yes" : "No",
        Featured: product.featured ? "Yes" : "No",
        Active: product.active === false ? "No" : "Yes",
        Images: Array.isArray(product.images) ? product.images.join(" | ") : "",
      }))
    );

    if (!exported) toast.error("No products available to export.");
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmPopup({
      title: "Delete this product?",
      text: "This product will be removed from your catalog.",
      confirmButtonText: "Delete Product",
    });

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success("Product deleted!");
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      toast.error("Failed to delete product.");
      console.error(err);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="w-full mx-auto p-3 md:p-6 theme-dashboard-bg min-h-screen">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold theme-text">
            All Products
          </h1>
          <p className="text-sm text-gray-600">
            Manage product details, pricing, stock, and catalog visibility.
          </p>
        </div>

        <Link
          to="/dashboard/edit-your-products/add"
          className="btn border-0 text-white theme-gradient theme-gradient-hover"
        >
          Add Product
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {activeFilterLabel && (
            <button
              type="button"
              onClick={clearRouteFilters}
              className="mt-1 text-sm font-medium text-[var(--theme-secondary)] hover:underline"
            >
              {activeFilterLabel} - clear filter
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Search name, brand, category, volume..."
          className="input w-full md:w-96 bg-white border theme-border"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button
          type="button"
          onClick={exportProductsCsv}
          className="btn border-0 text-white theme-gradient theme-gradient-hover"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border theme-border bg-white shadow-sm">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr className="theme-dashboard-bg theme-text">
              <th>#</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Volume</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan="8">
                    <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : filteredProducts.length ? (
              filteredProducts.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td className="min-w-48 font-medium theme-text">
                    {product.name || "Untitled product"}
                  </td>
                  <td>{product.brand || "-"}</td>
                  <td>{product.category || "-"}</td>
                  <td>{product.volume || "-"}</td>
                  <td>BDT {product.price ?? 0}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.inStock ? "badge-success" : "badge-error"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td>
                    <div className="flex min-w-32 gap-2">
                      <Link
                        to={`/dashboard/update-product/${product._id}`}
                        className="btn btn-xs border-0 text-white theme-gradient theme-gradient-hover"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="btn btn-xs btn-error text-white"
                      >
                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-10">
                  <div className="space-y-2">
                    <p className="font-semibold theme-text">
                      No products found.
                    </p>
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="btn btn-sm border-0 text-white theme-gradient theme-gradient-hover"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && products.length === 0 && (
        <div className="mt-5 rounded-lg border theme-border bg-white p-5 text-center">
          <p className="mb-3 theme-text font-semibold">
            Your catalog is empty.
          </p>
          <Link
            to="/dashboard/edit-your-products/add"
            className="btn border-0 text-white theme-gradient theme-gradient-hover"
          >
            Add your first product
          </Link>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AllProductsAdminView;

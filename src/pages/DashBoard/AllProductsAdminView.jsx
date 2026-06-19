import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  AlertTriangle,
  Boxes,
  Download,
  Edit3,
  Layers3,
  PackagePlus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

import { deleteProduct, getProducts } from "../../services/products";
import { downloadCsv } from "../../utils/csv";
import { confirmPopup } from "../../utils/popups";

const getProductImage = (product) => {
  const images = [
    product?.thumbnail,
    product?.image,
    ...(Array.isArray(product?.images) ? product.images : [product?.images]),
  ].filter(Boolean);
  return images[0] || "";
};

const formatCurrency = (value) =>
  `BDT ${Number(value || 0).toLocaleString("en-US")}`;

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

  const catalogStats = useMemo(() => {
    const outOfStock = products.filter((product) => !product?.inStock).length;
    const active = products.filter((product) => product?.active !== false).length;
    const categories = new Set(products.map((product) => product?.category).filter(Boolean)).size;
    return {
      total: products.length,
      active,
      outOfStock,
      categories,
    };
  }, [products]);

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
    <div className="min-h-screen w-full overflow-x-hidden theme-dashboard-bg px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto w-full max-w-7xl space-y-4 md:space-y-5">
        <section className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Product catalog
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                All Products
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                Manage product details, pricing, stock, images, and catalog visibility.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[560px] lg:gap-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Total</p>
                <p className="mt-1 text-xl font-black text-slate-950">{catalogStats.total}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Active</p>
                <p className="mt-1 text-xl font-black text-slate-950">{catalogStats.active}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Categories</p>
                <p className="mt-1 text-xl font-black text-slate-950">{catalogStats.categories}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-700">
                <p className="text-[11px] font-black uppercase">Out Stock</p>
                <p className="mt-1 text-xl font-black">{catalogStats.outOfStock}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-500">
                Showing <span className="text-slate-950">{filteredProducts.length}</span> of{" "}
                <span className="text-slate-950">{products.length}</span> products
              </p>
              {activeFilterLabel && (
                <button
                  type="button"
                  onClick={clearRouteFilters}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black text-[var(--theme-primary)] transition hover:opacity-80"
                >
                  {stockFilter === "out" ? <AlertTriangle size={14} /> : viewFilter === "brands" ? <Sparkles size={14} /> : <Layers3 size={14} />}
                  {activeFilterLabel} - clear
                </button>
              )}
            </div>

            <div className="grid w-full min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto] xl:w-auto">
              <label className="relative block min-w-0 sm:col-span-2 lg:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="text"
                  placeholder="Search name, brand, category, volume..."
                  className="h-11 w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)] lg:w-[min(24rem,42vw)] xl:w-96"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={exportProductsCsv}
                className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 sm:w-auto"
              >
                <Download size={17} />
                Export CSV
              </button>
              <Link
                to="/dashboard/edit-your-products/add"
                className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-[var(--theme-primary)] px-4 text-sm font-black text-white transition hover:opacity-90 sm:w-auto"
              >
                <PackagePlus size={17} />
                Add Product
              </Link>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
          <div className="grid gap-3 p-3 md:hidden">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
              ))
            ) : filteredProducts.length ? (
              filteredProducts.map((product) => {
                const image = getProductImage(product);
                return (
                  <article key={product._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex gap-3">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name || "Product"}
                          className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-slate-100"
                        />
                      ) : (
                        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-slate-400">
                          <Boxes size={20} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-black text-slate-950">{product.name || "Untitled"}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{product.brand || "No brand"} / {product.category || "Uncategorized"}</p>
                        <p className="mt-2 text-sm font-black text-[var(--theme-primary)]">{formatCurrency(product.discountPrice || product.price)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-black ${product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {product.inStock ? "In stock" : "Out of stock"}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/update-product/${product._id}`}
                          className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700"
                          aria-label="Edit product"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-700 disabled:opacity-50"
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <Boxes className="mx-auto text-slate-400" size={30} />
                <p className="mt-3 font-black text-slate-700">No products found.</p>
              </div>
            )}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Brand</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Volume</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan="7" className="px-5 py-4">
                        <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
                      </td>
                    </tr>
                  ))
                ) : filteredProducts.length ? (
                  filteredProducts.map((product) => {
                    const image = getProductImage(product);
                    return (
                      <tr key={product._id} className="transition hover:bg-slate-50/80">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name || "Product"}
                                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-100"
                              />
                            ) : (
                              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                                <Boxes size={20} />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="max-w-[280px] truncate font-black text-slate-950">
                                {product.name || "Untitled product"}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-slate-500">
                                {product.active === false ? "Hidden from catalog" : "Visible in catalog"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-600">
                          {product.brand || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
                            {product.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-600">
                          {product.volume || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-black text-slate-950">{formatCurrency(product.discountPrice || product.price)}</p>
                          {product.discountPrice && product.price && (
                            <p className="mt-1 text-xs font-semibold text-slate-400 line-through">
                              {formatCurrency(product.price)}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${
                              product.inStock
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                : "bg-rose-50 text-rose-700 ring-rose-200"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/dashboard/update-product/${product._id}`}
                              title="Edit product"
                              className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                            >
                              <Edit3 size={16} />
                            </Link>
                            <button
                              type="button"
                              title="Delete product"
                              onClick={() => handleDelete(product._id)}
                              disabled={deletingId === product._id}
                              className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-16 text-center">
                      <div className="mx-auto max-w-sm rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8">
                        <Boxes className="mx-auto text-slate-400" size={34} />
                        <p className="mt-3 font-black text-slate-700">
                          No products found.
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          Try changing search or route filters.
                        </p>
                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="mt-4 inline-flex h-10 items-center rounded-2xl bg-[var(--theme-primary)] px-4 text-xs font-black text-white"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {!loading && products.length === 0 && (
          <section className="rounded-[28px] border border-white/70 bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
            <Boxes className="mx-auto text-slate-400" size={36} />
            <p className="mt-3 font-black text-slate-950">Your catalog is empty.</p>
            <Link
              to="/dashboard/edit-your-products/add"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-4 text-sm font-black text-white transition hover:opacity-90"
            >
              <PackagePlus size={17} />
              Add your first product
            </Link>
          </section>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default AllProductsAdminView;

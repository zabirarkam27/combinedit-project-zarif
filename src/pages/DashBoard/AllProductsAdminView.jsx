import { useEffect, useState, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/products";

const AllProductsAdminView = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts();
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products.");
      console.error(err);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted!");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Failed to delete product.");
      console.error(err);
    }
  };

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        product?.name?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
  }, [products, search]);

  return (
    <div className="w-full mx-auto p-2 md:p-4 bg-[#ebf0f0] shadow-md min-h-screen">
      <h1 className="text-lg md:text-3xl font-bold text-black my-10">
        All Products
      </h1>

      {/* Search Bar */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name..."
          className="input w-full md:w-80 bg-[#ebf0f0] border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm bg-[#ebf0f0]">
          <thead>
            <tr className="bg-[#dce7e7]">
              <th>#</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Volume</th>
              <th>Price</th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length ? (
              filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-[#f7f7f7] transition-colors"
                >
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.volume}</td>
                  <td>৳{product.price}</td>
                  <td>{product.inStock ? "Yes" : "No"}</td>
                  <td className="flex gap-2">
                    <Link to={`/dashboard/update-product/${product._id}`}>
                      <img
                        src="/edit-icon.png"
                        alt="edit icon"
                        className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                      />
                    </Link>
                    <img
                      src="/delete-icon.png"
                      alt="delete icon"
                      onClick={() => handleDelete(product._id)}
                      className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AllProductsAdminView;

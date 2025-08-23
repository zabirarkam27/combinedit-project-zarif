import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/products"; 
const AllProductsAdminView = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      const data = Array.isArray(res.data) ? res.data : [];
      if (!Array.isArray(res.data)) {
        console.warn("API did not return an array:", res.data);
      }
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products.");
      console.error(err);
      setProducts([]); // fallback
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted!");
      fetchProducts(); // Refresh
    } catch (err) {
      toast.error("Failed to delete product.");
      console.error(err);
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products
        .filter(
          (product) =>
            product?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
            false
        )
        .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
    : [];

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 bg-[#e6e6d7] rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center mb-4 text-primary">
        All Products
      </h2>

      {/* Search Bar */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name..."
          className="input w-full md:w-80 bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr className="bg-[#d6d6c7]">
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
                  key={product._id || product.id}
                  className="hover:bg-[#f7f7e7]"
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
                        className="w-5 h-5 cursor-pointer hover:scale-110 transition"
                      />
                    </Link>
                    <img
                      src="/delete-icon.png"
                      alt="delete icon"
                      onClick={() => handleDelete(product._id)}
                      className="w-5 h-4 cursor-pointer hover:scale-110 transition"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
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

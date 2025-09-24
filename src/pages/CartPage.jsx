import { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import useOrderForm from "../hooks/useOrderForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrderDrawer from "../components/OrderDrawer";
import { createOrder } from "../services/orders";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const orderFormHook = useOrderForm();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Total price calculation memoized
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    const orderPayload = {
      name: orderFormHook.orderInfo.name,
      phone: orderFormHook.orderInfo.phone,
      address: orderFormHook.orderInfo.address,
      note: orderFormHook.orderInfo.note,
      items: cartItems.map((item) => ({
        productId: item._id || item.id,
        productName: item.name,
        unitPrice: item.price,
        quantity: item.quantity,
        finalPrice: item.price * item.quantity,
        images: Array.isArray(item.images) ? item.images : [item.images],
        status: "pending",
      })),
      grandTotal: totalPrice,
      createdAt: new Date().toISOString(),
    };

    try {
      await createOrder(orderPayload); // API call
      clearCart();
      setIsOpen(false);
      toast.success("✅ Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("❌ Failed to place order. Try again!");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#ff8d13]/65 to-[#fc4706]/65 py-6 min-h-screen">
      <div
        className={`max-w-4xl mx-auto p-6 min-h-screen mb-16 md:mb-0 md:mt-16 bg-gradient-to-b from-[#ff8d13]/65 to-[#fc4706]/65 pt-6 rounded-xl shadow-md`}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          🛒 Added Items
        </h2>

        <div className="space-y-4">
          {cartItems.map((item) => {
            const itemId = item._id || item.id;
            const itemTotal = item.price * item.quantity; // no hook here

            return (
              <div
                key={itemId}
                className="flex items-center justify-between bg-white/55 p-3 rounded shadow"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      Array.isArray(item.images) ? item.images[0] : item.images
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Price: BDT {item.price}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(itemId, Math.max(item.quantity - 1, 1))
                        }
                        className="px-2 py-1 bg-gray-50 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(itemId, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-50 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="font-bold">BDT {itemTotal}</p>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to remove "${item.name}" from the cart?`
                        )
                      ) {
                        removeFromCart(itemId);
                        toast.info(`🗑️ ${item.name} removed from cart`);
                      }
                    }}
                    className="text-red-700 mt-2 cursor-pointer font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Total & Checkout */}
          <div className="text-right mt-6">
            <h3 className="text-xl text-white font-bold">
              Total: BDT {totalPrice}
            </h3>
            <button
              className={`btn text-center text-white font-semibold px-4 py-3 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right border-0 w-full mt-6 shadow-none`}
              onClick={() => setIsOpen(true)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>

        {/* Order Drawer */}
        <OrderDrawer
          selectedProduct={null}
          isOpen={isOpen}
          quantity={1}
          grandTotal={totalPrice}
          productTotal={totalPrice}
          closeDrawer={() => setIsOpen(false)}
          increaseQuantity={() => {}}
          decreaseQuantity={() => {}}
          handleOrderChange={orderFormHook.handleOrderChange}
          handleSubmit={handleCheckoutSubmit}
          orderInfo={orderFormHook.orderInfo}
        />
      </div>
    </div>
  );
};

export default CartPage;

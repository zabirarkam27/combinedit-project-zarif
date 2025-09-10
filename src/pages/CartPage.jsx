import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import design from "../styles/design";
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

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

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
      await createOrder(orderPayload); // ✅ call API from orders.js
      clearCart();
      setIsOpen(false);
      toast.success("✅ Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("❌ Failed to place order. Try again!");
    }
  };

  return (
    <div
      className={
        design.colors.primaryGradient +
        " max-w-4xl mx-auto p-6 min-h-screen rounded-xl mb-16 md:mt-16 shadow-md"
      }
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        🛒 Added Items
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => {
            const itemId = item._id || item.id;
            return (
              <div
                key={itemId}
                className="flex items-center justify-between bg-white p-3 rounded shadow"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.images}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Price: BDT {item.price}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(itemId, Math.max(item.quantity - 1, 1))
                        }
                        className="px-2 py-1 bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(itemId, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-bold">BDT {item.price * item.quantity}</p>
                  <button
                    onClick={() => {
                      const confirmRemove = window.confirm(
                        `Are you sure you want to remove "${item.name}" from the cart?`
                      );
                      if (confirmRemove) {
                        removeFromCart(itemId);
                        toast.info(`🗑️ ${item.name} removed from cart`);
                      }
                    }}
                    className="text-red-500 mt-2 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Total & Checkout */}
          <div className="text-right mt-6">
            <h3 className="text-xl font-bold">Total: BDT {totalPrice}</h3>
            <button
              className={`${design.buttons} mt-3`}
              onClick={() => setIsOpen(true)}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

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
  );
};

export default CartPage;

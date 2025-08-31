import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import design from "../styles/design";
import useOrderForm from "../hooks/useOrderForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { orderInfo, handleOrderChange, handleOrderSubmit } = useOrderForm();

  // Checkout Submit Handler
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const orderPayload = {
      name: orderInfo.name,
      phone: orderInfo.phone,
      address: orderInfo.address,
      note: orderInfo.note,
      items: cartItems.map((item) => ({
        productId: item._id || item.id,
        productName: item.name,
        unitPrice: item.price,
        quantity: item.quantity,
        finalPrice: item.price * item.quantity,
        images: Array.isArray(item.images) ? item.images : [item.images], // ✅ images পাঠানো হলো
        status: "pending",
      })),
      grandTotal: totalPrice,
      createdAt: new Date().toISOString(), // ✅ order date/time পাঠানো হলো
    };


    try {
      handleOrderSubmit(e, orderPayload);
      clearCart();
      setCheckoutOpen(false);
      toast.success("✅ Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
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

          {/* Total */}
          <div className="text-right mt-6">
            <h3 className="text-xl font-bold">Total: BDT {totalPrice}</h3>
            <label
              htmlFor="checkout-drawer"
              className={`${design.buttons} mt-3 cursor-pointer`}
              onClick={() => setCheckoutOpen(true)}
            >
              Checkout
            </label>
          </div>
        </div>
      )}

      {/* Drawer for Checkout */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setCheckoutOpen(false)}
          ></div>

          <div className="flex flex-col gap-4 p-4 w-72 sm:w-96 min-h-full bg-[#ccccb7] text-base-content shadow-lg">
            <h3 className="text-lg font-bold text-center">Checkout</h3>
            <p className="text-center text-sm text-gray-700">
              Total Payable: <span className="font-bold">BDT {totalPrice}</span>
            </p>

            {/* Order Form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={orderInfo.name}
                onChange={handleOrderChange}
                className={design.inputs}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={orderInfo.phone}
                onChange={handleOrderChange}
                className={design.inputs}
                required
              />
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={orderInfo.address}
                onChange={handleOrderChange}
                className={design.inputs}
                rows="3"
                required
              />
              <textarea
                name="note"
                placeholder="Note"
                value={orderInfo.note}
                onChange={handleOrderChange}
                className={design.inputs}
                rows="3"
              />
              <button type="submit" className={`${design.buttons} w-full`}>
                Confirm Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

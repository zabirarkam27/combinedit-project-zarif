import React, { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import useOrderForm from "../hooks/useOrderForm";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

import OrderDrawer from "../components/OrderDrawer";
import { createOrder } from "../services/orders";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const orderFormHook = useOrderForm();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      await createOrder(orderPayload);
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

  const handleRemoveItem = (item) => {
    Swal.fire({
      title: `Remove "${item.name}" from cart?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(item._id || item.id);
        toast.info(`🗑️ ${item.name} removed from cart`);
      }
    });
  };

  return (
    <div className="bg-[#a8e2dd] py-6 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-[#8cdad2] pt-6 rounded-xl shadow-md mb-16 md:mb-0 md:mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Added Items</h2>

        <div className="space-y-4">
          {cartItems.map((item) => {
            const itemId = item._id || item.id;
            const itemTotal = item.price * item.quantity;

            return (
              <div
                key={itemId}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.images?.[0] || item.image || item.thumbnail}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border border-[#009e8e]"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Price: BDT {item.price}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        onClick={() => updateQuantity(itemId, Math.max(item.quantity - 1, 1))}
                        className="bg-gradient-to-r from-gray-800 to-gray-500 bg-[length:200%_100%] hover:bg-right transition-all duration-500 ease-in-out px-2 py-0.5 rounded font-semibold text-white"
                      >
                        -
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        className="px-2 py-0.5 rounded font-semibold text-white bg-gradient-to-l from-[#009e8e] to-[#00bfa5] bg-[length:200%_100%] hover:bg-right transition-all duration-500 ease-in-out"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end md:pr-4">
                  <p className="font-bold">BDT {itemTotal}</p>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-red-700 mt-2 cursor-pointer text-md font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="text-right mt-6">
            <h3 className="text-xl pr-2 md:pr-6 font-bold">Total: BDT {totalPrice}</h3>
            <button
              className="btn text-center text-white font-semibold px-4 py-3 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right border-0 w-full mt-6 shadow-none"
              onClick={() => setIsOpen(true)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>

        <OrderDrawer
          cartItems={cartItems}
          selectedProduct={null}
          isOpen={isOpen}
          quantity={1}
          grandTotal={totalPrice}
          productTotal={totalPrice}
          closeDrawer={() => setIsOpen(false)}
          increaseQuantity={(id) => updateQuantity(id, cartItems.find(i => i._id === id || i.id === id).quantity + 1)}
          decreaseQuantity={(id) => updateQuantity(id, Math.max(cartItems.find(i => i._id === id || i.id === id).quantity - 1, 1))}
          handleOrderChange={orderFormHook.handleOrderChange}
          handleSubmit={handleCheckoutSubmit}
          orderInfo={orderFormHook.orderInfo}
        />
      </div>
    </div>
  );
};

export default CartPage;

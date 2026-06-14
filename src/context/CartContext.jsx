import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, amount = 1) => {
    const safeAmount = Math.max(1, Number(amount) || 1);

    setCartItems((prev) => {
      const productId = product._id || product.id;
      const productKey =
        product.cartKey ||
        `${productId}-${product.selectedOptions?.size || ""}-${product.selectedOptions?.color || ""}-${product.selectedOptions?.image || ""}`;
      const existing = prev.find((item) => (item.cartKey || item._id || item.id) === productKey);

      if (existing) {
        return prev.map((item) =>
          (item.cartKey || item._id || item.id) === productKey
            ? { ...item, quantity: item.quantity + safeAmount }
            : item
        );
      }

      return [...prev, { ...product, cartKey: productKey, quantity: safeAmount }];
    });
  };
  const clearCart = () => setCartItems([]);


  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => (item.cartKey || item._id || item.id) !== id));
  };

  // Update quantity
  const updateQuantity = (id, qty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        (item.cartKey || item._id || item.id) === id ? { ...item, quantity: qty } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

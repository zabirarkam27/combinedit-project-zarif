import { createContext, useContext } from "react";

const OrdersContext = createContext();

export const useOrdersContext = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrdersContext must be used within an OrdersProvider");
  }
  return context;
};

export default OrdersContext;

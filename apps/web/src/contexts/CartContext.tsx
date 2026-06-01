import {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { getCart } from "@/api/cart";
import type { CartItem, CartResponse } from "@/features/cart/types";

type CartContextValue = {
  cartCount: number;
  setCartCount: (count: number | ((prev: number) => number)) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    getCart()
      .then((data: CartResponse) => {
        const count = data.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
        setCartCount(count);
      })
      .catch(() => {
        setCartCount(0);
      });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({ cartCount, setCartCount }),
    [cartCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return ctx;
}

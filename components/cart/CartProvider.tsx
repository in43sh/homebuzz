"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Product } from "@/lib/types";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number; // snapshot at add-time
  unit: string;
  image: string;
  quantity: number;
};

type State = { items: CartItem[] };

type Action =
  | { type: "add"; product: Product; quantity: number }
  | { type: "setQty"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" }
  | { type: "hydrate"; state: State };

const STORAGE_KEY = "homebuzz.cart.v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.items.find(
        (i) => i.productId === action.product.id,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i,
          ),
        };
      }
      const p = action.product;
      return {
        items: [
          ...state.items,
          {
            productId: p.id,
            slug: p.slug,
            title: p.title,
            price: p.price,
            unit: p.unit,
            image: p.image,
            quantity: action.quantity,
          },
        ],
      };
    }
    case "setQty":
      return {
        items: state.items
          .map((i) =>
            i.productId === action.productId
              ? { ...i, quantity: Math.max(1, action.quantity) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case "remove":
      return { items: state.items.filter((i) => i.productId !== action.productId) };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) as State });
    } catch {
      // ignore malformed storage
    }
  }, []);

  // persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
    return {
      items: state.items,
      count,
      subtotal,
      add: (product, quantity = 1) =>
        dispatch({ type: "add", product, quantity }),
      setQty: (productId, quantity) =>
        dispatch({ type: "setQty", productId, quantity }),
      remove: (productId) => dispatch({ type: "remove", productId }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

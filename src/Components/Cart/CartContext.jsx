/**
 * CartContext.jsx — Global Shopping Cart State
 * Persists cart to localStorage, supports multi-item, quantities,
 * discount codes, and access-type selection per product.
 */
import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const CART_STORAGE_KEY = "siddiqui_cart_v1";

/* ── Initial State ────────────────────────────────────────────── */
const initialState = {
  items: [],          // [{ id, productId, title, price, currency, coverImage, accessType, accessLabel, quantity, slug }]
  discountCode: "",
  discountData: null, // { code, type, value, description } — fetched from backend
  isOpen: false,
};

/* ── Helpers ──────────────────────────────────────────────────── */
function cartItemKey(productId, accessType) {
  return `${productId}__${accessType || "download"}`;
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          ...initialState,
          ...parsed,
          items: Array.isArray(parsed.items) ? parsed.items.filter(Boolean) : [],
        };
      }
    }
  } catch {}
  return initialState;
}

function saveCart(state) {
  try {
    // Only persist items + discount, not drawer open state
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      items: state.items,
      discountCode: state.discountCode,
      discountData: state.discountData,
      isOpen: false,
    }));
  } catch {}
}

/* ── Reducer ──────────────────────────────────────────────────── */
function cartReducer(state, action) {
  switch (action.type) {

    case "ADD_ITEM": {
      const { item } = action;
      const key = cartItemKey(item.productId, item.accessType);
      const existing = state.items.find(i => i.id === key);
      if (existing) {
        // Already in cart — just open drawer
        return { ...state, isOpen: true };
      }
      return {
        ...state,
        items: [...state.items, { ...item, id: key, quantity: 1 }],
        isOpen: true,
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id),
      };
    }

    case "UPDATE_QTY": {
      // Digital products: quantity is always 1 (one license per purchase)
      // But we allow the UI to reflect this gracefully
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: Math.max(1, action.qty) } : i
        ),
      };
    }

    case "CLEAR_CART": {
      return { ...state, items: [], discountCode: "", discountData: null };
    }

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "SET_DISCOUNT_CODE":
      return { ...state, discountCode: action.code };

    case "SET_DISCOUNT_DATA":
      return { ...state, discountData: action.data };

    case "CLEAR_DISCOUNT":
      return { ...state, discountCode: "", discountData: null };

    default:
      return state;
  }
}

/* ── Context ──────────────────────────────────────────────────── */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, () => {
    const saved = loadCart();
    return { ...initialState, ...saved, isOpen: false };
  });

  // Persist on change
  useEffect(() => {
    saveCart(state);
  }, [state]);

  /* Derived values */
  const safeItems = Array.isArray(state?.items) ? state.items : [];
  const itemCount = safeItems.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);

  const subtotal = safeItems.reduce((sum, i) => {
    return sum + (Number(i.price) || 0) * (Number(i.quantity) || 1);
  }, 0);

  const discountAmount = (() => {
    if (!state.discountData) return 0;
    const { type, value } = state.discountData;
    if (type === "percentage") return Math.min(subtotal, (subtotal * value) / 100);
    if (type === "fixed") return Math.min(subtotal, value);
    return 0;
  })();

  const total = Math.max(0, subtotal - discountAmount);
  const currency = safeItems[0]?.currency || "AED";

  /* Actions */
  const addItem = useCallback((item) => dispatch({ type: "ADD_ITEM", item }), []);
  const removeItem = useCallback((id) => dispatch({ type: "REMOVE_ITEM", id }), []);
  const updateQty = useCallback((id, qty) => dispatch({ type: "UPDATE_QTY", id, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);
  const setDiscountCode = useCallback((code) => dispatch({ type: "SET_DISCOUNT_CODE", code }), []);
  const setDiscountData = useCallback((data) => dispatch({ type: "SET_DISCOUNT_DATA", data }), []);
  const clearDiscount = useCallback(() => dispatch({ type: "CLEAR_DISCOUNT" }), []);

  return (
    <CartContext.Provider value={{
      items: safeItems,
      discountCode: state.discountCode || "",
      discountData: state.discountData || null,
      isOpen: Boolean(state.isOpen),
      itemCount,
      subtotal,
      discountAmount,
      total,
      currency,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      setDiscountCode,
      setDiscountData,
      clearDiscount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

const defaultCartContext = {
  items: [],
  discountCode: "",
  discountData: null,
  isOpen: false,
  itemCount: 0,
  subtotal: 0,
  discountAmount: 0,
  total: 0,
  currency: "AED",
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  setDiscountCode: () => {},
  setDiscountData: () => {},
  clearDiscount: () => {},
};

export function useCart() {
  const ctx = useContext(CartContext);
  return ctx || defaultCartContext;
}

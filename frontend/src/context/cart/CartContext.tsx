import { createContext } from "react";
import type { Cart_Item, LocalSummary } from "@client/types";

export interface CartContextType {
  cartItems: Cart_Item[];
  localSummary: LocalSummary[];
  total: number;
  cartCount: number;
  loading: boolean;
  updatingIds: Set<string>;
  fetchServerCart: () => Promise<void>;
  loadLocalSummary: () => void;
  hydrateLocalCartDetails: () => Promise<void>;
  addToCart: (item: Cart_Item) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  updateVariant: (id: string, variantId: string, size: string, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  removeAllItems: () => Promise<void>;
  mergeLocalCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

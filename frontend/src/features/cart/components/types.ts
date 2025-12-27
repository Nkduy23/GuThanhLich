import type { Cart_Item } from "@/features/types";

export interface Voucher {
  _id: string;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  minTotal: number;
  description?: string;
  discountAmount?: number;
}

export interface CartTotalProps {
  total: number;
  onCheckout: () => void;
  isAuthenticated?: boolean;
}

export interface CartRowProps {
  item: Cart_Item;
  onRemove: (_id: string) => void;
  onQuantityChange: (_id: string, quantity: number) => void;
  onVariantChange: (_id: string, variantId: string, size: string, quantity?: number) => void;
}

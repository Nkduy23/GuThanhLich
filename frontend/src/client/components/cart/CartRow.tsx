import type { Cart_Item } from "../../../types";

interface CartRowProps {
  item: Cart_Item;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const CartRow: React.FC<CartRowProps> = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-600">{item.price.toLocaleString("vi-VN")} VNĐ</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={item.quantity}
          onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <button onClick={() => onRemove(item.id)} className="text-red-600 hover:text-red-800">
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CartRow;

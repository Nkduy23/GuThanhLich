interface CartTotalProps {
  total: number;
  onCheckout: () => void;
}

const CartTotal: React.FC<CartTotalProps> = ({ total, onCheckout }) => {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Tổng Giỏ Hàng</h3>
      <p className="text-lg">
        Tổng cộng: <span className="font-bold">{total.toLocaleString("vi-VN")} VNĐ</span>
      </p>
      <button onClick={onCheckout} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
        Thanh toán
      </button>
    </div>
  );
};

export default CartTotal;

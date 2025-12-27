import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
const Button = ({ children, className = "", ...props }: any) => (
  <button {...props} className={`transition font-medium ${className}`}>
    {children}
  </button>
);

const Thanks = () => {
  // Giả sử dữ liệu đơn hàng có thể lấy từ props, context hoặc query param
  const orderInfo = {
    id: "ORD123456",
    paymentMethod: "VNPay",
    total: 420000,
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-6">
      {/* Hiệu ứng xuất hiện mượt */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center"
      >
        <CheckCircle className="text-green-500 mx-auto mb-4" size={72} />

        <h1 className="text-2xl font-bold mb-2 text-gray-800">Cảm ơn bạn đã đặt hàng! 🎉</h1>

        <p className="text-gray-600 mb-6">
          Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ gửi thông tin vận chuyển sớm nhất có thể.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
          <p className="text-gray-700">
            <span className="font-medium">Mã đơn hàng:</span> {orderInfo.id}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Thanh toán:</span> {orderInfo.paymentMethod}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Tổng cộng:</span>{" "}
            {orderInfo.total.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            className="px-6 py-2 rounded-xl text-white bg-green-600 hover:bg-green-700"
            onClick={() => (window.location.href = "/")}
          >
            Quay về trang chủ
          </Button>

          <Button
            variant="outline"
            className="px-6 py-2 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => (window.location.href = "/profile")}
          >
            Xem đơn hàng
          </Button>
        </div>
      </motion.div>
    </main>
  );
};

export default Thanks;

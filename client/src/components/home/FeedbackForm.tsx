import { useState } from "react";

const FeedbackForm: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Cảm ơn bạn đã đóng góp ý kiến!"); // sau này đổi thành gọi API
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mt-16 mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">GuThanhLich Nhận Ý Kiến Từ Khách Hàng</h2>
      <form onSubmit={handleSubmit} className="rounded-lg p-6 space-y-4">
        <input type="text" name="name" placeholder="Họ và tên" required className="w-full border border-gray-400 rounded-lg px-4 py-2" />
        <input type="email" name="email" placeholder="Email" required className="w-full border border-gray-400  rounded-lg px-4 py-2" />
        <textarea
          name="content"
          placeholder="Nội dung góp ý"
          required
          className="w-full border border-gray-400  rounded-lg px-4 py-2 h-32"
        ></textarea>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Gửi ý kiến
        </button>
      </form>
      {message && <p className="text-green-600 text-center mt-4 font-medium">{message}</p>}
    </div>
  );
};

export default FeedbackForm;

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
        <img className="w-60" src={"/icons/not-found-error-alert-svgrepo-com.svg"} alt="" />
        <p className="text-lg text-gray-600 mb-6">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đang được phát triển.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;

interface ViewMoreButtonProps {
  categorySlug: string;
}

const ViewMoreButton: React.FC<ViewMoreButtonProps> = ({ categorySlug }) => {
  return (
    <div className="text-center mt-8">
      <button
        type="button"
        className="px-6 py-2 bg-gray-300 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        onClick={() => (window.location.href = `/category/${categorySlug}`)}
      >
        Xem thêm
      </button>
    </div>
  );
};

export default ViewMoreButton;

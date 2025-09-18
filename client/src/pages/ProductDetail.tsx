import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  categoryId: { name: string };
}

interface Review {
  _id: string;
  user: string;
  rate: number;
  comment: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const formatCurrency = (price: number) => `${price.toLocaleString("vi-VN")} VNĐ`; // Giả sử helper

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setReviews(data.reviews || []);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto">
      <p>Danh mục: {product.categoryId.name}</p>
      <img src={product.image} alt={product.name} className="w-full max-h-96" />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="mt-2 text-gray-700">Giá: {formatCurrency(product.price)}</p>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Mua ngay</button>
      <h2 className="mt-6 text-xl font-semibold">Đánh giá</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review._id} className="border p-2 mb-2">
            <strong>{review.user}</strong> - {review.rate} sao
            <p>{review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetail;

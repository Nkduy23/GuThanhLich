import CardProduct from "../components/CardProduct";
import { useEffect, useState } from "react";
import type { Product } from "../types";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="category mb-12 mx-auto max-w-6xl px-4 container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold uppercase mb-2 mt-8">Sản Phẩm Khuyến Mãi</h2>
          <p className="text-gray-600">"Nền Tảng Phong Cách, Chất Lượng Vượt Thời Gian"</p>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <CardProduct key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Xem thêm
            </button>
          </div>
        </div>
      </div>
      <div className="category mb-12 mx-auto max-w-6xl px-4 container">
        <div className="text-left mb-8">
          <h2 className="text-3xl font-semibold uppercase mb-2">Trạm 1 | Thời Trang Thiết Yếu</h2>
          <p className="text-gray-600">"Nền Tảng Phong Cách, Chất Lượng Vượt Thời Gian"</p>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <CardProduct key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

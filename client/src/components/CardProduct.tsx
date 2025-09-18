import { formatCurrency } from "../utils/formatCurrency";
import type { Product } from "../types";

interface CardProductProps {
  product: Product;
}

const CardProduct: React.FC<CardProductProps> = ({ product }) => {
  return (
    <a href={`/products/${product._id}`}>
      <div className="max-w-sm rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
        <img className="w-full max-h-80" src={product.image} alt={product.name} />
        <div className="p-4">
          <h3 className="text-base text-gray-800 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 mt-1">Giá: {formatCurrency(product.price)}</p>
          <button className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg transition duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg">Mua ngay</button>
        </div>
      </div>
    </a>
  );
};

export default CardProduct;

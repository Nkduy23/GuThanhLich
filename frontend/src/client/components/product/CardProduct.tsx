import { formatCurrency } from "../../../utils/formatCurrency";
import { Link } from "react-router-dom";
import type { Product } from "../../../types";

interface CardProductProps {
  product: Product;
}

const CardProduct: React.FC<CardProductProps> = ({ product }) => {
  const discountedPrice =
    product.sale && product.sale > 0 ? product.price - (product.price * product.sale) / 100 : null;

  return (
    <Link to={`/products/${product.slug}`}>
      <div className="relative max-w-sm rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
        <img
          className="w-full max-h-80 object-cover"
          src={product.defaultVariantId?.images?.[0] || product.image}
          alt={product.name}
        />

        <div className="p-4">
          <h3 className="text-base text-gray-800 line-clamp-2">
            {product.name} - {product.defaultVariantId?.colorNameVi}
          </h3>

          {discountedPrice ? (
            <div className="flex gap-4 mt-1">
              <p className="text-red-600 font-semibold">{formatCurrency(discountedPrice)}</p>
              <p className="text-gray-500 line-through text-sm">{formatCurrency(product.price)}</p>
              <span className="absolute top-4 right-4 ml-2 text-white bg-red-600 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                -{product.sale}%
              </span>
            </div>
          ) : (
            <p className="text-gray-600 mt-1">Giá: {formatCurrency(product.price)}</p>
          )}

          {product.is_new && (
            <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg">
              MỚI
            </span>
          )}

          {/* <button className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg transition duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg">
            Mua ngay
          </button> */}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;

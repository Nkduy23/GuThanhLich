// src/components/layout/HeaderLogo.tsx
import { Link } from "react-router-dom";

const HeaderLogo = () => (
  <Link
    to="/"
    className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
  >
    GuThanhLich
  </Link>
);

export default HeaderLogo;

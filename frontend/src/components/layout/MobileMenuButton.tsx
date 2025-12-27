// src/components/layout/MobileMenuButton.tsx
import { Menu } from "lucide-react";

type Props = {
  onClick: () => void;
};

const MobileMenuButton = ({ onClick }: Props) => (
  <button
    onClick={onClick}
    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
    aria-label="Mở menu"
  >
    <Menu className="w-6 h-6" />
  </button>
);

export default MobileMenuButton;

import { useState } from "react";
import { User, MapPin, Package, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfileMenu: React.FC = () => {
  const [active, setActive] = useState("info");
  const { logout } = useAuth();

  const menuItems = [
    { key: "info", label: "Thông tin", icon: <User size={18} /> },
    { key: "address", label: "Địa chỉ", icon: <MapPin size={18} /> },
    { key: "orders", label: "Đơn hàng", icon: <Package size={18} /> },
    { key: "settings", label: "Cài đặt", icon: <Settings size={18} /> },
    { key: "logout", label: "Đăng xuất", icon: <LogOut size={18} /> },
  ];

  const handleClick = (key: string) => {
    if (key === "logout") {
      logout();
    } else {
      setActive(key);
    }
  };

  return (
    <nav className="w-64 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Menu Cá Nhân</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => handleClick(item.key)}
              type="button"
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition 
              ${
                active === item.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ProfileMenu;

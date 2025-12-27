import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User, User_Address, Order } from "@/features/types";
import ProfileMenu from "@/features/profile/components/ProfileMenu";
import ProfileInfo from "@/features/profile/components/ProfileInfo";
import OrdersTab from "@/features/profile/components/OrdersTab";
import AddressTab from "@/features/profile/components/AddressTab";
import SettingsTab from "@/features/profile/components/SettingsTab";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<User_Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setAddresses(data.addresses || []);
        } else {
          setError(data.message || "Lỗi tải thông tin");
        }
      } catch (error) {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Lỗi tải đơn hàng");
      }
    } catch (error) {
      setError("Lỗi kết nối server");
    } finally {
      setOrdersLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <ProfileInfo
            user={user}
            onUpdateUser={(updatedUser) => setUser(updatedUser)} // Pass callback if needed
          />
        );
      case "address":
        return (
          <AddressTab
            addresses={addresses}
            onAddAddress={() => navigate("/add-address")}
            onUpdateAddresses={(updatedAddresses) => setAddresses(updatedAddresses)}
          />
        );
      case "orders":
        return <OrdersTab orders={orders} loading={ordersLoading} />;
      case "settings":
        return <SettingsTab />;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <ProfileMenu activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;

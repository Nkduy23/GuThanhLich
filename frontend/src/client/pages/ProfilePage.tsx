import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User, User_Address } from "../../types";
import ProfileMenu from "../components/profile/ProfileMenu";
import ProfileInfo from "../components/profile/ProfileInfo";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<User_Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setAddresses(data.addresses || []);
        } else {
          setError(data.message || "Lỗi tải thông tin");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <ProfileMenu />
        <div className="flex-1">
          <ProfileInfo
            user={user}
            addresses={addresses}
            onAddAddress={() => navigate("/add-address")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// components/profile/ProfileInfo.tsx (updated - remove addresses, add update callback)
import { useState } from "react";
import type { User } from "@/features/types";

interface ProfileInfoProps {
  user: User | null;
  onUpdateUser?: (user: User) => void; // Callback for update
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        onUpdateUser?.(data.user); // Update parent state
        setIsEditing(false);
      } else {
        alert(data.message || "Lỗi cập nhật");
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Thông tin cá nhân</h2>
        <button
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Hủy" : "Sửa"}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Tên:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{user.name}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{user.email}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Số điện thoại:</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{user.phone}</p>
          )}
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            Lưu thay đổi
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;

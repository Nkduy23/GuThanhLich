import { useState } from "react";
import type { User, User_Address } from "../../types";

interface ProfileInfoProps {
  user: User | null;
  addresses: User_Address[];
  onAddAddress: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, addresses, onAddAddress }) => {
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

  const handleSave = () => {
    // TODO: call API để lưu thông tin
    console.log("Saving user info:", formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Thông tin cá nhân</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Hủy" : "Sửa"}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Tên:</label>
          {isEditing ? <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /> : <p className="text-gray-800">{user.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email:</label>
          {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /> : <p className="text-gray-800">{user.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Số điện thoại:</label>
          {isEditing ? <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /> : <p className="text-gray-800">{user.phone}</p>}
        </div>

        {isEditing && (
          <button onClick={handleSave} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
            Lưu thay đổi
          </button>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Địa chỉ</h3>
        {addresses.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {addresses.map((address) => (
              <li key={address._id}>
                {address.address}, {address.city}, {address.country}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có địa chỉ nào.</p>
        )}
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300" onClick={onAddAddress}>
          Thêm địa chỉ mới
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;

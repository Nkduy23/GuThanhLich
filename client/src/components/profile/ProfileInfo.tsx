import type { User, User_Address } from "../../types";

interface ProfileInfoProps {
  user: User | null;
  addresses: User_Address[];
  onAddAddress: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, addresses, onAddAddress }) => {
  if (!user) return null;

  return (
    <div className="p-6">
      <div className="space-y-4">
        <p>
          <strong>Tên:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {user.phone}
        </p>
        <h3 className="text-xl font-semibold mt-6">Địa chỉ</h3>
        {addresses.length > 0 ? (
          <ul className="list-disc pl-5">
            {addresses.map((address) => (
              <li key={address._id} className="mt-2">
                {address.address}, {address.city}, {address.country}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có địa chỉ nào.</p>
        )}
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300" onClick={onAddAddress}>
          Thêm địa chỉ mới
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;

// components/profile/AddressTab.tsx (new - split from ProfileInfo)
import { useState } from "react";
import type { User_Address } from "@/features/types";

interface AddressTabProps {
  addresses: User_Address[];
  onAddAddress: () => void;
  onUpdateAddresses?: (addresses: User_Address[]) => void;
}

const AddressTab: React.FC<AddressTabProps> = ({ addresses, onAddAddress, onUpdateAddresses }) => {
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<User_Address | null>(null);

  const handleEdit = (address: User_Address) => {
    setEditingAddressId(address._id);
    setEditingForm({ ...address });
  };

  const handleSaveEdit = async () => {
    if (!editingForm) return;
    try {
      const response = await fetch(`http://localhost:3000/api/user/addresses/${editingForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingForm),
      });
      const data = await response.json();
      if (response.ok) {
        onUpdateAddresses?.(data.addresses); // Refresh list
        setEditingAddressId(null);
        setEditingForm(null);
      } else {
        alert(data.message || "Lỗi cập nhật địa chỉ");
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/user/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        onUpdateAddresses?.(data.addresses);
      } else {
        alert(data.message || "Lỗi xóa địa chỉ");
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingForm) {
      setEditingForm({ ...editingForm, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Địa chỉ của bạn</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          onClick={onAddAddress}
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-500">Chưa có địa chỉ nào.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address._id} className="border border-gray-300 rounded-md p-4">
              {editingAddressId === address._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="address"
                    value={editingForm?.address || ""}
                    onChange={handleChange}
                    placeholder="Địa chỉ"
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <input
                    type="text"
                    name="city"
                    value={editingForm?.city || ""}
                    onChange={handleChange}
                    placeholder="Thành phố"
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <input
                    type="text"
                    name="country"
                    value={editingForm?.country || ""}
                    onChange={handleChange}
                    placeholder="Quốc gia"
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setEditingAddressId(null);
                        setEditingForm(null);
                      }}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium">{address.address}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.country}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressTab;

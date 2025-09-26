const ProfileMenu: React.FC = () => {
  return (
    <nav className="w-64 p-4 bg-gray-100 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-bold mb-6">Menu Cá Nhân</h2>
      <ul className="space-y-4">
        <li>
          <button className="w-full text-left text-blue-600 hover:bg-blue-100 p-2 rounded transition duration-200">Thông tin</button>
        </li>
        <li>
          <button className="w-full text-left text-blue-600 hover:bg-blue-100 p-2 rounded transition duration-200">Địa chỉ</button>
        </li>
        <li>
          <button className="w-full text-left text-blue-600 hover:bg-blue-100 p-2 rounded transition duration-200">Đơn hàng</button>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileMenu;

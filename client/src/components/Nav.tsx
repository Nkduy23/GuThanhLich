const Navigation = () => {
  return (
    <nav className="relative hidden md:flex space-x-6 p-4">
      {/* Khuyến Mãi */}
      <div className="relative group">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors uppercase font-medium">
          Khuyến Mãi
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="currentColor" />
          </svg>
        </a>

        {/* Menu cấp 1 */}
        <div className="absolute left-0 top-full hidden w-48 rounded-lg bg-white text-black shadow-lg border group-hover:block z-20">
          {/* Sale Đồng Giá có submenu */}
          <div className="group/sub">
            <a href="#" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
              Sale Đồng Giá
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* Submenu của Sale Đồng Giá */}
            <div className="absolute left-full top-0 hidden w-40 rounded-lg bg-white text-black shadow-lg border group-hover/sub:block z-30">
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Đồng Giá 99K
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Đồng Giá 159K
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Đồng Giá 259K
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Đồng Giá 359K
              </a>
            </div>
          </div>

          {/* Flash Sale có submenu */}
          <div className="group/sub">
            <a href="#" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
              Flash Sale
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* Submenu của Flash Sale */}
            <div className="absolute left-full top-0 hidden w-48 rounded-lg bg-white text-black shadow-lg border group-hover/sub:block z-30">
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Giảm 50%
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Giảm 70%
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Clearance Sale
              </a>
            </div>
          </div>

          {/* Các mục khác */}
          <a href="#" className="block px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
            Sale Phụ Kiện
          </a>
          <a href="#" className="block px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
            Combo Tiết Kiệm
          </a>
        </div>
      </div>

      {/* GU */}
      <div className="relative group">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors uppercase font-medium">
          GU
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="currentColor" />
          </svg>
        </a>

        {/* Menu cấp 1 */}
        <div className="absolute left-0 top-full hidden w-48 rounded-lg bg-white text-black shadow-lg border group-hover:block z-20">
          {/* GU Đơn Giản có submenu */}
          <div className="group/sub">
            <a href="#" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
              GU Đơn Giản
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* Submenu của GU Đơn Giản */}
            <div className="absolute left-full top-0 hidden w-48 rounded-lg bg-white text-black shadow-lg border group-hover/sub:block z-30">
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Trạm Thiết Yếu
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Trạm Jean
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Trạm Công Nghệ
              </a>
            </div>
          </div>

          {/* GU Thiết Kế có submenu */}
          <div className="group/sub">
            <a href="#" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
              GU Thiết Kế
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* Submenu của GU Thiết Kế */}
            <div className="absolute left-full top-0 hidden w-48 rounded-lg bg-white text-black shadow-lg border group-hover/sub:block z-30">
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Trạm Dịch Chuyển
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Trạm Tận Hưởng
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Trạm Nghệ Thuật
              </a>
            </div>
          </div>

          {/* GU Thể Thao có submenu */}
          <div className="group/sub">
            <a href="#" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
              GU Thể Thao
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* Submenu của GU Thể Thao */}
            <div className="absolute left-full top-0 hidden w-48 rounded-lg bg-white text-black shadow-lg border group-hover/sub:block z-30">
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                BTS The Beginner
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                BTS The Trainer
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                BTS The Pro
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Áo */}
      <div className="group">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors uppercase font-medium">
          Áo
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5.707 9.71c-.39.39-.39 1.02 0 1.41l4.892 4.887c.781.78 2.047.78 2.828 0l4.89-4.89a1 1 0 1 0-1.414-1.414l-4.185 4.186a1 1 0 0 1-1.414 0L7.12 9.71a1 1 0 0 0-1.414 0z" fill="currentColor" />
          </svg>
        </a>

        {/* Mega menu */}
        <div className="absolute left-0 top-10 w-[700px] hidden group-hover:flex bg-white shadow-lg rounded-lg border p-6 gap-6 flex-wrap z-20">
          <div className="flex-1 min-w-[160px]">
            <h3 className="font-semibold text-gray-900 mb-3">Áo Thun</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo thun trơn
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo thun in hình
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo thun polo
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo tank top
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[160px]">
            <h3 className="font-semibold text-gray-900 mb-3">Áo Sơ Mi</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Sơ mi công sở
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Sơ mi casual
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Sơ mi caro
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Sơ mi denim
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[160px]">
            <h3 className="font-semibold text-gray-900 mb-3">Áo Khoác</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Khoác hoodie
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Khoác bomber
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Khoác jeans
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo vest
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[160px]">
            <h3 className="font-semibold text-gray-900 mb-3">Áo Len</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo len cổ tròn
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo len cổ cao
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Cardigan
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo len dệt kim
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quần */}
      <div className="group">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors uppercase font-medium">
          Quần
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5.707 9.71c-.39.39-.39 1.02 0 1.41l4.892 4.887c.781.78 2.047.78 2.828 0l4.89-4.89a1 1 0 1 0-1.414-1.414l-4.185 4.186a1 1 0 0 1-1.414 0L7.12 9.71a1 1 0 0 0-1.414 0z" fill="currentColor" />
          </svg>
        </a>

        {/* Mega menu */}
        <div className="absolute left-0 top-10 w-[700px] hidden group-hover:flex bg-white shadow-lg rounded-lg border p-6 gap-6 flex-wrap z-20">
          <div className="flex-1 min-w-[160px]">
            <h3 className="font-semibold text-gray-900 mb-3">Quần Short</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Short thể thao
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Short jean
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Short kaki
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Short tây
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[160px]">
            <h3 className="font-semibold text-gray-900 mb-3">Quần Dài</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Quần tây
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Quần kaki
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Quần jogger
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Quần thể thao
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[160px]">
            <h3 className="font-semibold text-gray-900 mb-3">Quần Jean</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Jean slim fit
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Jean regular
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Jean baggy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Jean rách
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[160px]">
            <h3 className="font-semibold text-gray-900 mb-3">Đồ Lót</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Quần lót boxer
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Quần lót brief
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Áo lót
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Đồ ngủ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Phụ Kiện */}
      <div className="group">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors uppercase font-medium">
          Phụ Kiện
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5.707 9.71c-.39.39-.39 1.02 0 1.41l4.892 4.887c.781.78 2.047.78 2.828 0l4.89-4.89a1 1 0 1 0-1.414-1.414l-4.185 4.186a1 1 0 0 1-1.414 0L7.12 9.71a1 1 0 0 0-1.414 0z" fill="currentColor" />
          </svg>
        </a>

        {/* Mega menu */}
        <div className="absolute left-0 top-10 w-[800px] hidden group-hover:flex bg-white shadow-lg rounded-lg border p-6 gap-6 flex-wrap z-20">
          <div className="flex-1 min-w-[150px]">
            <h3 className="font-semibold text-gray-900 mb-3">Nón & Mũ</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Mũ lưỡi trai
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Nón bucket
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Nón beanie
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[150px]">
            <h3 className="font-semibold text-gray-900 mb-3">Dây Nịt</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Dây nịt da
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Dây nịt vải
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Dây nịt thời trang
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[150px]">
            <h3 className="font-semibold text-gray-900 mb-3">Ví & Túi</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Ví nam
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Túi đeo chéo
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Balo
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[150px]">
            <h3 className="font-semibold text-gray-900 mb-3">Vớ & Tất</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Vớ cổ cao
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Vớ cổ ngắn
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Vớ thể thao
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-[150px]">
            <h3 className="font-semibold text-gray-900 mb-3">Trang Sức</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Đồng hồ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Dây chuyền
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Nhẫn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mới */}
      <div className="relative">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors uppercase font-medium">
          Mới
          <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
        </a>
      </div>
    </nav>
  );
};

export default Navigation;

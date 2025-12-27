// src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import { apiRequest } from "@/api/fetcher";
import { ENDPOINTS } from "@/api/endpoints";
import type { Category } from "@/types/category";

import SearchBar from "./SearchBar";
import DesktopNav from "./DesktopNav";
import MobileNav from "../MobileNav/MobileNav";
import HeaderLogo from "./HeaderLogo";
import HeaderActions from "./HeaderActions";
import MobileMenuButton from "./MobileMenuButton";

const Header = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest<{ categories: Category[] }>(ENDPOINTS.menus);
        setCategories(res.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* LEFT: Mobile Menu Button + Logo */}
          <div className="flex items-center gap-4">
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
            {/* Placeholder để cân bằng khi logo căn giữa trên tablet (tùy chọn) */}
            <div className="w-10 lg:hidden" />
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <HeaderLogo />
            </div>
          </div>

          {/* CENTER: Desktop Navigation - CHỈ HIỆN TỪ 1024px (lg) TRỞ LÊN */}
          <div className="hidden lg:flex flex-1 justify-center px-8">
            {!loading && <DesktopNav categories={categories} />}
          </div>

          {/* RIGHT: Search + User/Cart Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            <SearchBar />
            <HeaderActions />
          </div>
        </div>
      </div>

      <MobileNav
        categories={categories}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;

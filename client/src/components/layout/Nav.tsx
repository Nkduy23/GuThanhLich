import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Sử dụng Link thay href cho SPA
import type { Category } from "../../types"; // Giả sử types.ts có interface Category

const Navigation = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Lỗi tải categories");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading nav...</div>;
  if (error) return <div>{error}</div>;

  // Lấy main categories (parentSlug = null)
  const mainCategories = categories.filter((cat) => cat.parentSlug === null);

  // Hàm lấy sub-categories theo parentSlug
  const getSubCategories = (parentSlug: string) => {
    return categories.filter((cat) => cat.parentSlug === parentSlug);
  };

  // Hàm render submenu (cho dropdown với sub-sub)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSubMenu = (subs: Category[], _parentSlug: string) => (
    <div className="space-y-2">
      {subs.map((sub) => {
        const subSubs = getSubCategories(sub.slug);
        if (subSubs.length > 0) {
          return (
            <div key={sub.slug} className="group/sub">
              <a
                href={`/category/${sub.slug}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {sub.name}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="absolute left-full top-0 hidden w-40 rounded-lg bg-white text-black shadow-lg group-hover/sub:block z-30">
                {subSubs.map((subSub) => (
                  <a
                    key={subSub.slug}
                    href={`/category/${subSub.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {subSub.name}
                  </a>
                ))}
              </div>
            </div>
          );
        }
        return (
          <a key={sub.slug} href={`/category/${sub.slug}`} className="block px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
            {sub.name}
          </a>
        );
      })}
    </div>
  );

  // Hàm render mega menu (cho Áo, Quần, Phụ kiện)
  const renderMegaMenu = (_mainSlug: string, subs: Category[]) => {
    const columns = [];
    for (let i = 0; i < subs.length; i += 4) {
      columns.push(subs.slice(i, i + 4));
    }

    return (
      <div className="absolute left-0 top-10 w-[800px] hidden group-hover:flex bg-white shadow-lg rounded-lg p-6 gap-6 flex-wrap z-20">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex justify-between flex-wrap w-full">
            {column.map((sub) => {
              const subSubs = getSubCategories(sub.slug); // Lấy sub-sub-categories
              return (
                <div key={sub.slug} className="w-1/4">
                  <h3 className="font-semibold text-gray-900 mb-2">{sub.name}</h3>
                  <ul className="space-y-1">
                    {subSubs.length > 0 ? (
                      subSubs.map((subSub) => (
                        <li key={subSub.slug}>
                          <Link to={`/category/${subSub.slug}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            {subSub.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li>
                        <Link to={`/category/${sub.slug}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          {sub.name} (Không có sub)
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <nav className="relative hidden md:flex flex-wrap gap-2 space-x-6 p-4">
      {mainCategories.map((mainCat) => {
        const subs = getSubCategories(mainCat.slug);
        const isMegaMenu = ["ao", "quan", "phu-kien"].includes(mainCat.slug); // Mega menu cho Áo, Quần, Phụ kiện

        return (
          <div key={mainCat.slug} className={`group mr-2 ${isMegaMenu ? "" : "relative"}`}>
            <Link
              to={`/category/${mainCat.slug}`}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors uppercase font-medium"
            >
              {mainCat.name}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z"
                  fill="currentColor"
                />
              </svg>
            </Link>

            {/* Dropdown/Submenu */}
            {!isMegaMenu ? (
              <div className="absolute left-0 top-6 hidden w-48 rounded-lg bg-white text-black shadow-lg group-hover:block z-20">
                {renderSubMenu(subs, mainCat.slug)}
              </div>
            ) : (
              renderMegaMenu(mainCat.slug, subs)
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Navigation;

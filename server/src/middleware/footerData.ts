import { Request, Response, NextFunction } from "express";

const setFooterData = (req: Request, res: Response, next: NextFunction) => {
  (req as any).footerData = {
    socialLinks: [
      { name: "Facebook", icon: "facebook_icon.svg", href: "#" },
      { name: "Zalo", icon: "zalo_icon.svg", href: "#" },
      { name: "Youtube", icon: "youtube_icon.svg", href: "#" },
      { name: "Tiktok", icon: "tiktok_icon.svg", href: "#" },
    ],

    contactInfo: [
      { label: "Tư vấn mua hàng (Miễn phí)", phone: "1800.6601" },
      { label: "Tư vấn kỹ thuật", phone: "1800.6602" },
      { label: "Chăm sóc khách hàng", phone: "1800.6603" },
    ],

    aboutLinks: [
      { text: "Giới thiệu về công ty", href: "#" },
      { text: "Quy chế hoạt động", href: "#" },
      { text: "Dự án Doanh nghiệp", href: "#" },
      { text: "Tin tức khuyến mại", href: "#" },
      { text: "Giới thiệu máy đổi trả", href: "#" },
      { text: "Hướng dẫn mua hàng & thanh toán online", href: "#" },
      { text: "Đại lý ủy quyền và TTHH ủy quyền của Apple", href: "#" },
      { text: "Tra cứu hoá đơn điện tử", href: "#" },
      { text: "Tra cứu bảo hành", href: "#" },
      { text: "Câu hỏi thường gặp", href: "#" },
    ],

    policyLinks: [
      { text: "Chính sách bán hàng", href: "/policy-mobile" },
      { text: "Chính sách đổi trả", href: "/refund-policy" },
      { text: "Chính sách bảo mật", href: "/refund-policy" },
      { text: "Chính sách trả góp", href: "#" },
      { text: "Chính sách khui hộp sản phẩm", href: "/unboxing" },
      { text: "Chính sách giao hàng & lắp đặt", href: "#" },
      { text: "Chính sách mạng di động Electro", href: "#" },
      { text: "Chính sách thu thập & sử dụng dữ liệu cá nhân", href: "#" },
      { text: "Quy định về hỗ trợ khôi phục & sao lưu dữ liệu", href: "#" },
      { text: "Chính sách giao hàng & lắp đặt Điện máy, Gia dụng", href: "#" },
      { text: "Chính sách chương trình khách hàng thân thiết", href: "/clients" },
    ],

    paymentIcons: ["mastercard_icon.svg", "jcb_icon.svg", "amex_icon.svg", "vnpay_icon.svg", "zalopay_icon.svg", "napas_icon.svg", "momo_icon.svg", "foxpay_icon.svg", "applepay_icon.svg", "muadee_icon.svg", "homepaylater_icon.svg", "samsungpay_icon.svg", "googlepay_icon.svg"],

    certifications: ["dmca_icon.svg", "thuong_hieu_manh_2013_icon.svg", "san_pham_dich_vu_hang_dau_viet_nam_icon.svg"],
  };

  next();
};

export default setFooterData;

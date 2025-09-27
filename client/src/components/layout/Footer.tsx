import type { SocialLink, ContactInfo, LinkItem } from "../../types";

interface FooterProps {
  socialLinks: SocialLink[];
  contactInfo: ContactInfo[];
  aboutLinks: LinkItem[];
  policyLinks: LinkItem[];
  paymentIcons: string[];
  certifications: string[];
}

const Footer: React.FC<FooterProps> = ({ socialLinks, contactInfo, aboutLinks, policyLinks, paymentIcons, certifications }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="mx-auto max-w-7xl px-4 container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">GuThanhLich</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Electro – Nền tảng mua sắm thiết bị điện tử tại Việt Nam, giúp người dân quốc.</p>
            </div>
            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-base font-bold uppercase text-white">KẾT NỐI VỀ ELECTRO</h3>
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.href} className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 hover:text-blue-400 hover:no-underline">
                    <img src={`/icons/${link.icon}`} alt={link.name} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-base font-bold uppercase text-white">TỔNG ĐÀI MIỄN PHÍ</h3>
              {contactInfo.map((info, index) => (
                <div key={index} className="space-y-1">
                  <span className="block text-gray-400 text-xs">{info.label}</span>
                  <span className="block text-base font-bold text-white">{info.phone}</span>
                </div>
              ))}
            </div>
          </div>
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold uppercase text-white">VỀ CHÚNG TÔI</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="block text-gray-400 text-sm leading-tight transition-colors duration-300 hover:text-blue-400 hover:no-underline">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Policy Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold uppercase text-white">CHÍNH SÁCH</h3>
            <ul className="space-y-2">
              {policyLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="block text-gray-400 text-sm leading-tight transition-colors duration-300 hover:text-blue-400 hover:no-underline">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Payment & Certification Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold uppercase text-white mb-4">HỖ TRỢ THANH TOÁN</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {paymentIcons.map((icon, index) => (
                  <img key={index} src={`/icons/${icon}`} alt="Payment method" className="w-full object-contain" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold uppercase text-white mb-4">CHỨNG NHẬN</h3>
              <div className="flex gap-2">
                {certifications.map((cert, index) => (
                  <img key={index} src={`/icons/${cert}`} alt="Certification" className="w-16 h-10 object-contain" />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:items-center md:text-left text-center">
            <div className="flex-1 space-y-2">
              <p className="font-bold text-white text-xs">© Bản quyền thuộc về Electro</p>
              <p className="font-medium text-white text-xs">Công ty TNHH Electro Việt Nam</p>
              <p className="text-gray-400 text-xs leading-tight">Giấy chứng nhận đăng ký kinh doanh số: 0315667679 do Sở Kế hoạch & Đầu tư TP.HCM cấp ngày 22/08/2025</p>
              <p className="text-gray-400 text-xs">Góp ý & khiếu nại: ceo@electro.com</p>
              <p className="text-gray-400 text-xs">Hotline: 1900 6777</p>
              <p className="text-gray-400 text-xs">Địa chỉ tại số: 50/22 Gò Dầu, Phường Tân Quý, Quận Tân Phú, TP. Hồ Chí Minh</p>
            </div>
            <div className="flex-shrink-0">
              <img src="/icons/da_thong_bao_bo_cong_thuong_icon.svg" alt="Bộ Công Thương Certification" className="w-32 h-20 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

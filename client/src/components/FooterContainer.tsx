import { useEffect, useState } from "react";
import Footer from "./Footer";
import type { SocialLink, ContactInfo, LinkItem } from "../types";

const FooterContainer: React.FC = () => {
  const [footerData, setFooterData] = useState<{
    socialLinks: SocialLink[];
    contactInfo: ContactInfo[];
    aboutLinks: LinkItem[];
    policyLinks: LinkItem[];
    paymentIcons: string[];
    certifications: string[];
  }>({
    socialLinks: [],
    contactInfo: [],
    aboutLinks: [],
    policyLinks: [],
    paymentIcons: [],
    certifications: [],
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/footer")
      .then((res) => res.json())
      .then((data) => setFooterData(data))
      .catch((err) => console.error(err));
  }, []);

  return <Footer {...footerData} />;
};

export default FooterContainer;

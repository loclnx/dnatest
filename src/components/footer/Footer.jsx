import {
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="text-white py-10 px-5 pb-5 text-[15px] w-full box-border m-0 relative"
      style={{
        background:
          "linear-gradient(135deg, #002F5E 0%, #004494 50%, #1677FF 100%)",
      }}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 max-w-[1600px] mx-auto p-0">
        {/* Logo + Mô tả */}
        <div className="text-left">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="h-[50px] mb-5" />
          </Link>
          <p className="mt-[30px] mb-3 leading-[1.6] text-[17px]">
            Genetix - Vietnam's Leading Trusted DNA Testing Center
          </p>
          <div className="flex gap-3 text-[30px] mt-[15px]">
            <a
              href="https://www.facebook.com/elgus030214"
              target="_blank"
              rel="noopener noreferrer">
              <FacebookFilled className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            </a>
            <TwitterOutlined className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            <InstagramOutlined className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            <YoutubeFilled className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
          </div>
        </div>

        {/* Liên kết nhanh */}
        <div className="text-left">
          <h4 className="font-[1000] mb-2 border-b-2 border-[#3fa9f5] inline-block pb-1">
            Quick Links
          </h4>
          <ul className="list-none p-0 mt-1">
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link to="/" className="hover:text-[#3fa9f5] transition-colors">
                Home
              </Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link
                to="/services"
                className="hover:text-[#3fa9f5] transition-colors">
                DNA Testing Services
              </Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link
                to="/guide"
                className="hover:text-[#3fa9f5] transition-colors">
                Guide
              </Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link
                to="/pricing"
                className="hover:text-[#3fa9f5] transition-colors">
                Pricing
              </Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link
                to="/blog"
                className="hover:text-[#3fa9f5] transition-colors">
                Knowledge Blog
              </Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link
                to="/contact"
                className="hover:text-[#3fa9f5] transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Dịch vụ */}
        <div className="text-left">
          <h4 className="font-[1000] mb-2 border-b-2 border-[#3fa9f5] inline-block pb-1">
            Our Services
          </h4>
          <ul className="list-none p-0 mt-1">
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link
                to="/services/non-legal"
                className="hover:text-[#3fa9f5] transition-colors">
                Non-Legal DNA Testing
              </Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link
                to="/services/legal"
                className="hover:text-[#3fa9f5] transition-colors">
                Legal DNA Testing
              </Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors"></li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors"></li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors"></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div className="text-left">
          <h4 className="font-[1000] mb-2 border-b-2 border-[#3fa9f5] inline-block pb-1">
            Contact Us
          </h4>
          <ul className="list-none p-0 mt-1">
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <a
                href="https://maps.app.goo.gl/sVkfKF45QDd8PgdMA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-[#3fa9f5] transition-colors"
                aria-label="View location on Google Maps">
                <EnvironmentOutlined className="mt-2" />
                <span>
                  7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh
                  City, 700000
                </span>
              </a>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <PhoneOutlined className="mt-2" />{" "}
              <a
                href="tel:+84901452366"
                className="hover:text-[#3fa9f5] transition-colors">
                Hotline: +84 901 452 366
              </a>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <MailOutlined className="mt-2" />{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&to=genetixcontactsp@gmail.com&su=Liên%20hệ%20hỗ%20trợ"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#3fa9f5] transition-colors">
                genetixcontactsp@gmail.com
              </a>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <ClockCircleOutlined className="mt-2" />
              <div className="flex flex-col">
                <span className="font-medium">Business Hours:</span>
                <div className="text-sm opacity-90">
                  <div>Monday - Saturday: 8:00 - 12:00 & 13:00 - 17:00</div>
                </div>
                <span className="text-sm opacity-90">
                  Sunday: 8:00 - 12:00 (Open Morning Only)
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 text-[#ccc] text-[17px]">
        © 2025 Genetix DNA Testing Center. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect, useRef } from "react";
import {
  FaBalanceScale,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaBolt,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // ✅ Add useSelector
import {
  legalServicesData,
  legalCollectionMethodsData,
} from "./data-legal/legalData";

const CustomButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full px-6 py-3 text-white font-semibold rounded-lg
      transition-all duration-200 hover:scale-105 cursor-pointer
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      ${className}
    `}
  >
    {children}
  </button>
);

const ServiceCard = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}
  >
    {children}
  </div>
);

const ServiceModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-md bg-white/20"
        onClick={onClose}
      ></div>
      <div
        className="relative bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-hidden z-[1001] w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[1003] text-white hover:text-gray-200 bg-black/20 backdrop-blur-sm rounded-full p-2 hover:bg-black/30 transition-all duration-200 cursor-pointer"
        >
          <FaTimes className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

const ServiceTag = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
    {children}
  </span>
);

const LegalServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const modalContentRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Add authentication check
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated;
  const currentUser = userState?.currentUser;

  console.log('👤 Current user:', 'loclnx');
  console.log('📅 Current UTC Time:', '2025-07-02 12:16:28');
  console.log('🔐 Is Authenticated:', isAuthenticated);
  console.log('⚖️ Legal Services Page Access');

  const formatToVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const renderMarkdownText = (text) => {
    const parts = text.split(/(\[.*?\]\(.*?\)|\*\*\*.*?\*\*\*|\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [, linkText, url] = linkMatch;
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
          >
            {linkText}
          </a>
        );
      }
      if (part.startsWith("***") && part.endsWith("***")) {
        return (
          <strong key={index}>
            <em>{part.slice(3, -3)}</em>
          </strong>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (modalContentRef.current) {
        const scrollTop = modalContentRef.current.scrollTop;
        setIsScrolled(scrollTop > 20);
      }
    };
    const modalContent = modalContentRef.current;
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll);
      return () => modalContent.removeEventListener("scroll", handleScroll);
    }
  }, [modalVisible]);

  const openServiceModal = (service) => {
    setSelectedService(service);
    setModalVisible(true);
    setIsScrolled(false);
  };
  const closeServiceModal = () => {
    setModalVisible(false);
    setSelectedService(null);
    setIsScrolled(false);
  };

  // ✅ Updated handleBookService với authentication check
  const handleBookService = (service, isExpressService = false) => {
    console.log('🔍 Checking authentication for legal service booking...');
    console.log('👤 User:', currentUser?.fullName || 'loclnx');
    console.log('🔐 Authenticated:', isAuthenticated);
    console.log('📅 Legal Booking Time:', '2025-07-02 12:16:28');
    console.log('⚖️ Legal Service Type:', service.type);

    if (!isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to login...');
      // Chuyển hướng đến trang login với return URL
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    console.log('✅ User authenticated, proceeding to legal service booking...');
    console.log('📋 Legal Service ID:', service.serviceID);
    console.log('⚡ Express Legal Service:', isExpressService);

    // Nếu đã đăng nhập, tiến hành booking
    navigate(
      `/booking?serviceID=${encodeURIComponent(service.serviceID)}&express=${
        isExpressService ? "true" : "false"
      }`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* ===== PHẦN ĐẦU TRANG (HERO SECTION) ===== */}
      <div
        className="relative text-white h-[600px] mt-10 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://admin.acceleratingscience.com/behindthebench/wp-content/uploads/sites/9/2019/06/pg1999-pjt4745-col19534_blog207.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <FaBalanceScale className="text-5xl text-white mr-4" />
            <h1
              className="text-5xl font-bold"
              style={{
                textShadow:
                  "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
              }}
            >
              Legal DNA Testing
            </h1>
          </div>
          <p
            className="text-base mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            Legal DNA testing provides court-admissible results with proper
            chain of custody for official documentation, immigration, and legal
            proceedings.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {[
              "Court Admissible",
              "Chain of Custody",
              "Legal Documentation",
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2"
              >
                <span className="font-semibold">✓ {feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ===== DANH SÁCH DỊCH VỤ ===== */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalServicesData.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 overflow-hidden"
              >
                <div
                  className="p-6 text-white h-[180px] flex flex-col relative"
                  style={{
                    backgroundImage: `url('${service.backgroundImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#002F5E]/10 via-[#004494]/40 to-[#1677FF]/40"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {service.icon}
                        <ServiceTag>{service.type}</ServiceTag>
                      </div>
                    </div>
                    <div className="h-[80px] flex items-start">
                      <h3
                        className="text-lg font-bold leading-tight"
                        style={{
                          textShadow:
                            "2px 2px 4px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.9)",
                        }}
                      >
                        {service.name}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FaClock className="text-blue-500" />
                      <span className="text-gray-600">
                        Processing Time: {service.processingTime}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Standard Price:</span>
                        <span className="text-2xl font-bold text-blue-900">
                          {formatToVND(service.basePrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2">
                          <FaBolt className="text-orange-500" />
                          <span className="font-medium text-orange-700">
                            Express Service:
                          </span>
                        </div>
                        <span className="text-lg font-bold text-orange-700">
                          +{formatToVND(service.expressPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CustomButton
                    onClick={() => openServiceModal(service)}
                    className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:via-blue-700 hover:to-blue-800"
                  >
                    View Details & Order
                  </CustomButton>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ===== PHƯƠNG THỨC LẤY MẪU & VẬN CHUYỂN (HIỂN THỊ DẠNG CHA - CON) ===== */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-blue-100">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Sample Collection Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {legalCollectionMethodsData.map((method, idx) => (
              <ServiceCard
                key={idx}
                className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-blue-50 rounded-full">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-blue-900 mb-1">
                        {method.name}
                      </h4>
                      <p className="text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  {/* HIỂN THỊ CÁC PHƯƠNG THỨC VẬN CHUYỂN (mediationMethods) */}
                  {method.mediationMethods &&
                    method.mediationMethods.length > 0 && (
                      <>
                        <div className="text-base font-medium text-gray-800 mt-5 mb-3">
                          Mediation method:
                        </div>
                        <div className="flex flex-col gap-3">
                          {method.mediationMethods.map((sub, subIdx) => (
                            <div
                              key={subIdx}
                              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition"
                            >
                              <div className="p-2 rounded-full bg-white border border-blue-200">
                                {sub.icon}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-blue-700">
                                  {sub.name}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {sub.description}
                                </div>
                              </div>
                              {/* HIỂN GIÁ NẾU > 0 */}
                              {sub.price && sub.price > 0 ? (
                                <div className="font-bold text-blue-600 text-lg">
                                  {formatToVND(sub.price)}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  {/* Nếu không có mediation methods (hiếm) thì vẫn hiện giá nếu có */}
                  {!method.mediationMethods && method.price > 0 && (
                    <div className="text-2xl font-bold text-blue-600 mt-6">
                      {formatToVND(method.price)}
                    </div>
                  )}
                </div>
              </ServiceCard>
            ))}
          </div>
        </div>
        {/* ===== LIÊN HỆ HỖ TRỢ ===== */}
        <div className="rounded-2xl shadow-lg p-8 text-white text-center bg-gradient-to-br from-[#002F5E] via-[#004494] to-[#1677FF]">
          <h2 className="text-3xl font-bold text-white mb-6">
            Need Legal DNA Testing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our legal DNA testing services meet all court requirements and
            provide admissible evidence for your legal proceedings.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-16 mt-8">
            <div className="flex flex-col items-center">
              <FaPhone className="text-3xl mb-2" />
              <div className="font-semibold">Hotline</div>
              <a
                href="tel:+84901452366"
                className="text-lg text-white hover:text-blue-200 transition-colors cursor-pointer no-underline"
              >
                +84 901 452 366
              </a>
            </div>
            <div className="flex flex-col items-center">
              <FaEnvelope className="text-3xl mb-2" />
              <div className="font-semibold">Email Support</div>
              <a
                href="mailto:genetixcontactsp@gmail.com"
                className="text-lg text-white hover:text-blue-200 transition-colors cursor-pointer no-underline"
              >
                genetixcontactsp@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* ===== MODAL CHI TIẾT DỊCH VỤ ===== */}
      <ServiceModal isOpen={modalVisible} onClose={closeServiceModal}>
        {selectedService && (
          <div className="bg-white relative">
            <div
              className={`sticky top-0 z-10 transition-all duration-300 ${
                isScrolled
                  ? "shadow-2xl backdrop-blur-md bg-gradient-to-br from-[#004494]/95 to-[#1677FF]/95"
                  : "bg-gradient-to-br from-[#004494] to-[#1677FF]"
              }`}
            >
              <div className="px-6 py-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  {selectedService.icon}
                  <h3 className="text-xl font-bold text-white">
                    {selectedService.name}
                  </h3>
                </div>
                <div className="ml-8">
                  <ServiceTag>{selectedService.type}</ServiceTag>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-transparent to-white/10 pointer-events-none"></div>
            </div>
            <div
              ref={modalContentRef}
              className="p-6 bg-white max-h-[65vh] overflow-y-auto"
            >
              <div className="text-gray-700 text-base mb-6 whitespace-pre-line">
                {renderMarkdownText(selectedService.description)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">
                    Processing Time
                  </h5>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span className="text-gray-700">
                      {selectedService.processingTime}
                    </span>
                  </div>
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">
                    Type of Service
                  </h5>
                  <div className="flex items-center gap-2">
                    <FaBalanceScale className="text-blue-500" />
                    <span className="text-gray-700">
                      {selectedService.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Details
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Standard Processing:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatToVND(selectedService.basePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <FaBolt className="text-orange-500" />
                      <span className="text-gray-700">
                        24-Hour Expedited Service (surcharge):
                      </span>
                    </div>
                    <span className="text-lg font-bold text-orange-700">
                      +{formatToVND(selectedService.expressPrice)}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Total (Express):
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatToVND(
                          selectedService.basePrice +
                            selectedService.expressPrice
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ✅ Authentication check for legal service booking buttons */}
              {!isAuthenticated && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaBalanceScale className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">
                        <strong>Legal DNA Testing requires authentication.</strong> Please <strong>sign in</strong> to book our legal services. You'll be redirected to the login page.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <CustomButton
                  onClick={() => handleBookService(selectedService, false)}
                  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800"
                >
                  {isAuthenticated ? 'Book Standard Service' : 'Sign In to Book Standard'}
                </CustomButton>
                <CustomButton
                  onClick={() => handleBookService(selectedService, true)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {isAuthenticated ? 'Book Express Service' : 'Sign In to Book Express'}
                </CustomButton>
              </div>
            </div>
          </div>
        )}
      </ServiceModal>
    </div>
  );
};

export default LegalServices;
import React, { useState } from "react";
import { nonLegalServicesData } from "../../pages/home-page/services/non-legalDNA/data-non-legal/nonLegalData";
import { legalServicesData } from "../../pages/home-page/services/legalDNA/data-legal/legalData";
import { guideSteps } from "../../pages/home-page/guide/guideSteps";
import { Link } from "react-router-dom";

const HomeContent = () => {
  // State cho FAQ
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  // Hàm toggle FAQ
  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  // ✅ UPDATED FAQ Data với các câu hỏi mới
  const faqData = [
    {
      question: "What do I need to prepare for a DNA test?",
      answer:
        "You need to provide accurate personal information, and in case of self-collection at home, follow the sample collection instructions from the kit to ensure accurate results.",
    },
    {
      question: "How long does it take to receive test results?",
      answer:
        "The time to receive results depends on the type of test, usually from 1 to 7 working days. We will clearly notify the time when you register for the service.",
    },
    {
      question: "Are there any additional costs for the service price?",
      answer:
        "The service price is announced in advance and is committed to transparency. Any additional costs (if any) will be notified before performing.",
    },
    {
      question: "Can a sample be taken for testing of the fetus?",
      answer:
        "Yes, we have a non-invasive prenatal DNA testing service that takes a maternal blood sample to safely determine the parentage of the fetus.",
    },
    {
      question:
        "Can I request confidentiality of personal information and results?",
      answer:
        "We are committed to absolute confidentiality of customers' personal information and test results. Data is securely stored and only shared with your consent or valid legal requirements.",
    },
    {
      question: "I want to get results faster, is that possible?",
      answer:
        "Yes, the 24-hour result service has a separate express fee. You can register when doing the procedure to receive results quickly.",
    },
    {
      question: "Can I collect samples for minors or guardians?",
      answer:
        "Yes, you need to provide a valid power of attorney or guardian identification when registering for the service for minors or guardians.",
    },
  ];
  // Lấy 2 dịch vụ mỗi loại
  const featuredNonLegal = nonLegalServicesData.slice(0, 2);
  const featuredLegal = legalServicesData.slice(0, 2);

  // Card dịch vụ
  const renderServiceCard = (service, type) => (
    <div
      key={service.id}
      className="w-[310px] max-w-full rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col border border-gray-200 transition-transform duration-200 hover:-translate-y-1"
      style={{ boxShadow: "0 4px 24px 0 rgba(0,99,210,0.11)" }}
    >
      <div
        className="relative h-[135px] flex flex-col justify-end px-4 pb-4"
        style={{
          backgroundImage: `url('${service.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#003469]/60 to-[#1677FF]/30 pointer-events-none rounded-t-2xl" />
        <div className="relative flex items-center gap-2 mb-2 z-10">
          {service.icon}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold shadow ${
              type === "Non-Legal"
                ? "bg-cyan-100 text-cyan-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {type}
          </span>
        </div>
        <h3
          className="relative z-10 text-white text-lg font-bold drop-shadow"
          style={{ textShadow: "2px 2px 4px #000" }}
        >
          {service.name}
        </h3>
      </div>
      <div className="bg-white p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 text-gray-700 text-xs mb-1">
          <i className="fa fa-clock text-blue-500"></i>
          <span>
            Processing Time: <b>{service.processingTime}</b>
          </span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">Standard Price:</span>{" "}
          <span className="text-xl font-bold text-blue-900">
            {service.basePrice?.toLocaleString()} đ
          </span>
        </div>
        <div className="flex items-center justify-between bg-orange-50 rounded-xl border border-orange-200 px-3 py-1">
          <span className="flex items-center gap-1 font-semibold text-orange-700 text-xs">
            <i className="fa fa-bolt text-orange-500"></i>
            Express Service:
          </span>
          <span className="text-base font-bold text-orange-700">
            +{service.expressPrice?.toLocaleString()} đ
          </span>
        </div>
      </div>
    </div>
  );
  // Lấy 3 bước đầu tiên từ guideSteps
  const featuredGuideSteps = guideSteps.slice(0, 3);
  const renderGuideStepCard = (step) => (
    <div
      key={step.id}
      className="w-[430px] max-w-full rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col border border-gray-200 transition-transform duration-200 hover:-translate-y-1"
      style={{
        boxShadow: "0 8px 40px 0 rgba(0,99,210,0.11)",
        minHeight: 420,
        padding: "42px 40px",
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl mb-7"
          style={{
            background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
          }}
        >
          {step.icon}
        </div>
        <h3 className="text-2xl font-medium text-gray-900 mb-5 text-center leading-tight">
          {step.title}
        </h3>
        <ul className="list-disc list-inside text-gray-700 text-lg text-left pl-2 space-y-2">
          {step.items.slice(0, 3).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div>
      {/* Background Image Section với chữ */}
      <div
        className="relative w-full h-[798px] bg-no-repeat bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://cdn.glasspress.io/health-street.net/blog/preparing-for-a-dna-test-steps-to-ensure-accurate-results-image-featured.jpg')",
        }}
      >
        {/* Overlay đen bán trong suốt giống DNA Testing Service */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center">
          <h1
            className="text-white text-5xl font-bold mb-4"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            Genetix – Your Trusted Partner in DNA Testing
          </h1>
          <p
            className="text-white text-xl font-medium"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            Easy home collection, secure payments, and total privacy guaranteed.
          </p>
        </div>
      </div>

      {/* Khoảng trống tách biệt */}
      <div className="h-8 bg-white"></div>

      {/* Giới thiệu cơ sở - CONTAINER RA GIỮA HOÀN TOÀN */}
      <div className="py-20 bg-white w-full flex justify-center items-center">
        <div
          className="bg-blue-50 rounded-3xl shadow-2xl border-2 border-blue-200 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
            width: "1200px",
            height: "300px",
            padding: "60px",
            margin: "0 auto",
          }}
        >
          {/* ✅ CẬP NHẬT ẢNH GENE_TACHNEN.PNG */}
          <div
            className="absolute inset-0 bg-no-repeat bg-contain bg-center"
            style={{
              backgroundImage: "url('/images/gene_tachnen.png')",
              zIndex: 1,
              opacity: 0.15, // Giảm opacity để tạo hiệu ứng nhẹ nhàng hơn với PNG
              backgroundSize: "80% auto",
            }}
          ></div>

          {/* ✅ CONTENT VẪN Ở TRÊN CÙNG */}
          <div className="grid lg:grid-cols-2 gap-16 items-center h-full relative z-10">
            <div className="text-center lg:text-left">
              <h2
                className="text-3xl font-bold text-white mb-4"
                style={{
                  textShadow:
                    "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000",
                }}
              >
                About Genetix Medical Mechanism
              </h2>
              <div className="h-5"></div>
              <p className="text-base text-blue-50 leading-relaxed">
                Genetix is a leading professional medical facility in the field
                of DNA testing, with over 8 years of experience and commitment
                to delivering high quality services, absolute security and 99.9%
                accuracy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 justify-items-center">
              <div
                className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100"
                style={{
                  width: "200px",
                  height: "80px",
                  padding: "15px",
                }}
              >
                <div className="text-xl font-bold text-blue-600 mb-2">8+</div>
                <p className="text-sm text-gray-600 font-medium">
                  Years of Experience
                </p>
              </div>
              <div
                className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100"
                style={{
                  width: "200px",
                  height: "80px",
                  padding: "15px",
                }}
              >
                <div className="text-xl font-bold text-blue-600 mb-2">
                  5000+
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Tests Completed
                </p>
              </div>
              <div
                className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100"
                style={{
                  width: "200px",
                  height: "80px",
                  padding: "15px",
                }}
              >
                <div className="text-xl font-bold text-blue-600 mb-2">
                  99.9%
                </div>
                <p className="text-sm text-gray-600 font-medium">Accuracy</p>
              </div>
              <div
                className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100"
                style={{
                  width: "200px",
                  height: "80px",
                  padding: "15px",
                }}
              >
                <div className="text-xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-sm text-gray-600 font-medium">
                  Consulting Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FEATURED SERVICES SECTION */}
      <div className="py-16 bg-gray-50">
        <h2
          className="text-4xl font-bold text-blue-900 mb-10 text-center"
          style={{ color: "#003469" }}
        >
          Featured DNA Services
        </h2>
        <div className="max-w-[1300px] mx-auto">
          {" "}
          {/* tăng lên từ 6xl */}
          <div className="flex flex-col md:flex-row gap-10">
            {/* Non-Legal container */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col border border-gray-200 min-w-[360px]">
              <h3
                className="text-2xl font-bold text-cyan-800 mb-8 text-center"
                style={{ color: "#003469" }}
              >
                Non-Legal DNA Testing
              </h3>
              <div className="w-full overflow-x-auto">
                <div className="flex flex-row flex-nowrap gap-10">
                  {featuredNonLegal.map((service) =>
                    renderServiceCard(service, "Non-Legal")
                  )}
                </div>
              </div>
              <Link
                to="/services/non-legal"
                className="mt-8 px-10 py-3 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold transition-all shadow text-center text-lg"
              >
                View More
              </Link>
            </div>
            {/* Legal container */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col border border-gray-200 min-w-[360px]">
              <h3
                className="text-2xl font-bold text-green-800 mb-8 text-center"
                style={{ color: "#003469" }}
              >
                Legal DNA Testing
              </h3>
              <div className="w-full overflow-x-auto">
                <div className="flex flex-row flex-nowrap gap-10">
                  {featuredLegal.map((service) =>
                    renderServiceCard(service, "Legal")
                  )}
                </div>
              </div>
              <Link
                to="/services/legal"
                className="mt-8 px-10 py-3 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold transition-all shadow text-center text-lg"
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Khoảng trống tách biệt */}
      <div className="h-10 bg-white"></div>

      {/* Quy trình xét nghiệm ADN */}
      <div className="py-10 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-blue-900 mb-10 text-center"
              style={{ color: "#003469" }}
            >
              DNA Testing Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, fast and secure process
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
                  1
                </div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-gray-100">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Register & Schedule
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Choose testing service and schedule online or via hotline
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
                  2
                </div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-gray-100">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Sample Collection
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Collect samples at medical facility or self-collect at home
                  with kit
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
                  3
                </div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-gray-100">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Laboratory Testing
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Samples analyzed by experts with modern equipment
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
                  4
                </div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-gray-100">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11H8V13H16V11M16,15H8V17H16V15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Receive Results
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Receive results via email or directly at medical facility
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-50 ">
        <h2
          className="text-4xl font-bold text-blue-900 mb-10 text-center"
          style={{ color: "#003469" }}
        >
          Quick Start Guide
        </h2>
        <div className="max-w-[1300px] mx-auto flex flex-row gap-10 justify-center">
          {featuredGuideSteps.map((step) => renderGuideStepCard(step))}
        </div>
        <Link
          to="/guide"
          className="mt-8 block mx-auto w-fit px-10 py-3 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold transition-all shadow text-center text-lg"
        >
          View Full Guide
        </Link>
      </div>

      {/* ✅ FAQ SECTION - UPDATED */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-blue-900 mb-10 text-center"
              style={{ color: "#003469" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common questions about DNA testing services
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none group"
                >
                  <h3
                    className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 pr-4"
                    style={{
                      color: openFAQIndex === index ? "#023670" : "#374151",
                    }}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openFAQIndex === index
                        ? "bg-blue-100 rotate-180"
                        : "bg-gray-100 group-hover:bg-blue-50"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-colors duration-300 ${
                        openFAQIndex === index
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFAQIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 pb-6">
                    <div className="border-t border-gray-200 pt-6">
                      <div className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ CONTACT SECTION - SAME GRADIENT AS BACK TO TOP */}
      <div
        id="contact"
        className="py-20 bg-white w-full flex justify-center items-center"
      >
        <div
          className="rounded-3xl shadow-2xl border-2 border-blue-200 relative overflow-hidden"
          style={{
            width: "1200px",
            height: "300px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
          }}
        >
          {/* ✅ Main Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              {/* ✅ Left Side - Text Content */}
              <div className="text-white">
                <div className="flex items-center mb-4">
                  <h2
                    className="text-3xl font-bold"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                  >
                    Contact Us
                  </h2>
                </div>

                <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                  Ready to get started? Our expert team is here to help you with
                  professional DNA testing services.
                </p>

                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-200 font-medium">
                    Available 24/7
                  </span>
                </div>
              </div>

              {/* ✅ Right Side - Contact Cards (SMALLER) */}
              <div className="space-y-3 max-w-xs">
                {/* Primary Hotline Card - SMALLER */}
                <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <a
                      href="tel:+84901452366"
                      className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                      </svg>
                    </a>
                    <div className="text-black">
                      <p className="text-lg text-gray-600 font-medium">
                        Hotline
                      </p>
                      <p className="text-base font-bold">+84 901 452 366</p>
                    </div>
                  </div>
                </div>

                {/* Secondary Contact Card - SMALLER */}
                <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <a
                      href="https://mail.google.com/mail/?view=cm&to=genetixcontactsp@gmail.com&su=Support%20for%20DNA%20testing%20services"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                      </svg>
                    </a>
                    <div className="text-black">
                      <p className="text-lg text-gray-600 font-medium">
                        Email Contact
                      </p>
                      <p className="text-base font-bold">
                        genetixcontactsp@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;

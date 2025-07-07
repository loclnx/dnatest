import React, { useState } from "react";
import { Link } from "react-router-dom";

const ServicesOverview = () => {
  const [selectedKit, setSelectedKit] = useState(null);

  // Helper function to format price to VND
  const formatToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const services = [
    {
      id: 1,
      title: "Non-Legal DNA Testing",
      subtitle:
        "As a form of DNA testing, it is used to determine the blood relationship between individuals and serve personal and family purposes.",
      description:
        "Non-Legal DNA Testing is used to determine the biological relationship between individuals. At GENTIS International Testing Center, we ensure accuracy and confidentiality.",
      price: formatToVND(2500000),
      turnaround: "2-7 working days",
      link: "/services/non-legal",
    },
    {
      id: 2,
      title: "Legal DNA Testing",
      subtitle: "As a legally binding and administrative form of DNA testing",
      description:
        "Legal DNA testing is conducted through a rigorous process, and the results hold legal validity for resolving matters related to inheritance, birth registration, and sponsorship-immigration-citizenship applications.",
      price: formatToVND(3500000),
      turnaround: "3-7 working days",
      link: "/services/legal",
    },
  ];

  const sampleTypes = [
    {
      id: 1,
      name: "Nail clipping sample",
      image:
        "https://gentis.vn/wp-content/uploads/2021/01/ban-da-biet-quy-trinh-xet-nghiem-adn-chua-1.jpg",
    },
    {
      id: 2,
      name: "Hair sample with root follicles",
      image:
        "https://medlatec.vn/media/13792/content/20200917_xet-nghiem-adn-bang-toc-01.jpg",
    },
    {
      id: 3,
      name: "Buccal swab sample (saliva)",
      image:
        "https://gentis.com.vn/public/media/tin-tuc/2022/t5/xet-nghiem-adn-bang-niem-mac-mieng.jpg",
    },
    {
      id: 4,
      name: "Blood sample",
      image:
        "https://gentis.vn/wp-content/uploads/2021/05/Cach-lay-mau-xet-nghiem-ADn-tai-nha-641x400.jpg",
    },
  ];

  const testingKits = [
    {
      id: 1,
      name: "PowerPlex Fusion",
      shortName: "PowerPlex® Fusion 6C System",
      image: "/images/powerPlex.jpg",
      manufacturer: "Promega Corporation, USA",
      purpose:
        "This kit is designed for PCR (Polymerase Chain Reaction) amplification of human DNA, serving genetic analysis in forensics, personal identification, paternity determination, and DNA database construction.",
      kitType:
        "This is a 6-dye multiplex STR (Short Tandem Repeat) kit that simultaneously amplifies 27 loci (genetic markers) in a single reaction, providing the highest discrimination power among current forensic kits.",
      approval:
        "FBI (Federal Bureau of Investigation) approved for use in forensic laboratories creating DNA profiles and uploading to the CODIS (Combined DNA Index System) database.",
      loci: "27 loci",
    },
    {
      id: 2,
      name: "Global Filer (Mỹ)",
      shortName: "GlobalFiler™ PCR Amplification Kit",
      image: "/images/GlobalFiler.jpg",
      manufacturer: "Thermo Fisher Scientific, USA",
      purpose:
        "This kit is designed for PCR (Polymerase Chain Reaction) amplification of human DNA, serving genetic analysis in forensics, personal identification, paternity determination, and DNA database construction.",
      kitType:
        "This is a 6-dye multiplex STR (Short Tandem Repeat) kit that simultaneously amplifies 24 loci (genetic markers) in a single reaction, providing the highest discrimination power among current forensic kits.",
      approval:
        "FBI (Federal Bureau of Investigation) approved for use in forensic laboratories creating DNA profiles and uploading to the CODIS (Combined DNA Index System) database.",
      loci: "24 loci",
    },
  ];

  const openModal = (kit) => {
    setSelectedKit(kit);
  };

  const closeModal = () => {
    setSelectedKit(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative text-white h-[600px] mt-10 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://drugtesters.net/wp-content/uploads/2024/12/MDT-1-768x432.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1
            className="text-5xl font-bold mb-6"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            DNA Testing Service
          </h1>
          <p
            className="text-base mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            DNA testing analyzes genetic information from chromosomes to
            determine biological relationships between individuals. This
            advanced scientific method provides accurate lineage determination
            through comprehensive genetic analysis, making it the most reliable
            approach for establishing family connections.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ 99.9% Accuracy</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Multiple Test Types</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Fast Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Types of DNA Testing Services
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-3 text-black">
                      {service.title}
                    </h3>

                    <div
                      className="w-16 h-0.5 mb-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                      }}
                    ></div>

                    <div className="min-h-[3rem] mb-3">
                      <p className="text-sm font-medium text-gray-700 italic leading-relaxed">
                        {service.subtitle}
                      </p>
                    </div>
                    <div className="min-h-[4.5rem] mb-4">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-lg font-bold text-gray-900">
                      Starting from {service.price}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {service.turnaround}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <Link
                    to={service.link}
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 
    hover:from-sky-600 hover:via-blue-700 hover:to-blue-800 text-white font-medium text-sm rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    View Details
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Types Section */}
      <div className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sample Types for Testing
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {sampleTypes.map((sample) => (
              <div
                key={sample.id}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={sample.image}
                    alt={sample.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hidden">
                    <span className="text-white text-xl font-bold">
                      {sample.name[0]}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {sample.name}
                </h3>

                <p className="text-sm text-gray-600">{sample.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testing Kits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Testing Kits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              State-of-the-art DNA analysis kits used in our laboratory for
              precise and reliable results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {testingKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
              >
                {/* Kit Image */}
                <div className="h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}
                  >
                    <div className="text-center text-white">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                      </svg>
                      <p className="text-sm font-medium">DNA Testing Kit</p>
                    </div>
                  </div>
                </div>

                {/* Kit Information */}
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-black">
                    {kit.name}
                  </h3>

                  <button
                    onClick={() => openModal(kit)}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:via-blue-700 hover:to-blue-800 text-white font-medium text-sm rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    View Details
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay blur giống Non-Legal DNA */}
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-md transition-all duration-200"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black">
                {selectedKit.shortName}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Kit Image */}
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedKit.image}
                    alt={selectedKit.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}
                  >
                    <div className="text-center text-white">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                      </svg>
                      <p className="text-sm font-medium">DNA Testing Kit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kit Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Manufacturer
                  </h3>
                  <p className="text-gray-700">{selectedKit.manufacturer}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Purpose
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedKit.purpose}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Kit Type
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedKit.kitType}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Approval
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedKit.approval}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commitment Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              DNA Testing Service Quality Guarantee at Genetix
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                1. Absolute Analytical Accuracy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Genetix employs state-of-the-art DNA analytical technologies,
                ensuring accuracy rates of up to 99.9999% for inclusion of
                biological relationships and 100% for exclusion. All testing
                procedures strictly adhere to international quality standards,
                delivering the most reliable and conclusive results.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                2. Absolute Confidentiality and Data Protection
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We are committed to maintaining complete confidentiality of all
                personal information and test results. All data is stored and
                managed through advanced security systems with strict access
                controls, ensuring information is only released to authorized
                personnel and designated recipients.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                3. Rapid Turnaround Time
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Understanding the critical importance of timely results for
                important decisions, Genetix guarantees result delivery within
                2-7 business days (depending on test type). For urgent cases,
                expedited processing services are available upon request to
                provide faster turnaround times.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                4. Comprehensive Post-Testing Support
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Following result delivery, our team of genetic counselors and
                laboratory specialists remains available for consultation,
                interpretation assistance, and ongoing support to help clients
                understand the significance of their test results. Additionally,
                we provide legal support services when results are required for
                administrative or legal proceedings.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                5. Expert Laboratory Personnel
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our laboratory is staffed by highly trained molecular
                biologists, genetic analysts, and certified laboratory
                technicians with extensive experience in DNA analysis. Genetix's
                commitment to excellence ensures complete confidence in every
                service we provide.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                With these commitments, Genetix continuously strives to deliver
                the highest quality DNA testing services with uncompromising
                standards of accuracy, reliability, and professionalism, meeting
                all client needs with excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesOverview;

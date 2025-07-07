import React from "react";
import { ArrowRight, Info } from "lucide-react";

const Pricing = () => {
  const legalServices = [
    {
      name: "DNA Testing for Birth Registration",
      time: "3–7 working days",
      price: "3,500,000 VND",
      express: "+2,500,000 VND",
    },
    {
      name: "DNA Testing for Immigration Cases",
      time: "3–7 working days",
      price: "6,000,000 VND",
      express: "+2,500,000 VND",
    },
    {
      name: "DNA Testing for Inheritance or Asset Division",
      time: "3–7 working days",
      price: "4,000,000 VND",
      express: "+2,500,000 VND",
    },
  ];

  const nonLegalServices = [
    {
      name: "Paternity Testing",
      time: "2–3 working days",
      price: "2,500,000 VND",
      express: "+2,000,000 VND",
    },
    {
      name: "Maternity Testing",
      time: "2–3 working days",
      price: "2,500,000 VND",
      express: "+2,000,000 VND",
    },
    {
      name: "Non-Invasive Relationship Testing (NIPT)",
      time: "5–7 working days",
      price: "10,000,000 VND",
      express: "+3,000,000 VND",
    },
    {
      name: "Sibling Testing",
      time: "3–5 working days",
      price: "3,500,000 VND",
      express: "+2,000,000 VND",
    },
    {
      name: "Grandparent Testing",
      time: "3–5 working days",
      price: "3,500,000 VND",
      express: "+2,000,000 VND",
    },
  ];

  const mediationMethods = [
    {
      method: "Staff Collection",
      price: "500,000 VND",
      description:
        "Professional medical staff visits your location for sample collection",
      icon: "👨‍⚕️",
    },
    {
      method: "Postal Delivery",
      price: "250,000 VND",
      description:
        "Sample collection kit delivered to your address via postal service",
      icon: "📦",
    },
    {
      method: "Walk-in Service",
      price: "Free",
      description:
        "Visit our facility for professional sample collection at no additional cost",
      icon: "🏥",
    },
  ];

  const Table = ({ title, data, showButton, buttonText, buttonLink }) => (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <div
          className="w-24 h-1 mx-auto mb-6"
          style={{
            background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
          }}></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead
              style={{
                background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
              }}>
              <tr>
                <th className="text-left px-6 py-4 text-white font-semibold">
                  Service
                </th>
                <th className="text-left px-6 py-4 text-white font-semibold">
                  Processing Time
                </th>
                <th className="text-left px-6 py-4 text-white font-semibold">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-white font-semibold">
                  Express Service
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors duration-200`}>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">{item.time}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {item.price}
                  </td>
                  <td className="px-6 py-4 font-semibold text-orange-600">
                    {item.express}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showButton && (
        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = buttonLink)}
            className="inline-flex items-center justify-center px-8 py-4 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
            }}>
            {buttonText}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative text-white h-[600px] mt-10 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://cdn.health-street.net/9/1/images/76d09e796fa9/dna-test.jpg?v=2024')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>

        <div
          className="relative max-w-7xl mx-auto px-6 text-center"
          style={{
            textShadow:
              "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
          }}>
          {/* Title with subtle drop shadow instead of stroke */}
          <h1 className="text-5xl font-bold mb-6 drop-shadow-2xl">
            DNA Testing Price List
          </h1>

          {/* Description container for better readability */}
          <p
            className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}>
            Find the pricing and turnaround time for each DNA testing service,
            including optional express service for faster results.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="bg-white/20 rounded-full px-6 py-2">
              <span className="font-semibold">✓ Transparent Pricing</span>
            </div>
            <div className="bg-white/20 rounded-full px-6 py-2">
              <span className="font-semibold">✓ Express Options</span>
            </div>
            <div className="bg-white/20 rounded-full px-6 py-2">
              <span className="font-semibold">✓ Professional Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Legal DNA Testing Table */}
          <Table
            title="Legal DNA Testing"
            data={legalServices}
            showButton={true}
            buttonText="Start Legal DNA Testing"
            buttonLink="/services/legal"
          />

          {/* Non-Legal DNA Testing Table */}
          <Table
            title="Non-Legal DNA Testing"
            data={nonLegalServices}
            showButton={true}
            buttonText="Start Non-Legal DNA Testing"
            buttonLink="/services/non-legal"
          />

          {/* Collection Method Fees */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Collection Method Fees
              </h2>
              <div
                className="w-24 h-1 mx-auto mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                }}></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Additional fees for different sample collection methods
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mediationMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:transform hover:scale-105">
                  <div className="p-8 text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                      }}>
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {method.method}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {method.description}
                    </p>
                    <div
                      className={`text-2xl font-bold mb-2 ${
                        method.price === "Free" ? "text-green-600" : ""
                      }`}
                      style={
                        method.price !== "Free"
                          ? {
                              background:
                                "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }
                          : {}
                      }>
                      {method.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Express Service Notice */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0 mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                  }}>
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Express Service Notice
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Customers who choose <strong>Express Service</strong> (only
                    applicable for <strong>Staff Collection</strong> and{" "}
                    <strong>Walk-in Service</strong>) will not be charged{" "}
                    separately for <strong>Collection Method</strong> fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

import React from "react";
import { ArrowRight, UserPlus } from "lucide-react";

const Guide = () => {
  const guideSteps = [
    {
      id: 1,
      title: "Guests (Unregistered Users)",
      icon: "👥",
      items: [
        "Explore our homepage to learn about our facility and DNA testing services.",
        "Understand the difference between Non-Legal and Legal DNA testing: procedures, timelines, pricing.",
        "Read blog articles for insights into DNA testing and legal procedures.",
        "Browse customer reviews for feedback from real clients.",
        "Create an account or log in to book services and access all features.",
      ],
    },
    {
      id: 2,
      title: "Registered Users (Customers)",
      icon: "👤",
      items: [
        "Browse homepage, promotions, and service pricing.",
        "Read, like, and comment on blog content.",
        "Manage your profile: update personal info, view test history, and adjust settings.",
        "Book DNA tests: choose between home or facility sample collection.",
        "Track test status and receive real-time updates.",
        "Leave ratings and feedback; contact support as needed.",
      ],
    },
    {
      id: 3,
      title: "How to Book a DNA Test",
      icon: "📋",
      items: [
        "Select a service: Legal or Non-Legal DNA Testing.",
        "Choose a collection method: Home or Facility.",
        "Depending on the method, choose delivery type: Postal, Staff Visit, or Walk-in.",
        "Postal delivery is only for Non-Legal tests.",
        "For Staff Visit or Walk-in, pick a date and time.",
        "For Postal, choose a delivery date and return the kit within 3 days.",
        "Express service available for Staff Visit and Walk-in only.",
        "Make payment based on your selections.",
        "Receive a confirmation email and order status updates.",
      ],
    },
    {
      id: 4,
      title: "Monitoring the Process",
      icon: "🔬",
      items: [
        "Track your order status in real time.",
        "If using Postal or Staff Collection, expect kit/staff on scheduled date.",
        "Send the sample to our lab (or return kit within 3 days).",
        "Postal bookings not returned in time will be canceled.",
        "Get notified once results are ready.",
      ],
    },
    {
      id: 5,
      title: "Viewing Your Results",
      icon: "📊",
      items: [
        "Securely view your test report online.",
        "Download results as PDF.",
        "Access history of past tests and invoices.",
        "Update personal and test-related information as needed.",
      ],
    },
    {
      id: 6,
      title: "Customer Support & Feedback",
      icon: "💬",
      items: [
        "Rate services and leave feedback.",
        "Reach out via ticket system or live chat.",
        "Explore our FAQ and Help Guides.",
        "Edit or delete feedback within a limited time window.",
      ],
    },
  ];

  const paymentMethods = [
    {
      name: "QR Pay",
      icon: "📱",
      color: "from-blue-500 to-indigo-500",
      description: "For Home Collection (Staff Collection or Postal Delivery)",
      features: [
        "Self-collection at home (Postal Delivery)",
        "Medical staff home visit (Staff Collection)",
        "15-minute payment window",
        "Instant confirmation",
      ],
    },
    {
      name: "Cash/Card",
      icon: "💰",
      color: "from-green-500 to-emerald-500",
      description: "Direct payment at medical facility (Walk-in Service)",
      features: [
        "Pay at medical facility",
        "Cash or card accepted",
        "Immediate sample collection",
        "No time restrictions",
      ],
    },
  ];

 const collectionMethods = [
    {
      title: "At Facility (Walk-in Service)",
      description: "Come to our facility for professional sample collection",
      paymentMethod: "Cash/Card",
      serviceTypes: ["Legal", "Non-Legal"],
      steps: [
        "Book appointment at facility.",
        "Visit our medical center on the scheduled date and time.",
        "Pay directly at facility.",
        "Professional sample collection.",
        "Immediate lab processing.",
      ],
      icon: "🏥",
    },
    {
      title: "At Home (Staff Collection)",
      description: "Our medical staff visits your home for sample collection",
      paymentMethod: "QR Pay",
      serviceTypes: ["Legal", "Non-Legal"],
      steps: [
        "Book appointment for home visit.",
        "Pay via QR Pay to confirm booking.",
        "Medical staff visits your location on the scheduled date and time.",
        "Professional sample collection.",
        "Immediate lab processing.",
      ],
      icon: "👨‍⚕️",
    },
    {
      title: "At Home (Postal Delivery)",
      description:
        "Collect samples yourself using our kit, delivered via postal service (only for Non-Legal cases)",
      paymentMethod: "QR Pay",
      serviceTypes: ["Non-Legal"], // Only for Non-Legal as per rule
      steps: [
        "Choose Non-Legal service and confirm your address for kit delivery.",
        "Pay via QR Pay to confirm booking.",
        "Receive sample collection kit by postal delivery on the selected date.",
        "Follow instructions to collect sample.",
        "Return the sample to our facility within 3 days. Booking will be cancelled if not returned.",
      ],
      icon: "🏠",
    },
  ];

  const orderTimeline = [
    {
      status: "Waiting Confirmed",
      description: "Order submitted, awaiting confirmation",
      icon: "⏳",
    },
    {
      status: "Booking Confirmed",
      description: "Appointment or kit delivery confirmed and scheduled",
      icon: "✅",
    },
    {
      status: "Awaiting Sample",
      description:
        "Sample kit sent (for Postal Delivery) or appointment scheduled (for Walk-in/Staff Collection)",
      icon: "📦",
    },
    {
      status: "In Progress",
      description: "Sample received and being analyzed",
      icon: "🔬",
    },
    {
      status: "Ready",
      description: "Analysis complete, results being prepared",
      icon: "📋",
    },
    {
      status: "Completed",
      description: "Results ready and delivered to your account",
      icon: "📊",
    },
    {
      status: "Cancelled",
      description: "Booking cancelled (e.g., kit not returned on time)",
      icon: "❌",
    },
  ];

  const handleStartTesting = () => {
    window.location.href = "/services";
  };

  const handleCreateAccount = () => {
    window.location.href = "/register";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative text-white h-[600px] mt-10 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://cdn.glasspress.io/health-street.net/blog/understanding-dna-results-image-featured.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1
            className="text-5xl font-bold mb-6"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}>
            DNA Testing Service Guide
          </h1>
          <p
            className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}>
            Welcome to our comprehensive DNA Testing Service Platform. This
            guide will help you understand how to explore, register, and use our
            services effectively for accurate and reliable genetic testing.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Step-by-Step Guide</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Easy to Follow</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Complete Process</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Guide Steps */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Service Guide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these comprehensive steps to make the most of our DNA
              testing services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {guideSteps.map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mr-4"
                      style={{
                        background:
                          "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                      }}>
                      {step.icon}
                    </div>
                    <h3
                      className="text-xl font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>
                      {step.title}
                    </h3>
                  </div>

                  <div
                    className="w-16 h-0.5 mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>

                  <ul className="space-y-3">
                    {step.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                          }}></div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Methods Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sample Collection Methods
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the collection method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {collectionMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                      }}>
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {method.description}
                    </p>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${
                        method.paymentMethod === "QR Pay"
                          ? "from-blue-500 to-indigo-500"
                          : "from-green-500 to-emerald-500"
                      }`}>
                      {method.paymentMethod}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {method.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5"
                          style={{
                            background:
                              "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                          }}>
                          {stepIndex + 1}
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Methods
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the payment method that suits your collection preference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:transform hover:scale-105">
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 bg-gradient-to-r ${method.color}`}>
                      {method.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {method.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {method.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {method.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                          }}></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Timeline Section - Horizontal */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Order Timeline
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track your order through each stage of the testing process
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Horizontal Timeline Line */}
              <div
                className="absolute top-8 left-8 right-8 h-0.5 hidden md:block"
                style={{
                  background:
                    "linear-gradient(90deg, #023670 0%, #2563eb 100%)",
                }}></div>

              {/* Timeline Items */}
              <div className="grid grid-cols-1 md:grid-cols-8 gap-8 md:gap-4">
                {orderTimeline.map((stage, index) => (
                  <div key={index} className="relative text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4 relative z-10"
                      style={{
                        background:
                          "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                      }}>
                      {stage.icon}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">
                      {stage.status}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {stage.description}
                    </p>

                    {/* Mobile connector line */}
                    {index < orderTimeline.length - 1 && (
                      <div
                        className="w-0.5 h-8 mx-auto mt-4 md:hidden"
                        style={{
                          background:
                            "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                        }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Support Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Security & Support
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy and satisfaction are our top priorities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                  }}>
                  🔒
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Security Features
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>
                  <span className="text-gray-700 text-sm">
                    Secure data encryption and storage
                  </span>
                </li>
                <li className="flex items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>
                  <span className="text-gray-700 text-sm">
                    Automatic logout after inactivity
                  </span>
                </li>
                <li className="flex items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>
                  <span className="text-gray-700 text-sm">
                    Confidential result delivery
                  </span>
                </li>
                <li className="flex items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>
                  <span className="text-gray-700 text-sm">
                    GDPR compliant data handling
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                  }}>
                  🎧
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Customer Support
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>
                  <span className="text-gray-700 text-sm">
                    24/7 customer support via ticket system
                  </span>
                </li>
                <li className="flex items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>
                  <span className="text-gray-700 text-sm">
                    Live chat assistance during business hours
                  </span>
                </li>
                <li className="flex items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>
                  <span className="text-gray-700 text-sm">
                    Comprehensive FAQ and user guides
                  </span>
                </li>
                <li className="flex items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}></div>
                  <span className="text-gray-700 text-sm">
                    Expert consultation for result interpretation
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow this guide to navigate our platform with confidence and get
            the most accurate DNA testing results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleCreateAccount}
              className="inline-flex items-center justify-center px-8 py-4 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
              }}>
              <UserPlus className="mr-2 w-5 h-5" />
              Create Your Account
            </button>
            <button
              onClick={handleStartTesting}
              className="inline-flex items-center justify-center px-8 py-4 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
              }}>
              Start Your DNA Testing
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;

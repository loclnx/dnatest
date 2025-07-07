import React from "react";
import { Phone, Mail, MapPin, UserPlus, ArrowRight } from "lucide-react";

const contacts = [
  {
    icon: (
      <a
        href="tel:+84901452366"
        className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 group"
        tabIndex={-1}
        aria-label="Call Phone Support">
        <Phone className="w-8 h-8" style={{ color: "white" }} />
      </a>
    ),
    title: "Phone Support",
    desc: "Call us directly for immediate assistance",
    content: (
      <div className="text-center">
        <a
          href="tel:+84901452366"
          className="text-2xl font-bold hover:opacity-80 transition-opacity block"
          style={{
            background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
          +84 901 452 366
        </a>
        <p className="text-sm text-green-600 mt-2 font-medium">
          Available 24/7
        </p>
      </div>
    ),
  },
  {
    icon: (
      <a
        href="https://mail.google.com/mail/?view=cm&to=genetixcontactsp@gmail.com&su=Support%20for%20DNA%20testing%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 group"
        tabIndex={-1}
        aria-label="Email Support">
        <Mail className="w-8 h-8" style={{ color: "white" }} />
      </a>
    ),
    title: "Email Support",
    desc: "Send us a detailed message",
    content: (
      <div className="text-center">
        <a
          href="https://mail.google.com/mail/?view=cm&to=genetixcontactsp@gmail.com&su=Support%20for%20DNA%20testing%20services"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold hover:opacity-80 transition-opacity block break-words"
          style={{
            background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
          genetixcontactsp@gmail.com
        </a>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          We'll respond within 24 hours
        </p>
      </div>
    ),
  },
  {
    icon: (
      <a
        href="https://maps.app.goo.gl/sVkfKF45QDd8PgdMA"
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 flex items-center justify-center flex-shrink-0 group"
        tabIndex={-1}
        aria-label="Visit Our Office on Google Maps"
        style={{
          background: "white",
          borderRadius: "9999px",
          border: "3.5px solid #ef2323",
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
        }}>
        <MapPin
          className="w-10 h-10"
          style={{
            color: "#ef2323",
            background: "white",
            borderRadius: "9999px",
          }}
        />
      </a>
    ),
    title: "Visit Our Office",
    desc: "Professional medical facility",
    content: (
      <div className="text-center">
        <a
          href="https://maps.app.goo.gl/sVkfKF45QDd8PgdMA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold hover:opacity-80 transition-opacity block break-words"
          style={{
            background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
          7 D1 Street, Long Thanh My Ward,
          <br />
          Thu Duc City, Ho Chi Minh City, Vietnam
        </a>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Monday - Saturday: 8:00 - 12:00 & 13:00 - 17:00
          <br />
          Sunday: 8:00 - 12:00 Open Morning Only
        </p>
      </div>
    ),
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative text-white h-[600px] mt-10 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://cdn.maticagroup.com/assets/files/Contact-us-2500px.jpg')",
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
            Contact Us
          </h1>

          {/* Description container for better readability */}
          <p
            className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}>
            Ready to get started? Our expert team is here to help you with
            professional DNA testing services.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="bg-white/20 rounded-full px-6 py-2">
              <span className="font-semibold">✓ 24/7 Support</span>
            </div>
            <div className="bg-white/20 rounded-full px-6 py-2">
              <span className="font-semibold">✓ Expert Team</span>
            </div>
            <div className="bg-white/20 rounded-full px-6 py-2">
              <span className="font-semibold">✓ Professional Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Contact Methods Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get In Touch
              </h2>
              <div
                className="w-24 h-1 mx-auto mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                }}></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose your preferred way to contact us for DNA testing services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contacts.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:transform hover:scale-105">
                  <div className="p-8 text-center h-full flex flex-col items-center justify-center">
                    <div className="mb-6">{item.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                    <div className="mt-auto w-full">{item.content}</div>
                  </div>
                </div>
              ))}
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
            Contact us today for professional DNA testing services and get
            accurate results with our expert team support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+84901452366"
              className="inline-flex items-center justify-center px-8 py-4 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                textDecoration: "none",
              }}>
              <Phone className="mr-2 w-5 h-5" style={{ color: "white" }} />
              Call Us Now
            </a>
            <a
              href="mailto:genetixcontactsp@gmail.com"
              className="inline-flex items-center justify-center px-8 py-4 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                textDecoration: "none",
              }}>
              <Mail className="mr-2 w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

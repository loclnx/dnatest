import React from "react";
import {
  FaBaby,
  FaPassport,
  FaMoneyBillWave,
  FaHome,
  FaBuilding,
  FaMailBulk,
  FaUserNurse,
} from "react-icons/fa";

// ===== DỮ LIỆU DỊCH VỤ LEGAL DNA TESTING =====
export const legalServicesData = [
  {
    id: 1,
    serviceID: "SL001",
    name: "DNA Testing for Birth Certificate",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 3500000,
    expressPrice: 2500000,
    icon: <FaBaby className="text-xl" />,
    backgroundImage:
      "https://images2.thanhnien.vn/528068263637045248/2023/6/29/giay-khai-sinh-2-1688001417801425690462.jpg",
    description: `**DNA Testing for Birth Certificate**

Court-admissible DNA testing for official birth registration and legal documentation.

**When is DNA Testing Required for Birth Registration?**

DNA testing for birth registration is required in the following cases:

• Initial birth registration when the parents have not registered their marriage or registered their marriage after the child's birth.
• Changing the child's surname to the biological father's surname when the child was initially registered under the mother's surname.
• The biological father is in an existing marriage with another person (child born out of wedlock) and wishes to register the child's birth.
• The mother has not divorced or has been divorced for less than 300 days from a previous husband and has a child with another man, wishing to register the child with the biological father.
• One of the parents is a foreign national.
• Establishing parental rights or child support obligations.

**Note:** For detailed information, refer to [Cases Requiring DNA Testing for Birth Registration](https://thuvienphapluat.vn/phap-luat/co-bat-buoc-xet-nghiem-adn-cha-con-de-lam-giay-khai-sinh-hay-khong-theo-quy-dinh-phap-luat-hien-nay-572128-148310.html).

In the above cases, the child is not yet legally recognized as the biological child of both parents.

**DNA Test Results as Evidence**

According to [Article 14 of Circular 04/2020/TT-BTP](https://thuvienphapluat.vn/van-ban/Quyen-dan-su/Thong-tu-04-2020-TT-BTP-huong-dan-Luat-ho-tich-va-Nghi-dinh-123-2015-ND-CP-ve-ho-tich-446237.aspx) issued by the Ministry of Justice, DNA test results for birth registration serve as evidence to establish the parent-child relationship.

**Evidence to Prove Parent-Child Relationships**

Evidence includes:
• Documents issued by medical institutions, forensic agencies, or other competent authorities in Vietnam or abroad confirming the parent-child relationship.
• In the absence of such evidence, the parties acknowledging the parent-child relationship must provide a written declaration of the relationship as stipulated in Article 5 of the Circular, supported by at least two witnesses attesting to the parent-child relationship.

**Applications of DNA Test Results for Birth Registration**

With DNA test results as evidence of the parent-child relationship, families can proceed with the following procedures:
• Birth registration combined with parental acknowledgment: For children who have not yet been registered and need both biological parents' names included in the birth certificate and civil registry.
• Parental acknowledgment registration: For children who have already been registered with only the mother's or father's name and now require the addition of the other biological parent's name to the civil registry and birth certificate, or when the parent listed in the birth certificate is not the biological parent.
• Birth registration combined with parental acknowledgment involving foreign elements: For children who have not yet been registered and need both biological parents' names included in the birth certificate and civil registry, where one parent is a foreign national.

However, for DNA testing for birth registration, which falls under the category of administrative-legal DNA testing, the DNA testing specialist is required to directly collect DNA samples from the individuals being tested. Therefore, blood samples and oral mucosal samples (saliva) are prioritized.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Legal DNA testing ensures complete chain of custody and court admissibility with >99.999999% accuracy***`,
  },
  {
    id: 2,
    serviceID: "SL002",
    name: "DNA Testing for Immigration Cases",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 6000000,
    expressPrice: 2500000,
    icon: <FaPassport className="text-xl" />,
    backgroundImage:
      "https://www.cis.vn/wp-content/uploads/2021/11/huong-dan-thu-tuc-xin-song-tich-cho-viet-kieu1.jpg",
    description: `**Why is DNA Testing Required for Sponsorship, Immigration, and Naturalization?**

In the process of applying for a visa, exit procedures, immigration, or permanent residency, providing legal documentation to prove a biological relationship between the sponsor and the sponsored individual is a prerequisite.

According to regulations of embassies and consulates of various countries, initial documents such as birth certificates, marriage certificates, and other supporting evidence like diplomas, photographs, or confirmation letters are often deemed insufficient or invalid. Therefore, a DNA test result verifying a biological relationship is considered the most accurate and reliable documented evidence.

As per the United States Citizenship and Immigration Services (USCIS), based on the most precise scientific evidence to confirm biological relationships, sponsors for immigration are required to undergo DNA testing and submit the test results to complete their application process.

**The types of DNA tests commonly required for immigration purposes include:**

• Paternity DNA testing (father-child)
• Maternity DNA testing (mother-child)
• Sibling DNA testing (between siblings)
• Grandparent DNA testing (grandparent-grandchild)

If the DNA test results conclude that there is NO biological relationship between the individuals involved, the embassy or consulate has grounds to reject the application. Conversely, if the DNA test results confirm a biological relationship between the tested individuals (the sponsor and the sponsored person), this serves as a basis for further review and processing of the application.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Internationally recognized results accepted by immigration authorities with >99.999999% accuracy***`,
  },
  {
    id: 3,
    serviceID: "SL003",
    name: "DNA Testing for Inheritance or Asset Division",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 4000000,
    expressPrice: 2500000,
    icon: <FaMoneyBillWave className="text-xl" />,
    backgroundImage:
      "https://images2.thanhnien.vn/528068263637045248/2023/6/15/thua-ke-16868272484361420781118.jpg",
    description: `**DNA Testing for Inheritance or Asset Division**

DNA testing is used in cases where it has not yet been verified whether an individual has a biological relationship with the person whose estate is to be inherited. For example: an illegitimate child or a child born out of wedlock claiming inheritance from their biological father; a long-lost relative who has been located, etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Court-approved testing for legal inheritance proceedings with >99.999999% accuracy***`,
  },
];

// ===== DỮ LIỆU PHƯƠNG THỨC LẤY MẪU LEGAL =====
export const legalCollectionMethodsData = [
  {
    key: "at-home",
    name: "At Home",
    icon: <FaHome className="text-2xl text-blue-700" />,
    description: "Choose a sample mediation method below:",
    mediationMethods: [
      {
        key: "postal-delivery",
        name: "Postal Delivery",
        icon: <FaMailBulk className="text-xl text-blue-600" />,
        price: 250000,
        description: "Self-collection kit delivered by post",
      },
      {
        key: "staff-collection",
        name: "Staff Collection",
        icon: <FaUserNurse className="text-xl text-blue-600" />,
        price: 500000,
        description: "Professional staff collects sample at your home",
      },
    ],
  },
  {
    key: "at-facility",
    name: "At Facility",
    icon: <FaBuilding className="text-2xl text-blue-700" />,
    description: "Visit our facility for sample collection",
    mediationMethods: [
      {
        key: "walk-in",
        name: "Walk-in Service",
        icon: <FaBuilding className="text-xl text-blue-600" />,
        price: null,
        description: "Visit our facility for sample collection",
      },
    ],
  },
];
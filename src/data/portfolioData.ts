import { PortfolioData, ProjectCaseStudy, Milestone, SkillItem, SocialLink } from '../types';

export interface WhatIDoItem {
  number: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  scoreOrDetail: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  focus: string;
}

export const whatIDoData: WhatIDoItem[] = [
  {
    number: "01",
    title: "CYBER SECURITY",
    summary: "Analyzing network traffic, identifying system vulnerabilities, evaluating threat models, and understanding defense mechanisms to keep applications and networks resilient against attacks.",
    tags: ["Network Security", "Threat Analysis", "Vulnerability Assessment", "Traffic Inspection"]
  },
  {
    number: "02",
    title: "WEB & APP DEVELOPMENT",
    summary: "Designing and building functional applications from user interface to backend logic, using React, Next.js, Python, and Streamlit with a focus on usability and clean structure.",
    tags: ["React", "Next.js", "Python", "Streamlit", "Responsive UI"]
  },
  {
    number: "03",
    title: "DATA ANALYTICS",
    summary: "Extracting and transforming data with SQL and Excel, building interactive Power BI dashboards, and uncovering patterns to guide practical, evidence-based decisions.",
    tags: ["Power BI", "SQL Queries", "Data Modeling", "Executive Dashboards"]
  },
  {
    number: "04",
    title: "SOFTWARE / TECHNOLOGY",
    summary: "Writing reliable code in Python, Java, C, and C++, building automation scripts, integrating APIs, and testing systems to ensure stability and performance.",
    tags: ["Python", "Java", "C / C++", "Automation Scripts", "System Testing"]
  }
];

export const editorialSkills = {
  cybersecurity: [
    "Network Security",
    "Information Security",
    "Vulnerability Assessment",
    "Threat Analysis",
    "Risk Assessment",
    "Security Fundamentals"
  ],
  programming: [
    "Python",
    "Java",
    "C",
    "C++",
    "SQL"
  ],
  development: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Streamlit",
    "Firebase"
  ],
  data: [
    "Power BI",
    "Data Analysis",
    "Data Visualization",
    "Dashboard Development",
    "Microsoft Excel"
  ]
};

export const educationData: EducationItem[] = [
  {
    degree: "B.E. CYBER SECURITY",
    institution: "Sri Ram Engineering College",
    period: "2024 — 2027",
    scoreOrDetail: "Undergraduate degree focusing on application security, network protection, and systems defense. Participant in Smart India Hackathon (Space Technology domain)."
  },
  {
    degree: "DIPLOMA — ELECTRONICS & COMMUNICATION ENGINEERING",
    institution: "CPCL Polytechnic College",
    period: "2020 — 2023",
    scoreOrDetail: "Graduated with 86%. Built foundational knowledge in digital circuits, microprocessors, communication protocols, and hardware debugging."
  }
];

export const certificationsData: CertificationItem[] = [
  {
    name: "Power BI Data Analytics",
    issuer: "Business Intelligence Certification",
    focus: "DAX calculations, relational data modeling, and executive KPI reporting"
  },
  {
    name: "Data Analytics Certification",
    issuer: "Analytics Foundation",
    focus: "Statistical data cleansing, SQL extraction, and data visualization"
  },
  {
    name: "Python Programming",
    issuer: "Technical Foundations",
    focus: "Core Python algorithms, data structures, and script automation"
  },
  {
    name: "Cyber Security Fundamentals",
    issuer: "Security Practice",
    focus: "Information security principles, perimeter defense, and vulnerability triage"
  }
];

export const portfolioData: PortfolioData = {
  firstName: "SATHYA SAI",
  lastName: "JS",
  rolePrimary: "Web & App Developer",
  roleSecondary: "Cyber Security Engineer",
  roleExtra: "Data Analyst",
  intro: "Hi, I'm Sathya. I build web and mobile experiences, work with cybersecurity, and turn data into useful insights.",
  logoInitials: "SATHYA SAI JS",
  fullName: "Sathya Sai JS",
  age: "--",
  location: "Chennai, Tamil Nadu, India",
  email: "sathyasaijs12@gmail.com",
  phone: "+91 73056 62449",
  photo: "/images/sathya-portfolio-photo.jpg",
  secondaryPhoto: "/images/sathya-image-1.jpg",
  aboutText: "I'm a Web & App Developer, Cyber Security Engineer and Data Analyst. I enjoy building practical digital products, working with technology and understanding how systems can be made more secure and useful. Currently pursuing my B.E. in Cyber Security at Sri Ram Engineering College, following a diploma in Electronics & Communication (86%). I focus on creating reliable software, assessing security risks, and turning data into clear decisions.",
  resumeUrl: "#",
  skills: [
    {
      icon: "shield",
      title: "Cyber Security",
      desc: "Network Security, Information Security, Vulnerability Assessment, Threat Analysis, Risk Assessment, Security Fundamentals.",
      tags: ["Network Security", "Information Security", "Vulnerability Assessment", "Threat Analysis", "Risk Assessment", "Security Fundamentals"]
    },
    {
      icon: "code",
      title: "Programming",
      desc: "Python, Java, C, C++, and SQL across automation, backend systems, and data pipelines.",
      tags: ["Python", "Java", "C", "C++", "SQL"]
    },
    {
      icon: "layers",
      title: "Development",
      desc: "HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, Streamlit, and Firebase.",
      tags: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS", "Streamlit", "Firebase"]
    },
    {
      icon: "bar-chart-2",
      title: "Data",
      desc: "Power BI, Data Analysis, Data Visualization, Dashboard Development, and Microsoft Excel.",
      tags: ["Power BI", "Data Analysis", "Data Visualization", "Dashboard Development", "Microsoft Excel"]
    }
  ],
  projects: [
    {
      id: "lead-classification-system",
      number: "01",
      name: "Lead Classification and Management System",
      title: "Lead Classification and Management System",
      subtitle: "Python · Streamlit · Excel",
      category: "Python · Streamlit · Excel",
      desc: "Lead classification platform for educational institutions covering all 38 districts of Tamil Nadu. Automated categorization rules, validation checks, dashboard visualizations, and analytical reports for faster responsibility-based decisions.",
      description: "Lead classification platform for educational institutions covering all 38 districts of Tamil Nadu. Automated categorization rules, validation checks, dashboard visualizations, and analytical reports for faster responsibility-based decisions.",
      longDescription: "Developed an automated educational lead classification engine using Python and Streamlit. The tool incorporates rule-based qualification pipelines, automated input sanitation, and dynamic geographic filtering across Tamil Nadu's 38 districts. By replacing manual spreadsheet categorization, institutional staff can triage inquiries and generate analytical summaries five times faster.",
      image: "/images/project_ai_lead_ui_1787069025615.jpg",
      tags: ["Python", "Streamlit", "Excel", "Data Validation", "Automation"],
      tech: ["Python", "Streamlit", "Excel"],
      metrics: [
        { label: "GEOGRAPHIC SCOPE", value: "38 Districts" },
        { label: "TRIAGE TIME", value: "5x Faster" },
        { label: "RULE PIPELINE", value: "100% Automated" }
      ],
      highlights: [
        "Automated categorization rules and validation checks spanning all 38 districts of Tamil Nadu",
        "Streamlit-powered interactive interface with real-time district search and multi-criteria filters",
        "Exportable analytical summary reports supporting faster, responsibility-based institutional choices"
      ],
      githubUrl: "https://github.com/satboy-12"
    },
    {
      id: "blockchain-firmware-update",
      number: "02",
      name: "Blockchain-Enhanced Safe Firmware Update System for Modern Cars",
      title: "Blockchain-Enhanced Safe Firmware Update System for Modern Cars",
      subtitle: "Cybersecurity · Blockchain",
      category: "Cybersecurity · Blockchain",
      desc: "Secure blockchain-based firmware update mechanism for modern vehicles with tamper-evident and integrity controls. Presented as a research paper at the SIMATS Engineering Conference.",
      description: "Secure blockchain-based firmware update mechanism for modern vehicles with tamper-evident and integrity controls. Presented as a research paper at the SIMATS Engineering Conference.",
      longDescription: "Authored and presented academic research detailing a tamper-evident Over-The-Air (OTA) firmware distribution architecture for vehicular Electronic Control Units (ECUs). The architecture applies cryptographic hash chains and decentralized verification ledgers to detect and prevent unauthorized firmware modifications before vehicle deployment.",
      image: "/images/project_firmware_ui_1787069039612.jpg",
      tags: ["Cybersecurity", "Blockchain", "Smart Contracts", "Cryptographic Verification"],
      tech: ["Cybersecurity", "Blockchain", "Research Paper"],
      metrics: [
        { label: "CONFERENCE", value: "SIMATS 2024" },
        { label: "VERIFICATION", value: "Tamper-Evident" },
        { label: "TARGET DOMAIN", value: "Vehicular ECUs" }
      ],
      highlights: [
        "Presented academic research paper at the national SIMATS Engineering Conference",
        "Cryptographic integrity chain verifying firmware binaries prior to ECU execution",
        "Decentralized ledger validation mitigating single-point-of-failure OTA update attacks"
      ],
      githubUrl: "https://github.com/satboy-12"
    },
    {
      id: "data-analytics-dashboard",
      number: "03",
      name: "Data Analytics & Fraud Reduction Dashboard",
      title: "Data Analytics & Fraud Reduction Dashboard",
      subtitle: "Power BI · SQL · Excel",
      category: "Power BI · SQL · Excel",
      desc: "Interactive business intelligence dashboards enabling fast KPI monitoring with clear filters and drill-down views. Actionable insights generated from large datasets via SQL-based preparation and validation.",
      description: "Interactive business intelligence dashboards enabling fast KPI monitoring with clear filters and drill-down views. Actionable insights generated from large datasets via SQL-based preparation and validation.",
      longDescription: "Engineered multi-dimensional analytical dashboards in Power BI and SQL to monitor operational performance metrics. Implemented structured SQL queries for dataset deduplication and relational validation, helping operations teams identify transaction irregularities and reduce billing discrepancies.",
      image: "/images/cyber_workspace_1787052364862.jpg",
      tags: ["Power BI", "SQL", "Excel", "Data Modeling", "Business Intelligence"],
      tech: ["Power BI", "SQL", "Excel"],
      metrics: [
        { label: "DISCREPANCY DROP", value: "50% Reduction" },
        { label: "QUERY PIPELINE", value: "Structured SQL" },
        { label: "MONITORING", value: "Interactive KPI" }
      ],
      highlights: [
        "Interactive KPI monitoring panels with multi-dimensional slicers and cross-filtering",
        "SQL-based dataset extraction, deduplication, and relational validation pipelines",
        "Clear visual reporting that directly surfaces operational patterns and bottlenecks"
      ],
      githubUrl: "https://github.com/satboy-12"
    },
    {
      id: "network-security-analysis",
      number: "04",
      name: "Network Traffic & Threat Analysis Lab",
      title: "Network Traffic & Threat Analysis Lab",
      subtitle: "Wireshark · Kali Linux · Network Security",
      category: "Wireshark · Kali Linux",
      desc: "Traffic analysis and security assessment identifying suspicious patterns in simulated environments. Vulnerabilities documented with prioritized security improvements aligned to threat-analysis methodology.",
      description: "Traffic analysis and security assessment identifying suspicious patterns in simulated environments. Vulnerabilities documented with prioritized security improvements aligned to threat-analysis methodology.",
      longDescription: "Conducted simulated network penetration and deep packet inspection using Kali Linux and Wireshark. Analyzed packet flows to spot anomalous payload signatures, tested protocol vulnerabilities, and compiled prioritized remediation documentation.",
      image: "/images/cyber_shield_core_1787052350028.jpg",
      tags: ["Wireshark", "Kali Linux", "Threat Analysis", "Packet Capture", "Network Defense"],
      tech: ["Wireshark", "Kali Linux", "Threat Analysis"],
      metrics: [
        { label: "PACKET INSPECTION", value: "L2–L7 Traffic" },
        { label: "ENVIRONMENT", value: "Kali Lab" },
        { label: "REMEDIATION", value: "Documented" }
      ],
      highlights: [
        "Deep packet capture telemetry uncovering anomalous protocol payloads and spoofing attempts",
        "Structured threat modeling across simulated network topologies",
        "Clear technical reporting outlining concrete remediation steps for identified vulnerabilities"
      ],
      githubUrl: "https://github.com/satboy-12"
    }
  ],
  experience: [
    {
      year: "2025 — Present",
      title: "BSROCKS",
      subtitle: "Web & App Developer",
      desc: "Developing web and mobile user interfaces, writing clean component logic, and collaborating on modern digital application delivery.",
      description: "Developing web and mobile user interfaces, writing clean component logic, and collaborating on modern digital application delivery with React and responsive frontends.",
      active: true
    },
    {
      year: "2025 — Present",
      title: "BRAIIL ACADEMY",
      subtitle: "Technical Associate",
      desc: "Supporting technical training and academic mentorship across cybersecurity and data analytics tracks, guiding students through practical software projects.",
      description: "Supporting technical training and academic mentorship across cybersecurity and data analytics tracks, guiding students through practical software projects.",
      active: true
    },
    {
      year: "2024",
      title: "PRODIGY INFOTECH",
      subtitle: "Cyber Security Intern",
      desc: "Threat analysis, vulnerability assessment exposure, and security awareness activities, validating risks through structured testing.",
      description: "Threat analysis, vulnerability assessment exposure, and security awareness activities, validating risks through structured testing. Also completed internship exposure in Network Security (Red Hat) and Blockchain.",
      active: false
    },
    {
      year: "2023 — 2024",
      title: "OPERATIONS & FRAUD PREVENTION",
      subtitle: "Data Analysis & Testing Associate",
      desc: "End-to-end dataset validation and operational testing, applying pattern analysis to identify charge anomalies and streamline reporting workflows.",
      description: "End-to-end dataset validation and operational testing, applying pattern analysis to identify charge anomalies and streamline reporting workflows.",
      active: false
    }
  ],
  socialLinks: [
    { label: "GitHub", icon: "github", url: "https://github.com/satboy-12" },
    { label: "LinkedIn", icon: "linkedin", url: "https://linkedin.com/in/sathyasaijs" },
    { label: "Email", icon: "mail", url: "mailto:sathyasaijs12@gmail.com" }
  ]
};

export const PORTFOLIO_PROFILE = {
  ...portfolioData,
  name: portfolioData.fullName,
  role: `${portfolioData.rolePrimary} · ${portfolioData.roleSecondary} · ${portfolioData.roleExtra}`,
  bio: portfolioData.intro,
  profileImage: portfolioData.photo,
  milestones: portfolioData.experience,
  github: "https://github.com/satboy-12",
  linkedin: "https://linkedin.com/in/sathyasaijs",
  titles: [
    portfolioData.rolePrimary,
    portfolioData.roleSecondary,
    portfolioData.roleExtra
  ]
};



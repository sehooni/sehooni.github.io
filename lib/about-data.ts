import { Github, Linkedin, Mail } from 'lucide-react';
import PROJECTS_DATA from '@/content/projects_data.json';

export const ABOUT_DATA = {
    // Basic Profile Info
    name: "Sehoon",
    lastName: "Park",
    initials: "SP",
    title: "AI Research Engineer",
    location: "Seoul, South Korea",
    email: "74sehoon@gmail.com",
    avatar: "/assets/img/Self.jpeg",

    // Social Links
    social: {
        github: "https://github.com/sehooni",
        linkedin: "https://www.linkedin.com/in/sehoon-park-575b8b22a",
        email: "mailto:74sehoon@gmail.com"
    },

    // About Section
    about: {
        description: "I am an AI Research Engineer focused on Protein Structure Prediction and Structure-based Interaction Modeling. I received my M.S. in Artificial Intelligence from Hanyang University, where I built AlphaFold2-based models integrating disulfide-bond information. My research interests encompass Bioinformatics, Deep Learning, and Multimodal Learning.",
        highlights: [
            {
                title: "AI Engineer",
                description: "Specializing in LLM applications and AI.",
                icon: "Brain"
            },
            {
                title: "Structural Bioinformatics",
                description: "Researching protein structure prediction and structure-based interaction modeling.",
                icon: "Dna"
            },
            {
                title: "Developer",
                description: "Python, Linux, Docker and AI Development.",
                icon: "Code"
            }
        ]
    },

    // Education Section
    education: [
        {
            school: "Hanyang University",
            degree: "Master of Science in Artificial Intelligence",
            period: "2023.03 - 2025.02",
            location: "Seoul, Korea",
            details: "GPA: 4.0/4.5. Research on Protein Structure Prediction."
        },
        {
            school: "Incheon National University",
            degree: "Bachelor of Science in Mechanical Engineering",
            period: "2017.03 - 2023.02",
            location: "Incheon, Korea",
            details: "Capstone Design Award. Focus on Robotics and Control Theory."
        },
        {
            school: "Myungduk High School",
            degree: "High School Diploma",
            period: "2013.03 - 2016.02",
            location: "Seoul, Korea",
            details: "Served as Vice Editor-in-Chief of ENC (English Newspaper Club)."
        }
    ],

    // Experience Section
    experience: [
        {
            title: "Post-Master Researcher",
            company: "Korea Basic Science Institute (KBSI)",
            period: "2025.09 - Present",
            details: [
                "Biopharmaceuticals Research Center & Protein Structure Group",
            ]
        },
        {
            title: "Master's Student & Researcher",
            company: "Bioinformatics and Intelligent Systems Lab (BISLab), Hanyang University",
            period: "2023.02 - 2025.03",
            details: [
                "Conducted research on Protein Structure Prediction.",
                "Thesis: 'AlphaSS: Improving Protein Structure Prediction with Disulfide Bond Information'",
                "Advisor: Prof. Eunok Paek",
            ]
        },
        {
            title: "Research Assistant",
            company: "DeepFold, Korea Institute for Advanced Study (KIAS)",
            period: "2023.07 - 2025.02",
            details: [
                "Participated in CASP16 as a member of the DeepFold team.",
                "Contributed to target prediction and analysis.",
                "Achieved 3rd place in the Antibody/Peptide category.",
            ]
        },
        {
            title: "Undergraduate Research Fellow",
            company: "Biorobotics Lab, Incheon National University",
            period: "2021.03 - 2023.02",
            details: [
                "**전력설비 관리를 위한 경량형 로봇팔 부착형 무인비행체 및 운전기술 개발** (Jan. 2022 ~ Apr. 2022) / 한국전력공사 전력연구원\n\n- **[Patent]** APPARATUS FOR SUPPORTING SMART STICK (KOR 10-2022-0064648, Issued: May 26, 2022)",
                "**인공지능 비전검사를 활용한 종이용기 불량품 자동 선별 시스템 모듈 개발** (Jul. 2022 ~ Feb. 2023) / 인천대학교 산학협력단\n\n- 인공지능 모델 개발 및 Jetson-Nano를 이용한 판별 시스템 구축\n- **[Poster]** Hyeongmo Park, ... Sehoon Park et al., \"Design of Automation System for Monitoring of Defective Products in Paper container Using PLC Control and Deep Learning\", KSME 2022"
            ]
        }
    ],

    // Projects Section
    projects: PROJECTS_DATA,

    // Awards Section
    awards: {
        certifications: [
            "LG Aimers 7th AI Hackathon - Top 4% in Preliminary Round/",
            "Upstage Global AI Hackathon - Top 15 Certificate",
            "Smilegate Futurelab AI Service Weeklython - 1st Place",
            "[Patent] APPARATUS FOR SUPPORTING SMART STICK (KOR 10-2022-0064648, Issued: May 26, 2022)",

        ],
        presentations: [
            "CASP 16 (Punta Cana, Dominican Republic) - Poster Presentation",
            "BIOINFO2024 (Gyeongju, Korea) - Poster Presentation",
            "Upstage Global AI Hackathon - Project Presentation",
            "KSME2022 (Jeju, Korea) - Poster Presentation"
        ]
    },

    // Skills Section
    skills: [
        "Python",
        "PyTorch",
        "TensorFlow",
        "Git",
        "Linux",
        "Docker",
        "Next.js"
    ],

    // Interests Section
    interests: [
        "Protein Structure Prediction",
        "Generative Models",
        "Multimodal Learning"
    ]
};

import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./LogoMarquee.css";

export interface PartnerItem {
  id: string;
  nameEn: string;
  nameAr: string;
  logo: string;
  categoryEn?: string;
  categoryAr?: string;
}

export const PARTNERS_DATA: PartnerItem[] = [
  {
    id: "uae-climate-ministry",
    nameEn: "Ministry of Climate Change & Environment",
    nameAr: "وزارة التغير المناخي والبيئة",
    logo: "/partners/uae-climate-ministry.webp",
    categoryEn: "Government",
    categoryAr: "جهات حكومية"
  },
  {
    id: "enoc",
    nameEn: "ENOC",
    nameAr: "اينوك",
    logo: "/partners/enoc.webp",
    categoryEn: "Energy & Corporate",
    categoryAr: "طاقة ومؤسسات"
  },
  {
    id: "museum-of-the-future",
    nameEn: "Museum of the Future",
    nameAr: "متحف المستقبل",
    logo: "/partners/museum-of-the-future.webp",
    categoryEn: "Innovation Hub",
    categoryAr: "مراكز الابتكار"
  },
  {
    id: "youth-councils",
    nameEn: "Youth Councils",
    nameAr: "مجالس الشباب",
    logo: "/partners/youth-councils.webp",
    categoryEn: "Youth Leadership",
    categoryAr: "القيادات الشبابية"
  },
  {
    id: "arab-youth-center",
    nameEn: "Arab Youth Center",
    nameAr: "مركز الشباب العربي",
    logo: "/partners/arab-youth-center.webp",
    categoryEn: "Youth Leadership",
    categoryAr: "القيادات الشبابية"
  },
  {
    id: "youngo",
    nameEn: "YOUNGO (UNFCCC)",
    nameAr: "YOUNGO - الأمم المتحدة للمناخ",
    logo: "/partners/youngo.webp",
    categoryEn: "International & UN",
    categoryAr: "منظمات دولية وأممية"
  },
  {
    id: "iom-un-migration",
    nameEn: "IOM UN Migration",
    nameAr: "المنظمة الدولية للهجرة (IOM)",
    logo: "/partners/iom-un-migration.webp",
    categoryEn: "International & UN",
    categoryAr: "منظمات دولية وأممية"
  },
  {
    id: "eu-neighbours",
    nameEn: "EU Neighbours South",
    nameAr: "الاتحاد الأوروبي (EU Neighbours South)",
    logo: "/partners/eu-neighbours.webp",
    categoryEn: "International & UN",
    categoryAr: "منظمات دولية وأممية"
  },
  {
    id: "zayed-university",
    nameEn: "Zayed University",
    nameAr: "جامعة زايد",
    logo: "/partners/zayed-university.webp",
    categoryEn: "Academia",
    categoryAr: "جامعات وأكاديميا"
  },
  {
    id: "khalifa-university",
    nameEn: "Khalifa University",
    nameAr: "جامعة خليفة",
    logo: "/partners/khalifa-university.webp",
    categoryEn: "Academia",
    categoryAr: "جامعات وأكاديميا"
  },
  {
    id: "heliopolis-university",
    nameEn: "Heliopolis University",
    nameAr: "جامعة هليوبوليس للتنمية المستدامة",
    logo: "/partners/heliopolis-university.webp",
    categoryEn: "Academia",
    categoryAr: "جامعات وأكاديميا"
  },
  {
    id: "uaeu",
    nameEn: "United Arab Emirates University",
    nameAr: "جامعة الإمارات العربية المتحدة",
    logo: "/partners/uaeu.webp",
    categoryEn: "Academia",
    categoryAr: "جامعات وأكاديميا"
  },
  {
    id: "american-university-of-sharjah",
    nameEn: "American University of Sharjah",
    nameAr: "الجامعة الأميركية في الشارقة",
    logo: "/partners/american-university-of-sharjah.webp",
    categoryEn: "Academia",
    categoryAr: "جامعات وأكاديميا"
  },
  {
    id: "schneider-electric",
    nameEn: "Schneider Electric",
    nameAr: "شنايدر إلكتريك",
    logo: "/partners/schneider-electric.webp",
    categoryEn: "Sustainability Tech",
    categoryAr: "تكنولوجيا الاستدامة"
  },
  {
    id: "cop29-baku",
    nameEn: "COP29 Azerbaijan",
    nameAr: "مؤتمر المناخ COP29",
    logo: "/partners/cop29-baku.webp",
    categoryEn: "Global Conferences",
    categoryAr: "مؤتمرات عالمية"
  },
  {
    id: "world-utilities-congress",
    nameEn: "World Utilities Congress",
    nameAr: "الكونغرس العالمي للمرافق",
    logo: "/partners/world-utilities-congress.webp",
    categoryEn: "Global Conferences",
    categoryAr: "مؤتمرات عالمية"
  },
  {
    id: "iucn",
    nameEn: "IUCN World Conservation Congress",
    nameAr: "الاتحاد الدولي لحماية الطبيعة IUCN",
    logo: "/partners/iucn.webp",
    categoryEn: "Conservation",
    categoryAr: "حماية البيئة"
  },
  {
    id: "inco-academy",
    nameEn: "INCO Academy",
    nameAr: "أكاديمية INCO",
    logo: "/partners/inco-academy.webp",
    categoryEn: "Education",
    categoryAr: "تعليم وتدريب"
  },
  {
    id: "project-set",
    nameEn: "ProjectSet",
    nameAr: "ProjectSet",
    logo: "/partners/project-set.webp",
    categoryEn: "Education",
    categoryAr: "تعليم وتدريب"
  },
  {
    id: "oxfam",
    nameEn: "Oxfam",
    nameAr: "أوكسفام",
    logo: "/partners/oxfam.webp",
    categoryEn: "Global Impact",
    categoryAr: "أثر مجتمعي عالمي"
  },
  {
    id: "plant-for-the-planet",
    nameEn: "Plant-for-the-Planet",
    nameAr: "ازرع من أجل الكوكب",
    logo: "/partners/plant-for-the-planet.webp",
    categoryEn: "Conservation",
    categoryAr: "حماية البيئة"
  },
  {
    id: "rcoy-mena",
    nameEn: "RCOY MENA",
    nameAr: "المؤتمر الإقليمي للشباب RCOY",
    logo: "/partners/rcoy-mena.webp",
    categoryEn: "Youth Leadership",
    categoryAr: "القيادات الشبابية"
  }
];

interface LogoMarqueeProps {
  title?: string;
  speedSeconds?: number;
}

export const LogoMarquee: React.FC<LogoMarqueeProps> = ({
  speedSeconds = 38
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Double the list for seamless infinite loop
  const duplicatedPartners = [...PARTNERS_DATA, ...PARTNERS_DATA];

  return (
    <section className="logo-marquee-section" aria-label={isAr ? "شركاء النجاح والعمل المناخي" : "Partners & Collaborators"}>
      <div className="container marquee-header-wrap">
        <span className="marquee-minimal-label">
          <span className="marquee-pulse-dot" aria-hidden="true" />
          {isAr ? "شركاء النجاح والاستدامة والعمل المناخي" : "Trusted by Global & Regional Climate Partners"}
        </span>
      </div>

      <div className="marquee-outer-container">
        {/* Soft edge gradients */}
        <div className="marquee-edge-fade left" aria-hidden="true" />
        <div className="marquee-edge-fade right" aria-hidden="true" />

        <div
          className="marquee-track"
          style={{ animationDuration: `${speedSeconds}s` }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="marquee-logo-item"
              title={isAr ? partner.nameAr : partner.nameEn}
              role="img"
              aria-label={isAr ? partner.nameAr : partner.nameEn}
            >
              <img
                src={partner.logo}
                alt={isAr ? partner.nameAr : partner.nameEn}
                className="marquee-logo-img"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

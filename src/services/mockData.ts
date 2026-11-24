import type {
  Program, Initiative, Event, Course, Game,
  Opportunity, BlogPost, TeamMember, CareerNode, CarbonQuestion,
  UserProfileResponse, AdminStats, AnalyticItem, ContactMessage,
  AdminUser, AdminEventRegistration, AdminFormSubmission
} from "../types";



// ==========================================

// Climatify Platform Mock Datasets

// المحتوى أدناه هو المحتوى الرسمي المعتمد للمنصة (Content.md) بصياغته

// العربية والإنجليزية النهائية — الـ mock نفسه عيّنة جاهزة للدمج مع Flask.

// Mock data isolated for easy backend Flask integration

// ==========================================



export const mockPrograms: Program[] = [

  {

    id: "shift-internship",

    titleEn: "SHiFT Program – Youth Capacity Building & Leadership 2025",

    titleAr: "برنامج SHIFT – بناء قدرات الشباب وإعداد القيادات المستقبلية ٢٠٢٥",

    descriptionEn: "A youth capacity-building and professional development program led by Climatify, designed to bridge the gap between academic knowledge and practical experience.",

    descriptionAr: "برنامج إقليمي لبناء قدرات الشباب والتطوير المهني، تقوده كلايمتفاي بالتعاون مع شركاء إقليميين ودوليين، بهدف سد الفجوة بين المعرفة الأكاديمية والتطبيق العملي.",

    icon: "Users",

    longDescriptionEn: `SHiFT is a youth capacity-building and professional development program led by Climatify, designed to bridge the gap between academic knowledge and practical experience. Through technical training, thematic learning, professional internships, and youth-led mentorship, the program equips emerging leaders with the skills to contribute to sustainable development.



Program Objectives:

• Develop technical, analytical, and leadership competencies.

• Strengthen skills in policy writing, research, project proposals, and stakeholder mapping.

• Connect young professionals with practical internship opportunities.

• Establish a sustainable network of youth ambassadors and mentors.



Thematic Areas:

• Climate Change & Sustainability

• Green & Circular Economy

• Sustainable Agriculture & Water Security

• Gender Equality

• Public Policy & EU Diplomacy

• AI, Technology & Space Innovation

• Youth Leadership & Negotiation



SHiFT 2025 – Key Results:

• 60 participants from 5 countries

• 14 training sessions across three learning tracks

• 10 awareness videos produced

• 4 project proposals developed with stakeholder maps

• Over 80% attendance across training sessions

• Establishment of the SHiFT Ambassador Network to support peer learning, mentorship, and future cohorts.



Program Partners:

Climatify | Wavemakers United | Space Point | EU Jeel Connect`,

    longDescriptionAr: `برنامج SHIFT هو برنامج إقليمي لبناء قدرات الشباب والتطوير المهني، تقوده كلايمتفاي بالتعاون مع شركاء إقليميين ودوليين، بهدف سد الفجوة بين المعرفة الأكاديمية والتطبيق العملي، من خلال مسار متكامل يجمع بين التدريب المتخصص، والتدريب المهني العملي، والإرشاد والقيادة الشبابية، وصولًا إلى إعداد جيل من المهنيين الشباب القادرين على المساهمة في قطاع التنمية المستدامة.



أهداف البرنامج:

• تطوير المهارات التقنية والتحليلية والقيادية لدى الشباب.

• تعزيز قدراتهم في إعداد أوراق السياسات والبحوث والمقترحات والمشروعات التنموية.

• إتاحة فرص للتدريب المهني والتطبيق العملي بالتعاون مع المؤسسات الشريكة.

• تأسيس شبكة مستدامة من سفراء البرنامج لدعم التعلم بين الأقران ونقل المعرفة.



المجالات الموضوعية (Thematic Areas):

• التغير المناخي والاستدامة البيئية.

• الاقتصاد الأخضر والاقتصاد الدائري.

• الزراعة المستدامة والأمن المائي.

• المساواة بين الجنسين والتنمية الشاملة.

• السياسات العامة والحوكمة والدبلوماسية الأوروبية.

• الذكاء الاصطناعي والتكنولوجيا وابتكارات الفضاء.

• القيادة الشبابية والتفاوض والتواصل الفعّال.



أبرز مخرجات الدفعة الأولى – SHIFT 2025:

• 60 مشاركًا من 5 دول.

• 14 جلسة تدريبية ضمن ثلاثة مسارات متكاملة.

• إنتاج 10 فيديوهات توعوية حول المناخ والاستدامة.

• تطوير 4 مقترحات مشروعات مدعومة بخرائط لأصحاب المصلحة.

• تحقيق نسبة حضور تجاوزت 80% خلال الجلسات التدريبية.

• تأسيس شبكة سفراء SHIFT لتعزيز القيادة الشبابية والإرشاد ونقل الخبرات إلى الدفعات القادمة.



شركاء البرنامج:

كلايمتفاي | Wavemakers United | Space Point | EU Jeel Connect`

  },

  {

    id: "wavemakers-camp",

    titleEn: "Wavemakers Summer Students Camp",

    titleAr: "معسكر صنّاع التغيير الصيفي للطلاب (Wavemakers)",

    descriptionEn: "A summer camp for young people aged 14–18, combining a 7-day field training in Hurghada with a 3-day virtual camp.",

    descriptionAr: "معسكر بيئي صيفي موجه للناشئة (14–18 عاماً)، يدمج بين التدريب الميداني الساحلي لمدة 7 أيام في الغردقة ومختبرات تفاعلية افتراضية لمدة 3 أيام.",

    icon: "Activity",

    longDescriptionEn: "Camp topics covered climate change, water sustainability, renewable energy, agriculture, the global water crisis, and climate policy — alongside marine activities, interactive workshops, and mentoring sessions.",

    longDescriptionAr: "يغطي المعسكر محاور استراتيجية تشمل التغير المناخي، وإدارة الموارد المائية، والطاقة المتجددة، والسياسات البيئية، إلى جانب أنشطة استكشاف البيئة البحرية وجلسات الإرشاد والتوجيه."

  },

  {

    id: "nawah-network",

    titleEn: "Nawah Eco-feminist Network",

    titleAr: "شبكة نواة للعدالة البيئية وتمكين المرأة",

    descriptionEn: "An initiative empowering women in rural and marginalized communities in Egypt to face climate-change challenges.",

    descriptionAr: "مبادرة رائدة لتمكين النساء في المجتمعات الريفية والساحلية لتعزيز القدرة على التكيف ومواجهة تداعيات التغير المناخي.",

    icon: "Leaf",

    longDescriptionEn: "The initiative reached more than 200 participants and empowered over 50 women across Cairo, Alexandria, Assiut, Beni Suef, and Beheira. It included specialized trainings, storytelling workshops with female farmers and fisherwomen, and a national awareness campaign.",

    longDescriptionAr: "حققت المبادرة أثراً مباشراً شمل أكثر من 200 مشارك، ومكّنت 50 سيدة في محافظات القاهرة والإسكندرية وأسيوط وبني سويف والبحيرة، عبر برامج تدريبية تخصصية وورش توثيق وسرد قصصي وحملة وطنية للتوعية البيئية."

  },

  {

    id: "cadrr-fellowship",

    titleEn: "Climate Action & Disaster Risk Reduction Fellowship",

    titleAr: "زمالة العمل المناخي والحد من مخاطر الكوارث (CADRR)",

    descriptionEn: "A 12-week regional fellowship that trains and empowers youth in climate action and disaster preparedness.",

    descriptionAr: "برنامج زمالة إقليمي مكثف يمتد لـ 12 أسبوعاً، مخصص لإعداد وتأهيل الكوادر الشبابية في مجالات التكيف المناخي والحد من مخاطر الكوارث الطبيعية.",

    icon: "TreePine",

    longDescriptionEn: "The fellowship spans four stages: core training, an Innovation Living Lab, a Regional Hackathon, and Seed Funding. It targets 150–200 young leaders, supporting community-driven solutions and high-impact pilot projects.",

    longDescriptionAr: "ينتظم البرنامج عبر أربع مراحل متكاملة: التدريب التخصصي، والمختبر الحي للابتكار، والهاكاثون الإقليمي، والتمويل الأولي؛ مستهدفاً 150–200 قيادي شاب لتطوير حلول مجتمعية مبتكرة ودعم مشاريع ريادية عالية الأثر."

  },

  {

    id: "green-echo-hackathon",

    titleEn: "Green Echo Hackathon",

    titleAr: "هاكاثون الصدى الأخضر (Green Echo)",

    descriptionEn: "A hackathon focused on food security in the most vulnerable communities across the Middle East and North Africa.",

    descriptionAr: "تحدٍّ تقني وابتكاري يركز على تعزيز الأمن الغذائي والزراعة الذكية مناخياً في المجتمعات الأكثر هشاشة بمنطقة الشرق الأوسط وشمال أفريقيا.",

    icon: "Search",

    longDescriptionEn: "The hackathon received 160 projects in total: 42 projects advanced to the first round, 15 reached the semi-finals, and 3 projects made it to the grand finale.",

    longDescriptionAr: "استقطب الهاكاثون 160 مشروعاً ابتكارياً، تأهل منها 42 مشروعاً إلى التصفيات الأولية، و15 مشروعاً إلى الدور نصف النهائي، لتصل 3 مشاريع ريادية إلى المرحلة الختامية وتحصد الدعم المؤسسي."

  }

];



export const mockInitiatives: Initiative[] = [

  // ── 1. الحملات (Campaigns) ──

  {

    id: "cop28-campaign",

    type: "campaign",

    titleEn: "Paving the Way to COP28 Campaign",

    titleAr: "حملة تمهيد الطريق نحو مؤتمر COP28",

    descriptionEn: "A nationwide youth-led campaign that built climate awareness leading up to the UN Climate Conference in Dubai.",

    descriptionAr: "حملة وطنية رائدة قادها الشباب لتعزيز الوعي المناخي تزامناً مع استضافة دولة الإمارات لمؤتمر الأمم المتحدة للمناخ في دبي.",

    image: "/climatify-cop28-coy18-dubai.jpg",

    categoryEn: "Campaigns",

    categoryAr: "الحملات التوعوية",

    progress: 100,

    targetEn: "Engage 10,000+ Students",

    targetAr: "توعية وتمكين أكثر من 10,000 طالب وطالبة",

    participantsCount: 10500

  },

  {

    id: "beautiful-place-poster",

    type: "campaign",

    titleEn: "Make This Place a Little More Beautiful",

    titleAr: "مبادرة «لنجعل كوكبنا أكثر جمالاً»",

    descriptionEn: "An illustrated interactive environmental initiative focused on local biodiversity and green urban planning.",

    descriptionAr: "مبادرة بيئية توعوية وتفاعلية تركز على حماية التنوع البيولوجي المحلي، والتشجير، والتخطيط الحضري المستدام في المدن.",

    image: "/workshops/self-watering.webp",

    categoryEn: "Campaigns",

    categoryAr: "الحملات التوعوية",

    progress: 75,

    targetEn: "Plant 5,000 Native Ghaf Trees",

    targetAr: "زراعة 5,000 شجرة غاف محلية مستدامة",

    participantsCount: 3800

  },



  // ── 2. برامج (Programs) ──

  {

    id: "shift-invests-initiative",

    type: "program",

    titleEn: "SHIFT Invests — Climate Accelerator",

    titleAr: "مسرع أعمال SHIFT Invests للاستثمار المناخي",

    descriptionEn: "Climatify's flagship accelerator providing green startup mentorship, seed funding, and international market access for youth-led ventures.",

    descriptionAr: "المسرّع الرائد لكلايمتيفاي المخصص لتوجيه وتمويل المشاريع الخضراء الناشئة التي يقودها الشباب، وتوفير التمويل الأولي والربط مع المستثمرين الدوليين.",

    image: "/ambassadors/shift-ambassadors-2026.webp",

    categoryEn: "Programs",

    categoryAr: "البرامج المتخصصة",

    progress: 92,

    targetEn: "Fund 25+ Green Startups",

    targetAr: "تمويل وتوجيه أكثر من 25 مشروعاً ريادياً مستداماً",

    participantsCount: 450

  },

  {

    id: "interns-2026-initiative",

    type: "program",

    titleEn: "Climatify Interns & Ambassadors 2026",

    titleAr: "برنامج سفراء ومتدربي المناخ 2026 (SHIFT Ambassadors)",

    descriptionEn: "A high-impact regional internship program empowering selected youth as sustainability ambassadors and climate leaders.",

    descriptionAr: "برنامج تدريبي وزمالة إقليمية تجمع نخبة من الكفاءات الشبابية لتمثيل المبادرة وقيادة ورش العمل والحلول المناخية الميدانية.",

    image: "/ambassadors/shift-ambassadors-2026.webp",

    categoryEn: "Programs",

    categoryAr: "البرامج المتخصصة",

    progress: 88,

    targetEn: "Train 50+ Certified Ambassadors",

    targetAr: "تأهيل وتخريج أكثر من 50 سفيراً مناخياً معتمداً",

    participantsCount: 120

  },



  // ── 3. معسكرات (Camps) ──

  {

    id: "youth-innovation-camp",

    type: "camp",

    titleEn: "Climate Youth Innovation Camp",

    titleAr: "معسكر شباب المناخ للابتكار البيئي",

    descriptionEn: "An intensive residential bootcamp for young innovators focusing on renewable energy, smart agriculture, and green tech prototyping.",

    descriptionAr: "معسكر إقليمي مكثف يجمع رواد الأعمال والمبتكرين الشباب لتطوير نماذج أولية في الطاقة النظيفة والزراعة الذكية والحلول المناخية الذكية.",

    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",

    categoryEn: "Camps",

    categoryAr: "المعسكرات البيئية",

    progress: 95,

    targetEn: "150 Youth Innovators in Living Labs",

    targetAr: "تمكين 150 مبتكراً شاباً في المختبرات الحية",

    participantsCount: 150

  },

  {

    id: "wavemakers-camp-init",

    type: "camp",

    titleEn: "Wavemakers Field & Virtual Climate Camp",

    titleAr: "معسكر Wavemakers الميداني والافتراضي للناشئة",

    descriptionEn: "A 10-day intensive environmental camp combining 7 days of coastal field research and 3 days of virtual digital climate policy labs.",

    descriptionAr: "معسكر تدريبي يجمع بين 7 أيام من العمل الميداني الساحلي و3 أيام من مختبرات السياسات المناخية الرقمية للطلاب.",

    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",

    categoryEn: "Camps",

    categoryAr: "المعسكرات البيئية",

    progress: 100,

    targetEn: "Educate 200 Secondary Students",

    targetAr: "تدريب وبناء قدرات 200 طالب وطالبة",

    participantsCount: 200

  },



  // ── 4. ورش عمل (Workshops) — الأربعة الرئيسية من البورتفوليو ──

  {

    id: "workshop-hands-on",

    type: "workshop",

    titleEn: "Hands-on Workshop",

    titleAr: "ورشة العمل التطبيقية (Hands-on Workshop)",

    descriptionEn: "Practical hands-on masterclasses across 4 innovative tracks: Self-Watering Planting, Trash to Art upcycling, Mental Health & Nature mindfulness, and Dye Beauty natural craft.",

    descriptionAr: "تدريب تطبيقي ملهم عبر 4 محاور رئيسية: الزراعة ذاتية الري، تحويل المخلفات إلى فن (Trash to Art)، الصحة النفسية والارتباط بالطبيعة، والصباغة الطبيعية والجمال البيئي (Dye Beauty).",

    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",

    categoryEn: "Workshops",

    categoryAr: "ورش العمل التفاعلية",

    progress: 100,

    targetEn: "Portfolio Featured Workshop",

    targetAr: "ضمن ورش العمل المعتمدة بالبورتفوليو الرسمي",

    participantsCount: 320

  },

  {

    id: "workshop-road-to-2028",

    type: "workshop",

    titleEn: "Road to 2028 Workshop",

    titleAr: "ورشة الطريق نحو 2028 (Road to 2028)",

    descriptionEn: "Strategic youth participatory workshop charting clear milestones towards regional climate commitments and Net Zero 2050 targets.",

    descriptionAr: "ورشة استراتيجية لرسم مسار مشاركة الشباب في تحقيق الالتزامات المناخية الإقليمية ومستهدفات الحياد المناخي بحلول عام 2050.",

    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",

    categoryEn: "Workshops",

    categoryAr: "ورش العمل التفاعلية",

    progress: 100,

    targetEn: "Portfolio Featured Workshop",

    targetAr: "ضمن ورش العمل المعتمدة بالبورتفوليو الرسمي",

    participantsCount: 280

  },

  {

    id: "workshop-green-ramadan",

    type: "workshop",

    titleEn: "Green Ramadan (رمضان أخضر)",

    titleAr: "ورشة رمضان أخضر (Green Ramadan)",

    descriptionEn: "Community awareness workshop tackling seasonal food waste, conscious resource consumption, and sustainable habits during Ramadan.",

    descriptionAr: "ورشة توعوية تركز على الحد من الهدر الغذائي، وترشيد استهلاك الموارد، وتبني أنماط معيشية مستدامة خلال الشهر الفضيل.",

    image: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80",

    categoryEn: "Workshops",

    categoryAr: "ورش العمل التفاعلية",

    progress: 100,

    targetEn: "Portfolio Featured Workshop",

    targetAr: "ضمن ورش العمل المعتمدة بالبورتفوليو الرسمي",

    participantsCount: 540

  },

  {

    id: "workshop-shift",

    type: "workshop",

    titleEn: "SHIFT Workshop",

    titleAr: "ورشة SHIFT لريادة الأعمال المناخية",

    descriptionEn: "Interactive entrepreneurial session where students and founders design, stress-test, and pitch scalable climate tech business models.",

    descriptionAr: "جلسة ريادية تفاعلية تتيح للمشاركين تصميم واختبار نماذج أعمال خضراء ومستدامة، وعرضها أمام لجان التحكيم والخبراء.",

    image: "/ambassadors/shift-ambassadors-2026.webp",

    categoryEn: "Workshops",

    categoryAr: "ورش العمل التفاعلية",

    progress: 100,

    targetEn: "Portfolio Featured Workshop",

    targetAr: "ضمن ورش العمل المعتمدة بالبورتفوليو الرسمي",

    participantsCount: 410

  },



  // ── 5. الألعاب البيئية (Environmental Games) ──

  {

    id: "initiative-agriclash",

    type: "game",

    titleEn: "AgriClash — Environmental Simulation Game",

    titleAr: "لعبة AgriClash — محاكاة إدارة الموارد والزراعة المستدامة",

    descriptionEn: "An interactive educational board and simulation game developed under the SHIFT program, challenging youth teams to negotiate, allocate resources, and solve climate dilemmas.",

    descriptionAr: "لعبة محاكاة تعليمية واستراتيجية طوّرتها كلايمتيفاي ضمن برنامج SHIFT؛ يتوزع فيها المشاركون بين فريقي 'صنّاع القرار' و'المهندسين' للتنافس والتعاون في إدارة الموارد المائية ومجابهة التحديات المناخية.",

    image: "/games/agriclash-board.webp",

    categoryEn: "Environmental Games",

    categoryAr: "الألعاب البيئية",

    progress: 100,

    targetEn: "Engage 1,500+ Players Across Regional Cohorts",

    targetAr: "مشاركة أكثر من 1,500 لاعب في الدفعات والجامعات",

    participantsCount: 1500

  },

  {

    id: "initiative-greensharks",

    type: "game",

    titleEn: "GreenSharks — Green Investment Challenge",

    titleAr: "تحدي GreenSharks — محاكاة الاستثمار والريادة الخضراء",

    descriptionEn: "A high-stakes green pitch simulation and climate innovation challenge where emerging youth entrepreneurs pitch sustainable ventures to expert panels.",

    descriptionAr: "محاكاة استثمارية وتحدٍّ بيئي ريادي، تقدم فيه الفرق والشركات الناشئة حلولاً بيئية مبتكرة أمام لجان تحكيم ومستثمرين لاكتساب التمويل والتوجيه.",

    image: "/games/green-sharks.webp",

    categoryEn: "Environmental Games",

    categoryAr: "الألعاب البيئية",

    progress: 90,

    targetEn: "Pitch 50+ Eco-Innovations to Impact Investors",

    targetAr: "عرض 50+ فكرة ريادية أمام مستثمرين بيئيين",

    participantsCount: 350

  },



  // ── 6. هاكاثونات الابتكار (Hackathons) ──

  {

    id: "initiative-green-echo-hackathon",

    type: "hackathon",

    titleEn: "Green Echo Regional Hackathon",

    titleAr: "هاكاثون الصدى الأخضر (Green Echo)",

    descriptionEn: "A regional climate tech hackathon tackling food security, smart agriculture, and climate adaptation with 160 competing projects across MENA.",

    descriptionAr: "هاكاثون إقليمي وتحدٍّ تقني وابتكاري ركز على تعزيز الأمن الغذائي والزراعة الذكية مناخياً، بمشاركة 160 مشروعاً ابتكارياً وتأهل 15 مشروعاً للدور قبل النهائي.",

    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",

    categoryEn: "Hackathons",

    categoryAr: "هاكاثونات الابتكار",

    progress: 100,

    targetEn: "160 Projects Submitted & 3 Grand Winners",

    targetAr: "160 مشروعاً متنافساً و3 مشاريع فائزة بالدعم",

    participantsCount: 420

  },

  {

    id: "initiative-ice-hackathon",

    type: "hackathon",

    titleEn: "ICE 2024 International Sustainability Hackathon",

    titleAr: "هاكاثون ICE 2024 الدولي للاستدامة",

    descriptionEn: "Global youth hackathon with ProjectSet bringing together international students to build practical solutions for environmental challenges.",

    descriptionAr: "هاكاثون دولي بالتعاون مع ProjectSet لتمكين طلاب الجامعات وحديثي التخرج من ابتكار حلول عملية لربط التكنولوجيا بالاستدامة.",

    image: "/climatify-ice-2024-hackathon-projectset.jpg",

    categoryEn: "Hackathons",

    categoryAr: "هاكاثونات الابتكار",

    progress: 100,

    targetEn: "Empower 250+ University Innovators",

    targetAr: "تمكين أكثر من 250 طالباً ومبتكراً جامعياً",

    participantsCount: 250

  }

];



// ملاحظة تواريخ: جميع الفعاليات في هذا الأرشيف تمثل محطات تاريخية موثقة

// انتهت بنجاح (Ended) — تُعرض بصفة أرشيفية بدون تسجيل نشط.

export const mockEvents: Event[] = [
  {
    id: "shift-cohort-2027-forum",
    titleEn: "SHIFT 2027 — Regional Youth Climate Innovation Forum",
    titleAr: "ملتقى SHIFT 2027 الإقليمي للابتكار المناخي الشبابي",
    descriptionEn: "Join emerging Arab innovators, green entrepreneurs, and university fellows for hands-on climate tech labs, live AgriClash tournaments, and project showcases.",
    descriptionAr: "ملتقى إقليمي يجمع المبتكرين الشباب ورواد الأعمال الخضراء وزملاء الجامعات في مختبرات تقنية تطبيقية، وتجارب AgriClash الحية، ومعرض للمشاريع البيئية الرائدة.",
    date: "2026-02-20",
    locationEn: "Dubai & Hybrid Regional Broadcast",
    locationAr: "دبي وبث إقليمي هجين (حضوري وعن بُعد)",
    categoryEn: "Conference",
    categoryAr: "مؤتمرات وملتقيات",
    registeredCount: 185,
    image: "/shift-cohort-1-graduation-2026.jpg",
    status: "ended"
  },
  {
    id: "climatify-sustainability-week-2027",
    titleEn: "Earth Day & Regional Sustainability Week 2027",
    titleAr: "ملتقى يوم الأرض وأسبوع الاستدامة الإقليمي 2027",
    descriptionEn: "A multi-campus series of self-watering planting workshops, circular art activations, and student climate hackathons across UAE and Egyptian partner universities.",
    descriptionAr: "سلسلة فعاليات جامعية تشمل ورش الزراعة ذاتية الري، وفنون الاقتصاد الدائري، وتحديات الابتكار المناخي بالشراكة مع الجامعات في الإمارات ومصر.",
    date: "2026-04-22",
    locationEn: "UAE & Partner University Campuses",
    locationAr: "دولة الإمارات والجامعات الشريكة إقليمياً",
    categoryEn: "Workshop",
    categoryAr: "ورش عمل",
    registeredCount: 94,
    image: "/earth-day-event-2025.jpg",
    status: "ended"
  },
  {

    id: "shift-first-cohort-graduation",

    titleEn: "SHIFT — First Cohort Graduation",

    titleAr: "حفل تخرج الدفعة الأولى من برنامج SHIFT",

    descriptionEn: "The graduation ceremony of the first SHIFT cohort, featuring keynote sessions, success stories, interactive workshops, and an AgriClash experience.",

    descriptionAr: "حفل تخرج الدفعة الأولى من برنامج SHIFT، متضمناً جلسات نقاشية رئيسية، واستعراض قصص النجاح، وورش عمل تفاعلية، وتجربة محاكاة AgriClash.",

    date: "2026-02-01",

    locationEn: "United Arab Emirates",

    locationAr: "دولة الإمارات العربية المتحدة",

    categoryEn: "Conference",

    categoryAr: "مؤتمرات وملتقيات",

    registeredCount: 0,
    status: "ended"

  },

  {

    id: "ice-2024-hackathon-event",

    titleEn: "ICE 2024 International Climate Hackathon",

    titleAr: "هاكاثون ICE 2024 الدولي للابتكار المناخي",

    descriptionEn: "An international innovation hackathon with ProjectSet gathering university students and emerging innovators to create climate tech solutions.",

    descriptionAr: "هاكاثون دولي للابتكار بالشراكة مع ProjectSet جمع طلاب الجامعات والمبتكرين الشباب لتطوير حلول تقنية مستدامة للتحديات المناخية.",

    date: "2024-04-15",

    locationEn: "International & Hybrid",

    locationAr: "دولي وهجين (عن بُعد وحضوري)",

    categoryEn: "Hackathon",

    categoryAr: "هاكاثونات ومسابقات",

    registeredCount: 250,
    status: "ended"

  },

  {

    id: "earth-day-event",

    titleEn: "Earth Day Event",

    titleAr: "ملتقى يوم الأرض العالمي",

    descriptionEn: "An event that brought together environment and climate activists to strengthen collaboration and shared environmental responsibility.",

    descriptionAr: "ملتقى بيئي جمع رواد ونشطاء العمل المناخي لترسيخ التعاون والمسؤولية البيئية المشتركة.",

    date: "2025-04-22",

    locationEn: "United Arab Emirates",

    locationAr: "دولة الإمارات العربية المتحدة",

    categoryEn: "Outreach",

    categoryAr: "توعية ومشاركات",

    registeredCount: 0,
    status: "ended"

  },

  {

    id: "farming-agri-waste-workshop-2025",

    titleEn: "Farming & Agricultural Waste Recycling Workshop",

    titleAr: "ورشة الزراعة وإعادة تدوير المخلفات الزراعية",

    descriptionEn: "A workshop on sustainable agriculture and agricultural-waste recycling with the participation of 45 students.",

    descriptionAr: "ورشة تدريبية متخصصة حول الممارسات الزراعية المستدامة وإعادة تدوير المخلفات بمشاركة 45 طالباً وطالبة.",

    date: "2025-02-01",

    locationEn: "Egypt",

    locationAr: "جمهورية مصر العربية",

    categoryEn: "Workshop",

    categoryAr: "ورش عمل",

    registeredCount: 0,
    status: "ended"

  },

  {

    id: "cop29-azerbaijan",

    titleEn: "COP29 — Azerbaijan",

    titleAr: "مؤتمر الأطراف للمناخ COP29 — أذربيجان",

    descriptionEn: "Participation in a session on the role of UAE youth in tackling climate change, agricultural innovation, and supporting climate-affected communities.",

    descriptionAr: "المشاركة في جلسة دولية استعرضت دور شباب دولة الإمارات في مجابهة التغير المناخي والابتكار الزراعي ودعم المجتمعات الأكثر هشاشة.",

    date: "2024-11-01",

    locationEn: "Baku, Azerbaijan",

    locationAr: "باكو، أذربيجان",

    categoryEn: "Conference",

    categoryAr: "مؤتمرات وملتقيات",

    registeredCount: 0,
    status: "ended"

  },

  {

    id: "rise-25-aus",

    titleEn: "RISE '25",

    titleAr: "ملتقى RISE '25 بالجامعة الأمريكية بالشارقة",

    descriptionEn: "An event at the American University of Sharjah to engage with students and change-makers interested in climate innovation and sustainability.",

    descriptionAr: "المشاركة في ملتقى الجامعة الأمريكية بالشارقة لتمكين الطلاب وصناع التغيير المهتمين بالابتكار المناخي وريادة الأعمال الخضراء.",

    date: "2025-02-20",

    locationEn: "American University of Sharjah",

    locationAr: "الجامعة الأمريكية في الشارقة",

    categoryEn: "Outreach",

    categoryAr: "توعية ومشاركات",

    registeredCount: 0,
    status: "ended"

  },

  {

    id: "sustainability-week",

    titleEn: "Sustainability Week",

    titleAr: "أسبوع الاستدامة الإقليمي",

    descriptionEn: "A dedicated regional week of climate literacy, green innovation challenges, and student engagement across universities.",

    descriptionAr: "أسبوع إقليمي مخصص للتوعية المناخية، وإطلاق تحديات الابتكار الأخضر، وإشراك طلاب الجامعات في المبادرات البيئية.",

    date: "2025-11-15",

    locationEn: "UAE & Regional Hubs",

    locationAr: "دولة الإمارات والمراكز الإقليمية",

    categoryEn: "Sustainability Week",

    categoryAr: "أسبوع الاستدامة",

    registeredCount: 420,
    status: "ended"

  }

];



// قسم التعلم Hub: 5 ورش عمل + 3 برامج تعليمية (SHIFT / Wavemakers / الزمالة)

// كما وردت في المحتوى الرسمي. عدد الدروس يشير للوحدات التدريبية المتاحة.

export const mockCourses: Course[] = [

  {

    id: "workshop-little-green-heroes",

    titleEn: "Little Green Heroes: Waste Management Fun",

    titleAr: "أبطال الأرض الصغار: الإدارة الواعية للنفايات",

    descriptionEn: "A playful workshop that introduces children to waste sorting, recycling habits, and everyday environmental responsibility.",

    descriptionAr: "ورشة تفاعلية ممتعة تُعرّف الأطفال بأساليب فرز النفايات، ومبادئ إعادة التدوير، والمسؤولية البيئية في الحياة اليومية.",

    instructorEn: "Climatify Academy",

    instructorAr: "أكاديمية كلايمتيفاي",

    durationEn: "One interactive session",

    durationAr: "جلسة تفاعلية واحدة",

    lessonsCount: 1,

    categoryEn: "Workshops",

    categoryAr: "ورش عمل",

    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "workshop-self-watering-agriculture",

    titleEn: "Self-Watering Agriculture",

    titleAr: "تقنيات الزراعة ذاتية الري",

    descriptionEn: "A hands-on workshop on building self-watering planting systems and water-wise farming techniques.",

    descriptionAr: "ورشة تطبيقية حول بناء منظومات الزراعة ذاتية الري وتطبيق ممارسات الري المبتكرة المقتصدة للمياه.",

    instructorEn: "Climatify Academy",

    instructorAr: "أكاديمية كلايمتيفاي",

    durationEn: "One hands-on session",

    durationAr: "جلسة تطبيقية واحدة",

    lessonsCount: 1,

    categoryEn: "Workshops",

    categoryAr: "ورش عمل",

    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "workshop-trash-to-art",

    titleEn: "Trash to Art",

    titleAr: "من المخلفات إلى الفن (Trash to Art)",

    descriptionEn: "A creative workshop that turns everyday waste into art, reshaping how young people see consumption and reuse.",

    descriptionAr: "ورشة إبداعية تحوّل المخلفات اليومية إلى أعمال فنية ملهمة، وتُعيد تشكيل وعي الناشئة بمفاهيم الاستهلاك المستدام وإعادة الاستخدام.",

    instructorEn: "Climatify Academy",

    instructorAr: "أكاديمية كلايمتيفاي",

    durationEn: "One creative session",

    durationAr: "جلسة إبداعية واحدة",

    lessonsCount: 1,

    categoryEn: "Workshops",

    categoryAr: "ورش عمل",

    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "workshop-climate-fresk",

    titleEn: "Climate Fresk",

    titleAr: "ورشة الجدارية المناخية (Climate Fresk)",

    descriptionEn: "The world-famous collaborative card workshop that helps participants understand the causes and consequences of climate change.",

    descriptionAr: "ورشة تفاعلية عالمية تعتمد على الذكاء الجماعي والبطاقات التعليمية، لتمكين المشاركين من استيعاب أسباب التغير المناخي وتداعياته الشاملة.",

    instructorEn: "Climatify Academy",

    instructorAr: "أكاديمية كلايمتيفاي",

    durationEn: "One collaborative session",

    durationAr: "جلسة تعاونية واحدة",

    lessonsCount: 1,

    categoryEn: "Workshops",

    categoryAr: "ورش عمل",

    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "workshop-agri-waste-recycling",

    titleEn: "Farming & Agricultural Waste Recycling",

    titleAr: "الزراعة المستدامة وإعادة تدوير المخلفات",

    descriptionEn: "A field workshop on sustainable agriculture and turning agricultural waste into useful resources, delivered with students and local communities.",

    descriptionAr: "ورشة ميدانية متخصصة حول الممارسات الزراعية الصديقة للبيئة وتحويل المخلفات إلى موارد نافعة للطلاب والمجتمعات المحلية.",

    instructorEn: "Climatify Academy",

    instructorAr: "أكاديمية كلايمتيفاي",

    durationEn: "One field session",

    durationAr: "جلسة ميدانية واحدة",

    lessonsCount: 1,

    categoryEn: "Workshops",

    categoryAr: "ورش عمل",

    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "course-zayed-university",

    titleEn: "Climate Leadership & Green Economy (Zayed University)",

    titleAr: "القيادة المناخية والاقتصاد الأخضر (بالتعاون مع جامعة زايد)",

    descriptionEn: "A specialized certified module delivered with Zayed University exploring regional climate policy and youth initiatives.",

    descriptionAr: "مساق معتمد بالتعاون مع جامعة زايد لاستكشاف السياسات المناخية الإقليمية وآليات قيادة المبادرات الخضراء.",

    instructorEn: "Zayed University & Climatify",

    instructorAr: "جامعة زايد وأكاديمية كلايمتيفاي",

    durationEn: "4 Weeks · 4 Modules",

    durationAr: "4 أسابيع · 4 وحدات",

    lessonsCount: 4,

    categoryEn: "Academic Partnerships",

    categoryAr: "شراكات أكاديمية",

    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "course-khalifa-university",

    titleEn: "Advanced Environmental Tech & Clean Energy (Khalifa University)",

    titleAr: "التقنيات البيئية المتقدمة والطاقة النظيفة (بالتعاون مع جامعة خليفة)",

    descriptionEn: "Engineering sustainable solutions, clean energy systems, and emissions monitoring.",

    descriptionAr: "دراسة متعمقة في هندسة الحلول المستدامة، وأنظمة الطاقة النظيفة، ورصد الانبعاثات بالتعاون مع جامعة خليفة.",

    instructorEn: "Khalifa University & Climatify",

    instructorAr: "جامعة خليفة وأكاديمية كلايمتيفاي",

    durationEn: "6 Weeks · 6 Modules",

    durationAr: "6 أسابيع · 6 وحدات",

    lessonsCount: 6,

    categoryEn: "Academic Partnerships",

    categoryAr: "شراكات أكاديمية",

    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "course-heliopolis-university",

    titleEn: "Sustainable Development & Circular Economy (Heliopolis University)",

    titleAr: "التنمية المستدامة والاقتصاد الدائري (بالتعاون مع جامعة هليوبوليس)",

    descriptionEn: "Hands-on academic knowledge bridged with real-world applications for next-gen sustainability leaders.",

    descriptionAr: "ربط المعرفة الأكاديمية بالتطبيقات العملية الميدانية لإعداد جيل مؤهل من رواد الاستدامة والاقتصاد الدائري.",

    instructorEn: "Heliopolis University & Climatify",

    instructorAr: "جامعة هليوبوليس وأكاديمية كلايمتيفاي",

    durationEn: "5 Weeks · 5 Modules",

    durationAr: "5 أسابيع · 5 وحدات",

    lessonsCount: 5,

    categoryEn: "Academic Partnerships",

    categoryAr: "شراكات أكاديمية",

    image: "/partnerships/mou-heliopolis.webp"

  },

  {

    id: "course-enoc-energy-efficiency",

    titleEn: "Industrial Decarbonization & Energy Transition (with ENOC)",

    titleAr: "كفاءة الطاقة وخفض الانبعاثات الصناعية (بالشراكة مع ENOC)",

    descriptionEn: "Practical industrial strategies for carbon reduction, resource optimization, and green governance.",

    descriptionAr: "استراتيجيات تطبيقية لخفض البصمة الكربونية، وإدارة الموارد، وتبني معايير الحوكمة البيئية في القطاع الصناعي.",

    instructorEn: "ENOC Sustainability Division",

    instructorAr: "قطاع الاستدامة بشركة اينوك (ENOC)",

    durationEn: "3 Weeks · 3 Modules",

    durationAr: "3 أسابيع · 3 وحدات",

    lessonsCount: 3,

    categoryEn: "Corporate Partnerships",

    categoryAr: "شراكات المؤسسات",

    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "course-shift-internship",

    titleEn: "SHiFT Program – Youth Capacity Building & Leadership 2025",

    titleAr: "برنامج SHIFT – بناء قدرات الشباب وإعداد القيادات المستقبلية ٢٠٢٥",

    descriptionEn: "A youth capacity-building and professional development program led by Climatify, covering climate action, circular economy, and leadership with international experts.",

    descriptionAr: "برنامج إقليمي لبناء قدرات الشباب والتطوير المهني تقوده كلايمتفاي، يغطي العمل المناخي، الاقتصاد الدائري، والقيادة الشبابية.",

    instructorEn: "International Experts",

    instructorAr: "خبراء دوليون",

    durationEn: "3 months · 4 cohorts/year",

    durationAr: "3 أشهر · 4 دفعات سنوياً",

    lessonsCount: 4,

    categoryEn: "Educational Programs",

    categoryAr: "برامج تعليمية",

    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "course-wavemakers-camp",

    titleEn: "Wavemakers Summer Students Camp",

    titleAr: "معسكر Wavemakers الصيفي للناشئة",

    descriptionEn: "A summer camp for ages 14–18: seven days of field training in Hurghada plus a three-day virtual camp on climate, water, and energy topics.",

    descriptionAr: "معسكر بيئي صيفي للناشئة (14–18 عاماً): 7 أيام تدريب ميداني بالغردقة و3 أيام في مختبرات افتراضية حول الطاقة والمناخ.",

    instructorEn: "Climatify Team",

    instructorAr: "فريق كلايمتيفاي",

    durationEn: "10 days (7 field + 3 virtual)",

    durationAr: "10 أيام (7 ميداني + 3 افتراضي)",

    lessonsCount: 5,

    categoryEn: "Educational Programs",

    categoryAr: "برامج تعليمية",

    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80"

  },

  {

    id: "course-cadrr-fellowship",

    titleEn: "Climate Action & Disaster Risk Reduction Fellowship",

    titleAr: "زمالة العمل المناخي والحد من مخاطر الكوارث (CADRR)",

    descriptionEn: "A 12-week regional fellowship in four stages: core training, an Innovation Living Lab, a Regional Hackathon, and Seed Funding for 150–200 young leaders.",

    descriptionAr: "زمالة إقليمية ممتدة لـ 12 أسبوعاً عبر 4 مراحل: التدريب التخصصي، والمختبر الحي، والهاكاثون، والتمويل الأولي؛ لتأهيل 150–200 قيادي شاب.",

    instructorEn: "Climatify Academy",

    instructorAr: "أكاديمية كلايمتيفاي",

    durationEn: "12 weeks · 4 stages",

    durationAr: "12 أسبوعاً · 4 مراحل",

    lessonsCount: 4,

    categoryEn: "Educational Programs",

    categoryAr: "برامج تعليمية",

    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80"

  }

];



export const mockGames: Game[] = [

  {

    id: "agriclash",

    titleEn: "AgriClash",

    image: "/games/agriclash-board.webp",

    titleAr: "AgriClash — صراع الموارد والزراعة المستدامة",

    descriptionEn: "AgriClash is an international game under the UN Framework and an interactive, game-based simulation where youth step into the roles of country delegates and decision-makers, navigating real-world challenges in sustainable agriculture and AgriTech. Through competition, negotiation, and climate diplomacy, teams make strategic choices around the Water–Energy–Food Nexus, circular economy, climate adaptation, carbon credits and carbon markets, gender-responsive climate justice, and sustainable resource management—experiencing how every policy, technology, and investment decision can shape the resilience of their land, economy, and communities.",

    descriptionAr: "لعبة تفاعلية دولية مبنية ضمن أطر عمل الأمم المتحدة، حيث يتقمص الشباب أدوار وفود الدول وصنّاع القرار لمواجهة تحديات واقعية في الزراعة المستدامة والتكنولوجيا الزراعية (AgriTech). من خلال التنافس والتفاوض والدبلوماسية المناخية، تتخذ الفرق قرارات استراتيجية حول ترابط المياه والطاقة والغذاء، والاقتصاد الدائري، والتكيف المناخي، وأسواق وائتمانات الكربون، والعدالة المناخية المراعية للنوع الاجتماعي، والإدارة المستدامة للموارد — ليعيشوا تجربة حية لكيفية تأثير السياسات والقرارات الاستثمارية في صمود مجتمعاتهم واقتصاداتهم.",

    categoryEn: "Team Game",

    categoryAr: "لعبة جماعية استراتيجية",

    icon: "Sprout",

    playUrl: ""

  },

  {

    id: "greensharks",

    image: "/games/green-sharks.webp",

    titleEn: "Green Sharks Challenge",

    titleAr: "تحدي Green Sharks — حيث تلتقي الأفكار الخضراء بالاستثمار",

    descriptionEn: "Green Sharks Challenge is an interactive workshop that puts young people at the heart of the green economy, challenging them to develop innovative, low-carbon business solutions. Through teamwork, competition, carbon offsetting, carbon markets, green investment, and just transition, participants explore how entrepreneurship and climate action can create sustainable, investable, and socially inclusive solutions for a low-carbon future.",

    descriptionAr: "تحدي Green Sharks: حيث تلتقي الأفكار الخضراء بالاستثمار. ورشة عمل وتحدٍّ تفاعلي يضع الشباب في قلب الاقتصاد الأخضر، محفزاً إياهم على ابتكار حلول أعمال ريادية منخفضة الكربون. من خلال العمل الجماعي، والمنافسة، وتعويض الكربون، وأسواق الكربون، والاستثمار الأخضر، والانتقال العادل، يستكشف المشاركون كيف يمكن لريادة الأعمال والعمل المناخي تقديم حلول مستدامة وجاذبة للاستثمار وشاملة اجتماعياً لمستقبل منخفض الكربون.",

    categoryEn: "Interactive Strategy",

    categoryAr: "محاكاة واستراتيجية ريادية",

    icon: "Activity",

    playUrl: ""

  },

  {

    id: "ghaf-tree-grower",

    titleEn: "Plant-a-Ghaf Digital Garden",

    titleAr: "حديقة شجرة الغاف الرقمية",

    descriptionEn: "Grow your digital garden by completing real-world climate missions and learning about UAE biodiversity.",

    descriptionAr: "حديقة افتراضية تفاعلية تمكّنك من زراعة ورعاية أشجار الغاف عبر إنجاز مهام بيئية واكتساب نقاط الاستدامة المستوحاة من الطبيعة الإماراتية.",

    categoryEn: "Interactive",

    categoryAr: "تفاعلي",

    icon: "TreePine",

    playUrl: "/games/ghaf-garden"

  }

];



export const mockOpportunities: Opportunity[] = [

  {

    id: "vol-dubai-outreach",

    titleEn: "Community Outreach Volunteer",

    titleAr: "متطوع في التوعية المجتمعية والميدانية",

    descriptionEn: "Help us organize climate literacy workshops in schools across Dubai.",

    descriptionAr: "المساهمة في تنظيم ورش العمل والفعاليات التوعوية بالمناخ في المدارس والمراكز المجتمعية بإمارة دبي.",

    typeEn: "Volunteering",

    typeAr: "عمل تطوعي",

    locationEn: "Dubai",

    locationAr: "دبي، دولة الإمارات",

    postedDate: "2026-07-15"

  },

  {

    id: "intern-data-analyst",

    titleEn: "Climate Data Analyst Intern",

    titleAr: "متدرب في تحليل البيانات المناخية والبيئية",

    descriptionEn: "Analyze local environmental data sets to support our annual reporting team.",

    descriptionAr: "تحليل مجموعات البيانات البيئية والمناخية الإقليمية لدعم فريق إعداد تقارير الاستدامة السنوية.",

    typeEn: "Internship",

    typeAr: "تدريب مهني وزمالة",

    locationEn: "Abu Dhabi",

    locationAr: "أبوظبي، دولة الإمارات",

    postedDate: "2026-07-10"

  }

];



export const mockBlogPosts: BlogPost[] = [

  {

    id: "heliopolis-mou-signing",

    titleEn: "Climatify and Heliopolis University Sign Strategic MoU to Advance Climate Education and Youth Empowerment",

    titleAr: "كلايمتفاي وجامعة هليوبوليس للتنمية المستدامة توقعان مذكرة تفاهم استراتيجية لتعزيز التعليم المناخي وتمكين الشباب",

    excerptEn: "Climatify and Heliopolis University formalized a strategic partnership through an MoU during the Scientific Conference at Sustainability Week in September 2026.",

    excerptAr: "وقّعت كلايمتفاي وجامعة هليوبوليس للتنمية المستدامة مذكرة تفاهم استراتيجية خلال الحفل الختامي لأسبوع الاستدامة في سبتمبر 2026.",

    contentEn: `September 2026 | Cairo, Egypt



Climatify and Heliopolis University for Sustainable Development formalized a strategic partnership through the signing of a Memorandum of Understanding (MoU) during the closing ceremony of the Scientific Conference, held as part of Heliopolis University’s Sustainability Week in September 2026.



The agreement represents a significant step toward strengthening institutional cooperation between the UAE and Egypt in climate education, sustainable development, youth empowerment, and innovation.



The partnership establishes a framework for designing and implementing joint initiatives that bridge academic knowledge, policy perspectives, and practical applications, with a particular focus on equipping young people with the competencies required to contribute to sustainable development and the green economy.



Key areas of cooperation include:



* Climate Education and Capacity Building: Advancing specialized educational initiatives and professional development opportunities in climate action, sustainability, and green skills.

* Youth Leadership and Empowerment: Strengthening youth participation in climate action, decision-making processes, and sustainable development initiatives.

* Research and Knowledge Exchange: Promoting institutional collaboration, academic engagement, and the exchange of expertise in climate policy, environmental sustainability, and emerging development priorities.

* Innovation and Green Entrepreneurship: Supporting youth-driven innovation and entrepreneurship addressing environmental and socioeconomic challenges.

* Regional and International Cooperation: Exploring opportunities for joint initiatives, institutional partnerships, and knowledge exchange at national, regional, and international levels.



Through this strategic collaboration, Climatify and Heliopolis University seek to strengthen the relationship between higher education, climate policy, and sustainable innovation while creating pathways for young people to engage in addressing regional and global sustainability challenges.



The MoU further reflects Climatify’s commitment to expanding its institutional partnerships, strengthening UAE–Egypt cooperation, and advancing youth-centered approaches to climate action and sustainable development across the region.`,

    contentAr: `سبتمبر 2026 | القاهرة، جمهورية مصر العربية



وقّعت كلايمتفاي (Climatify) وجامعة هليوبوليس للتنمية المستدامة مذكرة تفاهم استراتيجية، وذلك خلال الحفل الختامي للمؤتمر العلمي الذي أُقيم ضمن فعاليات أسبوع الاستدامة الذي نظمته الجامعة في سبتمبر 2026.



وتُمثل هذه الاتفاقية خطوة مهمة نحو تعزيز التعاون المؤسسي بين دولة الإمارات العربية المتحدة وجمهورية مصر العربية في مجالات التعليم المناخي، والتنمية المستدامة، وتمكين الشباب، والابتكار.



وتؤسس مذكرة التفاهم لإطار تعاون مشترك يهدف إلى تطوير وتنفيذ مبادرات وبرامج نوعية تربط بين المعرفة الأكاديمية والتوجهات السياسية والتطبيقات العملية، مع التركيز على بناء قدرات الشباب وتأهيلهم بالمعارف والمهارات اللازمة للمساهمة الفاعلة في تحقيق أهداف التنمية المستدامة ودعم التحول نحو الاقتصاد الأخضر.



وتشمل مجالات التعاون الرئيسية ما يلي:



* التعليم المناخي وبناء القدرات: تطوير مبادرات تعليمية متخصصة وفرص للتأهيل المهني في مجالات العمل المناخي والاستدامة والمهارات الخضراء.

* تمكين الشباب وتعزيز القيادة: دعم مشاركة الشباب في العمل المناخي وعمليات صنع القرار والمبادرات المرتبطة بالتنمية المستدامة.

* البحث العلمي وتبادل المعرفة: تعزيز التعاون الأكاديمي والمؤسسي وتبادل الخبرات في مجالات السياسات المناخية والاستدامة البيئية وأولويات التنمية الناشئة.

* الابتكار وريادة الأعمال الخضراء: دعم الابتكار والمبادرات الريادية التي يقودها الشباب لتطوير حلول للتحديات البيئية والاقتصادية والاجتماعية.

* التعاون الإقليمي والدولي: استكشاف فرص تطوير مبادرات مشتركة وتوسيع الشراكات المؤسسية وتبادل المعرفة والخبرات على المستويات الوطنية والإقليمية والدولية.



ومن خلال هذه الشراكة الاستراتيجية، تسعى كلايمتفاي وجامعة هليوبوليس للتنمية المستدامة إلى تعزيز التكامل بين التعليم العالي والسياسات المناخية والابتكار المستدام، وتوسيع الفرص المتاحة أمام الشباب للمشاركة في مواجهة التحديات البيئية والتنموية على المستويين الإقليمي والعالمي.



كما تعكس مذكرة التفاهم التزام كلايمتفاي بتوسيع شبكة شراكاتها المؤسسية، وتعزيز التعاون المصري الإماراتي، وتطوير نماذج قائمة على تمكين الشباب باعتبارهم شركاء فاعلين في صياغة مستقبل العمل المناخي والتنمية المستدامة في المنطقة.`,

    image: "/partnerships/mou-heliopolis-ceremony.jpg",

    date: "2026-09-20",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Strategic Partnerships",

    categoryAr: "شراكات استراتيجية"

  },

  {

    id: "climatify-bridge-to-eu-opportunities",

    titleEn: "Climatify Connects Young People with European Opportunities Through “Bridge to EU Opportunities” at Heliopolis University Sustainability Week",

    titleAr: "كلايمتفاي تربط الشباب بالفرص الأوروبية من خلال جلسة «Bridge to EU Opportunities» ضمن أسبوع الاستدامة بجامعة هليوبوليس",

    excerptEn: "Climatify organized “Bridge to EU Opportunities” at Heliopolis University Sustainability Week, connecting youth with European networks, climate finance, Erasmus+, and international career pathways with EU Jeel Connect.",

    excerptAr: "نظمت كلايمتفاي جلسة «Bridge to EU Opportunities» ضمن أسبوع الاستدامة بجامعة هليوبوليس، لربط الشباب بالشبكات الأوروبية والتمويل المناخي وبرامج Erasmus+ والفرص الدولية بالتعاون مع EU Jeel Connect.",

    contentEn: `September 2026 | Heliopolis University for Sustainable Development, Cairo, Egypt



As part of Heliopolis University Sustainability Week 2026, Climatify organized “Bridge to EU Opportunities,” an interactive panel discussion designed to connect young people with European youth networks, international institutions, scholarships, professional development programs, and emerging career opportunities in sustainability and climate action.



The session brought together specialists and youth leaders affiliated with the EU Jeel Connect Egypt network, creating a platform for practical knowledge exchange and direct engagement between young participants and professionals with experience in European and international programs.



Moving beyond general awareness of available opportunities, the panel focused on helping young people understand where to find relevant programs, how to access them, and how to position themselves for meaningful participation.



Connecting Youth with European Networks and International Opportunities



The discussion addressed several interconnected areas, including European youth engagement platforms, climate finance, international organizations, Erasmus+ programs, scholarships, and professional development pathways.



Through personal experiences and practical guidance, speakers introduced participants to opportunities for developing their skills, expanding their international networks, and engaging in programs that support academic, professional, and leadership development.



The session emphasized the importance of making international opportunities more accessible to young people by providing clear information, practical application guidance, and direct exposure to professionals working across relevant sectors.



Introducing the EU Jeel Connect Network



Ahmed Yassin, EU Jeel Connect Egypt Country Coordinator, introduced participants to the EU Jeel Connect network, highlighting its role in connecting young people, strengthening youth communities, and creating opportunities for engagement with European initiatives.



His contribution explored how youth networks can facilitate knowledge exchange, cross-cultural dialogue, and participation in regional and international activities.



The discussion also highlighted the value of building professional connections and becoming actively involved in youth networks as a pathway toward broader international engagement.



Exploring Climate Finance as an Emerging Career Pathway



Hager Elsayed, Senior Sustainability Specialist and EU Jeel Connect Egypt Member, addressed the growing importance of climate finance and its relevance to sustainable development and the transition toward a low-carbon economy.



Drawing on her professional experience, she introduced participants to the sector and discussed how young professionals can begin developing the knowledge and competencies needed to explore opportunities in climate-related finance and sustainability.



Her contribution highlighted the importance of connecting climate knowledge with financial mechanisms, professional skills, and emerging career opportunities.



Accessing International Organizations and Development Programs



Donia Elkhatib, Environmental Engineer, Climate and Youth Specialist, and EU Jeel Connect Egypt Member, shared insights into the work of international organizations and the different pathways through which young people can engage with international development and climate initiatives.



The discussion explored opportunities for youth participation, professional development, and engagement with international programs, while emphasizing the importance of building relevant experience and understanding institutional requirements.



Her contribution provided participants with a broader perspective on how to navigate opportunities within international organizations and prepare for future engagement.



Navigating Erasmus+, Scholarships, and European Programs



Yara Hesham, Communication and Visibility Officer at NEO Egypt and EU Jeel Connect Egypt Member, focused on Erasmus+ opportunities, scholarships, and European educational and youth programs.



Her presentation offered practical guidance on identifying suitable opportunities, locating reliable information, understanding application processes, and preparing to pursue international learning and professional development experiences.



The session highlighted the importance of proactive research, application readiness, and aligning available opportunities with individual academic and career goals.



Facilitating Youth Dialogue and Practical Knowledge Exchange



The panel was moderated by Maysara Abdelkarim, Programs Manager at Climatify and EU Jeel Connect Egypt Member, who facilitated an interactive discussion between speakers and young participants.



The format encouraged open dialogue, questions, and the exchange of practical experiences, enabling participants to engage directly with professionals and explore pathways relevant to their individual aspirations.



By combining expert perspectives with accessible guidance, the discussion created a space for young people to move from exploring possibilities to identifying concrete next steps.



Strengthening Youth Access to International Opportunities



The “Bridge to EU Opportunities” panel reflected Climatify’s broader commitment to youth empowerment, capacity building, international cooperation, and connecting education with professional opportunities.



Organized within Heliopolis University Sustainability Week, the session also reinforced the importance of collaboration between universities, youth networks, and development professionals in expanding access to international learning and career pathways.



Through this initiative, Climatify continued its efforts to support young people in navigating European programs, international institutions, climate-related careers, and professional development opportunities, helping bridge the gap between ambition and practical engagement.



The session demonstrated the value of creating accessible platforms where knowledge, professional experience, and international networks translate into tangible opportunities for the next generation of leaders.`,

    contentAr: `سبتمبر 2026 | جامعة هليوبوليس للتنمية المستدامة – القاهرة، مصر



نظمت كلايمتفاي (Climatify)، ضمن فعاليات أسبوع الاستدامة 2026 بجامعة هليوبوليس للتنمية المستدامة، جلسة حوارية تفاعلية بعنوان «Bridge to EU Opportunities – جسر نحو الفرص الأوروبية»، بهدف ربط الشباب بالشبكات الشبابية الأوروبية والمؤسسات الدولية والمنح الدراسية وبرامج التطوير المهني والفرص الناشئة في مجالات الاستدامة والعمل المناخي.



جمعت الجلسة مجموعة من المتخصصين والقيادات الشبابية المنتمية إلى شبكة EU Jeel Connect في مصر، لتوفير منصة لتبادل الخبرات والتواصل المباشر بين الشباب ومهنيين يمتلكون خبرات عملية في البرامج الأوروبية والدولية.



وركزت الجلسة على الانتقال من التعريف العام بالفرص إلى تمكين الشباب من الوصول إليها فعليًا، من خلال توضيح مصادر المعلومات، ومتطلبات التقديم، وآليات الاستعداد للمشاركة في البرامج والمبادرات الدولية.



ربط الشباب بالشبكات الأوروبية والفرص الدولية



تناولت المناقشات عددًا من المحاور المترابطة، شملت شبكات المشاركة الشبابية الأوروبية، والتمويل المناخي، والمنظمات الدولية، وبرامج Erasmus+، والمنح الدراسية، ومسارات التطوير الأكاديمي والمهني.



ومن خلال تجاربهم الشخصية وخبراتهم العملية، استعرض المتحدثون الفرص المتاحة أمام الشباب لتطوير مهاراتهم، وتوسيع شبكات علاقاتهم الدولية، والمشاركة في البرامج التي تدعم التطور الأكاديمي والمهني والقيادي.



وأكدت الجلسة أهمية تسهيل وصول الشباب إلى الفرص الدولية من خلال توفير معلومات واضحة، وإرشادات عملية للتقديم، وإتاحة التواصل المباشر مع المتخصصين العاملين في القطاعات ذات الصلة.



التعريف بشبكة EU Jeel Connect وفرص المشاركة الشبابية



قدم أحمد ياسين، المنسق القطري لشبكة EU Jeel Connect في مصر، عرضًا تعريفيًا بالشبكة ودورها في ربط الشباب وتعزيز المجتمعات الشبابية وتوسيع فرص المشاركة في المبادرات الأوروبية.



وتناول أهمية الشبكات الشبابية في تبادل المعرفة وتعزيز الحوار بين الثقافات والمشاركة في الأنشطة الإقليمية والدولية، إلى جانب دورها في بناء العلاقات المهنية وتطوير الخبرات.



كما سلط الضوء على أهمية الانخراط الفعلي في الشبكات والمجتمعات الشبابية باعتباره أحد المسارات التي تتيح الوصول إلى فرص أوسع للتعاون والمشاركة الدولية.



التمويل المناخي بوصفه مسارًا مهنيًا واعدًا



ناقشت هاجر السيد، أخصائية أولى في الاستدامة وعضو شبكة EU Jeel Connect في مصر، الأهمية المتزايدة لمجال التمويل المناخي (Climate Finance) ودوره في دعم التنمية المستدامة والتحول نحو اقتصاد منخفض الكربون.



واستعرضت، استنادًا إلى خبرتها المهنية، طبيعة هذا القطاع والمهارات والمعارف التي يحتاجها الشباب الراغبون في استكشاف فرص العمل والتخصص في مجالات التمويل المرتبط بالمناخ والاستدامة.



كما أكدت أهمية الربط بين المعرفة المناخية والآليات التمويلية والمهارات المهنية، بما يساعد الشباب على فهم الفرص الوظيفية الناشئة في هذا المجال والاستعداد لها.



الوصول إلى المنظمات الدولية وبرامج التنمية



شاركت دنيا الخطيب، مهندسة بيئية ومتخصصة في المناخ والشباب وعضو شبكة EU Jeel Connect في مصر، بخبراتها حول طبيعة عمل المنظمات الدولية والمسارات المختلفة التي يمكن للشباب من خلالها المشاركة في البرامج والمبادرات التنموية والمناخية.



وتناولت فرص المشاركة الشبابية والتطوير المهني والتفاعل مع البرامج الدولية، مع التركيز على أهمية بناء الخبرات ذات الصلة وفهم المتطلبات المؤسسية وآليات الاستعداد للتقديم.



وقدمت مساهمتها رؤية عملية تساعد المشاركين على فهم بيئة العمل داخل المؤسسات الدولية، وتحديد الخطوات اللازمة لتطوير مؤهلاتهم وتعزيز فرص مشاركتهم مستقبلًا.



استكشاف برامج Erasmus+ والمنح الدراسية الأوروبية



استعرضت يارا هشام، مسؤولة الاتصال والظهور الإعلامي في NEO Egypt وعضو شبكة EU Jeel Connect في مصر، الفرص المتاحة من خلال برنامج Erasmus+ والمنح الدراسية والبرامج التعليمية والشبابية الأوروبية.



وقدمت إرشادات عملية حول كيفية البحث عن الفرص المناسبة، والوصول إلى مصادر المعلومات الموثوقة، وفهم إجراءات التقديم، والاستعداد للمشاركة في برامج التعلم والتبادل والتطوير المهني الدولية.



وأكدت أهمية البحث الاستباقي والاستعداد الجيد لطلبات التقديم وربط الفرص المتاحة بالأهداف الأكاديمية والمهنية لكل مشارك.



حوار تفاعلي وتبادل مباشر للخبرات



أدار الجلسة ميسرة عبد الكريم، مدير البرامج في كلايمتفاي وعضو شبكة EU Jeel Connect في مصر، حيث عمل على تيسير نقاش تفاعلي بين المتحدثين والمشاركين الشباب.



وأتاح أسلوب إدارة الجلسة مساحة مفتوحة لطرح الأسئلة وتبادل التجارب العملية، بما مكّن المشاركين من التواصل المباشر مع المتخصصين واستكشاف المسارات الأكثر ارتباطًا باهتماماتهم وتطلعاتهم.



ومن خلال الجمع بين الخبرات المهنية والإرشادات التطبيقية، ساهمت الجلسة في مساعدة الشباب على الانتقال من استكشاف الفرص إلى تحديد خطوات عملية للاستفادة منها.



تعزيز وصول الشباب إلى الفرص الدولية



عكست جلسة «Bridge to EU Opportunities» التزام كلايمتفاي بتعزيز تمكين الشباب وبناء القدرات والتعاون الدولي وربط التعليم بالفرص الأكاديمية والمهنية.



كما أكدت أهمية التعاون بين الجامعات والشبكات الشبابية والمتخصصين في مجالات التنمية لتوسيع وصول الشباب إلى برامج التعلم والتبادل والخبرات الدولية.



ومن خلال هذه المبادرة، واصلت كلايمتفاي جهودها في دعم الشباب لاستكشاف البرامج الأوروبية والمؤسسات الدولية والمسارات المهنية المرتبطة بالمناخ والاستدامة وفرص التطوير المهني، بما يسهم في تقليص الفجوة بين الطموحات الفردية وإمكانية الوصول إلى الفرص الفعلية.



ومثلت الجلسة نموذجًا لأهمية توفير منصات تفاعلية تربط المعرفة والخبرة المهنية والشبكات الدولية بفرص عملية قابلة للاستكشاف والتقديم والمشاركة، بما يدعم إعداد جيل من الشباب أكثر قدرة على المنافسة والمشاركة في مسارات التنمية على المستويين الإقليمي والدولي.`,

    image: "/climatify-bridge-to-eu-opportunities.jpg",

    date: "2026-09-18",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "International Opportunities & Youth Empowerment",

    categoryAr: "الفرص الدولية وتمكين الشباب"

  },

  {

    id: "uae-future-100-recognition",

    titleEn: "Climatify Recognized Among the UAE’s Future 100 Companies Shaping the Future Economy",

    titleAr: "تكريم «كلايمتفاي» ضمن قائمة «100 شركة من المستقبل» التي تسهم في تشكيل مستقبل اقتصاد دولة الإمارات",

    excerptEn: "Climatify has been officially recognized among the UAE’s Future 100, a national initiative by the UAE Ministry of Economy and Tourism celebrating 100 emerging companies shaping the future economy.",

    excerptAr: "حظيت شركة كلايمتفاي بتكريم رسمي ضمن مبادرة «100 شركة من المستقبل» (Future 100) التي أطلقتها وزارة الاقتصاد والسياحة بدولة الإمارات لتكريم الشركات الواعدة التي تسهم في تطوير اقتصاد المستقبل.",

    contentEn: `Abu Dhabi, UAE | October 2026



Climatify has been officially recognized among the UAE’s Future 100, a national initiative by the UAE Ministry of Economy and Tourism that recognizes 100 emerging companies contributing to the transformation and diversification of the UAE’s economy through innovation, entrepreneurship, and future-oriented business models.



The recognition was celebrated during the Future 100 Third Edition Recognition Ceremony, held on 7 October 2026 in Abu Dhabi, in the presence of H.E. Abdulla bin Touq Al Marri, UAE Minister of Economy and Tourism, alongside senior government officials, business leaders, investors, and representatives of the UAE’s entrepreneurial ecosystem.



This national recognition marks a significant milestone in Climatify’s development as a UAE-based enterprise operating at the intersection of climate digitalization, sustainability education, emerging technologies, and youth-led innovation.



Advancing Climate Digitalization and Innovation



Climatify is working to advance climate digitalization by integrating technology, interactive learning, and data-informed approaches into climate education and capacity development. Its approach combines climate science, digital tools, environmental simulation, systems thinking, and experiential learning to make sustainability challenges more accessible and relevant to real-world decision-making.



Building the Next Generation of Climate Innovators



Youth empowerment remains central to Climatify’s business model and long-term institutional strategy. Through structured capacity-building programs, climate innovation challenges, practical workshops, environmental simulation games, and entrepreneurship initiatives, the company supports young people in moving from climate awareness to the development of practical solutions.



Since its establishment, Climatify has expanded its engagement across the UAE and Egypt, reaching more than 25,000 young people, empowering over 1,000 participants, and supporting more than 250 youth-led ideas and projects through its broader educational and innovation activities.



Contributing to the UAE’s Future Economy



Climatify’s inclusion in the Future 100 reflects the growing relevance of business models that connect technological innovation, environmental sustainability, education, and human capital development. The company’s work is aligned with broader national priorities, including the UAE Net Zero by 2050 Strategic Initiative, the development of a knowledge-based economy, and the expansion of opportunities within the green and digital economies.



A Milestone in Climatify’s Growth



Commenting on the recognition, Mai Moawad, Founder and CEO of Climatify, stated:

“Being recognized among the UAE’s Future 100 companies is an important milestone for Climatify and a strong acknowledgment of the potential of climate-focused innovation within the future economy. Our work is built on the belief that climate digitalization, education, and youth empowerment are interconnected drivers of sustainable development.”`,

    contentAr: `أبوظبي، الإمارات العربية المتحدة | أكتوبر 2026



حظيت شركة كلايمتفاي (Climatify) بتكريم رسمي ضمن مبادرة «100 شركة من المستقبل» (Future 100)، إحدى المبادرات الوطنية التي أطلقتها وزارة الاقتصاد والسياحة بدولة الإمارات العربية المتحدة، لتسليط الضوء على الشركات الناشئة والواعدة التي تسهم في تطوير اقتصاد المستقبل، من خلال الابتكار وريادة الأعمال ونماذج الأعمال القائمة على المعرفة والتكنولوجيا والاستدامة.



وجاء هذا التكريم خلال حفل تكريم الدفعة الثالثة من مبادرة Future 100، الذي أُقيم في العاصمة أبوظبي بتاريخ 7 أكتوبر 2026، بحضور معالي عبدالله بن طوق المري، وزير الاقتصاد والسياحة بدولة الإمارات، إلى جانب نخبة من المسؤولين الحكوميين وقادة الأعمال والمستثمرين وممثلي منظومة ريادة الأعمال والابتكار في الدولة.



التحول الرقمي المناخي والابتكار في صميم نموذج عمل كلايمتفاي



تعمل كلايمتفاي على تعزيز التحول الرقمي في مجالات المناخ والاستدامة، من خلال دمج التكنولوجيا والأدوات الرقمية ومنهجيات التعلم التفاعلي في برامج التعليم المناخي وبناء القدرات. وتركز الشركة على تحويل المفاهيم المتعلقة بالأمن المائي، والزراعة المستدامة، والطاقة، والاقتصاد الدائري، وأسواق الكربون إلى تجارب تطبيقية تساعد المشاركين على فهم الترابط بين القرارات الاقتصادية والبيئية.



الاستثمار في رأس المال البشري وإعداد جيل جديد من المبتكرين



يمثل تمكين الشباب وتنمية رأس المال البشري أحد المحاور الأساسية في استراتيجية كلايمتفاي، حيث تضم محفظة الشركة ألعاب محاكاة تفاعلية وتحديات ريادية مثل AgriClash وGreen Sharks وبرنامج SHIFT. وقد نجحت الشركة منذ تأسيسها في الوصول إلى أكثر من 25 ألف شاب وشابة، وتمكين أكثر من 1,000 مشارك، ودعم ما يزيد على 250 فكرة ومشروعًا شبابيًا.



المساهمة في أولويات الاقتصاد الإماراتي المستقبلي



يأتي اختيار كلايمتفاي ضمن قائمة Future 100 في سياق التوجهات الاستراتيجية لدولة الإمارات نحو تنويع الاقتصاد، وتعزيز الابتكار، وتطوير قطاعات قائمة على التكنولوجيا والاستدامة والمعرفة، وبما يتماشى مع المبادرة الاستراتيجية لتحقيق الحياد المناخي بحلول عام 2050.



وفي تعليقها على هذا التكريم، قالت مي معوض، المؤسس والرئيس التنفيذي لشركة كلايمتفاي:

«يمثل اختيار كلايمتفاي ضمن قائمة 100 شركة من المستقبل اعترافًا وطنيًا مهمًا بنموذج عملنا وبالدور الذي يمكن أن تؤديه الشركات المتخصصة في الابتكار المناخي في تطوير اقتصاد المستقبل. نؤمن بأن التحول الرقمي المناخي، والاستثمار في رأس المال البشري، وتطوير المهارات المستقبلية، عناصر مترابطة لتعزيز القدرة على مواجهة التحديات البيئية وتحويلها إلى فرص اقتصادية وتنموية».`,

    image: "/future-100-recognition.jpg",

    date: "2026-10-07",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "National Recognition",

    categoryAr: "تكريم وطني"

  },

  {

    id: "climatify-shift-first-cohort-graduation",

    titleEn: "Climatify Celebrates the Graduation of SHIFT’s First Cohort, Advancing Youth Leadership and Climate Innovation",

    titleAr: "كلايمتفاي تحتفل بتخريج الدفعة الأولى من برنامج SHIFT لتعزيز القيادة الشبابية والابتكار المناخي",

    excerptEn: "Climatify celebrated the graduation of SHIFT’s first cohort of 60 emerging leaders from 5 countries, showcasing the AgriClash game and youth climate innovation.",

    excerptAr: "احتفلت كلايمتفاي بتخريج الدفعة الأولى من برنامج SHIFT التي ضمت 60 مشاركاً من 5 دول تحت شعار «التمكين يبدأ بالإلهام»، مستعرضة لعبة AgriClash التعليمية.",

    contentEn: `31 January 2026 | Cairo, Egypt



Climatify celebrated the graduation of the first cohort of its SHIFT Internship and Capacity-Building Program, marking a significant milestone in its commitment to youth empowerment, climate education, leadership development, and sustainable innovation.



Held under the theme “Empowerment Starts with Inspiration,” the graduation brought together program participants, SHIFT Ambassadors, speakers, partners, and members of the Climatify community to recognize the achievements of emerging young leaders and celebrate their transition from learning to practical engagement.



The event reflected months of intensive learning, collaboration, and professional development, highlighting the program’s role in equipping young people with the knowledge, skills, and opportunities needed to contribute to climate action and sustainable development.



From Capacity Building to Youth Leadership



SHIFT was designed to bridge the gap between academic knowledge, professional skills, and practical experience, providing participants with opportunities to engage in real-world sustainability challenges.



The first cohort brought together 60 young participants from five countries, engaging them in a structured learning journey covering climate-related thematic areas, technical competencies, and essential professional and leadership skills.



Through interactive sessions, collaborative assignments, mentorship, and project-based learning, participants strengthened their capabilities in climate action, sustainable development, innovation, communication, teamwork, and problem-solving.



The program also encouraged participants to take greater ownership of their professional development and explore opportunities to contribute to community initiatives, research, and youth-led climate solutions.



A Graduation Celebrating Learning, Achievement, and Collaboration



The graduation featured opening remarks, keynote contributions, success stories, interactive workshops, and opportunities for participants to share their experiences and achievements.



Speakers and guests contributed perspectives on youth leadership, professional growth, innovation, and the importance of creating meaningful opportunities for emerging talent.



The event provided a platform to recognize the dedication of SHIFT participants and celebrate their development throughout the program, from building foundational knowledge to applying their skills in collaborative projects and practical activities.



A central part of the celebration was the recognition of SHIFT graduates and Ambassadors, acknowledging their commitment, progress, and continued connection with Climatify’s youth empowerment initiatives.



AgriClash: Transforming Youth Learning into Practical Innovation



One of the event’s highlights was AgriClash, an interactive educational board game developed as one of the key outcomes of the SHIFT Program.



Designed to explore the connections between agriculture, water, energy, climate change, and sustainable resource management, AgriClash introduces participants to complex environmental challenges through experiential learning, negotiation, and strategic decision-making.



The game reflects Climatify’s approach to integrating game-based learning, systems thinking, and youth-led innovation into climate education.



Its presentation during the graduation demonstrated how the SHIFT Program supports participants in moving beyond theoretical learning toward the development of practical educational tools and sustainability-focused initiatives.



Building a Community of Emerging Climate Leaders



Beyond technical training, SHIFT was designed to foster a collaborative community of young professionals capable of contributing to climate and sustainability initiatives at local and regional levels.



Throughout the program, participants gained opportunities to develop their confidence, strengthen communication and leadership capabilities, and engage with peers from different backgrounds.



The graduation highlighted the importance of maintaining these connections beyond the formal training period, creating pathways for graduates to continue contributing through the SHIFT Ambassadors network, community engagement, and future Climatify initiatives.



Recognizing the People Behind SHIFT



Climatify acknowledged the contributions of the speakers, facilitators, program team, partners, and guests who supported the first cohort and contributed to its learning experience.



Special recognition was extended to the SHIFT participants, whose dedication, creativity, and commitment were central to the program’s outcomes.



Their achievements demonstrated the value of investing in young talent through structured capacity-building programs that combine knowledge development, practical experience, and opportunities for leadership.



A Milestone for Climatify’s Youth Empowerment Mission



The graduation of SHIFT’s first cohort represents an important step in Climatify’s efforts to develop inclusive, practice-oriented pathways for youth participation in climate action and sustainable development.



By connecting education with innovation, professional development, and community engagement, SHIFT contributes to preparing emerging leaders to address sustainability challenges and translate their knowledge into meaningful action.



The celebration marked not only the completion of the first cohort’s learning journey, but also the beginning of a new phase in which SHIFT graduates and Ambassadors can continue developing their skills, expanding their networks, and contributing to Climatify’s initiatives.



Through SHIFT, Climatify continues to strengthen its commitment to investing in young people, developing future climate leaders, and creating opportunities for sustainable impact across communities and borders.`,

    contentAr: `31 يناير 2026 | القاهرة، جمهورية مصر العربية



احتفلت كلايمتفاي (Climatify) بتخريج الدفعة الأولى من برنامج SHIFT للتدريب العملي وبناء القدرات الشبابية، في خطوة تعكس التزامها بتمكين الشباب وتعزيز التعليم المناخي وتنمية المهارات القيادية ودعم الابتكار من أجل التنمية المستدامة.



أُقيم حفل التخرج تحت شعار «التمكين يبدأ بالإلهام» (Empowerment Starts with Inspiration)، بحضور المشاركين في البرنامج وسفراء SHIFT ونخبة من المتحدثين والشركاء وأعضاء مجتمع كلايمتفاي، للاحتفاء بإنجازات القيادات الشبابية الناشئة وانتقالها من مرحلة التعلم إلى المشاركة العملية.



وجاء الحفل تتويجًا لأشهر من التعلم المكثف والتعاون والتطوير المهني، مسلطًا الضوء على دور البرنامج في تزويد الشباب بالمعارف والمهارات والفرص التي تؤهلهم للمساهمة في العمل المناخي والتنمية المستدامة.



من بناء القدرات إلى إعداد القيادات الشبابية



صُمم برنامج SHIFT لسد الفجوة بين المعرفة الأكاديمية والمهارات المهنية والخبرة العملية، من خلال إتاحة فرص للشباب للتعامل مع تحديات واقعية مرتبطة بالمناخ والاستدامة.



وضمت الدفعة الأولى 60 مشاركًا شابًا من خمس دول، انخرطوا في رحلة تعليمية وتدريبية منظمة شملت مجالات معرفية مرتبطة بالمناخ والاستدامة، إلى جانب تنمية المهارات التقنية والمهنية والقيادية.



ومن خلال الجلسات التفاعلية والتكليفات الجماعية والتوجيه والتعلم القائم على المشروعات، عمل المشاركون على تطوير قدراتهم في العمل المناخي والتنمية المستدامة والابتكار والتواصل والعمل الجماعي وحل المشكلات.



كما شجع البرنامج المشاركين على تحمل مسؤولية تطوير مساراتهم المهنية واستكشاف فرص المساهمة في المبادرات المجتمعية والبحثية والحلول المناخية التي يقودها الشباب.



حفل تخرج يجمع بين التعلم والإنجاز والتعاون



تضمن حفل التخرج كلمات افتتاحية ومداخلات رئيسية وقصص نجاح وورش عمل تفاعلية، إلى جانب مساحات أتاحت للمشاركين مشاركة تجاربهم وإنجازاتهم خلال البرنامج.



وقدم المتحدثون والضيوف رؤى متنوعة حول القيادة الشبابية والتطوير المهني والابتكار وأهمية توفير فرص حقيقية للمواهب الناشئة.



كما مثّل الحفل منصة لتقدير جهود المشاركين والاحتفاء بتطورهم على مدار البرنامج، بدءًا من اكتساب المعارف الأساسية وصولًا إلى تطبيق المهارات في المشروعات الجماعية والأنشطة العملية.



وشكّل تكريم خريجي البرنامج وسفراء SHIFT أحد المحاور الرئيسية للاحتفال، تقديرًا لالتزامهم وتطورهم واستمرار ارتباطهم بمبادرات كلايمتفاي لتمكين الشباب.



AgriClash: تحويل التعلم الشبابي إلى ابتكار تطبيقي



كان من أبرز محطات الحفل استعراض AgriClash، وهي لعبة تعليمية تفاعلية طُورت باعتبارها أحد المخرجات الرئيسية لبرنامج SHIFT.



صُممت اللعبة لاستكشاف العلاقات المتداخلة بين الزراعة والمياه والطاقة والتغير المناخي والإدارة المستدامة للموارد، من خلال تجربة تعليمية تعتمد على المحاكاة والتفاوض والتفكير الاستراتيجي واتخاذ القرار.



وتجسد AgriClash منهجية كلايمتفاي في دمج التعلم القائم على الألعاب والتفكير المنظومي والابتكار الذي يقوده الشباب ضمن برامج التعليم المناخي.



كما أظهر تقديم اللعبة خلال حفل التخرج قدرة البرنامج على دعم المشاركين في الانتقال من التعلم النظري إلى تطوير أدوات تعليمية وتطبيقات عملية مرتبطة بالاستدامة.



بناء مجتمع من القيادات المناخية الشابة



لم يقتصر برنامج SHIFT على التدريب التقني والمهني، بل استهدف أيضًا بناء مجتمع تعاوني من الشباب القادرين على المساهمة في المبادرات المناخية والتنموية على المستويين المحلي والإقليمي.



وخلال رحلتهم التدريبية، أُتيحت للمشاركين فرص لتعزيز ثقتهم بأنفسهم وتطوير مهارات التواصل والقيادة والعمل مع أقرانهم من خلفيات متنوعة.



وأكد حفل التخرج أهمية استدامة هذه الروابط بعد انتهاء فترة التدريب، من خلال توفير مسارات تتيح للخريجين مواصلة المشاركة عبر شبكة سفراء SHIFT والمبادرات المجتمعية والبرامج المستقبلية لكلايمتفاي.



تقدير المساهمين في نجاح الدفعة الأولى



أعربت كلايمتفاي عن تقديرها للمتحدثين والمدربين وفريق البرنامج والشركاء والضيوف الذين ساهموا في دعم الدفعة الأولى وإثراء تجربتها التعليمية والتدريبية.



كما خصصت تقديرًا للمشاركين في SHIFT، الذين شكّل التزامهم وإبداعهم وروح المبادرة لديهم عنصرًا أساسيًا في تحقيق مخرجات البرنامج.



وعكست إنجازاتهم أهمية الاستثمار في الطاقات الشبابية من خلال برامج منظمة لبناء القدرات تجمع بين تنمية المعرفة والخبرة العملية وإتاحة فرص القيادة والمشاركة الفاعلة.



محطة جديدة في مسيرة كلايمتفاي لتمكين الشباب



يمثل تخريج الدفعة الأولى من SHIFT محطة مهمة في جهود كلايمتفاي لتطوير مسارات تدريبية وتطبيقية شاملة تعزز مشاركة الشباب في العمل المناخي والتنمية المستدامة.



ومن خلال الربط بين التعليم والابتكار والتطوير المهني والمشاركة المجتمعية، يسهم البرنامج في إعداد قيادات شابة قادرة على التعامل مع تحديات الاستدامة وتحويل معارفها ومهاراتها إلى مبادرات عملية.



ولم يكن حفل التخرج مجرد ختام للمرحلة التدريبية، بل شكّل بداية لمرحلة جديدة تتيح لخريجي SHIFT وسفرائه مواصلة تطوير قدراتهم وتوسيع شبكاتهم المهنية والمشاركة في مبادرات كلايمتفاي المستقبلية.



ومن خلال هذا البرنامج، تواصل كلايمتفاي تعزيز التزامها بالاستثمار في الشباب، وإعداد قيادات مناخية ناشئة، وتوفير فرص حقيقية لتحقيق أثر تنموي مستدام على المستويين المحلي والإقليمي.`,

    image: "/climatify-shift-first-cohort-graduation.jpg",

    date: "2026-01-31",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Youth Leadership & Capacity Building",

    categoryAr: "القيادة الشبابية وبناء القدرات"

  },

  {

    id: "heba-momtaz-arab-youth-pioneers",

    titleEn: "Climatify Co-Founder Heba Momtaz Recognized Among Arab Youth Pioneers in Sustainability and Environmental Action",

    titleAr: "تكريم هبة ممتاز الشريك المؤسس لكلايمتفاي ضمن «رواد الشباب العربي» في الاستدامة والعمل البيئي",

    excerptEn: "Climatify proudly announces the selection of Heba Momtaz, Co-Founder and Director of Community Development, among the Arab Youth Pioneers in Sustainability and Environmental Action.",

    excerptAr: "تعلن كلايمتفاي بكل فخر عن اختيار هبة ممتاز الشريك المؤسس ورئيس قطاع التطوير المجتمعي ضمن مبادرة «رواد الشباب العربي» في مسار الاستدامة والعمل البيئي من قِبل مركز الشباب العربي.",

    contentEn: `October 2025 | United Arab Emirates



Climatify proudly announces the selection of Heba Momtaz, Co-Founder and Director of Community Development, among the Arab Youth Pioneers in Sustainability and Environmental Action, an initiative by the Arab Youth Center recognizing outstanding young leaders contributing to sustainable development across the Arab region.



The Arab Youth Pioneers Program celebrates emerging leaders whose initiatives, innovation, and leadership are advancing progress in sustainability, entrepreneurship, technology, and community development.



This recognition highlights Heba’s contributions to youth empowerment, community development, and environmental action, reflecting Climatify’s commitment to strengthening youth leadership and advancing climate and sustainability initiatives at local and regional levels.



It also represents an important milestone in Climatify’s journey to expand its regional engagement and support a new generation of changemakers across the Arab world.`,

    contentAr: `أكتوبر 2025 | الإمارات العربية المتحدة



تعلن كلايمتفاي (Climatify) بكل فخر عن اختيار هبة ممتاز، الشريك المؤسس ورئيس قطاع التطوير المجتمعي، ضمن مبادرة «رواد الشباب العربي» في مسار الاستدامة والعمل البيئي، إحدى مبادرات مركز الشباب العربي لتكريم القادة الشباب المتميزين الذين يسهمون في دفع عجلة التنمية المستدامة في المنطقة العربية.



ويحتفي برنامج «رواد الشباب العربي» بالطاقات والقيادات الواعدة التي تقود مبادرات وابتكارات تسهم في تعزيز مسارات الاستدامة، وريادة الأعمال، والتكنولوجيا، والتنمية المجتمعية.



ويأتي هذا التكريم ليسلط الضوء على جهود هبة ممتاز وإسهاماتها في تمكين الشباب وتطوير المبادرات المجتمعية والعمل البيئي، بما يعكس التزام كلايمتفاي بتعزيز القيادة الشبابية وتفعيل المبادرات المناخية والمستدامة محلياً وإقليمياً.



كما يمثل هذا الإنجاز محطة فارقة في مسيرة كلايمتفاي نحو توسيع نطاق أثرها الإقليمي ودعم جيل جديد من صنّاع التغيير في العالم العربي.`,

    image: "/heba-momtaz-arab-youth-pioneers.jpg",

    date: "2025-10-25",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Regional Recognition",

    categoryAr: "تكريم إقليمي"

  },

  {

    id: "forbes-sustainability-summit",

    titleEn: "Climatify at the Forbes Middle East Sustainability Leaders Summit 2025",

    titleAr: "مشاركة كلايمتفاي في قمة فوربس الشرق الأوسط لقادة الاستدامة 2025 بأبوظبي",

    excerptEn: "Climatify participated in the Forbes Middle East Sustainability Leaders Summit 2025, represented by Co-Founders Dr. Marwa Shalwani and Mai Moawad.",

    excerptAr: "شاركت كلايمتفاي في قمة فوربس الشرق الأوسط لقادة الاستدامة 2025 بأبوظبي، ممثلةً بالشريكتين المؤسستين الدكتورة مروة شلواني ومي معوض.",

    contentEn: `October 2025 | Abu Dhabi, United Arab Emirates



Climatify participated in the Forbes Middle East Sustainability Leaders Summit 2025, represented by its Co-Founders, Dr. Marwa Shalwani and Mai Moawad, as speakers in the panel discussion titled “Eco-Entrepreneurs: Youth-Led Startups Powering a Sustainable Future,” hosted at the Youth Hub in Abu Dhabi.



The discussion explored the growing role of youth-led enterprises in addressing environmental and climate challenges, highlighting how education, digital transformation, innovation, and entrepreneurship can accelerate the transition toward a more sustainable economy.



Dr. Marwa Shalwani emphasized the importance of embedding sustainability into institutional practices and collective responsibility. She highlighted Climatify’s approach to experiential learning and interactive climate education, demonstrating how practical engagement can equip young people with the knowledge and skills to translate environmental awareness into measurable action.



Mai Moawad addressed the strategic role of youth and women in advancing inclusive climate action, emphasizing how digital transformation and emerging technologies can expand access to knowledge, innovation, and economic opportunities. She presented Climatify’s flagship initiatives, including the SHIFT Internship Program, designed to equip young people with practical competencies aligned with the green labor market, and the EYWAN Network, which supports young women’s leadership in sustainable agricultural development.



The discussion further highlighted Climatify’s strategic alignment with the UAE’s national sustainability priorities and international climate and development agendas, particularly through human capital development, climate innovation, and youth participation in the green economy.



Climatify’s participation reinforced its engagement in regional and international sustainability dialogues, contributing practical perspectives on climate entrepreneurship, technology-enabled education, and the development of the next generation of climate leaders.`,

    contentAr: `أكتوبر 2025 | أبوظبي، الإمارات العربية المتحدة



شاركت كلايمتفاي (Climatify) في قمة فوربس الشرق الأوسط لقادة الاستدامة 2025، من خلال مشاركة الشريكتين المؤسستين، الدكتورة مروة شلواني ومي معوض، في جلسة نقاشية بعنوان «رواد الأعمال البيئيون: الشركات الناشئة بقيادة الشباب نحو مستقبل مستدام»، والتي استضافها مركز الشباب في أبوظبي.



تناولت الجلسة الدور المتنامي للشركات الناشئة والقيادات الشبابية في تطوير حلول مبتكرة للتحديات البيئية والمناخية، وأهمية دمج التعليم والتكنولوجيا وريادة الأعمال في تسريع التحول نحو اقتصاد أكثر استدامة.



استعرضت الدكتورة مروة شلواني أهمية ترسيخ الاستدامة باعتبارها نهجًا مؤسسيًا ومسؤولية مجتمعية مشتركة، مؤكدة دور المبادرات الفردية والجماعية في تحقيق أثر بيئي ملموس. كما سلطت الضوء على نموذج كلايمتفاي في توظيف التعليم التفاعلي والتعلم القائم على التجربة لتمكين الشباب واليافعين من تحويل المعرفة المناخية إلى ممارسات وحلول عملية.



من جانبها، أكدت مي معوض الدور المحوري للشباب والنساء في قيادة العمل المناخي الشامل، وأهمية التحول الرقمي والتكنولوجيا في توسيع الوصول إلى المعرفة والفرص وتعزيز الابتكار. كما استعرضت عددًا من مبادرات كلايمتفاي الاستراتيجية، من بينها برنامج SHIFT للتدريب وبناء القدرات، الهادف إلى تأهيل الشباب بمهارات عملية تتوافق مع متطلبات سوق العمل الأخضر، وشبكة EYWAN المعنية بتمكين الشابات من قيادة جهود التنمية الزراعية المستدامة.



وسلطت المشاركة الضوء على توافق التوجه الاستراتيجي لكلايمتفاي مع أولويات الاستدامة الوطنية لدولة الإمارات والأجندات المناخية الدولية، من خلال الاستثمار في رأس المال البشري، وتعزيز الابتكار، وربط بناء القدرات الشبابية بفرص التنمية الاقتصادية والبيئية.



وتأتي مشاركة كلايمتفاي في هذه القمة ضمن جهودها لتعزيز حضورها في منصات الحوار الإقليمية والدولية، والمساهمة في النقاشات الاستراتيجية المتعلقة بالاستدامة وريادة الأعمال المناخية وتمكين الجيل القادم من القيادات وصناع التغيير.`,

    image: "/forbes-middle-east-sustainability-summit.jpg",

    date: "2025-10-18",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Global Summits",

    categoryAr: "قمم عالمية"

  },

  {

    id: "marwa-shalwani-iucn-changemakers",

    titleEn: "Climatify Co-Founder Selected Among UAE Changemakers at the IUCN World Conservation Congress 2025",

    titleAr: "اختيار الشريكة المؤسسة لكلايمتفاي ضمن رواد التغيير في دولة الإمارات خلال المؤتمر العالمي للحفاظ على الطبيعة 2025",

    excerptEn: "Climatify proudly announces the selection of Dr. Marwa Al-Shalwani among the UAE Changemakers participating in the IUCN World Conservation Congress 2025 in Abu Dhabi.",

    excerptAr: "تعتز كلايمتفاي باختيار الدكتورة مروة الشلواني الشريكة المؤسسة ضمن رواد التغيير في دولة الإمارات (UAE Changemakers) في المؤتمر العالمي للحفاظ على الطبيعة 2025.",

    contentEn: `October 2025 | Abu Dhabi, United Arab Emirates



Climatify proudly announces the selection of Dr. Marwa Al-Shalwani, Co-Founder of Climatify, among the UAE Changemakers participating in the IUCN World Conservation Congress 2025, held in Abu Dhabi.



Organized by the International Union for Conservation of Nature (IUCN), the Congress serves as a leading global platform bringing together government representatives, international organizations, environmental experts, businesses, and civil society to advance biodiversity conservation, climate action, and sustainable development.



The IUCN Changemakers Programme recognizes emerging leaders and innovators developing solutions to pressing environmental challenges. It provides opportunities for international collaboration, knowledge exchange, and engagement with policymakers, experts, and institutions working to accelerate nature-positive solutions.



Dr. Al-Shalwani’s selection highlights her contributions to sustainability, environmental education, and youth empowerment, while reflecting Climatify’s commitment to strengthening youth and women’s leadership in addressing climate and biodiversity challenges.



This recognition also marks an important milestone in Climatify’s growing international engagement, reinforcing its role as a UAE-based enterprise contributing to global sustainability dialogue and promoting youth-driven approaches to environmental action.



Through its participation in international platforms such as the IUCN World Conservation Congress, Climatify continues to strengthen connections between local initiatives, regional priorities, and global environmental agendas.`,

    contentAr: `أكتوبر 2025 | أبوظبي، الإمارات العربية المتحدة



تعتز كلايمتفاي (Climatify) باختيار الدكتورة مروة الشلواني، الشريكة المؤسسة لكلايمتفاي، ضمن رواد التغيير في دولة الإمارات (UAE Changemakers) للمشاركة في المؤتمر العالمي للحفاظ على الطبيعة 2025 (IUCN World Conservation Congress)، الذي استضافته إمارة أبوظبي.



يُعد المؤتمر، الذي ينظمه الاتحاد الدولي لحفظ الطبيعة (IUCN)، إحدى أبرز المنصات الدولية المعنية بحماية التنوع البيولوجي والاستدامة البيئية، حيث يجمع ممثلين عن الحكومات والمنظمات الدولية والمؤسسات البحثية والقطاع الخاص والمجتمع المدني، بهدف تعزيز التعاون الدولي وتطوير السياسات والحلول الداعمة لحماية الطبيعة ومواجهة التحديات المناخية.



ويهدف برنامج رواد التغيير (IUCN Changemakers) إلى إبراز القيادات الشابة والمبتكرين الذين يقدمون حلولًا للتحديات البيئية العالمية، وإتاحة فرص للتواصل مع الخبراء وصناع القرار والمؤسسات الدولية، بما يسهم في تبادل المعرفة وتسريع تطوير الحلول القائمة على حماية الطبيعة والاستدامة.



ويعكس اختيار الدكتورة مروة الشلواني إسهاماتها في مجالات الاستدامة والتعليم البيئي وتمكين الشباب، كما يؤكد التزام كلايمتفاي بتعزيز مشاركة الشباب والنساء في قيادة المبادرات المناخية والبيئية وتطوير حلول مبتكرة للتحديات المرتبطة بالتنوع البيولوجي والتنمية المستدامة.



ويمثل هذا التقدير محطة مهمة في تعزيز الحضور الدولي لكلايمتفاي، بوصفها مؤسسة إماراتية تسهم في ربط المبادرات المحلية بالأولويات الإقليمية والأجندات البيئية العالمية، وتدعم توسيع مشاركة القيادات الشبابية في الحوارات الدولية المتعلقة بالمناخ وحماية الطبيعة.



وتواصل كلايمتفاي، من خلال حضورها في المنصات الدولية، تعزيز دورها في بناء القدرات وتطوير الشراكات وتبادل الخبرات، بما يدعم جهود دولة الإمارات والمجتمع الدولي نحو مستقبل أكثر استدامة وقدرة على مواجهة التحديات البيئية.`,

    image: "/marwa-shalwani-iucn-changemakers.png",

    date: "2025-10-12",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Global Conservation",

    categoryAr: "صون الطبيعة الدولي"

  },

  {

    id: "world-utilities-congress-2025",

    titleEn: "Climatify Participates in the Youth Energy Forum at the World Utilities Congress 2025",

    titleAr: "مشاركة كلايمتفاي في منتدى طاقة الشباب ضمن المؤتمر العالمي للمرافق 2025",

    excerptEn: "Climatify participated in the Youth Energy Forum at the World Utilities Congress 2025, organized by the TAQA Group Youth Council in Abu Dhabi.",

    excerptAr: "شاركت كلايمتفاي في منتدى طاقة الشباب ضمن فعاليات المؤتمر العالمي للمرافق 2025، بتنظيم من مجلس شباب مجموعة طاقة في أبوظبي.",

    contentEn: `May 2025 | Abu Dhabi, United Arab Emirates



Climatify participated in the Youth Energy Forum, held as part of the World Utilities Congress 2025, organized by the TAQA Group Youth Council. The forum brought together energy sector representatives, industry experts, and emerging youth leaders to explore the future of sustainable energy and the role of young professionals in accelerating the energy transition.



Eng. Abdullah Al-Salmany, Co-Founder of Climatify, participated as a representative of the Regional Conference of Youth on Climate Change for the Middle East and North Africa (RCOY MENA) in a panel discussion titled “Powering Tomorrow’s Energy Transition: Youth Perspectives on Sustainable Solutions.” During the session, he highlighted youth-driven strategies and innovative approaches to accelerating the energy transition and advancing net-zero objectives.



Climatify also engaged in interactive discussions and technical workshops, including “Planning the Energy Transition: A Youth-Led Grid Innovation Workshop,” conducted with the Emirates Environmental Group. The workshop focused on practical approaches to decarbonization, energy systems innovation, and collaborative solutions developed by young professionals from across the region.



The participation emphasized the importance of integrating youth perspectives into strategic energy discussions, connecting climate innovation with industry priorities, and strengthening young leaders’ contributions to energy security, environmental sustainability, and low-carbon development.



Building on its collaboration with RCOY MENA 2024, Climatify’s involvement reinforced its commitment to advancing regional Arab climate action and expanding meaningful youth participation in high-level platforms connecting policymakers, private sector leaders, and energy industry stakeholders.



Through this engagement, Climatify continues to strengthen the connection between youth-led climate initiatives and the energy sector, promoting cross-sector collaboration, practical innovation, and youth participation in shaping sustainable energy policies and solutions aligned with national and regional decarbonization priorities.`,

    contentAr: `مايو 2025 | أبوظبي، الإمارات العربية المتحدة



شاركت كلايمتفاي (Climatify) في منتدى طاقة الشباب (Youth Energy Forum)، الذي عُقد ضمن فعاليات المؤتمر العالمي للمرافق 2025 (World Utilities Congress)، بتنظيم من مجلس شباب مجموعة طاقة (TAQA Group Youth Council)، بمشاركة ممثلين عن قطاع الطاقة والخبراء والقيادات الشبابية المعنية بمستقبل التحول نحو الطاقة المستدامة.



وشارك المهندس عبدالله السلماني، الشريك المؤسس لكلايمتفاي، ممثلًا عن المؤتمر الإقليمي للشباب المعني بتغير المناخ في الشرق الأوسط وشمال أفريقيا (RCOY MENA)، في جلسة نقاشية بعنوان «تمكين التحول في قطاع الطاقة: رؤى شبابية لحلول مستدامة»، حيث استعرض دور الشباب في تطوير استراتيجيات وحلول مبتكرة لتسريع التحول في قطاع الطاقة ودعم الجهود الرامية إلى تحقيق الحياد الكربوني.



كما شاركت كلايمتفاي في جلسات العمل التفاعلية، من بينها ورشة «التخطيط للتحول في قطاع الطاقة: الابتكار في شبكات الكهرباء بقيادة الشباب»، بالتعاون مع مجموعة الإمارات للبيئة، والتي ركزت على تطوير حلول عملية لإزالة الكربون وتعزيز الابتكار في أنظمة الطاقة، بمشاركة شباب ومتخصصين من مختلف دول المنطقة.



وسلطت هذه المشاركة الضوء على أهمية إشراك الشباب في الحوارات الاستراتيجية المتعلقة بمستقبل الطاقة، وربط الابتكار المناخي باحتياجات القطاع، وتعزيز مساهمة القيادات الشبابية في تطوير حلول تدعم أمن الطاقة والاستدامة البيئية.



وتأتي مشاركة كلايمتفاي في إطار تعاونها مع RCOY MENA 2024، ودعم الجهود الإقليمية لتعزيز العمل المناخي العربي، وتوسيع مشاركة الشباب في المنصات المتخصصة التي تجمع صناع القرار والقطاع الخاص والمؤسسات المعنية بالتحول في قطاع الطاقة.



وتعكس هذه المشاركة توجه كلايمتفاي نحو تعزيز حضور الشباب في الحوارات الإقليمية رفيعة المستوى، وبناء جسور التعاون بين المبادرات الشبابية والمؤسسات العاملة في قطاعات الطاقة والمناخ والاستدامة، بما يدعم تطوير حلول عملية تتماشى مع الأولويات الوطنية والإقليمية للتحول نحو اقتصاد منخفض الكربون.`,

    image: "/world-utilities-congress-2025.jpg",

    date: "2025-05-28",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Energy Transition",

    categoryAr: "تحول الطاقة"

  },

  {

    id: "youth-climate-mobility-forum-2025",

    titleEn: "Climatify Participates in the Youth Climate Mobility Innovation Forum and Hackathon 2025",

    titleAr: "مشاركة كلايمتفاي في منتدى ابتكارات الشباب في مجال التنقل المناخي والهاكاثون 2025",

    excerptEn: "Climatify participated in the Youth Climate Mobility Innovation Forum and Hackathon 2025 in Cairo, organized by the IOM, YOUNGO, Green Space Iraq, and PolicyTabs.",

    excerptAr: "شاركت كلايمتفاي بوفد من ممثليها في منتدى ابتكارات الشباب في مجال التنقل المناخي والهاكاثون 2025 بالقاهرة، المنظم من قِبل المنظمة الدولية للهجرة وYOUNGO وشركائهم.",

    contentEn: `25–27 September 2025 | Cairo, Egypt



Climatify participated in the Youth Climate Mobility Innovation Forum and Hackathon 2025, held at the Hilton Cairo Zamalek in Egypt, bringing together youth leaders, climate experts, policymakers, and innovators from across the Middle East and North Africa (MENA) region.



The three-day forum was organized by the International Organization for Migration (IOM) Regional Office for the Middle East and North Africa, in collaboration with the YOUNGO Migration Working Group, Green Space Iraq, and PolicyTabs. The event focused on the intersection of climate change, human mobility, environmental challenges, and sustainable development, with particular emphasis on youth-led innovation and policy engagement.



The program featured capacity-building workshops delivered by regional and international experts, technical mentorship, collaborative project development, and a hackathon designed to advance innovative responses to climate-induced mobility challenges.



As part of Climatify’s delegation, Dr. Sherif Elrefaey, Climate Policy Analyst, led a specialized workshop on “Green Technology, Digital Innovation, and Climate Mobility.” The session explored the potential of emerging technologies and digital solutions to address the complex relationship between climate change and human mobility, highlighting opportunities for technology-driven approaches to strengthen resilience and support vulnerable communities.



Climatify’s participation contributed to regional discussions on integrating youth perspectives into climate mobility policies, strengthening cross-sector collaboration, and connecting technological innovation with practical responses to climate-related displacement and migration challenges.



The forum also provided an opportunity to engage with regional stakeholders, exchange expertise, and explore collaborative approaches to developing youth-driven solutions at the intersection of climate policy, digital innovation, and human mobility.



Through this engagement, Climatify reinforced its commitment to advancing youth participation in regional climate policy dialogues, promoting inclusive innovation, and strengthening the role of young professionals in addressing emerging climate and development challenges across the MENA region.`,

    contentAr: `25–27 سبتمبر 2025 | القاهرة، جمهورية مصر العربية



شاركت كلايمتفاي (Climatify) بوفد من ممثليها في منتدى ابتكارات الشباب في مجال التنقل المناخي والهاكاثون (Youth Climate Mobility Innovation Forum and Hackathon 2025)، الذي استضافه فندق هيلتون القاهرة الزمالك، بمشاركة قيادات شبابية وخبراء في السياسات المناخية وصناع قرار ومبتكرين من مختلف دول منطقة الشرق الأوسط وشمال أفريقيا.



نُظم المنتدى على مدار ثلاثة أيام من قِبل المنظمة الدولية للهجرة (IOM) – المكتب الإقليمي للشرق الأوسط وشمال أفريقيا، بالتعاون مع مجموعة عمل الهجرة التابعة لشبكة YOUNGO، ومؤسسة Green Space Iraq، وPolicyTabs، بهدف بحث الترابط بين تغير المناخ والتنقل البشري والتحديات البيئية والتنمية المستدامة، مع التركيز على الابتكار بقيادة الشباب وتعزيز مشاركتهم في الحوارات والسياسات الإقليمية.



تضمن البرنامج ورش عمل متخصصة لبناء القدرات بمشاركة خبراء إقليميين ودوليين، وجلسات للإرشاد الفني وتطوير المشروعات، إلى جانب مسابقة هاكاثون هدفت إلى تطوير حلول مبتكرة للتحديات المرتبطة بالتنقل البشري الناتج عن التأثيرات المناخية.



وفي إطار مشاركة وفد كلايمتفاي، قدم الدكتور شريف الرفاعي، محلل السياسات المناخية، ورشة عمل متخصصة بعنوان «التكنولوجيا الخضراء والابتكار الرقمي والتنقل المناخي»، تناولت دور التقنيات الناشئة والحلول الرقمية في التعامل مع العلاقة المعقدة بين تغير المناخ والتنقل البشري، واستعرضت فرص توظيف التكنولوجيا لتعزيز القدرة على التكيف ودعم المجتمعات الأكثر تأثرًا بالتغيرات المناخية.



وساهمت مشاركة كلايمتفاي في إثراء النقاشات الإقليمية حول دمج وجهات نظر الشباب في سياسات التنقل المناخي، وتعزيز التعاون بين القطاعات المختلفة، وربط الابتكار التكنولوجي بتطوير استجابات عملية لتحديات النزوح والهجرة المرتبطة بالمناخ.



كما أتاح المنتدى فرصة للتواصل مع المؤسسات والخبراء والشركاء الإقليميين، وتبادل المعرفة والخبرات، واستكشاف مجالات التعاون في تطوير حلول يقودها الشباب عند تقاطع السياسات المناخية والتحول الرقمي والتنقل البشري.



وتأتي هذه المشاركة ضمن التوجه الاستراتيجي لكلايمتفاي نحو تعزيز حضور الشباب في الحوارات الإقليمية المتعلقة بالسياسات المناخية، ودعم الابتكار الشامل، وبناء قدرات القيادات الشبابية على المساهمة في مواجهة التحديات المناخية والتنموية، بما يعزز دورها في ربط المبادرات الشبابية بأولويات التنمية المستدامة في منطقة الشرق الأوسط وشمال أفريقيا.`,

    image: "/youth-climate-mobility-forum-2025.jpg",

    date: "2025-09-27",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Climate Mobility & Policy",

    categoryAr: "التنقل المناخي والسياسات"

  },

  {

    id: "egyptian-water-youth-dialogue-2025",

    titleEn: "Climatify Participates in the Egyptian Water Youth Dialogue to Advance Water Security and Climate Resilience",

    titleAr: "مشاركة كلايمتفاي في الحوار المصري للشباب حول المياه وتعزيز القدرة على التكيف المناخي",

    excerptEn: "Climatify participated as a partner in the Egyptian Water Youth Dialogue in Alexandria, bringing together over 50 young leaders to strengthen engagement in water security.",

    excerptAr: "شاركت كلايمتفاي كشريك في الحوار المصري للشباب حول المياه بالإسكندرية، بمشاركة أكثر من 50 شابًا وشابة لتعزيز دور الشباب في قضايا الأمن المائي والتكيف المناخي.",

    contentEn: `2025 | Alexandria, Egypt



Climatify participated as a partner in the Egyptian Water Youth Dialogue, held in Alexandria, bringing together more than 50 young leaders representing civil society organizations, universities, and grassroots initiatives to strengthen youth engagement in water security, climate governance, and sustainable development.



The dialogue was supported through collaboration among several partners, including Wavemakers United, Climatify, and Anuket, providing a platform for knowledge exchange, policy discussions, and the development of practical approaches to addressing interconnected water, food, and climate challenges.



Discussions focused on strengthening youth leadership in water, food, and climate governance, advancing locally driven solutions through cross-sector collaboration, and expanding youth participation in shaping policies and recommendations related to sustainable water resource management and climate adaptation.



The dialogue also emphasized the importance of coordinating national youth efforts ahead of Cairo Water Week 2025 and the 2026 United Nations Water Conference, with participants identifying shared priorities and proposing a roadmap to strengthen Egyptian youth contributions to regional and international water policy discussions.



Shortly after the event, Alexandria experienced an unusual storm that caused flooding and disrupted mobility, underscoring the importance of strengthening urban resilience, improving water infrastructure, and developing locally responsive climate adaptation strategies.



The dialogue brought forward initial action plans and collaborative priorities aimed at strengthening cooperation among youth organizations, academic institutions, and community-based initiatives while promoting inclusive approaches to water governance.



Climatify’s participation reflects its commitment to advancing youth engagement in water governance, climate policy, and sustainable resource management, while supporting stronger connections between civil society, institutional stakeholders, and decision-makers.



The initiative represents an important step toward connecting local youth-led action with regional and global water agendas, contributing to broader efforts to strengthen water security, climate resilience, and youth participation in shaping sustainable water futures across Egypt and the wider region.`,

    contentAr: `2025 | الإسكندرية، جمهورية مصر العربية



شاركت كلايمتفاي (Climatify) كشريك في الحوار المصري للشباب حول المياه (Egyptian Water Youth Dialogue)، الذي استضافته مدينة الإسكندرية، بمشاركة أكثر من 50 شابًا وشابة من ممثلي منظمات المجتمع المدني والجامعات والمبادرات المجتمعية، بهدف تعزيز دور الشباب في قضايا الأمن المائي والحوكمة المناخية والتنمية المستدامة.



نُظم الحوار في إطار التعاون بين عدد من الشركاء، من بينهم Wavemakers United وClimatify وAnuket، وشكّل منصة لتبادل الرؤى والخبرات وتطوير مقترحات عملية لمواجهة التحديات المتزايدة المرتبطة بالمياه والغذاء وتغير المناخ.



ركزت المناقشات على تعزيز القيادة الشبابية في حوكمة المياه والغذاء والمناخ، وتطوير حلول محلية قائمة على التعاون بين القطاعات المختلفة، إلى جانب دعم مشاركة الشباب في صياغة التوصيات والسياسات المرتبطة بالإدارة المستدامة للموارد المائية والقدرة على التكيف مع التغيرات المناخية.



كما تناول الحوار أهمية تنسيق الجهود الشبابية الوطنية استعدادًا للمشاركة في أسبوع القاهرة للمياه ومؤتمر الأمم المتحدة للمياه 2026، من خلال بلورة أولويات مشتركة وخارطة طريق تعزز مساهمة الشباب المصري في الحوارات الإقليمية والدولية المتعلقة بالأمن المائي.



وجاء انعقاد الحوار بالتزامن مع فترة شهدت فيها الإسكندرية اضطرابات جوية وأمطارًا استثنائية عقب انتهاء الفعالية، ما أبرز أهمية تعزيز مرونة المدن والبنية التحتية المائية، وتطوير استجابات محلية قادرة على التعامل مع المخاطر المناخية المتزايدة.



وأسفرت المناقشات عن طرح مجموعة من التوجهات وخطط العمل الأولية الرامية إلى تعزيز التعاون بين المؤسسات والمبادرات الشبابية، وتوسيع مشاركة المجتمعات المحلية في تطوير حلول مستدامة لإدارة الموارد المائية.



وتعكس مشاركة كلايمتفاي في هذا الحوار التزامها بتعزيز دور الشباب في حوكمة الموارد الطبيعية ودعم الحوار بين المجتمع المدني والمؤسسات المعنية بصنع السياسات، إلى جانب توسيع التعاون الإقليمي والدولي في مجالات الأمن المائي والدبلوماسية المائية والقدرة على التكيف المناخي.



ويمثل الحوار خطوة نحو ربط المبادرات الشبابية المحلية بالمنصات الدولية المعنية بالمياه والمناخ، وتعزيز مساهمة الشباب في صياغة مستقبل أكثر استدامة وأمنًا مائيًا في مصر والمنطقة.`,

    image: "/egyptian-water-youth-dialogue-2025.jpg",

    date: "2025-08-15",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Water Security & Climate",

    categoryAr: "الأمن المائي والمناخ"

  },

  {

    id: "beeah-future-pioneers-award-2025",

    titleEn: "Climatify Participates in the Future Pioneers Award by BEEAH Group",

    titleAr: "مشاركة كلايمتفاي في جائزة رواد المستقبل لمجموعة بيئة لتعزيز الابتكار والاستدامة في دولة الإمارات",

    excerptEn: "Climatify participated in the Future Pioneers Award by BEEAH Group under the patronage of H.E. Sheikha Bodour bint Sultan Al Qasimi in Sharjah.",

    excerptAr: "شاركت كلايمتفاي في جائزة رواد المستقبل التي تنظمها مجموعة بيئة تحت رعاية سمو الشيخة بدور بنت سلطان القاسمي بالشارقة.",

    contentEn: `Sharjah, United Arab Emirates



Climatify participated in the Future Pioneers Award, an initiative by BEEAH Group, held under the patronage of Her Excellency Sheikha Bodour bint Sultan Al Qasimi, recognizing outstanding contributions to sustainability, environmental innovation, and youth-led solutions across the United Arab Emirates.



The initiative attracted more than 2,600 entries from across the UAE, bringing together students, young innovators, entrepreneurs, and organizations developing practical solutions to environmental and sustainability challenges.



Representing Climatify, Eng. Abdullah Al-Salmany, Co-Founder, presented the organization’s work in climate action, environmental innovation, and sustainability education. His participation highlighted Climatify’s approach to integrating data-driven climate education, experiential learning, and community engagement to strengthen environmental awareness and equip young people with practical skills to address sustainability challenges.



The event provided a platform for engaging with emerging innovators, sustainability professionals, and organizations contributing to the UAE’s environmental and innovation ecosystem. It also demonstrated the growing role of younger generations in developing solutions that support national sustainability priorities.



Climatify’s participation reflects its commitment to advancing youth-led climate innovation, strengthening environmental education, and connecting emerging talent with opportunities for sustainable development.



Through its engagement with initiatives such as the Future Pioneers Award, Climatify continues to contribute to the UAE’s sustainability and innovation landscape, promoting practical approaches that connect climate knowledge, technology, and community participation to support a more resilient future.`,

    contentAr: `الشارقة | الإمارات العربية المتحدة



شاركت كلايمتفاي (Climatify) في جائزة رواد المستقبل (Future Pioneers Award)، التي تنظمها مجموعة بيئة (BEEAH Group)، تحت رعاية سمو الشيخة بدور بنت سلطان القاسمي، بهدف تكريم المبادرات والمشروعات المتميزة في مجالات الاستدامة والابتكار البيئي، وتعزيز دور الشباب والمؤسسات في تطوير حلول تسهم في تحقيق مستقبل أكثر استدامة.



استقطبت الجائزة أكثر من 2,600 مشاركة من مختلف أنحاء دولة الإمارات، شملت طلابًا ومبتكرين ورواد أعمال ومؤسسات تعمل على تطوير حلول عملية للتحديات البيئية، بما يعكس تنامي منظومة الابتكار والاستدامة في الدولة.



ومثّل كلايمتفاي في الفعالية المهندس عبدالله السلماني، الشريك المؤسس، حيث استعرض جهود المؤسسة في مجالات العمل المناخي والابتكار البيئي والتعليم من أجل الاستدامة، وسلط الضوء على نموذج كلايمتفاي في دمج التعليم المناخي القائم على البيانات والتعلم التفاعلي والمشاركة المجتمعية، بهدف بناء قدرات الشباب وتأهيلهم لتطوير حلول مبتكرة للتحديات المناخية والبيئية.



كما أتاحت المشاركة فرصة للتواصل مع المبتكرين والمؤسسات والخبراء العاملين في قطاعات الاستدامة، والاطلاع على المبادرات الشبابية التي تسهم في دعم الأولويات الوطنية لدولة الإمارات في مجالات الابتكار وحماية البيئة والتنمية المستدامة.



وتعكس مشاركة كلايمتفاي في الجائزة التزامها بتعزيز الابتكار المناخي بقيادة الشباب، وتطوير منظومة التعليم البيئي، وربط المواهب الناشئة بفرص الابتكار وريادة الأعمال المستدامة، بما يدعم إعداد جيل قادر على المساهمة في التحول نحو اقتصاد أكثر استدامة.



وتأتي هذه المشاركة ضمن جهود كلايمتفاي لتعزيز حضورها في منظومة الاستدامة والابتكار بدولة الإمارات، وتوسيع نطاق التعاون مع المؤسسات الوطنية والقطاع الخاص، ودعم الحلول التي تجمع بين المعرفة المناخية والتكنولوجيا والمشاركة المجتمعية، بما يتماشى مع التوجهات الاستراتيجية للدولة نحو التنمية المستدامة وتعزيز القدرة على مواجهة التحديات البيئية.`,

    image: "/beeah-future-pioneers-award-2025.jpg",

    date: "2025-06-15",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Environmental Innovation",

    categoryAr: "الابتكار البيئي"

  },

  {

    id: "climatify-rise-aus-2025",

    titleEn: "Climatify Participates in RISE 2025 at the American University of Sharjah",

    titleAr: "مشاركة كلايمتفاي في فعالية RISE 2025 بالجامعة الأمريكية في الشارقة",

    excerptEn: "Climatify participated in RISE 2025 at American University of Sharjah, engaging with university students and emerging innovators in climate entrepreneurship.",

    excerptAr: "شاركت كلايمتفاي في فعالية RISE 2025 التي استضافتها الجامعة الأمريكية في الشارقة للتواصل المباشر مع الطلاب ودعم الابتكار وريادة الأعمال المناخية.",

    contentEn: `2025 | Sharjah, United Arab Emirates



Climatify participated in RISE 2025, hosted by the American University of Sharjah (AUS), engaging with university students, emerging innovators, and members of the academic community to explore opportunities in sustainability, climate innovation, and youth entrepreneurship.



The event provided a platform for Climatify to showcase its work in climate education, environmental innovation, youth capacity building, and sustainable entrepreneurship, while exchanging perspectives on the role of young people in developing practical solutions to environmental and climate challenges.



Throughout the event, Climatify engaged directly with students, introducing its programs and initiatives designed to bridge academic knowledge with practical experience, strengthen green skills, and expand youth participation in climate action and sustainability-driven projects.



The participation also created opportunities to explore future collaboration with students and the wider university community, particularly in capacity-building programs, internships, experiential learning, and youth-led climate initiatives.



Climatify’s engagement at RISE 2025 aligns with its broader strategy to strengthen partnerships with higher education institutions across the UAE, connect academic learning with innovation and entrepreneurship, and expand pathways for young talent to contribute to the green economy.



Through its participation, Climatify reaffirmed its commitment to developing the next generation of climate leaders and fostering stronger connections between universities, emerging talent, and the sustainability sector, enabling young people to translate knowledge and innovative ideas into meaningful environmental and social impact.`,

    contentAr: `2025 | الشارقة، الإمارات العربية المتحدة



شاركت كلايمتفاي (Climatify) في فعالية RISE 2025، التي استضافتها الجامعة الأمريكية في الشارقة (American University of Sharjah)، بمشاركة طلاب ومبتكرين وممثلين عن مبادرات ومؤسسات مهتمة بريادة الأعمال والابتكار والتنمية المستدامة.



أتاحت الفعالية منصة للتواصل المباشر مع طلاب الجامعة والتعريف بجهود كلايمتفاي في مجالات التعليم المناخي، والابتكار البيئي، وبناء القدرات الشبابية، وريادة الأعمال المستدامة، إلى جانب تبادل الأفكار حول دور الشباب في تطوير حلول عملية للتحديات المناخية والبيئية.



وخلال الفعالية، استعرض فريق كلايمتفاي مجالات عمل المؤسسة وبرامجها الهادفة إلى ربط المعرفة الأكاديمية بالتطبيق العملي، وتعزيز المهارات المرتبطة بالاقتصاد الأخضر، وتمكين الشباب من المشاركة في المبادرات والمشروعات التي تدعم الاستدامة والعمل المناخي.



كما شكلت المشاركة فرصة لبحث مجالات التعاون المستقبلية مع الطلاب والمجتمع الجامعي، واستكشاف فرص إشراك المواهب الشابة في برامج بناء القدرات والتدريب والمبادرات المناخية التي تنفذها كلايمتفاي.



وتأتي هذه المشاركة ضمن استراتيجية كلايمتفاي الرامية إلى تعزيز التعاون مع مؤسسات التعليم العالي في دولة الإمارات، وربط التعليم بالابتكار وريادة الأعمال، وتوسيع فرص مشاركة الشباب في منظومة الاستدامة والاقتصاد الأخضر.



وتؤكد مشاركة كلايمتفاي في RISE 2025 التزامها بالاستثمار في قدرات الأجيال القادمة، وبناء جسور التعاون بين الجامعات والمؤسسات العاملة في مجالات المناخ والاستدامة، بما يسهم في إعداد قيادات شبابية قادرة على تحويل المعرفة والأفكار إلى حلول ذات أثر بيئي ومجتمعي.`,

    image: "/climatify-rise-aus-2025.jpg",

    date: "2025-05-10",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Youth & Academic Engagement",

    categoryAr: "التعليم والريادة الشبابية"

  },

  {

    id: "arab-youth-climate-newsletter-2024",

    titleEn: "Climatify Featured in the Arab Youth Council for Climate Action Network Newsletter",

    titleAr: "تسليط الضوء على جهود كلايمتفاي في النشرة الإخبارية لشبكة مجلس الشباب العربي للعمل المناخي",

    excerptEn: "Climatify was featured in the Arab Youth Council for Climate Action Network Newsletter, highlighting its 2023 contributions to youth climate action.",

    excerptAr: "سلطت شبكة مجلس الشباب العربي للعمل المناخي الضوء على جهود ومبادرات كلايمتفاي خلال عام 2023 في النشرة الإخبارية للشبكة.",

    contentEn: `January 2024 | Arab Region



Climatify was featured in the Arab Youth Council for Climate Action Network Newsletter, highlighting its contributions throughout 2023 to advancing youth engagement in climate action, environmental awareness, and community development across the Arab region.



The newsletter showcased Climatify’s initiatives and campaigns focused on youth capacity building, climate education, knowledge exchange, and amplifying young people’s voices in environmental and community-led action.



Throughout 2023, Climatify worked to strengthen youth participation in sustainability initiatives by creating opportunities for collaboration, facilitating knowledge sharing, and supporting young people in translating climate awareness into meaningful community engagement.



This regional recognition reflects Climatify’s growing presence within Arab youth climate action networks and its contribution to connecting local initiatives with broader regional efforts to advance climate awareness, youth leadership, and sustainable development.



Rooted in its youth-led approach, Climatify continues to expand its partnerships and capacity-building initiatives, strengthening opportunities for young people to participate in climate solutions, community development, and sustainability-driven innovation.



The feature represents an important milestone in Climatify’s efforts to strengthen regional collaboration, elevate youth perspectives in climate discussions, and support the next generation of climate leaders across the Arab world.



Read the newsletter feature:

https://climatify-youth.com/media/arab-youth-climate-action-newsletter-2024`,

    contentAr: `يناير 2024 | المنطقة العربية



سلطت شبكة مجلس الشباب العربي للعمل المناخي الضوء على جهود كلايمتفاي (Climatify) ومساهماتها خلال عام 2023، من خلال إدراج أنشطتها ومبادراتها ضمن النشرة الإخبارية للشبكة، تقديرًا لدورها في تعزيز مشاركة الشباب في العمل المناخي والتنمية المجتمعية.



استعرضت النشرة جهود كلايمتفاي في تمكين الشباب معرفيًا، وبناء قدراتهم، وتعزيز تبادل الخبرات، وإبراز مساهماتهم في مواجهة التحديات المناخية والبيئية، من خلال الحملات والمبادرات التي نفذتها المؤسسة خلال عام 2023.



كما أبرزت مساهمة كلايمتفاي في توفير مساحات للحوار والتعاون بين الشباب، ودعم مشاركتهم في المبادرات المجتمعية، بما يعزز دورهم في تطوير حلول محلية للتحديات البيئية والمساهمة في تحقيق أهداف التنمية المستدامة.



ويعكس هذا الظهور الإعلامي الحضور المتنامي لكلايمتفاي ضمن شبكات العمل المناخي الشبابية على المستوى العربي، ودورها في ربط المبادرات المحلية بالجهود الإقليمية الرامية إلى تعزيز الوعي المناخي والمشاركة المجتمعية.



وتواصل كلايمتفاي العمل على توسيع شراكاتها وتطوير برامجها لبناء القدرات، انطلاقًا من رؤيتها القائمة على تمكين الشباب من قيادة التغيير، وتحويل التحديات المناخية إلى فرص للابتكار والتنمية المستدامة.



للاطلاع على النشرة الإخبارية:

https://climatify-youth.com/media/arab-youth-climate-action-newsletter-2024`,

    image: "/arab-youth-climate-action-newsletter-2024.jpg",

    date: "2024-01-30",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Regional Media & Networks",

    categoryAr: "إعلام وشبكات إقليمية"

  },

  {

    id: "climatify-cop28-coy18-dubai",

    titleEn: "Climatify Participates in COP28 and COY18 to Strengthen Global Youth Climate Engagement",

    titleAr: "مشاركة كلايمتفاي في مؤتمر الأمم المتحدة للمناخ COP28 ومؤتمر الشباب COY18 لتعزيز المشاركة الشبابية في العمل المناخي الدولي",

    excerptEn: "Climatify participated in COP28 and COY18 in Dubai, engaging with international youth networks and climate organizations to advance global youth climate action.",

    excerptAr: "شاركت كلايمتفاي في مؤتمري COP28 وCOY18 بدبي لتعزيز المشاركة الشبابية في العمل المناخي الدولي وتوسيع الشراكات الاستراتيجية تحت شعار «من الشباب إلى الشباب».",

    contentEn: `December 2023 | Dubai, United Arab Emirates



Climatify participated in the 28th United Nations Climate Change Conference (COP28) and the 18th Conference of Youth (COY18), held in the United Arab Emirates, engaging with international youth networks, climate organizations, and stakeholders working to advance global climate action.



The participation marked an important milestone in Climatify’s international engagement, providing an opportunity to explore the diverse challenges facing young people across different regions as a result of climate change, particularly in relation to climate education, equitable access to opportunities, community resilience, and meaningful participation in climate decision-making.



Throughout both conferences, Climatify focused on strengthening international partnerships, exchanging knowledge and experiences, and identifying opportunities for collaboration with youth-led initiatives, civil society organizations, and institutions working across climate action and sustainable development.



The engagement also supported Climatify’s efforts to connect local and regional youth initiatives with global climate networks, fostering cooperation in climate education, capacity building, youth empowerment, and community-driven sustainability solutions.



Building on the discussions and connections established during COP28 and COY18, Climatify sought to translate international engagement into practical opportunities for joint programs, collaborative initiatives, and stronger youth participation in climate action.



Under its guiding principle, “From Youth, To Youth,” Climatify’s participation reinforced its commitment to positioning young people as active contributors to climate solutions and strengthening their role in shaping a more inclusive, resilient, and sustainable future.



This participation contributed to Climatify’s broader mission of connecting youth leadership, climate education, and international cooperation to advance sustainable development at local, regional, and global levels.`,

    contentAr: `ديسمبر 2023 | دبي، الإمارات العربية المتحدة



شاركت كلايمتفاي (Climatify) في الدورة الثامنة والعشرين لمؤتمر الأطراف في اتفاقية الأمم المتحدة الإطارية بشأن تغير المناخ (COP28)، ومؤتمر الشباب الثامن عشر المعني بتغير المناخ (COY18)، اللذين استضافتهما دولة الإمارات العربية المتحدة، في إطار جهودها لتعزيز مشاركة الشباب في العمل المناخي وتوسيع نطاق التعاون مع الشبكات والمؤسسات الدولية المعنية بالاستدامة والتنمية.



مثلت هذه المشاركة محطة مهمة في مسيرة كلايمتفاي نحو تعزيز حضورها الدولي، حيث أتاحت فرصة للتعرف على التحديات المناخية التي تواجه الشباب في مختلف أنحاء العالم، لا سيما ما يتعلق بالتعليم المناخي، والعدالة المناخية، والقدرة على التكيف، وإتاحة الفرص، وتعزيز المشاركة الفاعلة للشباب في عمليات صنع القرار المرتبطة بالمناخ.



ركزت مشاركة كلايمتفاي خلال المؤتمرين على بناء علاقات وشراكات استراتيجية مع المؤسسات الدولية والشبكات الشبابية ومنظمات المجتمع المدني العاملة في مجالات المناخ والتنمية المستدامة، إلى جانب تبادل المعرفة والخبرات واستكشاف فرص التعاون في تطوير المبادرات والبرامج المشتركة.



كما ساهمت المشاركة في تعزيز التواصل بين المبادرات الشبابية المحلية والإقليمية وشبكات العمل المناخي العالمية، وبحث سبل التعاون في مجالات التعليم المناخي، وبناء القدرات، وتمكين الشباب، والابتكار المجتمعي، وتطوير الحلول المستدامة.



وشكلت المناقشات واللقاءات التي جرت خلال المؤتمرين فرصة لاستكشاف آفاق جديدة للتعاون الدولي، وربط التحديات المناخية التي تواجه الشباب بفرص عملية لتطوير البرامج والمبادرات، وتعزيز دورهم في قيادة العمل المناخي على المستويات المحلية والإقليمية والدولية.



وانطلاقًا من شعارها «من الشباب إلى الشباب» (From Youth, To Youth)، أكدت كلايمتفاي من خلال مشاركتها أهمية الانتقال من إشراك الشباب بوصفهم مستفيدين من المبادرات المناخية إلى تمكينهم باعتبارهم شركاء فاعلين في تطوير الحلول والمساهمة في صياغة مستقبل أكثر استدامة.



وتأتي هذه المشاركة ضمن التوجه الاستراتيجي لكلايمتفاي نحو ربط القيادة الشبابية بالتعليم المناخي والتعاون الدولي، وتوسيع فرص مشاركة الشباب في الحوارات والمبادرات العالمية المعنية بالمناخ والتنمية المستدامة، بما يدعم بناء جيل قادر على المساهمة في مواجهة التحديات المناخية وتحقيق أثر تنموي مستدام.`,

    image: "/climatify-cop28-coy18-dubai.jpg",

    date: "2023-12-12",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Global Climate Summits",

    categoryAr: "قمم المناخ الدولية"

  },

  {

    id: "shaikha-alshafar-emiratesgbc-cop28",

    titleEn: "Climatify Co-Founder Shaikha Al Shafar Participates in Emirates Green Building Council Panel Discussion at COP28",

    titleAr: "مشاركة شيخة الشعفار، الشريكة المؤسسة لكلايمتفاي، في جلسة حوارية للمجلس الإماراتي للأبنية الخضراء خلال COP28",

    excerptEn: "Shaikha Al Shafar participated in an EmiratesGBC panel discussion during COP28 on youth perspectives in green building and sustainable built environments.",

    excerptAr: "شاركت شيخة الشعفار، الشريكة المؤسسة لكلايمتفاي، في جلسة حوارية نظمها المجلس الإماراتي للأبنية الخضراء خلال مؤتمر COP28 حول دور الشباب في الاستدامة العمرانية.",

    contentEn: `December 2023 | Dubai, United Arab Emirates



Shaikha Al Shafar, Co-Founder of Climatify, participated in a panel discussion organized by the Emirates Green Building Council (EmiratesGBC) during the 28th United Nations Climate Change Conference (COP28), under the theme “Emerging Voices: Youth Perspectives on Climate Challenges in Education and Profession for the Green Built Frontier.”



The panel highlighted the critical role of young people and emerging professionals in addressing climate challenges within the built environment, emphasizing the importance of climate education, professional development, and the skills required to accelerate the transition toward sustainable building practices.



Discussions focused on integrating sustainability and climate action into educational systems and professional pathways, while strengthening the contribution of younger generations to climate mitigation strategies and the development of low-carbon, resource-efficient built environments.



The session also emphasized the importance of bridging academic institutions and professional sectors, creating opportunities for young people to acquire the knowledge, practical experience, and competencies needed to contribute to the green transition and address environmental challenges facing cities and communities.



Shaikha Al Shafar’s participation reflected Climatify’s engagement in international climate dialogue and its commitment to connecting youth empowerment, climate education, and professional development with broader sustainability transitions.



The engagement further reinforced the importance of positioning young professionals as active contributors to climate solutions, particularly within industries that play a significant role in reducing emissions and advancing sustainable development.



Through its representation at COP28, Climatify continued to advance its mission of strengthening youth leadership, expanding access to climate education and green skills, and supporting meaningful youth participation in sustainability-related policies and solutions, contributing to the development of a new generation of professionals equipped to support a low-carbon and climate-resilient future.`,

    contentAr: `ديسمبر 2023 | دبي، الإمارات العربية المتحدة



شاركت شيخة الشعفار، الشريكة المؤسسة لكلايمتفاي (Climatify)، في جلسة حوارية نظمها المجلس الإماراتي للأبنية الخضراء (Emirates Green Building Council)، ضمن فعاليات مؤتمر الأطراف الثامن والعشرين لاتفاقية الأمم المتحدة الإطارية بشأن تغير المناخ (COP28)، تحت عنوان:



«الأصوات الصاعدة: رؤى الشباب حول التحديات المناخية في التعليم والحياة المهنية نحو مستقبل أكثر استدامة لقطاع البناء».



سلطت الجلسة الضوء على الدور المحوري للشباب والمهنيين الناشئين في مواجهة التحديات المناخية المرتبطة بالبيئة العمرانية وقطاع البناء، مع التركيز على أهمية التعليم المناخي، والتأهيل المهني، وتطوير المهارات اللازمة لدعم التحول نحو ممارسات بناء أكثر استدامة.



وتناولت المناقشات أهمية دمج مفاهيم الاستدامة والعمل المناخي في المنظومات التعليمية والمسارات المهنية، وتعزيز مساهمة الأجيال الشابة في تطوير وتنفيذ استراتيجيات التخفيف من آثار تغير المناخ، بما يدعم التحول نحو بيئة عمرانية منخفضة الانبعاثات وأكثر كفاءة في استخدام الموارد.



كما أبرزت الجلسة أهمية تعزيز التكامل بين المؤسسات التعليمية والقطاعات المهنية، وتوفير مسارات عملية تتيح للشباب اكتساب المعرفة والخبرات اللازمة للمشاركة في التحول الأخضر، والمساهمة في تطوير حلول مبتكرة للتحديات البيئية التي تواجه المدن والمجتمعات.



وتعكس مشاركة شيخة الشعفار في هذه الجلسة حضور كلايمتفاي في الحوارات المناخية الدولية المعنية بتمكين الشباب وربط التعليم بالتحولات الاقتصادية والبيئية، إلى جانب اهتمام المؤسسة بتعزيز دور الأجيال الشابة في القطاعات المؤثرة في تحقيق أهداف الاستدامة.



وتأتي هذه المشاركة ضمن جهود كلايمتفاي الرامية إلى تعزيز القيادة الشبابية، وتطوير التعليم المناخي وبناء القدرات المهنية، ودعم مشاركة الشباب في صياغة الحلول والسياسات المرتبطة بالاستدامة، بما يسهم في إعداد جيل من القيادات والمهنيين القادرين على دعم التحول نحو اقتصاد منخفض الكربون ومجتمعات أكثر قدرة على مواجهة تحديات تغير المناخ.`,

    image: "/shaikha-alshafar-emiratesgbc-cop28.png",

    date: "2023-12-08",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Green Building & Sustainability",

    categoryAr: "الأبنية الخضراء والاستدامة"

  },

  {

    id: "marwa-shalwani-uae-youth-challenge",

    titleEn: "Climatify’s Dr. Marwa Shalwani Serves as Jury Member for the UAE Youth Challenge in Collaboration with the Arab Youth Center and Schneider Electric",

    titleAr: "مشاركة الدكتورة مروة الشلواني، الشريكة المؤسسة لكلايمتفاي، في لجنة تحكيم تحدي شباب الإمارات بالتعاون مع مركز الشباب العربي وشنايدر إلكتريك",

    excerptEn: "Dr. Marwa Shalwani served as a jury member in the UAE Youth Challenge with the Arab Youth Center and Schneider Electric, supporting youth-led climate solutions.",

    excerptAr: "شاركت د. مروة الشلواني عضواً في لجنة تحكيم تحدي شباب الإمارات بالتعاون مع مركز الشباب العربي وشنايدر إلكتريك لدعم ابتكارات الشباب المناخية.",

    contentEn: `2023 | United Arab Emirates



Dr. Marwa Shalwani, Co-Founder of Climatify, participated as a jury member in the UAE Youth Challenge, an initiative organized in collaboration with the Arab Youth Center and Schneider Electric, aligned with the sustainability and climate action priorities of the 28th United Nations Climate Change Conference (COP28).



The initiative aimed to empower young innovators to develop practical solutions addressing pressing climate and environmental challenges, providing a platform for youth creativity, entrepreneurship, and sustainability-driven innovation.



As a member of the judging panel, Dr. Shalwani contributed her expertise to the evaluation of youth-led ideas and proposed solutions, supporting the recognition of innovative approaches to climate action and sustainable development.



The challenge highlighted the importance of connecting youth innovation with industry expertise and institutional support, encouraging young people to translate environmental challenges into opportunities for technological innovation, sustainable entrepreneurship, and positive community impact.



Dr. Shalwani’s involvement reflected Climatify’s commitment to advancing youth empowerment, strengthening climate innovation ecosystems, and supporting emerging talent in developing solutions to environmental challenges.



The initiative also demonstrated the value of collaboration between youth-focused institutions, the private sector, and climate professionals in fostering an enabling environment for the next generation of sustainability leaders.



Through its representation in the UAE Youth Challenge, Climatify reinforced its role in supporting youth-led climate innovation, promoting knowledge exchange, and contributing to initiatives that connect emerging innovators with opportunities to advance sustainable development in the UAE and beyond.`,

    contentAr: `2023 | الإمارات العربية المتحدة



شاركت الدكتورة مروة الشلواني، الشريكة المؤسسة لكلايمتفاي (Climatify)، عضوًا في لجنة تحكيم تحدي شباب الإمارات (UAE Youth Challenge)، الذي نُفذ بالتعاون مع مركز الشباب العربي (Arab Youth Center) وشركة شنايدر إلكتريك (Schneider Electric)، في إطار المبادرات المتوافقة مع أولويات مؤتمر الأطراف الثامن والعشرين لاتفاقية الأمم المتحدة الإطارية بشأن تغير المناخ (COP28).



استهدف التحدي تمكين الشباب المبتكرين من تطوير حلول عملية للتحديات المناخية والبيئية، وإتاحة منصة لعرض الأفكار والمشروعات الشبابية التي توظف الابتكار وريادة الأعمال والتكنولوجيا في دعم التحول نحو مستقبل أكثر استدامة.



وساهمت الدكتورة مروة الشلواني، من خلال عضويتها في لجنة التحكيم، بخبراتها في تقييم الأفكار والحلول التي قدمها المشاركون الشباب، ودعم إبراز المشروعات المبتكرة القادرة على المساهمة في مواجهة التحديات المناخية وتحقيق أهداف التنمية المستدامة.



وسلطت المبادرة الضوء على أهمية الربط بين الابتكار الشبابي والخبرات المتخصصة والدعم المؤسسي، بما يعزز قدرة الشباب على تحويل التحديات البيئية إلى فرص لتطوير حلول تكنولوجية ومشروعات ريادية مستدامة ذات أثر مجتمعي.



وتعكس مشاركة الدكتورة مروة الشلواني التزام كلايمتفاي بدعم منظومة الابتكار المناخي، وتمكين المواهب الشابة، وتعزيز دور الشباب في تطوير حلول عملية للقضايا البيئية والتنموية.



كما أبرز التحدي أهمية التعاون بين المؤسسات المعنية بالشباب والقطاع الخاص والخبراء المتخصصين في الاستدامة، من أجل توفير بيئة داعمة للابتكار، وتوسيع فرص مشاركة الأجيال الجديدة في القطاعات المرتبطة بالاقتصاد الأخضر.



وتأتي هذه المشاركة ضمن جهود كلايمتفاي الرامية إلى دعم الابتكار المناخي بقيادة الشباب، وتعزيز تبادل المعرفة والخبرات، وربط المبتكرين الشباب بالفرص والشراكات المؤسسية، بما يسهم في تطوير جيل من رواد الأعمال والقيادات القادرة على المساهمة في تحقيق التنمية المستدامة في دولة الإمارات وعلى المستويين الإقليمي والدولي.`,

    image: "/marwa-shalwani-uae-youth-challenge-schneider.jpg",

    date: "2023-11-20",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Innovation Challenges",

    categoryAr: "تحديات الابتكار"

  },

  {

    id: "climatify-uaeu-sustainable-universe-mai-moawad",

    titleEn: "Climatify CEO Highlights Youth Leadership, Climate Policy, and Green Entrepreneurship at UAEU’s Sustainable Universe Event",

    titleAr: "الرئيس التنفيذي لكلايمتفاي تسلط الضوء على القيادة الشبابية والسياسات المناخية وريادة الأعمال الخضراء خلال فعالية Sustainable Universe بجامعة الإمارات العربية المتحدة",

    excerptEn: "Climatify CEO Mai Moawad delivered a keynote on youth and women leadership in climate innovation, policy, and green entrepreneurship at UAEU’s Sustainable Universe Event.",

    excerptAr: "قدمت مي معوض الرئيس التنفيذي لكلايمتفاي جلسة حول دور الشباب والنساء في الابتكار المناخي وصنع السياسات وريادة الأعمال الخضراء بجامعة الإمارات العربية المتحدة.",

    contentEn: `United Arab Emirates | Sustainable Universe – United Arab Emirates University (UAEU)



Climatify participated in the Sustainable Universe Event, hosted by the College of Science at United Arab Emirates University (UAEU), with its Co-Founder and Chief Executive Officer, Mai Moawad, contributing as a speaker to discussions on climate action, sustainability, youth leadership, and the transition toward a green economy.



During her presentation, titled “The Role of Youth: From Innovation to Creating Opportunities in Climate Action and Sustainability,” Moawad examined the evolving role of young people and women in addressing climate challenges, emphasizing the importance of moving beyond awareness toward meaningful participation in innovation, policymaking, and sustainable economic development.



Youth and Women as Key Partners in Climate Action



A central focus of the presentation was the disproportionate impact of climate change on young people and women, particularly where inequalities in access to resources, education, finance, and economic opportunities increase vulnerability to environmental challenges.



Moawad emphasized that youth and women should be recognized not only as groups affected by climate change but also as essential partners in designing, implementing, and advancing climate solutions.



The discussion highlighted the importance of expanding access to climate education, leadership opportunities, technical skills, and entrepreneurship support to strengthen their participation in sustainable development.



Connecting Youth Climate Platforms with Global Policymaking



The presentation examined the strategic importance of Local Conferences of Youth (LCOY), Regional Conferences of Youth (RCOY), Conferences of Youth (COY), and the United Nations Climate Change Conferences (COP) in strengthening youth engagement within international climate governance.



Moawad discussed how these platforms create opportunities for young people and civil society organizations to exchange knowledge, develop shared priorities, strengthen regional cooperation, and contribute perspectives to international climate discussions under the United Nations Framework Convention on Climate Change (UNFCCC).



Particular attention was given to the importance of strengthening connections between local youth initiatives, regional networks, and international policymaking processes to ensure that youth perspectives are represented in climate dialogue and decision-making.



Bridging Academic Research, Public Policy, and Green Entrepreneurship



Another key theme was the need to connect academic research with public policy implementation and green entrepreneurship, ensuring that scientific knowledge and innovation translate into practical solutions and measurable development outcomes.



Moawad emphasized the role of universities and research institutions in preparing young professionals to address complex sustainability challenges through interdisciplinary learning, applied research, and collaboration with government, industry, and civil society.



The presentation also explored how entrepreneurship and green skills development can create economic opportunities while supporting climate adaptation, resource efficiency, and sustainable innovation.



Highlighting the UAE’s Approach to Sustainability and Youth Empowerment



The session highlighted the UAE’s approach to advancing youth and women’s empowerment, sustainability education, and climate innovation, recognizing the role of national institutions and educational initiatives in strengthening participation in climate action.



Moawad discussed the importance of connecting national sustainability priorities with educational programs, youth-led initiatives, and regional cooperation to build a generation equipped to contribute to the green economy.



Climatify’s Local and Regional Contribution



The presentation also showcased Climatify’s work in climate education, capacity building, and community engagement, highlighting its efforts to empower youth and women through practical learning experiences, innovation-focused programs, and opportunities for participation in climate and sustainability initiatives.



Through its engagement with universities, educational institutions, community organizations, and international networks, Climatify works to connect climate knowledge, leadership development, entrepreneurship, and policy engagement, supporting young people in translating ideas into practical contributions to sustainable development.



Recognition and Institutional Engagement



In recognition of her contribution to the event, Mai Moawad was acknowledged among the participating speakers for her engagement in discussions on climate action and sustainability.



Climatify’s participation in the Sustainable Universe Event reflects its commitment to strengthening collaboration with academic institutions and expanding opportunities for youth and women to engage in climate innovation, sustainability education, and policy dialogue.



The engagement further reinforces Climatify’s role in connecting academic knowledge, youth leadership, and practical climate action, contributing to more inclusive and sustainable development across the UAE and the wider Arab region.`,

    contentAr: `الإمارات العربية المتحدة | فعالية Sustainable Universe – جامعة الإمارات العربية المتحدة



شاركت كلايمتفاي (Climatify) في فعالية Sustainable Universe، التي استضافتها كلية العلوم بجامعة الإمارات العربية المتحدة (UAEU)، من خلال مشاركة مي معوض، الشريكة المؤسسة والرئيس التنفيذي لكلايمتفاي، متحدثةً في المناقشات المتعلقة بالعمل المناخي والاستدامة والقيادة الشبابية والتحول نحو الاقتصاد الأخضر.



وقدمت مي معوض جلسة بعنوان «دور الشباب: من الابتكار إلى خلق الفرص في العمل المناخي والاستدامة»، تناولت خلالها الدور المتنامي للشباب والنساء في مواجهة التحديات المناخية، وأهمية الانتقال من التوعية البيئية إلى المشاركة الفاعلة في الابتكار وصنع السياسات والتنمية الاقتصادية المستدامة.



الشباب والنساء شركاء أساسيون في العمل المناخي



ركزت الجلسة على التأثيرات غير المتكافئة للتغير المناخي على الشباب والنساء، لا سيما في المجتمعات التي تعاني من تفاوت في الوصول إلى الموارد والتعليم والتمويل والفرص الاقتصادية، مما يزيد من تعرض هذه الفئات للمخاطر البيئية والمناخية.



وأكدت مي معوض أهمية التعامل مع الشباب والنساء ليس فقط باعتبارهم من الفئات المتأثرة بالتغير المناخي، وإنما بوصفهم شركاء رئيسيين في تصميم الحلول المناخية وتنفيذها وتطويرها.



كما تناولت أهمية توسيع فرص الوصول إلى التعليم المناخي، وبرامج إعداد القيادات، والمهارات التقنية، ودعم ريادة الأعمال، بما يعزز مشاركة الشباب والنساء في تحقيق التنمية المستدامة.



ربط المنصات الشبابية بصنع السياسات المناخية الدولية



سلطت الجلسة الضوء على الأهمية الاستراتيجية للمنصات والمؤتمرات الشبابية المناخية، بما يشمل المؤتمرات المحلية للشباب (LCOY)، والمؤتمرات الإقليمية للشباب (RCOY)، ومؤتمرات الشباب (COY)، ومؤتمرات الأطراف (COP)، ودورها في تعزيز مشاركة الشباب في منظومة الحوكمة المناخية الدولية.



وناقشت مي معوض كيف تتيح هذه المنصات للشباب ومنظمات المجتمع المدني فرصًا لتبادل المعرفة، وتطوير الأولويات المشتركة، وتعزيز التعاون الإقليمي، وإيصال وجهات نظرهم إلى الحوارات المناخية الدولية المرتبطة باتفاقية الأمم المتحدة الإطارية بشأن تغير المناخ (UNFCCC).



كما أكدت أهمية تعزيز الترابط بين المبادرات الشبابية المحلية والشبكات الإقليمية وعمليات صنع السياسات الدولية، بما يسهم في توسيع مشاركة الشباب في الحوارات والمفاوضات المناخية، وتعزيز حضور أولوياتهم في عمليات اتخاذ القرار.



الربط بين البحث الأكاديمي والسياسات العامة وريادة الأعمال الخضراء



تناولت الجلسة أهمية تحويل مخرجات البحث العلمي والمعرفة الأكاديمية إلى سياسات قابلة للتنفيذ ومشروعات ريادية خضراء، بما يضمن ترجمة الابتكار والمعرفة إلى حلول عملية ذات أثر تنموي قابل للقياس.



وأكدت مي معوض الدور المحوري للجامعات والمؤسسات البحثية في إعداد كوادر شابة قادرة على التعامل مع تحديات الاستدامة المعقدة، من خلال التعليم متعدد التخصصات، والبحث التطبيقي، وتعزيز التعاون بين المؤسسات الأكاديمية والجهات الحكومية والقطاع الخاص والمجتمع المدني.



كما ناقشت أهمية ريادة الأعمال وتنمية المهارات الخضراء في خلق فرص اقتصادية جديدة، ودعم التكيف المناخي، وتعزيز كفاءة استخدام الموارد، وتطوير الابتكارات المستدامة.



إبراز تجربة دولة الإمارات في الاستدامة وتمكين الشباب



استعرضت الجلسة جهود دولة الإمارات في تمكين الشباب والنساء وتعزيز التعليم من أجل الاستدامة والابتكار المناخي، مع التأكيد على دور المؤسسات الوطنية والتعليمية في توسيع نطاق المشاركة المجتمعية في العمل المناخي.



وأشارت مي معوض إلى أهمية الربط بين الأولويات الوطنية للاستدامة والبرامج التعليمية والمبادرات الشبابية والتعاون الإقليمي، بما يسهم في إعداد جيل يمتلك المعارف والمهارات اللازمة للمشاركة في التحول نحو الاقتصاد الأخضر.



مساهمات كلايمتفاي على المستويين المحلي والإقليمي



تضمنت المشاركة استعراض جهود كلايمتفاي في التعليم المناخي وبناء القدرات والمشاركة المجتمعية، مع تسليط الضوء على برامجها ومبادراتها الرامية إلى تمكين الشباب والنساء من خلال التعلم التطبيقي والابتكار وتوسيع فرص المشاركة في العمل المناخي والاستدامة.



ومن خلال تعاونها مع الجامعات والمؤسسات التعليمية والمنظمات المجتمعية والشبكات الدولية، تعمل كلايمتفاي على الربط بين المعرفة المناخية وتنمية المهارات القيادية وريادة الأعمال والمشاركة في السياسات العامة، بما يدعم قدرة الشباب على تحويل أفكارهم إلى مساهمات عملية في التنمية المستدامة.



تكريم المشاركة وتعزيز التعاون المؤسسي



شهدت الفعالية تكريم مي معوض ضمن المتحدثين المشاركين، تقديرًا لمساهمتها في المناقشات المتعلقة بالعمل المناخي والاستدامة.



وتعكس مشاركة كلايمتفاي في فعالية Sustainable Universe التزامها بتعزيز التعاون مع المؤسسات الأكاديمية، وتوسيع الفرص المتاحة للشباب والنساء للمشاركة في الابتكار المناخي والتعليم من أجل الاستدامة والحوارات المرتبطة بالسياسات العامة.



كما تؤكد هذه المشاركة دور كلايمتفاي في الربط بين المعرفة الأكاديمية والقيادة الشبابية والتطبيقات العملية للعمل المناخي، ودعم جهود التنمية المستدامة والشاملة في دولة الإمارات والمنطقة العربية.`,

    image: "/climatify-uaeu-sustainable-universe-mai-moawad.jpg",

    date: "2025-02-15",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Academic Engagement & Youth Leadership",

    categoryAr: "الشراكات الأكاديمية والقيادة الشبابية"

  },

  {

    id: "climatify-cop29-baku-agricultural-innovation-panel",

    titleEn: "Climatify Hosts COP29 Panel on UAE Youth Leadership, Agricultural Innovation, and Climate-Affected Communities",

    titleAr: "كلايمتفاي تنظم جلسة حوارية في COP29 حول دور شباب الإمارات في الابتكار الزراعي ودعم المجتمعات المتأثرة بالتغير المناخي",

    excerptEn: "At COP29 in Baku, Climatify organized an international panel on agricultural innovation, youth leadership, and supporting climate-affected communities.",

    excerptAr: "نظمت كلايمتفاي في قمة COP29 بباكو جلسة حوارية دولية حول الابتكار الزراعي، وتمكين الشباب، ودعم المجتمعات الأكثر تأثراً بالتغير المناخي.",

    contentEn: `19 November 2024 | COP29, Baku, Azerbaijan



Climatify, in coordination with the Ministry of Youth and Sports of the Republic of Azerbaijan, organized a panel discussion during the ninth day of the 29th United Nations Climate Change Conference (COP29), titled “Youth of the UAE Tackling Climate Change Challenges: Agricultural Innovation and Support for Climate-Affected Communities.”



The session brought together experts and stakeholders to examine the intersection of climate change, agricultural innovation, food security, and youth empowerment, with a particular focus on the UAE’s contributions to advancing sustainable agricultural practices and strengthening the resilience of communities affected by climate change.



Advancing Agricultural Innovation and Climate Resilience



The discussion explored the role of agricultural innovation in addressing climate-related pressures on food production, particularly in regions facing water scarcity, extreme temperatures, and increasing environmental vulnerabilities.



Panelists examined the importance of climate-resilient agricultural technologies, sustainable resource management, and innovation-driven approaches to food security, emphasizing the need to make practical solutions more accessible to communities and emerging agricultural entrepreneurs.



The session also addressed barriers to implementing sustainable agricultural solutions, including limited access to climate-adaptive technologies, financing gaps, and the need for stronger institutional support.



These challenges highlighted the importance of collaboration among governments, research institutions, private-sector organizations, and youth-led initiatives to accelerate the adoption of sustainable agricultural practices.



Strengthening Youth and Women’s Participation in Sustainable Agriculture



A central theme of the panel was the importance of empowering young people and women as active contributors to agricultural innovation and climate adaptation.



Discussions highlighted approaches to expanding access to technical knowledge, capacity-building opportunities, entrepreneurship support, and participation in agricultural decision-making.



The session emphasized that strengthening youth and women’s engagement in agriculture is essential not only for advancing innovation but also for supporting inclusive economic opportunities and improving the resilience of climate-vulnerable communities.



Highlighting the UAE’s Role in Climate and Agricultural Innovation



The panel provided an opportunity to discuss the UAE’s efforts in agricultural innovation, sustainable food systems, and climate action, while exploring how youth-led initiatives can contribute to national and regional sustainability priorities.



Through this discussion, Climatify highlighted the importance of connecting climate education, agricultural technologies, youth leadership, and policy engagement to support practical responses to food security and climate adaptation challenges.



The session reflected Climatify’s broader commitment to strengthening youth participation in climate-related sectors and promoting interdisciplinary approaches that bring together innovation, sustainability, and community development.



International Collaboration at COP29



The discussion was moderated by Maryam Alfakhrey, who facilitated exchanges among panelists on agricultural innovation, youth engagement, and support for communities affected by climate change.



Climatify also acknowledged the contributions of Impact (تأثير) and PACJA Saudi Arabia (@pacja.sa) for their support in facilitating the session.



Organizing this discussion at COP29 provided Climatify with an international platform to connect the perspectives of UAE youth with broader conversations on climate adaptation, food security, sustainable agriculture, and inclusive climate action.



The session reinforced the importance of creating opportunities for young people to participate in international climate dialogue, exchange expertise, and contribute to solutions that address the needs of communities facing increasing climate-related risks.



Through its participation and coordination of this panel, Climatify continued to advance its mission of connecting youth empowerment, agricultural innovation, climate education, and international cooperation, strengthening the role of emerging generations in shaping more resilient and sustainable food systems.`,

    contentAr: `19 نوفمبر 2024 | مؤتمر COP29 – باكو، أذربيجان



نظمت كلايمتفاي (Climatify)، بالتنسيق مع وزارة الشباب والرياضة بجمهورية أذربيجان، جلسة حوارية ضمن فعاليات اليوم التاسع من مؤتمر الأطراف التاسع والعشرين لاتفاقية الأمم المتحدة الإطارية بشأن تغير المناخ (COP29)، بعنوان «شباب الإمارات في مواجهة تحديات التغير المناخي: الابتكار الزراعي ودعم المجتمعات المتأثرة بالتغير المناخي».



جمعت الجلسة نخبة من الخبراء والمتخصصين لمناقشة العلاقة بين التغير المناخي والابتكار الزراعي والأمن الغذائي وتمكين الشباب، مع التركيز على دور دولة الإمارات في تطوير الممارسات الزراعية المستدامة وتعزيز قدرة المجتمعات المتأثرة بالتغير المناخي على التكيف مع التحديات البيئية.



تعزيز الابتكار الزراعي والقدرة على التكيف المناخي



تناولت الجلسة دور الابتكار الزراعي في مواجهة الضغوط المناخية المتزايدة على إنتاج الغذاء، خاصة في المناطق التي تواجه تحديات مرتبطة بندرة المياه وارتفاع درجات الحرارة والتغيرات البيئية.



وناقش المتحدثون أهمية التقنيات الزراعية القادرة على التكيف مع التغير المناخي، والإدارة المستدامة للموارد الطبيعية، والحلول المبتكرة لتعزيز الأمن الغذائي، مع التأكيد على ضرورة توسيع فرص وصول المجتمعات ورواد الأعمال الشباب إلى هذه التقنيات.



كما سلطت المناقشات الضوء على أبرز التحديات التي تواجه تطبيق الحلول الزراعية المستدامة، وفي مقدمتها محدودية الوصول إلى التكنولوجيا الملائمة للمناخ، والفجوات التمويلية، والحاجة إلى تعزيز الدعم المؤسسي للمبادرات الزراعية المبتكرة.



وأكدت الجلسة أهمية بناء شراكات بين الحكومات والمؤسسات البحثية والقطاع الخاص والمبادرات الشبابية، بما يسهم في تسريع تبني الممارسات الزراعية المستدامة وتعزيز القدرة على مواجهة المخاطر المناخية.



تمكين الشباب والنساء في قطاع الزراعة المستدامة



شكّل تعزيز مشاركة الشباب والنساء في الابتكار الزراعي والتكيف مع التغير المناخي أحد المحاور الرئيسية للجلسة.



وتناولت المناقشات أهمية توسيع فرص الوصول إلى المعرفة التقنية وبرامج بناء القدرات ودعم ريادة الأعمال، إلى جانب تعزيز مشاركة الشباب والنساء في عمليات اتخاذ القرار المرتبطة بالزراعة والاستدامة.



كما أكدت الجلسة أن الاستثمار في قدرات الشباب والنساء داخل القطاع الزراعي لا يقتصر على دعم الابتكار، بل يمتد إلى خلق فرص اقتصادية أكثر شمولًا وتعزيز صمود المجتمعات الأكثر تأثرًا بالتغيرات المناخية.



إبراز دور دولة الإمارات في الابتكار الزراعي والعمل المناخي



أتاحت الجلسة فرصة لتسليط الضوء على جهود دولة الإمارات في تطوير الابتكار الزراعي وتعزيز استدامة النظم الغذائية ودعم العمل المناخي، إلى جانب مناقشة دور المبادرات الشبابية في المساهمة في تحقيق الأولويات الوطنية والإقليمية المرتبطة بالأمن الغذائي والاستدامة.



ومن خلال هذه المشاركة، أبرزت كلايمتفاي أهمية الربط بين التعليم المناخي والتكنولوجيا الزراعية والقيادة الشبابية والمشاركة في السياسات العامة، بما يدعم تطوير حلول عملية للتحديات المرتبطة بالأمن الغذائي والتكيف المناخي.



وعكست الجلسة توجه كلايمتفاي نحو تعزيز مشاركة الشباب في القطاعات المرتبطة بالمناخ، وتبني منهجيات متعددة التخصصات تجمع بين الابتكار والاستدامة والتنمية المجتمعية.



تعزيز التعاون الدولي خلال COP29



أدارت الجلسة الحوارية مريم الفخري (Maryam Alfakhrey)، التي ساهمت في تيسير النقاشات وتبادل وجهات النظر بين المتحدثين حول الابتكار الزراعي وتمكين الشباب ودعم المجتمعات المتأثرة بالتغير المناخي.



كما أعربت كلايمتفاي عن تقديرها لدعم كل من مبادرة تأثير (Impact) وPACJA Saudi Arabia، ومساهمتهما في إنجاح الجلسة.



ومثّل تنظيم هذه الجلسة خلال COP29 فرصة لتعزيز حضور وجهات نظر الشباب الإماراتي في النقاشات الدولية المتعلقة بالتكيف المناخي والأمن الغذائي والزراعة المستدامة والعمل المناخي الشامل.



وأكدت الجلسة أهمية إتاحة مساحات فاعلة للشباب للمشاركة في الحوارات المناخية الدولية، وتبادل الخبرات، والمساهمة في تطوير حلول تستجيب لاحتياجات المجتمعات التي تواجه مخاطر مناخية متزايدة.



ومن خلال تنظيم هذه الجلسة، واصلت كلايمتفاي تعزيز دورها في الربط بين تمكين الشباب والابتكار الزراعي والتعليم المناخي والتعاون الدولي، ودعم مشاركة الأجيال الشابة في تطوير نظم غذائية أكثر استدامة وقدرة على الصمود في مواجهة التغير المناخي.`,

    image: "/climatify-cop29-baku-agricultural-innovation-panel.jpg",

    date: "2024-11-19",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "COP29 & Climate Action",

    categoryAr: "مؤتمر COP29 والعمل المناخي"

  },

  {

    id: "climatify-azerbaijan-leadership-diplomacy-conference-2024",

    titleEn: "Climatify Represents the UAE at the International Leadership and Diplomacy Conference in Azerbaijan",

    titleAr: "كلايمتفاي تمثل دولة الإمارات في المؤتمر الدولي للقيادة والدبلوماسية بأذربيجان",

    excerptEn: "Dr. Marwa Shalwani represented the UAE and Climatify at the International Leadership and Diplomacy Conference in Shusha, Azerbaijan, ahead of COP29.",

    excerptAr: "مثّلت د. مروة الشلواني دولة الإمارات وكلايمتفاي في المؤتمر الدولي للقيادة والدبلوماسية في شوشا بأذربيجان، متحدثة عن دور القيادة الشبابية في الدبلوماسية الدولية قبل COP29.",

    contentEn: `5 June 2024 | Shusha, Azerbaijan



Climatify participated in the International Leadership and Diplomacy Conference, organized by the Islamic Cooperation Youth Forum (ICYF) in collaboration with the Ministry of Youth and Sports of the Republic of Azerbaijan, as part of the “Shusha – OIC Youth Capital 2024” program.



Dr. Marwa Shalwani, Co-Founder and Chief Partnership Officer of Climatify, represented the United Arab Emirates and Climatify as a delegate and panelist, contributing to international discussions on youth leadership, diplomacy, innovation, and sustainable development.



The conference brought together government representatives, emerging leaders, and youth delegates from member countries of the Organisation of Islamic Cooperation (OIC), providing a platform to strengthen international dialogue, promote cross-cultural cooperation, and explore the role of young people in addressing shared development challenges.



Advancing Youth Leadership in International Diplomacy



Dr. Shalwani contributed to the panel discussion “Role of Leadership in Diplomacy from a Youth Perspective,” highlighting the growing influence of young leaders in international relations, cross-border cooperation, and global decision-making.



Her participation emphasized the importance of creating meaningful opportunities for young people to engage in diplomatic dialogue, contribute to policy discussions, and participate in shaping responses to regional and international challenges.



The conference also addressed the role of youth in sustainable development and innovation, exploring how entrepreneurship, technological advancement, and international partnerships can strengthen youth contributions to economic and societal progress.



Showcasing the UAE’s Commitment to Youth Empowerment



As part of the UAE delegation, Dr. Shalwani highlighted the country’s efforts to advance youth empowerment, entrepreneurship, innovation, and sustainable development, reflecting the importance of investing in young talent and strengthening their participation in national and international development priorities.



Her engagement also reflected Climatify’s institutional commitment to connecting climate action, youth leadership, policy engagement, and international cooperation, positioning young people as active contributors to sustainable development.



Strengthening International Networks and Cooperation



The conference provided opportunities to engage with emerging leaders, policymakers, and youth representatives from diverse cultural and professional backgrounds.



Discussions highlighted three interconnected priorities: strengthening international collaboration and knowledge exchange, expanding opportunities for youth leadership and participation, and recognizing cultural diversity as an important driver of innovation and cooperation.



For Climatify, participation in the conference represented an opportunity to expand its international engagement, exchange perspectives on youth-centered development approaches, and explore potential collaboration with organizations and youth networks across OIC member countries.



Building Momentum Toward COP29



The conference also contributed to Climatify’s broader international engagement ahead of COP29 in Azerbaijan, reinforcing its commitment to supporting youth participation in global climate discussions and creating opportunities for emerging leaders to contribute their perspectives and initiatives.



Through Dr. Shalwani’s participation, Climatify strengthened its representation in international youth leadership and diplomacy platforms, reaffirming its commitment to advancing youth empowerment, international partnerships, climate action, and sustainable development across local, regional, and global levels.



Climatify extends its appreciation to the Islamic Cooperation Youth Forum and the Ministry of Youth and Sports of Azerbaijan for convening the conference and facilitating dialogue among the next generation of international leaders.`,

    contentAr: `5 يونيو 2024 | شوشا، أذربيجان



شاركت كلايمتفاي (Climatify) في المؤتمر الدولي للقيادة والدبلوماسية، الذي نظمه منتدى شباب التعاون الإسلامي (ICYF) بالتعاون مع وزارة الشباب والرياضة بجمهورية أذربيجان، ضمن فعاليات برنامج «شوشا – عاصمة شباب منظمة التعاون الإسلامي 2024».



ومثّلت الدكتورة مروة الشلواني، الشريكة المؤسسة والرئيس التنفيذي للشراكات في كلايمتفاي، دولة الإمارات العربية المتحدة وكلايمتفاي ضمن الوفد الإماراتي، حيث شاركت بصفتها متحدثة في الجلسات الحوارية التي تناولت القيادة الشبابية والدبلوماسية والابتكار والتنمية المستدامة.



جمع المؤتمر مسؤولين حكوميين وقيادات شبابية وممثلين عن الدول الأعضاء في منظمة التعاون الإسلامي، بهدف تعزيز الحوار الدولي، وتوسيع مجالات التعاون بين الشباب، ومناقشة دور الأجيال الشابة في مواجهة التحديات التنموية والمشاركة في صياغة مستقبل العلاقات الدولية.



تعزيز دور الشباب في القيادة والدبلوماسية الدولية



ساهمت الدكتورة مروة الشلواني في الجلسة الحوارية بعنوان «دور القيادة في الدبلوماسية من منظور الشباب» (Role of Leadership in Diplomacy from a Youth Perspective)، حيث تناولت أهمية تعزيز حضور القيادات الشابة في العلاقات الدولية، ودور الشباب في بناء جسور التعاون بين الدول والمجتمعات.



وركزت المشاركة على أهمية إتاحة الفرص أمام الشباب للمساهمة في الحوارات الدبلوماسية وصنع السياسات وتعزيز التعاون الدولي، باعتبارهم شركاء فاعلين في التعامل مع القضايا الإقليمية والعالمية.



كما تناولت مناقشات المؤتمر دعم دور الشباب في التنمية المستدامة والابتكار، وأهمية ريادة الأعمال والتكنولوجيا والشراكات الدولية في تمكين الأجيال الجديدة من المساهمة في تحقيق التقدم الاقتصادي والاجتماعي والبيئي.



إبراز تجربة دولة الإمارات في تمكين الشباب والابتكار



في إطار مشاركتها ضمن الوفد الإماراتي، سلطت الدكتورة مروة الشلواني الضوء على جهود دولة الإمارات في تمكين الشباب، وتعزيز ريادة الأعمال، ودعم الابتكار والتنمية المستدامة، بما يعكس أهمية الاستثمار في الكفاءات الشابة وإشراكها في تحقيق الأولويات الوطنية والدولية.



كما عكست مشاركتها توجه كلايمتفاي نحو الربط بين العمل المناخي والقيادة الشبابية والمشاركة في السياسات العامة والتعاون الدولي، وتعزيز دور الشباب بوصفهم شركاء في تطوير الحلول والمبادرات المرتبطة بالتنمية المستدامة.



توسيع الشراكات الدولية وتبادل الخبرات



أتاح المؤتمر فرصًا للتواصل مع القيادات الشبابية وصناع القرار وممثلي المؤسسات والمنظمات من خلفيات ثقافية ومهنية متعددة، وتبادل الخبرات حول آليات تعزيز المشاركة الشبابية في التنمية والدبلوماسية.



وأكدت المناقشات أهمية التعاون الدولي وتبادل المعرفة، وتطوير قدرات الشباب القيادية، والاستفادة من التنوع الثقافي في دعم الابتكار وبناء الشراكات العابرة للحدود.



وبالنسبة لكلايمتفاي، مثّلت المشاركة فرصة لتعزيز حضورها في المنصات الدولية المعنية بالقيادة الشبابية، واستكشاف مجالات التعاون مع المؤسسات والشبكات الشبابية في الدول الأعضاء بمنظمة التعاون الإسلامي.



تعزيز المشاركة الشبابية استعدادًا لمؤتمر COP29



جاءت هذه المشاركة في سياق توسيع انخراط كلايمتفاي في الحوارات والمبادرات الدولية، بالتزامن مع الاستعدادات لاستضافة أذربيجان لمؤتمر الأطراف التاسع والعشرين (COP29).



وساهمت المشاركة في تعزيز التواصل مع الشبكات والقيادات الشبابية الدولية، واستكشاف فرص دعم حضور الشباب في الحوارات المناخية العالمية، وإبراز مساهماتهم في الابتكار والعمل المناخي والتنمية المستدامة.



ومن خلال مشاركة الدكتورة مروة الشلواني، عززت كلايمتفاي حضورها في المحافل الدولية المعنية بالقيادة والدبلوماسية الشبابية، وتمكين الشباب، والابتكار، والعمل المناخي، تأكيدًا على التزامها بتوسيع الشراكات وتعزيز مشاركة الأجيال الشابة في مواجهة التحديات العالمية.



وتتقدم كلايمتفاي بالشكر والتقدير إلى منتدى شباب التعاون الإسلامي ووزارة الشباب والرياضة بجمهورية أذربيجان على تنظيم المؤتمر وإتاحة منصة دولية لتبادل الخبرات وتعزيز الحوار والتعاون بين القيادات الشبابية من مختلف الدول.`,

    image: "/climatify-azerbaijan-leadership-diplomacy-conference-2024.jpg",

    date: "2024-06-05",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Global Diplomacy & Youth Leadership",

    categoryAr: "الدبلوماسية الدولية والقيادة الشبابية"

  },

  {

    id: "climatify-ice-2024-hackathon-projectset",

    titleEn: "Climatify Joins ICE 2024 Hackathon as Sustainability Partner in Collaboration with ProjectSet",

    titleAr: "كلايمتفاي شريك الاستدامة في هاكاثون ICE 2024 بالتعاون مع ProjectSet",

    excerptEn: "Climatify announced its partnership with ProjectSet as Sustainability Partner of ICE 2024 Hackathon, supporting international youth innovation in sustainability.",

    excerptAr: "أعلنت كلايمتفاي عن شراكتها مع ProjectSet بصفتها شريك الاستدامة في هاكاثون ICE 2024 لدعم الابتكار الشبابي الدولي وريادة الأعمال المستدامة.",

    contentEn: `2024 | International Participation



Climatify announced its partnership with ProjectSet as the Sustainability Partner of the ICE 2024 Hackathon, an international initiative bringing together university students and recent graduates from around the world to foster innovation, entrepreneurship, and practical solutions to sustainability challenges.



The partnership reflects Climatify’s commitment to advancing youth-led innovation and empowering emerging talent to develop sustainable solutions, bridging academic knowledge with practical applications and encouraging young people to transform environmental and societal challenges into opportunities for innovation.



ICE 2024 provided an international platform for students and graduates from diverse academic and cultural backgrounds to exchange knowledge, collaborate across disciplines, and develop innovative ideas and projects addressing contemporary sustainability challenges.



As Sustainability Partner, Climatify supported the initiative’s focus on integrating sustainability into innovation and entrepreneurship, encouraging participants to explore solutions that combine environmental responsibility, technological advancement, and positive social impact.



The collaboration also highlighted the importance of international partnerships in strengthening youth innovation ecosystems, expanding access to collaborative learning opportunities, and connecting emerging innovators with networks that support sustainable entrepreneurship and professional development.



Through its partnership with ProjectSet, Climatify reinforced its commitment to expanding international cooperation, supporting youth-driven innovation, and promoting sustainability-oriented entrepreneurship, contributing to the development of a new generation of innovators capable of transforming global challenges into practical opportunities for sustainable development.`,

    contentAr: `2024 | مشاركة دولية



أعلنت كلايمتفاي (Climatify) عن شراكتها مع ProjectSet بصفتها شريك الاستدامة (Sustainability Partner) في هاكاثون ICE 2024، الذي يستهدف طلاب الجامعات وحديثي التخرج من مختلف أنحاء العالم، بهدف تعزيز الابتكار وريادة الأعمال وتطوير حلول عملية للتحديات المرتبطة بالاستدامة.



تأتي هذه الشراكة في إطار توجه كلايمتفاي نحو دعم الابتكار الشبابي وتعزيز مشاركة الأجيال الجديدة في تطوير حلول مستدامة، من خلال ربط المعرفة الأكاديمية بالتطبيق العملي وتشجيع الشباب على توظيف مهاراتهم وأفكارهم في مواجهة التحديات البيئية والمجتمعية.



يوفر الهاكاثون منصة دولية تجمع الطلاب والخريجين من خلفيات أكاديمية وثقافية متنوعة، بما يتيح لهم تبادل الخبرات، والعمل التعاوني، وتطوير أفكار ومشروعات مبتكرة تستجيب للتحديات الراهنة وتساهم في تحقيق أهداف التنمية المستدامة.



ومن خلال دورها شريكًا للاستدامة، تدعم كلايمتفاي توجه المبادرة نحو تعزيز الوعي بأهمية دمج الاستدامة في عمليات الابتكار، وتشجيع المشاركين على النظر إلى التحديات البيئية والتنموية باعتبارها فرصًا لتطوير حلول قابلة للتطبيق وذات أثر إيجابي على المجتمعات.



كما تعكس هذه الشراكة أهمية التعاون بين المؤسسات الداعمة للشباب ومنصات الابتكار الدولية في توسيع فرص التعلم والتواصل وبناء الشبكات المهنية، وتعزيز قدرة المواهب الشابة على المشاركة في منظومات الابتكار وريادة الأعمال المستدامة.



وتندرج مشاركة كلايمتفاي في هاكاثون ICE 2024 ضمن جهودها لتوسيع شراكاتها الدولية، ودعم المبادرات التي تجمع بين تمكين الشباب والابتكار والاستدامة، بما يسهم في إعداد جيل من المبتكرين ورواد الأعمال القادرين على تحويل التحديات إلى فرص تنموية والمساهمة في بناء مستقبل أكثر استدامة.`,

    image: "/climatify-ice-2024-hackathon-projectset.jpg",

    date: "2024-04-15",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Global Hackathons & Innovation",

    categoryAr: "هاكاثونات عالمية وابتكار"

  },

  {

    id: "climatify-ice-2024-ai-in-healthcare",

    titleEn: "Climatify Contributes to AI in Healthcare Panel Discussion at ICE 2024",

    titleAr: "مشاركة كلايمتفاي في جلسة حوارية حول الذكاء الاصطناعي في الرعاية الصحية ضمن فعاليات ICE 2024",

    excerptEn: "Climatify participated in ICE 2024, contributing to a panel discussion on AI in Healthcare led by Dr. Marwa Shalwani and Chris Monovich on digital transformation and sustainable health.",

    excerptAr: "شاركت كلايمتفاي في فعاليات ICE 2024 من خلال جلسة حوارية متخصصة حول الذكاء الاصطناعي في الرعاية الصحية بمشاركة د. مروة الشلواني والخبير كريس مونوفيتش.",

    contentEn: `2024 | International Participation



Climatify participated in ICE 2024, an international innovation initiative organized by ProjectSet, contributing to a panel discussion focused on Artificial Intelligence (AI) in Healthcare and its growing role in transforming healthcare systems, advancing medical innovation, and addressing emerging technological challenges.



Representing Climatify, Dr. Marwa Shalwani, Co-Founder of Climatify, joined industry expert Chris Monovich to explore the evolving applications of artificial intelligence in healthcare and discuss the opportunities and challenges associated with integrating emerging technologies into the sector.



The discussion examined the potential of AI to improve healthcare delivery, strengthen data-driven decision-making, and support innovation across medical services and healthcare systems. It also highlighted the importance of responsible technology adoption, interdisciplinary collaboration, and the development of skills needed to navigate an increasingly digital healthcare landscape.



Through her participation, Dr. Shalwani contributed perspectives on the intersection of technological innovation, healthcare transformation, and sustainable development, emphasizing the importance of leveraging emerging technologies to address complex societal challenges.



The panel provided an opportunity for knowledge exchange among professionals, innovators, and participants, encouraging dialogue on the future of AI-enabled healthcare and the role of innovation in developing more efficient, accessible, and resilient systems.



Climatify’s involvement in ICE 2024 reflects its broader commitment to promoting interdisciplinary innovation, strengthening knowledge exchange, and connecting emerging technologies with sustainability and societal development priorities.



By contributing to discussions beyond traditional environmental sectors, Climatify continues to advance an integrated approach to sustainable development, recognizing the interconnected roles of digital transformation, technological innovation, human well-being, and climate resilience in shaping the future of communities and industries.`,

    contentAr: `2024 | مشاركة دولية



شاركت كلايمتفاي (Climatify) في فعاليات ICE 2024، التي نظمتها ProjectSet، من خلال المساهمة في جلسة حوارية متخصصة حول الذكاء الاصطناعي في قطاع الرعاية الصحية (AI in Healthcare)، تناولت دور التقنيات الناشئة في تطوير الأنظمة الصحية، وتعزيز الابتكار الطبي، واستكشاف الفرص والتحديات المرتبطة بالتحول الرقمي في هذا القطاع الحيوي.



ومثّلت كلايمتفاي في الجلسة الدكتورة مروة الشلواني، الشريكة المؤسسة لكلايمتفاي، بمشاركة الخبير المتخصص كريس مونوفيتش (Chris Monovich)، حيث ناقشا التطورات المتسارعة في تطبيقات الذكاء الاصطناعي في الرعاية الصحية، وآفاق توظيف التكنولوجيا في تحسين جودة الخدمات وتعزيز كفاءة الأنظمة الصحية.



وركزت المناقشات على إمكانات الذكاء الاصطناعي في دعم اتخاذ القرارات القائمة على البيانات، وتطوير الخدمات الطبية، وتحسين كفاءة تقديم الرعاية الصحية، إلى جانب أهمية الاستخدام المسؤول للتكنولوجيا وتعزيز التعاون بين التخصصات المختلفة لمواكبة التحولات الرقمية.



وساهمت الدكتورة مروة الشلواني بخبراتها ورؤيتها حول العلاقة بين الابتكار التكنولوجي وتطوير قطاع الرعاية الصحية والتنمية المستدامة، مع تسليط الضوء على أهمية الاستفادة من التقنيات الحديثة في معالجة التحديات المجتمعية وتعزيز قدرة المؤسسات على تطوير حلول أكثر كفاءة واستدامة.



كما وفرت الجلسة منصة لتبادل المعرفة والخبرات بين المتخصصين والمبتكرين والمشاركين، وفتحت المجال لمناقشة مستقبل الرعاية الصحية المدعومة بالذكاء الاصطناعي، ودور الابتكار في بناء أنظمة صحية أكثر مرونة وقدرة على الاستجابة للاحتياجات المتغيرة للمجتمعات.



وتعكس مشاركة كلايمتفاي في ICE 2024 توجهها نحو دعم الابتكار متعدد التخصصات، وتعزيز تبادل المعرفة، وربط التقنيات الناشئة بأولويات الاستدامة والتنمية المجتمعية.



وتأتي هذه المشاركة ضمن جهود كلايمتفاي لتوسيع نطاق حضورها في الحوارات والمبادرات الدولية المرتبطة بالابتكار، انطلاقًا من رؤيتها لأهمية التكامل بين التحول الرقمي، والتقدم التكنولوجي، وصحة الإنسان، والقدرة على التكيف مع التغيرات المناخية، باعتبارها عناصر مترابطة في تحقيق التنمية المستدامة وبناء مجتمعات أكثر مرونة واستعدادًا للمستقبل.`,

    image: "/climatify-ice-2024-ai-in-healthcare.jpg",

    date: "2024-04-20",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "AI & Healthcare Innovation",

    categoryAr: "الذكاء الاصطناعي والابتكار الصحي"

  },

  {

    id: "climatify-wavemakers-united-strategic-partnership",

    titleEn: "Climatify Announces Strategic Partnership with Wavemakers United to Advance Youth Empowerment and Environmental Sustainability",

    titleAr: "كلايمتفاي تعلن عن شراكة استراتيجية مع Wavemakers United لتعزيز تمكين الشباب والاستدامة البيئية",

    excerptEn: "Climatify announced a strategic partnership with Wavemakers United to advance youth empowerment and sustainability across water, food, and energy security.",

    excerptAr: "أعلنت كلايمتفاي عن إبرام شراكة استراتيجية مع Wavemakers United لتعزيز تمكين الشباب والاستدامة البيئية والأمن المائي والغذائي والطاقة.",

    contentEn: `April 2024 | International Partnership



Climatify announced a strategic partnership with Wavemakers United, an international initiative dedicated to advancing sustainability through youth engagement, education, and action across the interconnected challenges of water, food, and energy security.



The collaboration brings together two organizations committed to strengthening environmental awareness, empowering young people, and promoting practical approaches to sustainable development. By combining their expertise, networks, and resources, the partnership seeks to expand opportunities for youth participation in addressing environmental and climate-related challenges.



Wavemakers United works to engage and mobilize young people through its international network, with a particular focus on the Water–Energy–Food Nexus, recognizing the interdependence of natural resources and their importance to environmental sustainability and community resilience.



Through this partnership, Climatify contributes its expertise in climate education, digital climate innovation, youth capacity building, and community engagement, supporting approaches that connect environmental knowledge with practical action and locally relevant solutions.



The collaboration aims to strengthen knowledge exchange, facilitate connections between youth networks, and explore opportunities for joint initiatives that address sustainability challenges across local, regional, and international contexts.



A central priority of the partnership is positioning young people as active contributors to sustainable development, equipping them with the knowledge, skills, and collaborative opportunities needed to participate in environmental decision-making and develop innovative responses to resource-related challenges.



The partnership also reflects the growing importance of cross-border cooperation and interdisciplinary approaches in addressing the interconnected challenges of climate change, water security, food systems, and energy sustainability.



By establishing this strategic collaboration, Climatify and Wavemakers United reaffirm their shared commitment to advancing youth-led climate action, strengthening international cooperation, and supporting more resilient and sustainable communities.



The partnership represents another step in Climatify’s efforts to expand its international network and connect climate education, technological innovation, and youth empowerment with broader sustainable development priorities.`,

    contentAr: `أبريل 2024 | شراكة دولية



أعلنت كلايمتفاي (Climatify) عن إبرام شراكة استراتيجية مع منظمة Wavemakers United، إحدى المبادرات الدولية المعنية بتعزيز الاستدامة وتمكين الشباب من المشاركة في مواجهة التحديات البيئية، مع التركيز على القضايا المترابطة المتعلقة بالأمن المائي والغذائي والطاقة.



تجمع هذه الشراكة بين مؤسستين تتشاركان رؤية تقوم على تعزيز الوعي البيئي، وبناء قدرات الشباب، وتطوير حلول عملية تدعم التنمية المستدامة، من خلال توظيف الخبرات والشبكات الدولية والموارد المتاحة لتوسيع نطاق التأثير المجتمعي والمناخي.



وتعمل Wavemakers United على إشراك الشباب من خلال شبكة دولية واسعة، مع التركيز على الترابط بين المياه والطاقة والغذاء (Water–Energy–Food Nexus)، باعتباره أحد المحاور الأساسية لفهم التحديات المرتبطة بإدارة الموارد الطبيعية وتعزيز قدرة المجتمعات على مواجهة التغيرات البيئية والمناخية.



وفي إطار هذه الشراكة، تسهم كلايمتفاي بخبراتها في التعليم المناخي، والرقمنة المناخية، وبناء قدرات الشباب، والابتكار المستدام، والمشاركة المجتمعية، بما يدعم تطوير مبادرات تربط بين المعرفة البيئية والتطبيقات العملية والحلول المبتكرة التي تستجيب لاحتياجات المجتمعات.



وتهدف الشراكة إلى تعزيز تبادل المعرفة والخبرات، وربط الشبكات الشبابية، واستكشاف فرص تطوير مبادرات وبرامج مشتركة تسهم في معالجة تحديات الاستدامة على المستويات المحلية والإقليمية والدولية.



ويمثل تمكين الشباب للمشاركة الفاعلة في تحقيق التنمية المستدامة أحد المحاور الرئيسية للتعاون، من خلال تعزيز وصولهم إلى المعرفة والمهارات وفرص التواصل الدولي، ودعم مساهمتهم في تطوير الحلول والمشاركة في الحوارات المرتبطة بالاستدامة وإدارة الموارد.



كما تعكس الشراكة أهمية التعاون الدولي والعمل متعدد التخصصات في التعامل مع التحديات المتداخلة للتغير المناخي والأمن المائي والنظم الغذائية واستدامة الطاقة، بما يسهم في دعم مجتمعات أكثر مرونة وقدرة على التكيف.



ومن خلال هذا التعاون الاستراتيجي، تؤكد كلايمتفاي وWavemakers United التزامهما المشترك بتعزيز العمل المناخي بقيادة الشباب، وتوسيع نطاق التعاون الدولي، ودعم المبادرات التي تسهم في تحقيق أثر بيئي ومجتمعي مستدام.



وتشكل هذه الشراكة خطوة إضافية ضمن جهود كلايمتفاي لتوسيع شبكة شراكاتها الدولية، وتعزيز التكامل بين التعليم المناخي والابتكار التكنولوجي وتمكين الشباب وأولويات التنمية المستدامة.`,

    image: "/climatify-wavemakers-united-strategic-partnership.png",

    date: "2024-04-10",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Strategic Partnerships",

    categoryAr: "شراكات استراتيجية"

  },

  {

    id: "climatify-al-athaab-strategic-collaboration",

    titleEn: "Climatify Announces Strategic Collaboration with Al Athaab to Advance Sustainability, Environmental Safety, and Youth Empowerment",

    titleAr: "كلايمتفاي تعلن عن تعاون استراتيجي مع العذاب لتعزيز الاستدامة والسلامة البيئية وتمكين الشباب",

    excerptEn: "Climatify announced a strategic collaboration with Al Athaab, combining expertise in environmental solutions, safety systems, climate education, and youth empowerment.",

    excerptAr: "أعلنت كلايمتفاي عن تعاون استراتيجي مع شركة العذاب للحلول البيئية وأنظمة السلامة لتعزيز التعليم المناخي وتمكين الشباب والممارسات المستدامة.",

    contentEn: `United Arab Emirates | Strategic Collaboration



Climatify announced a strategic collaboration with Al Athaab, a company specializing in environmental solutions, safety systems, and information technology, to strengthen cooperation in sustainability, environmental education, and youth engagement.



The collaboration brings together complementary expertise in environmental management, technological innovation, climate education, and sustainable development, reflecting a shared commitment to advancing practical solutions that address environmental challenges and support responsible economic and community development.



Al Athaab provides integrated solutions across environmental services, safety systems, and information technology, with a focus on energy conservation, industrial safety, and sustainable practices. Its technical expertise contributes to improving operational efficiency, strengthening safety standards, and supporting environmentally responsible practices across different sectors.



As a UAE-based climate-focused enterprise, Climatify brings expertise in climate digitalization, environmental education, youth and women’s empowerment, and community capacity building. Through its programs and initiatives, Climatify works to connect climate knowledge with practical applications while supporting participation in sustainability and climate action.



The collaboration is founded on shared institutional priorities and a commitment to combining technical expertise with education, policy engagement, and community development. It seeks to explore opportunities for joint initiatives that strengthen environmental awareness, promote sustainability-oriented skills, and encourage youth participation in addressing environmental and industrial challenges.



A key area of cooperation is the integration of environmental and safety expertise into educational and capacity-building initiatives, creating opportunities to connect technical knowledge with practical learning and broader sustainability objectives.



The collaboration also highlights the importance of engaging young people in environmental policy discussions, technological innovation, and sustainable development, recognizing their potential contribution to the UAE’s long-term environmental and economic priorities.



Through this strategic cooperation, Climatify and Al Athaab aim to strengthen cross-sector knowledge exchange and explore initiatives that support environmental responsibility, safer practices, resource efficiency, and community empowerment.



This collaboration represents another step in Climatify’s efforts to expand its partnerships with the private sector, bringing together climate education, technical innovation, and youth engagement to contribute to the UAE’s national sustainability ambitions and wider sustainable development objectives.`,

    contentAr: `الإمارات العربية المتحدة | تعاون استراتيجي



أعلنت كلايمتفاي (Climatify) عن تعاون استراتيجي مع شركة العذاب (Al Athaab)، المتخصصة في الحلول البيئية وأنظمة السلامة وتكنولوجيا المعلومات، بهدف تعزيز التعاون في مجالات الاستدامة والتعليم البيئي والابتكار التكنولوجي وتمكين الشباب.



يجمع هذا التعاون بين الخبرات الفنية والتكنولوجية لشركة العذاب وخبرات كلايمتفاي في التعليم المناخي، والرقمنة المناخية، وبناء القدرات، والتنمية المجتمعية، بما يعزز فرص تطوير مبادرات تربط بين المعرفة العلمية والتطبيقات العملية، وتدعم الممارسات البيئية المسؤولة.



وتقدم شركة العذاب حلولًا متكاملة في مجالات البيئة وأنظمة السلامة وتكنولوجيا المعلومات، مع التركيز على كفاءة استخدام الطاقة، والسلامة الصناعية، وتطوير الممارسات المستدامة، بما يسهم في تحسين الكفاءة التشغيلية وتعزيز معايير السلامة والمسؤولية البيئية في مختلف القطاعات.



ومن جانبها، تعمل كلايمتفاي، باعتبارها شركة ناشئة إماراتية متخصصة في العمل المناخي والتنمية المستدامة، على دمج التكنولوجيا والابتكار في التعليم المناخي والمبادرات المجتمعية، مع التركيز على تمكين الشباب والنساء وتعزيز مشاركتهم في مواجهة التحديات البيئية والمساهمة في تحقيق الأولويات الوطنية لدولة الإمارات.



ويرتكز التعاون على تبادل الخبرات وتكامل الموارد وتعزيز العمل المشترك في مجالات التعليم والمشاركة في السياسات البيئية والمناخية، مع التركيز على إشراك الشباب في مناقشة التحديات البيئية وتطوير حلول مبتكرة تستجيب لاحتياجات المجتمع والقطاعات الاقتصادية.



ويشمل التوجه المشترك استكشاف فرص تطوير مبادرات تعليمية وبرامج لبناء القدرات تجمع بين الخبرة الفنية في مجالات البيئة والسلامة والتكنولوجيا، والمنهجيات التفاعلية في التعليم المناخي، بما يتيح للشباب اكتساب معارف ومهارات عملية مرتبطة بالاستدامة والاقتصاد الأخضر.



كما يعكس التعاون أهمية تعزيز مشاركة القطاع الخاص في بناء القدرات البيئية والمناخية، وتوسيع فرص التواصل بين المؤسسات المتخصصة والشباب، بما يدعم إعداد كوادر قادرة على التعامل مع التحديات المستقبلية والمساهمة في التحول نحو ممارسات اقتصادية أكثر استدامة.



ويتوافق هذا التوجه مع الاستراتيجيات الوطنية لدولة الإمارات في مجالات الاستدامة والعمل المناخي والتحول الرقمي، من خلال تشجيع الابتكار، وتعزيز كفاءة الموارد، ودعم مشاركة الشباب والنساء في التنمية المستدامة.



ومن خلال هذا التعاون، تسعى كلايمتفاي وشركة العذاب إلى تعزيز التكامل بين الحلول التقنية والتعليم البيئي والمشاركة المجتمعية، واستكشاف فرص تنفيذ مبادرات مشتركة تدعم السلامة البيئية والابتكار والاستدامة.



ويمثل هذا التعاون خطوة إضافية ضمن جهود كلايمتفاي لتوسيع شراكاتها مع القطاع الخاص، وتعزيز دورها في الربط بين التعليم المناخي والتكنولوجيا والسياسات البيئية وتمكين الشباب، بما يسهم في دعم التنمية المستدامة على المستويات المحلية والإقليمية والدولية.`,

    image: "/climatify-al-athaab-strategic-collaboration.png",

    date: "2024-04-05",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Strategic Partnerships",

    categoryAr: "شراكات استراتيجية"

  },

  {

    id: "climatify-climate-in-arabic-partnership",

    titleEn: "Climatify Announces Strategic Partnership with Climate in Arabic to Advance Climate Awareness and Empower Arab Youth",

    titleAr: "كلايمتفاي تعلن عن شراكة استراتيجية مع «المناخ بالعربي» لتعزيز الوعي المناخي وتمكين الشباب العربي",

    excerptEn: "Climatify announced a strategic partnership with Climate in Arabic to advance climate awareness, Arabic environmental communication, and youth empowerment.",

    excerptAr: "أعلنت كلايمتفاي عن شراكة استراتيجية مع «المناخ بالعربي» لتعزيز الوعي المناخي باللغة العربية وتمكين الشباب وصناعة المحتوى البيئي الهادف.",

    contentEn: `Climatify announced a strategic partnership with Climate in Arabic, aimed at strengthening climate awareness across the Arab region and expanding the role of youth, digital media, and environmental communication in advancing climate action and sustainable development.



The partnership is built on a shared commitment to making climate knowledge more accessible in Arabic and empowering young people with the information, resources, and opportunities needed to actively contribute to environmental and climate action at local, regional, and international levels.



A central focus of the collaboration is strengthening the role of media, digital platforms, and social communication in climate education. By making complex environmental issues more accessible and engaging, the partnership seeks to bridge the gap between scientific knowledge and public understanding while encouraging greater community participation in sustainability initiatives.



Through this collaboration, Climatify and Climate in Arabic aim to combine their expertise in climate education, environmental communication, digital content development, and youth engagement, supporting approaches that connect scientific knowledge with practical awareness and community-driven action.



The partnership also seeks to encourage youth-led green initiatives across the Arab region, highlighting the importance of young people as contributors to environmental innovation, sustainable practices, and long-term climate solutions.



For Climatify, this collaboration reflects its broader approach to integrating climate education, digital innovation, and community engagement as essential tools for strengthening environmental literacy and building the capacity of emerging generations to address climate challenges.



The partnership further recognizes the importance of Arabic-language climate communication in expanding access to environmental knowledge, promoting informed public dialogue, and strengthening connections between youth networks, educational initiatives, and sustainability-focused organizations.



By establishing this strategic partnership, Climatify continues to expand its regional network and reinforce its commitment to youth empowerment, accessible climate education, and the development of environmental communication as a driver of meaningful participation in sustainable development across the Arab world.`,

    contentAr: `أعلنت كلايمتفاي (Climatify) عن شراكة استراتيجية مع «المناخ بالعربي» (Climate in Arabic)، بهدف تعزيز الوعي بقضايا التغير المناخي والاستدامة في المنطقة العربية، وتوسيع دور الشباب والإعلام الرقمي في دعم العمل المناخي وتحقيق أهداف التنمية المستدامة.



تأتي هذه الشراكة انطلاقًا من رؤية مشتركة تؤكد أهمية إتاحة المعرفة المناخية باللغة العربية، وتمكين الشباب من الوصول إلى المعلومات والفرص المرتبطة بالعمل البيئي والمناخي، بما يعزز قدرتهم على المشاركة الفاعلة في مواجهة التحديات البيئية على المستويات المحلية والإقليمية والدولية.



ويركز التعاون على تعزيز دور الإعلام والمنصات الرقمية ووسائل التواصل الاجتماعي في نشر المعرفة المناخية، وتطوير أساليب تواصل قادرة على تبسيط القضايا البيئية المعقدة وتحويلها إلى محتوى معرفي يسهم في رفع الوعي العام وتشجيع المشاركة المجتمعية.



ومن خلال هذه الشراكة، تسعى كلايمتفاي و«المناخ بالعربي» إلى توظيف خبراتهما في التعليم المناخي، والتواصل البيئي، وصناعة المحتوى الرقمي، والمشاركة الشبابية، بما يدعم بناء جسور بين المعرفة العلمية والجمهور العربي، ويعزز حضور القضايا المناخية في النقاشات المجتمعية.



كما يستهدف التعاون تشجيع المبادرات الخضراء التي يقودها الشباب في المنطقة العربية، وتسليط الضوء على أهمية دور الأجيال الشابة في تطوير الحلول والمساهمة في تشكيل مستقبل أكثر استدامة.



وتعكس هذه الشراكة توجه كلايمتفاي نحو دمج التعليم المناخي بالابتكار الرقمي والتواصل المجتمعي، باعتبارها أدوات أساسية لبناء القدرات وتعزيز المشاركة في العمل المناخي، لا سيما في المجتمعات العربية التي تتطلب توسيع نطاق الوصول إلى المعرفة والموارد التعليمية المتخصصة.



وتؤكد الشراكة كذلك أهمية التعاون بين المؤسسات والمبادرات الشبابية والإعلامية في تعزيز الحوار المناخي باللغة العربية، ودعم المشاركة المجتمعية، وربط التوعية البيئية بالممارسات والمبادرات المستدامة.



ومن خلال هذا التعاون، تواصل كلايمتفاي توسيع شبكة شراكاتها في المنطقة العربية، وتعزيز جهودها في تمكين الشباب، وتطوير المعرفة المناخية، ودعم الإعلام البيئي بوصفه أداة مؤثرة في تحقيق التنمية المستدامة.`,

    image: "/climatify-climate-in-arabic-partnership.png",

    date: "2024-04-02",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Strategic Partnerships",

    categoryAr: "شراكات استراتيجية"

  },

  {

    id: "climatify-zayed-university-uae-environment-day-2024",

    titleEn: "Climatify Participates in UAE Environment Day at Zayed University, Advancing Youth Engagement in Sustainability",

    titleAr: "مشاركة كلايمتفاي في يوم الإمارات للبيئة بجامعة زايد وتعزيز دور الشباب في الاستدامة",

    excerptEn: "Climatify participated in UAE Environment Day at Zayed University, Dubai, with Co-Founder Shaikha Al Shafar joining a panel on local product sustainability.",

    excerptAr: "شاركت كلايمتفاي في فعاليات يوم الإمارات للبيئة بجامعة زايد بدبي، مع مساهمة الشريكة المؤسسة شيخة الشعفار في جلسة حوارية حول استدامة المنتجات المحلية.",

    contentEn: `29 February 2024 | Dubai, United Arab Emirates



Climatify participated in UAE Environment Day, hosted at Zayed University’s Dubai campus, as part of its ongoing efforts to strengthen climate awareness, promote knowledge exchange, and expand opportunities for youth engagement in environmental action and sustainable development.



The event provided a platform for Climatify to engage with university students, graduates, and young professionals, facilitating discussions on sustainability, climate change, and environmental innovation. The team also introduced participants to Climatify’s areas of expertise, ongoing initiatives, and prospective projects for 2024, while exploring opportunities for youth involvement and future collaboration.



A key highlight of Climatify’s participation was the contribution of Shaikha Al Shafar, Co-Founder of Climatify, to a panel discussion organized by Zayed University on Local Product Sustainability. Alongside industry experts and sustainability professionals, Al Shafar shared perspectives on the importance of integrating sustainability into local products and supporting environmentally responsible economic practices.



The discussion emphasized the relevance of sustainable local production, responsible consumption, and resource efficiency in advancing environmental objectives and supporting the UAE’s transition toward a more sustainable economy.



Climatify’s participation also reinforced the importance of collaboration between academic institutions, young people, and the wider community in translating environmental awareness into practical engagement and collective climate action.



The initiative aligned with the UAE’s national sustainability and climate action priorities, highlighting the contribution of youth-led initiatives and cross-sector partnerships to advancing sustainable development at local, regional, and international levels.



Climatify recognizes the important role of universities in equipping young people with the knowledge, skills, and opportunities needed to address environmental challenges. The organization extends its appreciation to Zayed University for fostering an environment that encourages students and graduates to participate in sustainability-focused initiatives and community engagement.



Through its participation in UAE Environment Day, Climatify reaffirmed its commitment to strengthening academic partnerships, empowering young people, and advancing collaborative approaches to climate action and sustainable development.`,

    contentAr: `29 فبراير 2024 | دبي، الإمارات العربية المتحدة



شاركت كلايمتفاي (Climatify) في فعاليات يوم الإمارات للبيئة (UAE Environment Day)، التي استضافتها جامعة زايد في حرمها الجامعي بدبي، في إطار جهودها لتعزيز الوعي المناخي، وتبادل المعرفة، وتوسيع فرص مشاركة الشباب في المبادرات البيئية والتنموية.



شهدت الفعالية تفاعل فريق كلايمتفاي مع طلاب الجامعة وخريجيها والشباب المشاركين، حيث جرى تبادل الخبرات والمعرفة حول الاستدامة والتغير المناخي والابتكار البيئي، إلى جانب التعريف بمجالات عمل المؤسسة وبرامجها ومشروعاتها المستقبلية، واستكشاف فرص التعاون والمشاركة الشبابية في المبادرات المناخية.



كما شاركت شيخة الشعفار، الشريكة المؤسسة لكلايمتفاي، في جلسة حوارية نظمتها جامعة زايد حول استدامة المنتجات المحلية، بمشاركة مجموعة من الخبراء والمتخصصين، حيث ساهمت في تبادل الرؤى والخبرات المتعلقة بأهمية تعزيز الاستدامة في المنتجات المحلية ودورها في دعم الممارسات الاقتصادية والبيئية المسؤولة.



وسلطت الجلسة الضوء على أهمية ربط الاستدامة بالمنتجات المحلية، وتعزيز الوعي بالاستهلاك والإنتاج المسؤولين، بما يدعم توجهات دولة الإمارات نحو الاقتصاد المستدام وكفاءة استخدام الموارد.



وتعكس مشاركة كلايمتفاي في الفعالية اهتمامها بتعزيز التعاون مع المؤسسات الأكاديمية والشباب والمجتمع، وتطوير مساحات للتواصل وتبادل المعرفة تسهم في تحويل الوعي البيئي إلى فرص للمشاركة والعمل المناخي.



كما تأتي المشاركة في سياق دعم الأولويات والاستراتيجيات الوطنية لدولة الإمارات في مجالات الاستدامة والعمل المناخي، وتعزيز مساهمة الشباب في تحقيق أهداف التنمية المستدامة على المستويات المحلية والإقليمية والدولية.



وتؤكد كلايمتفاي أهمية الدور الذي تضطلع به الجامعات في إعداد جيل واعٍ بالتحديات البيئية، وتعزيز مهاراته وقدراته على المشاركة في تطوير حلول مستدامة، معربة عن تقديرها لجامعة زايد على إتاحة هذه المنصة وتشجيع الطلاب والخريجين على الانخراط في المبادرات البيئية والمجتمعية.



وتندرج هذه المشاركة ضمن جهود كلايمتفاي المستمرة لبناء شراكات فاعلة مع المؤسسات التعليمية، وتمكين الشباب من المساهمة في مواجهة التحديات المناخية ودعم التحول نحو مجتمعات أكثر استدامة.`,

    image: "/climatify-zayed-university-uae-environment-day-2024.jpg",

    date: "2024-02-29",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "Youth & Academic Engagement",

    categoryAr: "الشباب والشراكات الأكاديمية"

  },

  {

    id: "climatify-cop28-sme-climate-hub-mena",

    titleEn: "Climatify Joins the COP28 SME Climate Hub for the Middle East and North Africa",

    titleAr: "مشاركة كلايمتفاي في مركز المناخ للشركات الصغيرة والمتوسطة لمنطقة الشرق الأوسط وشمال أفريقيا ضمن مبادرات COP28",

    excerptEn: "Climatify joined the SME Climate Hub for MENA, a regional initiative associated with the COP28 UAE Presidency to support low-carbon business transition.",

    excerptAr: "انضمت كلايمتفاي إلى مركز المناخ للشركات الصغيرة والمتوسطة (SME Climate Hub for MENA) ضمن مبادرات رئاسة COP28 لدعم التحول الأخضر للقطاع الخاص.",

    contentEn: `November 2023 | United Arab Emirates



Climatify joined the SME Climate Hub for the Middle East and North Africa (MENA), a regional initiative associated with the UAE Presidency of the 28th United Nations Climate Change Conference (COP28), aimed at strengthening the participation of small and medium-sized enterprises (SMEs) in climate action and accelerating the transition toward a low-carbon economy.



The initiative was established through collaboration between the COP28 UAE Presidency, the SME Climate Hub, Masdar, and leading financial and institutional partners in Abu Dhabi, including the Abu Dhabi Chamber, reflecting a broader commitment to mobilizing the private sector in support of climate action and sustainable economic development.



As a flagship private-sector initiative associated with COP28, the Hub seeks to empower SMEs to integrate sustainability into their business operations, strengthen climate awareness, and advance practical approaches to emissions reduction and environmental responsibility.



The initiative holds particular significance for the Middle East and North Africa, where SMEs play an essential role in economic development, entrepreneurship, and job creation. Supporting their transition toward sustainable business models is critical to strengthening regional economic resilience and advancing long-term climate objectives.



Climatify’s participation reflects its commitment to strengthening the role of startups and SMEs within the regional climate action ecosystem, while promoting sustainable innovation, knowledge exchange, and cross-sector collaboration.



The engagement also aligns with Climatify’s broader mission of connecting climate education, green entrepreneurship, and sustainability-driven innovation, creating opportunities for collaboration with regional and international stakeholders working to accelerate the green transition.



Through its participation in the SME Climate Hub for MENA, Climatify further strengthened its engagement with the regional sustainability ecosystem and reaffirmed its commitment to supporting a more inclusive, resilient, and low-carbon economy across the Middle East and North Africa.`,

    contentAr: `نوفمبر 2023 | الإمارات العربية المتحدة



انضمت كلايمتفاي (Climatify) إلى مركز المناخ للشركات الصغيرة والمتوسطة في منطقة الشرق الأوسط وشمال أفريقيا (SME Climate Hub for MENA)، ضمن المبادرات المرتبطة برئاسة دولة الإمارات لمؤتمر الأطراف الثامن والعشرين لاتفاقية الأمم المتحدة الإطارية بشأن تغير المناخ (COP28)، بهدف تعزيز مشاركة الشركات الصغيرة والمتوسطة في جهود العمل المناخي والتحول نحو اقتصاد منخفض الكربون.



جاء إطلاق المبادرة في إطار تعاون جمع رئاسة COP28 الإماراتية، ومركز المناخ للشركات الصغيرة والمتوسطة (SME Climate Hub)، ومصدر، وشركاء من القطاعين المالي والمؤسسي في أبوظبي، من بينهم غرفة أبوظبي، لدعم مشاركة القطاع الخاص في تحقيق أهداف الاستدامة والعمل المناخي.



ويهدف المركز إلى تعزيز قدرة الشركات الصغيرة والمتوسطة على الانخراط في التحول نحو ممارسات أعمال أكثر استدامة، من خلال تشجيع تبادل المعرفة، وتوسيع نطاق التعاون، وتعزيز الوعي بأهمية خفض الانبعاثات الكربونية ودمج الاعتبارات المناخية في استراتيجيات الأعمال.



وتكتسب المبادرة أهمية خاصة في منطقة الشرق الأوسط وشمال أفريقيا، حيث تمثل الشركات الصغيرة والمتوسطة عنصرًا رئيسيًا في التنمية الاقتصادية وخلق فرص العمل، بما يجعل مشاركتها في التحول الأخضر ضرورية لتعزيز تنافسية الاقتصاد الإقليمي وتحقيق أهداف التنمية المستدامة.



وتعكس مشاركة كلايمتفاي في هذه المبادرة اهتمامها بتعزيز دور المؤسسات الناشئة والمشروعات الصغيرة والمتوسطة في منظومة العمل المناخي، إلى جانب دعم الابتكار المستدام وبناء الشراكات التي تربط بين القطاع الخاص والمؤسسات المعنية بالتنمية والاستدامة.



كما تتماشى هذه المشاركة مع توجه كلايمتفاي نحو الربط بين التعليم المناخي وريادة الأعمال والابتكار الأخضر، وتعزيز فرص التعاون مع الجهات الإقليمية والدولية لتطوير حلول ومبادرات تسهم في مواجهة التحديات البيئية والمناخية.



ويمثل انضمام كلايمتفاي إلى المركز خطوة ضمن جهودها لتوسيع حضورها في منظومة الاستدامة الإقليمية، وتعزيز التعاون مع القطاع الخاص لدعم التحول نحو اقتصاد أكثر استدامة ومرونة وقدرة على مواجهة آثار تغير المناخ في منطقة الشرق الأوسط وشمال أفريقيا.`,

    image: "/climatify-cop28-sme-climate-hub-mena.png",

    date: "2023-11-15",

    authorEn: "Climatify Media",

    authorAr: "المركز الإعلامي لكلايمتيفاي",

    categoryEn: "SME & Green Economy",

    categoryAr: "الشركات والتحول الأخضر"

  },

  {

    id: "shift-program-2025",

    titleEn: "SHiFT Program – Youth Capacity Building & Leadership 2025",

    titleAr: "برنامج SHIFT – بناء قدرات الشباب وإعداد القيادات المستقبلية ٢٠٢٥",

    excerptEn: "SHiFT is a youth capacity-building and professional development program led by Climatify, bridging academic knowledge and practical experience.",

    excerptAr: "برنامج SHIFT هو برنامج إقليمي لبناء قدرات الشباب والتطوير المهني، تقوده كلايمتفاي لسد الفجوة بين المعرفة الأكاديمية والتطبيق العملي.",

    contentEn: `SHiFT Program – Youth Capacity Building & Leadership 2025



Program Overview



SHiFT is a youth capacity-building and professional development program led by Climatify, designed to bridge the gap between academic knowledge and practical experience. Through technical training, thematic learning, professional internships, and youth-led mentorship, the program equips emerging leaders with the skills to contribute to sustainable development.



Program Objectives



* Develop technical, analytical, and leadership competencies.

* Strengthen skills in policy writing, research, project proposals, and stakeholder mapping.

* Connect young professionals with practical internship opportunities.

* Establish a sustainable network of youth ambassadors and mentors.



Thematic Areas



Climate Change & Sustainability | Green & Circular Economy | Sustainable Agriculture & Water Security | Gender Equality | Public Policy & EU Diplomacy | AI, Technology & Space Innovation | Youth Leadership & Negotiation



SHiFT 2025 – Key Results



* 60 participants from 5 countries

* 14 training sessions across three learning tracks

* 10 awareness videos produced

* 4 project proposals developed with stakeholder maps

* Over 80% attendance across training sessions

* Establishment of the SHiFT Ambassador Network to support peer learning, mentorship, and future cohorts.



Program Partners



Climatify | Wavemakers United | Space Point | EU Jeel Connect`,

    contentAr: `برنامج SHIFT – بناء قدرات الشباب وإعداد القيادات المستقبلية ٢٠٢٥



نبذة عن البرنامج



برنامج SHIFT هو برنامج إقليمي لبناء قدرات الشباب والتطوير المهني، تقوده كلايمتفاي بالتعاون مع شركاء إقليميين ودوليين، بهدف سد الفجوة بين المعرفة الأكاديمية والتطبيق العملي، من خلال مسار متكامل يجمع بين التدريب المتخصص، والتدريب المهني العملي، والإرشاد والقيادة الشبابية، وصولًا إلى إعداد جيل من المهنيين الشباب القادرين على المساهمة في قطاع التنمية المستدامة.



أهداف البرنامج



* تطوير المهارات التقنية والتحليلية والقيادية لدى الشباب.

* تعزيز قدراتهم في إعداد أوراق السياسات والبحوث والمقترحات والمشروعات التنموية.

* إتاحة فرص للتدريب المهني والتطبيق العملي بالتعاون مع المؤسسات الشريكة.

* تأسيس شبكة مستدامة من سفراء البرنامج لدعم التعلم بين الأقران ونقل المعرفة.



المجالات الموضوعية (Thematic Areas)



* التغير المناخي والاستدامة البيئية.

* الاقتصاد الأخضر والاقتصاد الدائري.

* الزراعة المستدامة والأمن المائي.

* المساواة بين الجنسين والتنمية الشاملة.

* السياسات العامة والحوكمة والدبلوماسية الأوروبية.

* الذكاء الاصطناعي والتكنولوجيا وابتكارات الفضاء.

* القيادة الشبابية والتفاوض والتواصل الفعّال.



أبرز مخرجات الدفعة الأولى – SHIFT 2025



* 60 مشاركًا من 5 دول.

* 14 جلسة تدريبية ضمن ثلاثة مسارات متكاملة.

* إنتاج 10 فيديوهات توعوية حول المناخ والاستدامة.

* تطوير 4 مقترحات مشروعات مدعومة بخرائط لأصحاب المصلحة.

* تحقيق نسبة حضور تجاوزت 80% خلال الجلسات التدريبية.

* تأسيس شبكة سفراء SHIFT لتعزيز القيادة الشبابية والإرشاد ونقل الخبرات إلى الدفعات القادمة.



شركاء البرنامج



كلايمتفاي | Wavemakers United | Space Point | EU Jeel Connect`,

    image: "/ambassadors/shift-ambassadors-2026.webp",

    date: "2025-12-15",

    authorEn: "Climatify Programs",

    authorAr: "إدارة البرامج — كلايمتيفاي",

    categoryEn: "Youth Empowerment",

    categoryAr: "تمكين الشباب"

  }

];



export const mockTeam: TeamMember[] = [

  // 1. Founders & Leadership Team (المؤسسون المعتمدون)

  {

    id: "mai-moawad",

    nameEn: "Mai Moawad",

    nameAr: "مي معوض",

    roleEn: "Founder & CEO",

    roleAr: "المؤسس والرئيس التنفيذي",

    image: "/founders/Mai Mowad_1.webp",

    borderColor: "#10B981",

    gradient: "linear-gradient(145deg, #059669, #022c22)",

    category: "founder"

  },

  {

    id: "abdullah-salmani",

    nameEn: "Abdullah Al Salmani",

    nameAr: "عبد الله السلماني",

    roleEn: "Co-Founder & COO",

    roleAr: "المؤسس المشارك والمدير التنفيذي للعمليات",

    image: "/founders/Abdullah Al Salmani_2.webp",

    borderColor: "#38BDF8",

    gradient: "linear-gradient(145deg, #0284c7, #082f49)",

    category: "founder"

  },

  {

    id: "marwa-shalwani",

    nameEn: "Dr. Marwa Shalwani",

    nameAr: "د. مروة الشلواتي",

    roleEn: "Co-Founder & CPO",

    roleAr: "المؤسس المشارك ورئيس قطاع البرامج والمنتجات",

    image: "/founders/Marwa Al Shalwani_3.webp",

    borderColor: "#A78BFA",

    gradient: "linear-gradient(145deg, #7c3aed, #2e1065)",

    category: "founder"

  },

  {

    id: "heba-momtaz",

    nameEn: "Heba Momtaz",

    nameAr: "هبة ممتاز",

    roleEn: "Co-Founder & CCDO",

    roleAr: "المؤسس المشارك ورئيس التطوير المجتمعي والشراكات",

    image: "/founders/Heba Momtaz_8.webp",

    borderColor: "#A3E635",

    gradient: "linear-gradient(145deg, #65a30d, #1a2e05)",

    category: "founder"

  },

  {

    id: "rowayyah-alhefeiti",

    nameEn: "Rowayyah Alhefeiti",

    nameAr: "رواية الحفيتي",

    roleEn: "Co-Founder & Head of Financial",

    roleAr: "المؤسس المشارك ورئيس القطاع المالي",

    image: "/founders/Rowayyah Alhefeiti.png",

    borderColor: "#FBBF24",

    gradient: "linear-gradient(145deg, #d97706, #451a03)",

    category: "founder"

  },

  {

    id: "maysara-ezz",

    nameEn: "Maysara Ezz",

    nameAr: "ميسرة عز",

    roleEn: "Events and Programs Manager",

    roleAr: "مدير الفعاليات والبرامج",

    image: "/founders/Maysara Ezz.jpg",

    borderColor: "#38BDF8",

    gradient: "linear-gradient(145deg, #0284c7, #082f49)",

    category: "core"

  },

  {

    id: "ahmed-ashraf-kamel",

    nameEn: "Ahmed Ashraf Kamel",

    nameAr: "أحمد أشرف كامل",

    roleEn: "Egypt Coordinator",

    roleAr: "منسق جمهورية مصر العربية",

    image: "/ambassadors/ahmed-ashraf.webp",

    borderColor: "#00C091",

    gradient: "linear-gradient(145deg, #00C091, #006048)",

    category: "core"

  },



  // 2. Interns & SHIFT Ambassadors 2026 (متدربو وسفراء 2026)

  {

    id: "intern-salma-nagy",

    nameEn: "Salma Nagy",

    nameAr: "سلمى ناجي",

    roleEn: "UAE Coordinator",

    roleAr: "منسق دولة الإمارات",

    image: "/ambassadors/salma-nagy.webp",

    borderColor: "#10B981",

    gradient: "linear-gradient(145deg, #059669, #022c22)",

    category: "intern"

  }

];



export const mockCareers: CareerNode[] = [];



export const mockCarbonQuestions: CarbonQuestion[] = [

  {

    questionEn: "How do you commute to work or school daily?",

    questionAr: "كيف تتنقل إلى مقر عملك أو دراستك يومياً؟",

    options: [

      { textEn: "By private car (Gasoline)", textAr: "سيارة خاصة (محرك وقود)", value: 4.6 },

      { textEn: "By public transport (Metro/Bus)", textAr: "وسائل النقل العام (مترو أو حافلات)", value: 1.2 },

      { textEn: "By Electric Vehicle / Hybrid", textAr: "مركبة كهربائية أو هجينة", value: 2.0 },

      { textEn: "Bicycle / Walking", textAr: "دراجة هوائية أو سيراً على الأقدام", value: 0 }

    ]

  },

  {

    questionEn: "What does your typical daily diet look like?",

    questionAr: "ما طبيعة نظامك الغذائي اليومي المعتاد؟",

    options: [

      { textEn: "Meat heavy (Beef/Lamb daily)", textAr: "استهلاك يومي مكثف للحوم الحمراء", value: 3.3 },

      { textEn: "Balanced (Meat + Veggies)", textAr: "متوازن (لحوم معتدلة وخضروات)", value: 1.9 },

      { textEn: "Vegetarian / Vegan", textAr: "نظام نباتي متكامل", value: 0.8 }

    ]

  },

  {

    questionEn: "What is your main household energy source?",

    questionAr: "ما مصدر الطاقة الرئيسي المعتمد في مسكنك؟",

    options: [

      { textEn: "Standard Grid Electricity", textAr: "شبكة الكهرباء التقليدية", value: 4.1 },

      { textEn: "Mix with Solar Panels", textAr: "مزيج مدعوم بألواح الطاقة الشمسية", value: 1.5 },

      { textEn: "100% Renewable / Eco-friendly", textAr: "منظومة طاقة نظيفة ومتجددة بالكامل", value: 0.2 }

    ]

  }

];



// ==========================================

// Member dashboard & Admin datasets

// (previously inlined in api.ts — relocated so every mock lives in one file)

// ==========================================



export const mockUserProfile: UserProfileResponse = {

  name: "عبد الله الشامسي",

  email: "abdalla.shamsi@example.com",

  city: "دبي",

  bio: "ناشط مناخي مهتم بالرقمنة والحلول الصديقة للبيئة.",

  stats: { ecoPoints: 240, virtualTrees: 3, earnedBadges: 2 },

  recentActivities: [

    {

      id: "1",

      titleAr: "أنهيت الدرس الأول بنجاح",

      titleEn: "Completed Lesson 1 Successfully",

      detailAr: "في مساق مقدمة الرقمنة المناخية",

      detailEn: "In Intro to Climate Digitization Course"

    },

    {

      id: "2",

      titleAr: "تم احتساب بصمتك الكربونية",

      titleEn: "Calculated your carbon footprint",

      detailAr: "النتيجة: 4.8 طن سنويًا (صديقة للبيئة)",

      detailEn: "Result: 4.8 Tons/Year (Eco-friendly)"

    }

  ],

  // ids below intentionally match mockCourses / mockEvents so the dashboard links resolve

  registeredCourses: [

    {

      id: "course-shift-internship",

      titleAr: "برنامج SHIFT للتدريب",

      titleEn: "SHIFT Internship",

      progress: 50

    }

  ],

  registeredEvents: [

    {

      id: "shift-first-cohort-graduation",

      titleAr: "تخرج الدفعة الأولى من برنامج SHIFT",

      titleEn: "SHIFT — First Cohort Graduation",

      date: "2026-02-01",

      status: "Confirmed"

    }

  ]

};



export const mockAdminStats: AdminStats = {

  totalVisitors: "4,520",

  activeMembers: "128",

  upcomingEvents: "0",

  publishedPosts: "12",

  recentActivities: [

    {

      textAr: "تم نشر فعالية 'هاكاثون المناخ 2026'",

      textEn: "New event 'Climate Hackathon 2026' published",

      timeAr: "منذ ساعتين",

      timeEn: "2 hours ago"

    },

    {

      textAr: "تم استقبال رسالة من منى المهيري",

      textEn: "Contact message received from Mona Al Mehairi",

      timeAr: "منذ 5 ساعات",

      timeEn: "5 hours ago"

    },

    {

      textAr: "تم تحديث مقالة تقرير التقدم",

      textEn: "Progress report blog post updated",

      timeAr: "أمس",

      timeEn: "Yesterday"

    }

  ]

};



export const mockAdminAnalytics: AnalyticItem[] = [

  { labelAr: "زيارات هذا الشهر", labelEn: "Visits This Month", value: "1,240", icon: "BarChart3" },

  { labelAr: "مستخدمون جدد", labelEn: "New Users", value: "85", icon: "Users" },

  { labelAr: "معدل الاحتفاظ", labelEn: "Retention Rate", value: "87%", icon: "TrendingUp" },

  { labelAr: "تذاكر محجوزة", labelEn: "Tickets Booked", value: "320", icon: "Ticket" }

];



export const mockAdminMessages: ContactMessage[] = [

  {

    id: "1",

    sender: "منى المهيري",

    email: "mona.m@example.com",

    subject: "طلب شراكة جامعية",

    message: "نود التعاون مع كلايمتيفاي لتنظيم ورشة عمل مناخية رقمية بجامعة زايد ومناقشة تفاصيل الحضور وتذاكر الطلاب.",

    date: "2026-07-19",

    isRead: false

  },

  {

    id: "2",

    sender: "سعيد النيادي",

    email: "saeed.n@example.com",

    subject: "استفسار عن التطوع",

    message: "كيف يمكنني تقديم طلب لإنشاء شابتر محلي لكلايمتيفاي في العين؟ هل هناك شروط معينة للشباب؟",

    date: "2026-07-18",

    isRead: true

  }

];





export const mockAdminUsers: AdminUser[] = [

  {

    id: "user-1",

    email: "abdalla.shamsi@example.com",

    name: "عبد الله الشامسي",

    city: "دبي",

    bio: "ناشط مناخي مهتم بالرقمنة والحلول الصديقة للبيئة وسفير SHIFT.",

    role: "member",

    createdAt: "2026-01-15T10:30:00Z",

    ecoPoints: 240,

    virtualTrees: 3,

    status: "active"

  },

  {

    id: "user-2",

    email: "mariam.kaabi@nis.edu.ae",

    name: "مريم الكعبي",

    city: "أبوظبي",

    bio: "منسقة الاستدامة وممثلة برنامج المدارس الخضراء في مدارس الإمارات الوطنية.",

    role: "school",

    createdAt: "2026-02-04T14:20:00Z",

    ecoPoints: 410,

    virtualTrees: 5,

    status: "active"

  },

  {

    id: "user-3",

    email: "sultan.m@greenventures.ae",

    name: "سلطان المنصوري",

    city: "دبي",

    bio: "مستثمر وممثل صندوق الابتكار الأخضر لدعم الشركات الناشئة ورواد الأعمال.",

    role: "partner",

    createdAt: "2026-02-18T09:15:00Z",

    ecoPoints: 180,

    virtualTrees: 2,

    status: "active"

  },

  {

    id: "user-4",

    email: "fatima.hashemi@example.com",

    name: "فاطمة الهاشمي",

    city: "الشارقة",

    bio: "طالبة هندسة بيئية وباحثة في تقنيات احتجاز الكربون والتكيف المناخي.",

    role: "member",

    createdAt: "2026-03-01T11:00:00Z",

    ecoPoints: 350,

    virtualTrees: 4,

    status: "active"

  },

  {

    id: "user-5",

    email: "ahmed.mehairi@hct.ac.ae",

    name: "د. أحمد المهيري",

    city: "العين",

    bio: "أستاذ العلوم البيئية في كليات التقنية العليا ومسؤول معسكرات الابتكار.",

    role: "school",

    createdAt: "2026-03-12T08:45:00Z",

    ecoPoints: 520,

    virtualTrees: 7,

    status: "active"

  },

  {

    id: "user-6",

    email: "maha.suwaidi@wavemakers.org",

    name: "مها السويدي",

    city: "دبي",

    bio: "مديرة الشراكات في Wavemakers United للعمل الشبابي والأمن المائي.",

    role: "partner",

    createdAt: "2026-03-25T16:10:00Z",

    ecoPoints: 600,

    virtualTrees: 8,

    status: "active"

  },

  {

    id: "user-7",

    email: "omar.marzouqi@example.com",

    name: "عمر المرزوقي",

    city: "رأس الخيمة",

    bio: "مشارك في هاكاثون الصدى الأخضر الإقليمي وهاوي برمجة تطبيقات بيئية.",

    role: "member",

    createdAt: "2026-04-02T13:30:00Z",

    ecoPoints: 90,

    virtualTrees: 1,

    status: "active"

  },

  {

    id: "user-8",

    email: "admin@climatify.org",

    name: "مي معوض (مسؤول النظام)",

    city: "دبي",

    bio: "المؤسس المشارك والرئيس التنفيذي لكلايمتيفاي — إدارة شاملة للمنصة.",

    role: "admin",

    createdAt: "2025-10-01T00:00:00Z",

    ecoPoints: 1200,

    virtualTrees: 15,

    status: "active"

  }

];



export const mockAdminEventRegistrations: AdminEventRegistration[] = [

  {

    id: "reg-1",

    eventId: "shift-first-cohort-graduation",

    eventTitleEn: "SHIFT — First Cohort Graduation & Exhibition",

    eventTitleAr: "حفل تخرج ومعرض الدفعة الأولى من برنامج SHIFT",

    userId: "user-1",

    name: "عبد الله الشامسي",

    email: "abdalla.shamsi@example.com",

    phone: "+971 50 123 4567",

    ticketCode: "CLM-EV-8491",

    status: "Confirmed",

    createdAt: "2026-01-20T11:15:00Z"

  },

  {

    id: "reg-2",

    eventId: "ice-2024-hackathon-event",

    eventTitleEn: "ICE 2024 International Climate Hackathon",

    eventTitleAr: "هاكاثون ICE 2024 الدولي للاستدامة والابتكار المناخي",

    userId: "user-4",

    name: "فاطمة الهاشمي",

    email: "fatima.hashemi@example.com",

    phone: "+971 55 987 6543",

    ticketCode: "CLM-EV-2094",

    status: "Attended",

    createdAt: "2026-02-10T14:40:00Z"

  },

  {

    id: "reg-3",

    eventId: "shift-first-cohort-graduation",

    eventTitleEn: "SHIFT — First Cohort Graduation & Exhibition",

    eventTitleAr: "حفل تخرج ومعرض الدفعة الأولى من برنامج SHIFT",

    userId: "user-2",

    name: "مريم الكعبي",

    email: "mariam.kaabi@nis.edu.ae",

    phone: "+971 52 345 6789",

    ticketCode: "CLM-EV-5512",

    status: "Attended",

    createdAt: "2026-01-22T09:20:00Z"

  },

  {

    id: "reg-4",

    eventId: "sustainability-week",

    eventTitleEn: "Sustainability Week",

    eventTitleAr: "أسبوع الاستدامة الإقليمي",

    userId: "user-7",

    name: "عمر المرزوقي",

    email: "omar.marzouqi@example.com",

    phone: "+971 56 789 0123",

    ticketCode: "CLM-EV-9901",

    status: "Confirmed",

    createdAt: "2026-04-05T16:00:00Z"

  },

  {

    id: "reg-5",

    eventId: "ice-2024-hackathon-event",

    eventTitleEn: "ICE 2024 International Climate Hackathon",

    eventTitleAr: "هاكاثون ICE 2024 الدولي للاستدامة والابتكار المناخي",

    userId: null,

    name: "نور القاسمي",

    email: "nour.qassimi@example.com",

    phone: "+971 50 888 2341",

    ticketCode: "CLM-EV-3142",

    status: "Cancelled",

    createdAt: "2026-02-12T10:10:00Z"

  }

];



export const mockAdminFormSubmissions: AdminFormSubmission[] = [

  {

    id: "sub-1",

    kind: "opportunity_application",

    email: "sara.d@example.com",

    payload: {

      opportunityTitle: "SHIFT Green Tech Internship 2026",

      name: "سارة الدوسري",

      phone: "+971 50 555 1234",

      cvUrl: "https://example.com/cv/sara-d.pdf",

      coverLetter: "شغوفة بمجال التقنيات المناخية وتطوير الحلول البرمجية للاستدامة في الإمارات."

    },

    createdAt: "2026-03-28T12:00:00Z"

  },

  {

    id: "sub-2",

    kind: "school_portal",

    email: "admin@dubainationalschool.ae",

    payload: {

      schoolName: "مدرسة دبي الوطنية — البرشاء",

      representativeName: "أ. طارق خليل",

      studentCount: "850",

      notes: "نود دمج مساقات الرقمنة المناخية وألعاب AgriClash في النشاط اللاصفي للمرحلة الثانوية."

    },

    createdAt: "2026-03-15T09:30:00Z"

  },

  {

    id: "sub-3",

    kind: "partner_portal",

    email: "partnerships@emiratesgreen.ae",

    payload: {

      organizationName: "مؤسسة الإمارات للاستثمار الأخضر",

      representativeName: "حصة الفلاسي",

      partnershipType: "Green Venture Sponsorship",

      notes: "رعاية مشاريع هاكاثون الصدى الأخضر وتوفير منح تدريبية للفائزين."

    },

    createdAt: "2026-03-10T15:45:00Z"

  },

  {

    id: "sub-4",

    kind: "meeting",

    email: "director@youthclimatehub.ae",

    payload: {

      organizer: "مجلس شباب المناخ",

      topic: "تنسيق الفعاليات المشتركة لعام 2026 ومواءمة مناهج التعليم المناخي",

      preferredDate: "2026-04-15"

    },

    createdAt: "2026-04-01T10:00:00Z"

  },

  {

    id: "sub-5",

    kind: "newsletter",

    email: "climate.advocate@greenuae.ae",

    payload: {

      source: "Website Footer"

    },

    createdAt: "2026-04-04T18:22:00Z"

  }

];





export { type HandsOnTrack, mockHandsOnTracks, mockInternQuotes } from "../data/staticContent.ts";

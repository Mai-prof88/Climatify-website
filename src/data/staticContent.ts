import type { InternQuote } from "../types";

export interface HandsOnTrack {
  id: string;
  titleEn: string;
  titleAr: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  tagsEn: string[];
  tagsAr: string[];
}

export const mockHandsOnTracks: HandsOnTrack[] = [
  {
    id: "self-watering",
    titleEn: "Self-Watering Planting Workshop",
    titleAr: "ورشة الزراعة ذاتية الري (Self-Watering Planting)",
    taglineEn: "Playful Learning & Sustainable Pot Crafting",
    taglineAr: "تعلم مرح وتصميم أواني زراعية ذاتية الري",
    descriptionEn:
      "A fun, interactive, and hands-on experience that brings sustainability to life in a vibrant, creative, and engaging atmosphere.\n\nParticipants enjoy a unique planting journey as they design and create their own self-watering plant pots, discovering the importance of water conservation and sustainable living through playful learning and creativity.\n\nDesigned for schools, universities, corporate events, brands, and luxury experiences, the workshop blends environmental education with entertainment, social interaction, and memorable moments.\n\nPerfect for team-building activities, brand activations, luxury events, sustainability campaigns, and exclusive guest experiences, with customizable themes and setups to match each occasion.",
    descriptionAr:
      "تجربة تفاعلية وعملية ممتعة تجسد الاستدامة في أجواء نابضة بالإبداع والتفاعل الحي.\n\nيخوض المشاركون رحلة زراعية فريدة لتصميم وتصنيع أواني نباتية ذاتية الري بأيديهم، مستكشفين أهمية ترشيد استهلاك المياه والعيش المستدام عبر التعلم القائم على التجربة والمرح.\n\nصُممت الورشة للمدارس، الجامعات، فعاليات الشركات، وتجارب العلامات التجارية الفاخرة، لتدمج بين التعليم البيئي والترفيه الهادف وبناء الذكريات التفاعلية.\n\nمثالية لأنشطة بناء فرق العمل، حملات الاستدامة، والفعاليات الحصرية مع إمكانية التخصيص الكامل حسب هوية وطبيعة كل مناسبة.",
    image: "/workshops/self-watering.webp",
    tagsEn: ["Water Conservation", "Zero Waste", "Team Building", "Customizable Setup"],
    tagsAr: ["ترشيد المياه", "صفر نفايات", "بناء الفرق", "تخصيص كامل"],
  },
  {
    id: "trash-to-art",
    titleEn: "Trash to Art Workshop",
    titleAr: "ورشة تحويل المخلفات إلى فن (Trash to Art)",
    taglineEn: "Creative Upcycling & Circular Expression",
    taglineAr: "إعادة التدوير الإبداعي والتعبير البيئي المعاصر",
    descriptionEn:
      "A transformative hands-on experience that reimagines everyday discards—cardboard, packaging, dried florals, and recyclable offcuts—into captivating contemporary artworks.\n\nParticipants discover the philosophy of the circular economy and creative reuse through tactile collage, mixed-media sculpture, and purposeful artistic crafting.\n\nDesigned for corporate teams, universities, sustainable brands, and artistic showcases, demonstrating that waste is never the end of a lifecycle, but an inspiring canvas for sustainable innovation.",
    descriptionAr:
      "تجربة تطبيقية ملهمة تعيد ابتكار المخلفات اليومية — من الورق المقوى، والكرتون، والزهور المجففة، وبقايا الخامات — وتحويلها إلى لوحات فنية عصرية ومجسمات راقية تجسد مبادئ الاقتصاد الدائري وإعادة التدوير الفني المبتكر.\n\nيكتشف المشاركون قيمة الموارد المهدرة من خلال فنون الكولاج والتصميم الإبداعي، محولين النفايات إلى رسائل بيئية ملهمة وأعمال ديكورية فخمة.\n\nمثالية لفعاليات الشركات والمدارس وتجارب العلامات الفاخرة التي تبحث عن أثر مستدام وتجربة حسية بصرية لا تُنسى.",
    image: "/workshops/trash-to-art.webp",
    tagsEn: ["Upcycled Art", "Circular Economy", "Creative Reuse", "Eco Luxury"],
    tagsAr: ["فن التدوير", "اقتصاد دائري", "إعادة استخدام", "فخامة مستدامة"],
  },
  {
    id: "mental-health",
    titleEn: "Mental Health & Nature Workshop",
    titleAr: "ورشة الصحة النفسية والارتباط بالطبيعة (Mental Health & Nature)",
    taglineEn: "Biophilic Wellness, Mindfulness & Eco-Resilience",
    taglineAr: "العافية البيوفيلية، التأمل الذهني، والارتباط الفطري بالطبيعة",
    descriptionEn:
      "An immersive sensory sanctuary linking mental well-being with living ecosystems.\n\nGrounded in biophilic design and eco-psychology, participants experience guided mindfulness, sensory plant interactions, and restorative botanical exercises designed to alleviate eco-anxiety, recharge mental clarity, and deepen human-nature harmony.\n\nDesigned for organizational wellness days, student retreats, and mindful leadership sessions cultivating calm, focus, and environmental empathy.",
    descriptionAr:
      "ملاذ حسي واستشفائي غامر يربط بين الصحة الذهنية والمنظومات البيئية الحية.\n\nمستندة إلى مبادئ التصميم البيوفيلي وعلم النفس البيئي، تقدم الورشة جلسات تأمل موجهة وتواصلاً حسياً مع النباتات لتقليل التوتر والقلق المناخي واستعادة التوازن الذهني والنشاط الإيجابي.\n\nصُممت لبرامج العافية المؤسسية، والخلوات الجامعية، ومبادرات القيادة الواعية التي تعزز الرفاه النفسي والتعاطف البيئي المستدام.",
    image: "/workshops/mental-health.webp",
    tagsEn: ["Biophilic Wellness", "Eco-Mindfulness", "Stress Reduction", "Inner Harmony"],
    tagsAr: ["عافية بيوفيلية", "تأمل بيئي", "تخفيف التوتر", "تناغم داخلي"],
  },
  {
    id: "die-beauty",
    titleEn: "Die Beauty | Sustainable Beauty & Heritage Experience",
    titleAr: "ورشة Die Beauty — تجربة الجمال المستدام والتراث الأصيل",
    taglineEn: "Upcycled Skincare • Cultural Heritage • Sustainable Beauty",
    taglineAr: "عناية طبيعية بالبشرة • أصالة تراثية • جمال بيئي مستدام",
    descriptionEn:
      "An elegant, fun, and immersive workshop that brings together sustainability, self-care, creativity, and cultural heritage in a vibrant and relaxing atmosphere.\n\nParticipants enjoy a unique hands-on experience creating personalized skincare and beauty products using safely upcycled natural ingredients and sustainable materials, while exploring traditional beauty rituals and heritage-inspired practices.\n\nDesigned for universities, schools, corporate events, beauty and wellness brands, luxury experiences, and cultural festivals, the workshop combines interactive learning, creativity, relaxation, and meaningful social engagement.\n\nDie Beauty also offers a distinctive experiential marketing opportunity for skincare, cosmetics, dermocosmetics, and wellness brands through product launches, promotional campaigns, brand activations, exhibitions, and exclusive customer engagement events.\n\nEach workshop can be customized to reflect the event’s theme, cultural identity, or brand vision, creating a memorable atmosphere that encourages self-expression, environmental awareness, and well-being.\n\nMore than a workshop — a beautiful experience where sustainability meets self-care, culture, and creativity.",
    descriptionAr:
      "ورشة عمل وتجربة تفاعلية راقية تجمع بين مفاهيم الاستدامة، والعناية الذاتية، والإبداع، والتراث الثقافي الأصيل في أجواء مفعمة بالحيوية والاسترخاء.\n\nيخوض المشاركون تجربة تطبيقية استثنائية لصناعة منتجات عناية شخصية وتجميلية طبيعية مخصصة باستخدام مكونات طبيعية مُعاد تدويرها بأمان وخامات مستدامة، مع استكشاف طقوس الجمال التراثية والممارسات التقليدية العريقة.\n\nصُممت الورشة للجامعات، المدارس، فعاليات الشركات، علامات العناية والجمال والعافية، والتجارب الفاخرة والمهرجانات الثقافية؛ لتدمج بين التعلم التفاعلي، الابتكار الإبداعي، الاسترخاء، والتواصل الاجتماعي الهادف.\n\nتمنح Die Beauty أيضاً فرصة تسويقية وتجريبية متميزة لعلامات التجميل ومستحضرات العناية بالبشرة من خلال إطلاق المنتجات، الحملات الترويجية، المعارض، وتجارب العملاء الحصرية.\n\nيمكن تخصيص كل ورشة لتعكس هوية الفعالية أو الرؤية الثقافية للمؤسسة، صانعةً أجواء استثنائية تعزز التعبير عن الذات والوعي البيئي والرفاهية.\n\nأكثر من مجرد ورشة — إنها تجربة آسرة حيث تلتقي الاستدامة بالعناية بالذات والثقافة والإبداع.",
    image: "/workshops/die-beauty.webp",
    tagsEn: ["Upcycled Ingredients", "DIY Skincare", "Cultural Heritage", "Sustainable Beauty"],
    tagsAr: ["مكونات طبيعية معاد تدويرها", "عناية ذاتية بالبشرة", "لمسة تراثية أصيلة", "جمال بيئي مستدام"],
  },
];

export const mockInternQuotes: InternQuote[] = [
  {
    id: "mohamed-khedr",
    nameEn: "Mohamed Khedr",
    nameAr: "محمد خضر",
    committeeEn: "Design & Web Committee",
    committeeAr: "لجنة التصميم والويب",
    committeeKey: "design-web",
    quoteEn:
      "Creativity is more than what we create. It's the impact we leave behind. Climatify was where my ideas found their wings.",
    quoteAr:
      "الإبداع يتجاوز ما نصنعه، إنه الأثر الحقيقي الذي نتركه وراءنا. كلايمتيفاي كانت المساحة التي حلقت فيها أفكاري.",
    image: "/Interns_quotes/mohamed-khedr.webp",
    thumbImage: "/Interns_quotes/mohamed-khedr-thumb.webp",
  },
  {
    id: "youssef-ashraf",
    nameEn: "Youssef Ashraf",
    nameAr: "يوسف أشرف",
    committeeEn: "Web Committee",
    committeeAr: "لجنة الويب والبرمجة",
    committeeKey: "web",
    quoteEn:
      "It was a fantastic opportunity to apply my technical skills to a new website using modern tools and technologies. What made the experience truly rewarding was the amazing team spirit.",
    quoteAr:
      "كانت فرصة رائعة لتطبيق مهاراتي التقنية على موقع جديد باستخدام أحدث الأدوات. وما جعل التجربة مجزية حقاً هو روح الفريق المتميزة.",
    image: "/Interns_quotes/youssef-ashraf.webp",
    thumbImage: "/Interns_quotes/youssef-ashraf-thumb.webp",
  },
  {
    id: "hamdy-mohamed",
    nameEn: "Hamdy Mohamed",
    nameAr: "حمدي محمد",
    committeeEn: "Design Committee",
    committeeAr: "لجنة التصميم والجرافيك",
    committeeKey: "design",
    quoteEn:
      "It was my first time working in a real graphic design team, designing beyond my personal work. I truly learned so much on the professional level.",
    quoteAr:
      "كانت أول مرة اشتغل في تيم جرافيك حقيقي وأول مرة أعمل ديزاينز لشغل غير شغلي الشخصي، واستفدت كتير جداً على المستوى العملي.",
    image: "/Interns_quotes/hamdy-mohamed.webp",
    thumbImage: "/Interns_quotes/hamdy-mohamed-thumb.webp",
  },
  {
    id: "ahmed-mohamed",
    nameEn: "Ahmed Mohamed",
    nameAr: "أحمد محمد",
    committeeEn: "Video Editing Committee",
    committeeAr: "لجنة المونتاج والفيديو",
    committeeKey: "video",
    quoteEn:
      "My experience with Climatify has been truly valuable, not only in terms of specialized training but also in video editing, through the projects I worked on and the contributions I was fortunate to be part of.",
    quoteAr:
      "تجربتي مع كلايمتيفاي كانت قيّمة للغاية، ليس فقط بالتدريب المتخصص بل أيضاً في المونتاج وصناعة الفيديو للمشاريع التي تشرفت بالمشاركة فيها.",
    image: "/Interns_quotes/ahmed-mohamed.webp",
    thumbImage: "/Interns_quotes/ahmed-mohamed-thumb.webp",
  },
  {
    id: "ashrakat-eldamaty",
    nameEn: "Ashrakat Eldamaty",
    nameAr: "أشرقت الدماطي",
    committeeEn: "Marketing Committee",
    committeeAr: "لجنة التسويق",
    committeeKey: "marketing",
    quoteEn:
      "Some experiences are unfamiliar by nature, but creative confidence turns the unknown into an opportunity to grow. Climatify was exactly that a journey of fresh challenges, discoveries and continuous learning.",
    quoteAr:
      "الثقة الإبداعية تحول المجهول إلى فرصة للنمو والتطور. كلايمتيفاي كانت رحلة ملهمة من التحديات والاكتشافات والتعلم المستمر.",
    image: "/Interns_quotes/ashrakat-eldamaty.webp",
    thumbImage: "/Interns_quotes/ashrakat-eldamaty-thumb.webp",
  },
  {
    id: "alsaeyd-abdalhlim",
    nameEn: "Alsaeyd Abdalhlim",
    nameAr: "السيد عبد الحليم",
    committeeEn: "Marketing Committee",
    committeeAr: "لجنة التسويق",
    committeeKey: "marketing",
    quoteEn:
      "My experience with Climatify has been a valuable journey of learning, collaboration, and personal growth.",
    quoteAr: "تجربتي مع كلايمتيفاي كانت رحلة ثرية من التعلم والتعاون والنمو الشخصي والمهني.",
    image: "/Interns_quotes/alsaeyd-abdalhlim.webp",
    thumbImage: "/Interns_quotes/alsaeyd-abdalhlim-thumb.webp",
  },
  {
    id: "mohamed-lotfy",
    nameEn: "Mohamed Lotfy",
    nameAr: "محمد لطفي",
    committeeEn: "Marketing Committee",
    committeeAr: "لجنة التسويق",
    committeeKey: "marketing",
    quoteEn:
      "Working with Climatify was a next-generation experience rooted in deep sustainability and dynamic innovation.",
    quoteAr:
      "العمل مع كلايمتيفاي تجربة استثنائية لجيل المستقبل، متجذرة في الاستدامة العميقة والابتكار الديناميكي.",
    image: "/Interns_quotes/mohamed-lotfy.webp",
    thumbImage: "/Interns_quotes/mohamed-lotfy-thumb.webp",
  },
  {
    id: "maryam-rady",
    nameEn: "Maryam Rady",
    nameAr: "مريم راضي",
    committeeEn: "Public Relations Committee",
    committeeAr: "لجنة العلاقات العامة",
    committeeKey: "pr",
    quoteEn: "Relationships not just reach but rich.",
    quoteAr: "بناء العلاقات ليس فقط اتساعاً بل ثراءً وعمقاً حقيقياً.",
    image: "/Interns_quotes/maryam-rady.webp",
    thumbImage: "/Interns_quotes/maryam-rady-thumb.webp",
  },
];

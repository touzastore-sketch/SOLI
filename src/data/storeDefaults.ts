import { StoreBranch, StoreCategoryItem, StoreSettings } from '../types';
import babydollImg from '../assets/images/red_babydoll_model_1787126559624.jpg';
import coupleGameImg from '../assets/images/couple_game_box_1787127729340.jpg';
import spaPedicureImg from '../assets/images/luxury_spa_pedicure_1787127712907.jpg';

export const DEFAULT_BRANCHES: StoreBranch[] = [
  {
    id: 'branch-portsaid',
    nameAr: 'فرع بورسعيد (حي الزهور)',
    nameEn: 'Port Said Branch (Al Zohoor)',
    cityAr: 'بورسعيد',
    cityEn: 'Port Said',
    addressAr: 'برج الشروق، أمام مستشفى النصر ومدرسة 6 أكتوبر، بجوار محل أبو يمن للموبايلات.',
    addressEn: 'Al-Shorouk Tower, in front of Al-Nasr Hospital & 6th of October School, next to Abu Yemen Mobiles.',
    phone: '+20 109 546 1883',
    whatsapp: '201095461883',
    isActive: true
  },
  {
    id: 'branch-cairo',
    nameAr: 'فرع القاهرة (المقطم)',
    nameEn: 'Cairo Branch (El Mokattam)',
    cityAr: 'القاهرة',
    cityEn: 'Cairo',
    addressAr: 'شارع 9، ميدان المفارق، بجوار مستشفى المقطم التخصصي.',
    addressEn: 'Street 9, Al-Mafarq Square, next to El Mokattam Specialized Hospital.',
    phone: '+20 100 210 8272',
    whatsapp: '201002108272',
    isActive: true
  },
  {
    id: 'branch-alex',
    nameAr: 'فرع الإسكندرية (رشدي)',
    nameEn: 'Alexandria Branch (Roushdy)',
    cityAr: 'الإسكندرية',
    cityEn: 'Alexandria',
    addressAr: 'رشدي على الترام، برج جراند رشدي، أمام مدرسة رشدي الإعدادية بنين.',
    addressEn: 'Roushdy on Tram, Grand Roushdy Tower, in front of Roushdy Preparatory School for Boys.',
    phone: '+20 109 546 1883',
    whatsapp: '201095461883',
    isActive: true
  }
];

export const DEFAULT_CATEGORIES: StoreCategoryItem[] = [
  {
    id: 'lingerie',
    nameAr: 'بيبي دول ولانجري',
    nameEn: 'Babydolls & Silk',
    subtitleAr: 'حرير ساتان ودانتيل فرنسي',
    subtitleEn: 'French Lace & Silk',
    descAr: 'تصاميم حريرية ودانتيل راقية تجمع بين الراحة والأنوثة الخالصة',
    descEn: 'Refined silk and delicate lace designs embodying pure elegance',
    image: babydollImg,
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Bestseller'
  },
  {
    id: 'couple_games',
    nameAr: 'ألعاب زوجية',
    nameEn: 'Couple Games',
    subtitleAr: 'بوكسات رومانسية وشغف',
    subtitleEn: 'Romance & Passion Box',
    descAr: 'تجارب تفاعلية رومانسية وألعاب لتعزيز التقارب وكسر الروتين',
    descEn: 'Romantic intimate experiences and games to rekindle passion',
    image: coupleGameImg,
    badgeAr: 'تجارب حصرية',
    badgeEn: 'Couple Romance'
  },
  {
    id: 'care_pedicure',
    nameAr: 'باديكير',
    nameEn: 'Pedicure Essentials',
    subtitleAr: 'أجهزة ومبارد كريستال',
    subtitleEn: 'Crystal & Electric Care',
    descAr: 'أجهزة ومبارد باديكير احترافية ومستحضرات تنعيم وتدليك للأقدام',
    descEn: 'Professional pedicure tools, crystal files, and softening care',
    image: spaPedicureImg,
    badgeAr: 'نعومة فورية',
    badgeEn: 'Velvet Soft'
  },
  {
    id: 'men_enhancers',
    nameAr: 'محفزات رجالي',
    nameEn: "Men's Stimulants",
    subtitleAr: 'جل أداء وعسل ملكي',
    subtitleEn: 'Performance & Stamina',
    descAr: 'جل أداء وتأخير وعسل ملكي ومستحضرات طاقة طبيعية لتعزيز الثقة',
    descEn: 'Performance gels, VIP royal honey, and natural stamina boosters',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
    badgeAr: 'طاقة وثقة',
    badgeEn: 'Men Vitality'
  },
  {
    id: 'women_enhancers',
    nameAr: 'محفزات حريمي',
    nameEn: "Women's Stimulants",
    subtitleAr: 'قطرات وسيروم الإثارة',
    subtitleEn: 'Arousal Drops & Bliss',
    descAr: 'قطرات وسيرومات إثارة وشغف وزيوت تدليك دافئة لزيادة الإحساس',
    descEn: 'Arousal drops, sensation serums, and warming intimate oils',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    badgeAr: 'إثارة وشغف',
    badgeEn: 'Feminine Bliss'
  }
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeNameAr: 'روني ستور للملابس الراقية',
  storeNameEn: 'RONY STORE Luxury Boutique',
  primaryPhone: '+20 109 546 1883',
  whatsappOrder1: '201095461883',
  whatsappOrder2: '201002108272',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  telegramUrl: 'https://t.me',
  announcementTextAr: '✨ بيبي دول ولانجري سيلك • ألعاب زوجية • باديكير • محفزات رجالي وحريمي • تغليف سري 100%',
  announcementTextEn: '✨ Couture Babydolls & Silk • Couple Games • Pedicure • Men & Women Stimulants • 100% Discreet',
  announcementActive: true,
  standardShippingFee: 50,
  freeShippingThreshold: 1500,
  activePromoCode: 'RONY10',
  activeDiscountPercent: 10,
  discreetPackagingNoteAr: 'جميع الشحنات تُغلف في كرتون معتم تماماً بدون أي كتابة أو إشارة لمحتويات الطرد مع فواتير داخلية سرية 🔒',
  discreetPackagingNoteEn: 'All parcels are sealed in 100% plain neutral packaging with zero external branding or content indicators 🔒',
  adminPin: 'ronystore123',

  // Hero Section
  heroBadgeAr: 'كولكشن روني ستور للملابس الراقية الحصري',
  heroBadgeEn: 'RONY STORE EXCLUSIVE COLLECTION',
  heroTitleAr: 'الأناقة الحميمية والبيبي دول الملكي',
  heroTitleEn: 'Couture Babydolls & Intimate Allure',
  heroSubtitleAr: 'اكتشفي أرقى تشكيلة بيبي دول دانتيل، قمصان نوم سيلك، وألعاب رومانسية حصرية مع ضمان التغليف السري المعتم والدفع عند الاستلام.',
  heroSubtitleEn: 'Explore romantic sheer lace babydolls, pure silk robes, and private couple romance games with guaranteed discreet packaging and COD across Egypt.',
  heroBtn1TextAr: 'تسوقي كولكشن البيبي دول',
  heroBtn1TextEn: 'Explore Babydolls',
  heroBtn2TextAr: 'طلب واستفسار واتساب',
  heroBtn2TextEn: 'WhatsApp Order',

  // Brand Card
  brandCardBadgeAr: 'EST. CAIRO',
  brandCardBadgeEn: 'EST. CAIRO',
  brandCardSubAr: 'بوتيك الفخامة والخصوصية',
  brandCardSubEn: 'LUXURY INTIMATE BOUTIQUE',
  brandFeat1Ar: 'تغليف سري معتم 100% لباب المنزل',
  brandFeat1En: '100% Sealed Confidential Box',
  brandFeat2Ar: 'خامات دانتيل وسيلك ناعم وفاخر',
  brandFeat2En: 'Premium Silk & French Lace',
  brandFeat3Ar: 'شحن لجميع المحافظات ودفع عند الاستلام',
  brandFeat3En: 'All Egypt Delivery & COD',
  brandConciergeBtnAr: 'استشارة المقاسات الفورية',
  brandConciergeBtnEn: 'Instant Sizing Support',

  // Flash Special Offer Banner
  offerBadgeAr: 'عرض حصري لفترة محدودة',
  offerBadgeEn: 'Limited Offer',
  offerTagAr: 'هدية مميزة',
  offerTagEn: 'Special Gift',
  offerTitleAr: 'اطلبي أي قطعتين بيبي دول واحصلي على لعبة زوجية هدية مجانية!',
  offerTitleEn: 'Buy 2 Babydolls & Receive a Romantic Couple Game Free!',
  offerSubtitleAr: 'يسري العرض على جميع المحافظات مع شحن سري معتم ودفع عند الاستلام.',
  offerSubtitleEn: 'Valid for all orders with COD and sealed confidential packaging.',
  offerBtnTextAr: 'تفعيل العرض عبر واتساب',
  offerBtnTextEn: 'Claim Offer via WhatsApp',

  // 4 Trust Guarantees
  guarantee1TitleAr: 'تغليف سري ومحكم 100%',
  guarantee1DescAr: 'يتم شحن جميع الطلبات في صناديق كرتونية معتمة بدون أي إشارة للمحتوى أو اسم المتجر.',
  guarantee1TitleEn: '100% Discreet Packaging',
  guarantee1DescEn: 'All parcels are sealed in plain, unbranded boxes with total privacy.',

  guarantee2TitleAr: 'شحن سريع لجميع محافظات مصر',
  guarantee2DescAr: 'توصيل سريع خلال 24-48 ساعة للقاهرة والجيزة و2-3 أيام لباقي المحافظات.',
  guarantee2TitleEn: 'Delivery Across Egypt',
  guarantee2DescEn: 'Fast courier dispatch to Cairo, Giza, Alexandria and all governorates.',

  guarantee3TitleAr: 'دفع عند الاستلام وفودافون كاش',
  guarantee3DescAr: 'الدفع عند الاستلام (COD)، والمحافظ الإلكترونية، والبطاقات البنكية.',
  guarantee3TitleEn: 'Secure Payment & COD',
  guarantee3DescEn: 'Cash on Delivery, Credit Cards, and Egyptian Mobile Wallets.',

  guarantee4TitleAr: 'بيبي دول وحرير أصلي فاخر',
  guarantee4DescAr: 'أقمشة حريرية فرنسية ودانتيل فائق النعومة صُمم خصيصاً لراحتك التامة.',
  guarantee4TitleEn: 'Premium Crafted Fabrics',
  guarantee4DescEn: 'Delicate silk touches and certified hypoallergenic textiles.'
};

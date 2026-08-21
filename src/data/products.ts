import { Product } from '../types';

export const CATEGORIES_DATA = [
  {
    id: 'lingerie',
    nameAr: 'بيبي دول ولانجري',
    nameEn: 'Luxury Lingerie',
    descAr: 'تصاميم حريرية ودانتيل راقية تجمع بين الراحة والأنوثة الخالصة',
    descEn: 'Refined silk and delicate lace designs embodying pure elegance',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    count: 6,
  },
  {
    id: 'couple_games',
    nameAr: 'ألعاب زوجية',
    nameEn: 'Intimate Couple Games',
    descAr: 'تجارب تفاعلية رومانسية وألعاب لتعزيز التقارب وكسر الروتين',
    descEn: 'Romantic intimate experiences and games to rekindle passion',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop',
    count: 3,
  },
  {
    id: 'care_pedicure',
    nameAr: 'باديكير',
    nameEn: 'Pedicure Essentials',
    descAr: 'أجهزة ومبارد باديكير احترافية ومستحضرات تنعيم وتدليك للأقدام',
    descEn: 'Professional pedicure tools, crystal files, and softening care',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    count: 3,
  },
  {
    id: 'men_enhancers',
    nameAr: 'محفزات رجالي',
    nameEn: "Men's Stimulants",
    descAr: 'جل أداء وتأخير وعسل ملكي ومستحضرات طاقة طبيعية لتعزيز الثقة',
    descEn: 'Performance gels, VIP royal honey, and natural stamina boosters',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
    count: 3,
  },
  {
    id: 'women_enhancers',
    nameAr: 'محفزات حريمي',
    nameEn: "Women's Stimulants",
    descAr: 'قطرات وسيرومات إثارة وشغف وزيوت تدليك دافئة لزيادة الإحساس',
    descEn: 'Arousal drops, sensation serums, and warming intimate oils',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    count: 3,
  }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'rony-1',
    nameAr: 'طقم حرير إمبريال عنابي',
    nameEn: 'Imperial Burgundy Silk Set',
    subtitleAr: 'التشكيلة الملكية الحصرية',
    subtitleEn: 'Exclusive Royal Collection',
    category: 'lingerie',
    price: 899,
    originalPrice: 1099,
    rating: 4.9,
    reviewsCount: 128,
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'الأكثر طلباً',
    tagEn: 'Bestseller',
    fabricAr: '100% حرير طبيعي ملمس ناعم مع تفاصيل دانتيل فرنسي',
    fabricEn: '100% Mulberry Silk touch with delicate French lace accents',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'عنابي داكن', nameEn: 'Imperial Burgundy', hex: '#631523', value: 'burgundy' },
      { nameAr: 'أسود ملكي', nameEn: 'Noir Black', hex: '#161616', value: 'black' },
      { nameAr: 'عاجي دافئ', nameEn: 'Warm Ivory', hex: '#EBE5D8', value: 'ivory' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    descriptionAr: 'طقم لانجري ملكي مصنوع من أقمشة الحرير الفاخرة التي تنساب بنعومة استثنائية على البشرة. يتميز بقصة انسيابية مدروسة مع أشرطة دانتيل دقيقة تضفي لمسة من الأنوثة والرقي. مثالي للمناسبات الخاصة واللحظات التي لا تُنسى.',
    descriptionEn: 'An opulent royal intimate set tailored from exquisite silk that cascades effortlessly across the skin. Highlighted by delicate French scalloped lace trims and adjustable gilded hardware.',
    specsAr: [
      'حزام خصر مرن ومبطن لراحة فائقة طوال الارتداء',
      'أشرطة كتف قابلة للتعديل بحلقات مطلية بلون ذهبي ناعم',
      'دانتيل ناعم مضاد للحساسية ولا يسبب أي حكة',
      'خياطة يدوية مزدوجة للمتانة والفخامة'
    ],
    specsEn: [
      'Ultra-soft elasticated band for effortless comfort',
      'Adjustable shoulder straps with refined brushed-gold hardware',
      'Hypoallergenic soft lace overlay',
      'Handcrafted reinforced stitching'
    ],
    careGuideAr: [
      'يُفضل الغسيل اليدوي بالماء البارد وشامبو الأقمشة الحريرية',
      'تجنب العصر الشديد أو التجفيف الآلي بالحرارة',
      'يُجفف في الظل مفروداً على منشفة جافة',
      'الكي بحرارة منخفضة جداً من الجهة الداخلية'
    ],
    careGuideEn: [
      'Hand wash in cold water with delicate silk wash',
      'Do not tumble dry or wring aggressively',
      'Dry flat in shade on a clean towel',
      'Iron on lowest silk setting inside out'
    ]
  },
  {
    id: 'rony-2',
    nameAr: 'صندوق الألعاب الزوجية الملكي',
    nameEn: 'The Royal Intimate Box',
    subtitleAr: 'تجربة رومانسية متكاملة',
    subtitleEn: 'Complete Romantic Journey',
    category: 'couple_games',
    price: 1250,
    originalPrice: 1500,
    rating: 5.0,
    reviewsCount: 84,
    isNew: false,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'تجربة حصرية',
    tagEn: 'Exclusive Experience',
    fabricAr: 'صندوق خشبي فاخر مغطى بالجلد مع ملحقات مخملية',
    fabricEn: 'Luxury embossed leather-bound keepsake box with velvet interior',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'أسود مع ذهبي', nameEn: 'Noir Gold', hex: '#1C1917', value: 'noir_gold' },
      { nameAr: 'وردي مخملي', nameEn: 'Velvet Rose', hex: '#88304E', value: 'rose' }
    ],
    sizes: ['حجم موحد (Standard)'],
    descriptionAr: 'صندوق ألعاب حميمية تم تصميمه بعناية فائقة للأزواج الراغبين في تجديد الشغف وتعميق الروابط العاطفية. يحتوي على 120 بطاقة أسئلة وتحديات رومانسية، مع نرد ذهبي مخصص وشمعة مساج طبيعية وقناع عيون حريري فاخر.',
    descriptionEn: 'An intensely curated romantic game suite designed for couples looking to deepen intimacy, spark playful curiosity, and create unforgettable sensual moments.',
    specsAr: [
      '120 بطاقة لعب بتصميم أنيق ومقاومة للماء',
      'شمعة تدليك طبيعية بزيت الصويا وفيتامين E',
      'قناع عين حريري من الساتان الفاخر',
      'كتيب إرشادي سري ومقترحات للأمسيات الخاصة'
    ],
    specsEn: [
      '120 premium embossed, moisture-resistant intimacy cards',
      'Soy wax sensual massage candle infused with Vitamin E',
      'Silk blackout eye mask',
      'Discreet couples romantic guide'
    ],
    careGuideAr: [
      'يُحفظ الصندوق في مكان جاف وبعيد عن أشعة الشمس المباشرة',
      'تُمسح البطاقات بقطعة قماش ناعمة وجافة عند الحاجة'
    ],
    careGuideEn: [
      'Store in a cool, dry place away from heat',
      'Wipe cards gently with a dry microfiber cloth'
    ]
  },
  {
    id: 'rony-3',
    nameAr: 'براليت الدانتيل الأسود نوير',
    nameEn: 'Noir Lace Bralette & Panty',
    subtitleAr: 'أناقة فرنسية كلاسيكية',
    subtitleEn: 'French Vintage Elegance',
    category: 'lingerie',
    price: 749,
    originalPrice: 890,
    rating: 4.8,
    reviewsCount: 96,
    isNew: true,
    isBestSeller: false,
    isSale: false,
    inStock: true,
    tagAr: 'وصل حديثاً',
    tagEn: 'New In',
    fabricAr: 'دانتيل فرنسي ناعم وتول مطاطي فاخر',
    fabricEn: 'French scalloped Chantilly lace with soft stretch mesh',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'أسود فحمي', nameEn: 'Noir Black', hex: '#111111', value: 'noir' },
      { nameAr: 'أخضر زمردي', nameEn: 'Emerald Green', hex: '#0F382C', value: 'emerald' },
      { nameAr: 'أبيض لؤلؤي', nameEn: 'Pearl White', hex: '#F4F4F2', value: 'pearl' }
    ],
    sizes: ['S', 'M', 'L'],
    descriptionAr: 'براليت دانتيل أسود بتفاصيل مستوحاة من الأزياء الباريسية الراقية. تصميم خفيف بدون أسلاك لتوفير الراحة القصوى مع إبراز القوام بشكل طبيعي وجذاب.',
    descriptionEn: 'A delicate wire-free bralette and matching panty crafted from floral French lace, providing supreme everyday comfort with a dramatic sultry silhouette.',
    specsAr: [
      'تصميم خالي من الأسلاك المعدنية المزعجة',
      'بطانة داخلية ناعمة من القطن العضوي',
      'إغلاق خلفي قابل للتعديل بثلاث درجات',
      'أشرطة كتف مزدوجة بتصميم أنيق'
    ],
    specsEn: [
      'Wire-free comfortable plunge design',
      '100% organic breathable cotton gusset & cup lining',
      'Triple-position hook and eye closure',
      'Dainty dual shoulder strap detailing'
    ],
    careGuideAr: [
      'يُغسل في كيس الغسيل الشبكي المخصص للملابس الحساسة',
      'غسيل بماء بارد بدرجة حرارة لا تتجاوز 30 مئوية'
    ],
    careGuideEn: [
      'Machine wash gentle in lingerie mesh bag',
      'Wash at 30°C max, air dry only'
    ]
  },
  {
    id: 'rony-4',
    nameAr: 'روب ساتان فاخر بياقة حريرية',
    nameEn: 'Silk Touch Satin Robe - Midnight',
    subtitleAr: 'راحة واسترخاء ملكي',
    subtitleEn: 'Imperial Lounging Luxury',
    category: 'lingerie',
    price: 1150,
    originalPrice: 1350,
    rating: 4.9,
    reviewsCount: 62,
    isNew: false,
    isBestSeller: true,
    isSale: false,
    inStock: true,
    tagAr: 'التشكيلة المسائية',
    tagEn: 'Night Edit',
    fabricAr: 'ساتان حريري عالي الكثافة مع حزام خصر عريض',
    fabricEn: 'High-density heavy satin silk with wide obi sash',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'كحلي ليلي', nameEn: 'Midnight Navy', hex: '#111D36', value: 'navy' },
      { nameAr: 'عنابي داكن', nameEn: 'Dark Burgundy', hex: '#631523', value: 'burgundy' },
      { nameAr: 'شامبين ذهبي', nameEn: 'Golden Champagne', hex: '#D6C0A4', value: 'champagne' }
    ],
    sizes: ['S/M', 'L/XL'],
    descriptionAr: 'روب نوم طويل بقماش الساتان الحريري الفاخر ذو اللمعة الخافتة الجذابة. يتميز بأكمام واسعة على طراز الكيمونو وحزام خصر عريض يضمن ثباتاً مثالياً ولمسة من الفخامة الأسطورية.',
    descriptionEn: 'Full-length luxury satin kimono robe featuring a weighted drape, dramatic wide bell sleeves, and a matching waist tie.',
    specsAr: [
      'طول يصل حتى منتصف الساق لمظهر محتشم وجذاب',
      'رباط داخلي سري لمنع الانزلاق',
      'جيوب جانبية خفية وعملية',
      'قماش معالج ضد التجعد والبهتان'
    ],
    specsEn: [
      'Mid-calf dramatic silhouette',
      'Internal modesty tie prevents slipping',
      'Concealed side seam pockets',
      'Anti-static and wrinkle-resistant finish'
    ],
    careGuideAr: [
      'يُفضل الغسيل الجاف أو اليدوي البارد',
      'لا يُستخدم المبيض إطلاقاً'
    ],
    careGuideEn: [
      'Dry clean or gentle hand wash recommended',
      'Never bleach, steam on low'
    ]
  },
  {
    id: 'rony-5',
    nameAr: 'مجموعة العناية والباديكير الماسية',
    nameEn: 'Diamond Spa Pedicure & Velvet Foot Care Kit',
    subtitleAr: 'عناية صالونات التجميل في منزلك',
    subtitleEn: 'Salon-Grade Home Indulgence',
    category: 'care_pedicure',
    price: 590,
    originalPrice: 750,
    rating: 4.8,
    reviewsCount: 142,
    isNew: false,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'عرض خاص',
    tagEn: 'Special Offer',
    fabricAr: 'فولاذ جراحي مقاوم للصدأ مع زيوت طبيعية 100%',
    fabricEn: 'Surgical stainless steel tools with 100% organic botanical spa oils',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'فضي ووردي', nameEn: 'Silver Rose', hex: '#C0C0C0', value: 'silver' },
      { nameAr: 'ذهبي وردي', nameEn: 'Rose Gold', hex: '#B76E79', value: 'rosegold' }
    ],
    sizes: ['مجموعة شاملة (Full Kit)'],
    descriptionAr: 'مجموعة متكاملة للعناية الفائقة بالقدمين واليدين والأظافر. تتضمن مبرد نانو زجاجي كريستالي، مقشر حبيبات السكر وزبدة الشيا، مقصات جلد دقيقة، وسيروم ترطيب عميق بزيت شجرة الشاي واللافندر.',
    descriptionEn: 'The ultimate professional at-home pedicure sanctuary set. Includes a crystal nano glass foot file, deep nourishing shea foot butter, cuticle nippers, and lavender calming soak.',
    specsAr: [
      'مبرد نانو كريستال بتقنية دقيقة لإزالة الجلد الميت دون ألم',
      'كريم ترطيب مركز بزبدة الشيا واليوريا 10%',
      'أدوات من الستانلس ستيل الطبي المقاوم للصدأ والتآكل',
      'حقيبة سفر جلدية أنيقة لحفظ الأدوات'
    ],
    specsEn: [
      'Painless Nano Glass crystal buffing plate',
      'Intensive 10% Urea & Shea moisture barrier balm',
      'Medical-grade rustproof surgical steel implements',
      'Supple vegan leather travel case'
    ],
    careGuideAr: [
      'تُعقم الأدوات بالكحول الطبي بعد كل استخدام وتُجفف جيداً',
      'تُحفظ المستحضرات في مكان جاف بدرجة حرارة الغرفة'
    ],
    careGuideEn: [
      'Sanitize metal implements with alcohol spray after each use',
      'Keep balms in ambient temperature away from heat'
    ]
  },
  {
    id: 'rony-6',
    nameAr: 'طقم لانجري شفاف برباط كورسيه',
    nameEn: 'Ethereal Sheer Corset Lingerie Set',
    subtitleAr: 'تفاصيل منحوتة بجرأة',
    subtitleEn: 'Sculpted Dramatic Silhouette',
    category: 'lingerie',
    price: 920,
    originalPrice: 1100,
    rating: 4.7,
    reviewsCount: 47,
    isNew: true,
    isBestSeller: false,
    isSale: false,
    inStock: true,
    tagAr: 'وصل حديثاً',
    tagEn: 'New Season',
    fabricAr: 'شيفون حريري شفاف مع أربطة ساتان قابلة للشد',
    fabricEn: 'Sheer gossamer chiffon with corset tie back',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'عاجي فاتح', nameEn: 'Warm Ivory', hex: '#F5F2EB', value: 'ivory' },
      { nameAr: 'أسود نوير', nameEn: 'Noir Black', hex: '#181818', value: 'black' },
      { nameAr: 'أحمر قرمزي', nameEn: 'Crimson Red', hex: '#9B2226', value: 'crimson' }
    ],
    sizes: ['S', 'M', 'L'],
    descriptionAr: 'طقم كورسيه شفاف رقيق مزود بأربطة ساتان خلفية قابلة للتعديل لنحت القوام بلمسة ناعمة. يجمع بين الجرأة والأنوثة الطاغية مع تفاصيل تطريز ناعمة للغاية.',
    descriptionEn: 'A breathable sheer corset bralette and string set with adjustable satin lacing. Balances ethereal translucent fabric with structured romantic boning.',
    specsAr: [
      'دعامات مرنة وناعمة تحدد القوام دون ضغط مزعج',
      'رباط خلفي بنمط كورسيه قابل للتضييق والتوسيع',
      'قماش شفاف مضاد للتمزق فائق النعومة',
      'يشمل القطعتين العلوية والسفلية'
    ],
    specsEn: [
      'Flexible comfort-flex boning',
      'Lace-up corset back for customized fit',
      'Tear-resistant gossamer micro-mesh',
      'Two-piece complete matching set'
    ],
    careGuideAr: [
      'غسيل يدوي منفصل بالماء البارد فقط',
      'عدم استخدام المكواة البخارية مباشرة على الشيفون'
    ],
    careGuideEn: [
      'Hand wash separately in cold water',
      'Do not apply direct hot iron on sheer fabric'
    ]
  },
  {
    id: 'rony-7',
    nameAr: 'مجموعة ألعاب الحب والرومانسية الليلية',
    nameEn: 'Midnight Romance Couple Card Game',
    subtitleAr: 'لحظات استكشاف وأسئلة عميقة',
    subtitleEn: 'Intimate Questions & Sensual Dares',
    category: 'couple_games',
    price: 380,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 110,
    isNew: false,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'الأكثر مبيعاً',
    tagEn: 'Bestseller',
    fabricAr: 'بطاقات مخملية بتغليف فاخر مضاد للماء',
    fabricEn: 'Velvet-touch gold-foiled waterproof cardstock',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'أسود مع أحمر عنابي', nameEn: 'Noir Burgundy', hex: '#4A1521', value: 'noir_burgundy' }
    ],
    sizes: ['150 بطاقة'],
    descriptionAr: 'لعبة بطاقات تفاعلية مصممة لإشعال الحوار وكسر الروتين بين الزوجين من خلال 3 مستويات متدرجة: الحديث والتقارب، الذكريات والأحلام، والتحديات الرومانسية الجريئة.',
    descriptionEn: '150 thought-provoking conversation starters, romantic trivia, and playful dares designed to ignite deep passion and meaningful intimacy.',
    specsAr: [
      '3 مستويات تدرج ممتعة (تقارب، حوار، شغف)',
      'تصميم أنيق وسهل الحمل في السفر والعطلات',
      'تغليف سري لا يوضح المحتوى من الخارج'
    ],
    specsEn: [
      '3 progressive intimacy levels',
      'Travel-friendly luxury gold foil case',
      'Completely neutral external packaging'
    ],
    careGuideAr: [
      'تُحفظ البطاقات في علبتها الخاصة للحفاظ عليها'
    ],
    careGuideEn: [
      'Store cards in their magnetic clasp box'
    ]
  },
  {
    id: 'rony-8',
    nameAr: 'شموع مساج عضوية بالعطور الشرقية',
    nameEn: 'Warm Sensual Botanical Massage Candle',
    subtitleAr: 'زيت دافئ للاسترخاء والتدليك',
    subtitleEn: 'Melt-to-Warm Natural Body Oil',
    category: 'care_pedicure',
    price: 420,
    originalPrice: 500,
    rating: 4.9,
    reviewsCount: 78,
    isNew: false,
    isBestSeller: false,
    isSale: false,
    inStock: true,
    tagAr: 'طبيعي 100%',
    tagEn: '100% Organic',
    fabricAr: 'شمع الصويا العضوي وزبدة الكاكاو وزيت الورد والعود',
    fabricEn: 'Pure soy wax, cocoa butter, infused with amber and Damask rose',
    images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'عنبر وورد شرقي', nameEn: 'Amber & Rose', hex: '#C49A6C', value: 'amber' },
      { nameAr: 'فانيلا وخشب الصندل', nameEn: 'Vanilla Sandalwood', hex: '#E0CCA7', value: 'vanilla' }
    ],
    sizes: ['200g'],
    descriptionAr: 'شمعة تدليك فاخرة تذوب عند إشعالها لتتحول إلى زيت تدليك دافئ وغني بالفيتامينات يغذي البشرة ويمنح شعوراً عميقاً بالاسترخاء والرومانسية.',
    descriptionEn: 'Luxury soy-based body candle that melts into a warm, deeply moisturizing massage oil packed with skin-loving vitamins and enticing oriental aromas.',
    specsAr: [
      'درجة انصهار منخفضة آمنة تماماً على البشرة ولا تسبب أي حروق',
      'مزيج من زبدة الشيا وزيت الجوجوبا وفيتامين E',
      'فتيل قطني عضوي خالي من الرصاص والدخان المزعج',
      'وعاء بورسلين أنيق مزود بفوهة صب سهلة'
    ],
    specsEn: [
      'Low melt point for safe, warm direct skin application',
      'Infused with raw Shea butter and cold-pressed Jojoba oil',
      '100% lead-free organic cotton wick',
      'Ceramic pour-spout container'
    ],
    careGuideAr: [
      'تُشعل لمدة 10-15 دقيقة حتى يذوب الزيت ثم تُطفأ وتُسكب كمية مناسبة على اليدين',
      'تُقص حافة الفتيل قبل كل استخدام'
    ],
    careGuideEn: [
      'Light for 10-15 mins, extinguish flame before pouring',
      'Trim wick to 5mm before every use'
    ]
  },
  {
    id: 'rony-9',
    nameAr: 'طقم باديكير كهربائي احترافي مقاوم للماء',
    nameEn: 'Pro Luxe Waterproof Electric Pedicure Tool',
    subtitleAr: 'نعومة حريرية للأقدام بضغطة زر',
    subtitleEn: 'Effortless Velvet Smooth Feet',
    category: 'care_pedicure',
    price: 680,
    originalPrice: 850,
    rating: 4.8,
    reviewsCount: 92,
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'الأعلى تقييماً',
    tagEn: 'Top Rated',
    fabricAr: 'هيكل مقاوم للماء IPX7 مع رؤوس كوارتز قابلة للتبديل',
    fabricEn: 'IPX7 Waterproof body with 3 Diamond Quartz roller heads',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'وردي ذهبي ملكي', nameEn: 'Rose Gold', hex: '#B76E79', value: 'rosegold' },
      { nameAr: 'أبيض لؤلؤي', nameEn: 'Pearl White', hex: '#FAFAFA', value: 'white' }
    ],
    sizes: ['جهاز كامل + 3 رؤوس'],
    descriptionAr: 'جهاز الباديكير الكهربائي المطور برؤوس الكوارتز الكريستالية لإزالة الخشونة وتشقق القدمين بلطف وبسرعتين متباينتين. بطارية قابلة للشحن عبر USB تدوم حتى 120 دقيقة.',
    descriptionEn: 'Rechargeable electric callus remover with dual speeds and diamond quartz rollers for baby-soft smooth heels in minutes.',
    specsAr: [
      'شاشة رقمية LED توضح نسبة شحن البطارية والسرعة',
      'مقاوم للماء بالكامل بمعيار IPX7 للاستخدام أثناء الاستحمام',
      '3 رؤوس مختلفة الكثافة (ناعم، متوسط، خشن)',
      'شحن سريع عبر Type-C مع قفل أمان تلقائي'
    ],
    specsEn: [
      'Smart LED power and speed indicator display',
      'IPX7 certified waterproof for wet/dry use',
      '3 interchangeable quartz crystal rollers',
      'Fast USB-C charging with safety auto-shutoff'
    ],
    careGuideAr: [
      'تُغسل الرؤوس بالماء الجاري بعد كل استخدام وتُترك لتجف'
    ],
    careGuideEn: [
      'Rinse quartz rollers under warm water and air dry'
    ]
  },
  {
    id: 'rony-10',
    nameAr: 'قميص نوم حريري بلون العاج',
    nameEn: 'Warm Ivory Pure Silk Chemise',
    subtitleAr: 'بساطة راقية ولمسة نعومة',
    subtitleEn: 'Minimalist Silk Luxury',
    category: 'lingerie',
    price: 850,
    originalPrice: 1000,
    rating: 4.9,
    reviewsCount: 53,
    isNew: false,
    isBestSeller: false,
    isSale: false,
    inStock: true,
    tagAr: 'حرير خالص',
    tagEn: 'Pure Silk',
    fabricAr: 'حرير توت خام نقي 100%',
    fabricEn: '100% 22 Momme Pure Mulberry Silk',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'عاجي دافئ', nameEn: 'Warm Ivory', hex: '#EBE5D8', value: 'ivory' },
      { nameAr: 'وردي بودري', nameEn: 'Blush Rose', hex: '#DEB3AD', value: 'blush' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    descriptionAr: 'قميص نوم كلاسيكي بقصة بيضاوية تنسدل بنعومة فائقة. يمنحك تجربة نوم مريحة وإطلالة رومانسية هادئة تعكس الفخامة الصامتة.',
    descriptionEn: 'Bias-cut pure silk chemise with delicate adjustable straps and a fluid silhouette that caresses the contours of the body.',
    specsAr: [
      'حرير نقي بملمس بارد ومنعش للبشرة الحساسة',
      'ياقة مفتوحة ناعمة على شكل حرف V',
      'خياطة فرنسية نقية بدون حواف بارزة'
    ],
    specsEn: [
      'Hypoallergenic thermoregulating pure silk',
      'Subtle flattering V-neckline',
      'Clean French seams throughout'
    ],
    careGuideAr: [
      'غسيل يدوي بمياه باردة مع استخدام منعم الحرير'
    ],
    careGuideEn: [
      'Hand wash cold with pH-neutral detergent'
    ]
  },
  {
    id: 'rony-11',
    nameAr: 'جل الطاقة والتأخير للرجال (Royal Performance Gel)',
    nameEn: 'Royal Men Endurance & Delay Performance Gel',
    subtitleAr: 'تركيبة ألمانية مركزة لتعزيز التحكم والشغف',
    subtitleEn: 'German Herbal Formula for Peak Stamina',
    category: 'men_enhancers',
    price: 590,
    originalPrice: 750,
    rating: 4.9,
    reviewsCount: 142,
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'الأعلى تقييماً للرجال',
    tagEn: 'Top Men Performance',
    fabricAr: 'مستخلصات القرنفل الطبيعي، الجينسنغ، وزيت اللوز العضوي',
    fabricEn: 'Natural Clove, Panax Ginseng & Organic Almond Oil',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'عبوة VIP الذهبية (50ml)', nameEn: 'VIP Gold 50ml', hex: '#D4AF37', value: 'gold' }
    ],
    sizes: ['عبوة 50 ml'],
    descriptionAr: 'جل موضعي رجالي فاخر بتركيبة مركزة وسريعة الامتصاص لتعزيز الحيوية، تمديد أوقات العلاقة الحميمة، وزيادة التحكم والراحة المشتركة. طبيعي 100% بدون أي تخدير مزعج أو آثار جانبية.',
    descriptionEn: 'A high-grade herbal performance gel designed to enhance stamina, control, and sensation with 100% natural extracts.',
    specsAr: [
      'مفعول سريع وفعال خلال 15 دقيقة من الاستخدام',
      'خالٍ تماماً من الليدوكايين والمواد المخدرة المزعجة',
      'سهل الغسيل بالماء ولا يترك أي أثر دهني',
      'تغليف وشحن سري تماماً 100%'
    ],
    specsEn: [
      'Fast-acting within 15 minutes of gentle application',
      'Free from harsh numbing agents or lidocaine',
      'Water-based, non-staining, and easy to wash',
      '100% discreet packaging guarantee'
    ],
    careGuideAr: [
      'يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة'
    ],
    careGuideEn: [
      'Store in a cool, dry place away from direct sunlight'
    ]
  },
  {
    id: 'rony-12',
    nameAr: 'عسل الطاقة الملكي VIP المركز للرجال',
    nameEn: 'VIP Royal Honey Energy & Vitality Sachets',
    subtitleAr: 'خلاصة الغذاء الملكي والجذور النادرة',
    subtitleEn: 'Pure Royal Jelly & Rare Maca Extracts',
    category: 'men_enhancers',
    price: 780,
    originalPrice: 990,
    rating: 4.9,
    reviewsCount: 188,
    isNew: true,
    isBestSeller: true,
    isSale: false,
    inStock: true,
    tagAr: 'طاقة مضاعفة',
    tagEn: 'Maximum Power',
    fabricAr: 'عسل جبلي نقي 100% مع غذاء ملكات النحل وعشبة الماكا وجذور التونغكات',
    fabricEn: '100% Pure Mountain Honey, Royal Jelly, Maca & Tongkat Ali',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'صندوق 12 ظرف VIP', nameEn: 'Box of 12 Sachets', hex: '#EAB308', value: 'gold' }
    ],
    sizes: ['بوكس 12 ظرف (15g)'],
    descriptionAr: 'أظرف عسل الطاقة الملكي الماليزي الفاخر المدعم بخلاصة غذاء ملكات النحل وجذور الماكا الطبيعية. يمد الجسم بطاقة ونشاط متواصلين ويعزز الأداء الرجالي بثقة تامة.',
    descriptionEn: 'Premium grade VIP Royal Honey sachets enriched with royal jelly, rainforest herbs, and Maca extract for prolonged stamina and vigor.',
    specsAr: [
      'تركيبة عسل خام طبيعية 100% بدون أي إضافات كيميائية',
      'ظرف واحد يمنح طاقة تدوم حتى 48 ساعة',
      'مذاق لذيذ وغني سهل التناول مباشرة أو مع كوب ماء دافئ',
      'تغليف فاخر محكم ومناسب للسفر والإهداء'
    ],
    specsEn: [
      '100% raw mountain honey with herbal adaptogens',
      'One sachet provides sustained energy for up to 48 hours',
      'Delicious taste, easy to take directly or with warm water',
      'Sealed discreet luxury boxing'
    ],
    careGuideAr: [
      'يُفضل تناول ظرف واحد قبل النشاط بساعة مع شرب كمية وافرة من الماء'
    ],
    careGuideEn: [
      'Take one sachet 1 hour before activity with plenty of water'
    ]
  },
  {
    id: 'rony-13',
    nameAr: 'سيروم الإثارة والحساسية الأنثوية (Arousal & Sensation Serum)',
    nameEn: 'Luxury Intimate Arousal & Glow Serum for Women',
    subtitleAr: 'إحساس دافئ ومضاعفة فورية للاستجابة الأنثوية',
    subtitleEn: 'Instant Warming & Heightened Intimacy',
    category: 'women_enhancers',
    price: 620,
    originalPrice: 800,
    rating: 4.9,
    reviewsCount: 124,
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'الأكثر طلباً للسيدات',
    tagEn: 'Top Women Sensation',
    fabricAr: 'خلاصات النعناع البري، البابونج المهدئ، وحمض الهيالورونيك المرطب',
    fabricEn: 'Botanical Wild Mint, Chamomile & Hyaluronic Acid',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608248597359-0a6e033e0ba8?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'سيروم وردي لؤلؤي (30ml)', nameEn: 'Pearl Rose 30ml', hex: '#F472B6', value: 'pink' }
    ],
    sizes: ['عبوة قطارة 30 ml'],
    descriptionAr: 'سيروم حميمي استثنائي مخصص للسيدات يعمل على تحفيز الدورة الدموية الموضعية بلطف، مما يمنح شعوراً دافئاً ومثيراً ويزيد من الحساسية والاستجابة إلى أقصى حد خلال اللحظات الخاصة.',
    descriptionEn: 'An opulent sensation serum tailored for women to awaken intimate pleasure with a gentle warming, tingling sensation.',
    specsAr: [
      'تأثير نبضي دافئ يوقظ الحواس بلطف وفورية',
      'متوازن الحموضة pH لضمان أقصى درجات الأمان والراحة للأنثى',
      'آمن للاستخدام المتكرر وسهل الغسيل',
      'شحن معتم وسري يضمن الخصوصية التامة'
    ],
    specsEn: [
      'Delicate warming and tingling sensation for heightened arousal',
      'pH-balanced specifically for feminine wellness',
      'Safe, gentle, water-soluble, and hypoallergenic',
      '100% discreet packaging guarantee'
    ],
    careGuideAr: [
      'توضع قطرات بسيطة مع تدليك لطيف قبل اللحظات الخاصة'
    ],
    careGuideEn: [
      'Apply 2-3 drops with gentle circular massage before intimacy'
    ]
  },
  {
    id: 'rony-14',
    nameAr: 'قطرات الشغف والإثارة الأنثوية (Passion Drops)',
    nameEn: 'Aphrodite Passion & Libido Drops for Women',
    subtitleAr: 'قطرات سريعة الذوبان بنكهة التوت الطبيعي',
    subtitleEn: 'Water-Soluble Wild Berry Infused Drops',
    category: 'women_enhancers',
    price: 690,
    originalPrice: 890,
    rating: 4.8,
    reviewsCount: 96,
    isNew: true,
    isBestSeller: false,
    isSale: true,
    inStock: true,
    tagAr: 'شغف وتناغم',
    tagEn: 'Pure Passion',
    fabricAr: 'خلاصات التوت البري، زهرة العاطفة، وفيتامينات B المركبة',
    fabricEn: 'Wild Berry, Passionflower & Vitamin B Complex',
    images: [
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'عبوة قطرات كريستال (30ml)', nameEn: 'Crystal Dropper 30ml', hex: '#E11D48', value: 'red' }
    ],
    sizes: ['عبوة 30 ml'],
    descriptionAr: 'قطرات طبيعية سريعة الامتصاص تُضاف إلى أي مشروب أو عصير لتعزيز الرغبة والنشاط والراحة النفسية، مما يهيئ الأجواء لمشاعر دافئة وانسجام حميمي فائق.',
    descriptionEn: 'Natural water-soluble arousal drops infused with botanical passionflower and wild berry essence for elevated mood and desire.',
    specsAr: [
      'تُضاف 5-10 قطرات إلى أي عصير أو ماء بسهولة تامة',
      'مستخلصة من أعشاب وفيتامينات طبيعية 100% بدون أي سكريات صناعية',
      'تمنح استرخاءً نفسياً وشغفاً متجدداً',
      'تغليف سري ومحايد كلياً'
    ],
    specsEn: [
      'Simply add 5-10 drops into any beverage or water',
      '100% organic herbal formula with essential vitamins',
      'Promotes relaxed mood and intimate connection',
      'Completely neutral discreet shipping package'
    ],
    careGuideAr: [
      'تُحفظ في مكان بارد وتُرج العبوة جيداً قبل كل استخدام'
    ],
    careGuideEn: [
      'Store in a cool place and shake well before use'
    ]
  },
  {
    id: 'rony-15',
    nameAr: 'بيبي دول دانتيل رويال أسود (Royal Noir Babydoll)',
    nameEn: 'Royal Noir Sheer Lace Babydoll & G-String',
    subtitleAr: 'دانتيل فرنسي مطرز بقصة خصر ساحرة',
    subtitleEn: 'Scalloped French Lace & Satin Ribbons',
    category: 'lingerie',
    price: 820,
    originalPrice: 1050,
    rating: 4.9,
    reviewsCount: 164,
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'الأكثر طلباً',
    tagEn: 'Signature Bestseller',
    fabricAr: 'دانتيل فرنسي فائق النعومة مع خيوط مرنة وشيفون حريري شفاف',
    fabricEn: 'Ultra-Soft French Scalloped Lace with Silk Chiffon',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'أسود ملكي', nameEn: 'Noir Black', hex: '#111111', value: 'black' },
      { nameAr: 'أحمر قرمزي', nameEn: 'Crimson Red', hex: '#881337', value: 'red' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'Free Size'],
    descriptionAr: 'بيبي دول دانتيل ملكي أسود بتصميم شفاف فائق الإثارة والأنوثة، مع قصة صدر ناعمة وأشرطة قابلة للتعديل تنساب بسلاسة لإبراز جمال القوام.',
    descriptionEn: 'A breathtaking noir babydoll featuring intricate scalloped lace cups, adjustable cross-back satin straps, and a delicate sheer skirt.',
    specsAr: [
      'قصة صدر مثلثة مريحة مع حواف دانتيل مموجة ناعمة',
      'أشرطة كتف وظهر قابلة للتعديل بالكامل لتناسب مختلف المقاسات',
      'يأتي مع سترينغ دانتيل مطابق مجاناً ضمن الطقم',
      'تغليف شحن سري وفاخر في علبة معتمة'
    ],
    specsEn: [
      'Comfortable scalloped triangle cups with soft elastic underband',
      'Fully adjustable cross-back straps for tailored fit',
      'Includes matching delicate lace G-string',
      '100% confidential discreet luxury boxed packaging'
    ],
    careGuideAr: [
      'يُغسل يدوياً بماء فاتر بدون مبيضات ويُجفف في الظل'
    ],
    careGuideEn: [
      'Hand wash gently in lukewarm water and line dry in shade'
    ]
  },
  {
    id: 'rony-16',
    nameAr: 'صندوق الحب والأسرار الزوجي (Velvet Romance Box)',
    nameEn: 'Velvet Romance & Intimate Confessions Box',
    subtitleAr: '150 بطاقة تفاعلية ومهام رومانسية جريئة',
    subtitleEn: '150 Curated Romantic Truth & Action Cards',
    category: 'couple_games',
    price: 650,
    originalPrice: 850,
    rating: 5.0,
    reviewsCount: 210,
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'تجربة رومانسية حصرية',
    tagEn: 'Boutique Exclusive',
    fabricAr: 'كروت فاخرة مصقولة مع بوكس مخملي عنابي مطرز بختم ذهبي',
    fabricEn: 'Luxury Gloss-Laminated Cards in Velvet Box with Gold Foil',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'المخمل العنابي الفاخر', nameEn: 'Burgundy Velvet', hex: '#4C0519', value: 'burgundy' }
    ],
    sizes: ['بوكس متكامل VIP'],
    descriptionAr: 'لعبة رومانسية راقية تجمع بين الأسئلة الحميمية العميقة، التحديات الرومانسية الممتعة، وأجواء التقارب المتبادل. مصممة باللغة العربية بأسلوب راقٍ وممتع لكسر الروتين.',
    descriptionEn: 'An intimate couples game designed to ignite conversations, playful challenges, and deep emotional and physical bonding.',
    specsAr: [
      '150 بطاقة مقسمة إلى 3 مستويات: اعترافات، شغف، وأسرار خاصة',
      'نردان رومانيان بأيقونات مضيئة في الظلام',
      'دليل إرشادي لقضاء ليلة رومانسية استثنائية',
      'مناسبة للمتزوجين والمقبلين على الزواج'
    ],
    specsEn: [
      '150 curated cards spanning 3 levels: Confessions, Passion & Secrets',
      'Includes dual romantic dice with glow accents',
      'Inspiring guide for unforgettable romantic evenings',
      'Discreet and safe delivery'
    ],
    careGuideAr: [
      'تُحفظ البطاقات داخل العلبة المخملية في مكان جاف'
    ],
    careGuideEn: [
      'Store cards in the velvet box away from moisture'
    ]
  },
  {
    id: 'rony-17',
    nameAr: 'كريم تيتان جولد للنشاط والصلابة للرجال',
    nameEn: 'Titan Gold Stamina & Strength Cream for Men',
    subtitleAr: 'تركيبة أصلية بالجينسنغ والأعشاب الطبيعية',
    subtitleEn: 'Original Herbal Vigor & Firmness Formula',
    category: 'men_enhancers',
    price: 640,
    originalPrice: 850,
    rating: 4.9,
    reviewsCount: 135,
    isNew: false,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'قوة وثقة قصوى',
    tagEn: 'Maximum Confidence',
    fabricAr: 'مستخلصات الجينسنغ الكوري، الماكا السوداء، وخلاصة النعناع المنعشة',
    fabricEn: 'Korean Ginseng, Black Maca Extract & Refreshing Mint',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'عبوة تيتان جولد (50ml)', nameEn: 'Titan Gold 50ml', hex: '#CA8A04', value: 'gold' }
    ],
    sizes: ['عبوة 50 ml'],
    descriptionAr: 'كريم موضعي طبيعي مخصص للرجال لتحفيز التدفق الدموي الموضعي وتعزيز النشاط والصلابة ورفع كفاءة الأداء الحميمي مع كل استخدام، بامتصاص سريع وملمس غير لزج.',
    descriptionEn: 'A premium men stamina and vigor cream crafted with Korean ginseng and organic botanical extracts for enhanced performance.',
    specsAr: [
      'تركيبة عشبية آمنة 100% بدون أي مواد كيماوية ضارة',
      'يمتص سريعاً ولا يترك أي دهون أو روائح',
      'يعزز الطاقة والشعور بالثقة والراحة',
      'تغليف معتم وسري يضمن الخصوصية الكاملة'
    ],
    specsEn: [
      '100% botanical formula free from harsh chemicals',
      'Non-sticky, quick-absorbing velvety texture',
      'Boosts stamina and masculine vigor',
      'Shipped in neutral confidential packaging'
    ],
    careGuideAr: [
      'يُستخدم بتدليك خفيف قبل موعد اللقاء بنصف ساعة'
    ],
    careGuideEn: [
      'Apply with light massage 30 minutes prior to intimacy'
    ]
  },
  {
    id: 'rony-18',
    nameAr: 'جل ومزلق الإثارة العضوي للسيدات بالتوت البري',
    nameEn: 'Organic Wild Berry Feminine Sensation & Pleasure Gel',
    subtitleAr: 'ترطيب حريري مع مفعول نبضي دافئ ومثير',
    subtitleEn: 'Velvet Lubrication with Gentle Warming Waves',
    category: 'women_enhancers',
    price: 580,
    originalPrice: 750,
    rating: 4.9,
    reviewsCount: 152,
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    tagAr: 'نعومة وإثارة فائقة',
    tagEn: 'Silky Sensation',
    fabricAr: 'قاعدة مائية نقية 100% مع نكهة التوت البري ومستخلص الألوفيرا',
    fabricEn: '100% Water-Based with Wild Berry Essence & Organic Aloe',
    images: [
      'https://images.unsplash.com/photo-1608248597359-0a6e033e0ba8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop'
    ],
    colors: [
      { nameAr: 'توت بري وردي (100ml)', nameEn: 'Wild Berry 100ml', hex: '#DB2777', value: 'pink' }
    ],
    sizes: ['عبوة مضخة 100 ml'],
    descriptionAr: 'جل ومزلق حميمي فاخر للسيدات بقاعدة مائية طبيعية ومستخلص التوت البري المنعش. يمنح ترطيباً مخملياً طويل الأمد مع موجات دفء لطيفة تعزز الإثارة والراحة المشتركة.',
    descriptionEn: 'A luxury feminine water-based pleasure gel with wild berry aroma, delivering silky hydration and a delicate warming arousal effect.',
    specsAr: [
      'قاعدة مائية 100% فائقة النقاء وسهلة الشطف بالماء',
      'خالٍ تماماً من البارابين، الزيوت، والمواد المهيجة للبشرة',
      'متوافق مع جميع أنواع البشرة الحساسة',
      'تغليف وشحن سري ومغلق بإحكام'
    ],
    specsEn: [
      '100% pure water-based formulation, rinses cleanly',
      'Free from parabens, mineral oils, or synthetic dyes',
      'Hypoallergenic and pH balanced for intimate care',
      '100% discreet packaging guarantee'
    ],
    careGuideAr: [
      'يُحفظ في درجة حرارة الغرفة بعيداً عن الرطوبة المباشرة'
    ],
    careGuideEn: [
      'Store at room temperature away from direct humidity'
    ]
  }
];

export const INITIAL_ORDERS: any[] = [
  {
    id: 'ord-1048',
    orderNumber: 'RONY-1048',
    date: '2025-02-14',
    status: 'processing',
    subtotal: 1648,
    shippingFee: 0,
    discount: 164,
    total: 1484,
    paymentMethod: 'card',
    shippingMethod: 'express',
    isDiscreetPackaging: true,
    shippingAddress: {
      fullName: 'سارة عبد الرحمن',
      phone: '+20 101 234 5678',
      email: 'sarah.a@example.com',
      governorate: 'القاهرة',
      city: 'المعادي - دجلة',
      street: 'شارع 206 عمارة 14 الدور الثالث',
      landmark: 'بجوار نادي المعادي'
    },
    items: [
      {
        product: PRODUCTS_DATA[0],
        colorNameAr: 'عنابي داكن',
        colorNameEn: 'Imperial Burgundy',
        colorHex: '#631523',
        size: 'M',
        quantity: 1,
        price: 899
      },
      {
        product: PRODUCTS_DATA[2],
        colorNameAr: 'أسود فحمي',
        colorNameEn: 'Noir Black',
        colorHex: '#111111',
        size: 'M',
        quantity: 1,
        price: 749
      }
    ],
    trackingSteps: [
      {
        titleAr: 'تم استلام الطلب',
        titleEn: 'Order Placed',
        descriptionAr: 'تم تأكيد طلبك بنجاح وسداد الرسوم إلكترونياً',
        descriptionEn: 'Order confirmed and payment verified',
        date: '14 فبراير - 10:30 صباحاً',
        completed: true
      },
      {
        titleAr: 'قيد التجهيز والتغليف السري',
        titleEn: 'Discreet Packaging & Prep',
        descriptionAr: 'يتم تجهيز المنتجات في غلاف معتم ومغلق بأمان تام',
        descriptionEn: 'Items being carefully sealed in neutral discreet box',
        date: '14 فبراير - 02:15 مساءً',
        completed: true,
        current: true
      },
      {
        titleAr: 'تم التسليم لشركة الشحن',
        titleEn: 'Handed to Courier',
        descriptionAr: 'شحنتك في طريقها إلى فرع التوزيع بالقاهرة',
        descriptionEn: 'Parcel dispatched to Cairo delivery hub',
        date: 'متوقع 15 فبراير',
        completed: false
      },
      {
        titleAr: 'في الطريق للتسليم',
        titleEn: 'Out for Delivery',
        descriptionAr: 'المندوب في طريقه لعنوانك المسجل',
        descriptionEn: 'Driver is on the way to your address',
        date: 'متوقع 15 فبراير',
        completed: false
      },
      {
        titleAr: 'تم التسليم بنجاح',
        titleEn: 'Delivered',
        descriptionAr: 'تم تسليم الشحنة للعميل بنجاح',
        descriptionEn: 'Successfully delivered to customer',
        date: 'متوقع 15 فبراير',
        completed: false
      }
    ]
  },
  {
    id: 'ord-0982',
    orderNumber: 'RONY-0982',
    date: '2025-01-20',
    status: 'delivered',
    subtotal: 1250,
    shippingFee: 50,
    discount: 0,
    total: 1300,
    paymentMethod: 'cod',
    shippingMethod: 'standard',
    isDiscreetPackaging: true,
    shippingAddress: {
      fullName: 'سارة عبد الرحمن',
      phone: '+20 101 234 5678',
      email: 'sarah.a@example.com',
      governorate: 'الجيزة',
      city: 'الشيخ زايد',
      street: 'كمبوند الياسمين فيلا 22',
      landmark: 'بجوار النادي الأهلي'
    },
    items: [
      {
        product: PRODUCTS_DATA[1],
        colorNameAr: 'أسود مع ذهبي',
        colorNameEn: 'Noir Gold',
        colorHex: '#1C1917',
        size: 'Standard',
        quantity: 1,
        price: 1250
      }
    ],
    trackingSteps: [
      {
        titleAr: 'تم استلام الطلب',
        titleEn: 'Order Placed',
        descriptionAr: 'تم تأكيد الطلب',
        descriptionEn: 'Order confirmed',
        date: '20 يناير',
        completed: true
      },
      {
        titleAr: 'قيد التجهيز والتغليف السري',
        titleEn: 'Discreet Prep',
        descriptionAr: 'تم فحص وتغليف المنتجات بسلاسة وسرية',
        descriptionEn: 'Inspected and packed',
        date: '21 يناير',
        completed: true
      },
      {
        titleAr: 'تم التسليم لشركة الشحن',
        titleEn: 'Handed to Courier',
        descriptionAr: 'خرجت الشحنة من المستودع',
        descriptionEn: 'Dispatched from warehouse',
        date: '22 يناير',
        completed: true
      },
      {
        titleAr: 'في الطريق للتسليم',
        titleEn: 'Out for Delivery',
        descriptionAr: 'المندوب تواصل مع المستلم',
        descriptionEn: 'Courier contacted recipient',
        date: '23 يناير',
        completed: true
      },
      {
        titleAr: 'تم التسليم بنجاح',
        titleEn: 'Delivered',
        descriptionAr: 'تم استلام الطلب والدفع عند الاستلام',
        descriptionEn: 'Delivered & COD collected',
        date: '23 يناير',
        completed: true,
        current: true
      }
    ]
  }
];

export const EGYPT_GOVERNORATES = [
  'القاهرة (Cairo)',
  'الجيزة (Giza)',
  'الإسكندرية (Alexandria)',
  'الدقهلية (Mansoura)',
  'الشرقية (Sharqia)',
  'القليوبية (Qalyubia)',
  'الغربية (Tanta)',
  'المنوفية (Monufia)',
  'البحيرة (Beheira)',
  'بورسعيد (Port Said)',
  'الإسماعيلية (Ismailia)',
  'السويس (Suez)',
  'البحر الأحمر - الغردقة (Hurghada / Red Sea)',
  'جنوب سيناء - شرم الشيخ (Sharm El Sheikh)',
  'أسيوط (Asyut)',
  'سوهاج (Sohag)',
  'قنا (Qena)',
  'الأقصر (Luxor)',
  'أسوان (Aswan)'
];

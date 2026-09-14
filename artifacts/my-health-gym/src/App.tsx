import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  AlertCircle,
  Check,
  Clock3,
  Dumbbell,
  ExternalLink,
  MapPin,
  Menu,
  MessageCircle,
  MoveUpLeft,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Waves,
  X,
} from "lucide-react";

import cardioImage from "@assets/IMG_8991_1788483814732.jpeg";
import turfImage from "@assets/IMG_8992_1788483814732.jpeg";
import treadmillsImage from "@assets/IMG_8994_1788483814732.jpeg";
import exteriorImage from "@assets/IMG_8995_1788484733609.jpeg";
import poolImage from "@assets/IMG_8996_1788483814732.jpeg";
import weightsImage from "@assets/IMG_8997_1788483814732.jpeg";
import groupImage from "@assets/IMG_8998_1788483814732.jpeg";
import logoImage from "@assets/my-health-logo.png";
import {
  loadSiteConfig,
  SITE_CONFIG_UPDATED_EVENT,
  type SiteConfig,
} from "./siteConfig";

type Branch = {
  id: string;
  name: string;
  englishName: string;
  phone: string;
  whatsappPhone: string;
  hours: string;
  friday: string;
  mapUrl: string;
};

type Plan = {
  name: string;
  eyebrow: string;
  price: string;
  period: string;
  benefits: string[];
  featured?: boolean;
  badge?: string;
};

type PricingTab = "shifa" | "mansouraSaadah";

type PaymentMethod = "bankTransfer" | "installments" | "payAtGym";

type BookingBranchOption = {
  branch: Branch;
  whatsappPhone: string;
};

type BookingContext = {
  plan: Plan;
  branch: Branch;
  whatsappPhone: string;
  branchOptions: BookingBranchOption[];
};

type CampaignOffer = {
  label: string;
  tabLabel: string;
  whatsappPhone: string;
  contacts: string;
  plans: Plan[];
  alert?: string;
};

const defaultBranches: Branch[] = [
  {
    id: "mansoura",
    name: "فرع المنصورة",
    englishName: "Al Mansoura",
    phone: "0536903636",
    whatsappPhone: "0509284419",
    hours: "05:00 صباحاً – 03:00 صباحاً",
    friday: "الجمعة: 01:00 ظهراً – 12:00 منتصف الليل",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=My+Health+Gym+Al+Mansoura+Riyadh",
  },
  {
    id: "saadah",
    name: "فرع السعادة",
    englishName: "Al Saadah",
    phone: "0552632207",
    whatsappPhone: "0552632207",
    hours: "05:30 صباحاً – 03:00 صباحاً",
    friday: "الجمعة: 02:00 ظهراً – 12:00 منتصف الليل",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=My+Health+Gym+Al+Saadah+Riyadh",
  },
  {
    id: "shifa",
    name: "فرع الشفا",
    englishName: "Al Shifa",
    phone: "0552631967",
    whatsappPhone: "0534951220",
    hours: "06:00 صباحاً – 02:00 صباحاً",
    friday: "طوال أيام الأسبوع",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=My+Health+Gym+Al+Shifa+Riyadh",
  },
];

const defaultCampaignOffers: Record<PricingTab, CampaignOffer> = {
  shifa: {
    label: "فرع الشفاء (شارع الخليل بن أحمد)",
    tabLabel: "فرع الشفاء",
    whatsappPhone: "0534951220",
    contacts: "فرع الشفاء (هاتف: 0534951220 / 0552631967 / 0534909220)",
    plans: [
      {
        name: "96 يوم",
        eyebrow: "انطلاقة وطنية",
        price: "596",
        period: "عرض اليوم الوطني",
        benefits: ["دخول النادي", "المرافق الرياضية", "لفترة محدودة"],
      },
      {
        name: "3 شهور + 96 يوم مجاناً",
        eyebrow: "الاختيار المفضل",
        price: "796",
        period: "3 شهور + هدية وطنية",
        benefits: ["دخول النادي", "المسابح والمرافق", "96 يوم مجاناً"],
        featured: true,
        badge: "الأكثر طلباً",
      },
      {
        name: "6 شهور + 96 يوم مجاناً",
        eyebrow: "التزام أقوى",
        price: "996",
        period: "6 شهور + هدية وطنية",
        benefits: ["دخول النادي", "المسابح والمرافق", "96 يوم مجاناً"],
      },
      {
        name: "9 شهور + 96 يوم مجاناً",
        eyebrow: "خطوة طويلة المدى",
        price: "1096",
        period: "9 شهور + هدية وطنية",
        benefits: ["دخول النادي", "المسابح والمرافق", "96 يوم مجاناً"],
      },
    ],
  },
  mansouraSaadah: {
    label: "فرع المنصورة & فرع السعادة",
    tabLabel: "فرع المنصورة & فرع السعادة",
    whatsappPhone: "0509284419",
    contacts: "فرع المنصورة (0509284419) | فرع السعادة (0552632207)",
    alert: "العرض بدون تنازل وبدون إيقاف",
    plans: [
      {
        name: "ثلاثة شهور",
        eyebrow: "بداية قوية",
        price: "596",
        period: "عرض اليوم الوطني",
        benefits: ["دخول النادي", "المسابح والمرافق", "لفترة محدودة"],
      },
      {
        name: "سته شهور",
        eyebrow: "التزام يصنع الفرق",
        price: "696",
        period: "عرض اليوم الوطني",
        benefits: ["دخول النادي", "المسابح والمرافق", "لفترة محدودة"],
      },
      {
        name: "سنة + شهر",
        eyebrow: "القيمة الأفضل",
        price: "996",
        period: "12 شهراً + شهر هدية",
        benefits: ["وصول كامل طوال العام", "المسابح والمرافق", "شهر إضافي"],
        featured: true,
        badge: "القيمة الأفضل",
      },
    ],
  },
};

const pricingTabs: PricingTab[] = ["shifa", "mansouraSaadah"];

const paymentMethods: {
  id: PaymentMethod;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: "bankTransfer",
    label: "تحويل بنكي",
    shortLabel: "تحويل بنكي",
    description: "سيتم تزويدك بالآيبان ورفع الإيصال عبر الواتساب.",
  },
  {
    id: "installments",
    label: "تقسيط شهري (تابي / تمارا)",
    shortLabel: "تقسيط تابي وتمارا",
    description: "تُطبق شروط وأحكام مزودي خدمة التقسيط.",
  },
  {
    id: "payAtGym",
    label: "دفع عند النادي مباشرة",
    shortLabel: "دفع في مقر النادي",
    description:
      "الدفع عبر الشبكة أو نقداً في استقبال الفرع عند زيارتك الأولى.",
  },
];

const facilities = [
  {
    title: "كمال الأجسام والأوزان الحرة",
    description: "أجهزة حديد متطورة ودنابل تناسب جميع المستويات.",
    image: weightsImage,
    icon: Dumbbell,
    size: "large",
  },
  {
    title: "الكارديو واللياقة",
    description: "مسارات ركض ودراجات مزودة بشاشات تفاعلية.",
    image: cardioImage,
    icon: Trophy,
    size: "standard",
  },
  {
    title: "المسبح الأولمبي المغلق",
    description: "حوض دافئ ونظيف للتدريب والاسترخاء.",
    image: poolImage,
    icon: Waves,
    size: "standard",
  },
  {
    title: "الملاعب الخارجية",
    description: "مساحات عشب صناعي لممارسة رياضتك المفضلة.",
    image: turfImage,
    icon: Sparkles,
    size: "standard",
  },
  {
    title: "التمارين الجماعية وCrossFit",
    description: "حصص يومية لرفع اللياقة والمرونة.",
    image: groupImage,
    icon: Users,
    size: "wide",
  },
];

const reviews = [
  {
    name: "عناية خان",
    latinName: "Inayath Khan",
    role: "مراجع Google",
    quote:
      "من أفضل النوادي الرياضية وأنسبها سعراً لكل شخص يبحث عن بناء جسم مثالي. تتوفر فيه صالة ومسبح متكاملان ومميزان.",
  },
  {
    name: "أبو ضياء",
    latinName: "مرشد محلي",
    role: "مراجع Google",
    quote: "مساحات واسعة ومريحة جداً للتمرين مع وجود مسبح نظيف وممتاز.",
  },
  {
    name: "آبين إلياس",
    latinName: "Abin Alias",
    role: "مراجع Google",
    quote:
      "النادي رائع جداً، جميع الأجهزة والمعدات متوفرة والمسبح جميل. المكان نظيف وفريق العمل متعاون وداعم دائماً.",
  },
];

const navItems = [
  { label: "الفروع", id: "branches" },
  { label: "العروض", id: "offers" },
  { label: "المرافق", id: "facilities" },
  { label: "آراء المشتركين", id: "reviews" },
];

function whatsappUrl(phone: string, message: string) {
  const internationalPhone = `966${phone.replace(/^0/, "")}`;
  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
}

function phoneHref(phone: string) {
  return `tel:${phone}`;
}

function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x6f0))
    .replace(/\D/g, "");
}

function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() =>
    loadSiteConfig(),
  );
  const branches = siteConfig.branches;
  const campaignOffers = siteConfig.campaigns;
  const [activeBranchId, setActiveBranchId] = useState(branches[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pricingTab, setPricingTab] = useState<PricingTab>("shifa");
  const [bookingContext, setBookingContext] = useState<BookingContext | null>(
    null,
  );
  const [membershipForm, setMembershipForm] = useState({
    fullName: "",
    mobile: "",
    nationalId: "",
    age: "",
    paymentMethod: "" as PaymentMethod | "",
    termsAccepted: false,
  });
  const [membershipAttempted, setMembershipAttempted] = useState(false);
  const modalRef = useRef<HTMLElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const modalTriggerRef = useRef<HTMLElement | null>(null);
  const activeBranch =
    branches.find((branch) => branch.id === activeBranchId) ?? branches[0];
  const activeCampaign = campaignOffers[pricingTab];
  const campaignContactText =
    pricingTab === "shifa"
      ? `فرع الشفاء (واتساب: ${branches.find((branch) => branch.id === "shifa")?.whatsappPhone ?? activeCampaign.whatsappPhone})`
      : `فرع المنصورة (${branches.find((branch) => branch.id === "mansoura")?.whatsappPhone ?? "—"}) | فرع السعادة (${branches.find((branch) => branch.id === "saadah")?.whatsappPhone ?? "—"})`;
  const featuredCampaignPlan =
    activeCampaign.plans.find((plan) => plan.featured) ??
    activeCampaign.plans[0];
  const selectedPlan = bookingContext?.plan ?? null;
  const selectedBookingBranch = bookingContext?.branch ?? activeBranch;
  const bookingBranchOptions = bookingContext?.branchOptions ?? [];

  useEffect(() => {
    const refreshConfig = () => setSiteConfig(loadSiteConfig());
    window.addEventListener("storage", refreshConfig);
    window.addEventListener(SITE_CONFIG_UPDATED_EVENT, refreshConfig);

    return () => {
      window.removeEventListener("storage", refreshConfig);
      window.removeEventListener(SITE_CONFIG_UPDATED_EVENT, refreshConfig);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    document.body.classList.add("my-health-page");

    return () => document.body.classList.remove("my-health-page");
  }, []);

  useEffect(() => {
    if (!selectedPlan) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBookingContext(null);
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => modalCloseRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      modalTriggerRef.current?.focus();
      modalTriggerRef.current = null;
    };
  }, [selectedPlan]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const openMembershipModal = (
    plan: Plan,
    branchOption: BookingBranchOption,
    branchOptions: BookingBranchOption[] = [branchOption],
  ) => {
    modalTriggerRef.current = document.activeElement as HTMLElement | null;
    setBookingContext({
      plan,
      branch: branchOption.branch,
      whatsappPhone: branchOption.whatsappPhone,
      branchOptions,
    });
    setMembershipAttempted(false);
    setMembershipForm({
      fullName: "",
      mobile: "",
      nationalId: "",
      age: "",
      paymentMethod: "",
      termsAccepted: false,
    });
  };

  const closeMembershipModal = () => {
    setBookingContext(null);
    setMembershipAttempted(false);
  };

  const branchWhatsAppUrl = whatsappUrl(
    activeBranch.whatsappPhone,
    `السلام عليكم، أرغب في الاستفسار عن الاشتراك في ${activeBranch.name}.`,
  );

  const getCampaignBranchOptions = (
    campaignTab: PricingTab,
  ): BookingBranchOption[] => {
    if (campaignTab === "shifa") {
      const shifaBranch =
        branches.find((branch) => branch.id === "shifa") ?? branches[2];

      return [
        {
          branch: shifaBranch,
          whatsappPhone: shifaBranch.whatsappPhone,
        },
      ];
    }

    const mansouraBranch =
      branches.find((branch) => branch.id === "mansoura") ?? branches[0];
    const saadahBranch =
      branches.find((branch) => branch.id === "saadah") ?? branches[1];

    return [
      {
        branch: mansouraBranch,
        whatsappPhone: mansouraBranch.whatsappPhone,
      },
      {
        branch: saadahBranch,
        whatsappPhone: saadahBranch.whatsappPhone,
      },
    ];
  };

  const openCampaignModal = (plan: Plan) => {
    const branchOptions = getCampaignBranchOptions(pricingTab);
    const preferredBranch =
      branchOptions.find((option) => option.branch.id === activeBranch.id) ??
      branchOptions[0];

    openMembershipModal(plan, preferredBranch, branchOptions);
  };

  const openActiveBranchCampaignModal = () => {
    const activePricingTab: PricingTab =
      activeBranch.id === "shifa" ? "shifa" : "mansouraSaadah";
    const campaign = campaignOffers[activePricingTab];
    const plan =
      campaign.plans.find((campaignPlan) => campaignPlan.featured) ??
      campaign.plans[0];
    const branchOptions = getCampaignBranchOptions(activePricingTab);
    const preferredBranch =
      branchOptions.find((option) => option.branch.id === activeBranch.id) ??
      branchOptions[0];

    openMembershipModal(plan, preferredBranch, branchOptions);
  };

  const fullNameParts = membershipForm.fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const isFullNameValid =
    fullNameParts.length >= 3 &&
    fullNameParts.every((part) => /^[\p{L}]+(?:['’-][\p{L}]+)*$/u.test(part));
  const isMobileValid = /^05\d{8}$/.test(membershipForm.mobile);
  const isUnderage =
    membershipForm.age.trim() !== "" &&
    /^\d+$/.test(membershipForm.age) &&
    Number(membershipForm.age) < 17;
  const isMembershipFormValid =
    isFullNameValid &&
    isMobileValid &&
    /^\d{10}$/.test(membershipForm.nationalId) &&
    /^\d+$/.test(membershipForm.age) &&
    Number(membershipForm.age) >= 17 &&
    membershipForm.paymentMethod !== "" &&
    membershipForm.termsAccepted;

  const handleMembershipSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMembershipAttempted(true);

    if (!selectedPlan || !bookingContext || !isMembershipFormValid) {
      window.requestAnimationFrame(() => {
        modalRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

    const selectedPaymentMethod = paymentMethods.find(
      (method) => method.id === membershipForm.paymentMethod,
    );

    if (!selectedPaymentMethod) {
      return;
    }

    const message = `السلام عليكم ورحمة الله،
أرغب في تأكيد اشتراكي في مركز صحتي الرياضي:

📋 تفاصيل العرض:
- الباقة: ${selectedPlan.name} - ${selectedPlan.price} ريال
- الفرع: ${bookingContext.branch.name}

👤 بيانات المشترك:
- الاسم: ${membershipForm.fullName.trim()}
- الجوال: ${membershipForm.mobile}
- الهوية/الإقامة: ${membershipForm.nationalId}
- العمر: ${membershipForm.age}

💳 وسيلة الدفع المفضلة:
- ${selectedPaymentMethod.shortLabel}

✅ تمت الموافقة على الشروط، بانتظار إتمام الاشتراك.`;

    window.open(
      whatsappUrl(bookingContext.whatsappPhone, message),
      "_blank",
      "noopener,noreferrer",
    );
    closeMembershipModal();
  };

  return (
    <div dir="rtl" className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <button
            className="brand"
            onClick={() => scrollToSection("top")}
            aria-label="العودة إلى بداية الصفحة"
          >
            <img
              className="brand-logo"
              src={logoImage}
              alt="شعار مركز صحتي الرياضي"
            />
            <span className="brand-copy">
              <strong>مركز صحتي الرياضي</strong>
              <small>MY HEALTH</small>
            </span>
          </button>

          <nav className={`desktop-nav ${mobileMenuOpen ? "is-open" : ""}`}>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <a
              className="header-phone"
              href={phoneHref(activeBranch.phone)}
              aria-label={`اتصال سريع بـ ${activeBranch.name}`}
            >
              <Phone size={16} />
              <span>{activeBranch.phone}</span>
            </a>
            <button
              className="button button-lime button-small header-cta"
              onClick={openActiveBranchCampaignModal}
            >
              اشترك الآن
              <ArrowLeft size={17} />
            </button>
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div
            className="hero-image"
            style={{ backgroundImage: `url(${exteriorImage})` }}
            aria-hidden="true"
          />
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-content">
            <div className="hero-copy">
              <div className="eyebrow eyebrow-lime">
                <span className="eyebrow-dot" />
                الوجهة الرياضية الأولى في الرياض
              </div>
              <h1>
                {siteConfig.hero.headline}
                <span>{siteConfig.hero.accent}</span>
              </h1>
              <p className="hero-description">{siteConfig.hero.subheadline}</p>
              <div className="hero-actions">
                <button
                  className="button button-lime button-large"
                  onClick={openActiveBranchCampaignModal}
                >
                  احجز اشتراكك الصيفي
                  <ArrowLeft size={19} />
                </button>
                <button
                  className="button button-ghost button-large"
                  onClick={() => scrollToSection("branches")}
                >
                  استكشف الفروع
                  <ArrowUpLeft size={18} />
                </button>
              </div>
              <div className="hero-trust">
                <div className="avatar-stack" aria-hidden="true">
                  <span>م</span>
                  <span>س</span>
                  <span>ع</span>
                </div>
                <div>
                  <div className="stars" aria-label="تقييم 5 من 5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <small>انضم إلى مجتمع يتطور كل يوم</small>
                </div>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-card-top">
                <span>أكثر من</span>
                <Sparkles size={17} />
              </div>
              <strong>15</strong>
              <span className="stat-label">سنة من الخبرة</span>
              <div className="stat-divider" />
              <div className="stat-mini-row">
                <span>3 فروع في الرياض</span>
                <ArrowUpLeft size={15} />
              </div>
            </div>
          </div>
          <button
            className="scroll-cue"
            onClick={() => scrollToSection("branches")}
            aria-label="انتقل إلى معلومات الفروع"
          >
            <span>اكتشف المزيد</span>
            <MoveUpLeft size={17} />
          </button>
        </section>

        <section className="section branch-section" id="branches">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <div className="eyebrow">فروعنا في الرياض</div>
                <h2>
                  اختر فرعك،
                  <span> وابدأ الآن.</span>
                </h2>
              </div>
              <p>
                ثلاثة فروع، عضوية واحدة. بدّل بين الفروع لمعرفة ساعات العمل
                والتواصل مع الفرع الأقرب إليك.
              </p>
            </div>

            <div
              className="branch-tabs"
              role="tablist"
              aria-label="فروع مركز صحتي"
            >
              {branches.map((branch, index) => (
                <button
                  key={branch.id}
                  role="tab"
                  aria-selected={activeBranch.id === branch.id}
                  className={`branch-tab ${activeBranch.id === branch.id ? "active" : ""}`}
                  onClick={() => setActiveBranchId(branch.id)}
                >
                  <span className="branch-index">0{index + 1}</span>
                  <span className="branch-tab-copy">
                    <strong>{branch.name}</strong>
                    <small>{branch.englishName}</small>
                  </span>
                  {activeBranch.id === branch.id && <ArrowLeft size={18} />}
                </button>
              ))}
            </div>

            <div className="branch-panel">
              <div className="branch-panel-intro">
                <span className="live-dot">
                  <span />
                  الفرع المختار
                </span>
                <h3>{activeBranch.name}</h3>
                <p>مساحتك اليومية لتتحدى نفسك وتصبح أقوى.</p>
              </div>
              <div className="branch-details">
                <div className="detail-item">
                  <span className="detail-icon">
                    <Clock3 size={20} />
                  </span>
                  <div>
                    <small>ساعات العمل</small>
                    <strong>{activeBranch.hours}</strong>
                    <span>{activeBranch.friday}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">
                    <Phone size={20} />
                  </span>
                  <div>
                    <small>اتصل بنا</small>
                    <a href={phoneHref(activeBranch.phone)} dir="ltr">
                      {activeBranch.phone}
                    </a>
                    <span>متاح للاستفسارات والحجوزات</span>
                  </div>
                </div>
                <div className="branch-actions">
                  <a
                    className="button button-lime"
                    href={activeBranch.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin size={17} />
                    فتح الموقع
                    <ExternalLink size={14} />
                  </a>
                  <a
                    className="button button-dark"
                    href={phoneHref(activeBranch.phone)}
                  >
                    <Phone size={17} />
                    اتصال سريع
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section offers-section" id="offers">
          <div className="container">
            {siteConfig.exclusiveBanner.enabled && (
              <div className="campaign-banner">
                <div className="campaign-banner-icon">
                  <Sparkles size={22} />
                </div>
                <div className="campaign-banner-copy">
                  <span className="campaign-kicker">
                    اليوم الوطني السعودي 96
                  </span>
                  <strong>
                    عروض اليوم الوطني السعودي 96 - نادي صحتي الرياضي
                  </strong>
                  <span>{siteConfig.exclusiveBanner.note}</span>
                </div>
                <div className="campaign-banner-side">
                  <span className="campaign-badge">
                    <Sparkles size={14} />
                    عرض خاص لفترة محدودة
                  </span>
                  <small>{activeCampaign.label}</small>
                  <button
                    type="button"
                    className="campaign-banner-button"
                    onClick={() => openCampaignModal(featuredCampaignPlan)}
                  >
                    احجز العرض الآن
                    <ArrowLeft size={15} />
                  </button>
                </div>
              </div>
            )}

            <div className="section-heading centered-heading">
              <div className="eyebrow">عروض اليوم الوطني</div>
              <h2>
                اختر عرضك،
                <span> وابدأ بقوة.</span>
              </h2>
              <p>بدّل بين نماذج التسعير واختر الباقة التي تناسب هدفك.</p>
            </div>

            <div
              className="campaign-tabs"
              role="tablist"
              aria-label="نماذج عروض اليوم الوطني"
            >
              {pricingTabs.map((tab) => {
                const offer = campaignOffers[tab];
                const isActive = pricingTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="campaign-pricing-panel"
                    className={`campaign-tab ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setPricingTab(tab);
                      if (tab === "shifa") {
                        setActiveBranchId("shifa");
                      } else if (activeBranchId === "shifa") {
                        setActiveBranchId("mansoura");
                      }
                    }}
                  >
                    <span>{offer.tabLabel}</span>
                    <small>
                      {tab === "shifa"
                        ? "شارع الخليل بن أحمد"
                        : "نموذج موحّد للفرعين"}
                    </small>
                  </button>
                );
              })}
            </div>

            <div
              id="campaign-pricing-panel"
              className={`plans-grid campaign-plans-grid campaign-plans-${pricingTab}`}
              role="tabpanel"
              aria-label={`باقات ${activeCampaign.label}`}
            >
              {activeCampaign.plans.map((plan, index) => (
                <article
                  key={`${pricingTab}-${plan.name}`}
                  className={`plan-card campaign-plan-card ${plan.featured ? "featured" : ""}`}
                >
                  {plan.badge && (
                    <div className="campaign-plan-badge">
                      <Sparkles size={14} />
                      {plan.badge}
                    </div>
                  )}
                  <div className="plan-topline">
                    <span>{plan.eyebrow}</span>
                    <span className="plan-number">0{index + 1}</span>
                  </div>
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <strong>{plan.price}</strong>
                    <span className="price-meta">
                      ر.س
                      <small className="price-period">{plan.period}</small>
                    </span>
                  </div>
                  <div className="plan-separator" />
                  <ul>
                    {plan.benefits.map((benefit) => (
                      <li key={benefit}>
                        <span>
                          <Check size={14} />
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="button button-lime plan-button campaign-plan-button"
                    onClick={() => openCampaignModal(plan)}
                  >
                    احجز العرض الآن عبر واتساب
                    <MessageCircle size={17} />
                  </button>
                </article>
              ))}
            </div>

            {activeCampaign.alert && (
              <div className="campaign-alert" role="note">
                <AlertCircle size={17} />
                <span>{activeCampaign.alert}</span>
              </div>
            )}

            <div className="campaign-contact">
              <div>
                <span>للتواصل والحجز</span>
                <strong>{activeCampaign.label}</strong>
              </div>
              <div className="campaign-contact-actions">
                <button
                  type="button"
                  className="button button-outline campaign-form-button"
                  onClick={() => openCampaignModal(featuredCampaignPlan)}
                >
                  تعبئة نموذج الاشتراك
                  <ArrowLeft size={15} />
                </button>
                <p>{campaignContactText}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section facilities-section" id="facilities">
          <div className="container">
            <div className="section-heading split-heading facilities-heading">
              <div>
                <div className="eyebrow">كل شيء في مكان واحد</div>
                <h2>
                  مرافق صُممت
                  <span> لتتقدم.</span>
                </h2>
              </div>
              <p>
                من أول تمرينك إلى آخر تكرار، ستجد بيئة متكاملة تساعدك على
                التركيز والوصول إلى هدفك.
              </p>
            </div>

            <div className="facility-grid">
              {facilities.map((facility) => {
                const Icon = facility.icon;
                return (
                  <article
                    className={`facility-card ${facility.size}`}
                    key={facility.title}
                  >
                    <img
                      src={facility.image}
                      alt={facility.title}
                      loading="lazy"
                    />
                    <div className="facility-overlay" />
                    <div className="facility-content">
                      <span className="facility-icon">
                        <Icon size={19} />
                      </span>
                      <div>
                        <h3>{facility.title}</h3>
                        <p>{facility.description}</p>
                      </div>
                      <ArrowUpLeft className="facility-arrow" size={20} />
                    </div>
                  </article>
                );
              })}
              <article className="facility-quote-card">
                <Sparkles size={25} />
                <p>كل تكرار يقربك من الشخص الذي تريد أن تكونه.</p>
                <span>MY HEALTH / 2026</span>
              </article>
            </div>
          </div>
        </section>

        <section className="section reviews-section" id="reviews">
          <div className="container">
            <div className="review-header">
              <div>
                <div className="eyebrow">ماذا يقول أعضاؤنا</div>
                <h2>
                  تجربة يشعر بها
                  <span> كل مشترك.</span>
                </h2>
              </div>
              <div className="google-summary">
                <div className="google-word">
                  <span className="google-g">G</span>
                  <span>Google</span>
                </div>
                <div className="summary-stars">
                  <strong>5.0</strong>
                  <span className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill="currentColor" />
                    ))}
                  </span>
                </div>
                <small>تقييمات موثقة من المشتركين</small>
              </div>
            </div>

            <div className="reviews-grid">
              {reviews.map((review, index) => (
                <article className="review-card" key={review.name}>
                  <div className="review-top">
                    <span className="review-index">0{index + 1}</span>
                    <span className="verified">
                      <ShieldCheck size={14} />
                      موثّق
                    </span>
                  </div>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p>“{review.quote}”</p>
                  <div className="review-author">
                    <span className="review-avatar">
                      {review.name.charAt(0)}
                    </span>
                    <div>
                      <strong>{review.name}</strong>
                      <small>
                        {review.latinName} · {review.role}
                      </small>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="container final-cta-inner">
            <img
              className="final-cta-logo"
              src={logoImage}
              alt="شعار مركز صحتي الرياضي"
            />
            <div>
              <div className="eyebrow eyebrow-lime">جاهز للخطوة الأولى؟</div>
              <h2>
                هدفك يستحق
                <span> مكاناً أفضل.</span>
              </h2>
            </div>
            <button
              className="button button-lime button-large"
              onClick={() => scrollToSection("offers")}
            >
              شاهد الباقات
              <ArrowLeft size={19} />
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <div className="brand footer-brand-lockup">
              <img
                className="brand-logo"
                src={logoImage}
                alt="شعار مركز صحتي الرياضي"
              />
              <span className="brand-copy">
                <strong>مركز صحتي الرياضي</strong>
                <small>MY HEALTH</small>
              </span>
            </div>
            <p>مساحة تساعدك أن تتحرك أكثر، تشعر أفضل، وتعيش حياة أقوى.</p>
            <a
              className="footer-whatsapp"
              href={branchWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} />
              تواصل مع {activeBranch.name}
            </a>
          </div>
          <div className="footer-links">
            <h3>روابط سريعة</h3>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)}>
                {item.label}
                <ArrowUpLeft size={14} />
              </button>
            ))}
          </div>
          <div className="footer-branches">
            <h3>الفروع</h3>
            {branches.map((branch) => (
              <a
                key={branch.id}
                className={activeBranch.id === branch.id ? "active" : ""}
                href={phoneHref(branch.phone)}
                onClick={() => setActiveBranchId(branch.id)}
              >
                <span>
                  <MapPin size={14} />
                  {branch.name}
                </span>
                <b dir="ltr">{branch.phone}</b>
              </a>
            ))}
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 مركز صحتي الرياضي. جميع الحقوق محفوظة.</span>
          <span className="footer-location">
            <MapPin size={14} />
            الرياض، المملكة العربية السعودية
          </span>
          <span>صُنع للحركة</span>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={branchWhatsAppUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`تواصل عبر واتساب مع ${activeBranch.name}`}
      >
        <span className="whatsapp-pulse" />
        <MessageCircle size={25} />
      </a>

      {selectedPlan && (
        <div
          className="membership-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeMembershipModal();
            }
          }}
        >
          <section
            ref={modalRef}
            className="membership-modal"
            role="dialog"
            dir="rtl"
            aria-modal="true"
            aria-labelledby="membership-modal-title"
            aria-describedby="membership-modal-description"
          >
            <div className="membership-modal-header">
              <div>
                <span className="modal-eyebrow">
                  <span className="eyebrow-dot" />
                  بياناتك محفوظة حتى تنتقل لواتساب
                </span>
                <h2 id="membership-modal-title">تأكيد الاشتراك وحجز العرض</h2>
                <p id="membership-modal-description">
                  {selectedPlan.name} — {selectedPlan.price} ريال
                  <span> · {selectedBookingBranch.name}</span>
                </p>
              </div>
              <button
                type="button"
                ref={modalCloseRef}
                className="modal-close"
                onClick={closeMembershipModal}
                aria-label="إغلاق نافذة الاشتراك"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="membership-form"
              onSubmit={handleMembershipSubmit}
              noValidate
            >
              {bookingBranchOptions.length > 1 && (
                <fieldset className="booking-branch-selector">
                  <legend>اختر فرع الحجز</legend>
                  <div>
                    {bookingBranchOptions.map((option) => {
                      const isSelected =
                        selectedBookingBranch.id === option.branch.id;

                      return (
                        <button
                          key={option.branch.id}
                          type="button"
                          className={isSelected ? "is-selected" : ""}
                          aria-pressed={isSelected}
                          onClick={() =>
                            setBookingContext((current) =>
                              current
                                ? {
                                    ...current,
                                    branch: option.branch,
                                    whatsappPhone: option.whatsappPhone,
                                  }
                                : current,
                            )
                          }
                        >
                          <span>{option.branch.name}</span>
                          {isSelected && <Check size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div className="membership-form-grid">
                <label className="membership-field field-full">
                  <span>الاسم الثلاثي</span>
                  <input
                    id="membership-full-name"
                    name="fullName"
                    type="text"
                    value={membershipForm.fullName}
                    onChange={(event) =>
                      setMembershipForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="اكتب اسمك الثلاثي"
                    autoComplete="name"
                    required
                    aria-invalid={membershipAttempted && !isFullNameValid}
                    aria-describedby={
                      membershipAttempted && !isFullNameValid
                        ? "membership-full-name-error"
                        : undefined
                    }
                  />
                  {membershipAttempted && !isFullNameValid && (
                    <small
                      id="membership-full-name-error"
                      className="field-error"
                      role="alert"
                    >
                      يرجى كتابة الاسم الثلاثي كاملاً.
                    </small>
                  )}
                </label>

                <label className="membership-field">
                  <span>رقم الجوال</span>
                  <input
                    id="membership-mobile"
                    name="mobile"
                    type="tel"
                    value={membershipForm.mobile}
                    onChange={(event) =>
                      setMembershipForm((current) => ({
                        ...current,
                        mobile: normalizeDigits(event.target.value).slice(
                          0,
                          10,
                        ),
                      }))
                    }
                    placeholder="05xxxxxxxx"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    required
                    aria-invalid={
                      (membershipAttempted ||
                        membershipForm.mobile.length > 0) &&
                      !isMobileValid
                    }
                    aria-describedby={
                      (membershipAttempted ||
                        membershipForm.mobile.length > 0) &&
                      !isMobileValid
                        ? "membership-mobile-error"
                        : undefined
                    }
                  />
                  {(membershipAttempted || membershipForm.mobile.length > 0) &&
                    !isMobileValid && (
                      <small
                        id="membership-mobile-error"
                        className="field-error"
                        role="alert"
                      >
                        أدخل رقم جوال من 10 أرقام يبدأ بـ 05.
                      </small>
                    )}
                </label>

                <label className="membership-field">
                  <span>رقم الهوية الوطنية / الإقامة</span>
                  <input
                    id="membership-national-id"
                    name="nationalId"
                    type="text"
                    value={membershipForm.nationalId}
                    onChange={(event) =>
                      setMembershipForm((current) => ({
                        ...current,
                        nationalId: normalizeDigits(event.target.value).slice(
                          0,
                          10,
                        ),
                      }))
                    }
                    placeholder="10 أرقام"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={10}
                    required
                    aria-invalid={
                      (membershipAttempted ||
                        membershipForm.nationalId.length > 0) &&
                      !/^\d{10}$/.test(membershipForm.nationalId)
                    }
                    aria-describedby={
                      (membershipAttempted ||
                        membershipForm.nationalId.length > 0) &&
                      !/^\d{10}$/.test(membershipForm.nationalId)
                        ? "membership-national-id-error"
                        : undefined
                    }
                  />
                  {(membershipAttempted ||
                    membershipForm.nationalId.length > 0) &&
                    !/^\d{10}$/.test(membershipForm.nationalId) && (
                      <small
                        id="membership-national-id-error"
                        className="field-error"
                        role="alert"
                      >
                        أدخل 10 أرقام بالضبط.
                      </small>
                    )}
                </label>

                <label className="membership-field">
                  <span>العمر</span>
                  <input
                    id="membership-age"
                    name="age"
                    type="text"
                    value={membershipForm.age}
                    onChange={(event) =>
                      setMembershipForm((current) => ({
                        ...current,
                        age: normalizeDigits(event.target.value).slice(0, 3),
                      }))
                    }
                    placeholder="مثال: 25"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={3}
                    required
                    aria-invalid={
                      membershipAttempted &&
                      (!/^\d+$/.test(membershipForm.age) || isUnderage)
                    }
                    aria-describedby={
                      membershipAttempted &&
                      (!/^\d+$/.test(membershipForm.age) || isUnderage)
                        ? "membership-age-error"
                        : undefined
                    }
                  />
                  {membershipAttempted && !/^\d+$/.test(membershipForm.age) && (
                    <small
                      id="membership-age-error"
                      className="field-error"
                      role="alert"
                    >
                      يرجى إدخال العمر.
                    </small>
                  )}
                </label>
              </div>

              {isUnderage && (
                <div
                  id="membership-age-error"
                  className="age-rejection"
                  role="alert"
                >
                  <AlertCircle size={20} />
                  <p>
                    نعتذر منك يا بطل 🌸.. شروط التسجيل في الصالات تتطلب أن يكون
                    العمر 17 سنة فما فوق حرصاً على سلامتك. نتمنى أن نراك معنا
                    مستقبلاً!
                  </p>
                </div>
              )}

              <fieldset
                className="payment-preference"
                aria-describedby={
                  membershipAttempted && !membershipForm.paymentMethod
                    ? "membership-payment-error"
                    : undefined
                }
              >
                <legend>
                  وسيلة الدفع المفضلة
                  <span>اختر وسيلة واحدة</span>
                </legend>
                <div className="payment-options">
                  {paymentMethods.map((method) => {
                    const isSelected =
                      membershipForm.paymentMethod === method.id;

                    return (
                      <label
                        key={method.id}
                        className={`payment-option ${isSelected ? "is-selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={isSelected}
                          aria-invalid={
                            membershipAttempted && !membershipForm.paymentMethod
                          }
                          onChange={() =>
                            setMembershipForm((current) => ({
                              ...current,
                              paymentMethod: method.id,
                            }))
                          }
                          required
                        />
                        <span className="payment-radio" aria-hidden="true">
                          <Check size={12} />
                        </span>
                        <span className="payment-option-copy">
                          <strong>{method.label}</strong>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {membershipForm.paymentMethod && (
                  <div className="payment-description" role="status">
                    <ShieldCheck size={18} />
                    <span>
                      {
                        paymentMethods.find(
                          (method) =>
                            method.id === membershipForm.paymentMethod,
                        )?.description
                      }
                    </span>
                  </div>
                )}
                {membershipAttempted && !membershipForm.paymentMethod && (
                  <small
                    id="membership-payment-error"
                    className="field-error payment-error"
                    role="alert"
                  >
                    يرجى اختيار وسيلة الدفع المفضلة.
                  </small>
                )}
              </fieldset>

              <label className="terms-field">
                <input
                  id="membership-terms"
                  name="termsAccepted"
                  type="checkbox"
                  checked={membershipForm.termsAccepted}
                  onChange={(event) =>
                    setMembershipForm((current) => ({
                      ...current,
                      termsAccepted: event.target.checked,
                    }))
                  }
                  required
                  aria-invalid={
                    membershipAttempted && !membershipForm.termsAccepted
                  }
                  aria-describedby={
                    membershipAttempted && !membershipForm.termsAccepted
                      ? "membership-terms-error"
                      : undefined
                  }
                />
                <span className="terms-checkmark">
                  <Check size={13} />
                </span>
                <span>أوافق على لائحة النادي والشروط والأحكام</span>
              </label>
              {membershipAttempted && !membershipForm.termsAccepted && (
                <small
                  id="membership-terms-error"
                  className="field-error terms-error"
                  role="alert"
                >
                  يجب الموافقة على الشروط للمتابعة.
                </small>
              )}

              <div className="membership-form-footer">
                <button
                  type="submit"
                  className="button button-lime membership-submit"
                >
                  تأكيد ومتابعة ⚡
                  <ArrowLeft size={18} />
                </button>
                <small>
                  {isUnderage
                    ? "لا يمكن المتابعة قبل استيفاء شرط العمر."
                    : "سيتم فتح محادثة واتساب مع الفرع المختار."}
                </small>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;

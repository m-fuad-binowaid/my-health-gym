import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpLeft,
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
} from 'lucide-react';

import cardioImage from '@assets/IMG_8991_1788483814732.jpeg';
import turfImage from '@assets/IMG_8992_1788483814732.jpeg';
import treadmillsImage from '@assets/IMG_8994_1788483814732.jpeg';
import exteriorImage from '@assets/IMG_8995_1788483814732.jpeg';
import poolImage from '@assets/IMG_8996_1788483814732.jpeg';
import weightsImage from '@assets/IMG_8997_1788483814732.jpeg';
import groupImage from '@assets/IMG_8998_1788483814732.jpeg';

type Branch = {
  id: string;
  name: string;
  englishName: string;
  phone: string;
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
};

const branches: Branch[] = [
  {
    id: 'mansoura',
    name: 'فرع المنصورة',
    englishName: 'Al Mansoura',
    phone: '0536903636',
    hours: '05:00 صباحاً – 03:00 صباحاً',
    friday: 'الجمعة: 01:00 ظهراً – 12:00 منتصف الليل',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=My+Health+Gym+Al+Mansoura+Riyadh',
  },
  {
    id: 'saadah',
    name: 'فرع السعادة',
    englishName: 'Al Saadah',
    phone: '0552632207',
    hours: '05:30 صباحاً – 03:00 صباحاً',
    friday: 'الجمعة: 02:00 ظهراً – 12:00 منتصف الليل',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=My+Health+Gym+Al+Saadah+Riyadh',
  },
  {
    id: 'shifa',
    name: 'فرع الشفا',
    englishName: 'Al Shifa',
    phone: '0552631967',
    hours: '06:00 صباحاً – 02:00 صباحاً',
    friday: 'طوال أيام الأسبوع',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=My+Health+Gym+Al+Shifa+Riyadh',
  },
];

const plans: Plan[] = [
  {
    name: 'باقة 3 شهور',
    eyebrow: 'بداية قوية',
    price: '599',
    period: 'لمدة 3 أشهر',
    benefits: ['دخول جميع المرافق', 'المسابح والملاعب', 'استشارة لياقة أولية'],
  },
  {
    name: 'باقة 6 شهور',
    eyebrow: 'التزام يصنع الفرق',
    price: '799',
    period: 'لمدة 6 أشهر',
    benefits: ['دخول جميع المرافق', 'المسابح والملاعب', 'متابعة أسبوعية'],
  },
  {
    name: 'باقة 12 شهر',
    eyebrow: 'سنة كاملة',
    price: '1,099',
    period: 'لمدة 12 شهراً',
    benefits: ['وصول كامل وغير محدود طوال العام', 'المسابح والملاعب', 'مميزات إضافية حصرية'],
    featured: true,
  },
];

const facilities = [
  {
    title: 'كمال الأجسام والأوزان الحرة',
    description: 'أجهزة حديد متطورة ودنابل تناسب جميع المستويات.',
    image: weightsImage,
    icon: Dumbbell,
    size: 'large',
  },
  {
    title: 'الكارديو واللياقة',
    description: 'مسارات ركض ودراجات مزودة بشاشات تفاعلية.',
    image: cardioImage,
    icon: Trophy,
    size: 'standard',
  },
  {
    title: 'المسبح الأولمبي المغلق',
    description: 'حوض دافئ ونظيف للتدريب والاسترخاء.',
    image: poolImage,
    icon: Waves,
    size: 'standard',
  },
  {
    title: 'الملاعب الخارجية',
    description: 'مساحات عشب صناعي لممارسة رياضتك المفضلة.',
    image: turfImage,
    icon: Sparkles,
    size: 'standard',
  },
  {
    title: 'التمارين الجماعية وCrossFit',
    description: 'حصص يومية لرفع اللياقة والمرونة.',
    image: groupImage,
    icon: Users,
    size: 'wide',
  },
];

const reviews = [
  {
    name: 'عناية خان',
    latinName: 'Inayath Khan',
    role: 'مراجع Google',
    quote:
      'من أفضل النوادي الرياضية وأنسبها سعراً لكل شخص يبحث عن بناء جسم مثالي. تتوفر فيه صالة ومسبح متكاملان ومميزان.',
  },
  {
    name: 'أبو ضياء',
    latinName: 'مرشد محلي',
    role: 'مراجع Google',
    quote: 'مساحات واسعة ومريحة جداً للتمرين مع وجود مسبح نظيف وممتاز.',
  },
  {
    name: 'آبين إلياس',
    latinName: 'Abin Alias',
    role: 'مراجع Google',
    quote:
      'النادي رائع جداً، جميع الأجهزة والمعدات متوفرة والمسبح جميل. المكان نظيف وفريق العمل متعاون وداعم دائماً.',
  },
];

const navItems = [
  { label: 'الفروع', id: 'branches' },
  { label: 'العروض', id: 'offers' },
  { label: 'المرافق', id: 'facilities' },
  { label: 'آراء المشتركين', id: 'reviews' },
];

function whatsappUrl(phone: string, message: string) {
  const internationalPhone = `966${phone.replace(/^0/, '')}`;
  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
}

function phoneHref(phone: string) {
  return `tel:${phone}`;
}

function App() {
  const [activeBranchId, setActiveBranchId] = useState(branches[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeBranch =
    branches.find((branch) => branch.id === activeBranchId) ?? branches[0];

  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.classList.add('my-health-page');

    return () => document.body.classList.remove('my-health-page');
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const branchWhatsAppUrl = whatsappUrl(
    activeBranch.phone,
    `السلام عليكم، أرغب في الاستفسار عن الاشتراك في ${activeBranch.name}.`,
  );

  const planWhatsAppUrl = (plan: Plan) =>
    whatsappUrl(
      activeBranch.phone,
      `السلام عليكم، أرغب بالاشتراك في ${plan.name} بسعر ${plan.price} ريال لـ ${activeBranch.name}.`,
    );

  return (
    <div dir="rtl" className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <button
            className="brand"
            onClick={() => scrollToSection('top')}
            aria-label="العودة إلى بداية الصفحة"
          >
            <span className="brand-mark">MH</span>
            <span className="brand-copy">
              <strong>مركز صحتي الرياضي</strong>
              <small>MY HEALTH</small>
            </span>
          </button>

          <nav className={`desktop-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
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
              onClick={() => scrollToSection('offers')}
            >
              اشترك الآن
              <ArrowLeft size={17} />
            </button>
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
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
                طريقك لحياة صحية
                <span>وليـاقة متكاملة.</span>
              </h1>
              <p className="hero-description">
                كل ما تحتاجه لتبدأ وتستمر في رحلتك. تجهيزات احترافية، مرافق
                متكاملة، ومدربون معتمدون يساندونك في كل خطوة.
              </p>
              <div className="hero-actions">
                <button
                  className="button button-lime button-large"
                  onClick={() => scrollToSection('offers')}
                >
                  احجز اشتراكك الصيفي
                  <ArrowLeft size={19} />
                </button>
                <button
                  className="button button-ghost button-large"
                  onClick={() => scrollToSection('branches')}
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
            onClick={() => scrollToSection('branches')}
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

            <div className="branch-tabs" role="tablist" aria-label="فروع مركز صحتي">
              {branches.map((branch, index) => (
                <button
                  key={branch.id}
                  role="tab"
                  aria-selected={activeBranch.id === branch.id}
                  className={`branch-tab ${activeBranch.id === branch.id ? 'active' : ''}`}
                  onClick={() => setActiveBranchId(branch.id)}
                >
                  <span className="branch-index">0{index + 1}</span>
                  <span>
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
            <div className="offer-banner">
              <div className="offer-banner-icon">
                <Sparkles size={22} />
              </div>
              <div>
                <strong>عروض الصيف الحصرية</strong>
                <span>تشمل دخول الفروع الثلاثة — بدون تنازل وبدون إيقاف</span>
              </div>
              <div className="offer-branch">
                <span>للفرع المختار</span>
                <strong>{activeBranch.name}</strong>
              </div>
            </div>

            <div className="section-heading centered-heading">
              <div className="eyebrow">عضويتك تبدأ من هنا</div>
              <h2>
                استثمر في
                <span> أفضل نسخة منك.</span>
              </h2>
              <p>اختر المدة التي تناسب هدفك، واترك الباقي علينا.</p>
            </div>

            <div className="plans-grid">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`plan-card ${plan.featured ? 'featured' : ''}`}
                >
                  {plan.featured && (
                    <div className="popular-ribbon">
                      <Sparkles size={14} />
                      الأكثر توفيراً
                    </div>
                  )}
                  <div className="plan-topline">
                    <span>{plan.eyebrow}</span>
                    <span className="plan-number">0{plans.indexOf(plan) + 1}</span>
                  </div>
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <strong>{plan.price}</strong>
                    <span>
                      ريال
                      <small>{plan.period}</small>
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
                  <a
                    className={`button plan-button ${plan.featured ? 'button-lime' : 'button-outline'}`}
                    href={planWhatsAppUrl(plan)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    اشترك الآن
                    <ArrowLeft size={17} />
                  </a>
                </article>
              ))}
            </div>
            <p className="offers-note">
              <ShieldCheck size={15} />
              العرض متاح لفترة محدودة — تواصل معنا للتأكد من التوفر
            </p>
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
                    <img src={facility.image} alt={facility.title} loading="lazy" />
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
                    <span className="review-avatar">{review.name.charAt(0)}</span>
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
            <div className="final-cta-mark">MH</div>
            <div>
              <div className="eyebrow eyebrow-lime">جاهز للخطوة الأولى؟</div>
              <h2>
                هدفك يستحق
                <span> مكاناً أفضل.</span>
              </h2>
            </div>
            <button
              className="button button-lime button-large"
              onClick={() => scrollToSection('offers')}
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
              <span className="brand-mark">MH</span>
              <span className="brand-copy">
                <strong>مركز صحتي الرياضي</strong>
                <small>MY HEALTH</small>
              </span>
            </div>
            <p>
              مساحة تساعدك أن تتحرك أكثر، تشعر أفضل، وتعيش حياة أقوى.
            </p>
            <a className="footer-whatsapp" href={branchWhatsAppUrl} target="_blank" rel="noreferrer">
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
                className={activeBranch.id === branch.id ? 'active' : ''}
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
    </div>
  );
}

export default App;

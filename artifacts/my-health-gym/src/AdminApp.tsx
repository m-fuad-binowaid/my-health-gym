import { useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  CircleHelp,
  Clock3,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Megaphone,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Wifi,
  X,
} from "lucide-react";

import {
  loadSiteConfig,
  resetSiteConfig,
  saveSiteConfig,
  type ConfigBranch,
  type ConfigPlan,
  type PricingTab,
  type SiteConfig,
} from "./siteConfig";
import "./admin.css";

const ADMIN_PIN = "1234";

type AdminNotice = {
  tone: "success" | "error";
  message: string;
} | null;

function cloneConfig(config: SiteConfig): SiteConfig {
  return JSON.parse(JSON.stringify(config)) as SiteConfig;
}

function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x6f0))
    .replace(/\D/g, "");
}

function planInputValue(value: string) {
  return normalizeDigits(value);
}

function PinLock({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);

  const submitPin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pin === ADMIN_PIN) {
      setError("");
      onUnlock();
      return;
    }

    setError("رمز الدخول غير صحيح. حاول مرة أخرى.");
    setPin("");
  };

  return (
    <main className="admin-lock-screen" dir="rtl">
      <div className="admin-lock-glow admin-lock-glow-one" />
      <div className="admin-lock-glow admin-lock-glow-two" />
      <section className="admin-lock-card" aria-labelledby="admin-lock-title">
        <div className="admin-lock-mark">
          <LockKeyhole size={28} />
        </div>
        <span className="admin-kicker">MY HEALTH / ADMIN</span>
        <h1 id="admin-lock-title">رمز الدخول الإداري</h1>
        <p>
          مساحة خاصة لإدارة الباقات والفروع والعروض الترويجية في مركز صحتي
          الرياضي.
        </p>
        <form onSubmit={submitPin} className="admin-pin-form">
          <label htmlFor="admin-pin">أدخل رمز الدخول</label>
          <div className="admin-pin-input">
            <input
              id="admin-pin"
              data-testid="input-admin-pin"
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={pin}
              onChange={(event) =>
                setPin(normalizeDigits(event.target.value).slice(0, 4))
              }
              placeholder="••••"
              autoFocus
            />
            <button
              type="button"
              data-testid="button-toggle-pin"
              className="admin-icon-button"
              onClick={() => setShowPin((visible) => !visible)}
              aria-label={showPin ? "إخفاء الرمز" : "إظهار الرمز"}
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <span className="admin-field-error" role="alert">
              <AlertCircle size={15} />
              {error}
            </span>
          )}
          <button
            type="submit"
            data-testid="button-unlock-admin"
            className="admin-primary-button admin-lock-submit"
          >
            فتح لوحة التحكم
            <ChevronLeft size={18} />
          </button>
        </form>
        <span className="admin-lock-hint">
          <ShieldCheck size={14} />
          رمز محلي سريع لإدارة الموقع
        </span>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  testId: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input
        data-testid={testId}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  testId,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  testId: string;
}) {
  return (
    <label className="admin-toggle">
      <span>{label}</span>
      <input
        data-testid={testId}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="admin-toggle-track" aria-hidden="true">
        <span />
      </span>
    </label>
  );
}

function PlanEditor({
  plan,
  index,
  tab,
  onChange,
  onDelete,
  onFeature,
}: {
  plan: ConfigPlan;
  index: number;
  tab: PricingTab;
  onChange: (patch: Partial<ConfigPlan>) => void;
  onDelete: () => void;
  onFeature: (featured: boolean) => void;
}) {
  return (
    <article className="admin-plan-card" data-testid={`card-plan-${plan.id}`}>
      <div className="admin-card-heading">
        <div>
          <span className="admin-card-index">0{index + 1}</span>
          <h3>{plan.name || "باقة بدون اسم"}</h3>
        </div>
        <button
          type="button"
          data-testid={`button-delete-plan-${plan.id}`}
          className="admin-danger-button"
          onClick={onDelete}
          aria-label={`حذف ${plan.name || "الباقة"}`}
        >
          <Trash2 size={16} />
          حذف
        </button>
      </div>
      <div className="admin-plan-fields">
        <Field
          label="اسم الباقة"
          value={plan.name}
          onChange={(value) => onChange({ name: value })}
          testId={`input-plan-name-${plan.id}`}
        />
        <Field
          label="السعر بالريال"
          value={plan.price}
          onChange={(value) =>
            onChange({ price: planInputValue(value).slice(0, 5) })
          }
          inputMode="numeric"
          testId={`input-plan-price-${plan.id}`}
        />
        <Field
          label="الأيام المجانية المضافة"
          value={plan.freeDays}
          onChange={(value) =>
            onChange({ freeDays: planInputValue(value).slice(0, 3) })
          }
          inputMode="numeric"
          testId={`input-plan-free-days-${plan.id}`}
        />
        <Field
          label="أيام التجميد المسموحة"
          value={plan.freezeDays}
          onChange={(value) =>
            onChange({ freezeDays: planInputValue(value).slice(0, 3) })
          }
          inputMode="numeric"
          testId={`input-plan-freeze-days-${plan.id}`}
        />
      </div>
      <div className="admin-plan-footer">
        <Toggle
          checked={Boolean(plan.featured)}
          onChange={onFeature}
          label="شارة الأكثر طلباً"
          testId={`toggle-plan-featured-${tab}-${plan.id}`}
        />
        <span className="admin-plan-meta">
          <TrendingUp size={14} />
          {plan.period}
        </span>
      </div>
    </article>
  );
}

function AdminDashboard({ onLock }: { onLock: () => void }) {
  const initialConfig = loadSiteConfig();
  const [draft, setDraft] = useState<SiteConfig>(initialConfig);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(initialConfig),
  );
  const [activeSection, setActiveSection] = useState("plans");
  const [activeTab, setActiveTab] = useState<PricingTab>("shifa");
  const [activeBranchId, setActiveBranchId] = useState(
    initialConfig.branches[0]?.id ?? "mansoura",
  );
  const [notice, setNotice] = useState<AdminNotice>(null);

  const isDirty = JSON.stringify(draft) !== savedSnapshot;
  const activeBranch =
    draft.branches.find((branch) => branch.id === activeBranchId) ??
    draft.branches[0];
  const activeCampaign = draft.campaigns[activeTab];
  const hasFeatured = activeCampaign.plans.some((plan) => plan.featured);

  const summary = useMemo(
    () => ({
      plans: Object.values(draft.campaigns).reduce(
        (total, campaign) => total + campaign.plans.length,
        0,
      ),
      branches: draft.branches.length,
      banner: draft.exclusiveBanner.enabled ? "مفعل" : "متوقف",
    }),
    [draft],
  );

  const updateDraft = (updater: (current: SiteConfig) => SiteConfig) => {
    setDraft((current) => updater(current));
    setNotice(null);
  };

  const updatePlan = (planId: string, patch: Partial<ConfigPlan>) => {
    updateDraft((current) => ({
      ...current,
      campaigns: {
        ...current.campaigns,
        [activeTab]: {
          ...current.campaigns[activeTab],
          plans: current.campaigns[activeTab].plans.map((plan) =>
            plan.id === planId ? { ...plan, ...patch } : plan,
          ),
        },
      },
    }));
  };

  const setFeatured = (planId: string, featured: boolean) => {
    updateDraft((current) => ({
      ...current,
      campaigns: {
        ...current.campaigns,
        [activeTab]: {
          ...current.campaigns[activeTab],
          plans: current.campaigns[activeTab].plans.map((plan) => ({
            ...plan,
            featured:
              plan.id === planId ? featured : featured ? false : plan.featured,
          })),
        },
      },
    }));
  };

  const addPlan = () => {
    const id = `${activeTab}-${Date.now()}`;
    const newPlan: ConfigPlan = {
      id,
      name: "باقة جديدة",
      eyebrow: "عرض جديد",
      price: "0",
      period: "حدد مدة العرض",
      benefits: ["دخول النادي", "المرافق الرياضية"],
      freeDays: "0",
      freezeDays: "0",
    };

    updateDraft((current) => ({
      ...current,
      campaigns: {
        ...current.campaigns,
        [activeTab]: {
          ...current.campaigns[activeTab],
          plans: [...current.campaigns[activeTab].plans, newPlan],
        },
      },
    }));
  };

  const deletePlan = (planId: string) => {
    if (activeCampaign.plans.length <= 1) {
      setNotice({ tone: "error", message: "يجب إبقاء باقة واحدة على الأقل." });
      return;
    }
    if (!window.confirm("هل تريد حذف هذه الباقة؟")) return;

    updateDraft((current) => ({
      ...current,
      campaigns: {
        ...current.campaigns,
        [activeTab]: {
          ...current.campaigns[activeTab],
          plans: current.campaigns[activeTab].plans.filter(
            (plan) => plan.id !== planId,
          ),
        },
      },
    }));
  };

  const updateBranch = (patch: Partial<ConfigBranch>) => {
    updateDraft((current) => ({
      ...current,
      branches: current.branches.map((branch) =>
        branch.id === activeBranch?.id ? { ...branch, ...patch } : branch,
      ),
    }));
  };

  const validateDraft = () => {
    if (
      !draft.hero.headline.trim() ||
      !draft.hero.accent.trim() ||
      !draft.hero.subheadline.trim()
    ) {
      return "أكمل نصوص الواجهة الرئيسية قبل النشر.";
    }

    for (const campaign of Object.values(draft.campaigns)) {
      if (!campaign.plans.length) return "أضف باقة واحدة على الأقل لكل عرض.";
      for (const plan of campaign.plans) {
        if (
          !plan.name.trim() ||
          !/^\d+$/.test(plan.price) ||
          Number(plan.price) < 1
        ) {
          return "تأكد من اسم وسعر كل باقة.";
        }
        if (!/^\d+$/.test(plan.freeDays) || !/^\d+$/.test(plan.freezeDays)) {
          return "الأيام المجانية وأيام التجميد يجب أن تكون أرقاماً.";
        }
      }
    }

    for (const branch of draft.branches) {
      if (
        !branch.hours.trim() ||
        !branch.friday.trim() ||
        !/^05\d{8}$/.test(branch.whatsappPhone)
      ) {
        return `تأكد من ساعات العمل ورقم واتساب ${branch.name}.`;
      }
    }
    return null;
  };

  const save = () => {
    const error = validateDraft();
    if (error) {
      setNotice({ tone: "error", message: error });
      return;
    }
    saveSiteConfig(draft);
    setSavedSnapshot(JSON.stringify(draft));
    setNotice({
      tone: "success",
      message: "تم حفظ ونشر التعديلات على الموقع.",
    });
  };

  const reset = () => {
    if (!window.confirm("ستعود كل الإعدادات إلى القيم الافتراضية. هل تتابع؟")) {
      return;
    }
    const defaults = resetSiteConfig();
    setDraft(defaults);
    setSavedSnapshot(JSON.stringify(defaults));
    setNotice({
      tone: "success",
      message: "تمت استعادة الإعدادات الافتراضية.",
    });
  };

  return (
    <div className="admin-shell" dir="rtl">
      <header className="admin-topbar">
        <div className="admin-brand-lockup">
          <span className="admin-brand-mark">MH</span>
          <span>
            <strong>مركز صحتي الرياضي</strong>
            <small>MY HEALTH / CONTROL ROOM</small>
          </span>
        </div>
        <div className="admin-topbar-actions">
          <span className={`admin-save-state ${isDirty ? "is-dirty" : ""}`}>
            <span />
            {isDirty ? "تعديلات غير منشورة" : "متزامن مع الموقع"}
          </span>
          <a
            href={`${import.meta.env.BASE_URL}`}
            data-testid="link-view-site"
            className="admin-quiet-button"
          >
            <Eye size={16} />
            عرض الموقع
          </a>
          <button
            type="button"
            data-testid="button-lock-admin"
            className="admin-quiet-button"
            onClick={onLock}
          >
            <LogOut size={16} />
            قفل
          </button>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-intro">
            <span className="admin-kicker">مساحة الإدارة</span>
            <h1>تحكم بالموقع.</h1>
            <p>عدّل التفاصيل التي يراها زوار النادي وانشرها في لحظتها.</p>
          </div>
          <nav className="admin-nav" aria-label="أقسام لوحة الإدارة">
            {[
              { id: "plans", label: "الباقات والأسعار", icon: TrendingUp },
              { id: "promotions", label: "العروض والبانر", icon: Megaphone },
              { id: "branches", label: "الفروع وواتساب", icon: Wifi },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  data-testid={`button-section-${item.id}`}
                  className={activeSection === item.id ? "is-active" : ""}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  <ChevronLeft size={15} />
                </button>
              );
            })}
          </nav>
          <div className="admin-sidebar-summary">
            <div>
              <span>الباقات</span>
              <strong>{summary.plans}</strong>
            </div>
            <div>
              <span>الفروع</span>
              <strong>{summary.branches}</strong>
            </div>
            <div>
              <span>الشريط</span>
              <strong>{summary.banner}</strong>
            </div>
          </div>
        </aside>

        <main className="admin-content">
          <div className="admin-page-heading">
            <div>
              <span className="admin-kicker">مرحباً بك في غرفة التحكم</span>
              <h2>
                إدارة مركز صحتي
                <span>بوضوح وسرعة.</span>
              </h2>
            </div>
            <div className="admin-page-badge">
              <ShieldCheck size={17} />
              <span>حفظ محلي آمن</span>
            </div>
          </div>

          {notice && (
            <div
              className={`admin-notice ${notice.tone}`}
              data-testid="status-admin-notice"
              role="status"
            >
              {notice.tone === "success" ? (
                <Check size={17} />
              ) : (
                <AlertCircle size={17} />
              )}
              <span>{notice.message}</span>
              <button
                type="button"
                data-testid="button-dismiss-notice"
                onClick={() => setNotice(null)}
                aria-label="إغلاق الرسالة"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {activeSection === "plans" && (
            <section className="admin-section" aria-labelledby="plans-title">
              <div className="admin-section-heading">
                <div>
                  <span className="admin-kicker">Plans management</span>
                  <h2 id="plans-title">الأسعار والباقات</h2>
                  <p>حرّر الباقة وسيظهر السعر الجديد على كروت العروض مباشرة.</p>
                </div>
                <button
                  type="button"
                  data-testid="button-add-plan"
                  className="admin-primary-button"
                  onClick={addPlan}
                >
                  <Plus size={17} />
                  إضافة باقة جديدة
                </button>
              </div>
              <div
                className="admin-tab-row"
                role="tablist"
                aria-label="عروض الباقات"
              >
                {(Object.keys(draft.campaigns) as PricingTab[]).map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    data-testid={`button-plan-tab-${tab}`}
                    className={activeTab === tab ? "is-active" : ""}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {draft.campaigns[tab].tabLabel}
                    <small>{draft.campaigns[tab].plans.length} باقات</small>
                  </button>
                ))}
              </div>
              <div className="admin-plan-grid">
                {activeCampaign.plans.map((plan, index) => (
                  <PlanEditor
                    key={plan.id}
                    plan={plan}
                    index={index}
                    tab={activeTab}
                    onChange={(patch) => updatePlan(plan.id, patch)}
                    onFeature={(featured) => setFeatured(plan.id, featured)}
                    onDelete={() => deletePlan(plan.id)}
                  />
                ))}
              </div>
              {!hasFeatured && (
                <div className="admin-inline-hint">
                  <CircleHelp size={16} />
                  يمكنك تفعيل شارة «الأكثر طلباً» على الباقة التي تريد إبرازها.
                </div>
              )}
            </section>
          )}

          {activeSection === "promotions" && (
            <section
              className="admin-section"
              aria-labelledby="promotions-title"
            >
              <div className="admin-section-heading">
                <div>
                  <span className="admin-kicker">Promotional settings</span>
                  <h2 id="promotions-title">الواجهة والعروض الموسمية</h2>
                  <p>تحكم بالرسالة الأولى التي يقرأها زائر الصفحة.</p>
                </div>
                <div className="admin-section-icon">
                  <Megaphone size={22} />
                </div>
              </div>
              <div className="admin-settings-grid">
                <div className="admin-settings-card admin-settings-card-wide">
                  <div className="admin-card-heading">
                    <div>
                      <span className="admin-card-index">01</span>
                      <h3>عنوان الواجهة الرئيسية</h3>
                    </div>
                    <span className="admin-live-label">يظهر فوراً</span>
                  </div>
                  <div className="admin-form-stack">
                    <Field
                      label="العنوان الرئيسي"
                      value={draft.hero.headline}
                      onChange={(value) =>
                        updateDraft((current) => ({
                          ...current,
                          hero: { ...current.hero, headline: value },
                        }))
                      }
                      testId="input-hero-headline"
                    />
                    <Field
                      label="السطر المميز"
                      value={draft.hero.accent}
                      onChange={(value) =>
                        updateDraft((current) => ({
                          ...current,
                          hero: { ...current.hero, accent: value },
                        }))
                      }
                      testId="input-hero-accent"
                    />
                    <label className="admin-field">
                      <span>النص الفرعي الترويجي</span>
                      <textarea
                        data-testid="input-hero-subheadline"
                        rows={4}
                        value={draft.hero.subheadline}
                        onChange={(event) =>
                          updateDraft((current) => ({
                            ...current,
                            hero: {
                              ...current.hero,
                              subheadline: event.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="admin-settings-card">
                  <div className="admin-card-heading">
                    <div>
                      <span className="admin-card-index">02</span>
                      <h3>شريط العرض الحصري</h3>
                    </div>
                    <Megaphone size={18} className="admin-card-icon" />
                  </div>
                  <p className="admin-card-copy">
                    أظهر رسالة قصيرة أعلى قسم العروض الموسمية.
                  </p>
                  <Toggle
                    checked={draft.exclusiveBanner.enabled}
                    onChange={(enabled) =>
                      updateDraft((current) => ({
                        ...current,
                        exclusiveBanner: {
                          ...current.exclusiveBanner,
                          enabled,
                        },
                      }))
                    }
                    label={
                      draft.exclusiveBanner.enabled
                        ? "الشريط مفعل"
                        : "الشريط متوقف"
                    }
                    testId="toggle-exclusive-banner"
                  />
                  <Field
                    label="ملاحظة العرض"
                    value={draft.exclusiveBanner.note}
                    onChange={(note) =>
                      updateDraft((current) => ({
                        ...current,
                        exclusiveBanner: {
                          ...current.exclusiveBanner,
                          note,
                        },
                      }))
                    }
                    testId="input-exclusive-banner-note"
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === "branches" && activeBranch && (
            <section className="admin-section" aria-labelledby="branches-title">
              <div className="admin-section-heading">
                <div>
                  <span className="admin-kicker">Branches settings</span>
                  <h2 id="branches-title">الفروع وواتساب</h2>
                  <p>رقم واتساب هنا هو الوجهة التي تستقبل رسائل الحجز.</p>
                </div>
                <div className="admin-section-icon">
                  <Wifi size={22} />
                </div>
              </div>
              <div
                className="admin-branch-tabs"
                role="tablist"
                aria-label="فروع النادي"
              >
                {draft.branches.map((branch) => (
                  <button
                    type="button"
                    key={branch.id}
                    data-testid={`button-branch-tab-${branch.id}`}
                    className={activeBranch.id === branch.id ? "is-active" : ""}
                    role="tab"
                    aria-selected={activeBranch.id === branch.id}
                    onClick={() => setActiveBranchId(branch.id)}
                  >
                    <span>{branch.name}</span>
                    <small>{branch.englishName}</small>
                  </button>
                ))}
              </div>
              <div className="admin-branch-editor">
                <div className="admin-branch-editor-heading">
                  <div className="admin-branch-avatar">
                    <Wifi size={22} />
                  </div>
                  <div>
                    <span className="admin-kicker">الفرع المختار</span>
                    <h3>{activeBranch.name}</h3>
                  </div>
                </div>
                <div className="admin-settings-grid">
                  <Field
                    label="ساعات العمل اليومية"
                    value={activeBranch.hours}
                    onChange={(hours) => updateBranch({ hours })}
                    testId={`input-branch-hours-${activeBranch.id}`}
                  />
                  <Field
                    label="ساعات يوم الجمعة"
                    value={activeBranch.friday}
                    onChange={(friday) => updateBranch({ friday })}
                    testId={`input-branch-friday-${activeBranch.id}`}
                  />
                  <Field
                    label="رقم واتساب الحجز المعتمد"
                    value={activeBranch.whatsappPhone}
                    onChange={(value) =>
                      updateBranch({
                        whatsappPhone: normalizeDigits(value).slice(0, 10),
                      })
                    }
                    inputMode="tel"
                    placeholder="05xxxxxxxx"
                    testId={`input-branch-whatsapp-${activeBranch.id}`}
                  />
                  <div className="admin-readonly-card">
                    <Clock3 size={17} />
                    <div>
                      <span>رقم الاتصال الظاهر</span>
                      <strong dir="ltr">{activeBranch.phone}</strong>
                      <small>يبقى منفصلاً عن رقم واتساب الحجز.</small>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <div className="admin-savebar">
        <div className="admin-savebar-copy">
          <Save size={18} />
          <div>
            <strong>
              {isDirty ? "هناك تعديلات جاهزة للنشر" : "كل شيء محفوظ"}
            </strong>
            <span>
              {isDirty
                ? "انشرها لتظهر على الصفحة الرئيسية."
                : "آخر نسخة محفوظة تعمل الآن على الموقع."}
            </span>
          </div>
        </div>
        <div className="admin-savebar-actions">
          <button
            type="button"
            data-testid="button-reset-settings"
            className="admin-secondary-button"
            onClick={reset}
          >
            <RotateCcw size={16} />
            استعادة الافتراضي
          </button>
          <button
            type="button"
            data-testid="button-save-publish"
            className="admin-primary-button admin-publish-button"
            onClick={save}
          >
            حفظ ونشر التعديلات على الموقع ⚡
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem("my-health-gym:admin-unlocked") === "1";
    } catch {
      return false;
    }
  });

  const unlock = () => {
    try {
      sessionStorage.setItem("my-health-gym:admin-unlocked", "1");
    } catch {
      // The PIN still protects this view if session storage is unavailable.
    }
    setUnlocked(true);
  };

  const lock = () => {
    try {
      sessionStorage.removeItem("my-health-gym:admin-unlocked");
    } catch {
      // Nothing else is required to lock the in-memory dashboard.
    }
    setUnlocked(false);
  };

  return unlocked ? (
    <AdminDashboard onLock={lock} />
  ) : (
    <PinLock onUnlock={unlock} />
  );
}

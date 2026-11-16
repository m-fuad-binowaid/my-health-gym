export type PricingTab = "shifa" | "mansouraSaadah";

export type ConfigBranch = {
  id: string;
  name: string;
  englishName: string;
  phone: string;
  whatsappPhone: string;
  hours: string;
  friday: string;
  mapUrl: string;
};

export type ConfigPlan = {
  id: string;
  name: string;
  eyebrow: string;
  price: string;
  period: string;
  benefits: string[];
  freeDays: string;
  freezeDays: string;
  featured?: boolean;
  badge?: string;
};

export type ConfigCampaign = {
  label: string;
  tabLabel: string;
  whatsappPhone: string;
  contacts: string;
  plans: ConfigPlan[];
  alert?: string;
};

export type SiteConfig = {
  version: 1;
  hero: {
    headline: string;
    accent: string;
    subheadline: string;
  };
  exclusiveBanner: {
    enabled: boolean;
    note: string;
  };
  branches: ConfigBranch[];
  campaigns: Record<PricingTab, ConfigCampaign>;
};

export const SITE_CONFIG_STORAGE_KEY = "my-health-gym:site-config:v2";
export const SITE_CONFIG_UPDATED_EVENT = "my-health-gym:site-config-updated";

const plan = (
  id: string,
  name: string,
  eyebrow: string,
  price: string,
  period: string,
  benefits: string[],
  freeDays = "0",
  freezeDays = "0",
  extra: Pick<ConfigPlan, "featured" | "badge"> = {},
): ConfigPlan => ({
  id,
  name,
  eyebrow,
  price,
  period,
  benefits,
  freeDays,
  freezeDays,
  ...extra,
});

const createUnifiedPlans = (prefix: string): ConfigPlan[] => [
  plan(
    `${prefix}-3-months`,
    "3 شهور",
    "بداية قوية",
    "850",
    "عضوية شاملة",
    ["دخول النادي", "المسابح والمرافق", "شامل جميع الأجهزة"],
  ),
  plan(
    `${prefix}-6-months`,
    "6 شهور",
    "التزام أقوى",
    "1200",
    "عضوية شاملة",
    ["دخول النادي", "المسابح والمرافق", "شامل جميع الأجهزة"],
    "0",
    "0",
    { featured: true, badge: "الأكثر طلباً" },
  ),
  plan(
    `${prefix}-1-year`,
    "سنة",
    "استمرارية ونتائج",
    "2000",
    "12 شهراً",
    ["وصول كامل طوال العام", "المسابح والمرافق", "أفضل توفير سنوي"],
    "0",
    "0",
    { badge: "القيمة الأفضل" },
  ),
];

export const defaultSiteConfig: SiteConfig = {
  version: 1,
  hero: {
    headline: "طريقك لحياة صحية",
    accent: "وليـاقة متكاملة.",
    subheadline:
      "كل ما تحتاجه لتبدأ وتستمر في رحلتك. تجهيزات احترافية، مرافق متكاملة، ومدربون معتمدون يساندونك في كل خطوة.",
  },
  exclusiveBanner: {
    enabled: true,
    note: "باقات اشتراك شاملة وموحدة في جميع فروعنا بأعلى تجهيز",
  },
  branches: [
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
  ],
  campaigns: {
    shifa: {
      label: "فرع الشفاء (شارع الخليل بن أحمد)",
      tabLabel: "فرع الشفاء",
      whatsappPhone: "0534951220",
      contacts: "فرع الشفاء (هاتف: 0534951220 / 0552631967 / 0534909220)",
      plans: createUnifiedPlans("shifa"),
    },
    mansouraSaadah: {
      label: "فرع المنصورة & فرع السعادة",
      tabLabel: "فرع المنصورة & فرع السعادة",
      whatsappPhone: "0509284419",
      contacts: "فرع المنصورة (0509284419) | فرع السعادة (0552632207)",
      plans: createUnifiedPlans("mansoura-saadah"),
    },
  },
};

const cloneDefaults = () =>
  JSON.parse(JSON.stringify(defaultSiteConfig)) as SiteConfig;

function normalizePlan(
  input: Partial<ConfigPlan>,
  fallback: ConfigPlan,
): ConfigPlan {
  return {
    ...fallback,
    ...input,
    id: typeof input.id === "string" && input.id ? input.id : fallback.id,
    name: typeof input.name === "string" ? input.name : fallback.name,
    price: typeof input.price === "string" ? input.price : fallback.price,
    freeDays:
      typeof input.freeDays === "string" ? input.freeDays : fallback.freeDays,
    freezeDays:
      typeof input.freezeDays === "string"
        ? input.freezeDays
        : fallback.freezeDays,
    benefits: Array.isArray(input.benefits)
      ? input.benefits
      : fallback.benefits,
  };
}

function normalizeBranch(
  input: Partial<ConfigBranch> | undefined,
  fallback: ConfigBranch,
): ConfigBranch {
  return {
    ...fallback,
    ...(input && typeof input === "object" ? input : {}),
    id: fallback.id,
    name: typeof input?.name === "string" ? input.name : fallback.name,
    englishName:
      typeof input?.englishName === "string"
        ? input.englishName
        : fallback.englishName,
    phone: typeof input?.phone === "string" ? input.phone : fallback.phone,
    whatsappPhone:
      typeof input?.whatsappPhone === "string"
        ? input.whatsappPhone
        : fallback.whatsappPhone,
    hours: typeof input?.hours === "string" ? input.hours : fallback.hours,
    friday: typeof input?.friday === "string" ? input.friday : fallback.friday,
    mapUrl: typeof input?.mapUrl === "string" ? input.mapUrl : fallback.mapUrl,
  };
}

function normalizeConfig(value: unknown): SiteConfig {
  const fallback = cloneDefaults();
  if (!value || typeof value !== "object") return fallback;
  const input = value as Partial<SiteConfig>;
  const branches = fallback.branches.map((branch) => {
    const stored = input.branches?.find(
      (candidate) => candidate?.id === branch.id,
    );
    return normalizeBranch(stored, branch);
  });
  const campaigns = { ...fallback.campaigns };

  for (const tab of ["shifa", "mansouraSaadah"] as PricingTab[]) {
    const stored = input.campaigns?.[tab];
    if (!stored) continue;
    const fallbackPlans = fallback.campaigns[tab].plans;
    const storedPlans = Array.isArray(stored.plans) ? stored.plans : [];
    campaigns[tab] = {
      ...fallback.campaigns[tab],
      ...stored,
      plans: storedPlans.length
        ? storedPlans.map((item, index) =>
            normalizePlan(item, fallbackPlans[index] ?? fallbackPlans[0]),
          )
        : fallbackPlans,
    };
  }

  return {
    version: 1,
    hero: {
      headline:
        typeof input.hero?.headline === "string"
          ? input.hero.headline
          : fallback.hero.headline,
      accent:
        typeof input.hero?.accent === "string"
          ? input.hero.accent
          : fallback.hero.accent,
      subheadline:
        typeof input.hero?.subheadline === "string"
          ? input.hero.subheadline
          : fallback.hero.subheadline,
    },
    exclusiveBanner: {
      enabled:
        typeof input.exclusiveBanner?.enabled === "boolean"
          ? input.exclusiveBanner.enabled
          : fallback.exclusiveBanner.enabled,
      note:
        typeof input.exclusiveBanner?.note === "string"
          ? input.exclusiveBanner.note
          : fallback.exclusiveBanner.note,
    },
    branches,
    campaigns,
  };
}

export function loadSiteConfig(): SiteConfig {
  if (typeof window === "undefined") return cloneDefaults();
  try {
    const stored = window.localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    return stored ? normalizeConfig(JSON.parse(stored)) : cloneDefaults();
  } catch {
    return cloneDefaults();
  }
}

export function saveSiteConfig(config: SiteConfig) {
  const normalized = normalizeConfig(config);
  window.localStorage.setItem(
    SITE_CONFIG_STORAGE_KEY,
    JSON.stringify(normalized),
  );
  window.dispatchEvent(new CustomEvent(SITE_CONFIG_UPDATED_EVENT));
}

export function resetSiteConfig() {
  const defaults = cloneDefaults();
  saveSiteConfig(defaults);
  return defaults;
}

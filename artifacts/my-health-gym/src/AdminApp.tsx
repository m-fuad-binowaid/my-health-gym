import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  CircleHelp,
  Clock3,
  DollarSign,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Image as ImageIcon,
  Layers,
  LockKeyhole,
  LogOut,
  Megaphone,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
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
import {
  supabase,
  isSupabaseConfigured,
  type Item,
  type NewItem,
  type UpdateItem,
} from "./lib/supabase";
import "./admin.css";

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

// ============================================================================
// 1. Supabase Authentication Screen (Email / Password)
// ============================================================================
function SupabaseAuthLock({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("إعدادات Supabase غير مكتملة في ملف .env.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          if (data.session) {
            onAuthenticated(data.user);
          } else {
            setMessage("تم إنشاء الحساب بنجاح! تفقد بريدك الإلكتروني لتأكيد التسجيل إن طُلب ذلك.");
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          onAuthenticated(data.user);
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message === "Invalid login credentials"
            ? "بيانات الدخول غير صحيحة. تأكد من صحة البريد الإلكتروني وكلمة المرور."
            : err.message === "User already registered"
            ? "هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول مباشرة."
            : err.message
          : "حدث خطأ أثناء المصادقة.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-lock-screen" dir="rtl">
      <div className="admin-lock-glow admin-lock-glow-one" />
      <div className="admin-lock-glow admin-lock-glow-two" />
      <section className="admin-lock-card" aria-labelledby="admin-lock-title">
        <div className="admin-lock-mark">
          <LockKeyhole size={28} />
        </div>
        <span className="admin-kicker">MY HEALTH / SUPABASE AUTH</span>
        <h1 id="admin-lock-title">لوحة تحكم الإدارة</h1>
        <p>
          سجّل الدخول عبر مصادقة Supabase المشفرة لإدارة البيانات الحية، الباقات، والفروع.
        </p>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          <label className="admin-auth-label">
            <span>البريد الإلكتروني</span>
            <input
              data-testid="input-admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@myhealth.sa"
              dir="ltr"
            />
          </label>

          <label className="admin-auth-label">
            <span>كلمة المرور</span>
            <div className="admin-pin-input">
              <input
                data-testid="input-admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
              />
              <button
                type="button"
                data-testid="button-toggle-password"
                className="admin-icon-button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="admin-field-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="admin-field-success" role="status">
              <Check size={16} />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="button-submit-auth"
            className="admin-primary-button admin-lock-submit"
          >
            {loading ? (
              <>
                <RefreshCw size={17} className="admin-spin" />
                جاري التحقق...
              </>
            ) : isSignUp ? (
              <>
                إنشاء حساب مسؤول جديد
                <ChevronLeft size={18} />
              </>
            ) : (
              <>
                تسجيل الدخول إلى اللوحة
                <ChevronLeft size={18} />
              </>
            )}
          </button>

          <div className="admin-auth-switch">
            <button
              type="button"
              className="admin-text-link"
              onClick={() => {
                setIsSignUp((prev) => !prev);
                setError(null);
                setMessage(null);
              }}
            >
              {isSignUp
                ? "لديك حساب بالفعل؟ تسجيل الدخول"
                : "أول مرة تستخدم اللوحة؟ إنشاء حساب جديد"}
            </button>
          </div>
        </form>

        <div className="admin-lock-hint">
          <ShieldCheck size={14} />
          اتصال آمن ومشفّر عبر Supabase JWT
        </div>
      </section>
    </main>
  );
}

// ============================================================================
// Form Field & Toggle Helpers
// ============================================================================
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  testId,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  testId: string;
  dir?: "rtl" | "ltr";
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
        dir={dir}
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

// ============================================================================
// 2. Supabase Dynamic Items CRUD Component
// ============================================================================
function SupabaseItemsManager({
  notice,
  setNotice,
}: {
  notice: AdminNotice;
  setNotice: (n: AdminNotice) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<NewItem>({
    title: "",
    price: 596,
    category: "shifa",
    image: "",
    active: true,
  });

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      console.error("Error loading items from Supabase:", err);
      setNotice({
        tone: "error",
        message: err instanceof Error ? err.message : "فشل تحميل البيانات من Supabase.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim() || newItem.price <= 0) {
      setNotice({ tone: "error", message: "يرجى إدخال عنوان وسعر صالح للباقة." });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .insert([
          {
            title: newItem.title.trim(),
            price: Number(newItem.price),
            category: newItem.category,
            image: newItem.image?.trim() || "",
            active: newItem.active ?? true,
          },
        ])
        .select();

      if (error) throw error;

      setNotice({ tone: "success", message: `تمت إضافة باقة "${newItem.title}" بنجاح!` });
      setIsAddModalOpen(false);
      setNewItem({ title: "", price: 596, category: "shifa", image: "", active: true });
      loadItems();
    } catch (err: unknown) {
      setNotice({
        tone: "error",
        message: err instanceof Error ? err.message : "حدث خطأ أثناء إضافة العنصر.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("items")
        .update({
          title: editingItem.title.trim(),
          price: Number(editingItem.price),
          category: editingItem.category,
          image: editingItem.image?.trim() || "",
          active: editingItem.active,
        })
        .eq("id", editingItem.id);

      if (error) throw error;

      setNotice({ tone: "success", message: `تم تحديث "${editingItem.title}" بنجاح!` });
      setEditingItem(null);
      loadItems();
    } catch (err: unknown) {
      setNotice({
        tone: "error",
        message: err instanceof Error ? err.message : "حدث خطأ أثناء التحديث.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from("items").delete().eq("id", deletingItem.id);
      if (error) throw error;

      setNotice({ tone: "success", message: `تم حذف "${deletingItem.title}" بنجاح!` });
      setDeletingItem(null);
      loadItems();
    } catch (err: unknown) {
      setNotice({
        tone: "error",
        message: err instanceof Error ? err.message : "حدث خطأ أثناء الحذف.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: Item) => {
    const updatedStatus = !item.active;
    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, active: updatedStatus } : i))
    );

    try {
      const { error } = await supabase
        .from("items")
        .update({ active: updatedStatus })
        .eq("id", item.id);

      if (error) throw error;

      setNotice({
        tone: "success",
        message: `تم ${updatedStatus ? "تفعيل" : "تعطيل"} "${item.title}" في الموقع.`,
      });
    } catch (err: unknown) {
      // Revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, active: item.active } : i))
      );
      setNotice({
        tone: "error",
        message: err instanceof Error ? err.message : "فشل تعديل حالة الباقة.",
      });
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? item.active
          : !item.active;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, categoryFilter, statusFilter]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return Array.from(set);
  }, [items]);

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((i) => i.active).length,
      inactive: items.filter((i) => !i.active).length,
      categoriesCount: categories.length,
    }),
    [items, categories]
  );

  return (
    <div className="admin-supabase-manager">
      {/* Stats row */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <span className="admin-stat-label">إجمالي الباقات</span>
          <strong className="admin-stat-value">{stats.total}</strong>
        </div>
        <div className="admin-stat-card admin-stat-active">
          <span className="admin-stat-label">النشطة على الموقع</span>
          <strong className="admin-stat-value">{stats.active}</strong>
        </div>
        <div className="admin-stat-card admin-stat-inactive">
          <span className="admin-stat-label">المعطلة</span>
          <strong className="admin-stat-value">{stats.inactive}</strong>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">الفئات المسجلة</span>
          <strong className="admin-stat-value">{stats.categoriesCount}</strong>
        </div>
      </div>

      {/* Action and Filter toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="بحث عن باقة أو عرض..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="admin-clear-search"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="admin-toolbar-filters">
          <div className="admin-select-wrapper">
            <Filter size={15} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="تصفية حسب الفئة"
            >
              <option value="all">جميع الفئات</option>
              <option value="shifa">فرع الشفاء (shifa)</option>
              <option value="mansouraSaadah">المنصورة والسعادة (mansouraSaadah)</option>
              {categories
                .filter((c) => c !== "shifa" && c !== "mansouraSaadah")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          <div className="admin-select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="تصفية حسب الحالة"
            >
              <option value="all">كل الحالات</option>
              <option value="active">النشطة فقط</option>
              <option value="inactive">المعطلة فقط</option>
            </select>
          </div>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={loadItems}
            title="تحديث البيانات من Supabase"
          >
            <RefreshCw size={16} className={loading ? "admin-spin" : ""} />
            تحديث
          </button>

          <button
            type="button"
            data-testid="button-open-add-item"
            className="admin-primary-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} />
            إضافة باقة جديدة
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-table-empty">
            <RefreshCw size={28} className="admin-spin" />
            <p>جاري تحميل الباقات من قاعدة بيانات Supabase...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="admin-table-empty">
            <Layers size={36} />
            <p>لم يتم العثور على أي عناصر مطابقة للتصفية.</p>
            {items.length === 0 && (
              <button
                type="button"
                className="admin-primary-button"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={16} />
                أضف أول باقة الآن
              </button>
            )}
          </div>
        ) : (
          <table className="admin-items-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>عنوان الباقة</th>
                <th>الفئة</th>
                <th>السعر</th>
                <th>الحالة في الموقع</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className={!item.active ? "row-inactive" : ""}>
                  <td className="cell-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="admin-item-thumbnail"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="admin-item-thumb-placeholder">
                        <Tag size={16} />
                      </div>
                    )}
                  </td>
                  <td className="cell-title">
                    <strong>{item.title}</strong>
                    <small className="cell-id">ID: {item.id.slice(0, 8)}...</small>
                  </td>
                  <td>
                    <span className="admin-category-badge">
                      {item.category === "shifa"
                        ? "فرع الشفاء"
                        : item.category === "mansouraSaadah"
                        ? "المنصورة والسعادة"
                        : item.category}
                    </span>
                  </td>
                  <td className="cell-price">
                    <strong>{item.price}</strong>
                    <small> ر.س</small>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`admin-status-pill ${item.active ? "active" : "inactive"}`}
                      onClick={() => handleToggleActive(item)}
                      title="انقر لتبديل الحالة"
                    >
                      <span className="admin-status-dot" />
                      {item.active ? "نشط بالواجهة" : "معطل"}
                    </button>
                  </td>
                  <td className="cell-actions">
                    <button
                      type="button"
                      className="admin-action-btn edit"
                      onClick={() => setEditingItem({ ...item })}
                      title="تعديل الباقة"
                    >
                      <Edit3 size={16} />
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn delete"
                      onClick={() => setDeletingItem(item)}
                      title="حذف الباقة"
                    >
                      <Trash2 size={16} />
                      <span>حذف</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                <Plus size={18} />
                إضافة باقة جديدة إلى Supabase
              </h3>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="admin-modal-form">
              <Field
                label="عنوان الباقة / المنتج"
                value={newItem.title}
                onChange={(val) => setNewItem({ ...newItem, title: val })}
                placeholder="مثال: اشتراك 6 شهور + شهر مجاني"
                testId="input-new-item-title"
              />

              <div className="admin-settings-grid">
                <Field
                  label="السعر بالريال السعودي"
                  value={String(newItem.price)}
                  onChange={(val) => setNewItem({ ...newItem, price: Number(val) || 0 })}
                  inputMode="numeric"
                  type="number"
                  placeholder="596"
                  testId="input-new-item-price"
                />

                <label className="admin-field">
                  <span>الفئة المستهدفة</span>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="admin-select"
                  >
                    <option value="shifa">فرع الشفاء (shifa)</option>
                    <option value="mansouraSaadah">فرع المنصورة والسعادة (mansouraSaadah)</option>
                    <option value="general">عام لجميع الفروع</option>
                  </select>
                </label>
              </div>

              <Field
                label="رابط الصورة (اختياري)"
                value={newItem.image || ""}
                onChange={(val) => setNewItem({ ...newItem, image: val })}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
                testId="input-new-item-image"
              />

              <div className="admin-modal-toggle">
                <Toggle
                  checked={Boolean(newItem.active)}
                  onChange={(checked) => setNewItem({ ...newItem, active: checked })}
                  label="تفعيل الباقة فوراً على الواجهة العامة"
                  testId="toggle-new-item-active"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-primary-button"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="admin-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      حفظ في Supabase
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="admin-modal-backdrop" onClick={() => setEditingItem(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                <Edit3 size={18} />
                تعديل الباقة: {editingItem.title}
              </h3>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setEditingItem(null)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateItem} className="admin-modal-form">
              <Field
                label="عنوان الباقة"
                value={editingItem.title}
                onChange={(val) => setEditingItem({ ...editingItem, title: val })}
                testId="input-edit-item-title"
              />

              <div className="admin-settings-grid">
                <Field
                  label="السعر بالريال السعودي"
                  value={String(editingItem.price)}
                  onChange={(val) =>
                    setEditingItem({ ...editingItem, price: Number(val) || 0 })
                  }
                  inputMode="numeric"
                  type="number"
                  testId="input-edit-item-price"
                />

                <label className="admin-field">
                  <span>الفئة</span>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value })
                    }
                    className="admin-select"
                  >
                    <option value="shifa">فرع الشفاء (shifa)</option>
                    <option value="mansouraSaadah">فرع المنصورة والسعادة (mansouraSaadah)</option>
                    <option value="general">عام لجميع الفروع</option>
                  </select>
                </label>
              </div>

              <Field
                label="رابط الصورة (اختياري)"
                value={editingItem.image || ""}
                onChange={(val) => setEditingItem({ ...editingItem, image: val })}
                dir="ltr"
                testId="input-edit-item-image"
              />

              <div className="admin-modal-toggle">
                <Toggle
                  checked={editingItem.active}
                  onChange={(checked) =>
                    setEditingItem({ ...editingItem, active: checked })
                  }
                  label="الباقة مفعلة على الواجهة العامة"
                  testId="toggle-edit-item-active"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => setEditingItem(null)}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-primary-button"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="admin-spin" />
                      جاري التحديث...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      تأكيد التعديلات
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Modal */}
      {deletingItem && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingItem(null)}>
          <div className="admin-modal-card admin-modal-danger" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                <AlertCircle size={20} />
                تأكيد حذف الباقة
              </h3>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setDeletingItem(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                هل أنت متأكد من رغبتك في حذف الباقة <strong>"{deletingItem.title}"</strong> بشكل نهائي
                من قاعدة بيانات Supabase؟ لن يتمكن الزوار من رؤيتها في الموقع بعد ذلك.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => setDeletingItem(null)}
              >
                تراجع
              </button>
              <button
                type="button"
                disabled={submitting}
                className="admin-danger-button-solid"
                onClick={handleDeleteItem}
              >
                {submitting ? "جاري الحذف..." : "نعم، احذف الباقة الآن"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. Local Site Config Editor Components (Preserved for compatibility)
// ============================================================================
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

// ============================================================================
// 4. Main Admin Dashboard
// ============================================================================
function AdminDashboard({
  user,
  onSignOut,
}: {
  user: User;
  onSignOut: () => void;
}) {
  const initialConfig = loadSiteConfig();
  const [draft, setDraft] = useState<SiteConfig>(initialConfig);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(initialConfig),
  );
  // Default active section to Supabase live items manager!
  const [activeSection, setActiveSection] = useState<"supabaseItems" | "plans" | "branches" | "hero">("supabaseItems");
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
    const newId = `${activeTab}-${Date.now().toString().slice(-4)}`;
    updateDraft((current) => ({
      ...current,
      campaigns: {
        ...current.campaigns,
        [activeTab]: {
          ...current.campaigns[activeTab],
          plans: [
            ...current.campaigns[activeTab].plans,
            {
              id: newId,
              name: "باقة جديدة",
              eyebrow: "عرض خاص",
              price: "596",
              period: "لفترة محدودة",
              benefits: ["دخول النادي", "المسابح والمرافق"],
              freeDays: "0",
              freezeDays: "0",
            },
          ],
        },
      },
    }));
  };

  const deletePlan = (planId: string) => {
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
        branch.id === activeBranchId ? { ...branch, ...patch } : branch,
      ),
    }));
  };

  const save = () => {
    saveSiteConfig(draft);
    setSavedSnapshot(JSON.stringify(draft));
    setNotice({
      tone: "success",
      message: "تم حفظ إعدادات الموقع بنجاح.",
    });
  };

  const reset = () => {
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
      {/* Admin Top Navigation Header */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-brand">
            <span className="admin-badge">
              <Sparkles size={13} />
              MY HEALTH
            </span>
            <div className="admin-brand-text">
              <h1>لوحة تحكم الموقع والبيانات</h1>
              <span className="admin-supabase-status">
                <span className="status-indicator-dot" />
                قاعدة بيانات Supabase سحابية
              </span>
            </div>
          </div>

          <div className="admin-topbar-user">
            <div className="admin-user-info">
              <span className="admin-user-badge">مسؤول معتمد</span>
              <strong className="admin-user-email">{user.email}</strong>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-ghost-button"
              title="مشاهدة الموقع في نافذة جديدة"
            >
              <ExternalLink size={15} />
              عرض الموقع
            </a>

            <button
              type="button"
              data-testid="button-signout-admin"
              className="admin-logout-button"
              onClick={onSignOut}
              title="تسجيل الخروج"
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main">
        {notice && (
          <div className={`admin-alert admin-alert-${notice.tone}`} role="alert">
            {notice.tone === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{notice.message}</span>
            <button
              type="button"
              className="admin-icon-button"
              onClick={() => setNotice(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <nav className="admin-section-tabs" aria-label="أقسام لوحة التحكم">
          <button
            type="button"
            className={`admin-section-tab ${activeSection === "supabaseItems" ? "active" : ""}`}
            onClick={() => setActiveSection("supabaseItems")}
          >
            <Layers size={17} />
            <span>باقات Supabase المباشرة (Live CRUD)</span>
            <span className="admin-tab-pill">سحابي ⚡</span>
          </button>

          <button
            type="button"
            className={`admin-section-tab ${activeSection === "plans" ? "active" : ""}`}
            onClick={() => setActiveSection("plans")}
          >
            <TrendingUp size={17} />
            <span>الباقات الثابتة المحلية</span>
          </button>

          <button
            type="button"
            className={`admin-section-tab ${activeSection === "branches" ? "active" : ""}`}
            onClick={() => setActiveSection("branches")}
          >
            <Clock3 size={17} />
            <span>معلومات الفروع والمواعيد</span>
          </button>

          <button
            type="button"
            className={`admin-section-tab ${activeSection === "hero" ? "active" : ""}`}
            onClick={() => setActiveSection("hero")}
          >
            <Megaphone size={17} />
            <span>بنرات وإعلانات اليوم الوطني</span>
          </button>
        </nav>

        {/* 1. Supabase Live Items Management View */}
        {activeSection === "supabaseItems" && (
          <section className="admin-card admin-section-card">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <h2>إدارة الباقات والعروض (قاعدة بيانات Supabase)</h2>
                <p>
                  إضافة، تعديل، وحذف الباقات والعناصر المخزنة في جدول <code>items</code> على Supabase مباشرة.
                  أي تغيير يتم تحديثه على الفور في واجهة الموقع دون الحاجة لإعادة نشر الكود.
                </p>
              </div>
            </div>
            <SupabaseItemsManager notice={notice} setNotice={setNotice} />
          </section>
        )}

        {/* 2. Static Plans View */}
        {activeSection === "plans" && (
          <section className="admin-card admin-section-card">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <h2>تعديل الباقات المحلية (Local Config)</h2>
                <p>إدارة الباقات المحفوظة كنسخة احتياطية في إعدادات الموقع المحلية.</p>
              </div>
              <div className="admin-tabs">
                <button
                  type="button"
                  className={`admin-tab ${activeTab === "shifa" ? "active" : ""}`}
                  onClick={() => setActiveTab("shifa")}
                >
                  فرع الشفاء
                </button>
                <button
                  type="button"
                  className={`admin-tab ${activeTab === "mansouraSaadah" ? "active" : ""}`}
                  onClick={() => setActiveTab("mansouraSaadah")}
                >
                  المنصورة والسعادة
                </button>
              </div>
            </div>

            <div className="admin-plans-grid">
              {activeCampaign.plans.map((plan, index) => (
                <PlanEditor
                  key={plan.id}
                  plan={plan}
                  index={index}
                  tab={activeTab}
                  onChange={(patch) => updatePlan(plan.id, patch)}
                  onDelete={() => deletePlan(plan.id)}
                  onFeature={(featured) => setFeatured(plan.id, featured)}
                />
              ))}
            </div>

            <div className="admin-plans-action">
              <button
                type="button"
                data-testid="button-add-plan"
                className="admin-secondary-button"
                onClick={addPlan}
              >
                <Plus size={16} />
                إضافة باقة جديدة للملف المحلي
              </button>
            </div>
          </section>
        )}

        {/* 3. Branches View */}
        {activeSection === "branches" && (
          <section className="admin-card admin-section-card">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <h2>إدارة الفروع وساعات العمل</h2>
                <p>تعديل أرقام التواصل وساعات العمل لكل فرع من فروع مركز صحتي.</p>
              </div>
              <div className="admin-tabs">
                {draft.branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`admin-tab ${activeBranchId === b.id ? "active" : ""}`}
                    onClick={() => setActiveBranchId(b.id)}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-settings-grid">
              <Field
                label="اسم الفرع"
                value={activeBranch.name}
                onChange={(val) => updateBranch({ name: val })}
                testId="input-branch-name"
              />
              <Field
                label="رقم الهاتف"
                value={activeBranch.phone}
                onChange={(val) => updateBranch({ phone: val })}
                testId="input-branch-phone"
              />
              <Field
                label="رقم الواتساب"
                value={activeBranch.whatsappPhone}
                onChange={(val) => updateBranch({ whatsappPhone: val })}
                testId="input-branch-whatsapp"
              />
              <Field
                label="ساعات العمل"
                value={activeBranch.hours}
                onChange={(val) => updateBranch({ hours: val })}
                testId="input-branch-hours"
              />
            </div>
          </section>
        )}

        {/* 4. Hero & Banners View */}
        {activeSection === "hero" && (
          <section className="admin-card admin-section-card">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <h2>العناوين والبنرات الترويجية</h2>
                <p>تخصيص بنر اليوم الوطني السعودي والعناوين الرئيسية.</p>
              </div>
            </div>

            <div className="admin-settings-grid">
              <Field
                label="العنوان الرئيسي"
                value={draft.hero.headline}
                onChange={(val) =>
                  updateDraft((cur) => ({
                    ...cur,
                    hero: { ...cur.hero, headline: val },
                  }))
                }
                testId="input-hero-headline"
              />
              <Field
                label="الكلمة المميزة (اللون الفسفوري)"
                value={draft.hero.accent}
                onChange={(val) =>
                  updateDraft((cur) => ({
                    ...cur,
                    hero: { ...cur.hero, accent: val },
                  }))
                }
                testId="input-hero-accent"
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <Toggle
                checked={draft.exclusiveBanner.enabled}
                onChange={(checked) =>
                  updateDraft((cur) => ({
                    ...cur,
                    exclusiveBanner: {
                      ...cur.exclusiveBanner,
                      enabled: checked,
                    },
                  }))
                }
                label="تفعيل شريط العرض الحصري أعلى الصفحة"
                testId="toggle-exclusive-banner"
              />
            </div>
          </section>
        )}
      </main>

      {/* Bottom Save Bar for Local Site Config changes */}
      {isDirty && activeSection !== "supabaseItems" && (
        <div className="admin-savebar" dir="rtl">
          <div className="admin-savebar-inner">
            <div className="admin-savebar-copy">
              <Wifi size={18} />
              <div>
                <strong>لديك تعديلات محلية غير محفوظة!</strong>
                <span>انقر على حفظ ونشر لتطبيقها على الموقع.</span>
              </div>
            </div>
            <div className="admin-savebar-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={reset}
              >
                <RotateCcw size={16} />
                تراجع
              </button>
              <button
                type="button"
                className="admin-primary-button"
                onClick={save}
              >
                <Save size={16} />
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. Main Root Export with Supabase Session Listener
// ============================================================================
export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setCheckingAuth(false);
      return undefined;
    }

    // 1. Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    });

    // 2. Subscribe to Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Signout error:", err);
    }
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <main className="admin-lock-screen" dir="rtl">
        <div className="admin-lock-mark">
          <RefreshCw size={28} className="admin-spin" />
        </div>
        <p style={{ color: "#94a3b8" }}>جاري التحقق من جلسة المشرف في Supabase...</p>
      </main>
    );
  }

  return user ? (
    <AdminDashboard user={user} onSignOut={handleSignOut} />
  ) : (
    <SupabaseAuthLock onAuthenticated={(authenticatedUser) => setUser(authenticatedUser)} />
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { draftStore, type Draft, type DraftItem } from "@/lib/draftStore";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ─── packaging types ─── */
type PkgType = "unit" | "box" | "pallet";

interface PkgOption {
  type: PkgType;
  label: string;
  shortLabel: string;
  step: number;       // кратность в штуках
  hint: string;       // "1 коробка = 20 шт"
  disabled?: boolean; // недоступно для клиента
}

const PKG_OPTIONS: PkgOption[] = [
  { type: "unit",   shortLabel: "ШТ",     label: "Штука",   step: 1,   hint: "минимум 1 шт" },
  { type: "box",    shortLabel: "Короб.",  label: "Коробка", step: 20,  hint: "1 коробка = 20 шт" },
  { type: "pallet", shortLabel: "Паллет", label: "Паллета", step: 200, hint: "1 паллета = 200 шт (10 коробок)", disabled: false },
];

function getPkgOption(type: PkgType) {
  return PKG_OPTIONS.find(o => o.type === type)!;
}

/* CartItem = DraftItem (переиспользуем тип из хранилища) */
type CartItem = DraftItem;

/* ─── sidebar menu ─── */
const MENU = [
  { icon: "LayoutDashboard", label: "Главная",    path: "/" },
  { icon: "Package",         label: "Каталог",     path: "/catalog" },
  { icon: "ShoppingCart",    label: "Корзина",      path: "/b2b",        active: true },
  { icon: "FileText",        label: "Мои заказы",  path: "/orders" },
  { icon: "FilePen",         label: "Черновики",   path: "/b2b/drafts" },
  { icon: "FileSpreadsheet", label: "Прайс-листы", path: "/payments" },
  { icon: "BarChart3",       label: "Аналитика",   path: "/analytics" },
  { icon: "Banknote",        label: "Оплаты",      path: "/payments" },
  { icon: "Settings",        label: "Настройки",   path: "/settings" },
];

/* ─── mock catalog for search ─── */
const CATALOG_ITEMS = [
  { sku: "MN7707-4", name: "MANNOL Energy Formula OP 5W-30 4L", price: 2490, weight: 4.2 },
  { sku: "MN7914-4", name: "MANNOL Extreme 5W-40 4L",            price: 2750, weight: 4.2 },
  { sku: "MN7501-4", name: "MANNOL Classic 10W-40 4L",           price: 1890, weight: 4.2 },
  { sku: "MN8212-1", name: "MANNOL ATF AG52 1L",                 price:  890, weight: 1.1 },
  { sku: "MN4012-1", name: "MANNOL Antifreeze AG12 1L",          price:  420, weight: 1.1 },
  { sku: "MN9900-035", name: "MANNOL Motor Flush 0.35L",         price:  560, weight: 0.5 },
];

/* ─── draft save status ─── */
type SaveStatus = "idle" | "saving" | "saved" | "unsaved";

export default function B2BPortal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingDraftId = searchParams.get("draftId");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [skuSearch, setSkuSearch] = useState("");
  const [searchResults, setSearchResults] = useState<typeof CATALOG_ITEMS>([]);
  const [orderType, setOrderType] = useState<"regular" | "direct">("regular");
  const [shipDate, setShipDate] = useState("");
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("manual");

  /* ─── draft state ─── */
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("Черновик");
  const [editingTitle, setEditingTitle] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string>(draftStore.newId());
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  /* ─── Загрузка черновика при ?draftId= ─── */
  useEffect(() => {
    if (!editingDraftId) return;
    const draft = draftStore.get(editingDraftId);
    if (!draft) return;
    setCurrentDraftId(draft.id);
    setDraftTitle(draft.title);
    setCartItems(draft.items);
    setOrderType(draft.orderType);
    setShipDate(draft.shipDate ?? "");
    setComment(draft.comment ?? "");
    setSaveStatus("saved");
    const d = new Date(draft.updatedAt);
    setLastSaved(`${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`);
  }, [editingDraftId]);

  const buildDraft = useCallback((): Draft => ({
    id: currentDraftId,
    title: draftTitle,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    autoSaved: false,
    orderType,
    shipDate: shipDate || undefined,
    comment: comment || undefined,
    items: cartItems,
  }), [currentDraftId, draftTitle, orderType, shipDate, comment, cartItems]);

  const saveDraft = useCallback((auto = false) => {
    if (cartItems.length === 0) return;
    setSaveStatus("saving");
    setTimeout(() => {
      const saved = draftStore.save({ ...buildDraft(), autoSaved: auto });
      setCurrentDraftId(saved.id);
      setSaveStatus("saved");
      const now = new Date();
      setLastSaved(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
    }, 500);
  }, [cartItems, buildDraft]);

  /* auto-save every 2 min when cart has items */
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (cartItems.length === 0) { setSaveStatus("idle"); return; }
    setSaveStatus("unsaved");
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => { saveDraft(true); }, 120_000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [cartItems, orderType, shipDate, comment]);

  /* ─── search handler ─── */
  function handleSearch(val: string) {
    setSkuSearch(val);
    if (val.length < 2) { setSearchResults([]); return; }
    setSearchResults(
      CATALOG_ITEMS.filter(
        (p) =>
          p.sku.toLowerCase().includes(val.toLowerCase()) ||
          p.name.toLowerCase().includes(val.toLowerCase())
      )
    );
  }

  function addToCart(item: typeof CATALOG_ITEMS[0]) {
    setCartItems((prev) => {
      const ex = prev.find((c) => c.sku === item.sku);
      if (ex) return prev.map((c) => c.sku === item.sku ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, {
        id: `ci-${Date.now()}`,
        sku: item.sku,
        name: item.name,
        qty: 1,
        pkg: "unit" as PkgType,
        pricePerUnit: item.price,
        weightPerUnit: item.weight,
      }];
    });
    setSkuSearch("");
    setSearchResults([]);
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) return;
    setCartItems((prev) => prev.map((c) => c.id === id ? { ...c, qty } : c));
  }

  function removeItem(id: string) {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  }

  function updatePkg(id: string, pkg: PkgType) {
    const opt = getPkgOption(pkg);
    setCartItems((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const newQty = Math.max(opt.step, Math.ceil(c.qty / opt.step) * opt.step);
      return { ...c, pkg, qty: newQty };
    }));
  }

  const totalQty    = cartItems.reduce((s, c) => s + c.qty, 0);
  const totalWeight = cartItems.reduce((s, c) => s + c.qty * c.weightPerUnit, 0);
  const totalAmount = cartItems.reduce((s, c) => s + c.qty * c.pricePerUnit, 0);

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div className="min-h-screen bg-[#F5F6F8] flex font-sans">

      {/* ──────────────────── SIDEBAR ──────────────────── */}
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-[#2F2C6A] text-white z-50 flex flex-col
          transition-all duration-300 shadow-xl
          ${sidebarOpen ? "w-60" : "w-[72px]"}
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/10 flex-shrink-0 ${sidebarOpen ? "gap-3 px-5 py-5" : "justify-center px-3 py-5"}`}>
          <div className="w-9 h-9 bg-[#FFC107] rounded-lg flex items-center justify-center font-extrabold text-[#2F2C6A] text-lg flex-shrink-0 shadow-md">
            M
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="font-extrabold text-base leading-tight tracking-wide">MANNOL</p>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">B2B Partner</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`
                flex items-center gap-3 mx-3 mb-0.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${item.active
                  ? "bg-[#FFC107] text-[#2F2C6A]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }
                ${!sidebarOpen && "justify-center px-0"}
              `}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon name={item.icon as never} size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
              {sidebarOpen && item.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2F2C6A]/40" />
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar collapse toggle (desktop) */}
        <div className="hidden md:flex border-t border-white/10 p-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-xs transition-all ${!sidebarOpen && "justify-center"}`}
          >
            <Icon name={sidebarOpen ? "ChevronsLeft" : "ChevronsRight"} size={16} />
            {sidebarOpen && <span>Свернуть</span>}
          </button>
        </div>
      </aside>

      {/* ──────────────────── MAIN AREA ──────────────────── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-[72px]"}`}>

        {/* ──────────────────── HEADER ──────────────────── */}
        <header className="bg-white border-b border-[#E8E9EF] sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-3.5">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-lg hover:bg-[#F5F6F8] text-[#2F2C6A] transition"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Icon name="Menu" size={20} />
              </button>
              <div>
                <p className="text-xs text-gray-400 font-medium leading-none mb-0.5 hidden sm:block">MANNOL B2B</p>
                <h1 className="text-base font-bold text-[#2F2C6A] leading-tight">Личный кабинет партнёра</h1>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-[#F5F6F8] text-gray-500 hover:text-[#2F2C6A] transition">
                <Icon name="Bell" size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFC107] rounded-full border-2 border-white" />
              </button>

              <Separator orientation="vertical" className="h-7 hidden md:block" />

              {/* Company + User */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F5F6F8] transition">
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] text-gray-400 font-medium leading-none mb-0.5">ООО «АвтоСнаб Плюс»</p>
                      <p className="text-xs font-bold text-[#2F2C6A] leading-none">Петров И.П.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#2F2C6A] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[11px] font-bold">ПИ</span>
                    </div>
                    <Icon name="ChevronDown" size={14} className="text-gray-400 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Петров Иван Петрович</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Icon name="User" size={14} className="mr-2" />Профиль</DropdownMenuItem>
                  <DropdownMenuItem><Icon name="Settings" size={14} className="mr-2" />Настройки</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500"><Icon name="LogOut" size={14} className="mr-2" />Выйти</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* ──────────────────── PAGE CONTENT ──────────────────── */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7 lg:p-8">
          <div className="max-w-[1200px] mx-auto space-y-6">

            {/* Page heading */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Заказы</p>

                {/* Editable draft title */}
                {editingTitle ? (
                  <input
                    autoFocus
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onBlur={() => setEditingTitle(false)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingTitle(false); }}
                    className="text-2xl font-extrabold text-[#2F2C6A] bg-transparent border-b-2 border-[#2F2C6A]/30 focus:border-[#2F2C6A] outline-none w-full max-w-xs leading-tight"
                  />
                ) : (
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setEditingTitle(true)}>
                    <h2 className="text-2xl font-extrabold text-[#2F2C6A] leading-tight">{draftTitle}</h2>
                    <Icon name="Pencil" size={14} className="text-gray-300 group-hover:text-[#2F2C6A]/50 transition mt-1" />
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-1">Создание нового заказа</p>
              </div>

              {/* Right side: draft status + actions */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {cartItems.length > 0 && (
                  <Badge className="bg-[#FFC107]/15 text-[#2F2C6A] border border-[#FFC107]/40 font-bold text-sm px-3 py-1.5 h-auto">
                    <Icon name="ShoppingCart" size={14} className="mr-1.5" />
                    {totalQty} поз. · {new Intl.NumberFormat("ru-RU").format(totalAmount)} ₽
                  </Badge>
                )}

                {/* Draft save status */}
                {saveStatus === "saving" && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Icon name="Loader" size={13} className="animate-spin" />
                    Сохранение...
                  </div>
                )}
                {saveStatus === "saved" && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <Icon name="CheckCircle" size={13} />
                    Сохранено {lastSaved}
                  </div>
                )}
                {saveStatus === "unsaved" && cartItems.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600">
                    <Icon name="Circle" size={10} className="fill-amber-500 text-amber-500" />
                    Не сохранено
                  </div>
                )}

                {cartItems.length > 0 && saveStatus !== "saving" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveDraft(false)}
                    className="h-8 border-[#2F2C6A]/20 text-[#2F2C6A] hover:bg-[#2F2C6A]/5 text-xs font-semibold px-3 gap-1.5"
                  >
                    <Icon name="Save" size={13} />
                    Сохранить черновик
                  </Button>
                )}

                {cartItems.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/b2b/drafts")}
                    className="h-8 text-gray-400 hover:text-[#2F2C6A] text-xs px-2 gap-1"
                  >
                    <Icon name="FolderOpen" size={13} />
                    Все черновики
                  </Button>
                )}
              </div>
            </div>

            {/* ── Режим редактирования черновика ── */}
            {editingDraftId && (
              <div className="flex items-center gap-3 bg-[#2F2C6A] text-white rounded-xl px-5 py-3.5 shadow-sm">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="FilePen" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight">Режим редактирования черновика</p>
                  <p className="text-xs text-white/60 mt-0.5">Изменения применятся при сохранении. Отгрузить заказ можно прямо отсюда.</p>
                </div>
                <button
                  onClick={() => navigate("/b2b/drafts")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition flex-shrink-0"
                >
                  <Icon name="ArrowLeft" size={13} />
                  К черновикам
                </button>
              </div>
            )}

            {/* Source tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-[#E8E9EF] rounded-lg p-1 h-auto gap-1 shadow-sm">
                <TabsTrigger
                  value="manual"
                  className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-[#2F2C6A] data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  <Icon name="PenLine" size={14} className="mr-1.5" />
                  Ручное добавление
                </TabsTrigger>
                <TabsTrigger
                  value="excel"
                  className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-[#2F2C6A] data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  <Icon name="FileSpreadsheet" size={14} className="mr-1.5" />
                  Загрузка из Excel
                </TabsTrigger>
                <TabsTrigger
                  value="1c"
                  className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-[#2F2C6A] data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  <Icon name="Database" size={14} className="mr-1.5" />
                  Из системы 1С
                </TabsTrigger>
              </TabsList>

              {/* ── MANUAL TAB ── */}
              <TabsContent value="manual" className="mt-5 space-y-5">

                {/* Cart card */}
                <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm overflow-hidden">
                  {/* Card header */}
                  <div className="px-6 py-5 border-b border-[#F0F1F5]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-[#2F2C6A]">Корзина товаров</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Добавляйте товары из каталога или вводите артикулы</p>
                      </div>
                      {cartItems.length > 0 && (
                        <Link to="/catalog">
                          <Button variant="outline" size="sm" className="border-[#2F2C6A]/20 text-[#2F2C6A] hover:bg-[#2F2C6A]/5 h-9 font-medium">
                            <Icon name="Package" size={14} className="mr-1.5" />
                            Каталог
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* SKU search */}
                    <div className="mt-4 relative">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            value={skuSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Введите артикул товара..."
                            className="pl-10 h-10 border-[#DDE0EA] rounded-lg focus:border-[#2F2C6A] focus:ring-1 focus:ring-[#2F2C6A]/20 text-sm"
                          />
                        </div>
                        <Button
                          className="h-10 bg-[#FFC107] hover:bg-[#e6ad06] text-[#2F2C6A] font-bold px-5 rounded-lg shadow-sm flex-shrink-0"
                          onClick={() => searchResults[0] && addToCart(searchResults[0])}
                          disabled={searchResults.length === 0}
                        >
                          <Icon name="Plus" size={15} className="mr-1.5" />
                          Добавить
                        </Button>
                      </div>

                      {/* Search dropdown */}
                      {searchResults.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#DDE0EA] rounded-xl shadow-xl z-20 overflow-hidden">
                          {searchResults.map((item) => (
                            <button
                              key={item.sku}
                              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F5F6F8] transition group text-left"
                              onClick={() => addToCart(item)}
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#2F2C6A] truncate">{item.name}</p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{item.sku}</p>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                <p className="text-sm font-bold text-[#2F2C6A]">
                                  {new Intl.NumberFormat("ru-RU").format(item.price)} ₽
                                </p>
                                <div className="w-7 h-7 rounded-full bg-[#2F2C6A] group-hover:bg-[#FFC107] flex items-center justify-center transition">
                                  <Icon name="Plus" size={13} className="text-white group-hover:text-[#2F2C6A]" />
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cart body */}
                  {cartItems.length === 0 ? (
                    /* Empty state */
                    <div className="py-20 flex flex-col items-center gap-4 text-center px-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#F5F6F8] flex items-center justify-center">
                        <Icon name="ShoppingCart" size={28} className="text-[#2F2C6A]/20" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#2F2C6A]/50">Корзина пуста</p>
                        <p className="text-sm text-gray-400 mt-1">Добавьте товары из каталога</p>
                      </div>
                      <Link to="/catalog">
                        <Button className="bg-[#2F2C6A] hover:bg-[#2F2C6A]/90 text-white font-bold h-10 px-6 rounded-lg mt-1">
                          <Icon name="Package" size={15} className="mr-2" />
                          Перейти в каталог
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    /* Items table */
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F5F6F8] border-b border-[#ECEEF4]">
                            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Товар</th>
                            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 min-w-[230px]">Упаковка</th>
                            <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Кол-во</th>
                            <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Цена</th>
                            <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Сумма</th>
                            <th className="w-12 px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F1F5]">
                          {cartItems.map((item, idx) => {
                            const activePkg = getPkgOption(item.pkg);
                            const pkgCount = item.pkg === "unit" ? item.qty : Math.floor(item.qty / activePkg.step);
                            const totalUnits = item.qty;

                            return (
                              <tr key={item.id} className="group hover:bg-[#FAFBFC] transition-colors">

                                {/* ── Товар ── */}
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-[#2F2C6A]/6 flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-[#2F2C6A]/30">{idx + 1}</span>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-[#2F2C6A] truncate">{item.name}</p>
                                      <p className="text-xs font-mono text-gray-400 mt-0.5">{item.sku}</p>
                                    </div>
                                  </div>
                                </td>

                                {/* ── Упаковка — segmented control ── */}
                                <td className="px-4 py-3.5">
                                  {/* Switcher */}
                                  <div className="flex items-stretch gap-0.5 bg-[#ECEEF4] rounded-lg p-0.5 w-fit">
                                    {PKG_OPTIONS.map((opt) => {
                                      const isActive = item.pkg === opt.type;
                                      return (
                                        <div key={opt.type} className="relative group/tip">
                                          <button
                                            onClick={() => !opt.disabled && updatePkg(item.id, opt.type)}
                                            disabled={opt.disabled}
                                            className={`
                                              relative flex flex-col items-center justify-center px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all select-none leading-tight
                                              ${isActive
                                                ? "bg-[#2F2C6A] text-white shadow-sm"
                                                : opt.disabled
                                                  ? "text-gray-300 cursor-not-allowed opacity-50"
                                                  : "text-[#2F2C6A]/60 hover:text-[#2F2C6A] hover:bg-white/60 cursor-pointer"
                                              }
                                            `}
                                          >
                                            <span className="font-bold">{opt.shortLabel}</span>
                                            {opt.type !== "unit" && (
                                              <span className={`text-[9px] font-medium mt-0.5 ${isActive ? "text-white/70" : "text-gray-400"}`}>
                                                {opt.step} шт
                                              </span>
                                            )}
                                          </button>
                                          {/* Tooltip для disabled */}
                                          {opt.disabled && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-[#2F2C6A] text-white text-[10px] rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover/tip:opacity-100 transition-opacity z-50 shadow-lg">
                                              Недоступно для данного клиента
                                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2F2C6A]" />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {/* Hint under switcher */}
                                  <p className="text-[10px] text-gray-400 mt-1.5 pl-0.5">
                                    {activePkg.hint}
                                  </p>
                                </td>

                                {/* ── Кол-во ── */}
                                <td className="px-4 py-3.5">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => updateQty(item.id, Math.max(activePkg.step, item.qty - activePkg.step))}
                                        className="w-7 h-7 rounded border border-[#DDE0EA] flex items-center justify-center text-[#2F2C6A] hover:border-[#2F2C6A] hover:bg-[#2F2C6A]/5 transition disabled:opacity-30"
                                        disabled={item.qty <= activePkg.step}
                                      >
                                        <Icon name="Minus" size={12} />
                                      </button>
                                      <Input
                                        type="number"
                                        min={activePkg.step}
                                        step={activePkg.step}
                                        value={item.qty}
                                        onChange={(e) => {
                                          const raw = parseInt(e.target.value) || activePkg.step;
                                          const snapped = Math.max(activePkg.step, Math.round(raw / activePkg.step) * activePkg.step);
                                          updateQty(item.id, snapped);
                                        }}
                                        className="w-14 h-7 text-center font-bold text-sm border-[#DDE0EA] focus:border-[#2F2C6A] rounded px-1"
                                      />
                                      <button
                                        onClick={() => updateQty(item.id, item.qty + activePkg.step)}
                                        className="w-7 h-7 rounded border border-[#DDE0EA] flex items-center justify-center text-[#2F2C6A] hover:border-[#2F2C6A] hover:bg-[#2F2C6A]/5 transition"
                                      >
                                        <Icon name="Plus" size={12} />
                                      </button>
                                    </div>
                                    {/* Пересчёт */}
                                    {item.pkg !== "unit" && (
                                      <p className="text-[10px] text-[#2F2C6A]/60 font-medium whitespace-nowrap">
                                        {pkgCount} {item.pkg === "box"
                                          ? pkgCount === 1 ? "короб." : "короб."
                                          : pkgCount === 1 ? "паллет" : "паллет"
                                        } = {totalUnits} шт
                                      </p>
                                    )}
                                  </div>
                                </td>

                                {/* ── Цена ── */}
                                <td className="px-4 py-3.5 text-right">
                                  <p className="text-sm font-semibold text-[#2F2C6A] whitespace-nowrap">
                                    {new Intl.NumberFormat("ru-RU").format(item.pricePerUnit)} ₽
                                  </p>
                                  <p className="text-xs text-gray-400">за шт.</p>
                                </td>

                                {/* ── Сумма ── */}
                                <td className="px-4 py-3.5 text-right">
                                  <p className="text-sm font-bold text-[#2F2C6A] whitespace-nowrap">
                                    {new Intl.NumberFormat("ru-RU").format(item.qty * item.pricePerUnit)} ₽
                                  </p>
                                </td>

                                {/* ── Удалить ── */}
                                <td className="px-4 py-3.5">
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <Icon name="Trash2" size={15} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>

                        {/* ── Подпись об упаковке ── */}
                        <tfoot>
                          <tr className="border-t border-[#F0F1F5]">
                            <td colSpan={6} className="px-6 py-2.5">
                              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                <Icon name="Info" size={13} className="text-[#2F2C6A]/30 flex-shrink-0" />
                                Упаковка определяет минимальный кратный объём заказа
                              </div>
                            </td>
                          </tr>
                          <tr className="bg-[#F5F6F8] border-t border-[#E2E4EE]">
                            <td colSpan={3} className="px-6 py-3.5">
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Итого позиций: {cartItems.length}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="text-xs text-gray-400">сумма</span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="text-base font-extrabold text-[#2F2C6A]">
                                {new Intl.NumberFormat("ru-RU").format(totalAmount)} ₽
                              </span>
                            </td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* Bottom row: 2 cards */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

                  {/* ── Параметры заказа ── */}
                  <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-6 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-[#F0F1F5]">
                      <div className="w-9 h-9 rounded-lg bg-[#2F2C6A]/8 flex items-center justify-center flex-shrink-0">
                        <Icon name="ClipboardList" size={17} className="text-[#2F2C6A]" />
                      </div>
                      <h3 className="text-base font-bold text-[#2F2C6A]">Параметры заказа</h3>
                    </div>

                    {/* Дата отгрузки */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Дата отгрузки
                      </label>
                      <div className="relative">
                        <Icon name="CalendarDays" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="date"
                          value={shipDate}
                          onChange={(e) => setShipDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="pl-10 h-10 border-[#DDE0EA] rounded-lg focus:border-[#2F2C6A] focus:ring-1 focus:ring-[#2F2C6A]/20 text-sm"
                          placeholder="Выберите дату"
                        />
                      </div>
                    </div>

                    {/* Тип заказа */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Тип заказа
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* Regular */}
                        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          orderType === "regular"
                            ? "border-[#2F2C6A] bg-[#2F2C6A]/4"
                            : "border-[#DDE0EA] hover:border-[#BABDCD]"
                        }`}>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <input
                              type="radio"
                              name="orderType"
                              value="regular"
                              checked={orderType === "regular"}
                              onChange={() => setOrderType("regular")}
                              className="w-4 h-4 accent-[#2F2C6A] flex-shrink-0 mt-0.5"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#2F2C6A]">Со склада</p>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Отгрузка с регионального склада, стандартные сроки</p>
                            </div>
                          </div>
                        </label>

                        {/* Direct */}
                        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          orderType === "direct"
                            ? "border-[#FFC107] bg-[#FFC107]/6"
                            : "border-[#DDE0EA] hover:border-[#BABDCD]"
                        }`}>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <input
                              type="radio"
                              name="orderType"
                              value="direct"
                              checked={orderType === "direct"}
                              onChange={() => setOrderType("direct")}
                              className="w-4 h-4 accent-[#FFC107] flex-shrink-0 mt-0.5"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-bold text-[#2F2C6A]">Прямой заказ</p>
                                {orderType === "direct" && (
                                  <button className="ml-auto text-[10px] font-bold bg-[#FFC107] text-[#2F2C6A] px-2.5 py-0.5 rounded-full flex-shrink-0">
                                    Выбрать
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Доставка 10–14 дней, возможна цена</p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {orderType === "direct" && (
                        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3.5 py-2.5 mt-1">
                          <Icon name="AlertCircle" size={13} className="flex-shrink-0" />
                          Сроки и итоговая цена согласуются с менеджером после отправки заказа
                        </div>
                      )}
                    </div>

                    {/* Комментарий */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Комментарий к заказу
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="Добавьте комментарий или особые требования к заказу..."
                        className="w-full border border-[#DDE0EA] rounded-lg px-3.5 py-3 text-sm text-[#2F2C6A] placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#2F2C6A] focus:ring-1 focus:ring-[#2F2C6A]/20 leading-relaxed"
                      />
                      <p className="text-xs text-gray-400 text-right">{comment.length} / 500</p>
                    </div>
                  </div>

                  {/* ── Итоги заказа ── */}
                  <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-[#F0F1F5]">
                      <div className="w-9 h-9 rounded-lg bg-[#2F2C6A]/8 flex items-center justify-center flex-shrink-0">
                        <Icon name="BarChart2" size={17} className="text-[#2F2C6A]" />
                      </div>
                      <h3 className="text-base font-bold text-[#2F2C6A]">Итоги заказа</h3>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Количество товаров</span>
                        <span className="text-sm font-bold text-[#2F2C6A]">{totalQty} шт.</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Общий вес</span>
                        <span className="text-sm font-bold text-[#2F2C6A]">
                          {totalWeight >= 1000
                            ? `${(totalWeight / 1000).toFixed(2)} т`
                            : `${totalWeight.toFixed(1)} кг`}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between bg-[#F5F6F8] rounded-lg px-4 py-3">
                        <span className="text-sm font-bold text-[#2F2C6A]">Сумма заказа</span>
                        <span className="text-xl font-extrabold text-[#2F2C6A]">
                          {new Intl.NumberFormat("ru-RU").format(totalAmount)} ₽
                        </span>
                      </div>
                    </div>

                    {/* Ship date summary */}
                    {shipDate && (
                      <div className="flex items-center gap-2 text-xs text-[#2F2C6A] bg-[#2F2C6A]/5 rounded-lg px-3.5 py-2.5">
                        <Icon name="CalendarCheck" size={13} className="flex-shrink-0" />
                        Отгрузка:{" "}
                        <strong>
                          {new Date(shipDate).toLocaleDateString("ru-RU", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </strong>
                      </div>
                    )}

                    {/* Order type badge */}
                    <div className={`flex items-center gap-2 text-xs rounded-lg px-3.5 py-2.5 ${
                      orderType === "direct"
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-[#F5F6F8] text-[#2F2C6A]"
                    }`}>
                      <Icon name={orderType === "direct" ? "Factory" : "Warehouse"} size={13} className="flex-shrink-0" />
                      {orderType === "direct" ? "Прямой заказ с производства" : "Отгрузка со склада"}
                    </div>

                    {/* CTAs */}
                    <div className="mt-auto space-y-2.5 pt-2">
                      <Button
                        className="w-full bg-[#FFC107] hover:bg-[#e6ad06] text-[#2F2C6A] font-bold h-11 rounded-lg shadow-sm text-sm"
                        disabled={cartItems.length === 0}
                      >
                        <Icon name="Send" size={15} className="mr-2" />
                        Отправить на согласование
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[#2F2C6A]/20 text-[#2F2C6A] hover:bg-[#2F2C6A]/5 h-10 rounded-lg font-medium text-sm"
                        onClick={() => saveDraft(false)}
                        disabled={cartItems.length === 0 || saveStatus === "saving"}
                      >
                        <Icon name="Save" size={15} className="mr-2" />
                        {editingDraftId ? "Обновить черновик" : "Сохранить черновик"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ── EXCEL TAB ── */}
              <TabsContent value="excel" className="mt-5">
                <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <Icon name="FileSpreadsheet" size={28} className="text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-[#2F2C6A] mb-2">Загрузка из Excel</h3>
                  <p className="text-sm text-gray-400 mb-5 max-w-sm mx-auto">
                    Загрузите файл Excel с артикулами и количеством. Поддерживаются форматы .xlsx и .xls
                  </p>
                  <Button className="bg-[#2F2C6A] hover:bg-[#2F2C6A]/90 text-white font-bold h-10 px-6 rounded-lg">
                    <Icon name="Upload" size={15} className="mr-2" />
                    Выбрать файл
                  </Button>
                  <p className="text-xs text-gray-400 mt-3">
                    <a href="#" className="underline">Скачать шаблон</a> для заполнения
                  </p>
                </div>
              </TabsContent>

              {/* ── 1С TAB ── */}
              <TabsContent value="1c" className="mt-5">
                <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Database" size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-[#2F2C6A] mb-2">Импорт из 1С</h3>
                  <p className="text-sm text-gray-400 mb-5 max-w-sm mx-auto">
                    Подключитесь к системе 1С для автоматического импорта заказов и синхронизации остатков
                  </p>
                  <Button className="bg-[#2F2C6A] hover:bg-[#2F2C6A]/90 text-white font-bold h-10 px-6 rounded-lg">
                    <Icon name="Plug" size={15} className="mr-2" />
                    Настроить интеграцию
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

          </div>
        </main>
      </div>
    </div>
  );
}
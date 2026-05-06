import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { draftStore, type Draft, type DraftItem, type PkgType } from "@/lib/draftStore";

/* ─── catalog reference (shared with B2BPortal) ─── */
const CATALOG_ITEMS = [
  { sku: "MN7707-4",   name: "MANNOL Energy Formula OP 5W-30 4L", price: 2490, weight: 4.2 },
  { sku: "MN7914-4",   name: "MANNOL Extreme 5W-40 4L",            price: 2750, weight: 4.2 },
  { sku: "MN7501-4",   name: "MANNOL Classic 10W-40 4L",           price: 1890, weight: 4.2 },
  { sku: "MN8212-1",   name: "MANNOL ATF AG52 1L",                 price:  890, weight: 1.1 },
  { sku: "MN4012-1",   name: "MANNOL Antifreeze AG12 1L",          price:  420, weight: 1.1 },
  { sku: "MN9900-035", name: "MANNOL Motor Flush 0.35L",           price:  560, weight: 0.5 },
];

const PKG_STEPS: Record<PkgType, number> = { unit: 1, box: 20, pallet: 200 };

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n));

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("ru-RU")}, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function isQtyValid(item: DraftItem): boolean {
  const step = PKG_STEPS[item.pkg] ?? 1;
  return item.qty > 0 && item.qty % step === 0;
}

/* ─── sidebar menu ─── */
const MENU = [
  { icon: "LayoutDashboard", label: "Главная",    path: "/" },
  { icon: "Package",         label: "Каталог",     path: "/catalog" },
  { icon: "ShoppingCart",    label: "Корзина",      path: "/b2b" },
  { icon: "FileText",        label: "Мои заказы",  path: "/orders", active: true },
  { icon: "FilePen",         label: "Черновики",   path: "/b2b/drafts" },
  { icon: "FileSpreadsheet", label: "Прайс-листы", path: "/payments" },
  { icon: "BarChart3",       label: "Аналитика",   path: "/analytics" },
  { icon: "Banknote",        label: "Оплаты",      path: "/payments" },
  { icon: "Settings",        label: "Настройки",   path: "/settings" },
];

type SaveStatus = "idle" | "saving" | "saved" | "unsaved";

export default function DraftOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* ─── layout state ─── */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ─── draft state ─── */
  const [draft, setDraft] = useState<Draft | null>(null);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [orderType, setOrderType] = useState<"regular" | "direct">("regular");
  const [shipDate, setShipDate] = useState("");
  const [comment, setComment] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState("");
  const [activeTab, setActiveTab] = useState("manual");

  /* ─── SKU search ─── */
  const [skuSearch, setSkuSearch] = useState("");
  const [searchResults, setSearchResults] = useState<typeof CATALOG_ITEMS>([]);

  /* ─── dialogs ─── */
  const [confirmSend, setConfirmSend] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  /* ── Load draft ── */
  useEffect(() => {
    if (!id) { navigate("/b2b/drafts"); return; }
    const d = draftStore.get(id);
    if (!d) { navigate("/b2b/drafts"); return; }
    setDraft(d);
    setItems(d.items);
    setOrderType(d.orderType);
    setShipDate(d.shipDate ?? "");
    setComment(d.comment ?? "");
    setLastSaved(fmtDate(d.updatedAt));
    setSaveStatus("saved");
  }, [id]);

  /* ── Auto-save trigger ── */
  useEffect(() => {
    if (isFirstLoad.current) { isFirstLoad.current = false; return; }
    setSaveStatus("unsaved");
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => handleSave(true), 120_000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [items, orderType, shipDate, comment]);

  /* ── Derived ── */
  const totalQty    = items.reduce((s, i) => s + i.qty, 0);
  const totalWeight = items.reduce((s, i) => s + i.qty * i.weightPerUnit, 0);
  const totalAmount = items.reduce((s, i) => s + i.qty * i.pricePerUnit, 0);
  const hasInvalid  = items.some(i => !isQtyValid(i));
  const canSend     = items.length > 0 && !hasInvalid;

  /* ── Save ── */
  const handleSave = useCallback((auto = false) => {
    if (!draft) return;
    setSaveStatus("saving");
    const updated: Draft = {
      ...draft,
      autoSaved: auto,
      orderType,
      shipDate: shipDate || undefined,
      comment: comment || undefined,
      items,
    };
    const saved = draftStore.save(updated);
    setDraft(saved);
    setLastSaved(fmtDate(saved.updatedAt));
    setSaveStatus("saved");
  }, [draft, items, orderType, shipDate, comment]);

  /* ── Send to processing ── */
  function handleSend() {
    if (!draft) return;
    draftStore.delete(draft.id);
    navigate("/orders", { state: { fromDraft: true, draftTitle: draft.title } });
  }

  /* ── Delete ── */
  function handleDelete() {
    if (draft) draftStore.delete(draft.id);
    navigate("/b2b/drafts");
  }

  /* ── Item manipulation ── */
  function updateQty(itemId: string, newQty: number) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, qty: Math.max(0, newQty) } : i));
  }

  function updatePkg(itemId: string, pkg: PkgType) {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      const step = PKG_STEPS[pkg];
      const aligned = Math.max(step, Math.ceil(i.qty / step) * step);
      return { ...i, pkg, qty: aligned };
    }));
  }

  function removeItem(itemId: string) {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }

  function handleSearch(val: string) {
    setSkuSearch(val);
    if (val.length < 2) { setSearchResults([]); return; }
    setSearchResults(
      CATALOG_ITEMS.filter(
        p => p.sku.toLowerCase().includes(val.toLowerCase()) ||
             p.name.toLowerCase().includes(val.toLowerCase())
      )
    );
  }

  function addItem(catalogItem: typeof CATALOG_ITEMS[0]) {
    setItems(prev => {
      const ex = prev.find(i => i.sku === catalogItem.sku);
      if (ex) return prev.map(i => i.sku === catalogItem.sku ? { ...i, qty: i.qty + 1 } : i);
      const newItem: DraftItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        sku: catalogItem.sku,
        name: catalogItem.name,
        qty: 1,
        pkg: "unit",
        pricePerUnit: catalogItem.price,
        weightPerUnit: catalogItem.weight,
      };
      return [...prev, newItem];
    });
    setSkuSearch("");
    setSearchResults([]);
  }

  if (!draft) return null;

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="min-h-screen bg-[#F5F6F8] flex font-sans">

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ──────── SIDEBAR ──────── */}
      <aside className={`fixed top-0 left-0 h-full bg-[#2F2C6A] text-white z-50 flex flex-col transition-all duration-300 shadow-xl ${sidebarOpen ? "w-60" : "w-[72px]"} ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className={`flex items-center border-b border-white/10 flex-shrink-0 ${sidebarOpen ? "gap-3 px-5 py-5" : "justify-center px-3 py-5"}`}>
          <div className="w-9 h-9 bg-[#FFC107] rounded-lg flex items-center justify-center font-extrabold text-[#2F2C6A] text-lg flex-shrink-0 shadow-md">M</div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="font-extrabold text-base leading-tight tracking-wide">MANNOL</p>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">B2B Partner</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU.map(item => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 mx-3 mb-0.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${item.active ? "bg-[#FFC107] text-[#2F2C6A]" : "text-white/70 hover:bg-white/10 hover:text-white"} ${!sidebarOpen && "justify-center px-0"}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon name={item.icon as never} size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

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

      {/* ──────── MAIN ──────── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-[72px]"}`}>

        {/* Header */}
        <header className="bg-white border-b border-[#E8E9EF] sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 rounded-lg hover:bg-[#F5F6F8] text-[#2F2C6A]" onClick={() => setMobileSidebarOpen(true)}>
                <Icon name="Menu" size={20} />
              </button>
              <div>
                <p className="text-xs text-gray-400 font-medium leading-none mb-0.5 hidden sm:block">MANNOL B2B</p>
                <h1 className="text-base font-bold text-[#2F2C6A] leading-tight">Личный кабинет партнёра</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button className="relative p-2 rounded-lg hover:bg-[#F5F6F8] text-gray-500 hover:text-[#2F2C6A]">
                <Icon name="Bell" size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFC107] rounded-full border-2 border-white" />
              </button>
              <Separator orientation="vertical" className="h-7 hidden md:block" />
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] text-gray-400 font-medium leading-none mb-0.5">ООО «АвтоСнаб Плюс»</p>
                  <p className="text-xs font-bold text-[#2F2C6A] leading-none">Петров И.П.</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#2F2C6A] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[11px] font-bold">ПИ</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ──────── CONTENT ──────── */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7 lg:p-8">
          <div className="max-w-[1200px] mx-auto space-y-5">

            {/* ── Breadcrumbs + page title ── */}
            <div>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                <Link to="/orders" className="hover:text-[#2F2C6A] transition font-medium">Мои заказы</Link>
                <Icon name="ChevronRight" size={13} className="text-gray-300" />
                <span className="text-[#2F2C6A] font-semibold">Черновик заказа</span>
              </div>

              {/* Title row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl font-extrabold text-[#2F2C6A] leading-tight truncate">{draft.title}</h2>
                      <Badge className="bg-[#FAEEDA] text-[#633806] border-0 text-xs font-bold px-2.5 py-1 flex-shrink-0">
                        Черновик
                      </Badge>
                    </div>
                    {/* Last saved */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {saveStatus === "saving" ? (
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Icon name="Loader" size={12} className="animate-spin" />
                          Сохранение...
                        </span>
                      ) : saveStatus === "unsaved" ? (
                        <span className="flex items-center gap-1.5 text-xs text-amber-600">
                          <Icon name="AlertCircle" size={12} />
                          Есть несохранённые изменения
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Icon name="CheckCircle" size={12} className="text-emerald-500" />
                          Сохранён: {lastSaved}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick actions top-right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(false)}
                    disabled={saveStatus === "saving"}
                    className="h-9 border-[#DDE0EA] text-[#2F2C6A] hover:bg-[#F5F6F8] text-xs font-semibold px-3 gap-1.5"
                  >
                    <Icon name="Save" size={13} />
                    {saveStatus === "saving" ? "Сохранение..." : "Сохранить"}
                  </Button>
                  <Link to="/b2b/drafts">
                    <Button variant="ghost" size="sm" className="h-9 text-gray-400 hover:text-[#2F2C6A] text-xs px-3 gap-1.5">
                      <Icon name="ArrowLeft" size={13} />
                      Все черновики
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Warning banner ── */}
            <div className="flex items-start gap-3 border-l-4 border-[#FFC107] bg-[#FAEEDA]/50 rounded-r-xl px-4 py-3.5">
              <Icon name="Info" size={16} className="text-[#B07C00] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#633806] leading-relaxed">
                <span className="font-bold">Это отдельный черновик</span> — он не смешивается с корзиной. При оформлении создаётся независимый заказ.
              </p>
            </div>

            {/* ── Invalid qty alert ── */}
            {hasInvalid && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <Icon name="AlertTriangle" size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">
                  Некоторые позиции имеют количество, не кратное упаковке. Исправьте перед отправкой.
                </p>
              </div>
            )}

            {/* ══════════ TWO-COLUMN LAYOUT ══════════ */}
            <div className="flex flex-col xl:flex-row gap-5 items-start">

              {/* ── LEFT column ── */}
              <div className="flex-1 min-w-0 space-y-5">

                {/* ── Tabs: add items ── */}
                <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F0F1F5]">
                    <div className="w-9 h-9 rounded-lg bg-[#2F2C6A]/6 flex items-center justify-center flex-shrink-0">
                      <Icon name="PackagePlus" size={17} className="text-[#2F2C6A]" />
                    </div>
                    <h3 className="text-base font-bold text-[#2F2C6A]">Добавить товар</h3>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-[#F5F6F8] border border-[#E8E9EF] rounded-lg p-1 h-auto gap-1 mb-4">
                      <TabsTrigger value="manual" className="rounded-md px-4 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#2F2C6A] data-[state=active]:shadow-sm text-gray-400">
                        По артикулу
                      </TabsTrigger>
                      <TabsTrigger value="catalog" className="rounded-md px-4 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#2F2C6A] data-[state=active]:shadow-sm text-gray-400">
                        Из каталога
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual">
                      <div className="relative">
                        <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          value={skuSearch}
                          onChange={e => handleSearch(e.target.value)}
                          placeholder="Введите артикул или название товара..."
                          className="pl-10 h-10 border-[#DDE0EA] rounded-lg focus:border-[#2F2C6A] text-sm"
                        />
                        {skuSearch && (
                          <button onClick={() => { setSkuSearch(""); setSearchResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <Icon name="X" size={15} />
                          </button>
                        )}
                      </div>
                      {searchResults.length > 0 && (
                        <div className="mt-2 border border-[#E8E9EF] rounded-xl overflow-hidden shadow-sm">
                          {searchResults.map(item => (
                            <button
                              key={item.sku}
                              onClick={() => addItem(item)}
                              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F5F6F8] transition border-b border-[#F0F1F5] last:border-0 text-left"
                            >
                              <div>
                                <p className="text-sm font-semibold text-[#2F2C6A]">{item.name}</p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{item.sku}</p>
                              </div>
                              <div className="text-right flex-shrink-0 ml-4">
                                <p className="text-sm font-bold text-[#2F2C6A]">{fmt(item.price)} ₽</p>
                                <p className="text-[10px] text-gray-400">за шт</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="catalog">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CATALOG_ITEMS.map(item => (
                          <button
                            key={item.sku}
                            onClick={() => addItem(item)}
                            className="flex items-center justify-between p-3 rounded-lg border border-[#E8E9EF] hover:border-[#2F2C6A]/30 hover:bg-[#F5F6F8] transition text-left gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#2F2C6A] truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{item.sku}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-sm font-bold text-[#2F2C6A]">{fmt(item.price)} ₽</span>
                              <div className="w-6 h-6 rounded-full bg-[#2F2C6A] flex items-center justify-center">
                                <Icon name="Plus" size={12} className="text-white" />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* ── Items table ── */}
                <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F1F5]">
                    <div className="w-9 h-9 rounded-lg bg-[#2F2C6A]/6 flex items-center justify-center flex-shrink-0">
                      <Icon name="ShoppingCart" size={17} className="text-[#2F2C6A]" />
                    </div>
                    <h3 className="text-base font-bold text-[#2F2C6A]">Состав черновика</h3>
                    {items.length > 0 && (
                      <Badge className="ml-auto bg-[#2F2C6A]/8 text-[#2F2C6A] border-0 text-xs font-bold">
                        {items.length} поз.
                      </Badge>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-14 text-center px-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#F5F6F8] flex items-center justify-center">
                        <Icon name="ShoppingCart" size={22} className="text-[#2F2C6A]/20" />
                      </div>
                      <p className="text-sm font-semibold text-[#2F2C6A]/40">Список пуст</p>
                      <p className="text-xs text-gray-400">Найдите товар выше и добавьте в черновик</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F5F6F8] border-b border-[#ECEEF4]">
                            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Товар / Артикул</th>
                            <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Упаковка</th>
                            <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Кол-во, шт</th>
                            <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Масса, кг</th>
                            <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Сумма</th>
                            <th className="w-10 px-3 py-3" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F6F8]">
                          {items.map(item => {
                            const step = PKG_STEPS[item.pkg] ?? 1;
                            const valid = isQtyValid(item);
                            const posWeight = +(item.qty * item.weightPerUnit).toFixed(1);
                            const posAmount = item.qty * item.pricePerUnit;

                            return (
                              <tr key={item.id} className={`group transition-colors ${valid ? "hover:bg-[#FAFBFC]" : "bg-red-50/60 hover:bg-red-50"}`}>
                                {/* Name */}
                                <td className="px-5 py-3.5">
                                  <p className="text-sm font-semibold text-[#2F2C6A] leading-tight">{item.name}</p>
                                  <p className="text-xs font-mono text-gray-400 mt-0.5">{item.sku}</p>
                                  {!valid && (
                                    <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
                                      <Icon name="AlertCircle" size={10} />
                                      Некратно упаковке ({step} шт)
                                    </p>
                                  )}
                                </td>

                                {/* Package type */}
                                <td className="px-4 py-3.5 text-center hidden md:table-cell">
                                  <select
                                    value={item.pkg}
                                    onChange={e => updatePkg(item.id, e.target.value as PkgType)}
                                    className="text-xs border border-[#DDE0EA] rounded-lg px-2 py-1.5 text-[#2F2C6A] font-medium focus:outline-none focus:border-[#2F2C6A] bg-white cursor-pointer"
                                  >
                                    <option value="unit">Штука (×1)</option>
                                    <option value="box">Коробка (×20)</option>
                                    <option value="pallet">Паллета (×200)</option>
                                  </select>
                                </td>

                                {/* Qty stepper */}
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => updateQty(item.id, item.qty - step)}
                                      className="w-7 h-7 rounded border border-[#DDE0EA] flex items-center justify-center text-[#2F2C6A] hover:border-[#2F2C6A] hover:bg-[#2F2C6A]/5 transition flex-shrink-0 disabled:opacity-40"
                                      disabled={item.qty <= step}
                                    >
                                      <Icon name="Minus" size={11} />
                                    </button>
                                    <input
                                      type="number"
                                      value={item.qty}
                                      min={1}
                                      onChange={e => updateQty(item.id, Number(e.target.value))}
                                      className={`w-14 h-7 text-center font-bold text-sm border rounded px-1 focus:outline-none focus:border-[#2F2C6A] ${valid ? "border-[#DDE0EA]" : "border-red-400 bg-red-50 text-red-700"}`}
                                    />
                                    <button
                                      onClick={() => updateQty(item.id, item.qty + step)}
                                      className="w-7 h-7 rounded border border-[#DDE0EA] flex items-center justify-center text-[#2F2C6A] hover:border-[#2F2C6A] hover:bg-[#2F2C6A]/5 transition flex-shrink-0"
                                    >
                                      <Icon name="Plus" size={11} />
                                    </button>
                                  </div>
                                </td>

                                {/* Weight */}
                                <td className="px-4 py-3.5 text-right">
                                  <p className="text-sm font-semibold text-[#2F2C6A] whitespace-nowrap">{posWeight} кг</p>
                                </td>

                                {/* Amount */}
                                <td className="px-4 py-3.5 text-right">
                                  <p className="text-sm font-bold text-[#2F2C6A] whitespace-nowrap">{fmt(posAmount)} ₽</p>
                                </td>

                                {/* Delete */}
                                <td className="px-3 py-3.5">
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        {/* Footer totals */}
                        <tfoot>
                          <tr className="border-t border-[#E2E4EE] bg-[#F5F6F8]">
                            <td colSpan={2} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                              Итого позиций: {items.length}
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-bold text-[#2F2C6A]">{totalQty} шт</td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-[#2F2C6A]">
                              {totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(2)} т` : `${totalWeight.toFixed(1)} кг`}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-base font-extrabold text-[#2F2C6A]">{fmt(totalAmount)} ₽</span>
                            </td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* ── Order params ── */}
                <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-6 space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-[#F0F1F5]">
                    <div className="w-9 h-9 rounded-lg bg-[#2F2C6A]/8 flex items-center justify-center flex-shrink-0">
                      <Icon name="ClipboardList" size={17} className="text-[#2F2C6A]" />
                    </div>
                    <h3 className="text-base font-bold text-[#2F2C6A]">Параметры заказа</h3>
                  </div>

                  {/* Ship date */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Дата отгрузки</label>
                    <div className="relative">
                      <Icon name="CalendarDays" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="date"
                        value={shipDate}
                        onChange={e => setShipDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="pl-10 h-10 border-[#DDE0EA] rounded-lg focus:border-[#2F2C6A] focus:ring-1 focus:ring-[#2F2C6A]/20 text-sm"
                      />
                    </div>
                  </div>

                  {/* Order type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Тип заказа</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${orderType === "regular" ? "border-[#2F2C6A] bg-[#2F2C6A]/4" : "border-[#DDE0EA] hover:border-[#BABDCD]"}`}>
                        <input type="radio" name="orderTypeD" value="regular" checked={orderType === "regular"} onChange={() => setOrderType("regular")} className="w-4 h-4 accent-[#2F2C6A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-[#2F2C6A]">Со склада</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Отгрузка с регионального склада, стандартные сроки</p>
                        </div>
                      </label>
                      <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${orderType === "direct" ? "border-[#FFC107] bg-[#FFC107]/6" : "border-[#DDE0EA] hover:border-[#BABDCD]"}`}>
                        <input type="radio" name="orderTypeD" value="direct" checked={orderType === "direct"} onChange={() => setOrderType("direct")} className="w-4 h-4 accent-[#FFC107] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-[#2F2C6A]">Прямой заказ</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Доставка 10–14 дней, цена согласуется</p>
                        </div>
                      </label>
                    </div>
                    {orderType === "direct" && (
                      <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3.5 py-2.5 mt-1">
                        <Icon name="AlertCircle" size={13} className="flex-shrink-0" />
                        Сроки и итоговая цена согласуются с менеджером после отправки
                      </div>
                    )}
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Комментарий</label>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Добавьте комментарий или особые требования..."
                      className="w-full border border-[#DDE0EA] rounded-lg px-3.5 py-3 text-sm text-[#2F2C6A] placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#2F2C6A] focus:ring-1 focus:ring-[#2F2C6A]/20 leading-relaxed"
                    />
                    <p className="text-xs text-gray-400 text-right">{comment.length} / 500</p>
                  </div>
                </div>

              </div>{/* /LEFT column */}

              {/* ── RIGHT column — summary + actions ── */}
              <div className="w-full xl:w-[220px] flex-shrink-0 space-y-4">

                {/* Summary card */}
                <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#F0F1F5]">
                    <h3 className="text-sm font-bold text-[#2F2C6A]">Итоги</h3>
                  </div>

                  <div className="divide-y divide-[#F5F6F8]">
                    {/* Positions */}
                    <div className="flex items-center justify-between px-5 py-3">
                      <span className="text-xs text-gray-500">Позиций</span>
                      <span className="text-sm font-bold text-[#2F2C6A]">{items.length}</span>
                    </div>

                    {/* Weight — green bg */}
                    <div className="flex items-center justify-between px-5 py-3 bg-emerald-50">
                      <span className="text-xs text-emerald-700 font-medium">Общая масса</span>
                      <span className="text-sm font-bold text-emerald-800">
                        {totalWeight >= 1000
                          ? `${(totalWeight / 1000).toFixed(2)} т`
                          : `${totalWeight.toFixed(1)} кг`}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="px-5 py-4 bg-[#F5F6F8]">
                      <p className="text-xs text-gray-500 mb-1">Сумма</p>
                      <p className="text-xl font-extrabold text-[#2F2C6A]">{fmt(totalAmount)} ₽</p>
                    </div>
                  </div>

                  {/* Ship date if set */}
                  {shipDate && (
                    <div className="px-5 py-3 border-t border-[#F0F1F5] flex items-center gap-2 text-xs text-[#2F2C6A]">
                      <Icon name="CalendarCheck" size={13} className="flex-shrink-0 text-[#2F2C6A]/50" />
                      {new Date(shipDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                    </div>
                  )}
                </div>

                {/* Actions card */}
                <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-4 space-y-2">

                  {/* Save */}
                  <Button
                    variant="outline"
                    className="w-full h-10 border-[#DDE0EA] text-[#2F2C6A] hover:bg-[#F5F6F8] font-semibold text-sm rounded-lg gap-2"
                    onClick={() => handleSave(false)}
                    disabled={saveStatus === "saving" || items.length === 0}
                  >
                    <Icon name="Save" size={15} />
                    Сохранить изменения
                  </Button>

                  <Separator className="my-1" />

                  {/* Send */}
                  <Button
                    className="w-full h-11 bg-[#F2C32A] hover:bg-[#e0b325] text-[#2F2C6A] font-bold text-sm rounded-lg gap-2 shadow-sm"
                    disabled={!canSend}
                    onClick={() => setConfirmSend(true)}
                    title={hasInvalid ? "Исправьте некратные количества" : undefined}
                  >
                    <Icon name="Send" size={15} />
                    Отправить в обработку
                  </Button>

                  <Separator className="my-1" />

                  {/* Delete */}
                  <Button
                    variant="outline"
                    className="w-full h-9 border-[#F09595] text-[#A32D2D] hover:bg-red-50 hover:border-[#A32D2D] font-semibold text-sm rounded-lg gap-2"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Icon name="Trash2" size={14} />
                    Удалить черновик
                  </Button>
                </div>

                {/* Hint if invalid */}
                {hasInvalid && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-3">
                    <Icon name="Ban" size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-600 leading-relaxed">
                      Кнопка «Отправить» заблокирована — исправьте количество так, чтобы оно было кратно коробке
                    </p>
                  </div>
                )}

              </div>{/* /RIGHT column */}
            </div>

          </div>
        </main>
      </div>

      {/* ═══ CONFIRM: Send ═══ */}
      <Dialog open={confirmSend} onOpenChange={setConfirmSend}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#2F2C6A]">
              <Icon name="Send" size={18} className="text-[#F2C32A]" />
              Отправить в обработку?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
              Заказ будет создан <span className="font-semibold text-[#2F2C6A]">отдельно от корзины</span>. После отправки черновик удалится.
              <br /><br />
              Продолжить?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 mt-2">
            <Button variant="outline" onClick={() => setConfirmSend(false)} className="flex-1 border-[#DDE0EA] text-[#2F2C6A]">
              Отмена
            </Button>
            <Button
              onClick={() => { setConfirmSend(false); handleSend(); }}
              className="flex-1 bg-[#F2C32A] hover:bg-[#e0b325] text-[#2F2C6A] font-bold"
            >
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ CONFIRM: Delete ═══ */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <Icon name="Trash2" size={18} className="text-red-500" />
              Удалить черновик?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
              Черновик <span className="font-semibold text-[#2F2C6A]">«{draft.title}»</span> будет удалён{" "}
              <span className="font-semibold text-red-600">без возможности восстановления</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 mt-2">
            <Button variant="outline" onClick={() => setConfirmDelete(false)} className="flex-1 border-[#DDE0EA] text-[#2F2C6A]">
              Отмена
            </Button>
            <Button
              onClick={() => { setConfirmDelete(false); handleDelete(); }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

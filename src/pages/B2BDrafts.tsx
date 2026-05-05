import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ─── sidebar menu ─── */
const MENU = [
  { icon: "LayoutDashboard", label: "Главная",    path: "/" },
  { icon: "Package",         label: "Каталог",     path: "/catalog" },
  { icon: "ShoppingCart",    label: "Корзина",      path: "/b2b" },
  { icon: "FileText",        label: "Мои заказы",  path: "/orders" },
  { icon: "FilePen",         label: "Черновики",   path: "/b2b/drafts", active: true },
  { icon: "FileSpreadsheet", label: "Прайс-листы", path: "/payments" },
  { icon: "BarChart3",       label: "Аналитика",   path: "/analytics" },
  { icon: "Banknote",        label: "Оплаты",      path: "/payments" },
  { icon: "Settings",        label: "Настройки",   path: "/settings" },
];

/* ─── mock drafts ─── */
interface DraftItem { sku: string; name: string; qty: number; pkg: string; price: number }
interface Draft {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  items: DraftItem[];
  totalAmount: number;
  totalQty: number;
  comment?: string;
  shipDate?: string;
  orderType: "regular" | "direct";
  autoSaved: boolean;
}

const MOCK_DRAFTS: Draft[] = [
  {
    id: "draft-001",
    title: "Заказ на апрель — моторные масла",
    updatedAt: "Сегодня, 14:32",
    createdAt: "04.05.2026",
    autoSaved: false,
    orderType: "regular",
    shipDate: "2026-05-12",
    comment: "Согласовать с логистом перед отправкой",
    totalAmount: 487500,
    totalQty: 220,
    items: [
      { sku: "MN7707-4", name: "MANNOL Energy Formula OP 5W-30 4L", qty: 80,  pkg: "Коробка", price: 2490 },
      { sku: "MN7914-4", name: "MANNOL Extreme 5W-40 4L",            qty: 60,  pkg: "Коробка", price: 2750 },
      { sku: "MN7501-4", name: "MANNOL Classic 10W-40 4L",           qty: 80,  pkg: "Штука",   price: 1890 },
    ],
  },
  {
    id: "draft-002",
    title: "Черновик",
    updatedAt: "Вчера, 09:15",
    createdAt: "03.05.2026",
    autoSaved: true,
    orderType: "direct",
    totalAmount: 68540,
    totalQty: 32,
    items: [
      { sku: "MN8212-1",   name: "MANNOL ATF AG52 1L",        qty: 20, pkg: "Штука",   price: 890 },
      { sku: "MN4012-1",   name: "MANNOL Antifreeze AG12 1L", qty: 12, pkg: "Штука",   price: 420 },
    ],
  },
  {
    id: "draft-003",
    title: "Спецзаказ — допродажи май",
    updatedAt: "02.05.2026",
    createdAt: "02.05.2026",
    autoSaved: false,
    orderType: "regular",
    shipDate: "2026-05-20",
    comment: "",
    totalAmount: 1120000,
    totalQty: 600,
    items: [
      { sku: "MN7707-4", name: "MANNOL Energy Formula OP 5W-30 4L", qty: 200, pkg: "Паллета", price: 2490 },
      { sku: "MN7501-4", name: "MANNOL Classic 10W-40 4L",           qty: 400, pkg: "Паллета", price: 1890 },
    ],
  },
  {
    id: "draft-004",
    title: "Черновик",
    updatedAt: "28.04.2026",
    createdAt: "28.04.2026",
    autoSaved: true,
    orderType: "regular",
    totalAmount: 11200,
    totalQty: 20,
    items: [
      { sku: "MN9900-035", name: "MANNOL Motor Flush 0.35L", qty: 20, pkg: "Штука", price: 560 },
    ],
  },
];

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export default function B2BDrafts() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>(MOCK_DRAFTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function deleteDraft(id: string) {
    setDrafts(prev => prev.filter(d => d.id !== id));
    setDeletingId(null);
  }

  function duplicateDraft(draft: Draft) {
    const copy: Draft = {
      ...draft,
      id: `draft-copy-${Date.now()}`,
      title: `${draft.title} (копия)`,
      updatedAt: "Только что",
      createdAt: new Date().toLocaleDateString("ru-RU"),
      autoSaved: false,
    };
    setDrafts(prev => [copy, ...prev]);
  }

  const autoSavedCount = drafts.filter(d => d.autoSaved).length;

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div className="min-h-screen bg-[#F5F6F8] flex font-sans">

      {/* ──── Mobile overlay ──── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ──────────────────── SIDEBAR ──────────────────── */}
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
          {MENU.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 mx-3 mb-0.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${item.active ? "bg-[#FFC107] text-[#2F2C6A]" : "text-white/70 hover:bg-white/10 hover:text-white"} ${!sidebarOpen && "justify-center px-0"}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon name={item.icon as never} size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
              {sidebarOpen && item.label === "Черновики" && drafts.length > 0 && (
                <span className="ml-auto bg-white/15 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {drafts.length}
                </span>
              )}
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

      {/* ──────────────────── MAIN ──────────────────── */}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F5F6F8]">
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

        {/* ──────────────────── CONTENT ──────────────────── */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7 lg:p-8">
          <div className="max-w-[1000px] mx-auto space-y-6">

            {/* Page heading */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Заказы</p>
                <h2 className="text-2xl font-extrabold text-[#2F2C6A] leading-tight">Черновики заказов</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {drafts.length > 0
                    ? `${drafts.length} черновик${drafts.length === 1 ? "" : drafts.length < 5 ? "а" : "ов"} · ${autoSavedCount > 0 ? `${autoSavedCount} автосохранено` : ""}`
                    : "Нет сохранённых черновиков"}
                </p>
              </div>
              <Button
                onClick={() => navigate("/b2b")}
                className="bg-[#FFC107] hover:bg-[#e6ad06] text-[#2F2C6A] font-bold h-10 px-5 rounded-lg shadow-sm"
              >
                <Icon name="Plus" size={15} className="mr-2" />
                Новый заказ
              </Button>
            </div>

            {/* ── Autosave notice ── */}
            {autoSavedCount > 0 && (
              <div className="flex items-start gap-3 bg-[#FFF8E1] border border-[#FFC107]/40 rounded-xl px-4 py-3.5">
                <Icon name="Info" size={16} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#7A5C00]">
                    {autoSavedCount} черновик{autoSavedCount === 1 ? " автосохранён" : "а автосохранено"}
                  </p>
                  <p className="text-xs text-[#9A7400] mt-0.5">
                    Система автоматически сохраняет незавершённые заказы. Вы можете продолжить их в любое время.
                  </p>
                </div>
              </div>
            )}

            {/* ── Empty state ── */}
            {drafts.length === 0 && (
              <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm py-24 flex flex-col items-center gap-4 text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F6F8] flex items-center justify-center">
                  <Icon name="FilePen" size={28} className="text-[#2F2C6A]/20" />
                </div>
                <div>
                  <p className="text-base font-bold text-[#2F2C6A]/50">Черновиков нет</p>
                  <p className="text-sm text-gray-400 mt-1">Начните формировать заказ — он автоматически сохранится как черновик</p>
                </div>
                <Button onClick={() => navigate("/b2b")} className="bg-[#2F2C6A] hover:bg-[#2F2C6A]/90 text-white font-bold h-10 px-6 rounded-lg mt-1">
                  <Icon name="Plus" size={15} className="mr-2" />
                  Создать заказ
                </Button>
              </div>
            )}

            {/* ── Drafts list ── */}
            {drafts.length > 0 && (
              <div className="space-y-3">
                {drafts.map((draft) => {
                  const isExpanded = expandedId === draft.id;
                  const isDeleting = deletingId === draft.id;

                  return (
                    <div
                      key={draft.id}
                      className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${isDeleting ? "border-red-200 bg-red-50/30" : "border-[#E8E9EF] hover:border-[#2F2C6A]/20"}`}
                    >
                      {/* ── Card header ── */}
                      <div className="px-5 py-4">
                        <div className="flex items-start gap-4">

                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${draft.autoSaved ? "bg-[#FFF8E1]" : "bg-[#2F2C6A]/6"}`}>
                            <Icon
                              name={draft.autoSaved ? "RefreshCw" : "FilePen"}
                              size={18}
                              className={draft.autoSaved ? "text-[#F59E0B]" : "text-[#2F2C6A]"}
                            />
                          </div>

                          {/* Title + meta */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-[#2F2C6A] truncate">{draft.title}</p>
                              {draft.autoSaved && (
                                <Badge className="bg-[#FFF8E1] text-[#B07C00] border-0 text-[10px] font-semibold px-2">
                                  Автосохранение
                                </Badge>
                              )}
                              <Badge className={`border-0 text-[10px] font-medium px-2 ${draft.orderType === "direct" ? "bg-purple-100 text-purple-700" : "bg-blue-50 text-blue-600"}`}>
                                {draft.orderType === "direct" ? "Прямой заказ" : "Стандартный"}
                              </Badge>
                            </div>

                            {/* Stats row */}
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Icon name="Clock" size={11} className="text-gray-400" />
                                {draft.updatedAt}
                              </span>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs text-gray-500">
                                <span className="font-semibold text-[#2F2C6A]">{draft.items.length}</span> позиц.
                              </span>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs text-gray-500">
                                <span className="font-semibold text-[#2F2C6A]">{draft.totalQty}</span> шт
                              </span>
                              {draft.shipDate && (
                                <>
                                  <span className="text-gray-300">·</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Icon name="CalendarDays" size={11} className="text-gray-400" />
                                    {new Date(draft.shipDate).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="text-right flex-shrink-0 hidden sm:block">
                            <p className="text-lg font-extrabold text-[#2F2C6A] leading-none">{fmt(draft.totalAmount)} ₽</p>
                            <p className="text-[11px] text-gray-400 mt-1">{draft.totalQty} шт</p>
                          </div>
                        </div>

                        {/* ── Action buttons ── */}
                        {!isDeleting ? (
                          <div className="flex items-center gap-2 mt-4">
                            <Button
                              onClick={() => navigate("/b2b")}
                              className="h-9 bg-[#2F2C6A] hover:bg-[#2F2C6A]/90 text-white text-sm font-bold px-4 rounded-lg flex-1 sm:flex-none"
                            >
                              <Icon name="PenLine" size={14} className="mr-1.5" />
                              Продолжить
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setExpandedId(isExpanded ? null : draft.id)}
                              className="h-9 border-[#DDE0EA] text-[#2F2C6A] text-sm font-medium px-3 rounded-lg hover:bg-[#F5F6F8]"
                            >
                              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} className="mr-1" />
                              {isExpanded ? "Скрыть" : "Состав"}
                            </Button>
                            <div className="ml-auto flex items-center gap-1">
                              <button
                                onClick={() => duplicateDraft(draft)}
                                title="Дублировать"
                                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#2F2C6A] hover:bg-[#F5F6F8] transition"
                              >
                                <Icon name="Copy" size={15} />
                              </button>
                              <button
                                onClick={() => setDeletingId(draft.id)}
                                title="Удалить"
                                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                              >
                                <Icon name="Trash2" size={15} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── Delete confirm ── */
                          <div className="flex items-center gap-3 mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                            <Icon name="AlertTriangle" size={16} className="text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700 font-medium flex-1">Удалить черновик «{draft.title}»?</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => setDeletingId(null)}
                                className="h-8 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
                              >
                                Отмена
                              </button>
                              <button
                                onClick={() => deleteDraft(draft.id)}
                                className="h-8 px-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── Expanded: items preview ── */}
                      {isExpanded && (
                        <div className="border-t border-[#F0F1F5]">
                          {/* Items table */}
                          <table className="w-full">
                            <thead>
                              <tr className="bg-[#F5F6F8]">
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-2.5">Товар</th>
                                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-2.5">Упаковка</th>
                                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-2.5">Кол-во</th>
                                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-2.5">Сумма</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F6F8]">
                              {draft.items.map((item, i) => (
                                <tr key={i} className="hover:bg-[#FAFBFC] transition-colors">
                                  <td className="px-5 py-3">
                                    <p className="text-sm font-semibold text-[#2F2C6A] truncate max-w-[280px]">{item.name}</p>
                                    <p className="text-xs font-mono text-gray-400 mt-0.5">{item.sku}</p>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="text-xs text-gray-500 bg-[#F5F6F8] px-2 py-1 rounded-lg">{item.pkg}</span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="text-sm font-bold text-[#2F2C6A]">{item.qty}</span>
                                    <span className="text-xs text-gray-400 ml-1">шт</span>
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <span className="text-sm font-bold text-[#2F2C6A]">{fmt(item.qty * item.price)} ₽</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t border-[#ECEEF4] bg-[#F5F6F8]">
                                <td colSpan={3} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  Итого
                                </td>
                                <td className="px-5 py-3 text-right">
                                  <span className="text-base font-extrabold text-[#2F2C6A]">{fmt(draft.totalAmount)} ₽</span>
                                </td>
                              </tr>
                            </tfoot>
                          </table>

                          {/* Comment if present */}
                          {draft.comment && (
                            <div className="px-5 py-3 border-t border-[#F0F1F5] flex items-start gap-2 bg-[#FAFBFC]">
                              <Icon name="MessageSquare" size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-500 italic">{draft.comment}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── How drafts work ── */}
            <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#2F2C6A]/6 flex items-center justify-center flex-shrink-0">
                  <Icon name="HelpCircle" size={17} className="text-[#2F2C6A]" />
                </div>
                <h3 className="text-sm font-bold text-[#2F2C6A]">Как работают черновики</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: "RefreshCw",
                    color: "bg-[#FFF8E1]",
                    iconColor: "text-[#F59E0B]",
                    title: "Автосохранение",
                    desc: "Система сохраняет незавершённый заказ автоматически каждые 2 минуты и при уходе со страницы",
                  },
                  {
                    icon: "PenLine",
                    color: "bg-[#EEF0FF]",
                    iconColor: "text-[#2F2C6A]",
                    title: "Продолжение работы",
                    desc: "Откройте любой черновик и продолжите с того места, где остановились — все позиции сохранены",
                  },
                  {
                    icon: "Send",
                    color: "bg-emerald-50",
                    iconColor: "text-emerald-600",
                    title: "Отправка заказа",
                    desc: "После отправки черновик автоматически удаляется и превращается в реальный заказ",
                  },
                ].map((step) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${step.color}`}>
                      <Icon name={step.icon as never} size={16} className={step.iconColor} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2F2C6A]">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

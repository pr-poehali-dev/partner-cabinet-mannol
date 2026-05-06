import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { draftStore, type Draft } from "@/lib/draftStore";

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

const PKG_LABEL: Record<string, string> = { unit: "Штука", box: "Коробка", pallet: "Паллета" };

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

function relativeDate(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 2)  return "Только что";
  if (mins < 60) return `${mins} мин. назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Сегодня, ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  const days = Math.floor(hours / 24);
  if (days === 1) return `Вчера, ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export default function B2BDrafts() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>(() => draftStore.getAll());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const reload = () => setDrafts(draftStore.getAll());

  function deleteDraft(id: string) {
    draftStore.delete(id);
    setDeletingId(null);
    reload();
  }

  function duplicateDraft(id: string) {
    draftStore.duplicate(id);
    reload();
  }

  function startRenaming(draft: Draft) {
    setEditingTitleId(draft.id);
    setTitleInput(draft.title);
  }

  function saveRename(id: string) {
    const draft = draftStore.get(id);
    if (!draft) return;
    draftStore.save({ ...draft, title: titleInput.trim() || draft.title });
    setEditingTitleId(null);
    reload();
  }

  const totalAmount = (d: Draft) => d.items.reduce((s, i) => s + i.qty * i.pricePerUnit, 0);
  const totalQty    = (d: Draft) => d.items.reduce((s, i) => s + i.qty, 0);

  const filtered = drafts.filter(d =>
    !searchQuery.trim() ||
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const autoSavedCount = drafts.filter(d => d.autoSaved).length;

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div className="min-h-screen bg-[#F5F6F8] flex font-sans">

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
          <div className="max-w-[960px] mx-auto space-y-6">

            {/* ── Page heading ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Заказы</p>
                <h2 className="text-2xl font-extrabold text-[#2F2C6A] leading-tight">Черновики</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {drafts.length > 0
                    ? `${drafts.length} черновик${drafts.length === 1 ? "" : drafts.length < 5 ? "а" : "ов"}${autoSavedCount > 0 ? ` · ${autoSavedCount} автосохранено` : ""}`
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

            {/* ── Search ── */}
            {drafts.length > 0 && (
              <div className="relative">
                <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию, товару, артикулу..."
                  className="pl-10 h-10 border-[#DDE0EA] rounded-xl text-sm focus:border-[#2F2C6A] bg-white"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Icon name="X" size={15} />
                  </button>
                )}
              </div>
            )}

            {/* ── Autosave notice ── */}
            {autoSavedCount > 0 && (
              <div className="flex items-start gap-3 bg-[#FFF8E1] border border-[#FFC107]/40 rounded-xl px-4 py-3.5">
                <Icon name="Info" size={16} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#7A5C00]">
                    {autoSavedCount === 1 ? "1 черновик автосохранён" : `${autoSavedCount} черновика автосохранено`}
                  </p>
                  <p className="text-xs text-[#9A7400] mt-0.5">
                    Система сохраняет незавершённые заказы автоматически. Продолжите в любое время.
                  </p>
                </div>
              </div>
            )}

            {/* ── Empty ── */}
            {drafts.length === 0 && (
              <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm py-24 flex flex-col items-center gap-4 text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F6F8] flex items-center justify-center">
                  <Icon name="FilePen" size={28} className="text-[#2F2C6A]/20" />
                </div>
                <div>
                  <p className="text-base font-bold text-[#2F2C6A]/50">Черновиков нет</p>
                  <p className="text-sm text-gray-400 mt-1">Начните формировать заказ — он автоматически сохранится</p>
                </div>
                <Button onClick={() => navigate("/b2b")} className="bg-[#2F2C6A] hover:bg-[#2F2C6A]/90 text-white font-bold h-10 px-6 rounded-lg mt-1">
                  <Icon name="Plus" size={15} className="mr-2" />
                  Создать заказ
                </Button>
              </div>
            )}

            {/* ── No search results ── */}
            {drafts.length > 0 && filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-[#E8E9EF] py-14 flex flex-col items-center gap-3 text-center px-6">
                <Icon name="SearchX" size={28} className="text-[#2F2C6A]/20" />
                <p className="text-sm font-semibold text-[#2F2C6A]/50">Ничего не найдено</p>
                <button onClick={() => setSearchQuery("")} className="text-xs text-[#2F2C6A] underline">Сбросить фильтр</button>
              </div>
            )}

            {/* ── Draft list ── */}
            {filtered.length > 0 && (
              <div className="space-y-3">
                {filtered.map((draft) => {
                  const isExpanded = expandedId === draft.id;
                  const isDeleting = deletingId === draft.id;
                  const isRenamingThis = editingTitleId === draft.id;
                  const amt = totalAmount(draft);
                  const qty = totalQty(draft);

                  return (
                    <div
                      key={draft.id}
                      className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${isDeleting ? "border-red-200 bg-red-50/30" : "border-[#E8E9EF] hover:border-[#2F2C6A]/20"}`}
                    >
                      {/* ── Card header ── */}
                      <div className="px-5 py-4">
                        <div className="flex items-start gap-3">

                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${draft.autoSaved ? "bg-[#FFF8E1]" : "bg-[#2F2C6A]/6"}`}>
                            <Icon name={draft.autoSaved ? "RefreshCw" : "FilePen"} size={17} className={draft.autoSaved ? "text-[#F59E0B]" : "text-[#2F2C6A]"} />
                          </div>

                          {/* Title + meta */}
                          <div className="flex-1 min-w-0">
                            {/* Title: editable inline */}
                            {isRenamingThis ? (
                              <div className="flex items-center gap-2 mb-1">
                                <input
                                  autoFocus
                                  value={titleInput}
                                  onChange={e => setTitleInput(e.target.value)}
                                  onBlur={() => saveRename(draft.id)}
                                  onKeyDown={e => {
                                    if (e.key === "Enter") saveRename(draft.id);
                                    if (e.key === "Escape") setEditingTitleId(null);
                                  }}
                                  className="text-sm font-bold text-[#2F2C6A] bg-transparent border-b-2 border-[#2F2C6A]/40 focus:border-[#2F2C6A] outline-none min-w-0 flex-1 py-0.5"
                                  maxLength={60}
                                />
                                <button onClick={() => saveRename(draft.id)} className="text-[11px] font-semibold text-white bg-[#2F2C6A] px-2.5 py-1 rounded-lg flex-shrink-0">ОК</button>
                                <button onClick={() => setEditingTitleId(null)} className="text-[11px] text-gray-400 hover:text-gray-600 px-1 flex-shrink-0">✕</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="text-sm font-bold text-[#2F2C6A] truncate max-w-[280px]">{draft.title}</p>
                                <button
                                  onClick={() => startRenaming(draft)}
                                  className="text-gray-300 hover:text-[#2F2C6A]/50 transition flex-shrink-0"
                                  title="Переименовать"
                                >
                                  <Icon name="Pencil" size={12} />
                                </button>
                                {draft.autoSaved && (
                                  <Badge className="bg-[#FFF8E1] text-[#B07C00] border-0 text-[10px] font-semibold px-2">
                                    Авто
                                  </Badge>
                                )}
                                <Badge className={`border-0 text-[10px] font-medium px-2 ${draft.orderType === "direct" ? "bg-purple-100 text-purple-700" : "bg-blue-50 text-blue-600"}`}>
                                  {draft.orderType === "direct" ? "Прямой" : "Со склада"}
                                </Badge>
                              </div>
                            )}

                            {/* Meta row */}
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Icon name="Clock" size={11} />
                                {relativeDate(draft.updatedAt)}
                              </span>
                              <span className="text-gray-200">·</span>
                              <span className="text-xs text-gray-500">
                                <span className="font-semibold text-[#2F2C6A]">{draft.items.length}</span> позиц.
                              </span>
                              <span className="text-gray-200">·</span>
                              <span className="text-xs text-gray-500">
                                <span className="font-semibold text-[#2F2C6A]">{qty}</span> шт
                              </span>
                              {draft.shipDate && (
                                <>
                                  <span className="text-gray-200">·</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <Icon name="CalendarDays" size={11} />
                                    {new Date(draft.shipDate).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="text-right flex-shrink-0 hidden sm:block">
                            <p className="text-lg font-extrabold text-[#2F2C6A] leading-none">{fmt(amt)} ₽</p>
                            <p className="text-[11px] text-gray-400 mt-1">{qty} шт</p>
                          </div>
                        </div>

                        {/* ── Actions ── */}
                        {!isDeleting ? (
                          <div className="flex items-center gap-2 mt-4">
                            {/* Primary: open draft page */}
                            <Button
                              onClick={() => navigate(`/orders/drafts/${draft.id}`)}
                              className="h-9 bg-[#2F2C6A] hover:bg-[#26236b] text-white text-xs font-bold px-4 rounded-lg gap-1.5"
                            >
                              <Icon name="ExternalLink" size={13} />
                              Открыть
                            </Button>

                            {/* Edit in cart editor */}
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/b2b?draftId=${draft.id}`)}
                              className="h-9 border-[#DDE0EA] text-[#2F2C6A] text-xs font-medium px-3 rounded-lg hover:bg-[#F5F6F8] gap-1.5"
                            >
                              <Icon name="PenLine" size={13} />
                              Редактировать
                            </Button>

                            {/* Secondary: expand */}
                            <Button
                              variant="outline"
                              onClick={() => setExpandedId(isExpanded ? null : draft.id)}
                              className="h-9 border-[#DDE0EA] text-[#2F2C6A] text-xs font-medium px-3 rounded-lg hover:bg-[#F5F6F8] gap-1"
                            >
                              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={13} />
                              {isExpanded ? "Скрыть" : "Состав"}
                            </Button>

                            {/* Amount mobile */}
                            <span className="sm:hidden ml-auto text-base font-extrabold text-[#2F2C6A]">{fmt(amt)} ₽</span>

                            {/* Context menu */}
                            <div className="ml-auto sm:ml-2 flex items-center gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#2F2C6A] hover:bg-[#F5F6F8] transition">
                                    <Icon name="MoreHorizontal" size={16} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => navigate(`/orders/drafts/${draft.id}`)}>
                                    <Icon name="ExternalLink" size={14} className="mr-2" />
                                    Открыть черновик
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/b2b?draftId=${draft.id}`)}>
                                    <Icon name="PenLine" size={14} className="mr-2" />
                                    Редактировать
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => startRenaming(draft)}>
                                    <Icon name="Pencil" size={14} className="mr-2" />
                                    Переименовать
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => duplicateDraft(draft.id)}>
                                    <Icon name="Copy" size={14} className="mr-2" />
                                    Дублировать
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setDeletingId(draft.id)}
                                    className="text-red-500 focus:text-red-500"
                                  >
                                    <Icon name="Trash2" size={14} className="mr-2" />
                                    Удалить
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ) : (
                          /* Delete confirm */
                          <div className="flex items-center gap-3 mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                            <Icon name="AlertTriangle" size={15} className="text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-700 font-medium flex-1 min-w-0 truncate">
                              Удалить «{draft.title}»?
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => setDeletingId(null)}
                                className="h-8 px-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
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

                      {/* ── Expanded: composition ── */}
                      {isExpanded && (
                        <div className="border-t border-[#F0F1F5]">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-[#F5F6F8]">
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-2.5">Товар</th>
                                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Упаковка</th>
                                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-2.5">Кол-во</th>
                                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-2.5">Сумма</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F6F8]">
                              {draft.items.map((item, i) => (
                                <tr key={i} className="hover:bg-[#FAFBFC] transition-colors">
                                  <td className="px-5 py-3">
                                    <p className="text-sm font-semibold text-[#2F2C6A] truncate max-w-[240px]">{item.name}</p>
                                    <p className="text-xs font-mono text-gray-400 mt-0.5">{item.sku}</p>
                                  </td>
                                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                                    <span className="text-xs text-gray-500 bg-[#F5F6F8] px-2 py-1 rounded-lg">
                                      {PKG_LABEL[item.pkg] ?? item.pkg}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="text-sm font-bold text-[#2F2C6A]">{item.qty}</span>
                                    <span className="text-xs text-gray-400 ml-1">шт</span>
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <span className="text-sm font-bold text-[#2F2C6A]">{fmt(item.qty * item.pricePerUnit)} ₽</span>
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
                                  <span className="text-base font-extrabold text-[#2F2C6A]">{fmt(amt)} ₽</span>
                                </td>
                              </tr>
                            </tfoot>
                          </table>

                          {/* Comment */}
                          {draft.comment && (
                            <div className="px-5 py-3 border-t border-[#F0F1F5] flex items-start gap-2 bg-[#FAFBFC]">
                              <Icon name="MessageSquare" size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-500 italic">{draft.comment}</p>
                            </div>
                          )}

                          {/* Quick edit CTA inside expanded */}
                          <div className="px-5 py-3.5 border-t border-[#F0F1F5] bg-[#FAFBFC] flex items-center justify-between gap-3">
                            <p className="text-xs text-gray-400">Хотите изменить состав или параметры?</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                onClick={() => navigate(`/orders/drafts/${draft.id}`)}
                                size="sm"
                                className="h-8 bg-[#2F2C6A] hover:bg-[#26236b] text-white text-xs font-bold px-3 gap-1.5"
                              >
                                <Icon name="ExternalLink" size={12} />
                                Открыть
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── How it works ── */}
            <div className="bg-white rounded-xl border border-[#E8E9EF] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#2F2C6A]/6 flex items-center justify-center flex-shrink-0">
                  <Icon name="HelpCircle" size={17} className="text-[#2F2C6A]" />
                </div>
                <h3 className="text-sm font-bold text-[#2F2C6A]">Как работать с черновиками</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { icon: "RefreshCw",  color: "bg-[#FFF8E1]", ic: "text-[#F59E0B]", title: "Автосохранение",   desc: "Заказ сохраняется автоматически каждые 2 минуты" },
                  { icon: "Pencil",     color: "bg-[#EEF0FF]", ic: "text-[#2F2C6A]", title: "Переименование",   desc: "Нажмите карандашик рядом с названием" },
                  { icon: "PenLine",    color: "bg-[#EEF0FF]", ic: "text-[#2F2C6A]", title: "Редактирование",   desc: "Кнопка «Редактировать» открывает полный редактор" },
                  { icon: "Send",       color: "bg-emerald-50", ic: "text-emerald-600", title: "Отправка",       desc: "После отправки черновик удаляется автоматически" },
                ].map(step => (
                  <div key={step.title} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${step.color}`}>
                      <Icon name={step.icon as never} size={15} className={step.ic} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2F2C6A]">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
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
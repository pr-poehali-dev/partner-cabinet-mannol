import { useState } from "react";
import { Link } from "react-router-dom";
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

/* ─── types ─── */
interface CartItem {
  id: string;
  sku: string;
  name: string;
  qty: number;
  pricePerUnit: number;
  weightPerUnit: number;
}

/* ─── sidebar menu ─── */
const MENU = [
  { icon: "LayoutDashboard", label: "Главная",      path: "/" },
  { icon: "Package",         label: "Каталог",       path: "/catalog" },
  { icon: "ShoppingCart",    label: "Корзина",        path: "/b2b",    active: true },
  { icon: "FileText",        label: "Мои заказы",    path: "/orders" },
  { icon: "FileSpreadsheet", label: "Прайс-листы",   path: "/payments" },
  { icon: "BarChart3",       label: "Аналитика",     path: "/analytics" },
  { icon: "Banknote",        label: "Оплаты",        path: "/payments" },
  { icon: "Settings",        label: "Настройки",     path: "/settings" },
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

export default function B2BPortal() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [skuSearch, setSkuSearch] = useState("");
  const [searchResults, setSearchResults] = useState<typeof CATALOG_ITEMS>([]);
  const [orderType, setOrderType] = useState<"regular" | "direct">("regular");
  const [shipDate, setShipDate] = useState("");
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("manual");

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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Заказы</p>
                <h2 className="text-2xl font-extrabold text-[#2F2C6A] leading-tight">Формирование заказа</h2>
                <p className="text-sm text-gray-500 mt-1">Создание нового заказа</p>
              </div>
              {cartItems.length > 0 && (
                <Badge className="bg-[#FFC107]/15 text-[#2F2C6A] border border-[#FFC107]/40 font-bold text-sm px-3 py-1.5 h-auto">
                  <Icon name="ShoppingCart" size={14} className="mr-1.5" />
                  {totalQty} позиций · {new Intl.NumberFormat("ru-RU").format(totalAmount)} ₽
                </Badge>
              )}
            </div>

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
                            <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Кол-во</th>
                            <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Цена</th>
                            <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Сумма</th>
                            <th className="w-12 px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F1F5]">
                          {cartItems.map((item, idx) => (
                            <tr key={item.id} className="group hover:bg-[#FAFBFC] transition-colors">
                              <td className="px-6 py-4">
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
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                    className="w-7 h-7 rounded border border-[#DDE0EA] flex items-center justify-center text-[#2F2C6A] hover:border-[#2F2C6A] hover:bg-[#2F2C6A]/5 transition disabled:opacity-30"
                                    disabled={item.qty <= 1}
                                  >
                                    <Icon name="Minus" size={12} />
                                  </button>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={item.qty}
                                    onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                                    className="w-14 h-7 text-center font-bold text-sm border-[#DDE0EA] focus:border-[#2F2C6A] rounded px-1"
                                  />
                                  <button
                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                    className="w-7 h-7 rounded border border-[#DDE0EA] flex items-center justify-center text-[#2F2C6A] hover:border-[#2F2C6A] hover:bg-[#2F2C6A]/5 transition"
                                  >
                                    <Icon name="Plus" size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <p className="text-sm font-semibold text-[#2F2C6A] whitespace-nowrap">
                                  {new Intl.NumberFormat("ru-RU").format(item.pricePerUnit)} ₽
                                </p>
                                <p className="text-xs text-gray-400">за шт.</p>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <p className="text-sm font-bold text-[#2F2C6A] whitespace-nowrap">
                                  {new Intl.NumberFormat("ru-RU").format(item.qty * item.pricePerUnit)} ₽
                                </p>
                              </td>
                              <td className="px-4 py-4">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Icon name="Trash2" size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#F5F6F8] border-t-2 border-[#E2E4EE]">
                            <td colSpan={2} className="px-6 py-3.5">
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
                      >
                        <Icon name="Save" size={15} className="mr-2" />
                        Сохранить черновик
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
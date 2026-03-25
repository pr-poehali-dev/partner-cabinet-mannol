import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import { formatCurrency } from "@/types/order";

/* ─────────────────────────────── types ─── */
interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  unit: string;
  isBackorder: boolean;
}

interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  unit: string;
  inStock: boolean;
  stock: number;
  category: string;
}

type OrderStatus = "draft" | "pending" | "confirmed" | "urgent";
type OrderType = "regular" | "direct";

interface StatusOption {
  value: OrderStatus;
  label: string;
  description: string;
  color: string;
  bg: string;
  icon: string;
}

/* ─────────────────────────────── mock data ─── */
const MOCK_CATALOG: CatalogProduct[] = [
  { id: "p1", name: "Моторное масло MANNOL 5W-30 4л", sku: "MN7707-4", price: 2490, unit: "шт", inStock: true, stock: 240, category: "Масла моторные" },
  { id: "p2", name: "Моторное масло MANNOL 5W-40 4л", sku: "MN7914-4", price: 2750, unit: "шт", inStock: true, stock: 185, category: "Масла моторные" },
  { id: "p3", name: "Трансмиссионное масло MANNOL ATF-A 1л", sku: "MN8212-1", price: 890, unit: "шт", inStock: true, stock: 72, category: "Масла трансмиссионные" },
  { id: "p4", name: "Тормозная жидкость MANNOL DOT 4 0.5л", sku: "MN8812-05", price: 320, unit: "шт", inStock: true, stock: 310, category: "Тормозные жидкости" },
  { id: "p5", name: "Антифриз MANNOL AF12 Plus 1л", sku: "MN4012-1", price: 420, unit: "шт", inStock: false, stock: 0, category: "Антифриз" },
  { id: "p6", name: "Промывка двигателя MANNOL Motor Flush 0.35л", sku: "MN9900-035", price: 560, unit: "шт", inStock: true, stock: 44, category: "Автохимия" },
  { id: "p7", name: "Очиститель карбюратора MANNOL 400мл", sku: "MN9678-04", price: 380, unit: "шт", inStock: true, stock: 96, category: "Автохимия" },
  { id: "p8", name: "Моторное масло MANNOL Classic 10W-40 4л", sku: "MN7501-4", price: 1890, unit: "шт", inStock: true, stock: 320, category: "Масла моторные" },
];

const DEFAULT_ITEMS: OrderItem[] = [
  { id: "i1", name: "Моторное масло MANNOL 5W-30 4л", sku: "MN7707-4", price: 2490, quantity: 10, unit: "шт", isBackorder: false },
  { id: "i2", name: "Моторное масло MANNOL 5W-40 4л", sku: "MN7914-4", price: 2750, quantity: 5, unit: "шт", isBackorder: false },
  { id: "i3", name: "Антифриз MANNOL AF12 Plus 1л", sku: "MN4012-1", price: 420, quantity: 20, unit: "шт", isBackorder: true },
];

const DISCOUNT_PERCENT = 7;

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "pending",
    label: "На согласование",
    description: "Заказ отправляется менеджеру для проверки и подтверждения",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: "Clock",
  },
  {
    value: "confirmed",
    label: "Подтверждён",
    description: "Заказ сразу помечается как подтверждённый, формируется в очередь отгрузки",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: "CheckCircle",
  },
  {
    value: "urgent",
    label: "Срочный",
    description: "Приоритетная обработка, менеджер получает уведомление немедленно",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: "Zap",
  },
  {
    value: "draft",
    label: "Черновик",
    description: "Заказ сохраняется без отправки, вы сможете вернуться к нему позже",
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
    icon: "FileEdit",
  },
];

/* ═══════════════════════════════════════════════════════════ */
export default function OrderNew() {
  const navigate = useNavigate();

  const [items, setItems] = useState<OrderItem[]>(DEFAULT_ITEMS);
  const [search, setSearch] = useState("");
  const [comment, setComment] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [shipDate, setShipDate] = useState("");
  const [manager] = useState("Иванова Мария Сергеевна");

  const [orderType, setOrderType] = useState<OrderType>("regular");

  // confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");

  const today = new Date().toISOString().split("T")[0];

  const filteredCatalog = MOCK_CATALOG.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const showCatalog = search.length > 1;

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const discount = Math.round(subtotal * (DISCOUNT_PERCENT / 100));
  const total = subtotal - discount;
  const totalQty = items.reduce((s, it) => s + it.quantity, 0);

  /* ── handlers ── */
  function updateQty(id: string, val: string) {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) return;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: num } : it)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.success("Позиция удалена из заказа");
  }

  function addFromCatalog(product: CatalogProduct) {
    const exists = items.find((it) => it.sku === product.sku && !it.isBackorder);
    if (exists) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === exists.id ? { ...it, quantity: it.quantity + 1 } : it
        )
      );
      toast.success("Количество увеличено", { description: product.name });
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `i${Date.now()}`,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1,
          unit: product.unit,
          isBackorder: !product.inStock,
        },
      ]);
      toast.success("Товар добавлен в заказ", { description: product.name });
    }
    setSearch("");
  }

  function handleSaveDraft() {
    toast.success("Черновик сохранён", {
      description: "Заказ доступен в разделе «Мои заказы → Черновики»",
    });
  }

  function handleOpenConfirm() {
    if (!counterparty) { toast.error("Укажите контрагента", { description: "Выберите организацию из списка" }); return; }
    if (!warehouse) { toast.error("Выберите склад отгрузки"); return; }
    if (!shipDate) { toast.error("Укажите желаемую дату отгрузки"); return; }
    if (items.length === 0) { toast.error("Состав заказа пуст", { description: "Добавьте хотя бы один товар" }); return; }
    setConfirmOpen(true);
  }

  function handleConfirmCreate() {
    setConfirmOpen(false);
    const statusLabel = STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.label ?? "";
    toast.success("Заказ создан!", {
      description: `ORD-2026-0216 · ${statusLabel}`,
    });
    setTimeout(() => navigate("/orders"), 1200);
  }

  const shipDateFormatted = shipDate
    ? new Date(shipDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    : "не указана";

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === selectedStatus)!;

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F4F4F4]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">

          {/* ── Breadcrumbs ── */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/orders" className="hover:text-[#27265C] transition-colors font-medium">
              Заказы
            </Link>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
            <span className="text-[#27265C] font-semibold">Новый заказ</span>
          </nav>

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#27265C] leading-tight">
                Новый заказ
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Заполните информацию о заказе и добавьте товары
              </p>
            </div>

            {/* Header actions */}
            <div className="flex flex-wrap gap-3 sm:flex-shrink-0">
              <Button
                variant="outline"
                size="lg"
                className="border-[#27265C]/25 text-[#27265C] hover:bg-[#27265C]/6 hover:border-[#27265C]/40 h-11 px-5 font-medium"
                onClick={handleSaveDraft}
              >
                <Icon name="Save" size={17} className="mr-2.5 flex-shrink-0" />
                Сохранить черновик
              </Button>
              <Button
                size="lg"
                className="bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-11 px-6 shadow-sm"
                onClick={handleOpenConfirm}
              >
                <Icon name="Send" size={17} className="mr-2.5 flex-shrink-0" />
                Создать заказ
              </Button>
            </div>
          </div>

          {/* ── 2-Column Layout ── */}
          <div className="flex flex-col lg:flex-row gap-7 items-start">

            {/* ╔══════════════ LEFT COLUMN ══════════════╗ */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* ── Card 1: Основная информация ── */}
              <Card className="shadow-sm border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-5 bg-white border-b border-[#F0F0F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#27265C]/8 flex items-center justify-center flex-shrink-0">
                      <Icon name="FileText" size={17} className="text-[#27265C]" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-[#27265C]">
                        Основная информация
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Укажите контрагента, склад и дату отгрузки
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-6 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#27265C]/70 uppercase tracking-wider">
                        Контрагент <span className="text-red-500">*</span>
                      </label>
                      <Select value={counterparty} onValueChange={setCounterparty}>
                        <SelectTrigger className="h-11 border-[#E2E2E2] rounded-lg focus:border-[#27265C] focus:ring-1 focus:ring-[#27265C]/20 bg-white">
                          <SelectValue placeholder="Выберите организацию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ooo-avtodetal">ООО «Автодеталь»</SelectItem>
                          <SelectItem value="ip-sidorov">ИП Сидоров А.В.</SelectItem>
                          <SelectItem value="zao-motortorg">ЗАО «Моторторг»</SelectItem>
                          <SelectItem value="ooo-specauto">ООО «Спецавто»</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#27265C]/70 uppercase tracking-wider">
                        Склад отгрузки <span className="text-red-500">*</span>
                      </label>
                      <Select value={warehouse} onValueChange={setWarehouse}>
                        <SelectTrigger className="h-11 border-[#E2E2E2] rounded-lg focus:border-[#27265C] focus:ring-1 focus:ring-[#27265C]/20 bg-white">
                          <SelectValue placeholder="Выберите склад" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="msk-main">Москва — Главный склад</SelectItem>
                          <SelectItem value="msk-south">Москва — Склад Юг</SelectItem>
                          <SelectItem value="spb">Санкт-Петербург</SelectItem>
                          <SelectItem value="ekb">Екатеринбург</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#27265C]/70 uppercase tracking-wider">
                        Желаемая дата отгрузки <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        min={today}
                        value={shipDate}
                        onChange={(e) => setShipDate(e.target.value)}
                        className="h-11 border-[#E2E2E2] rounded-lg focus:border-[#27265C] focus:ring-1 focus:ring-[#27265C]/20 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#27265C]/70 uppercase tracking-wider">
                        Менеджер
                      </label>
                      <div className="h-11 px-3 flex items-center gap-2.5 rounded-lg border border-[#E2E2E2] bg-[#FAFAFA]">
                        <div className="w-7 h-7 rounded-full bg-[#27265C] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] font-bold">ИМ</span>
                        </div>
                        <span className="text-sm text-[#27265C] font-medium truncate">{manager}</span>
                        <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-0 text-[10px] font-semibold px-2 flex-shrink-0">
                          онлайн
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── Card 1b: Тип заказа ── */}
              <Card className="shadow-sm border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-5 bg-white border-b border-[#F0F0F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#27265C]/8 flex items-center justify-center flex-shrink-0">
                      <Icon name="Truck" size={17} className="text-[#27265C]" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-[#27265C]">
                        Тип заказа
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Выберите схему поставки
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-5 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* Regular */}
                    <button
                      type="button"
                      onClick={() => setOrderType("regular")}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        orderType === "regular"
                          ? "border-[#27265C] bg-[#27265C]/5"
                          : "border-[#E8E8E8] bg-white hover:border-[#C8C8C8]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          orderType === "regular" ? "bg-[#27265C]" : "bg-[#F4F4F4]"
                        }`}>
                          <Icon name="Warehouse" size={15} className={orderType === "regular" ? "text-white" : "text-muted-foreground"} />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${orderType === "regular" ? "text-[#27265C]" : "text-[#27265C]"}`}>
                            Со склада
                          </p>
                          {orderType === "regular" && (
                            <Icon name="CheckCircle" size={13} className="text-[#27265C] inline ml-1" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Отгрузка с регионального склада. Стандартные сроки, максимальный ассортимент в наличии.
                      </p>
                    </button>

                    {/* Direct */}
                    <button
                      type="button"
                      onClick={() => setOrderType("direct")}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        orderType === "direct"
                          ? "border-[#FCC71E] bg-[#FCC71E]/8"
                          : "border-[#E8E8E8] bg-white hover:border-[#C8C8C8]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          orderType === "direct" ? "bg-[#FCC71E]" : "bg-[#F4F4F4]"
                        }`}>
                          <Icon name="Factory" size={15} className={orderType === "direct" ? "text-[#27265C]" : "text-muted-foreground"} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <p className={`text-sm font-bold ${orderType === "direct" ? "text-[#27265C]" : "text-[#27265C]"}`}>
                            Прямо с завода
                          </p>
                          {orderType === "direct" && (
                            <Icon name="CheckCircle" size={13} className="text-amber-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Отгрузка напрямую с производства. Крупные объёмы, возможен предзаказ под выпуск.
                      </p>
                      {orderType === "direct" && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold bg-amber-50 rounded-lg px-2.5 py-1.5">
                          <Icon name="AlertCircle" size={11} />
                          Сроки согласовываются с менеджером
                        </div>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* ── Card 2: Состав заказа ── */}
              <Card className="shadow-sm border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-5 bg-[#27265C]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon name="ShoppingCart" size={17} className="text-[#FCC71E]" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-white">
                          Состав заказа
                        </CardTitle>
                        <p className="text-xs text-white/55 mt-0.5">
                          {items.length > 0
                            ? `${items.length} позиций · ${totalQty} шт.`
                            : "Добавьте товары из каталога"}
                        </p>
                      </div>
                    </div>
                    {items.length > 0 && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-white/60">сумма:</span>
                        <Badge className="bg-[#FCC71E] text-[#27265C] font-bold text-sm px-3 py-1.5 border-0 shadow-none">
                          {formatCurrency(subtotal)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0 bg-white">

                  {/* Search bar */}
                  <div className="px-6 py-4 bg-[#FAFAFA] border-b border-[#F0F0F0]">
                    <div className="relative">
                      <Icon
                        name="Search"
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        placeholder="Поиск по названию или артикулу..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-10 h-11 border-[#E2E2E2] rounded-lg focus:border-[#27265C] focus:ring-1 focus:ring-[#27265C]/20 bg-white"
                      />
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#27265C] transition-colors"
                        >
                          <Icon name="X" size={15} />
                        </button>
                      )}
                    </div>

                    {/* Catalog results */}
                    {showCatalog && (
                      <div className="mt-2 border border-[#E2E2E2] rounded-xl overflow-hidden shadow-lg bg-white">
                        {filteredCatalog.length === 0 ? (
                          <div className="px-5 py-8 text-center">
                            <Icon name="PackageSearch" size={26} className="mx-auto mb-2.5 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">Товары не найдены</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">Попробуйте другой запрос</p>
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto divide-y divide-[#F4F4F4]">
                            {filteredCatalog.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#F7F7FF] cursor-pointer group transition-colors"
                                onClick={() => addFromCatalog(p)}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-[#27265C] truncate">{p.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {p.sku} · {p.category}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-[#27265C]">{formatCurrency(p.price)}</p>
                                    {p.inStock ? (
                                      <p className="text-[11px] text-emerald-600 font-medium">в наличии {p.stock} шт.</p>
                                    ) : (
                                      <p className="text-[11px] text-orange-500 font-medium">под заказ</p>
                                    )}
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-[#27265C] group-hover:bg-[#FCC71E] flex items-center justify-center transition-colors flex-shrink-0">
                                    <Icon name="Plus" size={15} className="text-white group-hover:text-[#27265C]" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Items table */}
                  {items.length === 0 ? (
                    <div className="px-6 py-20 text-center">
                      <div className="w-18 h-18 rounded-2xl bg-[#27265C]/5 flex items-center justify-center mx-auto mb-5 w-[72px] h-[72px]">
                        <Icon name="ShoppingCart" size={30} className="text-[#27265C]/25" />
                      </div>
                      <p className="text-base font-semibold text-[#27265C]/50">Корзина пуста</p>
                      <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                        Используйте строку поиска выше для добавления товаров в заказ
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                            <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 whitespace-nowrap">
                              Товар
                            </th>
                            <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                              Артикул
                            </th>
                            <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                              Количество
                            </th>
                            <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                              Цена
                            </th>
                            <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                              Сумма
                            </th>
                            <th className="w-12 px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F4F4F4]">
                          {items.map((item, idx) => (
                            <tr key={item.id} className="group hover:bg-[#FAFAFA] transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-[#27265C]/6 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-[#27265C]/35">{idx + 1}</span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#27265C] leading-snug">{item.name}</p>
                                    {item.isBackorder && (
                                      <Badge className="mt-1.5 bg-orange-100 text-orange-700 border-0 text-[10px] font-bold px-2 py-0.5">
                                        под заказ
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-xs font-mono text-muted-foreground whitespace-nowrap bg-[#F4F4F4] px-2 py-1 rounded">
                                  {item.sku}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => updateQty(item.id, String(item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                    className="w-7 h-7 rounded-md border border-[#E2E2E2] flex items-center justify-center text-[#27265C] hover:border-[#27265C] hover:bg-[#27265C]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
                                  >
                                    <Icon name="Minus" size={12} />
                                  </button>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => updateQty(item.id, e.target.value)}
                                    className="w-14 h-7 text-center text-sm font-bold border-[#E2E2E2] focus:border-[#27265C] px-1 rounded-md"
                                  />
                                  <button
                                    onClick={() => updateQty(item.id, String(item.quantity + 1))}
                                    className="w-7 h-7 rounded-md border border-[#E2E2E2] flex items-center justify-center text-[#27265C] hover:border-[#27265C] hover:bg-[#27265C]/5 transition-all flex-shrink-0"
                                  >
                                    <Icon name="Plus" size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <p className="text-sm font-semibold text-[#27265C] whitespace-nowrap">
                                  {formatCurrency(item.price)}
                                </p>
                                <p className="text-xs text-muted-foreground">/{item.unit}</p>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <span className="text-sm font-bold text-[#27265C] whitespace-nowrap">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                  title="Удалить позицию"
                                >
                                  <Icon name="Trash2" size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#F7F7F7] border-t-2 border-[#E0E0E0]">
                            <td colSpan={2} className="px-6 py-3.5">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Позиций в заказе: {items.length}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="text-sm font-bold text-[#27265C]">{totalQty} шт.</span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="text-xs text-muted-foreground">до скидки</span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="text-base font-bold text-[#27265C] whitespace-nowrap">
                                {formatCurrency(subtotal)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {/* Footer: link to catalog */}
                  <div className="px-6 py-4 border-t border-[#F0F0F0] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Не нашли нужный товар в поиске?
                    </p>
                    <Link to="/catalog">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 hover:border-[#27265C]/40 font-medium"
                      >
                        <Icon name="Package" size={14} className="mr-2" />
                        Открыть полный каталог
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* ── Card 3: Комментарий ── */}
              <Card className="shadow-sm border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-5 bg-white border-b border-[#F0F0F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#27265C]/8 flex items-center justify-center flex-shrink-0">
                      <Icon name="MessageSquare" size={17} className="text-[#27265C]" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-[#27265C]">
                        Комментарий к заказу
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Пожелания по упаковке, приоритет позиций, особые требования
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-6 bg-white">
                  <Textarea
                    placeholder="Например: «Приоритет на позицию MN7707-4, остальное по мере готовности»..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    rows={4}
                    className="border-[#E2E2E2] rounded-lg focus:border-[#27265C] focus:ring-1 focus:ring-[#27265C]/20 resize-none text-sm leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-2.5">
                    <p className="text-xs text-muted-foreground">Необязательное поле</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {comment.length} / 500
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* ── Bottom actions (mobile) ── */}
              <div className="flex flex-col sm:flex-row gap-3 lg:hidden pb-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-[#27265C]/25 text-[#27265C] hover:bg-[#27265C]/5 h-12 font-medium"
                  onClick={handleSaveDraft}
                >
                  <Icon name="Save" size={17} className="mr-2.5" />
                  Сохранить черновик
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-12 shadow-sm"
                  onClick={handleOpenConfirm}
                >
                  <Icon name="Send" size={17} className="mr-2.5" />
                  Создать заказ
                </Button>
              </div>
            </div>
            {/* ╚══════════════ END LEFT ══════════════╝ */}

            {/* ╔══════════════ RIGHT COLUMN (sticky) ══════════════╗ */}
            <div className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-6 space-y-4">

              {/* Summary card */}
              <Card className="shadow-sm border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <CardHeader className="px-5 py-5 bg-[#27265C]">
                  <div className="flex items-center gap-2.5">
                    <Icon name="BarChart2" size={18} className="text-[#FCC71E]" />
                    <CardTitle className="text-base font-semibold text-white">Итог заказа</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5 bg-white">

                  {/* Stats tiles */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-[#F7F7F7] rounded-xl px-4 py-3.5 text-center">
                      <p className="text-2xl font-extrabold text-[#27265C]">{items.length}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">позиций</p>
                    </div>
                    <div className="bg-[#F7F7F7] rounded-xl px-4 py-3.5 text-center">
                      <p className="text-2xl font-extrabold text-[#27265C]">{totalQty}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">штук</p>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  {/* Price breakdown */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">Сумма товаров</span>
                      <span className="text-sm font-semibold text-[#27265C]">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-muted-foreground">Скидка</span>
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-bold px-1.5 py-0">
                          {DISCOUNT_PERCENT}%
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">−{formatCurrency(discount)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Total row */}
                  <div className="flex items-center justify-between gap-2 bg-[#27265C]/5 rounded-xl px-4 py-3.5">
                    <span className="text-sm font-bold text-[#27265C]">Итого к оплате</span>
                    <span className="text-xl font-extrabold text-[#27265C]">{formatCurrency(total)}</span>
                  </div>

                  {/* Ship date block */}
                  <div className="mt-4 p-3.5 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon name="CalendarDays" size={14} className="text-[#27265C]/50 flex-shrink-0" />
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Дата отгрузки
                      </span>
                    </div>
                    <p className={`text-sm pl-5 font-semibold ${shipDate ? "text-[#27265C]" : "text-muted-foreground italic"}`}>
                      {shipDateFormatted}
                    </p>
                  </div>

                  {/* Backorder warning */}
                  {items.some((it) => it.isBackorder) && (
                    <div className="mt-3 p-3.5 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-2.5">
                      <Icon name="AlertCircle" size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-700 leading-relaxed">
                        В заказе есть позиции{" "}
                        <span className="font-bold">«под заказ»</span> — сроки поставки уточните у менеджера.
                      </p>
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="mt-5 space-y-2.5">
                    <Button
                      className="w-full bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-12 text-[15px] shadow-sm rounded-xl"
                      onClick={handleOpenConfirm}
                    >
                      <Icon name="Send" size={17} className="mr-2.5" />
                      Создать заказ
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-[#27265C]/60 hover:text-[#27265C] hover:bg-[#27265C]/5 h-10 rounded-xl font-medium"
                      onClick={handleSaveDraft}
                    >
                      <Icon name="Save" size={15} className="mr-2" />
                      Сохранить как черновик
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Manager card */}
              <Card className="shadow-sm border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <CardContent className="p-5 bg-white">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Ваш менеджер
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-[#27265C] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">ИМ</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#27265C] truncate">{manager}</p>
                      <p className="text-xs text-muted-foreground">Менеджер по работе с клиентами</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-[#E2E2E2] text-[#27265C] hover:bg-[#27265C]/5 hover:border-[#27265C]/30 font-medium"
                    >
                      <Icon name="Phone" size={13} className="mr-1.5" />
                      Позвонить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-[#E2E2E2] text-[#27265C] hover:bg-[#27265C]/5 hover:border-[#27265C]/30 font-medium"
                    >
                      <Icon name="Mail" size={13} className="mr-1.5" />
                      Написать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* ╚══════════════ END RIGHT ══════════════╝ */}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          CONFIRMATION DIALOG
      ═══════════════════════════════════════════════════ */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden gap-0">

          {/* Dialog header */}
          <DialogHeader className="px-6 pt-6 pb-5 bg-[#27265C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FCC71E]/20 flex items-center justify-center flex-shrink-0">
                <Icon name="ClipboardCheck" size={20} className="text-[#FCC71E]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white">
                  Подтверждение заказа
                </DialogTitle>
                <DialogDescription className="text-white/55 text-sm mt-0.5">
                  Проверьте данные перед созданием
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 pt-5 pb-6 space-y-5 bg-white">

            {/* Order summary */}
            <div className="bg-[#F7F7F7] rounded-xl p-4 space-y-2.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Сводка заказа
              </p>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground flex-shrink-0">Тип заказа</span>
                <span className={`font-semibold text-right flex items-center gap-1.5 ${orderType === "direct" ? "text-amber-700" : "text-[#27265C]"}`}>
                  <Icon name={orderType === "direct" ? "Factory" : "Warehouse"} size={13} />
                  {orderType === "direct" ? "Прямо с завода" : "Со склада"}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground flex-shrink-0">Контрагент</span>
                <span className="font-semibold text-[#27265C] text-right truncate">
                  {counterparty
                    ? ["ООО «Автодеталь»","ИП Сидоров А.В.","ЗАО «Моторторг»","ООО «Спецавто»"][
                        ["ooo-avtodetal","ip-sidorov","zao-motortorg","ooo-specauto"].indexOf(counterparty)
                      ]
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground flex-shrink-0">Склад</span>
                <span className="font-semibold text-[#27265C] text-right">
                  {warehouse
                    ? ["Москва — Главный","Москва — Юг","Санкт-Петербург","Екатеринбург"][
                        ["msk-main","msk-south","spb","ekb"].indexOf(warehouse)
                      ]
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground flex-shrink-0">Дата отгрузки</span>
                <span className="font-semibold text-[#27265C] text-right">{shipDateFormatted}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground flex-shrink-0">Позиций / штук</span>
                <span className="font-semibold text-[#27265C]">{items.length} поз. / {totalQty} шт.</span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground flex-shrink-0">Скидка {DISCOUNT_PERCENT}%</span>
                <span className="font-semibold text-emerald-600">−{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-sm font-bold text-[#27265C]">Итого</span>
                <span className="text-lg font-extrabold text-[#27265C]">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Status selector */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Статус заказа
              </p>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedStatus === opt.value
                        ? `${opt.bg} border-current`
                        : "bg-white border-[#E8E8E8] hover:border-[#C8C8C8]"
                    }`}
                    onClick={() => setSelectedStatus(opt.value)}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedStatus === opt.value ? "bg-white/60" : "bg-[#F4F4F4]"
                    }`}>
                      <Icon
                        name={opt.icon}
                        size={17}
                        className={selectedStatus === opt.value ? opt.color : "text-muted-foreground"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          selectedStatus === opt.value ? opt.color : "text-[#27265C]"
                        }`}>
                          {opt.label}
                        </span>
                        {selectedStatus === opt.value && (
                          <Icon name="CheckCircle" size={14} className={opt.color} />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-[#E2E2E2] text-[#27265C] hover:bg-[#F4F4F4] h-12 font-medium rounded-xl"
                onClick={() => setConfirmOpen(false)}
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Вернуться к заказу
              </Button>
              <Button
                size="lg"
                className={`flex-1 font-bold h-12 rounded-xl shadow-sm text-[15px] ${
                  selectedStatus === "draft"
                    ? "bg-slate-700 hover:bg-slate-800 text-white"
                    : "bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C]"
                }`}
                onClick={handleConfirmCreate}
              >
                <Icon
                  name={selectedStatus === "draft" ? "Save" : "Send"}
                  size={17}
                  className="mr-2.5"
                />
                {selectedStatus === "draft" ? "Сохранить черновик" : `Создать — ${currentStatus.label}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
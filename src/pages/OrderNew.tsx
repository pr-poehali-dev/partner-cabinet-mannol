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
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import { formatCurrency } from "@/types/order";

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

export default function OrderNew() {
  const navigate = useNavigate();

  const [items, setItems] = useState<OrderItem[]>(DEFAULT_ITEMS);
  const [search, setSearch] = useState("");
  const [comment, setComment] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [shipDate, setShipDate] = useState("");
  const [manager] = useState("Иванова Мария Сергеевна");

  const today = new Date().toISOString().split("T")[0];

  const filteredCatalog = MOCK_CATALOG.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const showCatalog = search.length > 1;

  function updateQty(id: string, val: string) {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) return;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: num } : it)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.success("Позиция удалена");
  }

  function addFromCatalog(product: CatalogProduct) {
    const exists = items.find((it) => it.sku === product.sku && !it.isBackorder);
    if (exists) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === exists.id ? { ...it, quantity: it.quantity + 1 } : it
        )
      );
      toast.success(`Количество увеличено: ${product.name}`);
    } else {
      const newItem: OrderItem = {
        id: `i${Date.now()}`,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1,
        unit: product.unit,
        isBackorder: !product.inStock,
      };
      setItems((prev) => [...prev, newItem]);
      toast.success(`Добавлено: ${product.name}`);
    }
    setSearch("");
  }

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const discount = Math.round(subtotal * (DISCOUNT_PERCENT / 100));
  const total = subtotal - discount;
  const totalQty = items.reduce((s, it) => s + it.quantity, 0);

  function handleSaveDraft() {
    toast.success("Черновик сохранён", { description: "Вы можете вернуться к нему позже" });
  }

  function handleCreate() {
    if (!counterparty) { toast.error("Выберите контрагента"); return; }
    if (!warehouse) { toast.error("Выберите склад"); return; }
    if (!shipDate) { toast.error("Укажите желаемую дату отгрузки"); return; }
    if (items.length === 0) { toast.error("Добавьте хотя бы один товар"); return; }
    toast.success("Заказ создан!", { description: "ORD-2026-0216 отправлен на согласование" });
    setTimeout(() => navigate("/orders"), 1200);
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F4F4F4]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-5">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/orders" className="hover:text-[#27265C] transition-colors">Заказы</Link>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/60" />
            <span className="text-[#27265C] font-medium">Новый заказ</span>
          </nav>

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#27265C] leading-tight">Новый заказ</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Заполните форму и отправьте на согласование</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 h-10"
                onClick={handleSaveDraft}
              >
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить черновик
              </Button>
              <Button
                className="bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-semibold h-10 shadow-sm"
                onClick={handleCreate}
              >
                <Icon name="Send" size={16} className="mr-2" />
                Создать заказ
              </Button>
            </div>
          </div>

          {/* Main 2-column layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ─── LEFT COLUMN ─── */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Card 1 — Основная информация */}
              <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                <CardHeader className="pb-4 pt-5 px-6 bg-white border-b border-[#F0F0F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#27265C]/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="FileText" size={16} className="text-[#27265C]" />
                    </div>
                    <CardTitle className="text-base font-semibold text-[#27265C]">Основная информация</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-5 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Контрагент *</label>
                      <Select value={counterparty} onValueChange={setCounterparty}>
                        <SelectTrigger className="h-10 border-[#E2E2E2] focus:border-[#27265C] focus:ring-[#27265C]/20">
                          <SelectValue placeholder="Выберите контрагента" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ooo-avtodetal">ООО «Автодеталь»</SelectItem>
                          <SelectItem value="ip-sidorov">ИП Сидоров А.В.</SelectItem>
                          <SelectItem value="zao-motortorg">ЗАО «Моторторг»</SelectItem>
                          <SelectItem value="ooo-specauto">ООО «Спецавто»</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Склад отгрузки *</label>
                      <Select value={warehouse} onValueChange={setWarehouse}>
                        <SelectTrigger className="h-10 border-[#E2E2E2] focus:border-[#27265C] focus:ring-[#27265C]/20">
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

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Желаемая дата отгрузки *</label>
                      <Input
                        type="date"
                        min={today}
                        value={shipDate}
                        onChange={(e) => setShipDate(e.target.value)}
                        className="h-10 border-[#E2E2E2] focus:border-[#27265C] focus:ring-[#27265C]/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Менеджер</label>
                      <div className="h-10 px-3 flex items-center gap-2 rounded-md border border-[#E2E2E2] bg-muted/40">
                        <div className="w-6 h-6 rounded-full bg-[#27265C] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] font-bold">ИМ</span>
                        </div>
                        <span className="text-sm text-[#27265C] truncate">{manager}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 — Состав заказа */}
              <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                <CardHeader className="pb-4 pt-5 px-6 bg-[#27265C] border-b border-[#27265C]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FCC71E]/20 flex items-center justify-center flex-shrink-0">
                        <Icon name="ShoppingCart" size={16} className="text-[#FCC71E]" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-white">Состав заказа</CardTitle>
                        {items.length > 0 && (
                          <p className="text-xs text-white/60 mt-0.5">{items.length} позиций · {totalQty} шт.</p>
                        )}
                      </div>
                    </div>
                    {items.length > 0 && (
                      <Badge className="bg-[#FCC71E] text-[#27265C] font-bold text-sm px-3 py-1 shadow-none border-0">
                        {formatCurrency(subtotal)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0 bg-white">
                  {/* Search + add */}
                  <div className="px-6 py-4 border-b border-[#F0F0F0] bg-[#FAFAFA]">
                    <div className="relative">
                      <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Поиск по названию или артикулу..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 border-[#E2E2E2] focus:border-[#27265C] focus:ring-[#27265C]/20 bg-white"
                      />
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      )}
                    </div>

                    {/* Catalog dropdown */}
                    {showCatalog && (
                      <div className="mt-2 border border-[#E2E2E2] rounded-lg overflow-hidden shadow-md bg-white z-10 relative">
                        {filteredCatalog.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                            <Icon name="PackageSearch" size={24} className="mx-auto mb-2 opacity-40" />
                            Товары не найдены
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto divide-y divide-[#F0F0F0]">
                            {filteredCatalog.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#F7F7F7] cursor-pointer group transition-colors"
                                onClick={() => addFromCatalog(p)}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-[#27265C] truncate">{p.name}</p>
                                  <p className="text-xs text-muted-foreground">{p.sku} · {p.category}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-[#27265C]">{formatCurrency(p.price)}</p>
                                    {p.inStock ? (
                                      <p className="text-[11px] text-emerald-600">в наличии {p.stock} шт</p>
                                    ) : (
                                      <p className="text-[11px] text-orange-500">под заказ</p>
                                    )}
                                  </div>
                                  <div className="w-7 h-7 rounded-full bg-[#27265C] group-hover:bg-[#FCC71E] flex items-center justify-center transition-colors flex-shrink-0">
                                    <Icon name="Plus" size={14} className="text-white group-hover:text-[#27265C]" />
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
                    <div className="px-6 py-16 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#27265C]/5 flex items-center justify-center mx-auto mb-4">
                        <Icon name="ShoppingCart" size={28} className="text-[#27265C]/30" />
                      </div>
                      <p className="text-sm font-medium text-[#27265C]/60">Товары не добавлены</p>
                      <p className="text-xs text-muted-foreground mt-1">Используйте поиск выше для добавления товаров</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-6 py-3 whitespace-nowrap">Товар</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 whitespace-nowrap">Артикул</th>
                            <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 whitespace-nowrap">Кол-во</th>
                            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 whitespace-nowrap">Цена</th>
                            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 whitespace-nowrap">Сумма</th>
                            <th className="px-4 py-3 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F0F0]">
                          {items.map((item, idx) => (
                            <tr key={item.id} className="group hover:bg-[#FAFAFA] transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-[#27265C]/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-[#27265C]/40">{idx + 1}</span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-[#27265C] leading-tight">{item.name}</p>
                                    {item.isBackorder && (
                                      <Badge className="mt-1 bg-orange-100 text-orange-700 border-0 text-[10px] font-semibold px-1.5 py-0">
                                        под заказ
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-4">
                                <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{item.sku}</span>
                              </td>
                              <td className="px-3 py-4">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => updateQty(item.id, String(item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                    className="w-7 h-7 rounded-md border border-[#E2E2E2] flex items-center justify-center text-[#27265C] hover:border-[#27265C] hover:bg-[#27265C]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                  >
                                    <Icon name="Minus" size={12} />
                                  </button>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => updateQty(item.id, e.target.value)}
                                    className="w-14 h-7 text-center text-sm font-semibold border-[#E2E2E2] focus:border-[#27265C] px-1"
                                  />
                                  <button
                                    onClick={() => updateQty(item.id, String(item.quantity + 1))}
                                    className="w-7 h-7 rounded-md border border-[#E2E2E2] flex items-center justify-center text-[#27265C] hover:border-[#27265C] hover:bg-[#27265C]/5 transition-colors flex-shrink-0"
                                  >
                                    <Icon name="Plus" size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="px-3 py-4 text-right">
                                <span className="text-sm text-[#27265C] whitespace-nowrap">{formatCurrency(item.price)}</span>
                                <span className="text-xs text-muted-foreground block">/{item.unit}</span>
                              </td>
                              <td className="px-3 py-4 text-right">
                                <span className="text-sm font-semibold text-[#27265C] whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</span>
                              </td>
                              <td className="px-4 py-4">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Icon name="Trash2" size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#F7F7F7] border-t-2 border-[#E2E2E2]">
                            <td colSpan={2} className="px-6 py-3">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Итого позиций: {items.length}</span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="text-sm font-bold text-[#27265C]">{totalQty} шт.</span>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <span className="text-xs text-muted-foreground">до скидки</span>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <span className="text-sm font-bold text-[#27265C] whitespace-nowrap">{formatCurrency(subtotal)}</span>
                            </td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {/* Quick link to catalog */}
                  <div className="px-6 py-4 border-t border-[#F0F0F0] bg-[#FAFAFA] flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">Не нашли нужный товар?</p>
                    <Link to="/catalog">
                      <Button variant="ghost" size="sm" className="text-[#27265C] hover:bg-[#27265C]/5 h-8 text-xs">
                        <Icon name="Package" size={13} className="mr-1.5" />
                        Перейти в каталог
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3 — Комментарий */}
              <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                <CardHeader className="pb-4 pt-5 px-6 bg-white border-b border-[#F0F0F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#27265C]/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="MessageSquare" size={16} className="text-[#27265C]" />
                    </div>
                    <CardTitle className="text-base font-semibold text-[#27265C]">Комментарий к заказу</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-5 bg-white">
                  <Textarea
                    placeholder="Введите комментарий — пожелания по упаковке, приоритет позиций, особые требования..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="border-[#E2E2E2] focus:border-[#27265C] focus:ring-[#27265C]/20 resize-none text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">{comment.length}/500 символов</p>
                </CardContent>
              </Card>
            </div>

            {/* ─── RIGHT COLUMN (Sticky summary) ─── */}
            <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-6 space-y-4">

              {/* Summary card */}
              <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                <CardHeader className="pb-3 pt-5 px-5 bg-[#27265C]">
                  <div className="flex items-center gap-2.5">
                    <Icon name="BarChart2" size={18} className="text-[#FCC71E]" />
                    <CardTitle className="text-base font-semibold text-white">Итог заказа</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5 bg-white space-y-0">

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#F7F7F7] rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-[#27265C]">{items.length}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">позиций</p>
                    </div>
                    <div className="bg-[#F7F7F7] rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-[#27265C]">{totalQty}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">штук всего</p>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  {/* Amounts */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground flex-shrink-0">Сумма товаров</span>
                      <span className="text-sm font-medium text-[#27265C] text-right">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground flex-shrink-0">Скидка {DISCOUNT_PERCENT}%</span>
                      <span className="text-sm font-medium text-emerald-600 text-right">−{formatCurrency(discount)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Total */}
                  <div className="flex items-center justify-between gap-3 bg-[#27265C]/5 rounded-lg px-3 py-3">
                    <span className="text-base font-bold text-[#27265C] flex-shrink-0">Итого</span>
                    <span className="text-xl font-extrabold text-[#27265C] text-right leading-tight">{formatCurrency(total)}</span>
                  </div>

                  {/* Ship date */}
                  <div className="mt-4 p-3 rounded-lg border border-[#E2E2E2] bg-[#FAFAFA]">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="CalendarDays" size={14} className="text-[#27265C]/60 flex-shrink-0" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Дата отгрузки</span>
                    </div>
                    {shipDate ? (
                      <p className="text-sm font-semibold text-[#27265C] pl-5">
                        {new Date(shipDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground pl-5 italic">не указана</p>
                    )}
                  </div>

                  {/* Backorders warning */}
                  {items.some((it) => it.isBackorder) && (
                    <div className="mt-3 p-3 rounded-lg bg-orange-50 border border-orange-100 flex items-start gap-2">
                      <Icon name="AlertCircle" size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-700 leading-relaxed">
                        В заказе есть позиции <span className="font-semibold">«под заказ»</span> — срок поставки уточните у менеджера.
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full mt-5 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-11 text-base shadow-sm"
                    onClick={handleCreate}
                  >
                    <Icon name="Send" size={16} className="mr-2" />
                    Создать заказ
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-[#27265C]/60 hover:text-[#27265C] hover:bg-[#27265C]/5 h-9 text-sm"
                    onClick={handleSaveDraft}
                  >
                    <Icon name="Save" size={14} className="mr-2" />
                    Сохранить черновик
                  </Button>
                </CardContent>
              </Card>

              {/* Manager contact card */}
              <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                <CardContent className="p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#27265C] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">ИМ</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Ваш менеджер</p>
                      <p className="text-sm font-semibold text-[#27265C] truncate">{manager}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#E2E2E2] text-[#27265C] hover:bg-[#27265C]/5">
                      <Icon name="Phone" size={12} className="mr-1.5" />
                      Позвонить
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#E2E2E2] text-[#27265C] hover:bg-[#27265C]/5">
                      <Icon name="Mail" size={12} className="mr-1.5" />
                      Написать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
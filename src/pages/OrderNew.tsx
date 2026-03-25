import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatCurrency } from "@/types/order";

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  unit: string;
  /** Сколько единиц есть на складе прямо сейчас (0 = товар под заказ) */
  stock: number;
  /** true = позиция идёт как предзаказ/под заказ (нет на складе) */
  isBackorder: boolean;
}

interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  unit: string;
  category: string;
  inStock: boolean;
  stock: number;
}

const ORDER_ID = "ORD-2026-0215";


const CATALOG: CatalogProduct[] = [
  { id: "p1",  name: "MANNOL Energy Formula OP 5W-30",            sku: "MN7917-4",  price: 1450, unit: "шт", category: "Моторные масла",           inStock: true,  stock: 24 },
  { id: "p2",  name: "MANNOL Diesel Extra 10W-40",                sku: "MN7504-4",  price: 1100, unit: "шт", category: "Моторные масла",           inStock: true,  stock: 6  },
  { id: "p3",  name: "MANNOL ATF AG52 Automatic Special",         sku: "MN8211-4",  price: 980,  unit: "шт", category: "Трансмиссионные масла",    inStock: true,  stock: 40 },
  { id: "p4",  name: "MANNOL Longlife 504/507 5W-30",             sku: "MN7715-4",  price: 1680, unit: "шт", category: "Моторные масла",           inStock: false, stock: 0  },
  { id: "p5",  name: "MANNOL Classic 10W-40 API SN/CF",           sku: "MN7501-4",  price: 1050, unit: "шт", category: "Моторные масла",           inStock: true,  stock: 18 },
  { id: "p6",  name: "MANNOL Compressor Oil ISO 100",             sku: "MN2902-4",  price: 890,  unit: "шт", category: "Компрессорные масла",      inStock: true,  stock: 12 },
  { id: "p7",  name: "MANNOL Antifreeze AG13 -40C",               sku: "MN4013-5",  price: 520,  unit: "шт", category: "Охлаждающие жидкости",     inStock: true,  stock: 50 },
  { id: "p8",  name: "MANNOL Radiator Flush 0.5L",                sku: "MN9711-05", price: 320,  unit: "шт", category: "Автохимия",                inStock: true,  stock: 8  },
  { id: "p9",  name: "MANNOL Transmission Fluid ATF Dexron VI",   sku: "MN8207-4",  price: 1200, unit: "шт", category: "Трансмиссионные масла",    inStock: true,  stock: 30 },
  { id: "p10", name: "MANNOL Brake Fluid DOT 4",                  sku: "MN8818-1",  price: 280,  unit: "шт", category: "Тормозные жидкости",       inStock: true,  stock: 5  },
];

/** Вспомогательная функция: сколько данного товара уже зарезервировано в корзине */
function reservedInCart(cartItems: CartItem[], productId: string): number {
  return cartItems.find((i) => i.id === productId && !i.isBackorder)?.quantity ?? 0;
}

const OrderNew = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addQty, setAddQty] = useState<Record<string, number>>({});
  const [desiredDate, setDesiredDate] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return CATALOG;
    const q = searchQuery.toLowerCase();
    return CATALOG.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPositions = cartItems.length;
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const hasBackorders = cartItems.some((i) => i.isBackorder);

  // ── Изменение количества в таблице корзины ─────────────────────────────────
  const updateQuantity = (id: string, qty: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(0, qty);

    if (newQty === 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      toast("Позиция удалена из заказа");
      return;
    }

    // Для товаров с остатком — не даём превысить складской лимит
    if (!item.isBackorder && newQty > item.stock) {
      toast.warning(`Максимально доступно: ${item.stock} шт`, {
        description: "Нельзя заказать больше, чем есть на складе. Оставшееся количество можно добавить через «Под заказ».",
        duration: 4000,
      });
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: item.stock } : i))
      );
      return;
    }

    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );
  };

  // ── Удаление позиции ───────────────────────────────────────────────────────
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    toast("Позиция удалена из заказа");
  };

  // ── Добавление товара в корзину ────────────────────────────────────────────
  const addToOrder = (product: CatalogProduct) => {
    const requested = addQty[product.id] ?? 10;

    // ── Случай 1: товар «Под заказ» (нет на складе) ───────────────────────
    if (!product.inStock) {
      const existing = cartItems.find((i) => i.id === product.id && i.isBackorder);
      if (existing) {
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === product.id && i.isBackorder
              ? { ...i, quantity: i.quantity + requested }
              : i
          )
        );
        toast.info("Количество обновлено", {
          description: `${product.name} — теперь ${existing.quantity + requested} шт (предзаказ)`,
          duration: 3000,
        });
      } else {
        setCartItems((prev) => [
          ...prev,
          {
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            quantity: requested,
            unit: product.unit,
            stock: 0,
            isBackorder: true,
          },
        ]);
        toast.info("Добавлено в предзаказ", {
          description: `${product.name} — ${requested} шт. Менеджер уточнит срок поставки.`,
          duration: 4000,
        });
      }
      setAddQty((prev) => ({ ...prev, [product.id]: 10 }));
      return;
    }

    // ── Случай 2: товар в наличии ─────────────────────────────────────────
    const alreadyReserved = reservedInCart(cartItems, product.id);
    const freeStock = Math.max(0, product.stock - alreadyReserved);

    if (freeStock === 0) {
      toast.warning("Весь доступный остаток уже в заказе", {
        description: (
          <div className="text-sm space-y-1 mt-1">
            <p>На складе: <strong>{product.stock} шт</strong> — всё уже добавлено.</p>
            <p className="text-gray-600">Нужно больше? Добавьте нужное количество как «Под заказ» — менеджер включит в допоставку.</p>
          </div>
        ),
        duration: 6000,
        action: {
          label: "Под заказ",
          onClick: () => {
            setCartItems((prev) => {
              const backorderExists = prev.find((i) => i.id === product.id && i.isBackorder);
              if (backorderExists) {
                return prev.map((i) =>
                  i.id === product.id && i.isBackorder
                    ? { ...i, quantity: i.quantity + requested }
                    : i
                );
              }
              return [
                ...prev,
                {
                  id: product.id + "_bo",
                  name: product.name,
                  sku: product.sku,
                  price: product.price,
                  quantity: requested,
                  unit: product.unit,
                  stock: 0,
                  isBackorder: true,
                },
              ];
            });
            toast.info(`${product.name} — ${requested} шт добавлено в предзаказ`);
          },
        },
      });
      return;
    }

    const added = Math.min(requested, freeStock);
    const shortage = requested - added;

    const existing = cartItems.find((i) => i.id === product.id && !i.isBackorder);
    if (existing) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === product.id && !i.isBackorder
            ? { ...i, quantity: i.quantity + added }
            : i
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: added,
          unit: product.unit,
          stock: product.stock,
          isBackorder: false,
        },
      ]);
    }

    setAddQty((prev) => ({ ...prev, [product.id]: 10 }));

    if (shortage > 0) {
      // Часть добавлена со склада, часть — нехватка
      toast.warning(`Добавлено ${added} шт из ${requested} запрошенных`, {
        description: (
          <div className="text-sm space-y-2 mt-1">
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-700">
              <span>Со склада:</span><span className="font-semibold text-green-700">{added} шт — в заказе</span>
              <span>Не хватает:</span><span className="font-semibold text-amber-700">{shortage} шт</span>
            </div>
            <p className="text-gray-600 pt-0.5">
              Нехватку можно добавить как «Под заказ» — менеджер включит в допоставку.
            </p>
          </div>
        ),
        duration: 8000,
        action: {
          label: "Добавить под заказ",
          onClick: () => {
            setCartItems((prev) => {
              const backorderExists = prev.find((i) => i.id === product.id && i.isBackorder);
              if (backorderExists) {
                return prev.map((i) =>
                  i.id === product.id && i.isBackorder
                    ? { ...i, quantity: i.quantity + shortage }
                    : i
                );
              }
              return [
                ...prev,
                {
                  id: product.id + "_bo",
                  name: product.name,
                  sku: product.sku,
                  price: product.price,
                  quantity: shortage,
                  unit: product.unit,
                  stock: 0,
                  isBackorder: true,
                },
              ];
            });
            toast.info(`${product.name} — ${shortage} шт добавлено в предзаказ`);
          },
        },
      });
    } else {
      toast.success("Добавлено в заказ", {
        description: `${product.name} — ${added} шт`,
        duration: 2500,
      });
    }
  };

  // ── Завершение / отправка ──────────────────────────────────────────────────
  const handleFinish = () => {
    if (cartItems.length === 0) {
      toast.error("Добавьте хотя бы один товар перед отправкой");
      return;
    }
    if (!desiredDate) {
      toast.error("Укажите желаемую дату отгрузки");
      return;
    }
    navigate(`/order/${ORDER_ID}/send`, { state: { cartItems, desiredDate } });
  };

  return (
    <div className="space-y-0">
      {/* Sticky контекстная панель */}
      <div className="sticky top-0 z-30 bg-[#27265C] border-b border-[#27265C]/80 shadow-lg">
        <div className="flex items-center justify-between px-3 md:px-6 py-3 gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Icon name="ShoppingCart" size={18} className="text-[#FCC71E]" />
              <span className="font-bold text-white text-sm md:text-lg hidden sm:inline">{ORDER_ID}</span>
            </div>
            <Separator orientation="vertical" className="h-5 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-white/80">
              <span className="font-semibold text-white">{totalPositions} поз.</span>
              <span className="text-white/40 hidden sm:inline">·</span>
              <span className="hidden sm:inline"><span className="font-semibold text-white">{totalQty}</span> шт</span>
              <span className="text-white/40">·</span>
              <span className="font-semibold text-[#FCC71E] text-xs md:text-base">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Link to="/order/new" className="hidden sm:block">
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent text-xs"
              >
                <Icon name="FilePlus" size={14} className="mr-1" />
                Новый
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-bold text-xs md:text-sm"
              onClick={handleFinish}
            >
              <Icon name="Send" size={14} className="mr-1" />
              <span className="hidden sm:inline">Отправить на согласование</span>
              <span className="sm:hidden">Отправить</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 md:p-6">
        {/* Блок: дата отгрузки */}
        <Card className="border-dashed border-gray-300 bg-gray-50/60">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="CalendarDays" size={17} className="text-gray-500" />
              <span className="font-semibold text-gray-700 text-sm">Желаемая дата отгрузки</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Icon name="Info" size={15} className="text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-56 text-xs leading-relaxed">
                    Это предпочтительная дата. Окончательная дата отгрузки будет подтверждена менеджером после обработки заказа.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="max-w-xs">
              <Input
                type="date"
                value={desiredDate}
                onChange={(e) => setDesiredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={`bg-white border-gray-300 text-[#27265C] ${!desiredDate ? "border-amber-300 focus:border-amber-400" : ""}`}
              />
            </div>
            {!desiredDate ? (
              <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                <Icon name="AlertCircle" size={12} />
                Укажите желаемую дату — менеджер постарается её учесть
              </p>
            ) : (
              <p className="mt-2.5 text-xs text-gray-400 leading-snug">
                Плановая дата отгрузки будет назначена менеджером после согласования заказа.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Блок: товары в заказе */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#27265C] flex items-center gap-2">
                <Icon name="Package" size={20} />
                Товары в заказе
              </CardTitle>
              <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
                <span>{totalPositions} позиций</span>
                <span className="text-gray-300">·</span>
                <span>{totalQty} шт</span>
                <span className="text-gray-300 hidden sm:inline">·</span>
                <span className="font-semibold text-[#27265C] hidden sm:inline">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="ShoppingCart" size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-600 font-medium mb-1">В заказе пока нет товаров</p>
                <p className="text-sm text-gray-400">Начните добавлять позиции из каталога ниже</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border hover:bg-gray-50/60 transition-colors ${item.isBackorder ? "bg-blue-50/30 border-blue-200" : "border-gray-100"}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#27265C] leading-tight text-sm">{item.name}</p>
                        {item.isBackorder && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs border-0">
                            <Icon name="Clock" size={10} className="mr-1" />
                            Под заказ
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sku} · {item.price.toLocaleString()} ₽/шт</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 10)}
                        >
                          <Icon name="Minus" size={12} />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="h-7 w-16 text-center font-bold text-sm p-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 10)}
                        >
                          <Icon name="Plus" size={12} />
                        </Button>
                      </div>
                      <span className="font-bold text-[#27265C] text-sm min-w-0 text-right whitespace-nowrap">
                        {(item.quantity * item.price).toLocaleString()} ₽
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-600">Итого:</span>
                  <span className="font-bold text-xl text-[#27265C] min-w-0">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Пояснение по предзаказам */}
        {hasBackorders && (
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
            <Icon name="Info" size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold mb-0.5">В заказе есть позиции «Под заказ»</p>
              <p className="text-blue-700 leading-relaxed">
                Менеджер подтвердит наличие и срок поставки. Цена может измениться. Позиции «Под заказ» отгружаются отдельно после поступления на склад.
              </p>
            </div>
          </div>
        )}

        {/* Блок: добавление товаров из каталога */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="Search" size={20} />
              Добавление товаров
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Поиск по названию или артикулу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Icon name="SearchX" size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Ничего не найдено по запросу «{searchQuery}»</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredProducts.map((product) => {
                  const inCartStock = cartItems.find((i) => i.id === product.id && !i.isBackorder);
                  const inCartBackorder = cartItems.find((i) => i.id === product.id && i.isBackorder);
                  const qty = addQty[product.id] ?? 10;
                  const freeStock = Math.max(0, product.stock - (inCartStock?.quantity ?? 0));
                  const stockLow = product.stock > 0 && product.stock <= 10;

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 py-3.5 px-1 hover:bg-gray-50/60 rounded-lg transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-[#27265C] leading-tight text-sm md:text-base">{product.name}</p>
                          {inCartStock && (
                            <Badge className="bg-green-100 text-green-700 text-xs border-0">
                              <Icon name="Check" size={10} className="mr-1" />
                              В заказе: {inCartStock.quantity} шт
                            </Badge>
                          )}
                          {inCartBackorder && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs border-0">
                              <Icon name="Clock" size={10} className="mr-1" />
                              Под заказ: {inCartBackorder.quantity} шт
                            </Badge>
                          )}
                          {!product.inStock ? (
                            <Badge className="bg-blue-100 text-blue-700 text-xs border-0">
                              Под заказ
                            </Badge>
                          ) : freeStock === 0 ? (
                            <Badge className="bg-amber-100 text-amber-700 text-xs border-0">
                              Остаток исчерпан
                            </Badge>
                          ) : stockLow ? (
                            <Badge className="bg-orange-100 text-orange-700 text-xs border-0">
                              Мало на складе
                            </Badge>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
                          <span>Арт: {product.sku}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-gray-400">{product.category}</span>
                          {product.inStock && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className={
                                freeStock === 0
                                  ? "text-amber-600 font-medium"
                                  : stockLow
                                  ? "text-orange-500 font-medium"
                                  : "text-gray-400"
                              }>
                                Свободно: {freeStock} шт
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold text-[#27265C]">
                          {product.price.toLocaleString()} ₽/шт
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              setAddQty((prev) => ({
                                ...prev,
                                [product.id]: Math.max(1, (prev[product.id] ?? 10) - 10),
                              }))
                            }
                          >
                            <Icon name="Minus" size={12} />
                          </Button>
                          <Input
                            type="number"
                            value={qty}
                            onChange={(e) =>
                              setAddQty((prev) => ({
                                ...prev,
                                [product.id]: Math.max(1, parseInt(e.target.value) || 1),
                              }))
                            }
                            className="h-8 w-16 text-center font-bold text-sm p-1"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              setAddQty((prev) => ({
                                ...prev,
                                [product.id]: (prev[product.id] ?? 10) + 10,
                              }))
                            }
                          >
                            <Icon name="Plus" size={12} />
                          </Button>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                className={
                                  !product.inStock
                                    ? "bg-blue-600 text-white hover:bg-blue-700 font-semibold h-8 whitespace-nowrap"
                                    : "bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold h-8 whitespace-nowrap"
                                }
                                onClick={() => addToOrder(product)}
                              >
                                <Icon name={!product.inStock ? "Clock" : "Plus"} size={14} className="mr-1" />
                                {!product.inStock ? "Под заказ" : "В заказ"}
                              </Button>
                            </TooltipTrigger>
                            {!product.inStock && (
                              <TooltipContent className="max-w-52 text-xs">
                                Товара нет на складе. Будет добавлен как предзаказ — менеджер уточнит срок поставки.
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Нижние действия */}
        {cartItems.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <p className="text-sm text-gray-500 min-w-0">
              {totalPositions}{" "}
              {totalPositions === 1 ? "позиция" : totalPositions >= 2 && totalPositions <= 4 ? "позиции" : "позиций"}
              {" "}· {totalQty} шт · {formatCurrency(totalAmount)}
            </p>
            <Button
              className="bg-[#27265C] text-white hover:bg-[#27265C]/90 font-bold px-6 w-full sm:w-auto"
              onClick={handleFinish}
            >
              <Icon name="Send" size={18} className="mr-2" />
              Отправить на согласование
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderNew;
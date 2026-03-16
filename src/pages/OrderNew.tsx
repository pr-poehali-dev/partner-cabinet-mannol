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

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  unit: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  unit: string;
  category: string;
  inStock: boolean;
}

const ORDER_ID = "ORD-2026-0215";

// Демо: плановая дата, подтверждённая менеджером (null = ещё не подтверждена)
const PLANNED_DATE: string | null = "2026-03-18";

function formatDateRu(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

const CATALOG: CatalogProduct[] = [
  { id: "p1", name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", price: 1450, unit: "шт", category: "Моторные масла", inStock: true },
  { id: "p2", name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", price: 1100, unit: "шт", category: "Моторные масла", inStock: true },
  { id: "p3", name: "MANNOL ATF AG52 Automatic Special", sku: "MN8211-4", price: 980, unit: "шт", category: "Трансмиссионные масла", inStock: true },
  { id: "p4", name: "MANNOL Longlife 504/507 5W-30", sku: "MN7715-4", price: 1680, unit: "шт", category: "Моторные масла", inStock: false },
  { id: "p5", name: "MANNOL Classic 10W-40 API SN/CF", sku: "MN7501-4", price: 1050, unit: "шт", category: "Моторные масла", inStock: true },
  { id: "p6", name: "MANNOL Compressor Oil ISO 100", sku: "MN2902-4", price: 890, unit: "шт", category: "Компрессорные масла", inStock: true },
  { id: "p7", name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", price: 520, unit: "шт", category: "Охлаждающие жидкости", inStock: true },
  { id: "p8", name: "MANNOL Radiator Flush 0.5L", sku: "MN9711-05", price: 320, unit: "шт", category: "Автохимия", inStock: true },
  { id: "p9", name: "MANNOL Transmission Fluid ATF Dexron VI", sku: "MN8207-4", price: 1200, unit: "шт", category: "Трансмиссионные масла", inStock: true },
  { id: "p10", name: "MANNOL Brake Fluid DOT 4", sku: "MN8818-1", price: 280, unit: "шт", category: "Тормозные жидкости", inStock: true },
];

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

  const updateQuantity = (id: string, qty: number) => {
    const newQty = Math.max(0, qty);
    if (newQty === 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    toast("Товар удалён из заказа");
  };

  const addToOrder = (product: CatalogProduct) => {
    const qty = addQty[product.id] || 10;
    const existing = cartItems.find((i) => i.id === product.id);
    if (existing) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
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
          quantity: qty,
          unit: product.unit,
        },
      ]);
    }
    setAddQty((prev) => ({ ...prev, [product.id]: 10 }));
    toast.success(`Товар добавлен в заказ`, {
      description: product.name,
      duration: 2500,
    });
  };

  const handleFinish = () => {
    if (cartItems.length === 0) {
      toast.error("Добавьте хотя бы один товар перед завершением");
      return;
    }
    navigate(`/order/${ORDER_ID}/send`);
  };

  return (
    <div className="space-y-0">
      {/* Sticky контекстная панель заказа */}
      <div className="sticky top-0 z-30 bg-[#27265C] border-b border-[#27265C]/80 shadow-lg">
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="ShoppingCart" size={20} className="text-[#FCC71E]" />
              <span className="font-bold text-white text-lg">Заказ {ORDER_ID}</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-white">{totalPositions}</span>
                {totalPositions === 1 ? "позиция" : totalPositions >= 2 && totalPositions <= 4 ? "позиции" : "позиций"}
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-white">{totalQty}</span> шт
              </span>
              <span className="text-white/40">·</span>
              <span className="font-semibold text-[#FCC71E] text-base">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/order/new">
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
              >
                <Icon name="FilePlus" size={16} className="mr-1.5" />
                Новый заказ
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-bold"
              onClick={handleFinish}
            >
              <Icon name="CheckCircle" size={16} className="mr-1.5" />
              Завершить заказ
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Блок: даты */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Желаемая дата отгрузки — запрос клиента */}
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
              <Input
                type="date"
                value={desiredDate}
                onChange={(e) => setDesiredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-white border-gray-300 text-[#27265C]"
              />
              <p className="mt-2.5 text-xs text-gray-400 leading-snug">
                Это предпочтительная дата. Окончательная дата будет подтверждена менеджером.
              </p>
            </CardContent>
          </Card>

          {/* Плановая дата отгрузки — подтверждена менеджером */}
          {PLANNED_DATE ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="CalendarCheck" size={17} className="text-green-600" />
                  <span className="font-semibold text-green-800 text-sm">Плановая дата отгрузки</span>
                  <Badge className="bg-green-600 text-white border-0 text-[11px] px-2 py-0">
                    Подтверждено
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-green-700 leading-tight">
                  {formatDateRu(PLANNED_DATE)}
                </p>
                <p className="mt-2.5 text-xs text-green-600 leading-snug">
                  Дата подтверждена менеджером и является официальной датой отгрузки.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-gray-200 bg-gray-50/30">
              <CardContent className="pt-5 pb-4 flex flex-col items-center justify-center h-full text-center py-8">
                <Icon name="CalendarClock" size={28} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-400 font-medium">Плановая дата отгрузки</p>
                <p className="text-xs text-gray-400 mt-1">Будет назначена менеджером<br/>после обработки заказа</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Блок: товары в заказе */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#27265C] flex items-center gap-2">
                <Icon name="Package" size={20} />
                Товары в заказе
              </CardTitle>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{totalPositions} позиций</span>
                <span className="text-gray-300">·</span>
                <span>{totalQty} шт</span>
                <span className="text-gray-300">·</span>
                <span className="font-semibold text-[#27265C]">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="ShoppingCart" size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-600 font-medium mb-1">В заказе пока нет товаров</p>
                <p className="text-sm text-gray-400">Начните добавлять позиции ниже</p>
                <div className="flex gap-6 mt-4 text-sm text-gray-400">
                  <span>0 позиций</span>
                  <span>·</span>
                  <span>0 шт</span>
                  <span>·</span>
                  <span>0 ₽</span>
                </div>
              </div>
            ) : (
              /* Таблица добавленных товаров */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Товар</th>
                      <th className="text-center py-2.5 px-3 text-gray-500 font-medium w-40">Количество</th>
                      <th className="text-right py-2.5 px-3 text-gray-500 font-medium w-28">Цена</th>
                      <th className="text-right py-2.5 px-3 text-gray-500 font-medium w-32">Сумма</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-[#27265C] leading-tight">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.sku}</p>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5">
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
                        </td>
                        <td className="py-3 px-3 text-right text-gray-600">
                          {item.price.toLocaleString()} ₽
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#27265C]">
                          {(item.quantity * item.price).toLocaleString()} ₽
                        </td>
                        <td className="py-3 px-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="py-3 px-3 text-right font-semibold text-gray-600">
                        Итого:
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-xl text-[#27265C]">
                        {formatCurrency(totalAmount)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Блок: поиск и добавление товаров */}
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
                placeholder="Найти товар по названию или артикулу"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery("")}
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Icon name="PackageSearch" size={32} className="mx-auto mb-2 opacity-40" />
                <p>Ничего не найдено по запросу «{searchQuery}»</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredProducts.map((product) => {
                  const inCart = cartItems.find((i) => i.id === product.id);
                  const qty = addQty[product.id] ?? 10;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 py-3.5 px-1 hover:bg-gray-50/60 rounded-lg transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[#27265C] leading-tight">{product.name}</p>
                          {inCart && (
                            <Badge className="bg-green-100 text-green-700 text-xs border-0">
                              <Icon name="Check" size={10} className="mr-1" />
                              В заказе: {inCart.quantity} шт
                            </Badge>
                          )}
                          {!product.inStock && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs border-0">
                              Под заказ
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
                          <span>Арт: {product.sku}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-gray-400">{product.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-sm font-semibold text-[#27265C] w-24 text-right">
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
                        <Button
                          size="sm"
                          className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold h-8 whitespace-nowrap"
                          onClick={() => addToOrder(product)}
                        >
                          <Icon name="Plus" size={14} className="mr-1" />
                          В заказ
                        </Button>
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
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-500">
              {totalPositions} {totalPositions === 1 ? "позиция" : totalPositions >= 2 && totalPositions <= 4 ? "позиции" : "позиций"} · {totalQty} шт · {formatCurrency(totalAmount)}
            </p>
            <Button
              className="bg-[#27265C] text-white hover:bg-[#27265C]/90 font-bold px-8"
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
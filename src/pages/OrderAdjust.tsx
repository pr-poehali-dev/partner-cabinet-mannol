import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";
import {
  MOCK_ORDER,
  MAX_TRUCK_WEIGHT,
  formatWeight,
  formatCurrency,
} from "@/types/order";
import { catalogData, type Product } from "@/data/catalogData";

interface AdjustItem {
  product: Product;
  packagingSize: string;
  qty: number;
  price: number;
  weightPerUnit: number;
}

const AVG_WEIGHT_PER_UNIT = 3.5;

const OrderAdjust = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<AdjustItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, Record<string, number>>>({});
  const [selectedPackaging, setSelectedPackaging] = useState<Record<string, string>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = { ...MOCK_ORDER, id: orderId || MOCK_ORDER.id };

  const confirmedItems = useMemo(
    () => order.items.filter((i) => i.qtyConfirmed > 0),
    [order.items]
  );

  const confirmedWeight = useMemo(
    () => confirmedItems.reduce((s, i) => s + i.qtyConfirmed * i.weightPerUnit, 0),
    [confirmedItems]
  );

  const confirmedAmount = useMemo(
    () => confirmedItems.reduce((s, i) => s + i.qtyConfirmed * i.price, 0),
    [confirmedItems]
  );

  const addedWeight = useMemo(
    () => cart.reduce((s, a) => s + a.qty * a.weightPerUnit, 0),
    [cart]
  );

  const addedAmount = useMemo(
    () => cart.reduce((s, a) => s + a.qty * a.price, 0),
    [cart]
  );

  const totalWeight = confirmedWeight + addedWeight;
  const remaining = MAX_TRUCK_WEIGHT - totalWeight;
  const loadPercent = Math.min((totalWeight / MAX_TRUCK_WEIGHT) * 100, 100);

  const loadBarColor =
    loadPercent >= 80 ? "bg-green-500" : loadPercent >= 50 ? "bg-yellow-500" : "bg-blue-400";
  const loadTextColor =
    loadPercent >= 80 ? "text-green-600" : loadPercent >= 50 ? "text-yellow-600" : "text-blue-500";

  const getPackSize = (productId: string) =>
    selectedPackaging[productId] || "";

  const getQty = (productId: string, size: string) =>
    quantities[productId]?.[size] || 0;

  const setQty = (productId: string, size: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [size]: Math.max(0, val) },
    }));
  };

  const resolvePackaging = (product: Product) => {
    const size = getPackSize(product.id) || product.packaging[0].size;
    return product.packaging.find((p) => p.size === size) || product.packaging[0];
  };

  const handleAddToCart = (product: Product) => {
    const pack = resolvePackaging(product);
    const qty = getQty(product.id, pack.size);
    if (qty <= 0) {
      toast({ title: "Укажите количество", description: "Введите количество перед добавлением." });
      return;
    }
    const existing = cart.find(
      (a) => a.product.id === product.id && a.packagingSize === pack.size
    );
    if (existing) {
      setCart(
        cart.map((a) =>
          a.product.id === product.id && a.packagingSize === pack.size
            ? { ...a, qty: a.qty + qty }
            : a
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product,
          packagingSize: pack.size,
          qty,
          price: pack.price,
          weightPerUnit: AVG_WEIGHT_PER_UNIT,
        },
      ]);
    }
    setQty(product.id, pack.size, 0);
    toast({ title: "Добавлено в дозаказ", description: `${product.name} (${pack.size}) — ${qty} шт` });
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    setCart(cart.filter((a) => !(a.product.id === productId && a.packagingSize === size)));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Дозаказ отправлен",
        description: `Дополнительные позиции добавлены к заказу ${order.id} и переданы менеджеру.`,
      });
      navigate(`/order/${orderId}/confirm`);
    }, 1200);
  };

  // Все товары из каталога в плоский список
  const allProducts = useMemo(() => {
    const result: { product: Product; categoryName: string; seriesName: string }[] = [];
    catalogData.forEach((cat) => {
      cat.series.forEach((ser) => {
        ser.products.forEach((prod) => {
          result.push({ product: prod, categoryName: cat.name, seriesName: ser.name });
        });
      });
    });
    return result;
  }, []);

  const filteredProducts = useMemo(() => {
    let list = allProducts;
    if (selectedCategory) {
      const cat = catalogData.find((c) => c.id === selectedCategory);
      if (cat) {
        const ids = new Set(cat.series.flatMap((s) => s.products.map((p) => p.id)));
        list = list.filter((r) => ids.has(r.product.id));
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.product.name.toLowerCase().includes(q) ||
          r.product.id.toLowerCase().includes(q) ||
          r.product.viscosity?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allProducts, selectedCategory, search]);

  const cartItemsCount = cart.reduce((s, a) => s + a.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* Шапка */}
        <div className="mb-6">
          <Link
            to={`/order/${orderId}/review`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#27265C] transition-colors mb-4"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
            <span>Назад к результатам</span>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#27265C]">Дозаказ товаров</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Заказ {order.id} — добавьте позиции для оптимальной загрузки фуры
              </p>
            </div>
            <Button
              onClick={() => setCartOpen((v) => !v)}
              className="relative bg-[#27265C] text-white shrink-0"
            >
              <Icon name="ShoppingCart" className="w-4 h-4 mr-2" />
              Дозаказ
              {cart.length > 0 && (
                <span className="ml-2 bg-[#FCC71E] text-[#27265C] text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Загрузка фуры */}
        <Card className="mb-5 border-0 shadow-sm overflow-hidden">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#27265C]/10 flex items-center justify-center shrink-0">
                <Icon name="Truck" className="w-5 h-5 text-[#27265C]" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-[#27265C]">Загрузка фуры</span>
                  <span className={`text-base font-bold ${loadTextColor}`}>
                    {loadPercent.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {formatWeight(totalWeight)} / {formatWeight(MAX_TRUCK_WEIGHT)}
                </p>
              </div>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((confirmedWeight / MAX_TRUCK_WEIGHT) * 100, 100)}%` }}
              />
              {addedWeight > 0 && (
                <div
                  className="absolute inset-y-0 bg-[#FCC71E] rounded-r-full transition-all duration-500"
                  style={{
                    left: `${Math.min((confirmedWeight / MAX_TRUCK_WEIGHT) * 100, 100)}%`,
                    width: `${Math.min((addedWeight / MAX_TRUCK_WEIGHT) * 100, 100 - (confirmedWeight / MAX_TRUCK_WEIGHT) * 100)}%`,
                  }}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                  <span className="text-[11px] text-gray-500">Подтверждено</span>
                </div>
                {addedWeight > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#FCC71E]" />
                    <span className="text-[11px] text-gray-500">Дозаказ</span>
                  </div>
                )}
              </div>
              {remaining > 0 ? (
                <span className="text-xs text-blue-700 font-medium bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Свободно {formatWeight(remaining)}
                </span>
              ) : (
                <span className="text-xs text-green-700 font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  Фура загружена
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Корзина дозаказа — раскрывающийся блок */}
        {cartOpen && (
          <Card className="mb-5 border-2 border-[#FCC71E]/50 shadow-md">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
                <Icon name="ShoppingCart" className="w-4.5 h-4.5 text-[#FCC71E]" />
                Корзина дозаказа
                {cart.length > 0 && (
                  <Badge className="bg-[#FCC71E] text-[#27265C] text-xs font-bold">
                    {cart.length} поз.
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-gray-400"
                onClick={() => setCartOpen(false)}
              >
                <Icon name="X" className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pb-4">
              {cart.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <Icon name="ShoppingCart" className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Корзина пуста</p>
                  <p className="text-xs mt-1">Добавьте товары из каталога ниже</p>
                </div>
              ) : (
                <>
                  <div className="space-y-0">
                    {cart.map((item, index) => (
                      <div key={`${item.product.id}-${item.packagingSize}`}>
                        {index > 0 && <Separator className="my-0" />}
                        <div className="flex items-center justify-between py-3 gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#27265C] truncate">
                              {item.product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400 font-mono">{item.product.id}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                {item.packagingSize}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#27265C]">
                                {formatCurrency(item.qty * item.price)}
                              </p>
                              <p className="text-xs text-gray-400">{item.qty} шт</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveFromCart(item.product.id, item.packagingSize)}
                            >
                              <Icon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{cartItemsCount} единиц · {cart.length} поз.</p>
                      <p className="text-xs text-gray-400">
                        +{formatWeight(addedWeight)} к загрузке
                      </p>
                    </div>
                    <p className="text-lg font-bold text-[#27265C]">
                      {formatCurrency(addedAmount)}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Поиск + фильтр по категориям */}
        <Card className="mb-5 border-0 shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon
                  name="Search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <Input
                  placeholder="Поиск по названию, артикулу или вязкости..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 border-gray-300"
                />
                {search && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearch("")}
                  >
                    <Icon name="X" className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  !selectedCategory
                    ? "bg-[#27265C] text-white border-[#27265C]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#27265C]/40 hover:text-[#27265C]"
                }`}
              >
                Все категории
              </button>
              {catalogData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-[#27265C] text-white border-[#27265C]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#27265C]/40 hover:text-[#27265C]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Список товаров */}
        <Card className="mb-6 border-0 shadow-sm overflow-hidden">
          <CardHeader className="pb-0 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
                <Icon name="Package" className="w-4.5 h-4.5 text-[#27265C]/70" />
                Каталог товаров
              </CardTitle>
              <span className="text-xs text-gray-400">
                {filteredProducts.length} позиций
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Icon name="SearchX" className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Ничего не найдено</p>
                <p className="text-xs mt-1">Попробуйте другой запрос или категорию</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredProducts.map(({ product, categoryName, seriesName }) => {
                  const pack = resolvePackaging(product);
                  const qty = getQty(product.id, pack.size);
                  const inCart = cart.find(
                    (a) => a.product.id === product.id && a.packagingSize === pack.size
                  );

                  return (
                    <div
                      key={`${product.id}-${pack.size}`}
                      className={`px-5 py-4 transition-colors ${inCart ? "bg-[#FCC71E]/5" : "hover:bg-gray-50/80"}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Левая часть: название + мета */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 font-mono">{product.id}</span>
                            {product.viscosity && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                                {product.viscosity}
                              </Badge>
                            )}
                            <Badge
                              className={`text-[10px] px-1.5 py-0 h-4 ${
                                product.availability === "in-stock"
                                  ? "bg-green-100 text-green-700"
                                  : product.availability === "pre-order"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.availability === "in-stock"
                                ? "В наличии"
                                : product.availability === "pre-order"
                                ? "Предзаказ"
                                : "Нет"}
                            </Badge>
                            {inCart && (
                              <Badge className="text-[10px] px-1.5 py-0 h-4 bg-[#FCC71E] text-[#27265C]">
                                В дозаказе: {inCart.qty} шт
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-[#27265C]">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {categoryName} · {seriesName}
                          </p>
                          {product.specifications && product.specifications.length > 0 && (
                            <p className="text-[11px] text-gray-400 mt-1">
                              {product.specifications.slice(0, 2).join(" · ")}
                            </p>
                          )}
                        </div>

                        {/* Правая часть: упаковка + цена + кол-во + кнопка */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {/* Выбор упаковки */}
                          <select
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#27265C]/20 focus:border-[#27265C]/40"
                            value={getPackSize(product.id) || product.packaging[0].size}
                            onChange={(e) =>
                              setSelectedPackaging((prev) => ({
                                ...prev,
                                [product.id]: e.target.value,
                              }))
                            }
                          >
                            {product.packaging.map((p) => (
                              <option key={p.size} value={p.size}>
                                {p.size} — {formatCurrency(p.price)}
                              </option>
                            ))}
                          </select>

                          {/* Цена */}
                          <p className="text-base font-bold text-[#27265C]">
                            {formatCurrency(pack.price)}
                            <span className="text-xs font-normal text-gray-400 ml-1">/ шт</span>
                          </p>

                          {/* Кол-во + кнопка добавить */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                              <button
                                className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                                onClick={() => setQty(product.id, pack.size, qty - (pack.palletQty || 1))}
                              >
                                <Icon name="Minus" className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={0}
                                value={qty || ""}
                                placeholder="0"
                                onChange={(e) =>
                                  setQty(product.id, pack.size, parseInt(e.target.value) || 0)
                                }
                                className="w-16 text-center text-sm font-semibold border-none outline-none bg-transparent py-1.5"
                              />
                              <button
                                className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                                onClick={() => setQty(product.id, pack.size, qty + (pack.palletQty || 1))}
                              >
                                <Icon name="Plus" className="w-3 h-3" />
                              </button>
                            </div>
                            <Button
                              size="sm"
                              className={`h-9 px-3 transition-all ${
                                qty > 0
                                  ? "bg-[#27265C] text-white hover:bg-[#27265C]/90"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                              onClick={() => handleAddToCart(product)}
                              disabled={qty <= 0}
                            >
                              <Icon name="Plus" className="w-3.5 h-3.5 mr-1" />
                              Добавить
                            </Button>
                          </div>

                          {/* Подсказка по паллетам */}
                          {qty > 0 && pack.palletQty && (
                            <p className="text-[10px] text-gray-400">
                              {Math.floor(qty / pack.palletQty)} пал.
                              {qty % pack.palletQty > 0 && ` +${qty % pack.palletQty} шт`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Итоги */}
        {cart.length > 0 && (
          <Card className="mb-8 border-0 shadow-sm bg-[#27265C]/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
                <Icon name="Calculator" className="w-4.5 h-4.5 text-[#27265C]/70" />
                Итоги заказа
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Подтверждённый заказ</span>
                  <span className="text-sm font-semibold text-[#27265C]">
                    {formatCurrency(confirmedAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#FCC71E]" />
                    Дозаказ ({cart.length} поз.)
                  </span>
                  <span className="text-sm font-semibold text-[#FCC71E]">
                    +{formatCurrency(addedAmount)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#27265C]">Итого</span>
                  <span className="text-xl font-bold text-[#27265C]">
                    {formatCurrency(confirmedAmount + addedAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Нижняя панель действий */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              asChild
            >
              <Link to={`/order/${orderId}/review`}>
                <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Назад к результатам
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              {cart.length > 0 && (
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-gray-500">К дозаказу</p>
                  <p className="text-sm font-bold text-[#FCC71E]">
                    +{formatCurrency(addedAmount)}
                  </p>
                </div>
              )}
              <Button
                className="bg-[#27265C] hover:bg-[#27265C]/90 text-white px-6 shadow-lg shadow-[#27265C]/20 disabled:opacity-50 disabled:shadow-none"
                disabled={cart.length === 0 || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                    {cart.length > 0
                      ? `Отправить дозаказ (${cart.length} поз.)`
                      : "Перейти к подтверждению"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderAdjust;

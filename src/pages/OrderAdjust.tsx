import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import {
  MOCK_ORDER,
  MOCK_RECOMMENDATIONS,
  MAX_TRUCK_WEIGHT,
  formatWeight,
  formatCurrency,
  RecommendedProduct,
  OrderItem,
} from "@/types/order";

interface AddedItem {
  product: RecommendedProduct;
  qty: number;
}

const OrderAdjust = () => {
  const { orderId } = useParams();
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    () =>
      MOCK_RECOMMENDATIONS.reduce(
        (acc, p) => ({ ...acc, [p.id]: 100 }),
        {} as Record<string, number>
      )
  );
  const [skuSearch, setSkuSearch] = useState("");

  const order = {
    ...MOCK_ORDER,
    id: orderId || MOCK_ORDER.id,
  };

  const confirmedItems = useMemo(
    () => order.items.filter((i) => i.qtyConfirmed > 0),
    [order.items]
  );

  const confirmedWeight = useMemo(
    () =>
      confirmedItems.reduce(
        (s, i) => s + i.qtyConfirmed * i.weightPerUnit,
        0
      ),
    [confirmedItems]
  );

  const confirmedAmount = useMemo(
    () =>
      confirmedItems.reduce((s, i) => s + i.qtyConfirmed * i.price, 0),
    [confirmedItems]
  );

  const addedWeight = useMemo(
    () =>
      addedItems.reduce(
        (s, a) => s + a.qty * a.product.weightPerUnit,
        0
      ),
    [addedItems]
  );

  const addedAmount = useMemo(
    () => addedItems.reduce((s, a) => s + a.qty * a.product.price, 0),
    [addedItems]
  );

  const totalWeight = confirmedWeight + addedWeight;
  const remaining = MAX_TRUCK_WEIGHT - totalWeight;
  const loadPercent = Math.min((totalWeight / MAX_TRUCK_WEIGHT) * 100, 100);

  const loadColor = () => {
    if (loadPercent >= 80) return "text-green-600";
    if (loadPercent >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const loadBarColor = () => {
    if (loadPercent >= 80) return "bg-green-500";
    if (loadPercent >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleAdd = (product: RecommendedProduct) => {
    const qty = quantities[product.id] || 100;
    const existing = addedItems.find((a) => a.product.id === product.id);
    if (existing) {
      setAddedItems(
        addedItems.map((a) =>
          a.product.id === product.id ? { ...a, qty: a.qty + qty } : a
        )
      );
    } else {
      setAddedItems([...addedItems, { product, qty }]);
    }
  };

  const handleRemove = (productId: string) => {
    setAddedItems(addedItems.filter((a) => a.product.id !== productId));
  };

  const handleQtyChange = (productId: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setQuantities({ ...quantities, [productId]: num });
    }
  };

  const availableRecommendations = MOCK_RECOMMENDATIONS.filter(
    (p) =>
      !skuSearch ||
      p.sku.toLowerCase().includes(skuSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(skuSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
              <h1 className="text-2xl font-bold text-[#27265C]">
                Дозаказ и добивка фуры
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Заказ {order.id} — добавьте товары для оптимальной загрузки
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-[#FCC71E]/20 text-[#27265C] border-[#FCC71E]/50 shrink-0 mt-1 font-semibold"
            >
              <Icon name="Truck" className="w-3.5 h-3.5 mr-1" />
              Добивка фуры
            </Badge>
          </div>
        </div>

        <Card className="mb-6 border-0 shadow-sm overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#27265C]/10 flex items-center justify-center">
                <Icon name="Truck" className="w-6 h-6 text-[#27265C]" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-bold text-[#27265C]">
                    Загрузка автомобиля
                  </h2>
                  <span className={`text-lg font-bold ${loadColor()}`}>
                    {loadPercent.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatWeight(totalWeight)} / {formatWeight(MAX_TRUCK_WEIGHT)}
                </p>
              </div>
            </div>
            <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${loadBarColor()}`}
                style={{ width: `${loadPercent}%` }}
              />
              {addedWeight > 0 && (
                <div
                  className="absolute inset-y-0 rounded-r-full bg-[#FCC71E] transition-all duration-500"
                  style={{
                    left: `${Math.min((confirmedWeight / MAX_TRUCK_WEIGHT) * 100, 100)}%`,
                    width: `${Math.min((addedWeight / MAX_TRUCK_WEIGHT) * 100, 100 - (confirmedWeight / MAX_TRUCK_WEIGHT) * 100)}%`,
                  }}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-green-500" />
                  <span className="text-[11px] text-gray-500">Подтверждённые</span>
                </div>
                {addedWeight > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#FCC71E]" />
                    <span className="text-[11px] text-gray-500">Дозаказ</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-gray-200" />
                  <span className="text-[11px] text-gray-500">Свободно</span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-3 flex items-center gap-2.5">
              <Icon name="Info" className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-xs text-blue-800">
                Осталось до полной загрузки:{" "}
                <span className="font-bold">
                  {remaining > 0 ? formatWeight(remaining) : "Фура загружена полностью"}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
              <Icon name="PackageCheck" className="w-4.5 h-4.5 text-[#27265C]/70" />
              Подтверждённые позиции
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {confirmedItems.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <Separator className="my-0" />}
                  <div className="flex items-center justify-between py-3 gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#27265C] truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400 font-mono">
                          {item.sku}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.qtyConfirmed} шт
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatWeight(item.qtyConfirmed * item.weightPerUnit)}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#27265C] shrink-0">
                      {formatCurrency(item.qtyConfirmed * item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">Подтверждённый итог</span>
                <span className="text-xs text-gray-400">
                  {formatWeight(confirmedWeight)}
                </span>
              </div>
              <span className="text-base font-bold text-[#27265C]">
                {formatCurrency(confirmedAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
                <Icon name="Sparkles" className="w-4.5 h-4.5 text-[#FCC71E]" />
                Рекомендуемые товары для добивки
              </CardTitle>
              <Badge variant="outline" className="bg-[#FCC71E]/10 text-[#27265C] border-[#FCC71E]/30 text-xs">
                Категория A
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableRecommendations.map((product) => {
                const isAdded = addedItems.some(
                  (a) => a.product.id === product.id
                );
                return (
                  <div
                    key={product.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isAdded
                        ? "border-[#FCC71E] bg-[#FCC71E]/5 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#27265C] leading-tight">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {product.sku}
                        </p>
                      </div>
                      {isAdded && (
                        <div className="w-5 h-5 rounded-full bg-[#FCC71E] flex items-center justify-center shrink-0">
                          <Icon name="Check" className="w-3 h-3 text-[#27265C]" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 ${
                          product.availability === "plenty"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }`}
                      >
                        <Icon
                          name={product.availability === "plenty" ? "CheckCircle" : "Package"}
                          className="w-2.5 h-2.5 mr-0.5"
                        />
                        {product.availability === "plenty"
                          ? "Много на складе"
                          : "В наличии"}
                      </Badge>
                      {product.regularBuy && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4 bg-purple-50 border-purple-200 text-purple-700"
                        >
                          <Icon name="RotateCcw" className="w-2.5 h-2.5 mr-0.5" />
                          Вы покупали ранее
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>
                        Цена: <span className="font-semibold text-[#27265C]">{formatCurrency(product.price)}</span>
                      </span>
                      <span>
                        Вес: <span className="font-semibold text-gray-700">{product.weightPerUnit} кг/шт</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={quantities[product.id] || 100}
                        onChange={(e) =>
                          handleQtyChange(product.id, e.target.value)
                        }
                        className="h-9 w-20 text-center text-sm font-medium border-gray-300"
                      />
                      <span className="text-xs text-gray-400 shrink-0">шт</span>
                      <Button
                        size="sm"
                        className="ml-auto bg-[#FCC71E] hover:bg-[#FCC71E]/80 text-[#27265C] font-semibold h-9 px-4 shadow-sm"
                        onClick={() => handleAdd(product)}
                      >
                        <Icon name="Plus" className="w-4 h-4 mr-1" />
                        Добавить
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {addedItems.length > 0 && (
          <Card className="mb-6 border-0 shadow-sm border-l-4 border-l-[#FCC71E]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
                <Icon name="PackagePlus" className="w-4.5 h-4.5 text-[#FCC71E]" />
                Добавленные товары
                <Badge className="bg-[#FCC71E] text-[#27265C] text-xs font-bold ml-1">
                  {addedItems.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {addedItems.map((added, index) => (
                  <div key={added.product.id}>
                    {index > 0 && <Separator className="my-0" />}
                    <div className="flex items-center justify-between py-3 gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#27265C] truncate">
                          {added.product.name}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400 font-mono">
                            {added.product.sku}
                          </span>
                          <span className="text-xs text-gray-500">
                            {added.qty} шт
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatWeight(added.qty * added.product.weightPerUnit)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-semibold text-[#27265C]">
                          {formatCurrency(added.qty * added.product.price)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemove(added.product.id)}
                        >
                          <Icon name="X" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">Итого дозаказ</span>
                  <span className="text-xs text-gray-400">
                    {formatWeight(addedWeight)}
                  </span>
                </div>
                <span className="text-base font-bold text-[#FCC71E]">
                  {formatCurrency(addedAmount)}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-500">Обновлённая загрузка</span>
                  <span className={`text-xs font-bold ${loadColor()}`}>
                    {formatWeight(totalWeight)} / {formatWeight(MAX_TRUCK_WEIGHT)} ({loadPercent.toFixed(0)}%)
                  </span>
                </div>
                <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((confirmedWeight / MAX_TRUCK_WEIGHT) * 100, 100)}%`,
                    }}
                  />
                  <div
                    className="absolute inset-y-0 bg-[#FCC71E] rounded-r-full transition-all duration-300"
                    style={{
                      left: `${Math.min((confirmedWeight / MAX_TRUCK_WEIGHT) * 100, 100)}%`,
                      width: `${Math.min((addedWeight / MAX_TRUCK_WEIGHT) * 100, 100 - (confirmedWeight / MAX_TRUCK_WEIGHT) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
              <Icon name="Search" className="w-4.5 h-4.5 text-[#27265C]/70" />
              Найти другие товары
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Icon
                  name="Search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <Input
                  placeholder="Поиск по артикулу или названию..."
                  value={skuSearch}
                  onChange={(e) => setSkuSearch(e.target.value)}
                  className="pl-9 h-10 border-gray-300"
                />
              </div>
              <Button
                variant="outline"
                className="border-[#27265C]/30 text-[#27265C] hover:bg-[#27265C]/5 h-10"
                asChild
              >
                <Link to="/catalog">
                  <Icon name="ExternalLink" className="w-4 h-4 mr-2" />
                  Перейти в каталог
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-sm bg-[#27265C]/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
              <Icon name="Calculator" className="w-4.5 h-4.5 text-[#27265C]/70" />
              Обновлённые итоги
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
              {addedItems.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#FCC71E]" />
                    Дозаказ ({addedItems.length} поз.)
                  </span>
                  <span className="text-sm font-semibold text-[#FCC71E]">
                    +{formatCurrency(addedAmount)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#27265C]">Новый итог</span>
                <span className="text-xl font-bold text-[#27265C]">
                  {formatCurrency(confirmedAmount + addedAmount)}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3.5 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Truck" className="w-4 h-4 text-[#27265C]/60" />
                    <span className="text-xs font-medium text-gray-600">Загрузка фуры</span>
                  </div>
                  <span className={`text-xs font-bold ${loadColor()}`}>
                    {loadPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((confirmedWeight / MAX_TRUCK_WEIGHT) * 100, 100)}%`,
                    }}
                  />
                  {addedWeight > 0 && (
                    <div
                      className="absolute inset-y-0 bg-[#FCC71E] rounded-r-full transition-all duration-300"
                      style={{
                        left: `${Math.min((confirmedWeight / MAX_TRUCK_WEIGHT) * 100, 100)}%`,
                        width: `${Math.min((addedWeight / MAX_TRUCK_WEIGHT) * 100, 100 - (confirmedWeight / MAX_TRUCK_WEIGHT) * 100)}%`,
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-gray-400">
                    {formatWeight(totalWeight)} загружено
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {remaining > 0
                      ? `${formatWeight(remaining)} свободно`
                      : "Загружено полностью"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
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
            <Button
              className="bg-[#27265C] hover:bg-[#27265C]/90 text-white px-6 shadow-lg shadow-[#27265C]/20"
              asChild
            >
              <Link to={`/order/${orderId}/confirm`}>
                <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                Перейти к подтверждению
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAdjust;

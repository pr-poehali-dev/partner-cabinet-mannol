import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type BackorderStatus = 
  | "waiting"
  | "available"
  | "partial"
  | "confirmed"
  | "shipped"
  | "cancelled";

interface BackorderItem {
  id: string;
  orderId: string;
  invoiceId: string;
  orderDate: string;
  shipDate: string;
  productName: string;
  productSku: string;
  orderedQty: number;
  shippedQty: number;
  shortageQty: number;
  availableNow: number;
  estimatedArrival: string;
  status: BackorderStatus;
  pricePerUnit: number;
  category: string;
  reason: string;
  history: { date: string; event: string }[];
}

const statusConfig: Record<BackorderStatus, { label: string; color: string; icon: string }> = {
  waiting: { label: "Ожидает поступления", color: "bg-amber-100 text-amber-800", icon: "Clock" },
  available: { label: "Товар поступил", color: "bg-green-100 text-green-800", icon: "PackageCheck" },
  partial: { label: "Частичное поступление", color: "bg-blue-100 text-blue-800", icon: "PackageMinus" },
  confirmed: { label: "Допоставка подтверждена", color: "bg-indigo-100 text-indigo-800", icon: "ThumbsUp" },
  shipped: { label: "Допоставлено", color: "bg-emerald-100 text-emerald-800", icon: "Truck" },
  cancelled: { label: "Отменено партнером", color: "bg-gray-100 text-gray-600", icon: "XCircle" },
};

const backordersData: BackorderItem[] = [
  {
    id: "ND-2026-0041",
    orderId: "ORD-2026-0189",
    invoiceId: "НКЛ-2026-0189/1",
    orderDate: "28.01.2026",
    shipDate: "30.01.2026",
    productName: "MANNOL Energy Formula 5W-30 SN/CF",
    productSku: "MN7917-4",
    orderedQty: 120,
    shippedQty: 80,
    shortageQty: 40,
    availableNow: 40,
    estimatedArrival: "15.02.2026",
    status: "available",
    pricePerUnit: 1450,
    category: "Моторные масла",
    reason: "Временное отсутствие на складе",
    history: [
      { date: "30.01.2026", event: "Заказ частично отгружен. Недопоставка: 40 шт" },
      { date: "05.02.2026", event: "Ожидается поступление 15.02.2026" },
      { date: "12.02.2026", event: "Товар поступил на склад — 40 шт" },
    ],
  },
  {
    id: "ND-2026-0038",
    orderId: "ORD-2026-0189",
    invoiceId: "НКЛ-2026-0189/1",
    orderDate: "28.01.2026",
    shipDate: "30.01.2026",
    productName: "MANNOL ATF AG52 Automatic Special",
    productSku: "MN8211-4",
    orderedQty: 60,
    shippedQty: 0,
    shortageQty: 60,
    availableNow: 0,
    estimatedArrival: "25.02.2026",
    status: "waiting",
    pricePerUnit: 980,
    category: "Трансмиссионные масла",
    reason: "Задержка поставки от производителя",
    history: [
      { date: "30.01.2026", event: "Товар не отгружен — отсутствует на складе" },
      { date: "03.02.2026", event: "Оформлен запрос поставщику" },
      { date: "10.02.2026", event: "Ожидаемая дата поступления обновлена: 25.02.2026" },
    ],
  },
  {
    id: "ND-2026-0035",
    orderId: "ORD-2026-0172",
    invoiceId: "НКЛ-2026-0172/1",
    orderDate: "20.01.2026",
    shipDate: "22.01.2026",
    productName: "MANNOL Radiator Cleaner",
    productSku: "MN9965-0.325",
    orderedQty: 200,
    shippedQty: 140,
    shortageQty: 60,
    availableNow: 35,
    estimatedArrival: "18.02.2026",
    status: "partial",
    pricePerUnit: 320,
    category: "Автохимия",
    reason: "Частичное поступление от поставщика",
    history: [
      { date: "22.01.2026", event: "Заказ частично отгружен. Недопоставка: 60 шт" },
      { date: "01.02.2026", event: "Поступила часть — 35 из 60 шт" },
      { date: "08.02.2026", event: "Остаток 25 шт ожидается 18.02.2026" },
    ],
  },
  {
    id: "ND-2026-0029",
    orderId: "ORD-2026-0158",
    invoiceId: "НКЛ-2026-0158/1",
    orderDate: "10.01.2026",
    shipDate: "12.01.2026",
    productName: "MANNOL Longlife 504/507 5W-30",
    productSku: "MN7715-4",
    orderedQty: 80,
    shippedQty: 50,
    shortageQty: 30,
    availableNow: 30,
    estimatedArrival: "-",
    status: "confirmed",
    pricePerUnit: 1680,
    category: "Моторные масла",
    reason: "Временное отсутствие на складе",
    history: [
      { date: "12.01.2026", event: "Заказ частично отгружен. Недопоставка: 30 шт" },
      { date: "25.01.2026", event: "Товар поступил на склад — 30 шт" },
      { date: "28.01.2026", event: "Партнер подтвердил допоставку" },
      { date: "29.01.2026", event: "Допоставка формируется на складе" },
    ],
  },
  {
    id: "ND-2026-0024",
    orderId: "ORD-2026-0145",
    invoiceId: "НКЛ-2026-0145/1",
    orderDate: "05.01.2026",
    shipDate: "07.01.2026",
    productName: "MANNOL 10W-40 Extra Diesel",
    productSku: "MN7504-4",
    orderedQty: 100,
    shippedQty: 60,
    shortageQty: 40,
    availableNow: 40,
    estimatedArrival: "-",
    status: "shipped",
    pricePerUnit: 1120,
    category: "Моторные масла",
    reason: "Временное отсутствие на складе",
    history: [
      { date: "07.01.2026", event: "Заказ частично отгружен. Недопоставка: 40 шт" },
      { date: "18.01.2026", event: "Товар поступил на склад — 40 шт" },
      { date: "19.01.2026", event: "Партнер подтвердил допоставку" },
      { date: "21.01.2026", event: "Допоставка отгружена — накладная НКЛ-2026-0145/2" },
    ],
  },
  {
    id: "ND-2026-0020",
    orderId: "ORD-2026-0139",
    invoiceId: "НКЛ-2026-0139/1",
    orderDate: "02.01.2026",
    shipDate: "04.01.2026",
    productName: "MANNOL Antifreeze AG13 -40°C",
    productSku: "MN4013-5",
    orderedQty: 50,
    shippedQty: 20,
    shortageQty: 30,
    availableNow: 0,
    estimatedArrival: "-",
    status: "cancelled",
    pricePerUnit: 650,
    category: "Антифризы",
    reason: "Партнер отменил допоставку",
    history: [
      { date: "04.01.2026", event: "Заказ частично отгружен. Недопоставка: 30 шт" },
      { date: "15.01.2026", event: "Товар поступил на склад — 30 шт" },
      { date: "16.01.2026", event: "Партнер отказался от допоставки" },
    ],
  },
];

const Backorders = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<BackorderItem[]>(backordersData);

  const openFromUrl = searchParams.get("id");
  const actionFromUrl = searchParams.get("action");

  const [selectedItem, setSelectedItem] = useState<BackorderItem | null>(() => {
    if (openFromUrl) return items.find(i => i.id === openFromUrl) || null;
    return null;
  });
  const [isDetailOpen, setIsDetailOpen] = useState(!!openFromUrl && !actionFromUrl);
  const [confirmDialogItem, setConfirmDialogItem] = useState<BackorderItem | null>(() => {
    if (openFromUrl && actionFromUrl === "confirm") return items.find(i => i.id === openFromUrl) || null;
    return null;
  });
  const [cancelDialogItem, setCancelDialogItem] = useState<BackorderItem | null>(() => {
    if (openFromUrl && actionFromUrl === "cancel") return items.find(i => i.id === openFromUrl) || null;
    return null;
  });
  const [sortBy, setSortBy] = useState("date-desc");

  const activeItems = items.filter(i => ["waiting", "available", "partial"].includes(i.status));
  const confirmedItems = items.filter(i => i.status === "confirmed");
  const completedItems = items.filter(i => ["shipped", "cancelled"].includes(i.status));

  const totalShortageAmount = activeItems.reduce((sum, i) => sum + i.shortageQty * i.pricePerUnit, 0);
  const needsActionCount = items.filter(i => i.status === "available" || i.status === "partial").length;

  const filterItems = (list: BackorderItem[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(i =>
      i.productName.toLowerCase().includes(q) ||
      i.orderId.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      i.productSku.toLowerCase().includes(q)
    );
  };

  const sortItems = (list: BackorderItem[]) => {
    const sorted = [...list];
    switch (sortBy) {
      case "date-desc":
        return sorted.sort((a, b) => b.orderDate.localeCompare(a.orderDate));
      case "date-asc":
        return sorted.sort((a, b) => a.orderDate.localeCompare(b.orderDate));
      case "amount-desc":
        return sorted.sort((a, b) => (b.shortageQty * b.pricePerUnit) - (a.shortageQty * a.pricePerUnit));
      default:
        return sorted;
    }
  };

  const handleConfirmDelivery = (item: BackorderItem) => {
    setItems(prev => prev.map(i =>
      i.id === item.id
        ? {
            ...i,
            status: "confirmed" as BackorderStatus,
            history: [...i.history, { date: "13.02.2026", event: "Партнер подтвердил допоставку" }],
          }
        : i
    ));
    setConfirmDialogItem(null);
    setSearchParams({});
    toast({
      title: "Допоставка подтверждена",
      description: `${item.productName} — ${item.shortageQty} шт будут отгружены`,
    });
  };

  const handleCancelDelivery = (item: BackorderItem) => {
    setItems(prev => prev.map(i =>
      i.id === item.id
        ? {
            ...i,
            status: "cancelled" as BackorderStatus,
            history: [...i.history, { date: "13.02.2026", event: "Партнер отказался от допоставки" }],
          }
        : i
    ));
    setCancelDialogItem(null);
    setSearchParams({});
    toast({
      title: "Допоставка отменена",
      description: `${item.productName} — недопоставка закрыта`,
    });
  };

  const renderItemCard = (item: BackorderItem) => {
    const cfg = statusConfig[item.status];
    const shortageAmount = item.shortageQty * item.pricePerUnit;
    const canAct = item.status === "available" || item.status === "partial";

    return (
      <Card key={item.id} className={`transition-shadow hover:shadow-md ${canAct ? "border-l-4 border-l-green-500" : ""}`}>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge className={cfg.color}>
                    <Icon name={cfg.icon} size={14} className="mr-1" />
                    {cfg.label}
                  </Badge>
                  <Badge variant="outline">{item.category}</Badge>
                  <span className="text-xs text-gray-400">{item.id}</span>
                </div>
                <h3 className="text-lg font-bold text-[#27265C] truncate">{item.productName}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Арт: {item.productSku} · Заказ:{" "}
                  <Link to={`/order/${item.orderId}`} className="text-blue-600 hover:underline">
                    {item.orderId}
                  </Link>{" "}
                  · Накладная: {item.invoiceId}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-[#27265C]">
                  {shortageAmount.toLocaleString("ru-RU")} ₽
                </p>
                <p className="text-xs text-gray-500">
                  {item.shortageQty} шт × {item.pricePerUnit.toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg text-sm">
              <div>
                <p className="text-gray-500 text-xs">Заказано</p>
                <p className="font-semibold text-[#27265C]">{item.orderedQty} шт</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Отгружено</p>
                <p className="font-semibold text-green-700">{item.shippedQty} шт</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Недопоставка</p>
                <p className="font-semibold text-red-600">{item.shortageQty} шт</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">На складе сейчас</p>
                <p className={`font-semibold ${item.availableNow >= item.shortageQty ? "text-green-700" : item.availableNow > 0 ? "text-amber-600" : "text-red-500"}`}>
                  {item.availableNow} шт
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Ожидается</p>
                <p className="font-semibold text-[#27265C]">
                  {item.estimatedArrival === "-" ? "—" : item.estimatedArrival}
                </p>
              </div>
            </div>

            {item.status === "waiting" && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                <Icon name="Clock" size={16} className="text-amber-600 flex-shrink-0" />
                <span className="text-amber-800">
                  Товар ожидается на складе <strong>{item.estimatedArrival}</strong>. Вы получите уведомление при поступлении.
                </span>
              </div>
            )}

            {canAct && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                <Icon name="PackageCheck" size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-green-800 flex-1">
                  {item.status === "available"
                    ? `Товар полностью поступил — ${item.availableNow} шт готовы к допоставке`
                    : `Частично поступило ${item.availableNow} из ${item.shortageQty} шт. Остаток ожидается ${item.estimatedArrival}`}
                </span>
              </div>
            )}

            {item.status === "confirmed" && (
              <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-sm">
                <Icon name="Truck" size={16} className="text-indigo-600 flex-shrink-0" />
                <span className="text-indigo-800">Допоставка формируется на складе. Ожидайте отгрузку в ближайшие дни.</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={() => { setSelectedItem(item); setIsDetailOpen(true); setSearchParams({ id: item.id }); }}
              >
                <Icon name="History" size={16} className="mr-1" />
                История
              </Button>

              <div className="flex gap-2">
                {canAct && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                      onClick={() => { setConfirmDialogItem(item); setSearchParams({ id: item.id, action: "confirm" }); }}
                    >
                      <Icon name="Check" size={16} className="mr-1" />
                      Подтвердить допоставку
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => { setCancelDialogItem(item); setSearchParams({ id: item.id, action: "cancel" }); }}
                    >
                      <Icon name="X" size={16} className="mr-1" />
                      Отказаться
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTabContent = (list: BackorderItem[]) => {
    const filtered = sortItems(filterItems(list));
    if (filtered.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="PackageSearch" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Нет позиций в этой категории</p>
          </CardContent>
        </Card>
      );
    }
    return <div className="space-y-4">{filtered.map(renderItemCard)}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Недопоставки</h1>
          <p className="text-gray-600 mt-1">
            Товары из ваших заказов, которые не были отгружены полностью
          </p>
        </div>
      </div>

      {needsActionCount > 0 && (
        <Card className="border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Bell" size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-900">
                  {needsActionCount} {needsActionCount === 1 ? "позиция требует" : "позиции требуют"} вашего решения
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Товар поступил на склад. Подтвердите допоставку или откажитесь — тогда недопоставка будет закрыта.
                </p>
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-shrink-0"
                onClick={() => {
                  const el = document.getElementById("active-tab");
                  el?.click();
                }}
              >
                Перейти к действиям
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#27265C]">{items.filter(i => i.status === "waiting").length}</p>
                <p className="text-xs text-gray-500">Ожидают поступления</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="PackageCheck" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{needsActionCount}</p>
                <p className="text-xs text-gray-500">Требуют решения</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon name="Truck" size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">{confirmedItems.length}</p>
                <p className="text-xs text-gray-500">Формируются</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <Icon name="Banknote" size={20} className="text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-600">{totalShortageAmount.toLocaleString("ru-RU")} ₽</p>
                <p className="text-xs text-gray-500">Сумма активных</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Как работают недопоставки:</strong> Если при отгрузке заказа на складе не хватило товара — формируется недопоставка. 
              Когда товар поступает, вы решаете: <strong>подтвердить допоставку</strong> (мы отгрузим) или <strong>отказаться</strong> (закроем без отгрузки).
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative w-full md:w-[360px]">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по товару, артикулу, заказу..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Сначала новые</SelectItem>
            <SelectItem value="date-asc">Сначала старые</SelectItem>
            <SelectItem value="amount-desc">По сумме (убыв.)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="active" id="active-tab">
            Активные ({activeItems.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            В работе ({confirmedItems.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Завершенные ({completedItems.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Все ({items.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {renderTabContent(activeItems)}
        </TabsContent>
        <TabsContent value="in-progress" className="mt-4">
          {renderTabContent(confirmedItems)}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {renderTabContent(completedItems)}
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          {renderTabContent(items)}
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailOpen} onOpenChange={(open) => { setIsDetailOpen(open); if (!open) setSearchParams({}); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#27265C]">История недопоставки</DialogTitle>
            <DialogDescription>
              {selectedItem?.productName} · {selectedItem?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Заказ</p>
                  <p className="font-semibold text-[#27265C]">{selectedItem.orderId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Накладная</p>
                  <p className="font-semibold text-[#27265C]">{selectedItem.invoiceId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Недопоставка</p>
                  <p className="font-semibold text-red-600">{selectedItem.shortageQty} шт</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Причина</p>
                  <p className="font-semibold text-[#27265C]">{selectedItem.reason}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-[#27265C] mb-3">Хронология событий</p>
                <div className="space-y-0">
                  {selectedItem.history.map((h, idx) => (
                    <div key={idx} className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${idx === selectedItem.history.length - 1 ? "bg-[#27265C]" : "bg-gray-300"}`} />
                        {idx < selectedItem.history.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-xs text-gray-400">{h.date}</p>
                        <p className="text-sm text-gray-700">{h.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDialogItem} onOpenChange={() => { setConfirmDialogItem(null); setSearchParams({}); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-700 flex items-center gap-2">
              <Icon name="PackageCheck" size={22} />
              Подтвердить допоставку?
            </DialogTitle>
            <DialogDescription>
              Товар будет отгружен в ближайшее время по исходному заказу
            </DialogDescription>
          </DialogHeader>
          {confirmDialogItem && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Товар</span>
                  <span className="font-semibold text-[#27265C]">{confirmDialogItem.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Количество</span>
                  <span className="font-semibold text-[#27265C]">
                    {confirmDialogItem.status === "partial" ? confirmDialogItem.availableNow : confirmDialogItem.shortageQty} шт
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Сумма допоставки</span>
                  <span className="font-bold text-[#27265C]">
                    {((confirmDialogItem.status === "partial" ? confirmDialogItem.availableNow : confirmDialogItem.shortageQty) * confirmDialogItem.pricePerUnit).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Исходный заказ</span>
                  <span className="font-semibold text-[#27265C]">{confirmDialogItem.orderId}</span>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setConfirmDialogItem(null)}>
                  Отмена
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => handleConfirmDelivery(confirmDialogItem)}
                >
                  <Icon name="Check" size={16} className="mr-1" />
                  Подтвердить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelDialogItem} onOpenChange={() => { setCancelDialogItem(null); setSearchParams({}); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Icon name="AlertTriangle" size={22} />
              Отказаться от допоставки?
            </DialogTitle>
            <DialogDescription>
              Недопоставка будет закрыта. Товар останется на складе, повторная отгрузка не производится.
            </DialogDescription>
          </DialogHeader>
          {cancelDialogItem && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                <p>
                  Вы отказываетесь от допоставки <strong>{cancelDialogItem.shortageQty} шт</strong> товара{" "}
                  <strong>{cancelDialogItem.productName}</strong> на сумму{" "}
                  <strong>{(cancelDialogItem.shortageQty * cancelDialogItem.pricePerUnit).toLocaleString("ru-RU")} ₽</strong>.
                </p>
                <p className="mt-2">Если товар понадобится позже — оформите новый заказ.</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setCancelDialogItem(null)}>
                  Вернуться
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelDelivery(cancelDialogItem)}
                >
                  <Icon name="X" size={16} className="mr-1" />
                  Отказаться от допоставки
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Backorders;
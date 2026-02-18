import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Link, useParams } from "react-router-dom";

type OrderStatus =
  | "Согласование"
  | "В обработке"
  | "Частично отгружен"
  | "Отгружен"
  | "Доставлен";

type ItemFulfillment = "shipped" | "preorder" | "backorder";

interface DeliveryInfo {
  id: string;
  invoiceId: string;
  date: string;
  status: "Отгружен" | "Доставлен" | "В пути";
  qty: number;
}

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  fulfillment: ItemFulfillment;
  availability: "Много" | "Мало" | "Под заказ" | "Нет на складе";
  deliveries?: DeliveryInfo[];
  preorderEta?: string;
  backorderInfo?: {
    backorderId: string;
    shortageQty: number;
    reason: string;
    status: string;
    estimatedArrival: string;
  };
}

interface OrderData {
  id: string;
  date: string;
  status: OrderStatus;
  delivery: string;
  warehouse: string;
  manager: string;
  managerPhone: string;
  items: OrderItem[];
  history: { date: string; event: string; user: string }[];
}

const statusSteps: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "Согласование", label: "Согласование", icon: "MessageSquare" },
  { key: "В обработке", label: "В обработке", icon: "Clock" },
  { key: "Частично отгружен", label: "Частично отгружен", icon: "PackageOpen" },
  { key: "Отгружен", label: "Отгружен", icon: "Truck" },
  { key: "Доставлен", label: "Доставлен", icon: "CheckCircle" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Доставлен": return "bg-green-100 text-green-700";
    case "Отгружен": return "bg-blue-100 text-blue-700";
    case "Частично отгружен": return "bg-indigo-100 text-indigo-700";
    case "В обработке": return "bg-yellow-100 text-yellow-700";
    case "Согласование": return "bg-orange-100 text-orange-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const OrderDetails = () => {
  const { orderId } = useParams();

  const order: OrderData = {
    id: orderId || "ORD-2024-1247",
    date: "17.12.2024",
    status: "Частично отгружен",
    delivery: "22.12.2024",
    warehouse: "Склад Москва",
    manager: "Иванова Мария",
    managerPhone: "+7 (495) 123-45-67",
    items: [
      {
        id: "1",
        name: "MANNOL Energy Formula 5W-30 SN/CF",
        sku: "MN7917-4",
        quantity: 80,
        price: 1450,
        fulfillment: "shipped",
        availability: "Много",
        deliveries: [
          { id: "DEL-001", invoiceId: "НКЛ-2024-1247/1", date: "20.12.2024", status: "Доставлен", qty: 50 },
          { id: "DEL-002", invoiceId: "НКЛ-2024-1247/2", date: "26.12.2024", status: "В пути", qty: 30 },
        ],
      },
      {
        id: "2",
        name: "MANNOL 10W-40 EXTRA Diesel",
        sku: "MN7504-4",
        quantity: 40,
        price: 1100,
        fulfillment: "shipped",
        availability: "Много",
        deliveries: [
          { id: "DEL-001", invoiceId: "НКЛ-2024-1247/1", date: "20.12.2024", status: "Доставлен", qty: 40 },
        ],
      },
      {
        id: "3",
        name: "MANNOL ATF AG52 Automatic Special",
        sku: "MN8211-4",
        quantity: 30,
        price: 980,
        fulfillment: "preorder",
        availability: "Под заказ",
        preorderEta: "15.01.2025",
      },
      {
        id: "4",
        name: "MANNOL Radiator Cleaner",
        sku: "MN9965-0.325",
        quantity: 60,
        price: 320,
        fulfillment: "backorder",
        availability: "Нет на складе",
        deliveries: [
          { id: "DEL-001", invoiceId: "НКЛ-2024-1247/1", date: "20.12.2024", status: "Доставлен", qty: 40 },
        ],
        backorderInfo: {
          backorderId: "ND-2024-0041",
          shortageQty: 20,
          reason: "Временное отсутствие на складе",
          status: "Ожидает поступления",
          estimatedArrival: "10.01.2025",
        },
      },
      {
        id: "5",
        name: "MANNOL Longlife 504/507 5W-30",
        sku: "MN7715-4",
        quantity: 25,
        price: 1680,
        fulfillment: "preorder",
        availability: "Под заказ",
        preorderEta: "20.01.2025",
      },
    ],
    history: [
      { date: "17.12.2024 14:30", event: "Заказ создан", user: "Петров И.П." },
      { date: "17.12.2024 14:35", event: "Заказ отправлен менеджеру", user: "Система" },
      { date: "17.12.2024 15:20", event: "Менеджер принял заказ в работу", user: "Иванова М.С." },
      { date: "20.12.2024 09:00", event: "Первая отгрузка — НКЛ-2024-1247/1", user: "Система" },
      { date: "20.12.2024 16:30", event: "Первая отгрузка доставлена", user: "Система" },
      { date: "22.12.2024 10:00", event: "Недопоставка: Radiator Cleaner — 20 шт", user: "Система" },
      { date: "26.12.2024 08:00", event: "Вторая отгрузка — НКЛ-2024-1247/2 (в пути)", user: "Система" },
    ],
  };

  const shippedItems = order.items.filter(i => i.fulfillment === "shipped");
  const preorderItems = order.items.filter(i => i.fulfillment === "preorder");
  const backorderItems = order.items.filter(i => i.fulfillment === "backorder");

  const totalShipped = shippedItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const totalPreorder = preorderItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const totalBackorder = backorderItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const totalAmount = totalShipped + totalPreorder + totalBackorder;

  const allDeliveryIds = new Set<string>();
  order.items.forEach(i => i.deliveries?.forEach(d => allDeliveryIds.add(d.id)));

  const deliveryGroups = Array.from(allDeliveryIds).map(deliveryId => {
    const itemsInDelivery = order.items
      .filter(i => i.deliveries?.some(d => d.id === deliveryId))
      .map(i => {
        const del = i.deliveries!.find(d => d.id === deliveryId)!;
        return { ...i, deliveredQty: del.qty, deliveryStatus: del.status, invoiceId: del.invoiceId, deliveryDate: del.date };
      });
    const firstItem = itemsInDelivery[0];
    return {
      id: deliveryId,
      invoiceId: firstItem.invoiceId,
      date: firstItem.deliveryDate,
      status: firstItem.deliveryStatus,
      items: itemsInDelivery,
    };
  });

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case "Доставлен": return { icon: "CheckCircle", color: "text-green-600", bg: "bg-green-100" };
      case "В пути": return { icon: "Truck", color: "text-blue-600", bg: "bg-blue-100" };
      default: return { icon: "Package", color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/orders">
              <Button variant="ghost" size="sm">
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-[#27265C]">Заказ {order.id}</h1>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>
          <p className="text-gray-600 mt-1">Создан {order.date} • Плановая отгрузка {order.delivery}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
            <Icon name="Printer" size={18} className="mr-2" />
            Печать
          </Button>
          <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
            <Icon name="Download" size={18} className="mr-2" />
            Документы
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-2">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isUpcoming = idx > currentStepIndex;
              return (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? "bg-green-500 text-white" :
                      isCurrent ? "bg-[#27265C] text-white ring-4 ring-[#27265C]/20" :
                      "bg-gray-200 text-gray-400"
                    }`}>
                      {isCompleted ? (
                        <Icon name="Check" size={20} />
                      ) : (
                        <Icon name={step.icon} size={18} />
                      )}
                    </div>
                    <span className={`text-xs text-center font-medium ${
                      isCurrent ? "text-[#27265C]" :
                      isCompleted ? "text-green-600" :
                      "text-gray-400"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={`h-0.5 w-full mx-1 mt-[-20px] ${
                      isCompleted ? "bg-green-500" :
                      isCurrent ? "bg-[#27265C]/30" :
                      "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {deliveryGroups.map((delivery) => {
            const dsInfo = getDeliveryStatusIcon(delivery.status);
            const deliveryTotal = delivery.items.reduce((s, i) => s + i.deliveredQty * i.price, 0);
            return (
              <Card key={delivery.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#27265C] flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${dsInfo.bg} flex items-center justify-center`}>
                          <Icon name={dsInfo.icon} size={16} className={dsInfo.color} />
                        </div>
                        Отгрузка {delivery.invoiceId}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-3">
                        <span>Дата: {delivery.date}</span>
                        <Badge className={
                          delivery.status === "Доставлен" ? "bg-green-100 text-green-700" :
                          delivery.status === "В пути" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }>
                          {delivery.status}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#27265C]">₽{deliveryTotal.toLocaleString()}</div>
                      <p className="text-sm text-gray-500">{delivery.items.length} позиций</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {delivery.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name="PackageCheck" size={20} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#27265C] truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">Арт: {item.sku}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-green-700 font-medium">
                              Отгружено: {item.deliveredQty} шт
                            </span>
                            {item.deliveredQty < item.quantity && (
                              <span className="text-xs text-gray-500">
                                из {item.quantity} заказанных
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-500">₽{item.price.toLocaleString()} × {item.deliveredQty}</p>
                          <p className="text-lg font-bold text-[#27265C]">₽{(item.deliveredQty * item.price).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {preorderItems.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#27265C] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon name="Clock" size={16} className="text-blue-600" />
                      </div>
                      Под заказ
                    </CardTitle>
                    <CardDescription>Товары заказаны у поставщика и будут привезены отдельно</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#27265C]">₽{totalPreorder.toLocaleString()}</div>
                    <p className="text-sm text-gray-500">{preorderItems.length} позиций</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-3">
                    <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Обязательство на выкуп</p>
                      <p>Товары заказаны специально — отказ от получения невозможен.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {preorderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="ShoppingBag" size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#27265C] truncate">{item.name}</h4>
                        <p className="text-sm text-gray-600">Арт: {item.sku}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-blue-100 text-blue-700">Под заказ</Badge>
                          <span className="text-sm text-gray-600">{item.quantity} шт</span>
                        </div>
                        {item.preorderEta && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-blue-700">
                            <Icon name="Calendar" size={14} />
                            <span>Ожидается: {item.preorderEta}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-gray-500">₽{item.price.toLocaleString()} × {item.quantity}</p>
                        <p className="text-lg font-bold text-[#27265C]">₽{(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {backorderItems.length > 0 && (
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#27265C] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Icon name="PackageX" size={16} className="text-amber-600" />
                      </div>
                      Недопоставка
                    </CardTitle>
                    <CardDescription>Товары, которые не были отгружены в полном объеме</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backorderItems.map((item) => {
                    const shippedQty = item.deliveries?.reduce((s, d) => s + d.qty, 0) || 0;
                    const shortageQty = item.backorderInfo?.shortageQty || (item.quantity - shippedQty);
                    const progressPercent = (shippedQty / item.quantity) * 100;
                    return (
                      <div key={item.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="AlertTriangle" size={20} className="text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#27265C] truncate">{item.name}</h4>
                            <p className="text-sm text-gray-600">Арт: {item.sku}</p>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Отгружено {shippedQty} из {item.quantity}</span>
                                <span className="font-medium text-amber-700">Недопоставка: {shortageQty} шт</span>
                              </div>
                              <Progress value={progressPercent} className="h-2" />
                            </div>

                            {item.backorderInfo && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-amber-200 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-amber-100 text-amber-800">{item.backorderInfo.status}</Badge>
                                  <Link to={`/backorders?id=${item.backorderInfo.backorderId}`} className="text-sm text-blue-600 hover:underline">
                                    {item.backorderInfo.backorderId}
                                  </Link>
                                </div>
                                <p className="text-sm text-gray-600">{item.backorderInfo.reason}</p>
                                {item.backorderInfo.estimatedArrival && (
                                  <div className="flex items-center gap-1 text-sm text-amber-700">
                                    <Icon name="Calendar" size={14} />
                                    <span>Ожидается поступление: {item.backorderInfo.estimatedArrival}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-gray-500">₽{item.price.toLocaleString()} × {item.quantity}</p>
                            <p className="text-lg font-bold text-[#27265C]">₽{(item.quantity * item.price).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Итого по заказу</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {totalShipped > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Отгружено:
                    </span>
                    <span className="font-semibold">₽{totalShipped.toLocaleString()}</span>
                  </div>
                )}
                {totalPreorder > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Под заказ:
                    </span>
                    <span className="font-semibold">₽{totalPreorder.toLocaleString()}</span>
                  </div>
                )}
                {totalBackorder > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Недопоставка:
                    </span>
                    <span className="font-semibold">₽{totalBackorder.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-[#27265C]">Всего:</span>
                  <span className="text-2xl font-bold text-[#27265C]">₽{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium flex items-center gap-2">
                    <Icon name="PackageCheck" size={16} />
                    Отгружено
                  </span>
                  <span className="font-bold text-green-700">
                    {order.items.reduce((s, i) => s + (i.deliveries?.reduce((ds, d) => ds + d.qty, 0) || 0), 0)} шт
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700 font-medium flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    Под заказ
                  </span>
                  <span className="font-bold text-blue-700">
                    {preorderItems.reduce((s, i) => s + i.quantity, 0)} шт
                  </span>
                </div>
                {backorderItems.length > 0 && (
                  <div className="flex items-center justify-between text-sm p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-700 font-medium flex items-center gap-2">
                      <Icon name="PackageX" size={16} />
                      Недопоставка
                    </span>
                    <span className="font-bold text-amber-700">
                      {backorderItems.reduce((s, i) => s + (i.backorderInfo?.shortageQty || 0), 0)} шт
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Icon name="Warehouse" size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Склад</p>
                  <p className="font-semibold text-[#27265C]">{order.warehouse}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="User" size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Менеджер</p>
                  <p className="font-semibold text-[#27265C]">{order.manager}</p>
                  <p className="text-sm text-blue-600">{order.managerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Calendar" size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Плановая отгрузка</p>
                  <p className="font-semibold text-[#27265C]">{order.delivery}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="FileText" size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Отгрузок</p>
                  <p className="font-semibold text-[#27265C]">{deliveryGroups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">История заказа</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.history.map((event, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        idx === 0 ? "bg-[#27265C]" : "bg-gray-300"
                      }`} />
                      {idx < order.history.length - 1 && (
                        <div className="w-px h-full bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-semibold text-[#27265C]">{event.event}</p>
                      <p className="text-xs text-gray-500">{event.date} • {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
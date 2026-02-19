import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

/* ─────────── Types ─────────── */

type OrderStatus =
  | "draft"
  | "sent"
  | "processing"
  | "needs-approval"
  | "confirmed"
  | "scheduled"
  | "shipped";

type ItemLineStatus =
  | "confirmed"
  | "pending"
  | "rejected-auto"
  | "rejected-manager"
  | "preorder"
  | "backorder";

interface OrderItemLine {
  name: string;
  sku: string;
  qtyRequested: number;
  qtyConfirmed: number;
  price: number;
  weightPerUnit: number;
  lineStatus: ItemLineStatus;
  rejectReason?: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  desiredShipDate: string | null;
  items: OrderItemLine[];
  totalAmount: number;
  totalWeight: number;
  warehouse: string;
  type: "Обычный" | "Прямой";
  isLocked: boolean;
  isStale: boolean;
  manager: string;
  managerPhone: string;
}

/* ─────────── Config ─────────── */

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: string; textColor: string; bgColor: string }
> = {
  draft: {
    label: "Черновик",
    icon: "FileEdit",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  sent: {
    label: "Отправлен",
    icon: "Send",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  processing: {
    label: "В обработке",
    icon: "Clock",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  "needs-approval": {
    label: "Требует согласования",
    icon: "RotateCcw",
    textColor: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  confirmed: {
    label: "Подтверждён",
    icon: "CheckCircle",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
  },
  scheduled: {
    label: "В графике отгрузки",
    icon: "CalendarCheck",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-100",
  },
  shipped: {
    label: "Отгружен",
    icon: "Truck",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
};

const LINE_STATUS_CONFIG: Record<
  ItemLineStatus,
  { label: string; dotColor: string; textColor: string; bgColor: string; icon: string }
> = {
  confirmed: {
    label: "Подтверждено",
    dotColor: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    icon: "CheckCircle",
  },
  pending: {
    label: "На рассмотрении",
    dotColor: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50 border-yellow-200",
    icon: "Clock",
  },
  "rejected-auto": {
    label: "Отклонено (авто)",
    dotColor: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: "XCircle",
  },
  "rejected-manager": {
    label: "Отклонено (менеджер)",
    dotColor: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: "UserX",
  },
  preorder: {
    label: "Предзаказ",
    dotColor: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    icon: "ShoppingBag",
  },
  backorder: {
    label: "Недопоставка",
    dotColor: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    icon: "AlertTriangle",
  },
};

const MAX_TRUCK_KG = 20000;

const ACTIVE_STATUSES: OrderStatus[] = [
  "draft",
  "sent",
  "processing",
  "needs-approval",
];
const CONFIRMED_STATUSES: OrderStatus[] = ["confirmed", "scheduled"];

/* ─────────── Helpers ─────────── */

function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} т`;
  return `${kg.toFixed(0)} кг`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function itemSummary(items: OrderItemLine[]) {
  let confirmed = 0;
  let pending = 0;
  let rejected = 0;
  let preorder = 0;
  let backorder = 0;

  for (const item of items) {
    switch (item.lineStatus) {
      case "confirmed":
        confirmed++;
        break;
      case "pending":
        pending++;
        break;
      case "rejected-auto":
      case "rejected-manager":
        rejected++;
        break;
      case "preorder":
        preorder++;
        break;
      case "backorder":
        backorder++;
        break;
    }
  }

  return { confirmed, pending, rejected, preorder, backorder };
}

/* ─────────── Mock Data ─────────── */

const mockOrders: Order[] = [
  {
    id: "ORD-2026-0201",
    date: "17.02.2026",
    status: "draft",
    desiredShipDate: "28.02.2026",
    totalAmount: 389500,
    totalWeight: 8500,
    warehouse: "Склад Москва (Подольск)",
    type: "Обычный",
    isLocked: false,
    isStale: false,
    manager: "Иванова Мария Сергеевна",
    managerPhone: "+7 (495) 123-45-67",
    items: [
      {
        name: "MANNOL Energy Formula OP 5W-30",
        sku: "MN7917-4",
        qtyRequested: 400,
        qtyConfirmed: 0,
        price: 1450,
        weightPerUnit: 4.2,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Diesel Extra 10W-40",
        sku: "MN7504-4",
        qtyRequested: 300,
        qtyConfirmed: 0,
        price: 1100,
        weightPerUnit: 4.5,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Antifreeze AG13 -40C",
        sku: "MN4013-5",
        qtyRequested: 250,
        qtyConfirmed: 0,
        price: 520,
        weightPerUnit: 5.2,
        lineStatus: "pending",
      },
    ],
  },
  {
    id: "ORD-2026-0198",
    date: "13.02.2026",
    status: "needs-approval",
    desiredShipDate: "25.02.2026",
    totalAmount: 1842600,
    totalWeight: 15300,
    warehouse: "Склад Москва (Подольск)",
    type: "Обычный",
    isLocked: false,
    isStale: false,
    manager: "Иванова Мария Сергеевна",
    managerPhone: "+7 (495) 123-45-67",
    items: [
      {
        name: "MANNOL Energy Formula OP 5W-30",
        sku: "MN7917-4",
        qtyRequested: 800,
        qtyConfirmed: 800,
        price: 1450,
        weightPerUnit: 4.2,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Diesel Extra 10W-40",
        sku: "MN7504-4",
        qtyRequested: 600,
        qtyConfirmed: 600,
        price: 1100,
        weightPerUnit: 4.5,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL ATF AG52 Automatic Special",
        sku: "MN8211-4",
        qtyRequested: 200,
        qtyConfirmed: 0,
        price: 980,
        weightPerUnit: 4.1,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Longlife 504/507 5W-30",
        sku: "MN7715-4",
        qtyRequested: 100,
        qtyConfirmed: 0,
        price: 1680,
        weightPerUnit: 4.0,
        lineStatus: "rejected-auto",
        rejectReason: "Нет свободных остатков на складе",
      },
      {
        name: "MANNOL Classic 10W-40",
        sku: "MN7501-4",
        qtyRequested: 80,
        qtyConfirmed: 50,
        price: 1050,
        weightPerUnit: 4.2,
        lineStatus: "rejected-manager",
        rejectReason: "Объём превышает доступный лимит поставки",
      },
      {
        name: "MANNOL Compressor Oil ISO 100",
        sku: "MN2902-4",
        qtyRequested: 150,
        qtyConfirmed: 0,
        price: 890,
        weightPerUnit: 4.3,
        lineStatus: "preorder",
      },
    ],
  },
  {
    id: "ORD-2026-0195",
    date: "10.02.2026",
    status: "confirmed",
    desiredShipDate: "20.02.2026",
    totalAmount: 2156000,
    totalWeight: 18200,
    warehouse: "Склад Москва (Подольск)",
    type: "Обычный",
    isLocked: true,
    isStale: false,
    manager: "Козлов Андрей Петрович",
    managerPhone: "+7 (495) 987-65-43",
    items: [
      {
        name: "MANNOL Energy Formula OP 5W-30",
        sku: "MN7917-4",
        qtyRequested: 1000,
        qtyConfirmed: 1000,
        price: 1450,
        weightPerUnit: 4.2,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Diesel Extra 10W-40",
        sku: "MN7504-4",
        qtyRequested: 500,
        qtyConfirmed: 500,
        price: 1100,
        weightPerUnit: 4.5,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Classic 10W-40",
        sku: "MN7501-4",
        qtyRequested: 300,
        qtyConfirmed: 300,
        price: 1050,
        weightPerUnit: 4.2,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Antifreeze AG13 -40C",
        sku: "MN4013-5",
        qtyRequested: 200,
        qtyConfirmed: 200,
        price: 520,
        weightPerUnit: 5.2,
        lineStatus: "confirmed",
      },
    ],
  },
  {
    id: "ORD-2026-0192",
    date: "12.02.2026",
    status: "sent",
    desiredShipDate: "22.02.2026",
    totalAmount: 1245000,
    totalWeight: 12100,
    warehouse: "Склад Москва (Подольск)",
    type: "Обычный",
    isLocked: false,
    isStale: true,
    manager: "Иванова Мария Сергеевна",
    managerPhone: "+7 (495) 123-45-67",
    items: [
      {
        name: "MANNOL Energy Formula OP 5W-30",
        sku: "MN7917-4",
        qtyRequested: 500,
        qtyConfirmed: 0,
        price: 1450,
        weightPerUnit: 4.2,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Diesel Extra 10W-40",
        sku: "MN7504-4",
        qtyRequested: 400,
        qtyConfirmed: 0,
        price: 1100,
        weightPerUnit: 4.5,
        lineStatus: "pending",
      },
      {
        name: "MANNOL ATF AG52 Automatic Special",
        sku: "MN8211-4",
        qtyRequested: 300,
        qtyConfirmed: 0,
        price: 980,
        weightPerUnit: 4.1,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Classic 10W-40",
        sku: "MN7501-4",
        qtyRequested: 200,
        qtyConfirmed: 0,
        price: 1050,
        weightPerUnit: 4.2,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Antifreeze AG13 -40C",
        sku: "MN4013-5",
        qtyRequested: 150,
        qtyConfirmed: 0,
        price: 520,
        weightPerUnit: 5.2,
        lineStatus: "pending",
      },
    ],
  },
  {
    id: "ORD-2026-0189",
    date: "08.02.2026",
    status: "scheduled",
    desiredShipDate: "19.02.2026",
    totalAmount: 2480000,
    totalWeight: 19500,
    warehouse: "Склад Москва (Подольск)",
    type: "Обычный",
    isLocked: true,
    isStale: false,
    manager: "Козлов Андрей Петрович",
    managerPhone: "+7 (495) 987-65-43",
    items: [
      {
        name: "MANNOL Energy Formula OP 5W-30",
        sku: "MN7917-4",
        qtyRequested: 1200,
        qtyConfirmed: 1200,
        price: 1450,
        weightPerUnit: 4.2,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Diesel Extra 10W-40",
        sku: "MN7504-4",
        qtyRequested: 700,
        qtyConfirmed: 700,
        price: 1100,
        weightPerUnit: 4.5,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Antifreeze AG13 -40C",
        sku: "MN4013-5",
        qtyRequested: 400,
        qtyConfirmed: 400,
        price: 520,
        weightPerUnit: 5.2,
        lineStatus: "confirmed",
      },
    ],
  },
  {
    id: "ORD-2026-0185",
    date: "05.02.2026",
    status: "shipped",
    desiredShipDate: "15.02.2026",
    totalAmount: 1923400,
    totalWeight: 17800,
    warehouse: "Склад Москва (Подольск)",
    type: "Обычный",
    isLocked: true,
    isStale: false,
    manager: "Иванова Мария Сергеевна",
    managerPhone: "+7 (495) 123-45-67",
    items: [
      {
        name: "MANNOL Energy Formula OP 5W-30",
        sku: "MN7917-4",
        qtyRequested: 900,
        qtyConfirmed: 900,
        price: 1450,
        weightPerUnit: 4.2,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Diesel Extra 10W-40",
        sku: "MN7504-4",
        qtyRequested: 500,
        qtyConfirmed: 500,
        price: 1100,
        weightPerUnit: 4.5,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Classic 10W-40",
        sku: "MN7501-4",
        qtyRequested: 200,
        qtyConfirmed: 200,
        price: 1050,
        weightPerUnit: 4.2,
        lineStatus: "confirmed",
      },
      {
        name: "MANNOL Antifreeze AG13 -40C",
        sku: "MN4013-5",
        qtyRequested: 300,
        qtyConfirmed: 250,
        price: 520,
        weightPerUnit: 5.2,
        lineStatus: "backorder",
        rejectReason: "Недопоставка 50 шт будет компенсирована",
      },
    ],
  },
  {
    id: "ORD-2026-0180",
    date: "14.02.2026",
    status: "processing",
    desiredShipDate: null,
    totalAmount: 1568000,
    totalWeight: 14200,
    warehouse: "Завод-производитель",
    type: "Прямой",
    isLocked: false,
    isStale: false,
    manager: "Козлов Андрей Петрович",
    managerPhone: "+7 (495) 987-65-43",
    items: [
      {
        name: "MANNOL Energy Formula OP 5W-30",
        sku: "MN7917-4",
        qtyRequested: 600,
        qtyConfirmed: 0,
        price: 1450,
        weightPerUnit: 4.2,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Diesel Extra 10W-40",
        sku: "MN7504-4",
        qtyRequested: 500,
        qtyConfirmed: 0,
        price: 1100,
        weightPerUnit: 4.5,
        lineStatus: "pending",
      },
      {
        name: "MANNOL ATF AG52 Automatic Special",
        sku: "MN8211-4",
        qtyRequested: 250,
        qtyConfirmed: 0,
        price: 980,
        weightPerUnit: 4.1,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Longlife 504/507 5W-30",
        sku: "MN7715-4",
        qtyRequested: 200,
        qtyConfirmed: 0,
        price: 1680,
        weightPerUnit: 4.0,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Classic 10W-40",
        sku: "MN7501-4",
        qtyRequested: 150,
        qtyConfirmed: 0,
        price: 1050,
        weightPerUnit: 4.2,
        lineStatus: "pending",
      },
      {
        name: "MANNOL Compressor Oil ISO 100",
        sku: "MN2902-4",
        qtyRequested: 180,
        qtyConfirmed: 0,
        price: 890,
        weightPerUnit: 4.3,
        lineStatus: "pending",
      },
    ],
  },
];

/* ─────────── Component ─────────── */

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");


  /* ── Filtering ── */

  const filterOrders = (statuses: OrderStatus[] | null) => {
    let filtered = mockOrders;
    if (statuses) {
      filtered = filtered.filter((o) => statuses.includes(o.status));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              item.sku.toLowerCase().includes(q)
          )
      );
    }
    return filtered;
  };

  const allOrders = useMemo(
    () => filterOrders(null),
    [searchQuery]
  );
  const activeOrders = useMemo(
    () => filterOrders(ACTIVE_STATUSES),
    [searchQuery]
  );
  const confirmedOrders = useMemo(
    () => filterOrders(CONFIRMED_STATUSES),
    [searchQuery]
  );
  const shippedOrders = useMemo(
    () => filterOrders(["shipped"]),
    [searchQuery]
  );

  /* ── Summary stats ── */

  const totalOrdersAmount = mockOrders.reduce((s, o) => s + o.totalAmount, 0);
  const activeCount = mockOrders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status)
  ).length;

  /* ── Quick actions per status ── */

  const renderQuickActions = (order: Order) => {
    switch (order.status) {
      case "draft":
        return (
          <div className="flex gap-2">
            <Link to={`/order/${order.id}`}>
              <Button size="sm" className="bg-[#27265C] hover:bg-[#27265C]/90 text-white text-xs">
                <Icon name="FileEdit" size={14} className="mr-1" />
                Редактировать
              </Button>
            </Link>
            <Link to={`/order/${order.id}/send`}>
              <Button
                size="sm"
                className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/80 text-xs font-semibold"
              >
                <Icon name="Send" size={14} className="mr-1" />
                Отправить
              </Button>
            </Link>
          </div>
        );
      case "needs-approval":
        return (
          <div className="flex gap-2">
            <Link to={`/order/${order.id}/review`}>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                <Icon name="ClipboardList" size={14} className="mr-1" />
                Результат
              </Button>
            </Link>
            <Link to={`/order/${order.id}/confirm`}>
              <Button size="sm" className="bg-[#27265C] hover:bg-[#27265C]/90 text-white text-xs">
                <Icon name="CheckCircle" size={14} className="mr-1" />
                Подтвердить
              </Button>
            </Link>
          </div>
        );
      case "sent":
      case "processing":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs border-gray-300">
              <Icon name="Phone" size={14} className="mr-1" />
              Связаться
            </Button>
          </div>
        );
      case "confirmed":
      case "scheduled":
        return (
          <div className="flex gap-2">
            <Link to={`/order/${order.id}`}>
              <Button size="sm" variant="outline" className="text-xs border-gray-300">
                <Icon name="Eye" size={14} className="mr-1" />
                Просмотреть
              </Button>
            </Link>
          </div>
        );
      case "shipped":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs border-gray-300">
              <Icon name="Download" size={14} className="mr-1" />
              Документы
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  /* ── Render a single order card ── */

  const renderOrderCard = (order: Order) => {
    const summary = itemSummary(order.items);
    const truckPercent = Math.min((order.totalWeight / MAX_TRUCK_KG) * 100, 100);
    const isDirect = order.type === "Прямой";
    const statusCfg = STATUS_CONFIG[order.status];

    return (
      <Card
        key={order.id}
        className={`hover:shadow-lg transition-all ${
          isDirect ? "border-purple-300 border-2" : ""
        } ${order.isStale ? "ring-2 ring-red-200" : ""}`}
      >
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            {/* ── Row 1: header ── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-lg font-bold text-[#27265C]">{order.id}</h3>
                  <Badge className={`${statusCfg.bgColor} ${statusCfg.textColor} gap-1`}>
                    <Icon name={statusCfg.icon} size={13} />
                    {statusCfg.label}
                  </Badge>
                  {isDirect && (
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-300 gap-1">
                      <Icon name="Factory" size={13} />
                      Прямой
                    </Badge>
                  )}
                  {order.isLocked && (
                    <Badge className="bg-gray-200 text-gray-600 gap-1">
                      <Icon name="Lock" size={13} />
                      Заблокирован
                    </Badge>
                  )}
                  {order.isStale && (
                    <Badge className="bg-red-100 text-red-700 border border-red-300 gap-1">
                      <Icon name="AlertOctagon" size={13} />
                      Не обработан &gt; 3 дн.
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={13} />
                    {order.date}
                  </span>
                  {isDirect ? (
                    <span className="flex items-center gap-1 text-purple-600 text-xs">
                      <Icon name="Info" size={13} />
                      Дата прямой поставки будет подтверждена
                    </span>
                  ) : order.desiredShipDate ? (
                    <span className="flex items-center gap-1">
                      <Icon name="Truck" size={13} />
                      Отгрузка: {order.desiredShipDate}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <Icon name="Warehouse" size={13} />
                    {order.warehouse}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-xl font-bold text-[#27265C]">
                  {formatCurrency(order.totalAmount)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatWeight(order.totalWeight)} / {order.items.length} поз.
                </div>
              </div>
            </div>

            {/* ── Row 2: item summary badges ── */}
            <div className="flex items-center gap-2 flex-wrap">
              {summary.confirmed > 0 && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {summary.confirmed} подтв.
                </Badge>
              )}
              {summary.pending > 0 && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  {summary.pending} на рассм.
                </Badge>
              )}
              {summary.rejected > 0 && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {summary.rejected} откл.
                </Badge>
              )}
              {summary.preorder > 0 && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {summary.preorder} предзаказ
                </Badge>
              )}
              {summary.backorder > 0 && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {summary.backorder} недопост.
                </Badge>
              )}
            </div>

            {/* ── Row 3: truck loading bar + actions ── */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Загрузка фуры</span>
                  <span className="font-semibold text-[#27265C]">
                    {formatWeight(order.totalWeight)} из {formatWeight(MAX_TRUCK_KG)}
                  </span>
                </div>
                <Progress
                  value={truckPercent}
                  className={`h-2.5 ${
                    truckPercent >= 90
                      ? "[&>div]:bg-green-500"
                      : truckPercent >= 60
                      ? "[&>div]:bg-[#27265C]"
                      : "[&>div]:bg-amber-500"
                  }`}
                />
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {truckPercent.toFixed(0)}% загружено
                  {order.totalWeight < MAX_TRUCK_KG &&
                    ` — осталось ${formatWeight(MAX_TRUCK_KG - order.totalWeight)}`}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {renderQuickActions(order)}
                <Link to={`/order/${order.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white text-xs"
                  >
                    <Icon name="Eye" size={14} className="mr-1" />
                    Подробнее
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  /* ── Empty state ── */

  const renderEmpty = (message: string) => (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon name="Package" size={28} className="text-gray-400" />
      </div>
      <p className="text-gray-500 text-lg">{message}</p>
      <p className="text-gray-400 text-sm mt-1">
        Попробуйте изменить фильтры или поисковый запрос
      </p>
    </div>
  );

  /* ── Order list ── */

  const renderOrderList = (orders: Order[], emptyMsg: string) => {
    if (orders.length === 0) return renderEmpty(emptyMsg);
    return (
      <div className="space-y-4">
        {orders.map((order) => renderOrderCard(order))}
      </div>
    );
  };

  /* ─────────── Main render ─────────── */

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Заказы</h1>
          <p className="text-gray-500 mt-1">
            Управление заказами MANNOL B2B
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
          >
            <Icon name="Download" size={18} className="mr-2" />
            Экспорт
          </Button>
          <Link to="/order/new">
            <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/80 font-semibold">
              <Icon name="Plus" size={18} className="mr-2" />
              Новый заказ
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Summary KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#27265C]/10 flex items-center justify-center">
              <Icon name="Package" size={22} className="text-[#27265C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#27265C]">
                {mockOrders.length}
              </p>
              <p className="text-xs text-gray-500">Всего заказов</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
              <Icon name="Clock" size={22} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{activeCount}</p>
              <p className="text-xs text-gray-500">Активных</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <Icon name="CheckCircle" size={22} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {
                  mockOrders.filter((o) =>
                    CONFIRMED_STATUSES.includes(o.status)
                  ).length
                }
              </p>
              <p className="text-xs text-gray-500">Подтверждённых</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FCC71E]/20 flex items-center justify-center">
              <Icon name="Banknote" size={22} className="text-[#27265C]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#27265C]">
                {formatCurrency(totalOrdersAmount)}
              </p>
              <p className="text-xs text-gray-500">Общая сумма</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-md">
        <Icon
          name="Search"
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Поиск по номеру заказа, товару или артикулу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="all">
        <TabsList className="bg-[#27265C]/5">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white">
            Все ({allOrders.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white">
            <Icon name="Clock" size={14} className="mr-1.5" />
            Активные ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white">
            <Icon name="CheckCircle" size={14} className="mr-1.5" />
            Подтверждённые ({confirmedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="shipped" className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white">
            <Icon name="Truck" size={14} className="mr-1.5" />
            Отгруженные ({shippedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderOrderList(allOrders, "Заказов не найдено")}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {renderOrderList(activeOrders, "Нет активных заказов")}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-4">
          {renderOrderList(confirmedOrders, "Нет подтверждённых заказов")}
        </TabsContent>
        <TabsContent value="shipped" className="mt-4">
          {renderOrderList(shippedOrders, "Нет отгруженных заказов")}
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default Orders;
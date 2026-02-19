export type OrderStatus =
  | "draft"
  | "sent"
  | "processing"
  | "needs-approval"
  | "confirmed"
  | "scheduled"
  | "shipped";

export type ItemLineStatus =
  | "confirmed"
  | "pending"
  | "rejected-auto"
  | "rejected-manager"
  | "preorder"
  | "backorder";

export type OrderType = "regular" | "direct";

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  qtyRequested: number;
  qtyConfirmed: number;
  qtyShortage: number;
  price: number;
  weightPerUnit: number;
  lineStatus: ItemLineStatus;
  rejectReason?: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  weightPerUnit: number;
  availability: "in-stock" | "plenty";
  category: "A";
  regularBuy: boolean;
}

export interface HistoryEntry {
  date: string;
  event: string;
  user: string;
  icon: string;
  color: string;
}

export interface OrderData {
  id: string;
  createdAt: string;
  updatedAt: string;
  sentAt: string;
  status: OrderStatus;
  orderType: OrderType;
  desiredShipmentDate: string;
  warehouse: string;
  manager: string;
  managerPhone: string;
  managerEmail: string;
  clientName: string;
  items: OrderItem[];
  history: HistoryEntry[];
}

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: string; color: string; bgColor: string; step: number }
> = {
  draft: {
    label: "Черновик",
    icon: "FileEdit",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    step: 1,
  },
  sent: {
    label: "Отправлен",
    icon: "Send",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    step: 2,
  },
  processing: {
    label: "В обработке",
    icon: "Clock",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    step: 3,
  },
  "needs-approval": {
    label: "Требует согласования",
    icon: "RotateCcw",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    step: 4,
  },
  confirmed: {
    label: "Подтверждён",
    icon: "CheckCircle",
    color: "text-green-700",
    bgColor: "bg-green-100",
    step: 5,
  },
  scheduled: {
    label: "В графике отгрузки",
    icon: "CalendarCheck",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    step: 6,
  },
  shipped: {
    label: "Отгружен",
    icon: "Truck",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    step: 7,
  },
};

export const STATUS_STEPS: OrderStatus[] = [
  "draft",
  "sent",
  "processing",
  "needs-approval",
  "confirmed",
  "scheduled",
  "shipped",
];

export const LINE_STATUS_CONFIG: Record<
  ItemLineStatus,
  { label: string; color: string; bgColor: string; dotColor: string; icon: string }
> = {
  confirmed: {
    label: "Подтверждено",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    dotColor: "bg-green-500",
    icon: "CheckCircle",
  },
  pending: {
    label: "На рассмотрении",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50 border-yellow-200",
    dotColor: "bg-yellow-500",
    icon: "Clock",
  },
  "rejected-auto": {
    label: "Отклонено автоматически",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    dotColor: "bg-red-500",
    icon: "XCircle",
  },
  "rejected-manager": {
    label: "Отклонено менеджером",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    dotColor: "bg-red-500",
    icon: "UserX",
  },
  preorder: {
    label: "Предзаказ",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    dotColor: "bg-blue-500",
    icon: "ShoppingBag",
  },
  backorder: {
    label: "Недопоставка",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    dotColor: "bg-amber-500",
    icon: "AlertTriangle",
  },
};

export const MAX_TRUCK_WEIGHT = 20000;

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} т`;
  return `${kg.toFixed(1)} кг`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function daysSince(dateStr: string): number {
  const parts = dateStr.split(" ")[0].split(".");
  const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  const now = new Date(2026, 1, 19);
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isOrderLocked(status: OrderStatus): boolean {
  return ["confirmed", "scheduled", "shipped"].includes(status);
}

export function canClientEdit(status: OrderStatus): boolean {
  return status === "draft" || status === "needs-approval";
}

export const MOCK_ORDER: OrderData = {
  id: "ORD-2026-0198",
  createdAt: "15.02.2026 09:15",
  updatedAt: "18.02.2026 14:30",
  sentAt: "15.02.2026 09:45",
  status: "needs-approval",
  orderType: "regular",
  desiredShipmentDate: "25.02.2026",
  warehouse: "Склад Москва (Подольск)",
  manager: "Иванова Мария Сергеевна",
  managerPhone: "+7 (495) 123-45-67",
  managerEmail: "ivanova@mannol.ru",
  clientName: 'ООО "АвтоСнаб Плюс"',
  items: [
    {
      id: "item-1",
      name: "MANNOL Energy Formula OP 5W-30 API SN/CF",
      sku: "MN7917-4",
      qtyRequested: 800,
      qtyConfirmed: 800,
      qtyShortage: 0,
      price: 1450,
      weightPerUnit: 4.2,
      lineStatus: "confirmed",
    },
    {
      id: "item-2",
      name: "MANNOL Diesel Extra 10W-40 API CI-4/SL",
      sku: "MN7504-4",
      qtyRequested: 600,
      qtyConfirmed: 600,
      qtyShortage: 0,
      price: 1100,
      weightPerUnit: 4.5,
      lineStatus: "confirmed",
    },
    {
      id: "item-3",
      name: "MANNOL ATF AG52 Automatic Special",
      sku: "MN8211-4",
      qtyRequested: 200,
      qtyConfirmed: 0,
      qtyShortage: 0,
      price: 980,
      weightPerUnit: 4.1,
      lineStatus: "pending",
    },
    {
      id: "item-4",
      name: "MANNOL Longlife 504/507 5W-30",
      sku: "MN7715-4",
      qtyRequested: 100,
      qtyConfirmed: 0,
      qtyShortage: 100,
      price: 1680,
      weightPerUnit: 4.0,
      lineStatus: "rejected-auto",
      rejectReason: "Нет свободных остатков на складе",
    },
    {
      id: "item-5",
      name: "MANNOL Classic 10W-40 API SN/CF",
      sku: "MN7501-4",
      qtyRequested: 80,
      qtyConfirmed: 50,
      qtyShortage: 30,
      price: 1050,
      weightPerUnit: 4.2,
      lineStatus: "rejected-manager",
      rejectReason: "Решение менеджера: объём превышает доступный лимит поставки",
    },
    {
      id: "item-6",
      name: "MANNOL Compressor Oil ISO 100",
      sku: "MN2902-4",
      qtyRequested: 150,
      qtyConfirmed: 0,
      qtyShortage: 0,
      price: 890,
      weightPerUnit: 4.3,
      lineStatus: "preorder",
    },
    {
      id: "item-7",
      name: "MANNOL Antifreeze AG13 -40C",
      sku: "MN4013-5",
      qtyRequested: 300,
      qtyConfirmed: 250,
      qtyShortage: 50,
      price: 520,
      weightPerUnit: 5.2,
      lineStatus: "backorder",
      rejectReason: "Недопоставка будет компенсирована при ближайшей отгрузке",
    },
  ],
  history: [
    {
      date: "15.02.2026 09:15",
      event: "Заказ создан клиентом",
      user: "Петров И.П.",
      icon: "FilePlus",
      color: "text-gray-600",
    },
    {
      date: "15.02.2026 09:45",
      event: "Заказ отправлен на согласование менеджеру",
      user: "Петров И.П.",
      icon: "Send",
      color: "text-blue-600",
    },
    {
      date: "15.02.2026 10:02",
      event: "Менеджер принял заказ в работу",
      user: "Иванова М.С.",
      icon: "UserCheck",
      color: "text-indigo-600",
    },
    {
      date: "16.02.2026 11:30",
      event: "Автоматическая проверка остатков выполнена",
      user: "Система",
      icon: "Database",
      color: "text-purple-600",
    },
    {
      date: "17.02.2026 09:15",
      event: "Менеджер внёс корректировки по позициям",
      user: "Иванова М.С.",
      icon: "Edit",
      color: "text-orange-600",
    },
    {
      date: "18.02.2026 14:30",
      event: "Заказ возвращён клиенту на согласование",
      user: "Иванова М.С.",
      icon: "RotateCcw",
      color: "text-orange-600",
    },
  ],
};

export const MOCK_RECOMMENDATIONS: RecommendedProduct[] = [
  {
    id: "rec-1",
    name: "MANNOL Brake Fluid DOT-4",
    sku: "MN3002-0.5",
    price: 350,
    weightPerUnit: 0.55,
    availability: "plenty",
    category: "A",
    regularBuy: true,
  },
  {
    id: "rec-2",
    name: "MANNOL Dexron III Automatic Plus",
    sku: "MN8206-4",
    price: 920,
    weightPerUnit: 4.0,
    availability: "in-stock",
    category: "A",
    regularBuy: false,
  },
  {
    id: "rec-3",
    name: "MANNOL Motor Flush 10min",
    sku: "MN9900-0.35",
    price: 290,
    weightPerUnit: 0.4,
    availability: "plenty",
    category: "A",
    regularBuy: true,
  },
  {
    id: "rec-4",
    name: "MANNOL Radiator Flush",
    sku: "MN9965-0.325",
    price: 310,
    weightPerUnit: 0.38,
    availability: "in-stock",
    category: "A",
    regularBuy: true,
  },
];

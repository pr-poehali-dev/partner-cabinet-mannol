import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

/* ─────────── Types ─────────── */

type OrderStatus = "draft" | "processing" | "confirmed" | "shipped";

interface OrderItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  desiredShipDate: string | null;
  items: OrderItem[];
  totalAmount: number;
  warehouse: string;
  manager: string;
}

/* ─────────── Status config ─────────── */

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: string; textColor: string; bgColor: string }
> = {
  draft: {
    label: "Черновик",
    icon: "FileEdit",
    textColor: "text-slate-600",
    bgColor: "bg-slate-100",
  },
  processing: {
    label: "В обработке",
    icon: "Clock",
    textColor: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  confirmed: {
    label: "Подтверждён",
    icon: "CheckCircle",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  shipped: {
    label: "Отгружен",
    icon: "Truck",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
  },
};

/* ─────────── Helpers ─────────── */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ─────────── Mock data ─────────── */

const mockOrders: Order[] = [
  {
    id: "ORD-2026-0201",
    date: "17.02.2026",
    status: "draft",
    desiredShipDate: "28.02.2026",
    totalAmount: 389500,
    warehouse: "Москва (Подольск)",
    manager: "Иванова М.С.",
    items: [
      { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 400, price: 1450 },
      { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 300, price: 1100 },
      { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", qty: 250, price: 520 },
    ],
  },
  {
    id: "ORD-2026-0198",
    date: "13.02.2026",
    status: "processing",
    desiredShipDate: "25.02.2026",
    totalAmount: 1842600,
    warehouse: "Москва (Подольск)",
    manager: "Иванова М.С.",
    items: [
      { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 800, price: 1450 },
      { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 600, price: 1100 },
      { name: "MANNOL ATF AG52 Automatic Special", sku: "MN8211-4", qty: 200, price: 980 },
      { name: "MANNOL Longlife 504/507 5W-30", sku: "MN7715-4", qty: 100, price: 1680 },
      { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 80, price: 1050 },
    ],
  },
  {
    id: "ORD-2026-0194",
    date: "11.02.2026",
    status: "processing",
    desiredShipDate: "22.02.2026",
    totalAmount: 1245000,
    warehouse: "Москва (Подольск)",
    manager: "Иванова М.С.",
    items: [
      { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 500, price: 1450 },
      { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 400, price: 1100 },
      { name: "MANNOL ATF AG52 Automatic Special", sku: "MN8211-4", qty: 300, price: 980 },
    ],
  },
  {
    id: "ORD-2026-0189",
    date: "08.02.2026",
    status: "confirmed",
    desiredShipDate: "19.02.2026",
    totalAmount: 2480000,
    warehouse: "Москва (Подольск)",
    manager: "Козлов А.П.",
    items: [
      { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 1200, price: 1450 },
      { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 700, price: 1100 },
      { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", qty: 400, price: 520 },
    ],
  },
  {
    id: "ORD-2026-0185",
    date: "05.02.2026",
    status: "shipped",
    desiredShipDate: "15.02.2026",
    totalAmount: 1923400,
    warehouse: "Москва (Подольск)",
    manager: "Иванова М.С.",
    items: [
      { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 900, price: 1450 },
      { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 500, price: 1100 },
      { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 200, price: 1050 },
      { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", qty: 300, price: 520 },
    ],
  },
  {
    id: "ORD-2026-0180",
    date: "01.02.2026",
    status: "shipped",
    desiredShipDate: "12.02.2026",
    totalAmount: 1568000,
    warehouse: "Москва (Подольск)",
    manager: "Козлов А.П.",
    items: [
      { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 600, price: 1450 },
      { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 500, price: 1100 },
      { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 150, price: 1050 },
    ],
  },
];

/* ─────────── Component ─────────── */

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filter = (statuses: OrderStatus[] | null) => {
    let list = mockOrders;
    if (statuses) list = list.filter((o) => statuses.includes(o.status));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some(
            (it) =>
              it.name.toLowerCase().includes(q) ||
              it.sku.toLowerCase().includes(q)
          )
      );
    }
    return list;
  };

  const allOrders = useMemo(() => filter(null), [searchQuery]);
  const draftOrders = useMemo(() => filter(["draft"]), [searchQuery]);
  const processingOrders = useMemo(() => filter(["processing"]), [searchQuery]);
  const confirmedOrders = useMemo(() => filter(["confirmed"]), [searchQuery]);
  const shippedOrders = useMemo(() => filter(["shipped"]), [searchQuery]);

  const totalAmount = mockOrders.reduce((s, o) => s + o.totalAmount, 0);

  /* ── Order card ── */

  const renderCard = (order: Order) => {
    const cfg = STATUS_CONFIG[order.status];
    const totalQty = order.items.reduce((s, it) => s + it.qty, 0);

    return (
      <Card
        key={order.id}
        className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md transition-shadow"
      >
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">

            {/* Row 1: header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-bold text-[#27265C]">{order.id}</h3>
                  <Badge className={`${cfg.bgColor} ${cfg.textColor} border-0 gap-1.5 font-medium`}>
                    <Icon name={cfg.icon} size={12} />
                    {cfg.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Icon name="Calendar" size={13} />
                    {order.date}
                  </span>
                  {order.desiredShipDate && (
                    <span className="flex items-center gap-1.5">
                      <Icon name="Truck" size={13} />
                      Отгрузка: {order.desiredShipDate}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Icon name="Warehouse" size={13} />
                    {order.warehouse}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="User" size={13} />
                    {order.manager}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-xl font-bold text-[#27265C]">{formatCurrency(order.totalAmount)}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {order.items.length} поз. · {totalQty} шт.
                </p>
              </div>
            </div>

            {/* Row 2: items preview */}
            <div className="flex flex-wrap gap-1.5">
              {order.items.slice(0, 3).map((it) => (
                <span
                  key={it.sku}
                  className="text-xs bg-[#F4F4F4] text-[#27265C]/70 px-2.5 py-1 rounded-lg font-medium"
                >
                  {it.sku} × {it.qty}
                </span>
              ))}
              {order.items.length > 3 && (
                <span className="text-xs bg-[#F4F4F4] text-muted-foreground px-2.5 py-1 rounded-lg">
                  +{order.items.length - 3} ещё
                </span>
              )}
            </div>

            {/* Row 3: actions */}
            <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#F4F4F4]">
              <div className="flex gap-2 flex-wrap">
                {order.status === "draft" && (
                  <Link to={`/order/${order.id}/send`}>
                    <Button
                      size="sm"
                      className="h-8 px-3 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-semibold text-xs"
                    >
                      <Icon name="Send" size={13} className="mr-1.5" />
                      Отправить на согласование
                    </Button>
                  </Link>
                )}
                {order.status === "confirmed" && (
                  <Link to={`/order/${order.id}/confirm`}>
                    <Button
                      size="sm"
                      className="h-8 px-3 bg-[#27265C] hover:bg-[#27265C]/90 text-white text-xs font-semibold"
                    >
                      <Icon name="CheckCircle" size={13} className="mr-1.5" />
                      Подтвердить заказ
                    </Button>
                  </Link>
                )}
              </div>

              <Link to={`/order/${order.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 text-xs font-medium"
                >
                  <Icon name="Eye" size={13} className="mr-1.5" />
                  Открыть
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmpty = (msg: string) => (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-[#27265C]/5 flex items-center justify-center mx-auto mb-4">
        <Icon name="Package" size={28} className="text-[#27265C]/25" />
      </div>
      <p className="text-[#27265C]/50 font-semibold">{msg}</p>
      <p className="text-muted-foreground text-sm mt-1">Попробуйте изменить поисковый запрос</p>
    </div>
  );

  const renderList = (orders: Order[], empty: string) =>
    orders.length === 0 ? renderEmpty(empty) : (
      <div className="space-y-4">{orders.map(renderCard)}</div>
    );

  /* ─────────── Render ─────────── */

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#27265C]">Мои заказы</h1>
          <p className="text-muted-foreground mt-1 text-sm">История и управление заказами</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 h-10"
          >
            <Icon name="Download" size={16} className="mr-2" />
            <span className="hidden sm:inline">Экспорт</span>
          </Button>
          <Link to="/order/new">
            <Button className="bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-10 px-4 shadow-sm">
              <Icon name="Plus" size={16} className="mr-2" />
              Новый заказ
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27265C]/8 flex items-center justify-center flex-shrink-0">
              <Icon name="Package" size={18} className="text-[#27265C]" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-extrabold text-[#27265C] leading-none">{mockOrders.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Всего заказов</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Icon name="Clock" size={18} className="text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-extrabold text-amber-600 leading-none">
                {mockOrders.filter((o) => o.status === "processing" || o.status === "draft").length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">В обработке</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircle" size={18} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-extrabold text-emerald-600 leading-none">
                {mockOrders.filter((o) => o.status === "confirmed").length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Подтверждено</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCC71E]/15 flex items-center justify-center flex-shrink-0">
              <Icon name="Banknote" size={18} className="text-[#27265C]" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-extrabold text-[#27265C] leading-none truncate">
                {formatCurrency(totalAmount)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Общая сумма</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full md:max-w-md">
        <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск по номеру, товару или артикулу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 border-[#E2E2E2] focus:border-[#27265C] rounded-lg"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="bg-[#27265C]/6 flex overflow-x-auto w-full rounded-xl p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white flex-shrink-0 text-xs md:text-sm rounded-lg font-medium"
          >
            Все ({allOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white flex-shrink-0 text-xs md:text-sm rounded-lg font-medium"
          >
            <Icon name="FileEdit" size={13} className="mr-1" />
            <span className="hidden sm:inline">Черновики </span>({draftOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="processing"
            className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white flex-shrink-0 text-xs md:text-sm rounded-lg font-medium"
          >
            <Icon name="Clock" size={13} className="mr-1" />
            <span className="hidden sm:inline">В обработке </span>({processingOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white flex-shrink-0 text-xs md:text-sm rounded-lg font-medium"
          >
            <Icon name="CheckCircle" size={13} className="mr-1" />
            <span className="hidden sm:inline">Подтверждённые </span>({confirmedOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="shipped"
            className="data-[state=active]:bg-[#27265C] data-[state=active]:text-white flex-shrink-0 text-xs md:text-sm rounded-lg font-medium"
          >
            <Icon name="Truck" size={13} className="mr-1" />
            <span className="hidden sm:inline">Отгруженные </span>({shippedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-5">
          {renderList(allOrders, "Заказов не найдено")}
        </TabsContent>
        <TabsContent value="draft" className="mt-5">
          {renderList(draftOrders, "Нет черновиков")}
        </TabsContent>
        <TabsContent value="processing" className="mt-5">
          {renderList(processingOrders, "Нет заказов в обработке")}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-5">
          {renderList(confirmedOrders, "Нет подтверждённых заказов")}
        </TabsContent>
        <TabsContent value="shipped" className="mt-5">
          {renderList(shippedOrders, "Нет отгруженных заказов")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
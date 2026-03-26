import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

/* ─── shared mock data (consistent with Orders.tsx) ─── */
const RECENT_ORDERS = [
  { id: "ORD-2026-0201", date: "17.02.2026", status: "draft" as const, amount: 389500, items: 3 },
  { id: "ORD-2026-0198", date: "13.02.2026", status: "processing" as const, amount: 1842600, items: 5 },
  { id: "ORD-2026-0189", date: "08.02.2026", status: "confirmed" as const, amount: 2480000, items: 3 },
];

const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  draft:      { label: "Черновик",     bg: "bg-slate-100", color: "text-slate-600" },
  processing: { label: "В обработке",  bg: "bg-amber-100", color: "text-amber-700" },
  confirmed:  { label: "Подтверждён",  bg: "bg-emerald-100", color: "text-emerald-700" },
  shipped:    { label: "Отгружен",     bg: "bg-blue-100", color: "text-blue-700" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#27265C]">Личный кабинет партнёра</h1>
          <p className="text-muted-foreground mt-1 text-sm">Добрый день! Управляйте заказами MANNOL</p>
        </div>
        <Link to="/order/new">
          <Button className="bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-11 px-5 shadow-sm">
            <Icon name="Plus" size={17} className="mr-2" />
            Новый заказ
          </Button>
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/orders">
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#27265C]/8 flex items-center justify-center">
                  <Icon name="ShoppingCart" size={19} className="text-[#27265C]" />
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground/40 mt-1" />
              </div>
              <p className="text-3xl font-extrabold text-[#27265C]">6</p>
              <p className="text-sm text-muted-foreground mt-0.5">Активных заказов</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/orders?tab=confirmed">
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Icon name="CheckCircle" size={19} className="text-emerald-600" />
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground/40 mt-1" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-600">1</p>
              <p className="text-sm text-muted-foreground mt-0.5">Подтверждено</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/backorders">
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Icon name="PackageX" size={19} className="text-orange-600" />
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground/40 mt-1" />
              </div>
              <p className="text-3xl font-extrabold text-orange-600">3</p>
              <p className="text-sm text-muted-foreground mt-0.5">Недопоставки</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/analytics">
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#FCC71E]/20 flex items-center justify-center">
                  <Icon name="TrendingUp" size={19} className="text-[#27265C]" />
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground/40 mt-1" />
              </div>
              <p className="text-xl font-extrabold text-[#27265C] truncate">{fmt(7449500)}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Заказов за месяц</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main 2-col */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Recent orders */}
        <div className="md:col-span-2">
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm h-full">
            <CardHeader className="px-6 py-5 border-b border-[#F0F0F0]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#27265C]">Последние заказы</CardTitle>
                <Link to="/orders">
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-[#27265C]/60 hover:text-[#27265C]">
                    Все заказы
                    <Icon name="ChevronRight" size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#F4F4F4]">
                {RECENT_ORDERS.map((order) => {
                  const s = STATUS_LABEL[order.status];
                  return (
                    <Link key={order.id} to={`/order/${order.id}`}>
                      <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-[#27265C]/5 flex items-center justify-center flex-shrink-0">
                            <Icon name="FileText" size={15} className="text-[#27265C]/50" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#27265C] truncate">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.date} · {order.items} поз.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge className={`${s.bg} ${s.color} border-0 text-xs font-medium hidden sm:flex`}>
                            {s.label}
                          </Badge>
                          <p className="text-sm font-bold text-[#27265C]">{fmt(order.amount)}</p>
                          <Icon name="ChevronRight" size={15} className="text-muted-foreground/40" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="px-6 py-4 border-t border-[#F4F4F4]">
                <Link to="/order/new">
                  <Button className="w-full bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-10">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать новый заказ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Debt alert */}
          <Card className="border-2 border-red-200 rounded-2xl shadow-sm bg-red-50">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="AlertCircle" size={17} className="text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-red-700">Просроченная задолженность</p>
                  <p className="text-xs text-red-600/80 mt-0.5">До блокировки отгрузок</p>
                </div>
              </div>
              <p className="text-2xl font-extrabold text-red-700 mb-3">{fmt(410000)}</p>
              <div className="flex gap-2">
                <Link to="/payments" className="flex-1">
                  <Button size="sm" className="w-full h-9 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold">
                    Оплатить
                  </Button>
                </Link>
                <Link to="/debt-details">
                  <Button size="sm" variant="outline" className="h-9 border-red-300 text-red-600 hover:bg-red-100 text-xs">
                    Детали
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Next shipment */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="CalendarDays" size={17} className="text-indigo-600" />
                </div>
                <p className="text-sm font-semibold text-[#27265C]">Ближайшая отгрузка</p>
              </div>
              <p className="text-base font-bold text-[#27265C] mb-0.5">19 февраля 2026</p>
              <p className="text-xs text-muted-foreground mb-3">ORD-2026-0189 · Москва (Подольск)</p>
              <Link to="/schedule">
                <Button variant="outline" size="sm" className="w-full h-9 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 text-xs font-medium">
                  <Icon name="Calendar" size={13} className="mr-1.5" />
                  График отгрузок
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Быстрые действия</p>
              <div className="space-y-1">
                {[
                  { to: "/catalog",    icon: "Package",     label: "Каталог товаров" },
                  { to: "/backorders", icon: "PackageX",    label: "Недопоставки" },
                  { to: "/analytics",  icon: "BarChart2",   label: "Аналитика" },
                  { to: "/payments",   icon: "Banknote",    label: "Оплата счетов" },
                ].map((item) => (
                  <Link key={item.to} to={item.to}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F7F7] transition-colors group">
                      <Icon name={item.icon} size={15} className="text-[#27265C]/50 group-hover:text-[#27265C] transition-colors flex-shrink-0" />
                      <span className="text-sm text-[#27265C]/70 group-hover:text-[#27265C] transition-colors font-medium">{item.label}</span>
                      <Icon name="ChevronRight" size={13} className="text-muted-foreground/30 ml-auto" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
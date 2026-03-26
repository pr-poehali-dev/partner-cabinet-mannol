import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Link, useParams } from "react-router-dom";
import { formatCurrency, MOCK_ORDER } from "@/types/order";

/* ─── Status config matching Orders.tsx ─── */
type OrderStatus = "draft" | "processing" | "confirmed" | "shipped";

const STATUS_CFG: Record<OrderStatus, { label: string; icon: string; color: string; bg: string; step: number }> = {
  draft:      { label: "Черновик",    icon: "FileEdit",    color: "text-slate-600",   bg: "bg-slate-100",   step: 1 },
  processing: { label: "В обработке", icon: "Clock",       color: "text-amber-700",   bg: "bg-amber-100",   step: 2 },
  confirmed:  { label: "Подтверждён", icon: "CheckCircle", color: "text-emerald-700", bg: "bg-emerald-100", step: 3 },
  shipped:    { label: "Отгружен",    icon: "Truck",       color: "text-blue-700",    bg: "bg-blue-100",    step: 4 },
};

const STEPS: OrderStatus[] = ["draft", "processing", "confirmed", "shipped"];

/* ─── Per-order data keyed by ID ─── */
const ORDERS_MAP: Record<string, { status: OrderStatus; date: string; shipDate: string | null; warehouse: string; manager: string; managerPhone: string; totalAmount: number }> = {
  "ORD-2026-0201": { status: "draft",      date: "17.02.2026", shipDate: "28.02.2026", warehouse: "Москва (Подольск)", manager: "Иванова М.С.", managerPhone: "+7 (495) 123-45-67", totalAmount: 389500 },
  "ORD-2026-0198": { status: "processing", date: "13.02.2026", shipDate: "25.02.2026", warehouse: "Москва (Подольск)", manager: "Иванова М.С.", managerPhone: "+7 (495) 123-45-67", totalAmount: 1842600 },
  "ORD-2026-0194": { status: "processing", date: "11.02.2026", shipDate: "22.02.2026", warehouse: "Москва (Подольск)", manager: "Иванова М.С.", managerPhone: "+7 (495) 123-45-67", totalAmount: 1245000 },
  "ORD-2026-0189": { status: "confirmed",  date: "08.02.2026", shipDate: "19.02.2026", warehouse: "Москва (Подольск)", manager: "Козлов А.П.",  managerPhone: "+7 (495) 987-65-43", totalAmount: 2480000 },
  "ORD-2026-0185": { status: "shipped",    date: "05.02.2026", shipDate: "15.02.2026", warehouse: "Москва (Подольск)", manager: "Иванова М.С.", managerPhone: "+7 (495) 123-45-67", totalAmount: 1923400 },
  "ORD-2026-0180": { status: "shipped",    date: "01.02.2026", shipDate: "12.02.2026", warehouse: "Москва (Подольск)", manager: "Козлов А.П.",  managerPhone: "+7 (495) 987-65-43", totalAmount: 1568000 },
};

const HISTORY = [
  { date: "15.02.2026 09:15", event: "Заказ создан",                         icon: "FilePlus",  color: "text-slate-500" },
  { date: "15.02.2026 09:45", event: "Отправлен на согласование",             icon: "Send",      color: "text-blue-500" },
  { date: "15.02.2026 10:02", event: "Принят менеджером в работу",            icon: "UserCheck", color: "text-indigo-500" },
  { date: "16.02.2026 11:30", event: "Автоматическая проверка остатков",      icon: "Database",  color: "text-purple-500" },
  { date: "17.02.2026 09:15", event: "Менеджер внёс корректировки",           icon: "Edit",      color: "text-orange-500" },
];

export default function OrderDetails() {
  const { orderId } = useParams();
  const id = orderId || "ORD-2026-0198";

  const meta = ORDERS_MAP[id] || ORDERS_MAP["ORD-2026-0198"];
  const status = meta.status;
  const cfg = STATUS_CFG[status];
  const currentStep = cfg.step;

  // Use MOCK_ORDER items for all orders (mock)
  const items = MOCK_ORDER.items;
  const confirmedItems = items.filter((i) => i.lineStatus === "confirmed");
  const pendingItems   = items.filter((i) => i.lineStatus === "pending");
  const rejectedItems  = items.filter((i) => i.lineStatus === "rejected-auto" || i.lineStatus === "rejected-manager");
  const backorderItems = items.filter((i) => i.lineStatus === "backorder");

  const [historyOpen, setHistoryOpen] = useState(false);

  const totalQty = items.reduce((s, i) => s + i.qtyRequested, 0);

  return (
    <div className="space-y-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/orders" className="hover:text-[#27265C] transition-colors font-medium">Заказы</Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <span className="text-[#27265C] font-semibold">{id}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[#27265C]">{id}</h1>
            <Badge className={`${cfg.bg} ${cfg.color} border-0 gap-1.5 font-semibold`}>
              <Icon name={cfg.icon} size={13} />
              {cfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Создан {meta.date} · {meta.warehouse} · {meta.manager}
          </p>
        </div>

        {/* Action buttons per status */}
        <div className="flex flex-wrap gap-2 flex-shrink-0">
          {status === "draft" && (
            <Link to={`/order/${id}/send`}>
              <Button className="bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-10 px-4">
                <Icon name="Send" size={15} className="mr-2" />
                Отправить на согласование
              </Button>
            </Link>
          )}
          {status === "confirmed" && (
            <Link to={`/order/${id}/confirm`}>
              <Button className="bg-[#27265C] hover:bg-[#27265C]/90 text-white font-bold h-10 px-4">
                <Icon name="CheckCircle" size={15} className="mr-2" />
                Подтвердить заказ
              </Button>
            </Link>
          )}
          {status === "processing" && (
            <Button variant="outline" className="border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 h-10 px-4">
              <Icon name="Phone" size={15} className="mr-2" />
              {meta.managerPhone}
            </Button>
          )}
          {(status === "shipped") && (
            <Button variant="outline" className="border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 h-10 px-4">
              <Icon name="Download" size={15} className="mr-2" />
              Скачать документы
            </Button>
          )}
        </div>
      </div>

      {/* Progress steps */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="px-6 py-5">
          <div className="overflow-x-auto">
            <div className="flex items-center min-w-[380px]">
              {STEPS.map((step, idx) => {
                const s = STATUS_CFG[step];
                const done = s.step < currentStep;
                const active = s.step === currentStep;
                return (
                  <div key={step} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        done   ? "bg-[#27265C] text-white" :
                        active ? "bg-[#FCC71E] text-[#27265C]" :
                                 "bg-[#F4F4F4] text-muted-foreground"
                      }`}>
                        {done
                          ? <Icon name="Check" size={16} />
                          : <Icon name={s.icon} size={15} />
                        }
                      </div>
                      <span className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                        active ? "text-[#27265C] font-bold" : "text-muted-foreground"
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? "bg-[#27265C]" : "bg-[#E8E8E8]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main 2-col */}
      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* Left: items */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Items table */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="px-6 py-5 bg-[#27265C] border-b border-[#27265C]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon name="Package" size={15} className="text-[#FCC71E]" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-white">
                    Состав заказа
                  </CardTitle>
                </div>
                <span className="text-xs text-white/60">{items.length} позиций · {totalQty} шт.</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                      <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 whitespace-nowrap">Товар</th>
                      <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 whitespace-nowrap">Артикул</th>
                      <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 whitespace-nowrap">Запрос</th>
                      <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 whitespace-nowrap">Подтв.</th>
                      <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 whitespace-nowrap">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F4F4]">
                    {items.map((item) => {
                      const isRejected = item.lineStatus === "rejected-auto" || item.lineStatus === "rejected-manager";
                      const isBackorder = item.lineStatus === "backorder";
                      const isPending = item.lineStatus === "pending";
                      const isConfirmed = item.lineStatus === "confirmed";

                      const rowSum = (item.qtyConfirmed > 0 ? item.qtyConfirmed : item.qtyRequested) * item.price;

                      return (
                        <tr key={item.id} className={`transition-colors ${isRejected ? "bg-red-50/50" : "hover:bg-[#FAFAFA]"}`}>
                          <td className="px-5 py-3.5">
                            <p className={`text-sm font-medium leading-snug ${isRejected ? "text-muted-foreground line-through" : "text-[#27265C]"}`}>
                              {item.name}
                            </p>
                            {isRejected && (
                              <p className="text-xs text-red-500 mt-0.5">{item.rejectReason}</p>
                            )}
                            {isBackorder && (
                              <p className="text-xs text-amber-600 mt-0.5">{item.rejectReason}</p>
                            )}
                          </td>
                          <td className="px-3 py-3.5">
                            <span className="text-xs font-mono text-muted-foreground bg-[#F4F4F4] px-2 py-0.5 rounded whitespace-nowrap">
                              {item.sku}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <span className="text-sm font-medium text-[#27265C]">{item.qtyRequested}</span>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            {isConfirmed  && <span className="text-sm font-bold text-emerald-600">{item.qtyConfirmed}</span>}
                            {isPending    && <span className="text-sm text-amber-500">—</span>}
                            {isRejected   && <span className="text-sm text-red-400 font-medium">0</span>}
                            {isBackorder  && (
                              <div>
                                <span className="text-sm font-bold text-[#27265C]">{item.qtyConfirmed}</span>
                                <Badge className="ml-1 bg-amber-100 text-amber-700 border-0 text-[10px] px-1.5">недопост.</Badge>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className={`text-sm font-semibold ${isRejected ? "text-muted-foreground/50 line-through" : "text-[#27265C]"}`}>
                              {formatCurrency(rowSum)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardHeader className="px-6 py-5 border-b border-[#F0F0F0] cursor-pointer" onClick={() => setHistoryOpen(!historyOpen)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#27265C]/8 flex items-center justify-center">
                    <Icon name="History" size={15} className="text-[#27265C]" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-[#27265C]">История изменений</CardTitle>
                </div>
                <Icon name={historyOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
              </div>
            </CardHeader>
            {historyOpen && (
              <CardContent className="px-6 py-4">
                <div className="space-y-3">
                  {HISTORY.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#F4F4F4] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name={h.icon} size={13} className={h.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#27265C]">{h.event}</p>
                        <p className="text-xs text-muted-foreground">{h.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right: summary */}
        <div className="w-full md:w-72 flex-shrink-0 space-y-4 md:sticky md:top-6">

          {/* Summary */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="px-5 py-4 bg-[#27265C]">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Icon name="BarChart2" size={15} className="text-[#FCC71E]" />
                Сводка заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 bg-white space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F7F7F7] rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-emerald-600">{confirmedItems.length}</p>
                  <p className="text-[11px] text-muted-foreground">подтв.</p>
                </div>
                <div className="bg-[#F7F7F7] rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-amber-500">{pendingItems.length}</p>
                  <p className="text-[11px] text-muted-foreground">ожидают</p>
                </div>
                {rejectedItems.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-red-500">{rejectedItems.length}</p>
                    <p className="text-[11px] text-muted-foreground">отклонено</p>
                  </div>
                )}
                {backorderItems.length > 0 && (
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-amber-600">{backorderItems.length}</p>
                    <p className="text-[11px] text-muted-foreground">недопост.</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Сумма</span>
                  <span className="font-bold text-[#27265C]">{formatCurrency(meta.totalAmount)}</span>
                </div>
                {meta.shipDate && (
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">Отгрузка</span>
                    <span className="font-semibold text-[#27265C]">{meta.shipDate}</span>
                  </div>
                )}
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Склад</span>
                  <span className="font-semibold text-[#27265C] text-right">{meta.warehouse}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manager card */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Менеджер</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#27265C] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {meta.manager.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#27265C] truncate">{meta.manager}</p>
                  <p className="text-xs text-muted-foreground">{meta.managerPhone}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full h-9 border-[#E2E2E2] text-[#27265C] hover:bg-[#27265C]/5 text-xs font-medium">
                <Icon name="Phone" size={13} className="mr-2" />
                Позвонить менеджеру
              </Button>
            </CardContent>
          </Card>

          {/* Status-specific CTA */}
          {status === "draft" && (
            <Link to={`/order/${id}/send`}>
              <Button className="w-full bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-11 rounded-xl">
                <Icon name="Send" size={15} className="mr-2" />
                Отправить на согласование
              </Button>
            </Link>
          )}
          {status === "confirmed" && (
            <Link to={`/order/${id}/confirm`}>
              <Button className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white font-bold h-11 rounded-xl">
                <Icon name="CheckCircle" size={15} className="mr-2" />
                Подтвердить заказ
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import OrderFlowStatus from "@/components/OrderFlowStatus";

const ORDER_ID = "ORD-2026-0201";

type RowStatus = "unchanged" | "changed" | "rejected";

interface AdjustItem {
  id: string;
  name: string;
  sku: string;
  status: RowStatus;
  reason?: string;
  qtyRequested: number;
  qtyConfirmed: number;
  priceUnit: number;
  originalSum: number;
  shortage?: number;
}

const INITIAL_ITEMS: AdjustItem[] = [
  {
    id: "1",
    name: "MANNOL Energy Formula OP 5W-30",
    sku: "MN7917-4",
    status: "unchanged",
    qtyRequested: 800,
    qtyConfirmed: 800,
    priceUnit: 1450,
    originalSum: 1160000,
  },
  {
    id: "2",
    name: "MANNOL Diesel Extra 10W-40",
    sku: "MN7504-4",
    status: "unchanged",
    qtyRequested: 600,
    qtyConfirmed: 600,
    priceUnit: 1100,
    originalSum: 660000,
  },
  {
    id: "3",
    name: "MANNOL Compressor Oil ISO 100",
    sku: "MN2902-4",
    status: "unchanged",
    qtyRequested: 150,
    qtyConfirmed: 150,
    priceUnit: 890,
    originalSum: 133500,
  },
  {
    id: "4",
    name: "MANNOL ATF AG52 Automatic Special",
    sku: "MN8211-4",
    status: "changed",
    reason: "Менеджер уменьшил: нет нужного остатка",
    qtyRequested: 200,
    qtyConfirmed: 150,
    priceUnit: 980,
    originalSum: 196000,
  },
  {
    id: "5",
    name: "MANNOL Classic 10W-40",
    sku: "MN7501-4",
    status: "changed",
    reason: "Менеджер уменьшил: решение менеджера",
    qtyRequested: 80,
    qtyConfirmed: 50,
    priceUnit: 656,
    originalSum: 52500,
  },
  {
    id: "6",
    name: "MANNOL Antifreeze AG13 -40C",
    sku: "MN4013-5",
    status: "changed",
    qtyRequested: 300,
    qtyConfirmed: 250,
    priceUnit: 433.2,
    originalSum: 130000,
    shortage: 50,
  },
  {
    id: "7",
    name: "MANNOL Longlife 504/507 5W-30",
    sku: "MN7715-4",
    status: "rejected",
    reason: "Отклонено: нет свободных остатков на складе",
    qtyRequested: 100,
    qtyConfirmed: 0,
    priceUnit: 1680,
    originalSum: 168000,
  },
];

export default function OrderAdjustNew() {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "4": 150,
    "5": 50,
  });

  const getQty = (item: AdjustItem) => {
    if (item.status === "changed" && quantities[item.id] !== undefined) {
      return quantities[item.id];
    }
    return item.qtyConfirmed;
  };

  const getSum = (item: AdjustItem) => {
    const qty = getQty(item);
    return Math.round(qty * item.priceUnit);
  };

  const totalQty = INITIAL_ITEMS.filter(i => i.status !== "rejected")
    .reduce((s, i) => s + getQty(i), 0);
  const totalSum = INITIAL_ITEMS.filter(i => i.status !== "rejected")
    .reduce((s, i) => s + getSum(i), 0);

  const changeQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const item = INITIAL_ITEMS.find(i => i.id === id)!;
      const cur = prev[id] ?? item.qtyConfirmed;
      const next = Math.max(1, Math.min(cur + delta, item.qtyRequested));
      return { ...prev, [id]: next };
    });
  };

  const rowBg = (status: RowStatus) => {
    if (status === "changed") return "bg-amber-50";
    if (status === "rejected") return "bg-red-50 opacity-70";
    return "bg-white";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/orders" className="hover:text-[#27265C] font-medium transition-colors">Все заказы</Link>
        <Icon name="ChevronRight" size={14} />
        <Link to={`/order/${ORDER_ID}/screening`} className="hover:text-[#27265C] transition-colors">{ORDER_ID}</Link>
        <Icon name="ChevronRight" size={14} />
        <span className="text-[#27265C] font-semibold">Корректировка</span>
      </nav>

      {/* Stepper */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl px-6 py-4 shadow-sm">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Этапы оформления заказа
        </p>
        <OrderFlowStatus current="adjust" />
        <p className="text-xs text-amber-600 mt-2 font-medium">
          <Icon name="RotateCcw" size={12} className="inline mr-1" />
          менеджер вернул
        </p>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#27265C]">{ORDER_ID} — корректировка</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Менеджер внёс изменения. Проверьте состав, при необходимости отредактируйте и отправьте повторно.
        </p>
      </div>

      {/* Warning banner */}
      <Alert className="border-amber-200 bg-amber-50">
        <Icon name="AlertTriangle" size={18} className="text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>3 изменения от менеджера</strong> — 2 позиции скорректированы по количеству, 1 отклонена. Проверьте и отправьте повторно на согласование.
        </AlertDescription>
      </Alert>

      <div className="flex gap-6 items-start">
        {/* Main table */}
        <div className="flex-1 min-w-0">
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="px-6 py-4 bg-[#27265C]">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Icon name="Package" size={15} className="text-[#FCC71E]" />
                Состав заказа
              </CardTitle>
            </CardHeader>

            {/* Legend */}
            <div className="flex items-center gap-4 px-5 py-2.5 bg-[#F7F8FA] border-b border-[#E8E8E8] text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                <span>изменено менеджером</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
                <span>отклонено</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-white border border-gray-200" />
                <span>без изменений</span>
              </div>
            </div>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F8FA] border-b border-[#E8E8E8]">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Товар</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Артикул</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Запрос</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Подтверждено</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F4F4]">
                    {INITIAL_ITEMS.map((item) => {
                      const qty = getQty(item);
                      const sum = getSum(item);

                      return (
                        <tr key={item.id} className={rowBg(item.status)}>
                          {/* Name */}
                          <td className="px-5 py-3.5 max-w-[220px]">
                            <p className={`font-medium leading-snug ${item.status === "rejected" ? "line-through text-muted-foreground" : "text-[#27265C]"}`}>
                              {item.name}
                            </p>
                            {item.reason && item.status === "changed" && (
                              <p className="text-xs text-amber-700 mt-0.5">{item.reason}</p>
                            )}
                            {item.reason && item.status === "rejected" && (
                              <p className="text-xs text-red-600 mt-0.5">{item.reason}</p>
                            )}
                          </td>

                          {/* SKU */}
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-xs text-muted-foreground bg-[#F4F4F4] px-2 py-0.5 rounded">
                              {item.sku}
                            </span>
                          </td>

                          {/* Requested */}
                          <td className="px-4 py-3.5 text-right text-muted-foreground">
                            {item.qtyRequested}
                          </td>

                          {/* Confirmed */}
                          <td className="px-4 py-3.5 text-right">
                            {item.status === "unchanged" && (
                              <span className="text-emerald-600 font-semibold">{item.qtyConfirmed}</span>
                            )}
                            {item.status === "changed" && quantities[item.id] !== undefined && (
                              <div className="flex items-center justify-end gap-2">
                                <div className="flex items-center border border-amber-300 rounded-lg overflow-hidden bg-white">
                                  <button
                                    onClick={() => changeQty(item.id, -1)}
                                    className="w-7 h-7 flex items-center justify-center text-amber-700 hover:bg-amber-50 transition-colors"
                                  >
                                    <Icon name="Minus" size={12} />
                                  </button>
                                  <span className="px-2 text-amber-700 font-bold text-sm min-w-[32px] text-center">
                                    {qty}
                                  </span>
                                  <button
                                    onClick={() => changeQty(item.id, 1)}
                                    className="w-7 h-7 flex items-center justify-center text-amber-700 hover:bg-amber-50 transition-colors"
                                  >
                                    <Icon name="Plus" size={12} />
                                  </button>
                                </div>
                              </div>
                            )}
                            {item.status === "changed" && item.shortage !== undefined && quantities[item.id] === undefined && (
                              <div className="flex items-center justify-end gap-1">
                                <span className="font-semibold text-amber-700">{item.qtyConfirmed}</span>
                                <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs px-1.5 py-0">
                                  {item.shortage} → недопост.
                                </Badge>
                              </div>
                            )}
                            {item.status === "changed" && item.shortage !== undefined && (
                              <div className="flex items-center justify-end gap-1">
                                <span className="font-semibold text-amber-700">{item.qtyConfirmed}</span>
                                <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs px-1.5 py-0">
                                  {item.shortage} → недопост.
                                </Badge>
                              </div>
                            )}
                            {item.status === "rejected" && (
                              <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">
                                Отклонено
                              </Badge>
                            )}
                          </td>

                          {/* Sum */}
                          <td className="px-5 py-3.5 text-right">
                            {item.status === "unchanged" && (
                              <span className="font-semibold text-[#27265C]">{item.originalSum.toLocaleString("ru-RU")} ₽</span>
                            )}
                            {item.status === "changed" && (
                              <div>
                                <span className="line-through text-muted-foreground text-xs block">{item.originalSum.toLocaleString("ru-RU")} ₽</span>
                                <span className="font-semibold text-[#27265C]">{sum.toLocaleString("ru-RU")} ₽</span>
                              </div>
                            )}
                            {item.status === "rejected" && (
                              <span className="line-through text-muted-foreground">{item.originalSum.toLocaleString("ru-RU")} ₽</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total row */}
              <div className="px-5 py-3 bg-[#27265C]/5 border-t border-[#E8E8E8] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#27265C]">Итого к отгрузке:</span>
                <span className="text-sm font-bold text-[#27265C]">
                  {totalQty.toLocaleString("ru-RU")} шт. — {totalSum.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-[260px] flex-shrink-0 space-y-4">

          {/* Changes summary */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardHeader className="px-5 py-4 border-b border-[#F0F0F0]">
              <CardTitle className="text-sm font-semibold text-[#27265C]">Сводка изменений</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-emerald-600">4</p>
                  <p className="text-[10px] text-emerald-600 font-medium">подтверждено</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-amber-600">2</p>
                  <p className="text-[10px] text-amber-600 font-medium">изменено</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-red-500">1</p>
                  <p className="text-[10px] text-red-500 font-medium">отклонено</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-blue-600">1</p>
                  <p className="text-[10px] text-blue-600 font-medium">недопоставка</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardContent className="px-5 py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Создан</span>
                <span className="font-medium text-[#27265C]">17.02.2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Отгрузка</span>
                <span className="font-medium text-[#27265C]">28.02.2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Склад</span>
                <span className="font-medium text-[#27265C]">Москва</span>
              </div>
              <div className="h-px bg-[#F0F0F0]" />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Было</span>
                <span className="line-through text-muted-foreground text-xs">2 702 500 ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Стало</span>
                <span className="font-bold text-emerald-600">{totalSum.toLocaleString("ru-RU")} ₽</span>
              </div>
            </CardContent>
          </Card>

          {/* Manager */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardContent className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#27265C] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  ИМ
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#27265C]">Иванова М.С.</p>
                  <p className="text-xs text-muted-foreground">Менеджер</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-9 text-sm border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5"
                asChild
              >
                <a href="tel:+74951234567">
                  <Icon name="Phone" size={14} className="mr-2" />
                  Позвонить менеджеру
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Info block */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
            <Icon name="Info" size={13} className="inline mr-1" />
            После повторной отправки заказ вернётся в статус «На согласовании».
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 pb-6">
        <Link to={`/order/${ORDER_ID}/screening`}>
          <Button variant="outline" className="h-12 px-6 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться к заказу
          </Button>
        </Link>
        <Button
          className="h-12 px-6 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold shadow-sm"
          onClick={() => navigate(`/order/${ORDER_ID}/confirm-new`)}
        >
          <Icon name="Send" size={16} className="mr-2" />
          Отправить повторно на согласование
        </Button>
      </div>
    </div>
  );
}

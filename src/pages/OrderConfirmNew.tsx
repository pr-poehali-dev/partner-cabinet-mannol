import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import OrderFlowStatus from "@/components/OrderFlowStatus";

const ORDER_ID = "ORD-2026-0189";

const CONFIRMED_ITEMS = [
  { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 800, sum: 1160000 },
  { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 600, sum: 660000 },
  { name: "MANNOL ATF AG52 Automatic Special", sku: "MN8211-4", qty: 150, sum: 147000 },
  { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 50, sum: 52500 },
  { name: "MANNOL Compressor Oil ISO 100", sku: "MN2902-4", qty: 150, sum: 133500 },
  { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", qty: 300, sum: 179000 },
];

const EXCLUDED_ITEMS = [
  { name: "MANNOL Longlife 504/507 5W-30", sku: "MN7715-4", reason: "Нет остатков", qty: 100, badge: "rejected" as const, rowBg: "bg-red-50 opacity-70" },
  { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", reason: "Нет на складе", qty: 50, badge: "backorder" as const, rowBg: "bg-amber-50" },
];

export default function OrderConfirmNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hadAdjust = searchParams.get("adjusted") === "1";

  const [confirmed, setConfirmed] = useState(false);

  const totalQty = CONFIRMED_ITEMS.reduce((s, i) => s + i.qty, 0);
  const totalSum = CONFIRMED_ITEMS.reduce((s, i) => s + i.sum, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-4 px-4 md:px-0">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link to="/orders" className="hover:text-[#27265C] font-medium transition-colors">Все заказы</Link>
        <Icon name="ChevronRight" size={14} />
        <Link to={`/order/${ORDER_ID}/screening`} className="hover:text-[#27265C] transition-colors">{ORDER_ID}</Link>
        <Icon name="ChevronRight" size={14} />
        <span className="text-[#27265C] font-semibold">Подтверждение</span>
      </nav>

      {/* Stepper */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl px-4 md:px-6 py-4 shadow-sm">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Этапы оформления заказа
        </p>
        <OrderFlowStatus current="confirm" />
        {!hadAdjust && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-400 inline-flex items-center justify-center text-[10px] font-bold flex-shrink-0">—</span>
            Правка: <span className="italic">не потребовалась</span>
          </p>
        )}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#27265C]">Подтвердить заказ</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Проверьте финальный состав. После подтверждения изменения невозможны.
        </p>
      </div>

      {/* Warning banner */}
      <Alert className="border-amber-200 bg-amber-50">
        <Icon name="AlertTriangle" size={18} className="text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>После подтверждения изменения невозможны.</strong> Заказ будет передан в работу. Все позиции зафиксируются в системе.
        </AlertDescription>
      </Alert>

      {/* Order card */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-4 md:px-6 py-4 bg-[#27265C]">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Icon name="FileCheck" size={15} className="text-[#FCC71E]" />
            <span className="truncate">{ORDER_ID} — подтверждённый состав</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 py-5 space-y-5">

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[#F7F8FA] rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Дата создания</p>
              <p className="font-semibold text-[#27265C]">08.02.2026</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Дата отгрузки</p>
              <p className="font-semibold text-emerald-600">19.02.2026</p>
            </div>
            <div className="bg-[#F7F8FA] rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Склад</p>
              <p className="font-semibold text-[#27265C]">Москва</p>
            </div>
            <div className="bg-[#F7F8FA] rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Менеджер</p>
              <p className="font-semibold text-[#27265C] text-xs md:text-sm">Козлов А.П.</p>
            </div>
          </div>

          {/* Confirmed items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-emerald-700">Позиции к отгрузке</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">{CONFIRMED_ITEMS.length} позиций</Badge>
            </div>
            <div className="border border-[#E8E8E8] rounded-xl overflow-hidden">
              {/* Mobile: card list */}
              <div className="md:hidden divide-y divide-[#F4F4F4]">
                {CONFIRMED_ITEMS.map((item, idx) => (
                  <div key={idx} className="px-4 py-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#27265C] leading-snug">{item.name}</p>
                      <span className="font-mono text-xs text-muted-foreground bg-[#F4F4F4] px-1.5 py-0.5 rounded mt-0.5 inline-block">{item.sku}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-emerald-600 text-sm">{item.qty.toLocaleString("ru-RU")} шт.</p>
                      <p className="font-semibold text-[#27265C] text-xs">{item.sum.toLocaleString("ru-RU")} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F8FA] border-b border-[#E8E8E8]">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Товар</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">Артикул</th>
                      <th className="text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground">Кол-во</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F4F4]">
                    {CONFIRMED_ITEMS.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAFAFA]">
                        <td className="px-4 py-3 font-medium text-[#27265C]">{item.name}</td>
                        <td className="px-3 py-3">
                          <span className="font-mono text-xs text-muted-foreground bg-[#F4F4F4] px-2 py-0.5 rounded">{item.sku}</span>
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-emerald-600">{item.qty.toLocaleString("ru-RU")}</td>
                        <td className="px-4 py-3 text-right font-semibold text-[#27265C]">{item.sum.toLocaleString("ru-RU")} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-emerald-50 border-t border-[#E8E8E8] flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-sm font-semibold text-emerald-700">Итого к отгрузке:</span>
                <span className="text-sm font-bold text-emerald-700">{totalQty.toLocaleString("ru-RU")} шт. — {totalSum.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>

          {/* Excluded items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-red-700">Не войдут в отгрузку</span>
            </div>
            <div className="border border-[#E8E8E8] rounded-xl overflow-hidden">
              {/* Mobile: card list */}
              <div className="md:hidden divide-y divide-[#F4F4F4]">
                {EXCLUDED_ITEMS.map((item, idx) => (
                  <div key={idx} className={`px-4 py-3 ${item.rowBg}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-sm font-medium leading-snug ${item.badge === "rejected" ? "line-through text-muted-foreground" : "text-[#27265C]"}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">{item.qty} шт.</p>
                        {item.badge === "rejected"
                          ? <Badge className="bg-red-100 text-red-700 border-red-200 text-xs mt-1">Отклонено</Badge>
                          : <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs mt-1">Недопоставка</Badge>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F8FA] border-b border-[#E8E8E8]">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Товар</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">Причина</th>
                      <th className="text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground">Запрос</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F4F4]">
                    {EXCLUDED_ITEMS.map((item, idx) => (
                      <tr key={idx} className={item.rowBg}>
                        <td className={`px-4 py-3 font-medium ${item.badge === "rejected" ? "line-through text-muted-foreground" : "text-[#27265C]"}`}>
                          {item.name}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground text-xs">{item.reason}</td>
                        <td className="px-3 py-3 text-right text-muted-foreground">{item.qty} шт.</td>
                        <td className="px-4 py-3 text-right">
                          {item.badge === "rejected"
                            ? <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Отклонено</Badge>
                            : <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Недопоставка</Badge>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-2 px-1">
              <Icon name="Info" size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Позиция «Недопоставка» будет оформлена отдельным заказом после поступления товара на склад.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkbox confirmation */}
      <div
        className={`rounded-xl border-2 p-4 cursor-pointer transition-all bg-white ${confirmed ? "border-[#27265C]" : "border-gray-200"}`}
        onClick={() => setConfirmed(!confirmed)}
      >
        <div className="flex items-start gap-3">
          <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(!!v)} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[#27265C] leading-relaxed">
            Я проверил состав заказа и подтверждаю его отправку в работу. Понимаю, что после подтверждения изменения невозможны.
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-6">
        <Link to={`/order/${ORDER_ID}/adjust-new`} className="sm:flex-shrink-0">
          <Button variant="outline" className="w-full h-12 px-6 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться к заказу
          </Button>
        </Link>
        <Button
          disabled={!confirmed}
          className={`flex-1 h-12 px-6 font-bold shadow-sm transition-all ${confirmed ? "bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          onClick={() => confirmed && navigate(`/order/${ORDER_ID}/accepted`)}
        >
          <Icon name="CheckCircle" size={16} className="mr-2" />
          Подтвердить заказ
        </Button>
      </div>
    </div>
  );
}

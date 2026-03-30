import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { formatCurrency, MOCK_ORDER } from "@/types/order";
import OrderFlowStatus from "@/components/OrderFlowStatus";

/* meta per order */
const ORDERS_META: Record<string, { date: string; shipDate: string; warehouse: string; manager: string; totalAmount: number }> = {
  "ORD-2026-0189": { date: "08.02.2026", shipDate: "19.02.2026", warehouse: "Москва (Подольск)", manager: "Козлов А.П.", totalAmount: 2480000 },
};

export default function OrderConfirm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const id = orderId || "ORD-2026-0189";
  const meta = ORDERS_META[id] || ORDERS_META["ORD-2026-0189"];

  const [agreed, setAgreed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const items = MOCK_ORDER.items;
  const includedItems = items.filter(
    (i) => i.lineStatus !== "rejected-auto" && !(i.lineStatus === "rejected-manager" && i.qtyConfirmed === 0)
  );
  const excludedItems = items.filter(
    (i) => i.lineStatus === "rejected-auto" || (i.lineStatus === "rejected-manager" && i.qtyConfirmed === 0)
  );

  const confirmedSum = includedItems.reduce((s, i) => {
    const qty = i.qtyConfirmed > 0 ? i.qtyConfirmed : i.qtyRequested;
    return s + qty * i.price;
  }, 0);
  const totalQty = includedItems.reduce((s, i) => s + (i.qtyConfirmed > 0 ? i.qtyConfirmed : i.qtyRequested), 0);

  function handleConfirm() {
    if (!agreed) return;
    setConfirming(true);
    setTimeout(() => navigate(`/order/${id}/success?type=confirmed`), 1200);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/orders" className="hover:text-[#27265C] font-medium transition-colors">Заказы</Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <Link to={`/order/${id}`} className="hover:text-[#27265C] transition-colors">{id}</Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <span className="text-[#27265C] font-semibold">Подтверждение</span>
      </nav>

      {/* Order Flow Progress */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl px-4 md:px-6 py-4 shadow-sm">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Этапы оформления заказа
        </p>
        <OrderFlowStatus current="confirm" />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#27265C]">Подтвердить заказ</h1>
        <p className="text-sm text-muted-foreground mt-1">Проверьте финальный состав и подтвердите заказ</p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Icon name="AlertTriangle" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">После подтверждения изменения невозможны</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Заказ будет передан в работу. Все позиции зафиксируются в системе.
          </p>
        </div>
      </div>

      {/* Order summary card */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-4 bg-[#27265C]">
          <div className="flex items-center gap-3">
            <Icon name="FileText" size={17} className="text-[#FCC71E]" />
            <CardTitle className="text-sm font-semibold text-white">{id} — Подтверждённый состав</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-5 bg-white">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Дата создания</p>
              <p className="text-sm font-semibold text-[#27265C]">{meta.date}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Дата отгрузки</p>
              <p className="text-sm font-semibold text-[#27265C]">{meta.shipDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Склад</p>
              <p className="text-sm font-semibold text-[#27265C]">{meta.warehouse}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Менеджер</p>
              <p className="text-sm font-semibold text-[#27265C]">{meta.manager}</p>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Included items */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Позиции к отгрузке ({includedItems.length})
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">Товар</th>
                  <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Кол-во</th>
                  <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F4]">
                {includedItems.map((item) => {
                  const qty = item.qtyConfirmed > 0 ? item.qtyConfirmed : item.qtyRequested;
                  return (
                    <tr key={item.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#27265C] leading-snug">{item.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{item.sku}</p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-bold text-[#27265C]">{qty}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-[#27265C]">{formatCurrency(qty * item.price)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-[#27265C]/5 rounded-xl px-4 py-3">
            <div>
              <span className="text-sm font-bold text-[#27265C]">Итого к отгрузке</span>
              <span className="text-xs text-muted-foreground ml-2">{totalQty} шт.</span>
            </div>
            <span className="text-xl font-extrabold text-[#27265C]">{formatCurrency(confirmedSum)}</span>
          </div>

          {/* Excluded items */}
          {excludedItems.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Исключённые позиции ({excludedItems.length})
              </p>
              <div className="space-y-2">
                {excludedItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                    <Icon name="XCircle" size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm text-red-700 font-medium line-through">{item.name}</p>
                      {item.rejectReason && (
                        <p className="text-xs text-red-500 mt-0.5">{item.rejectReason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agreement */}
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
          agreed ? "bg-emerald-50 border-emerald-300" : "bg-white border-[#E8E8E8]"
        }`}
        onClick={() => setAgreed(!agreed)}
      >
        <Checkbox
          checked={agreed}
          onCheckedChange={(v) => setAgreed(!!v)}
          className="mt-0.5 flex-shrink-0"
        />
        <p className="text-sm text-[#27265C] leading-relaxed select-none">
          Я проверил состав заказа и подтверждаю его отправку в работу. Понимаю, что после подтверждения изменения невозможны.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={`/order/${id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 h-12 font-medium"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться к заказу
          </Button>
        </Link>
        <Button
          className={`flex-1 h-12 font-bold shadow-sm ${
            agreed
              ? "bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C]"
              : "bg-[#F4F4F4] text-muted-foreground cursor-not-allowed"
          }`}
          onClick={handleConfirm}
          disabled={!agreed || confirming}
        >
          {confirming ? (
            <>
              <Icon name="Loader" size={16} className="mr-2 animate-spin" />
              Подтверждаем...
            </>
          ) : (
            <>
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Подтвердить заказ
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
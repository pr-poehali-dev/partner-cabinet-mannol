import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { formatCurrency, MOCK_ORDER } from "@/types/order";
import OrderFlowStatus from "@/components/OrderFlowStatus";

export default function OrderReview() {
  const { orderId } = useParams();
  const id = orderId || "ORD-2026-0198";
  const items = MOCK_ORDER.items;

  const confirmedItems = items.filter((i) => i.lineStatus === "confirmed");
  const pendingItems   = items.filter((i) => i.lineStatus === "pending");
  const rejectedItems  = items.filter((i) => i.lineStatus === "rejected-auto" || i.lineStatus === "rejected-manager");
  const backorderItems = items.filter((i) => i.lineStatus === "backorder");
  const preorderItems  = items.filter((i) => i.lineStatus === "preorder");

  const confirmedTotal = items.reduce((s, i) => s + i.qtyConfirmed * i.price, 0);
  const requestedTotal = items.reduce((s, i) => s + i.qtyRequested * i.price, 0);
  const confirmedPct   = requestedTotal > 0 ? Math.round((confirmedTotal / requestedTotal) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/orders" className="hover:text-[#27265C] font-medium transition-colors">Заказы</Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <Link to={`/order/${id}`} className="hover:text-[#27265C] transition-colors">{id}</Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <span className="text-[#27265C] font-semibold">Ответ менеджера</span>
      </nav>

      {/* Order Flow Progress */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl px-4 md:px-6 py-4 shadow-sm">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Этапы оформления заказа
        </p>
        <OrderFlowStatus current="review" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#27265C]">Ответ менеджера по заказу</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Менеджер проверил позиции заказа {id} и подготовил ответ
          </p>
        </div>
        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <Link to={`/order/${id}/adjust`}>
            <Button variant="outline" className="h-10 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 font-medium">
              <Icon name="Plus" size={15} className="mr-2" />
              Дозаказать позиции
            </Button>
          </Link>
          <Link to={`/order/${id}/confirm`}>
            <Button className="h-10 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold">
              <Icon name="CheckCircle" size={15} className="mr-2" />
              Подтвердить заказ
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-5 bg-[#27265C]">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Icon name="BarChart2" size={15} className="text-[#FCC71E]" />
            Итог обработки
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-xl font-extrabold text-emerald-600">{confirmedItems.length}</p>
              <p className="text-[11px] text-emerald-600 font-medium">подтверждено</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-xl font-extrabold text-amber-600">{pendingItems.length}</p>
              <p className="text-[11px] text-amber-600 font-medium">ожидают</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-xl font-extrabold text-red-500">{rejectedItems.length}</p>
              <p className="text-[11px] text-red-500 font-medium">отклонено</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-xl p-3 text-center">
              <p className="text-xl font-extrabold text-[#27265C]">{backorderItems.length + preorderItems.length}</p>
              <p className="text-[11px] text-muted-foreground font-medium">недопост./предзак.</p>
            </div>
          </div>

          <Separator className="mb-4" />

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Запрошено</p>
              <p className="text-base font-semibold text-[#27265C]">{formatCurrency(requestedTotal)}</p>
            </div>
            <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Подтверждено</p>
              <p className="text-base font-bold text-emerald-600">{formatCurrency(confirmedTotal)}</p>
            </div>
            <div className="bg-[#27265C]/5 rounded-xl px-4 py-2">
              <p className="text-xs text-muted-foreground mb-0.5">Выполнение</p>
              <p className={`text-xl font-extrabold ${confirmedPct >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                {confirmedPct}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group: confirmed */}
      {confirmedItems.length > 0 && (
        <ItemGroup
          label="Подтверждено"
          icon="CheckCircle"
          headerBg="bg-emerald-50 border-emerald-200"
          headerColor="text-emerald-800"
          items={confirmedItems}
        />
      )}

      {/* Group: backorder */}
      {backorderItems.length > 0 && (
        <ItemGroup
          label="Недопоставка — будет компенсирована"
          icon="AlertTriangle"
          headerBg="bg-amber-50 border-amber-200"
          headerColor="text-amber-800"
          items={backorderItems}
        />
      )}

      {/* Group: preorder */}
      {preorderItems.length > 0 && (
        <ItemGroup
          label="Предзаказ — под поставку"
          icon="ShoppingBag"
          headerBg="bg-blue-50 border-blue-200"
          headerColor="text-blue-800"
          items={preorderItems}
        />
      )}

      {/* Group: pending */}
      {pendingItems.length > 0 && (
        <ItemGroup
          label="Ожидают обработки"
          icon="Clock"
          headerBg="bg-slate-50 border-slate-200"
          headerColor="text-slate-700"
          items={pendingItems}
        />
      )}

      {/* Group: rejected */}
      {rejectedItems.length > 0 && (
        <ItemGroup
          label="Отклонено"
          icon="XCircle"
          headerBg="bg-red-50 border-red-200"
          headerColor="text-red-800"
          items={rejectedItems}
        />
      )}

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-4">
        <Link to={`/order/${id}/adjust`} className="flex-1">
          <Button variant="outline" className="w-full h-12 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 font-medium">
            <Icon name="Plus" size={16} className="mr-2" />
            Дозаказать отклонённые позиции
          </Button>
        </Link>
        <Link to={`/order/${id}/confirm`} className="flex-1">
          <Button className="w-full h-12 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold shadow-sm">
            <Icon name="CheckCircle" size={16} className="mr-2" />
            Подтвердить заказ
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ─── Sub-component ─── */
function ItemGroup({
  label, icon, headerBg, headerColor, items,
}: {
  label: string;
  icon: string;
  headerBg: string;
  headerColor: string;
  items: ReturnType<typeof MOCK_ORDER.items.filter>;
}) {
  return (
    <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className={`px-5 py-3.5 border-b ${headerBg}`}>
        <div className="flex items-center gap-2">
          <Icon name={icon} size={15} className={headerColor} />
          <CardTitle className={`text-sm font-semibold ${headerColor}`}>
            {label} ({items.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-white divide-y divide-[#F4F4F4]">
        {items.map((item) => {
          const isRejected = item.lineStatus === "rejected-auto" || item.lineStatus === "rejected-manager";
          const qty = item.qtyConfirmed > 0 ? item.qtyConfirmed : item.qtyRequested;
          return (
            <div key={item.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium leading-snug ${isRejected ? "text-muted-foreground line-through" : "text-[#27265C]"}`}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground bg-[#F4F4F4] px-2 py-0.5 rounded">
                      {item.sku}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      запрошено: <strong>{item.qtyRequested}</strong>
                      {item.qtyConfirmed > 0 && item.qtyConfirmed !== item.qtyRequested && (
                        <> → подтверждено: <strong className="text-emerald-600">{item.qtyConfirmed}</strong></>
                      )}
                    </span>
                  </div>
                  {item.rejectReason && (
                    <p className={`text-xs mt-1.5 ${isRejected ? "text-red-500" : "text-amber-600"}`}>
                      {item.rejectReason}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${isRejected ? "text-muted-foreground/50 line-through" : "text-[#27265C]"}`}>
                    {formatCurrency(qty * item.price)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
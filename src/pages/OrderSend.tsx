import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { formatCurrency, MOCK_ORDER } from "@/types/order";
import OrderFlowStatus from "@/components/OrderFlowStatus";

/* Данные заказа по ID (mock) */
const ORDERS_META: Record<string, { date: string; shipDate: string; warehouse: string; manager: string; totalAmount: number }> = {
  "ORD-2026-0201": { date: "17.02.2026", shipDate: "28.02.2026", warehouse: "Москва (Подольск)", manager: "Иванова М.С.", totalAmount: 389500 },
};

export default function OrderSend() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const id = orderId || "ORD-2026-0201";
  const meta = ORDERS_META[id] || ORDERS_META["ORD-2026-0201"];

  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const items = MOCK_ORDER.items;
  const totalQty = items.reduce((s, i) => s + i.qtyRequested, 0);
  const hasBackorders = items.some((i) => i.isBackorder);

  function handleSend() {
    setSending(true);
    setTimeout(() => navigate(`/order/${id}/success?type=sent`), 1200);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/orders" className="hover:text-[#27265C] font-medium transition-colors">Заказы</Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <Link to={`/order/${id}`} className="hover:text-[#27265C] transition-colors">{id}</Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <span className="text-[#27265C] font-semibold">Отправка</span>
      </nav>

      {/* Order Flow Progress */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl px-4 md:px-6 py-4 shadow-sm">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Этапы оформления заказа
        </p>
        <OrderFlowStatus current="send" />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#27265C]">Отправить на согласование</h1>
        <p className="text-sm text-muted-foreground mt-1">Проверьте заказ перед отправкой менеджеру</p>
      </div>

      {/* Order info card */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-4 bg-[#27265C]">
          <div className="flex items-center gap-3">
            <Icon name="FileText" size={17} className="text-[#FCC71E]" />
            <CardTitle className="text-sm font-semibold text-white">{id}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-5 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Дата создания</p>
              <p className="text-sm font-semibold text-[#27265C]">{meta.date}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Желаемая отгрузка</p>
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

          <Separator className="my-4" />

          {/* Summary row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xl font-extrabold text-[#27265C]">{items.length}</p>
                <p className="text-xs text-muted-foreground">позиций</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-extrabold text-[#27265C]">{totalQty}</p>
                <p className="text-xs text-muted-foreground">штук</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#27265C]">{formatCurrency(meta.totalAmount)}</p>
              <p className="text-xs text-muted-foreground">сумма заказа</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items preview */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
        <CardHeader
          className="px-6 py-4 border-b border-[#F0F0F0] cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#27265C]/8 flex items-center justify-center">
                <Icon name="Package" size={15} className="text-[#27265C]" />
              </div>
              <CardTitle className="text-sm font-semibold text-[#27265C]">
                Состав заказа ({items.length} поз.)
              </CardTitle>
            </div>
            <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
          </div>
        </CardHeader>
        {expanded && (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 whitespace-nowrap">Товар</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 whitespace-nowrap">Артикул</th>
                    <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 whitespace-nowrap">Кол-во</th>
                    <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 whitespace-nowrap">Сумма</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F4F4]">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-[#27265C]">{item.name}</p>
                        {item.isBackorder && (
                          <Badge className="mt-1 bg-amber-100 text-amber-700 border-0 text-[10px] px-1.5">под заказ</Badge>
                        )}
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-xs font-mono text-muted-foreground bg-[#F4F4F4] px-2 py-0.5 rounded whitespace-nowrap">
                          {item.sku}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="text-sm font-semibold text-[#27265C]">{item.qtyRequested}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-semibold text-[#27265C]">
                          {formatCurrency(item.qtyRequested * item.price)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Warnings */}
      {hasBackorders && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Icon name="AlertCircle" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            В заказе есть позиции <strong>«под заказ»</strong> — менеджер уточнит сроки поставки.
          </p>
        </div>
      )}

      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Icon name="Info" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          После отправки заказ перейдёт в статус <strong>«В обработке»</strong>. Менеджер рассмотрит его в течение 1–2 рабочих дней.
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
          className="flex-1 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-12 shadow-sm"
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? (
            <>
              <Icon name="Loader" size={16} className="mr-2 animate-spin" />
              Отправляем...
            </>
          ) : (
            <>
              <Icon name="Send" size={16} className="mr-2" />
              Отправить на согласование
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
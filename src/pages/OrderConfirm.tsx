import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";
import {
  MOCK_ORDER,
  ORDER_STATUS_CONFIG,
  STATUS_STEPS,
  LINE_STATUS_CONFIG,
  formatCurrency,
  formatWeight,
  MAX_TRUCK_WEIGHT,
  OrderData,
  OrderItem,
} from "@/types/order";

const OrderConfirm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const order: OrderData = {
    ...MOCK_ORDER,
    id: orderId || MOCK_ORDER.id,
    status: "needs-approval",
  };

  const currentStepIndex = 3;
  const nextStepIndex = 4;

  const includedItems = useMemo(
    () =>
      order.items.filter(
        (i) =>
          i.lineStatus !== "rejected-auto" &&
          !(i.lineStatus === "rejected-manager" && i.qtyConfirmed === 0)
      ),
    [order.items]
  );

  const excludedEntries = useMemo(() => {
    const entries: { item: OrderItem; reason: string }[] = [];
    order.items.forEach((item) => {
      if (item.lineStatus === "rejected-auto") {
        entries.push({
          item,
          reason: "Нет остатков",
        });
      }
      if (item.lineStatus === "rejected-manager" && item.qtyShortage > 0) {
        entries.push({
          item,
          reason: `${item.qtyShortage} шт не включены`,
        });
      }
      if (item.lineStatus === "backorder" && item.qtyShortage > 0) {
        entries.push({
          item,
          reason: `${item.qtyShortage} шт в недопоставке`,
        });
      }
    });
    return entries;
  }, [order.items]);

  const getShipQty = (item: OrderItem) => {
    if (item.lineStatus === "pending" || item.lineStatus === "preorder") {
      return item.qtyRequested;
    }
    return item.qtyConfirmed;
  };

  const totalQty = useMemo(
    () => includedItems.reduce((s, i) => s + getShipQty(i), 0),
    [includedItems]
  );

  const totalAmount = useMemo(
    () => includedItems.reduce((s, i) => s + getShipQty(i) * i.price, 0),
    [includedItems]
  );

  const totalWeight = useMemo(
    () =>
      includedItems.reduce(
        (s, i) => s + getShipQty(i) * i.weightPerUnit,
        0
      ),
    [includedItems]
  );

  const truckLoadPercent = Math.min(
    (totalWeight / MAX_TRUCK_WEIGHT) * 100,
    100
  );

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      toast({
        title: "Заказ подтверждён",
        description: `Заказ ${order.id} подтверждён и передан в график отгрузки. Ожидайте уведомления о дате отгрузки.`,
      });
      navigate(`/order/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to={`/order/${orderId}/review`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#27265C] transition-colors mb-4"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
            <span>Назад к результатам</span>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#27265C]">
                Финальное подтверждение заказа
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Заказ {order.id} — проверьте состав и подтвердите
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-700 border-orange-200 shrink-0 mt-1"
            >
              <Icon name="RotateCcw" className="w-3.5 h-3.5 mr-1" />
              Требует согласования
            </Badge>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-amber-50 border-2 border-amber-300 p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shrink-0">
              <Icon name="ShieldCheck" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-900">
                Точка невозврата
              </h2>
              <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                После подтверждения заказ будет заблокирован. Изменения невозможны.
                Заказ будет передан в график отгрузки.
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6 border-0 shadow-sm overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
              <Icon name="GitBranch" className="w-4.5 h-4.5 text-[#27265C]/70" />
              Статус заказа
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="relative">
              <div className="flex items-start justify-between">
                {STATUS_STEPS.map((status, index) => {
                  const config = ORDER_STATUS_CONFIG[status];
                  const isCurrent = index === currentStepIndex;
                  const isNext = index === nextStepIndex;
                  const isPast = index < currentStepIndex;
                  const isFuture = index > nextStepIndex;

                  return (
                    <div
                      key={status}
                      className="flex flex-col items-center relative z-10"
                      style={{ width: `${100 / STATUS_STEPS.length}%` }}
                    >
                      <div
                        className={`
                          w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                          ${
                            isCurrent
                              ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                              : isNext
                              ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/30 animate-pulse"
                              : isPast
                              ? "bg-green-500 border-green-500 text-white"
                              : "bg-white border-gray-200 text-gray-400"
                          }
                        `}
                      >
                        {isPast ? (
                          <Icon name="Check" className="w-4 h-4" />
                        ) : (
                          <Icon name={config.icon} className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`
                          text-[10px] leading-tight text-center mt-2 max-w-[80px] font-medium
                          ${
                            isCurrent
                              ? "text-orange-700 font-bold"
                              : isNext
                              ? "text-green-700 font-bold"
                              : isPast
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        `}
                      >
                        {config.label}
                      </span>
                      {isNext && (
                        <span className="text-[9px] text-green-600 font-bold mt-0.5 uppercase tracking-wider">
                          далее
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-[18px] left-[7%] right-[7%] h-0.5 bg-gray-200 -z-0">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
              <Icon name="ArrowRight" className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-xs text-green-800">
                После подтверждения статус изменится с{" "}
                <span className="font-semibold">Требует согласования</span> на{" "}
                <span className="font-semibold">Подтверждён</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
                <Icon name="ClipboardList" className="w-4.5 h-4.5 text-[#27265C]/70" />
                Состав заказа к отгрузке
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 text-xs font-semibold"
              >
                {includedItems.length} позиций
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {includedItems.map((item, index) => {
                const shipQty = getShipQty(item);
                const lineTotal = shipQty * item.price;
                const lineWeight = shipQty * item.weightPerUnit;
                const lineConfig = LINE_STATUS_CONFIG[item.lineStatus];
                const isPartial =
                  item.qtyConfirmed > 0 &&
                  item.qtyConfirmed < item.qtyRequested;

                return (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-0" />}
                    <div className="py-3.5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 font-mono">
                              {item.sku}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 h-4 ${lineConfig.bgColor} ${lineConfig.color} border`}
                            >
                              {lineConfig.label}
                            </Badge>
                            {isPartial && (
                              <span className="text-[10px] text-amber-600 font-medium">
                                ({item.qtyConfirmed} из {item.qtyRequested})
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-[#27265C]">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {shipQty} шт x {formatCurrency(item.price)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatWeight(lineWeight)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-[#27265C] shrink-0">
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {excludedEntries.length > 0 && (
          <Card className="mb-6 border-0 shadow-sm bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-red-700 flex items-center gap-2">
                <Icon name="Ban" className="w-4.5 h-4.5 text-red-500" />
                Не включено в заказ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {excludedEntries.map((entry, index) => (
                  <div key={`${entry.item.id}-${index}`}>
                    {index > 0 && <Separator className="my-0" />}
                    <div className="flex items-center justify-between py-3 gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500 truncate">
                          {entry.item.name}
                        </p>
                        <span className="text-xs text-gray-400 font-mono">
                          {entry.item.sku}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-600 border-red-200 text-xs shrink-0"
                      >
                        <Icon name="XCircle" className="w-3 h-3 mr-1" />
                        {entry.reason}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-0 shadow-lg bg-[#27265C] text-white overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon name="Receipt" className="w-5 h-5 text-[#FCC71E]" />
              </div>
              <h3 className="text-lg font-bold">Итоговая сводка</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-white/10 rounded-xl p-3.5">
                <p className="text-[11px] text-white/60 font-medium mb-1">Позиций</p>
                <p className="text-xl font-bold">{includedItems.length}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3.5">
                <p className="text-[11px] text-white/60 font-medium mb-1">Количество</p>
                <p className="text-xl font-bold">{totalQty.toLocaleString("ru-RU")} шт</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3.5">
                <p className="text-[11px] text-white/60 font-medium mb-1">Общий вес</p>
                <p className="text-xl font-bold">{formatWeight(totalWeight)}</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">Итого к оплате</span>
              </div>
              <p className="text-3xl font-bold text-[#FCC71E]">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Truck" className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/70">Загрузка фуры</span>
                  </div>
                  <span className="text-xs font-bold text-[#FCC71E]">
                    {truckLoadPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FCC71E] rounded-full transition-all duration-500"
                    style={{ width: `${truckLoadPercent}%` }}
                  />
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="CalendarDays" className="w-4 h-4 text-white/60" />
                  <div>
                    <p className="text-[11px] text-white/60">Дата отгрузки</p>
                    <p className="text-sm font-semibold">
                      {order.orderType === "direct"
                        ? "Прямой заказ"
                        : order.desiredShipmentDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Warehouse" className="w-4 h-4 text-white/60" />
                  <div>
                    <p className="text-[11px] text-white/60">Склад</p>
                    <p className="text-sm font-semibold">{order.warehouse}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-3">
              <Checkbox
                id="confirm-agreement"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5 h-5 w-5 border-2 border-[#27265C]/40 data-[state=checked]:bg-[#27265C] data-[state=checked]:border-[#27265C]"
              />
              <label
                htmlFor="confirm-agreement"
                className="text-sm text-gray-700 leading-relaxed cursor-pointer select-none"
              >
                Я подтверждаю состав заказа и понимаю, что после подтверждения
                изменения невозможны. Заказ будет передан в график отгрузки в
                текущем составе.
              </label>
            </div>
            {!agreed && (
              <div className="mt-3 ml-8 flex items-center gap-1.5 text-xs text-amber-600">
                <Icon name="AlertTriangle" className="w-3.5 h-3.5" />
                <span>Необходимо подтвердить для продолжения</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              asChild
            >
              <Link to={`/order/${orderId}/adjust`}>
                <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Вернуться к дозаказу
              </Link>
            </Button>
            <Button
              className="bg-[#27265C] hover:bg-[#27265C]/90 text-white px-6 shadow-lg shadow-[#27265C]/20 disabled:opacity-50 disabled:shadow-none"
              disabled={!agreed || isConfirming}
              onClick={handleConfirm}
            >
              {isConfirming ? (
                <>
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Подтверждение...
                </>
              ) : (
                <>
                  <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                  Подтвердить заказ
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;

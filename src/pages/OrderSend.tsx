import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";
import {
  OrderData,
  ORDER_STATUS_CONFIG,
  STATUS_STEPS,
  formatWeight,
  formatCurrency,
  MOCK_ORDER,
  MAX_TRUCK_WEIGHT,
} from "@/types/order";

const OrderSend = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [itemsExpanded, setItemsExpanded] = useState(false);

  const order: OrderData = {
    ...MOCK_ORDER,
    id: orderId || MOCK_ORDER.id,
    status: "draft",
  };

  const totalWeight = useMemo(
    () =>
      order.items.reduce(
        (sum, item) => sum + item.qtyRequested * item.weightPerUnit,
        0
      ),
    [order.items]
  );

  const totalAmount = useMemo(
    () =>
      order.items.reduce(
        (sum, item) => sum + item.qtyRequested * item.price,
        0
      ),
    [order.items]
  );

  const truckLoadPercent = Math.min((totalWeight / MAX_TRUCK_WEIGHT) * 100, 100);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      toast({
        title: "Заказ отправлен на согласование",
        description: `Заказ ${order.id} успешно отправлен менеджеру. Ожидайте обработки в течение 1-2 рабочих дней.`,
      });
      navigate(`/order/${orderId}`);
    }, 1200);
  };

  const currentStepIndex = 0;
  const nextStepIndex = 1;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to={`/order/${orderId}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#27265C] transition-colors mb-4"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
            <span>Назад к заказу</span>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#27265C]">
                Отправка заказа на согласование
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Заказ {order.id} будет направлен менеджеру для проверки и подтверждения
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-700 border-gray-200 shrink-0 mt-1"
            >
              <Icon name="FileEdit" className="w-3.5 h-3.5 mr-1" />
              Черновик
            </Badge>
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
                              ? "bg-[#27265C] border-[#27265C] text-white shadow-lg shadow-[#27265C]/20"
                              : isNext
                              ? "bg-[#FCC71E] border-[#FCC71E] text-[#27265C] shadow-md shadow-[#FCC71E]/30 animate-pulse"
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
                              ? "text-[#27265C] font-bold"
                              : isNext
                              ? "text-[#27265C] font-semibold"
                              : isFuture
                              ? "text-gray-400"
                              : "text-green-600"
                          }
                        `}
                      >
                        {config.label}
                      </span>
                      {isNext && (
                        <span className="text-[9px] text-[#FCC71E] font-bold mt-0.5 uppercase tracking-wider">
                          далее
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-[18px] left-[7%] right-[7%] h-0.5 bg-gray-200 -z-0">
                <div
                  className="h-full bg-[#27265C] transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
              <Icon name="ArrowRight" className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs text-amber-800">
                После отправки статус изменится с{" "}
                <span className="font-semibold">Черновик</span> на{" "}
                <span className="font-semibold">Отправлен</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
              <Icon name="ClipboardList" className="w-4.5 h-4.5 text-[#27265C]/70" />
              Сводка по заказу
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#27265C]/10 flex items-center justify-center">
                    <Icon name="Package" className="w-3.5 h-3.5 text-[#27265C]" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">Позиций</span>
                </div>
                <p className="text-lg font-bold text-[#27265C]">{order.items.length}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#27265C]/10 flex items-center justify-center">
                    <Icon name="Weight" className="w-3.5 h-3.5 text-[#27265C]" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">Вес</span>
                </div>
                <p className="text-lg font-bold text-[#27265C]">
                  {formatWeight(totalWeight)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                    <Icon name="Banknote" className="w-3.5 h-3.5 text-green-700" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">Сумма</span>
                </div>
                <p className="text-lg font-bold text-green-700">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon name="CalendarDays" className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">Отгрузка</span>
                </div>
                <p className="text-sm font-bold text-[#27265C]">
                  {order.desiredShipmentDate}
                </p>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="Truck" className="w-4 h-4 text-[#27265C]/60" />
                  <span className="text-xs font-medium text-gray-600">
                    Загрузка автомобиля
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#27265C]">
                  {formatWeight(totalWeight)} / {formatWeight(MAX_TRUCK_WEIGHT)}
                </span>
              </div>
              <Progress
                value={truckLoadPercent}
                className="h-2.5 bg-gray-200"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                {truckLoadPercent.toFixed(0)}% загрузки ({formatWeight(MAX_TRUCK_WEIGHT - totalWeight)} свободно)
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 bg-gray-50 rounded-xl px-3.5 py-3">
              <Icon name="Warehouse" className="w-4 h-4 text-[#27265C]/60 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Склад отгрузки</p>
                <p className="text-sm font-semibold text-[#27265C]">{order.warehouse}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-0 shadow-sm bg-blue-50/80 border-blue-200">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                <Icon name="Info" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-0.5">
                  Что произойдёт после отправки
                </h3>
                <p className="text-xs text-blue-700/80">
                  Ознакомьтесь с информацией перед отправкой заказа
                </p>
              </div>
            </div>
            <div className="space-y-3 ml-0.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-200/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="Lock" className="w-3 h-3 text-blue-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    После отправки заказ будет заблокирован для редактирования
                  </p>
                  <p className="text-xs text-blue-700/70 mt-0.5">
                    Изменения можно будет внести только после ответа менеджера
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-200/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="UserCheck" className="w-3 h-3 text-blue-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Менеджер проверит наличие, цены и условия поставки
                  </p>
                  <p className="text-xs text-blue-700/70 mt-0.5">
                    Каждая позиция будет проверена на актуальность и доступность
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-200/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="Clock" className="w-3 h-3 text-blue-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Срок обработки: 1-2 рабочих дня
                  </p>
                  <p className="text-xs text-blue-700/70 mt-0.5">
                    Обычно менеджер отвечает в течение нескольких часов
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-200/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="Bell" className="w-3 h-3 text-blue-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Если заказ не будет обработан за 3 дня — вы получите уведомление
                  </p>
                  <p className="text-xs text-blue-700/70 mt-0.5">
                    Уведомление придёт на вашу электронную почту и в систему
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
                <Icon name="List" className="w-4.5 h-4.5 text-[#27265C]/70" />
                Позиции заказа
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-[#27265C] gap-1"
                onClick={() => setItemsExpanded(!itemsExpanded)}
              >
                <Icon
                  name={itemsExpanded ? "ChevronUp" : "ChevronDown"}
                  className="w-4 h-4"
                />
                {itemsExpanded ? "Свернуть" : "Показать все"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {(itemsExpanded ? order.items : order.items.slice(0, 3)).map(
                (item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-0" />}
                    <div className="flex items-center justify-between py-3 gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-gray-400 font-mono">
                            {item.sku}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#27265C] truncate">
                          {item.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-[#27265C]">
                          {item.qtyRequested} x {formatCurrency(item.price)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.qtyRequested * item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            {!itemsExpanded && order.items.length > 3 && (
              <div className="pt-2 border-t border-dashed border-gray-200">
                <button
                  onClick={() => setItemsExpanded(true)}
                  className="text-xs text-[#27265C] font-medium hover:underline"
                >
                  + ещё {order.items.length - 3} позиций
                </button>
              </div>
            )}
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Итого</span>
              <span className="text-base font-bold text-[#27265C]">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
              <Icon name="UserCircle" className="w-4.5 h-4.5 text-[#27265C]/70" />
              Ответственный менеджер
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#27265C]/10 flex items-center justify-center shrink-0">
                <Icon name="User" className="w-6 h-6 text-[#27265C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#27265C]">
                  {order.manager}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Icon name="Phone" className="w-3 h-3" />
                    {order.managerPhone}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Icon name="Mail" className="w-3 h-3" />
                    {order.managerEmail}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-500">
                Заказ будет направлен этому менеджеру. После обработки вы получите уведомление с результатом.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              asChild
            >
              <Link to={`/order/${orderId}`}>
                <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Назад к заказу
              </Link>
            </Button>
            <Button
              className="bg-[#27265C] hover:bg-[#27265C]/90 text-white px-6 shadow-lg shadow-[#27265C]/20"
              disabled={isSending}
              onClick={handleSend}
            >
              {isSending ? (
                <>
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" className="w-4 h-4 mr-2" />
                  Отправить на согласование
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSend;

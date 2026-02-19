import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import {
  OrderData,
  OrderItem,
  ItemLineStatus,
  ORDER_STATUS_CONFIG,
  STATUS_STEPS,
  LINE_STATUS_CONFIG,
  formatCurrency,
  formatWeight,
  MOCK_ORDER,
} from "@/types/order";

interface StatusGroup {
  status: ItemLineStatus;
  label: string;
  icon: string;
  headerBg: string;
  headerText: string;
  headerBorder: string;
  items: OrderItem[];
}

const OrderReview = () => {
  const { orderId } = useParams();

  const order: OrderData = {
    ...MOCK_ORDER,
    id: orderId || MOCK_ORDER.id,
    status: "needs-approval",
  };

  const currentStepIndex = 3;

  const confirmedItems = useMemo(
    () => order.items.filter((i) => i.lineStatus === "confirmed"),
    [order.items]
  );
  const rejectedItems = useMemo(
    () =>
      order.items.filter(
        (i) =>
          i.lineStatus === "rejected-auto" ||
          i.lineStatus === "rejected-manager"
      ),
    [order.items]
  );
  const pendingItems = useMemo(
    () => order.items.filter((i) => i.lineStatus === "pending"),
    [order.items]
  );
  const preorderItems = useMemo(
    () => order.items.filter((i) => i.lineStatus === "preorder"),
    [order.items]
  );
  const backorderItems = useMemo(
    () => order.items.filter((i) => i.lineStatus === "backorder"),
    [order.items]
  );

  const requestedTotal = useMemo(
    () =>
      order.items.reduce((s, i) => s + i.qtyRequested * i.price, 0),
    [order.items]
  );

  const confirmedTotal = useMemo(
    () =>
      order.items.reduce((s, i) => s + i.qtyConfirmed * i.price, 0),
    [order.items]
  );

  const difference = confirmedTotal - requestedTotal;
  const diffPercent =
    requestedTotal > 0
      ? Math.round((difference / requestedTotal) * 100)
      : 0;
  const confirmedPercent =
    requestedTotal > 0
      ? Math.round((confirmedTotal / requestedTotal) * 100)
      : 0;

  const statusGroups: StatusGroup[] = [
    {
      status: "confirmed",
      label: "Подтверждено",
      icon: "CheckCircle",
      headerBg: "bg-green-50",
      headerText: "text-green-800",
      headerBorder: "border-green-200",
      items: confirmedItems,
    },
    {
      status: "rejected-auto",
      label: "Отклонено",
      icon: "XCircle",
      headerBg: "bg-red-50",
      headerText: "text-red-800",
      headerBorder: "border-red-200",
      items: rejectedItems,
    },
    {
      status: "pending",
      label: "На рассмотрении",
      icon: "Clock",
      headerBg: "bg-yellow-50",
      headerText: "text-yellow-800",
      headerBorder: "border-yellow-200",
      items: pendingItems,
    },
    {
      status: "preorder",
      label: "Предзаказ",
      icon: "ShoppingBag",
      headerBg: "bg-blue-50",
      headerText: "text-blue-800",
      headerBorder: "border-blue-200",
      items: preorderItems,
    },
    {
      status: "backorder",
      label: "Недопоставка",
      icon: "AlertTriangle",
      headerBg: "bg-amber-50",
      headerText: "text-amber-800",
      headerBorder: "border-amber-200",
      items: backorderItems,
    },
  ];

  const renderItemRow = (item: OrderItem, group: StatusGroup) => {
    const lineTotal = item.qtyConfirmed * item.price;
    const isPartial =
      item.qtyConfirmed > 0 && item.qtyConfirmed < item.qtyRequested;
    const isFullReject = item.qtyConfirmed === 0 && item.qtyRequested > 0;
    const lineConfig = LINE_STATUS_CONFIG[item.lineStatus];

    return (
      <div key={item.id} className="py-4 first:pt-2 last:pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 font-mono">{item.sku}</span>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 h-4 ${lineConfig.bgColor} ${lineConfig.color} border`}
              >
                {lineConfig.label}
              </Badge>
            </div>
            <p className="text-sm font-medium text-[#27265C]">{item.name}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-gray-500">
                Запрошено: <span className="font-semibold text-gray-700">{item.qtyRequested} шт</span>
              </span>
              <Icon name="ArrowRight" className="w-3 h-3 text-gray-400" />
              <span
                className={`text-xs font-semibold ${
                  isFullReject
                    ? "text-red-600"
                    : isPartial
                    ? "text-amber-600"
                    : "text-green-600"
                }`}
              >
                {item.qtyConfirmed} шт
              </span>
              {item.qtyShortage > 0 && (
                <span className="text-xs text-red-500">
                  (-{item.qtyShortage} шт)
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            {item.qtyConfirmed > 0 ? (
              <>
                <p className="text-sm font-bold text-[#27265C]">
                  {formatCurrency(lineTotal)}
                </p>
                {isPartial && (
                  <p className="text-[11px] text-gray-400 line-through">
                    {formatCurrency(item.qtyRequested * item.price)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm font-semibold text-gray-400 line-through">
                {formatCurrency(item.qtyRequested * item.price)}
              </p>
            )}
          </div>
        </div>
        {item.rejectReason && (
          <div
            className={`mt-2.5 rounded-lg px-3 py-2.5 flex items-start gap-2.5 ${
              item.lineStatus === "rejected-auto" || item.lineStatus === "rejected-manager"
                ? "bg-red-50 border border-red-200"
                : item.lineStatus === "backorder"
                ? "bg-amber-50 border border-amber-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <Icon
              name={
                item.lineStatus === "rejected-auto" || item.lineStatus === "rejected-manager"
                  ? "AlertCircle"
                  : "Info"
              }
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                item.lineStatus === "rejected-auto" || item.lineStatus === "rejected-manager"
                  ? "text-red-500"
                  : "text-amber-500"
              }`}
            />
            <div>
              <p
                className={`text-xs font-medium ${
                  item.lineStatus === "rejected-auto" || item.lineStatus === "rejected-manager"
                    ? "text-red-800"
                    : "text-amber-800"
                }`}
              >
                {item.rejectReason}
              </p>
              {item.lineStatus === "rejected-auto" && (
                <p className="text-[11px] text-red-600/70 mt-1">
                  Ближайшее поступление: ~10.03.2026
                </p>
              )}
              {(item.lineStatus === "rejected-auto" ||
                item.lineStatus === "rejected-manager") &&
                item.qtyConfirmed === 0 && (
                  <p className="text-[11px] text-[#27265C] font-medium mt-1.5 flex items-center gap-1">
                    <Icon name="ShoppingBag" className="w-3 h-3" />
                    Вы можете оформить предзаказ на этот товар
                  </p>
                )}
              {item.lineStatus === "rejected-manager" && isPartial && (
                <p className="text-[11px] text-red-600/70 mt-1">
                  Подтверждено {item.qtyConfirmed} из {item.qtyRequested} шт.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

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
                Результат обработки заказа
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Заказ {order.id} — менеджер проверил позиции и подготовил ответ
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
                  const isPast = index < currentStepIndex;
                  const isFuture = index > currentStepIndex;

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
                              : isPast
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        `}
                      >
                        {config.label}
                      </span>
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Icon name="CheckCircle" className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-700">{confirmedItems.length}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Подтверждено</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Icon name="AlertTriangle" className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-amber-700">
                {
                  order.items.filter(
                    (i) =>
                      (i.lineStatus === "rejected-manager" || i.lineStatus === "backorder") &&
                      i.qtyConfirmed > 0 &&
                      i.qtyConfirmed < i.qtyRequested
                  ).length
                }
              </p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Частично подтверждено</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Icon name="XCircle" className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-red-700">{rejectedItems.length}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Отклонено</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Icon name="ShoppingBag" className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-700">{preorderItems.length}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Предзаказ</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
              <Icon name="TrendingDown" className="w-4.5 h-4.5 text-[#27265C]/70" />
              Сравнение сумм
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Разница между запрошенной и подтверждённой суммой
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[11px] text-gray-500 font-medium mb-1">Запрошено</p>
                <p className="text-xl font-bold text-[#27265C]">
                  {formatCurrency(requestedTotal)}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-[11px] text-green-600 font-medium mb-1">Подтверждено</p>
                <p className="text-xl font-bold text-green-700">
                  {formatCurrency(confirmedTotal)}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="text-[11px] text-red-500 font-medium mb-1">Разница</p>
                <p className="text-xl font-bold text-red-600">
                  {difference < 0 ? "" : "+"}
                  {formatCurrency(Math.abs(difference))}
                  <span className="text-sm font-semibold ml-1.5">
                    ({diffPercent > 0 ? "+" : ""}
                    {diffPercent}%)
                  </span>
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Подтверждено от запрошенной суммы
                </span>
                <span className="text-xs font-bold text-[#27265C]">{confirmedPercent}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${confirmedPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-gray-400">
                  {formatCurrency(0)}
                </span>
                <span className="text-[11px] text-gray-400">
                  {formatCurrency(requestedTotal)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-6">
          {statusGroups
            .filter((g) => g.items.length > 0)
            .map((group) => (
              <Card key={group.status} className="border-0 shadow-sm overflow-hidden">
                <div
                  className={`px-4 py-3 flex items-center justify-between border-b ${group.headerBg} ${group.headerBorder}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${group.headerBg}`}
                    >
                      <Icon name={group.icon} className={`w-4 h-4 ${group.headerText}`} />
                    </div>
                    <span className={`text-sm font-bold ${group.headerText}`}>
                      {group.label}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${group.headerBg} ${group.headerText} ${group.headerBorder} border text-xs font-semibold`}
                  >
                    {group.items.length}{" "}
                    {group.items.length === 1 ? "позиция" : "позиций"}
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 px-4">
                    {group.items.map((item) => renderItemRow(item, group))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <Card className="mb-8 border-0 shadow-sm bg-[#27265C]/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#27265C] flex items-center gap-2">
              <Icon name="Compass" className="w-4.5 h-4.5 text-[#27265C]/70" />
              Что делать дальше
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Выберите действие, которое соответствует вашей ситуации
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Icon name="CheckSquare" className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#27265C]">
                    Подтвердить как есть
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Заказ будет зафиксирован в текущем составе. Подтверждённые позиции попадут в график отгрузки.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FCC71E]/20 flex items-center justify-center shrink-0">
                  <Icon name="PackagePlus" className="w-5 h-5 text-[#27265C]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#27265C]">
                    Дозаказать товары
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Добавьте товары для добивки фуры. Это позволит заполнить свободное место и оптимизировать доставку.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Icon name="MessageSquare" className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#27265C]">
                    Связаться с менеджером
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.manager}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-[#27265C] font-medium flex items-center gap-1">
                      <Icon name="Phone" className="w-3 h-3" />
                      {order.managerPhone}
                    </span>
                    <span className="text-xs text-[#27265C] font-medium flex items-center gap-1">
                      <Icon name="Mail" className="w-3 h-3" />
                      {order.managerEmail}
                    </span>
                  </div>
                </div>
              </div>
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
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-[#27265C]/30 text-[#27265C] hover:bg-[#27265C]/5"
                asChild
              >
                <Link to={`/order/${orderId}/adjust`}>
                  <Icon name="PackagePlus" className="w-4 h-4 mr-2" />
                  Дозаказать товары
                </Link>
              </Button>
              <Button
                className="bg-[#27265C] hover:bg-[#27265C]/90 text-white px-6 shadow-lg shadow-[#27265C]/20"
                asChild
              >
                <Link to={`/order/${orderId}/confirm`}>
                  <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                  Подтвердить заказ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;

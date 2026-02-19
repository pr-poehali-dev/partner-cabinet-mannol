import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import { Link, useParams } from "react-router-dom";
import {
  OrderData,
  OrderItem,
  OrderStatus,
  ItemLineStatus,
  RecommendedProduct,
  ORDER_STATUS_CONFIG,
  STATUS_STEPS,
  LINE_STATUS_CONFIG,
  MAX_TRUCK_WEIGHT,
  MOCK_ORDER,
  MOCK_RECOMMENDATIONS,
  formatWeight,
  formatCurrency,
  daysSince,
  isOrderLocked,
  canClientEdit,
} from "@/types/order";

const OrderDetails = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState<OrderData>({
    ...MOCK_ORDER,
    id: orderId || MOCK_ORDER.id,
  });
  const [addedRecommendations, setAddedRecommendations] = useState<Set<string>>(
    new Set()
  );

  const totalWeightKg = useMemo(() => {
    return order.items.reduce((sum, item) => {
      const qty =
        item.lineStatus === "rejected-auto" ? 0 : item.qtyConfirmed || item.qtyRequested;
      return sum + qty * item.weightPerUnit;
    }, 0);
  }, [order.items]);

  const truckLoadPercent = Math.min((totalWeightKg / MAX_TRUCK_WEIGHT) * 100, 100);
  const remainingWeightKg = Math.max(MAX_TRUCK_WEIGHT - totalWeightKg, 0);

  const totalAmount = useMemo(() => {
    return order.items.reduce((sum, item) => {
      if (item.lineStatus === "rejected-auto") return sum;
      const qty = item.qtyConfirmed > 0 ? item.qtyConfirmed : item.qtyRequested;
      return sum + qty * item.price;
    }, 0);
  }, [order.items]);

  const totalRequestedAmount = useMemo(() => {
    return order.items.reduce(
      (sum, item) => sum + item.qtyRequested * item.price,
      0
    );
  }, [order.items]);

  const confirmedItems = order.items.filter((i) => i.lineStatus === "confirmed");
  const pendingItems = order.items.filter((i) => i.lineStatus === "pending");
  const rejectedItems = order.items.filter(
    (i) => i.lineStatus === "rejected-auto" || i.lineStatus === "rejected-manager"
  );
  const preorderItems = order.items.filter((i) => i.lineStatus === "preorder");
  const backorderItems = order.items.filter((i) => i.lineStatus === "backorder");

  const totalShortageQty = order.items.reduce(
    (sum, item) => sum + item.qtyShortage,
    0
  );
  const totalShortageAmount = order.items.reduce(
    (sum, item) => sum + item.qtyShortage * item.price,
    0
  );

  const isStale = daysSince(order.sentAt) > 3;
  const locked = isOrderLocked(order.status);
  const editable = canClientEdit(order.status);

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  const handleAddRecommendation = (product: RecommendedProduct) => {
    const newItem: OrderItem = {
      id: `item-new-${product.id}`,
      name: product.name,
      sku: product.sku,
      qtyRequested: 100,
      qtyConfirmed: 0,
      qtyShortage: 0,
      price: product.price,
      weightPerUnit: product.weightPerUnit,
      lineStatus: "pending",
    };
    setOrder((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setAddedRecommendations((prev) => new Set(prev).add(product.id));
  };

  const renderLineStatusBadge = (status: ItemLineStatus) => {
    const config = LINE_STATUS_CONFIG[status];
    return (
      <Badge
        className={`${config.bgColor} ${config.color} border font-medium gap-1.5`}
      >
        <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
        {config.label}
      </Badge>
    );
  };

  const renderStatusStep = (stepStatus: OrderStatus, index: number) => {
    const config = ORDER_STATUS_CONFIG[stepStatus];
    const isCompleted = index < currentStepIndex;
    const isCurrent = index === currentStepIndex;

    return (
      <div key={stepStatus} className="flex flex-col items-center gap-1.5 flex-1">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isCurrent
              ? "bg-[#27265C] text-white ring-4 ring-[#27265C]/20"
              : isCompleted
              ? "bg-[#27265C] text-white"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <Icon
            name={isCompleted ? "Check" : config.icon}
            size={18}
          />
        </div>
        <span
          className={`text-xs text-center leading-tight max-w-[80px] ${
            isCurrent
              ? "font-bold text-[#27265C]"
              : isCompleted
              ? "font-medium text-[#27265C]"
              : "text-gray-400"
          }`}
        >
          {config.label}
        </span>
      </div>
    );
  };

  const businessFlowSteps = [
    {
      label: "Формирование",
      icon: "FilePlus",
      href: "/order/new",
      active: order.status === "draft",
      completed: currentStepIndex > 0,
    },
    {
      label: "Отправка",
      icon: "Send",
      href: `/order/${order.id}/send`,
      active: order.status === "draft",
      completed: currentStepIndex >= 1,
    },
    {
      label: "Результат обработки",
      icon: "ClipboardList",
      href: `/order/${order.id}/review`,
      active: order.status === "needs-approval",
      completed: currentStepIndex >= 4,
    },
    {
      label: "Дозаказ",
      icon: "PackagePlus",
      href: `/order/${order.id}/adjust`,
      active: order.status === "needs-approval",
      completed: currentStepIndex >= 4,
    },
    {
      label: "Подтверждение",
      icon: "CheckCircle",
      href: `/order/${order.id}/confirm`,
      active: order.status === "needs-approval",
      completed: currentStepIndex >= 4,
    },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/orders">
                <Button variant="ghost" size="sm">
                  <Icon name="ArrowLeft" size={18} className="mr-2" />
                  Назад к заказам
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-[#27265C]">
                Заказ {order.id}
              </h1>
              <Badge
                className={`${ORDER_STATUS_CONFIG[order.status].bgColor} ${ORDER_STATUS_CONFIG[order.status].color} text-sm px-3 py-1`}
              >
                <Icon
                  name={ORDER_STATUS_CONFIG[order.status].icon}
                  size={16}
                  className="mr-1.5"
                />
                {ORDER_STATUS_CONFIG[order.status].label}
              </Badge>
              {locked && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-gray-200 text-gray-700 gap-1">
                      <Icon name="Lock" size={14} />
                      Заблокирован
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>После подтверждения заказ нельзя изменить</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {order.orderType === "direct" && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-300 border">
                  Прямой заказ
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Icon name="Calendar" size={14} />
                Создан: {order.createdAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="Building2" size={14} />
                {order.clientName}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="Warehouse" size={14} />
                {order.warehouse}
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
            >
              <Icon name="Printer" size={18} className="mr-2" />
              Печать
            </Button>
            <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
              <Icon name="Download" size={18} className="mr-2" />
              Документы
            </Button>
          </div>
        </div>

        {isStale && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Icon name="AlertOctagon" size={22} className="text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-800 text-base">
                  Заказ не обработан более 3 дней
                </p>
                <p className="text-red-700 text-sm mt-1">
                  Заказ был отправлен {order.sentAt} и до сих пор не завершён.
                  Если заказ не будет обработан в течение 7 дней с момента
                  отправки, он будет автоматически отменён. Свяжитесь с менеджером
                  для уточнения статуса.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    <Icon name="Phone" size={14} className="mr-1.5" />
                    Позвонить менеджеру
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    <Icon name="Mail" size={14} className="mr-1.5" />
                    Написать менеджеру
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {locked && (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-4 flex items-center gap-3">
              <Icon name="Lock" size={22} className="text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800">
                  Заказ подтверждён и заблокирован для редактирования
                </p>
                <p className="text-amber-700 text-sm">
                  Изменения невозможны. Для корректировок свяжитесь с менеджером.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {order.status === "needs-approval" && (
          <Card className="border-[#27265C] border-2 bg-gradient-to-r from-[#27265C]/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#27265C] flex items-center justify-center flex-shrink-0">
                  <Icon name="Info" size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#27265C] text-lg">
                    Что сейчас происходит с заказом?
                  </h3>
                  <p className="text-gray-700 mt-1">
                    Менеджер проверил ваш заказ и вернул его на доработку. Часть
                    позиций подтверждена, часть отклонена или требует вашего
                    решения. Просмотрите каждую позицию, при необходимости
                    добавьте товары для добивки фуры и отправьте заказ повторно.
                  </p>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-700">
                        {confirmedItems.length}
                      </div>
                      <div className="text-xs text-green-600">Подтверждено</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-700">
                        {pendingItems.length}
                      </div>
                      <div className="text-xs text-yellow-600">
                        На рассмотрении
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                      <div className="text-2xl font-bold text-red-700">
                        {rejectedItems.length}
                      </div>
                      <div className="text-xs text-red-600">Отклонено</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
                      <div className="text-2xl font-bold text-amber-700">
                        {preorderItems.length + backorderItems.length}
                      </div>
                      <div className="text-xs text-amber-600">
                        Предзаказ / Недопоставка
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-1 relative">
              <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200 -z-0" />
              <div
                className="absolute top-5 left-8 h-0.5 bg-[#27265C] transition-all -z-0"
                style={{
                  width: `calc(${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}% - 64px)`,
                }}
              />
              {STATUS_STEPS.map((step, idx) => (
                <div key={step} className="relative z-10">
                  {renderStatusStep(step, idx)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={`lg:col-span-1 ${order.orderType === "direct" ? "border-purple-300 border-2" : ""}`}>
            <CardHeader>
              <CardTitle className="text-[#27265C] flex items-center gap-2">
                <Icon name="FileText" size={20} />
                Информация о заказе
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Номер заказа</span>
                  <span className="font-semibold">{order.id}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Тип заказа</span>
                  <span className="font-semibold">
                    {order.orderType === "direct" ? "Прямой" : "Обычный"}
                  </span>
                </div>
                <Separator />
                {order.orderType === "direct" ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      <Icon name="Factory" size={16} />
                      Прямая поставка с завода
                    </div>
                    Дата доставки будет подтверждена отдельно после согласования с
                    производством.
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Желаемая дата отгрузки</span>
                    <span className="font-semibold">
                      {order.desiredShipmentDate}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Склад</span>
                  <span className="font-semibold">{order.warehouse}</span>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-gray-500">Менеджер</span>
                  <div className="mt-1">
                    <p className="font-semibold">{order.manager}</p>
                    <div className="flex items-center gap-1.5 text-gray-600 mt-0.5">
                      <Icon name="Phone" size={12} />
                      {order.managerPhone}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 mt-0.5">
                      <Icon name="Mail" size={12} />
                      {order.managerEmail}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Сумма запрошенного</span>
                  <span className="text-gray-600">
                    {formatCurrency(totalRequestedAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#27265C]">
                  <span>Сумма к отгрузке</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                {totalShortageAmount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Сумма недопоставки</span>
                    <span>{formatCurrency(totalShortageAmount)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#27265C] flex items-center gap-2">
                <Icon name="Weight" size={20} />
                Загрузка транспорта
              </CardTitle>
              <CardDescription>
                Максимальная загрузка фуры: {formatWeight(MAX_TRUCK_WEIGHT)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Текущий вес заказа</span>
                  <span className="text-[#27265C] font-bold text-lg">
                    {formatWeight(totalWeightKg)}
                  </span>
                </div>
                <Progress
                  value={truckLoadPercent}
                  className="h-6 bg-gray-200"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 т</span>
                  <span>{formatWeight(MAX_TRUCK_WEIGHT)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#27265C]/5 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-[#27265C]">
                    {truckLoadPercent.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Загружено</div>
                </div>
                <div className="bg-[#FCC71E]/10 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-[#27265C]">
                    {formatWeight(totalWeightKg)}
                  </div>
                  <div className="text-xs text-gray-600">Текущий вес</div>
                </div>
                <div
                  className={`rounded-lg p-3 text-center ${
                    remainingWeightKg > 2000
                      ? "bg-amber-50"
                      : remainingWeightKg > 0
                      ? "bg-green-50"
                      : "bg-green-100"
                  }`}
                >
                  <div
                    className={`text-xl font-bold ${
                      remainingWeightKg > 2000
                        ? "text-amber-700"
                        : "text-green-700"
                    }`}
                  >
                    {formatWeight(remainingWeightKg)}
                  </div>
                  <div className="text-xs text-gray-600">Осталось</div>
                </div>
              </div>

              {remainingWeightKg > 1000 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
                  <Icon
                    name="TrendingUp"
                    size={20}
                    className="text-amber-600 flex-shrink-0"
                  />
                  <div className="text-sm text-amber-800">
                    <span className="font-semibold">Совет:</span> До полной
                    загрузки фуры осталось {formatWeight(remainingWeightKg)}.
                    Добавьте товары из рекомендаций ниже для оптимальной
                    логистики.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#27265C] flex items-center gap-2">
                  <Icon name="Package" size={20} />
                  Позиции заказа
                </CardTitle>
                <CardDescription>
                  {order.items.length} позиций в заказе
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Подтв. {confirmedItems.length}
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  Ожид. {pendingItems.length}
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Откл. {rejectedItems.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => {
              const lineConfig = LINE_STATUS_CONFIG[item.lineStatus];
              const itemTotalWeight = item.qtyRequested * item.weightPerUnit;
              const isRejected =
                item.lineStatus === "rejected-auto" ||
                item.lineStatus === "rejected-manager";
              const hasShortage = item.qtyShortage > 0;

              return (
                <div
                  key={item.id}
                  className={`border rounded-xl p-4 transition-all ${lineConfig.bgColor}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            item.lineStatus === "confirmed"
                              ? "bg-green-100"
                              : item.lineStatus === "pending"
                              ? "bg-yellow-100"
                              : isRejected
                              ? "bg-red-100"
                              : item.lineStatus === "preorder"
                              ? "bg-blue-100"
                              : "bg-amber-100"
                          }`}
                        >
                          <Icon
                            name={lineConfig.icon}
                            size={20}
                            className={lineConfig.color}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-[#27265C] truncate">
                              {item.name}
                            </h4>
                            {renderLineStatusBadge(item.lineStatus)}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Артикул: {item.sku}
                          </p>
                        </div>
                      </div>

                      {(isRejected || hasShortage) && (
                        <div className="mt-3 ml-[52px]">
                          <div className="bg-white/70 rounded-lg p-3 space-y-2 text-sm border border-white/50">
                            <div className="flex items-center gap-6 flex-wrap">
                              <div>
                                <span className="text-gray-500">
                                  Запрошено:{" "}
                                </span>
                                <span className="font-bold">
                                  {item.qtyRequested} шт
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Подтверждено:{" "}
                                </span>
                                <span className="font-bold text-green-700">
                                  {item.qtyConfirmed} шт
                                </span>
                              </div>
                              {item.qtyShortage > 0 && (
                                <div>
                                  <span className="text-gray-500">
                                    Недопоставка:{" "}
                                  </span>
                                  <span className="font-bold text-red-600">
                                    {item.qtyShortage} шт
                                  </span>
                                </div>
                              )}
                              {item.lineStatus === "rejected-auto" && (
                                <div>
                                  <span className="text-gray-500">
                                    Отклонено:{" "}
                                  </span>
                                  <span className="font-bold text-red-600">
                                    {item.qtyRequested - item.qtyConfirmed} шт
                                  </span>
                                </div>
                              )}
                            </div>
                            {item.rejectReason && (
                              <div className="flex items-start gap-2 text-red-700 bg-red-50 rounded p-2">
                                <Icon
                                  name="AlertCircle"
                                  size={16}
                                  className="mt-0.5 flex-shrink-0"
                                />
                                <span>{item.rejectReason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {item.lineStatus === "preorder" && (
                        <div className="mt-3 ml-[52px]">
                          <div className="bg-blue-100/50 rounded-lg p-3 text-sm border border-blue-200">
                            <div className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
                              <Icon name="Info" size={16} />
                              Предзаказ
                            </div>
                            <p className="text-blue-700">
                              Не резервирует товар. Передаётся закупщикам как
                              сигнал о спросе. Сроки поставки будут сообщены
                              дополнительно.
                            </p>
                          </div>
                        </div>
                      )}

                      {item.lineStatus === "backorder" && (
                        <div className="mt-3 ml-[52px]">
                          <div className="bg-amber-100/50 rounded-lg p-3 text-sm border border-amber-200">
                            <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1">
                              <Icon name="AlertTriangle" size={16} />
                              Недопоставка
                            </div>
                            <p className="text-amber-700">
                              {item.rejectReason ||
                                "Часть товара будет компенсирована при ближайшей отгрузке."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex lg:flex-col items-center lg:items-end gap-4 lg:gap-2 text-right flex-shrink-0 ${
                        isRejected ? "opacity-60" : ""
                      }`}
                    >
                      <div>
                        <div className="text-xs text-gray-500">Цена/шт</div>
                        <div className="font-semibold">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Кол-во</div>
                        <div className="font-semibold">
                          {item.qtyRequested} шт
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Вес</div>
                        <div className="font-semibold text-gray-600">
                          {formatWeight(itemTotalWeight)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Сумма</div>
                        <div className="font-bold text-[#27265C]">
                          {formatCurrency(item.qtyRequested * item.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {totalShortageQty > 0 && (
          <Card className="border-amber-300 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <Icon name="AlertTriangle" size={20} />
                Сводка по недопоставкам
              </CardTitle>
              <CardDescription className="text-amber-700">
                Общий объём недопоставки, который необходимо компенсировать
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 text-center border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700">
                    {totalShortageQty} шт
                  </div>
                  <div className="text-sm text-amber-600">Общий объём</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700">
                    {formatCurrency(totalShortageAmount)}
                  </div>
                  <div className="text-sm text-amber-600">Сумма недопоставки</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700">
                    {order.items.filter((i) => i.qtyShortage > 0).length}
                  </div>
                  <div className="text-sm text-amber-600">Позиций затронуто</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items
                  .filter((i) => i.qtyShortage > 0)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-200 text-sm"
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">({item.sku})</span>
                      </div>
                      <div className="font-semibold text-amber-700">
                        -{item.qtyShortage} шт (
                        {formatCurrency(item.qtyShortage * item.price)})
                      </div>
                    </div>
                  ))}
              </div>

              {editable && (
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  asChild
                >
                  <Link to={`/order/${order.id}/adjust`}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добрать товары
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {editable && remainingWeightKg > 500 && (
          <Card className="border-[#FCC71E] border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FCC71E] flex items-center justify-center">
                  <Icon name="Sparkles" size={22} className="text-[#27265C]" />
                </div>
                <div>
                  <CardTitle className="text-[#27265C]">
                    Рекомендуемые товары для добивки
                  </CardTitle>
                  <CardDescription>
                    Популярные товары категории A, всегда в наличии. Осталось{" "}
                    {formatWeight(remainingWeightKg)} до полной загрузки.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_RECOMMENDATIONS.map((product) => {
                  const isAdded = addedRecommendations.has(product.id);
                  return (
                    <div
                      key={product.id}
                      className={`border rounded-xl p-4 transition-all ${
                        isAdded
                          ? "bg-green-50 border-green-300"
                          : "bg-white hover:border-[#FCC71E] hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-[#27265C] truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {product.sku}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                            <span className="font-semibold">
                              {formatCurrency(product.price)}
                            </span>
                            <span className="text-gray-500">
                              {product.weightPerUnit} кг/шт
                            </span>
                            <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0">
                              {product.availability === "plenty"
                                ? "Много"
                                : "В наличии"}
                            </Badge>
                            {product.regularBuy && (
                              <Badge className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0">
                                Вы покупали
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          disabled={isAdded}
                          onClick={() => handleAddRecommendation(product)}
                          className={
                            isAdded
                              ? "bg-green-200 text-green-800"
                              : "bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/80 font-semibold"
                          }
                        >
                          {isAdded ? (
                            <>
                              <Icon name="Check" size={16} className="mr-1" />
                              Добавлен
                            </>
                          ) : (
                            <>
                              <Icon name="Plus" size={16} className="mr-1" />
                              Добавить
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {editable && (
          <Card className="border-[#27265C]">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[#27265C] text-lg flex items-center gap-2">
                    <Icon name="Zap" size={20} />
                    Что вы можете сделать сейчас?
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Проверьте позиции, добавьте товары при необходимости и
                    выберите следующий шаг.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {order.status === "draft" && (
                    <Button
                      className="bg-[#27265C] hover:bg-[#27265C]/90 text-white font-semibold"
                      asChild
                    >
                      <Link to={`/order/${order.id}/send`}>
                        <Icon name="Send" size={18} className="mr-2" />
                        Отправить на согласование
                      </Link>
                    </Button>
                  )}
                  {order.status === "needs-approval" && (
                    <>
                      <Button
                        variant="outline"
                        className="border-[#27265C] text-[#27265C]"
                        asChild
                      >
                        <Link to={`/order/${order.id}/review`}>
                          <Icon name="ClipboardList" size={18} className="mr-2" />
                          Посмотреть результат обработки
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#27265C] text-[#27265C]"
                        asChild
                      >
                        <Link to={`/order/${order.id}/adjust`}>
                          <Icon name="PackagePlus" size={18} className="mr-2" />
                          Дозаказать товары
                        </Link>
                      </Button>
                      <Button
                        className="bg-[#27265C] hover:bg-[#27265C]/90 text-white font-semibold"
                        asChild
                      >
                        <Link to={`/order/${order.id}/confirm`}>
                          <Icon name="CheckCircle" size={18} className="mr-2" />
                          Подтвердить заказ
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {locked && (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="CheckCircle" size={22} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-green-800 text-lg">
                    Заказ подтверждён
                  </h3>
                  <p className="text-sm text-green-700 mt-0.5">
                    Заказ зафиксирован и передан в график отгрузки. Ожидайте уведомления о дате отгрузки.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-[#27265C]/20">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="Route" size={20} />
              Бизнес-процесс заказа
            </CardTitle>
            <CardDescription>
              Навигация по этапам обработки заказа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
              {businessFlowSteps.map((step, idx) => (
                <div key={step.label} className="flex items-center shrink-0">
                  {idx > 0 && (
                    <div className="flex items-center px-1">
                      <Icon name="ChevronRight" size={16} className="text-gray-300" />
                    </div>
                  )}
                  {step.active ? (
                    <Link
                      to={step.href}
                      className="flex flex-col items-center gap-2 rounded-xl border-2 border-[#27265C] bg-[#27265C]/5 p-3 min-w-[120px] hover:bg-[#27265C]/10 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#27265C] flex items-center justify-center">
                        <Icon name={step.icon} size={18} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-[#27265C] text-center leading-tight">
                        {step.label}
                      </span>
                    </Link>
                  ) : step.completed ? (
                    <Link
                      to={step.href}
                      className="flex flex-col items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 min-w-[120px] hover:bg-green-100 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
                        <Icon name="Check" size={18} className="text-white" />
                      </div>
                      <span className="text-xs font-medium text-green-700 text-center leading-tight">
                        {step.label}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 min-w-[120px] opacity-50 cursor-not-allowed">
                      <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Icon name={step.icon} size={18} className="text-gray-400" />
                      </div>
                      <span className="text-xs font-medium text-gray-400 text-center leading-tight">
                        {step.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="History" size={20} />
              История изменений
            </CardTitle>
            <CardDescription>
              Полная хронология событий по заказу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-0">
                {[...order.history].reverse().map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative pb-6 last:pb-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white border-2 border-gray-200 z-10 ${entry.color}`}
                    >
                      <Icon name={entry.icon} size={18} />
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className="text-sm font-medium text-gray-900">
                        {entry.event}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          {entry.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="User" size={12} />
                          {entry.user}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default OrderDetails;

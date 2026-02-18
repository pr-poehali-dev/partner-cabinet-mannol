import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type OrderStatus =
  | "Согласование"
  | "В обработке"
  | "Частично отгружен"
  | "Отгружен"
  | "Доставлен";

interface OrderItemPreview {
  name: string;
  sku: string;
  qty: number;
  amount: string;
  type: "shipped" | "preorder" | "backorder";
  deliveryId?: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: number;
  total: string;
  delivery: string;
  warehouse: string;
  type: string;
  shippedCount: number;
  preorderCount: number;
  backorderCount: number;
  itemsList: OrderItemPreview[];
}

const Orders = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const orders: Order[] = [
    {
      id: "ORD-2024-1247",
      date: "17.12.2024",
      status: "Частично отгружен",
      items: 5,
      total: "₽231,700",
      delivery: "22.12.2024",
      warehouse: "Склад Москва",
      type: "Обычный",
      shippedCount: 3,
      preorderCount: 2,
      backorderCount: 1,
      itemsList: [
        { name: "MANNOL Energy Formula 5W-30", sku: "MN7917-4", qty: 50, amount: "₽72,500", type: "shipped", deliveryId: "НКЛ-1247/1" },
        { name: "MANNOL Energy Formula 5W-30", sku: "MN7917-4", qty: 30, amount: "₽43,500", type: "shipped", deliveryId: "НКЛ-1247/2" },
        { name: "MANNOL 10W-40 EXTRA", sku: "MN7504-4", qty: 40, amount: "₽44,000", type: "shipped", deliveryId: "НКЛ-1247/1" },
        { name: "MANNOL ATF AG52", sku: "MN8211-4", qty: 30, amount: "₽29,400", type: "preorder" },
        { name: "MANNOL Longlife 504/507", sku: "MN7715-4", qty: 25, amount: "₽42,000", type: "preorder" },
        { name: "MANNOL Radiator Cleaner", sku: "MN9965", qty: 20, amount: "₽6,400", type: "backorder" },
      ],
    },
    {
      id: "ORD-2024-1246",
      date: "16.12.2024",
      status: "Отгружен",
      items: 3,
      total: "₽89,200",
      delivery: "20.12.2024",
      warehouse: "Склад Москва",
      type: "Обычный",
      shippedCount: 3,
      preorderCount: 0,
      backorderCount: 0,
      itemsList: [
        { name: "MANNOL Diesel TDI 5W-30", sku: "MN7919-4", qty: 60, amount: "₽48,000", type: "shipped", deliveryId: "НКЛ-1246/1" },
        { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 30, amount: "₽27,600", type: "shipped", deliveryId: "НКЛ-1246/1" },
        { name: "MANNOL Antifreeze AG13", sku: "MN4013-5", qty: 20, amount: "₽13,600", type: "shipped", deliveryId: "НКЛ-1246/1" },
      ],
    },
    {
      id: "ORD-2024-1245",
      date: "15.12.2024",
      status: "Доставлен",
      items: 4,
      total: "₽156,800",
      delivery: "19.12.2024",
      warehouse: "Склад Москва",
      type: "Обычный",
      shippedCount: 4,
      preorderCount: 0,
      backorderCount: 0,
      itemsList: [
        { name: "MANNOL Energy Formula 5W-30", sku: "MN7917-4", qty: 80, amount: "₽116,000", type: "shipped", deliveryId: "НКЛ-1245/1" },
        { name: "MANNOL ATF AG52", sku: "MN8211-4", qty: 20, amount: "₽19,600", type: "shipped", deliveryId: "НКЛ-1245/1" },
        { name: "MANNOL Radiator Cleaner", sku: "MN9965", qty: 40, amount: "₽12,800", type: "shipped", deliveryId: "НКЛ-1245/1" },
        { name: "MANNOL Antifreeze AG13", sku: "MN4013-5", qty: 15, amount: "₽8,400", type: "shipped", deliveryId: "НКЛ-1245/1" },
      ],
    },
    {
      id: "ORD-2024-1244",
      date: "14.12.2024",
      status: "Согласование",
      items: 6,
      total: "₽245,000",
      delivery: "28.12.2024",
      warehouse: "Завод",
      type: "Прямой",
      shippedCount: 0,
      preorderCount: 6,
      backorderCount: 0,
      itemsList: [
        { name: "MANNOL Energy Formula 5W-30", sku: "MN7917-4", qty: 200, amount: "₽145,000", type: "preorder" },
        { name: "MANNOL 10W-40 EXTRA", sku: "MN7504-4", qty: 100, amount: "₽55,000", type: "preorder" },
        { name: "MANNOL Diesel TDI 5W-30", sku: "MN7919-4", qty: 50, amount: "₽24,000", type: "preorder" },
        { name: "MANNOL ATF AG52", sku: "MN8211-4", qty: 40, amount: "₽19,600", type: "preorder" },
        { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 25, amount: "₽11,500", type: "preorder" },
        { name: "MANNOL Antifreeze AG13", sku: "MN4013-5", qty: 30, amount: "₽10,200", type: "preorder" },
      ],
    },
    {
      id: "ORD-2024-1243",
      date: "13.12.2024",
      status: "В обработке",
      items: 3,
      total: "₽98,400",
      delivery: "20.12.2024",
      warehouse: "Склад Москва",
      type: "Обычный",
      shippedCount: 0,
      preorderCount: 1,
      backorderCount: 0,
      itemsList: [
        { name: "MANNOL Energy Formula 5W-30", sku: "MN7917-4", qty: 50, amount: "₽72,500", type: "shipped" },
        { name: "MANNOL 10W-40 EXTRA", sku: "MN7504-4", qty: 20, amount: "₽22,000", type: "shipped" },
        { name: "MANNOL Longlife 504/507", sku: "MN7715-4", qty: 10, amount: "₽16,800", type: "preorder" },
      ],
    },
  ];

  useEffect(() => {
    if (orderId) {
      const order = orders.find(o => o.id === orderId);
      if (order) setSelectedOrder(order);
    }
  }, [orderId]);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    navigate(`/orders/${order.id}/details`);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    navigate('/orders');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Доставлен": return "bg-green-100 text-green-700";
      case "Отгружен": return "bg-blue-100 text-blue-700";
      case "Частично отгружен": return "bg-indigo-100 text-indigo-700";
      case "В обработке": return "bg-yellow-100 text-yellow-700";
      case "Согласование": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Доставлен": return "CheckCircle";
      case "Отгружен": return "Truck";
      case "Частично отгружен": return "PackageOpen";
      case "В обработке": return "Clock";
      case "Согласование": return "MessageSquare";
      default: return "Package";
    }
  };

  const renderOrderCard = (order: Order) => {
    const shippedItems = order.itemsList.filter(i => i.type === "shipped");
    const preorderItemsList = order.itemsList.filter(i => i.type === "preorder");
    const backorderItemsList = order.itemsList.filter(i => i.type === "backorder");

    return (
      <Card key={order.id} className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#27265C]">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      <Icon name={getStatusIcon(order.status)} size={12} className="mr-1" />
                      {order.status}
                    </Badge>
                    {order.type === "Прямой" && (
                      <Badge className="bg-purple-100 text-purple-700">
                        <Icon name="Truck" size={12} className="mr-1" />
                        Прямой заказ
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Создан: {order.date} • Плановая отгрузка: {order.delivery}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#27265C]">{order.total}</div>
                  <p className="text-sm text-gray-500">{order.items} позиций</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Склад</p>
                  <div className="flex items-center gap-2">
                    <Icon name="Warehouse" size={16} className="text-[#27265C]" />
                    <span className="font-semibold text-[#27265C]">{order.warehouse}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Отгружено</p>
                  <span className="font-semibold text-green-700">{shippedItems.length} поз.</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Под заказ</p>
                  <span className={`font-semibold ${preorderItemsList.length > 0 ? "text-blue-700" : "text-gray-400"}`}>
                    {preorderItemsList.length > 0 ? `${preorderItemsList.length} поз.` : "—"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Недопоставка</p>
                  <span className={`font-semibold ${backorderItemsList.length > 0 ? "text-amber-700" : "text-gray-400"}`}>
                    {backorderItemsList.length > 0 ? `${backorderItemsList.length} поз.` : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-col gap-2 lg:w-48">
              <Dialog open={selectedOrder?.id === order.id} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                    onClick={() => handleOpenModal(order)}
                  >
                    <Icon name="Eye" size={16} className="mr-2" />
                    Подробнее
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onEscapeKeyDown={handleCloseModal}>
                  {selectedOrder && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-[#27265C] flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#27265C] rounded-lg flex items-center justify-center">
                            <Icon name="ShoppingCart" size={24} className="text-white" />
                          </div>
                          Заказ {selectedOrder.id}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          Создан {selectedOrder.date} • Плановая отгрузка {selectedOrder.delivery}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Separator />
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Icon name="Package" size={16} />
                              <span className="text-xs">Позиций</span>
                            </div>
                            <p className="text-xl font-bold text-[#27265C]">{selectedOrder.items}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Icon name="DollarSign" size={16} />
                              <span className="text-xs">Сумма</span>
                            </div>
                            <p className="text-xl font-bold text-[#27265C]">{selectedOrder.total}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Icon name="Warehouse" size={16} />
                              <span className="text-xs">Склад</span>
                            </div>
                            <p className="text-sm font-semibold text-[#27265C]">{selectedOrder.warehouse}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Icon name="Info" size={16} />
                              <span className="text-xs">Статус</span>
                            </div>
                            <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                          </div>
                        </div>

                        {(() => {
                          const shipped = selectedOrder.itemsList.filter(i => i.type === "shipped");
                          const preorder = selectedOrder.itemsList.filter(i => i.type === "preorder");
                          const backorder = selectedOrder.itemsList.filter(i => i.type === "backorder");

                          const deliveryGroupsMap = new Map<string, typeof shipped>();
                          shipped.forEach(i => {
                            const key = i.deliveryId || "unknown";
                            if (!deliveryGroupsMap.has(key)) deliveryGroupsMap.set(key, []);
                            deliveryGroupsMap.get(key)!.push(i);
                          });

                          return (
                            <>
                              {Array.from(deliveryGroupsMap.entries()).map(([delivId, delivItems]) => (
                                <div key={delivId}>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                      <Icon name="PackageCheck" size={14} className="text-green-600" />
                                    </div>
                                    <h4 className="font-semibold text-[#27265C]">Отгрузка {delivId}</h4>
                                  </div>
                                  <div className="space-y-2">
                                    {delivItems.map((item, idx) => (
                                      <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-semibold text-[#27265C]">{item.name}</p>
                                            <p className="text-sm text-gray-600">Арт: {item.sku}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold text-[#27265C]">{item.qty} шт</p>
                                            <p className="text-sm text-gray-600">{item.amount}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              {preorder.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                      <Icon name="Clock" size={14} className="text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-[#27265C]">Под заказ</h4>
                                    <Badge className="bg-blue-100 text-blue-700 text-xs">{preorder.length}</Badge>
                                  </div>
                                  <div className="space-y-2">
                                    {preorder.map((item, idx) => (
                                      <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-semibold text-[#27265C]">{item.name}</p>
                                            <p className="text-sm text-gray-600">Арт: {item.sku}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold text-[#27265C]">{item.qty} шт</p>
                                            <p className="text-sm text-gray-600">{item.amount}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {backorder.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                                      <Icon name="PackageX" size={14} className="text-amber-600" />
                                    </div>
                                    <h4 className="font-semibold text-[#27265C]">Недопоставка</h4>
                                    <Badge className="bg-amber-100 text-amber-700 text-xs">{backorder.length}</Badge>
                                  </div>
                                  <div className="space-y-2">
                                    {backorder.map((item, idx) => (
                                      <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-semibold text-[#27265C]">{item.name}</p>
                                            <p className="text-sm text-gray-600">Арт: {item.sku}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold text-amber-700">{item.qty} шт</p>
                                            <p className="text-sm text-gray-600">{item.amount}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <div className="flex items-start gap-3">
                            <Icon name="User" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-blue-900 mb-1">Менеджер заказа</p>
                              <p className="text-sm text-blue-800">
                                Иванова Мария • +7 (495) 123-45-67 • manager@mannol.ru
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <div className="flex gap-2">
                          <Link to={`/order/${selectedOrder.id}`} className="flex-1">
                            <Button className="w-full bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
                              <Icon name="FileText" size={18} className="mr-2" />
                              Полная информация
                            </Button>
                          </Link>
                          <Button variant="outline" className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                            <Icon name="Printer" size={18} className="mr-2" />
                            Печать
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <Link to="/catalog">
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-xs">
                              <Icon name="ShoppingCart" size={14} className="mr-1" />
                              Каталог
                            </Button>
                          </Link>
                          <Link to="/backorders">
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-xs">
                              <Icon name="PackageX" size={14} className="mr-1" />
                              Недопоставки
                            </Button>
                          </Link>
                          <Link to="/analytics">
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-xs">
                              <Icon name="BarChart3" size={14} className="mr-1" />
                              Аналитика
                            </Button>
                          </Link>
                          <Link to="/payments">
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-xs">
                              <Icon name="CreditCard" size={14} className="mr-1" />
                              Платежи
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              {order.status === "Отгружен" && (
                <Button className="flex-1 bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
                  <Icon name="FileText" size={16} className="mr-2" />
                  Документы
                </Button>
              )}
              {order.status === "Согласование" && (
                <Button className="flex-1 bg-green-500 text-white hover:bg-green-600">
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Согласовать
                </Button>
              )}
              {order.backorderCount > 0 && (
                <Link to="/backorders" className="flex-1">
                  <Button variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                    <Icon name="PackageX" size={16} className="mr-2" />
                    Недопоставки
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const inWorkStatuses = ["В обработке", "Согласование", "Частично отгружен"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Мои заказы</h1>
          <p className="text-gray-600 mt-1">История и статусы ваших заказов</p>
        </div>
        <Link to="/order/new">
          <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
            <Icon name="Plus" size={18} className="mr-2" />
            Новый заказ
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle className="text-[#27265C]">Список заказов</CardTitle>
              <CardDescription>Всего заказов: {orders.length}</CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-[300px]">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Поиск по номеру заказа..." className="pl-10" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all">Все ({orders.length})</TabsTrigger>
          <TabsTrigger value="processing">
            В работе ({orders.filter(o => inWorkStatuses.includes(o.status)).length})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Отгружены ({orders.filter(o => o.status === "Отгружен").length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Доставлены ({orders.filter(o => o.status === "Доставлен").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.map(renderOrderCard)}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {orders.filter(o => inWorkStatuses.includes(o.status)).map(renderOrderCard)}
        </TabsContent>

        <TabsContent value="shipped" className="space-y-4">
          {orders.filter(o => o.status === "Отгружен").map(renderOrderCard)}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {orders.filter(o => o.status === "Доставлен").map(renderOrderCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;

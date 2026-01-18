import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  date: string;
  status: string;
  items: number;
  total: string;
  delivery: string;
  warehouse: string;
  type: string;
}

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const orders: Order[] = [
    {
      id: "ORD-2024-1247",
      date: "17.12.2024",
      status: "В обработке",
      items: 5,
      total: "₽124,500",
      delivery: "22.12.2024",
      warehouse: "Склад 1",
      type: "Обычный"
    },
    {
      id: "ORD-2024-1246",
      date: "16.12.2024",
      status: "Отгружен",
      items: 3,
      total: "₽89,200",
      delivery: "20.12.2024",
      warehouse: "Склад 2",
      type: "Обычный"
    },
    {
      id: "ORD-2024-1245",
      date: "15.12.2024",
      status: "Доставлен",
      items: 8,
      total: "₽156,800",
      delivery: "19.12.2024",
      warehouse: "Склад 1",
      type: "Обычный"
    },
    {
      id: "ORD-2024-1244",
      date: "14.12.2024",
      status: "Согласование",
      items: 12,
      total: "₽245,000",
      delivery: "28.12.2024",
      warehouse: "Завод",
      type: "Прямой"
    },
    {
      id: "ORD-2024-1243",
      date: "13.12.2024",
      status: "Доставлен",
      items: 6,
      total: "₽98,400",
      delivery: "17.12.2024",
      warehouse: "Склад 1",
      type: "Обычный"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Доставлен":
        return "bg-green-100 text-green-700";
      case "Отгружен":
        return "bg-blue-100 text-blue-700";
      case "В обработке":
        return "bg-yellow-100 text-yellow-700";
      case "Согласование":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
          <TabsTrigger value="processing">В работе ({orders.filter(o => o.status === "В обработке" || o.status === "Согласование").length})</TabsTrigger>
          <TabsTrigger value="shipped">Отгружены ({orders.filter(o => o.status === "Отгружен").length})</TabsTrigger>
          <TabsTrigger value="delivered">Доставлены ({orders.filter(o => o.status === "Доставлен").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#27265C]">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
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
                        <p className="text-xs text-gray-500 mb-1">Тип заказа</p>
                        <span className="font-semibold text-[#27265C]">{order.type}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Позиций</p>
                        <span className="font-semibold text-[#27265C]">{order.items} шт</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Статус</p>
                        <Badge variant="outline" className="border-[#27265C] text-[#27265C]">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:w-48">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Icon name="Eye" size={16} className="mr-2" />
                          Подробнее
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                                    <Icon name="Truck" size={16} />
                                    <span className="text-xs">Тип</span>
                                  </div>
                                  <p className="text-sm font-semibold text-[#27265C]">{selectedOrder.type}</p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon name="Info" size={18} className="text-[#27265C]" />
                                  <h4 className="font-semibold text-[#27265C]">Статус заказа</h4>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Текущий статус:</span>
                                    <Badge className={getStatusColor(selectedOrder.status)}>
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon name="Package" size={18} className="text-[#27265C]" />
                                  <h4 className="font-semibold text-[#27265C]">Состав заказа</h4>
                                </div>
                                <div className="space-y-2">
                                  <div className="bg-gray-50 border rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-semibold text-[#27265C]">MANNOL 5W-30 API SN/CF</p>
                                        <p className="text-sm text-gray-600">Артикул: MAN-001</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-semibold text-[#27265C]">50 л</p>
                                        <p className="text-sm text-gray-600">₽62,500</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 border rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-semibold text-[#27265C]">MANNOL ATF AG52</p>
                                        <p className="text-sm text-gray-600">Артикул: MAN-002</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-semibold text-[#27265C]">30 л</p>
                                        <p className="text-sm text-gray-600">₽29,400</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 border rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-semibold text-[#27265C]">MANNOL Radiator Cleaner</p>
                                        <p className="text-sm text-gray-600">Артикул: MAN-003</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-semibold text-[#27265C]">20 шт</p>
                                        <p className="text-sm text-gray-600">₽9,000</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon name="Clock" size={18} className="text-[#27265C]" />
                                  <h4 className="font-semibold text-[#27265C]">История заказа</h4>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <Icon name="CheckCircle" size={16} className="text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-[#27265C]">Заказ создан</p>
                                      <p className="text-sm text-gray-600">{selectedOrder.date} 14:30</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <Icon name="Send" size={16} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-[#27265C]">Отправлен менеджеру</p>
                                      <p className="text-sm text-gray-600">{selectedOrder.date} 14:35</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

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

                            <div className="flex gap-2 pt-4">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="processing">
          {orders.filter(o => o.status === "В обработке" || o.status === "Согласование").map((order) => (
            <Card key={order.id} className="mb-4">
              <CardContent className="p-6">
                <p className="text-[#27265C] font-semibold">{order.id} - {order.status}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="shipped">
          {orders.filter(o => o.status === "Отгружен").map((order) => (
            <Card key={order.id} className="mb-4">
              <CardContent className="p-6">
                <p className="text-[#27265C] font-semibold">{order.id} - {order.status}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="delivered">
          {orders.filter(o => o.status === "Доставлен").map((order) => (
            <Card key={order.id} className="mb-4">
              <CardContent className="p-6">
                <p className="text-[#27265C] font-semibold">{order.id} - {order.status}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
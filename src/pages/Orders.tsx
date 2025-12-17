import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Orders = () => {
  const orders = [
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
                    <Link to={`/order/${order.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Подробнее
                      </Button>
                    </Link>
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

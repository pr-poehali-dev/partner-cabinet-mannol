import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Link, useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();

  const order = {
    id: orderId || "ORD-2024-1247",
    date: "17.12.2024",
    status: "В обработке",
    delivery: "22.12.2024",
    warehouse: "Склад Москва",
    manager: "Иванова Мария",
    managerPhone: "+7 (495) 123-45-67",
    items: [
      { id: "MAN-001", name: "MANNOL 5W-30 API SN/CF", quantity: 50, price: 1250, availability: "Много" },
      { id: "MAN-004", name: "MANNOL 10W-40 EXTRA", quantity: 30, price: 1100, availability: "Много" },
      { id: "MAN-002", name: "MANNOL ATF AG52", quantity: 20, price: 980, availability: "Мало" },
      { id: "MAN-003", name: "MANNOL Radiator Cleaner", quantity: 15, price: 450, availability: "Под заказ" }
    ],
    history: [
      { date: "17.12.2024 14:30", event: "Заказ создан", user: "Петров И.П." },
      { date: "17.12.2024 14:35", event: "Заказ отправлен менеджеру", user: "Система" },
      { date: "17.12.2024 15:20", event: "Менеджер принял заказ в работу", user: "Иванова М.С." }
    ]
  };

  const availableItems = order.items.filter(item => item.availability !== "Под заказ");
  const preorderItems = order.items.filter(item => item.availability === "Под заказ");

  const totalAvailable = availableItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalPreorder = preorderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalAmount = totalAvailable + totalPreorder;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/orders">
              <Button variant="ghost" size="sm">
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-[#27265C]">Заказ {order.id}</h1>
            <Badge className={
              order.status === "Доставлен" ? "bg-green-100 text-green-700" :
              order.status === "Отгружен" ? "bg-blue-100 text-blue-700" :
              "bg-yellow-100 text-yellow-700"
            }>
              {order.status}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Создан {order.date} • Плановая отгрузка {order.delivery}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
            <Icon name="Printer" size={18} className="mr-2" />
            Печать
          </Button>
          <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
            <Icon name="Download" size={18} className="mr-2" />
            Документы
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {availableItems.length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#27265C] flex items-center gap-2">
                      <Icon name="CheckCircle" size={20} className="text-green-600" />
                      К отгрузке
                    </CardTitle>
                    <CardDescription>Товары доступны на складе</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#27265C]">₽{totalAvailable.toLocaleString()}</div>
                    <p className="text-sm text-gray-500">{availableItems.length} позиций</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-1">
                        <h4 className="font-bold text-[#27265C]">{item.name}</h4>
                        <p className="text-sm text-gray-600">Артикул: {item.id}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-green-100 text-green-700">{item.availability}</Badge>
                          <span className="text-sm text-gray-600">Количество: {item.quantity} шт</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">₽{item.price.toLocaleString()} × {item.quantity}</p>
                        <p className="text-xl font-bold text-[#27265C]">₽{(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {preorderItems.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#27265C] flex items-center gap-2">
                      <Icon name="Clock" size={20} className="text-blue-600" />
                      Ожидание / Предзаказ
                    </CardTitle>
                    <CardDescription>Товары будут привезены под заказ</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#27265C]">₽{totalPreorder.toLocaleString()}</div>
                    <p className="text-sm text-gray-500">{preorderItems.length} позиций</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-3">
                    <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Обязательство на выкуп</p>
                      <p>Эти товары будут привезены специально под ваш заказ. Отказ от получения невозможен.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {preorderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex-1">
                        <h4 className="font-bold text-[#27265C]">{item.name}</h4>
                        <p className="text-sm text-gray-600">Артикул: {item.id}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-700">{item.availability}</Badge>
                          <span className="text-sm text-gray-600">Количество: {item.quantity} шт</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">₽{item.price.toLocaleString()} × {item.quantity}</p>
                        <p className="text-xl font-bold text-[#27265C]">₽{(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Итого</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">К отгрузке:</span>
                  <span className="font-semibold">₽{totalAvailable.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Предзаказ:</span>
                  <span className="font-semibold">₽{totalPreorder.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-[#27265C]">Всего:</span>
                  <span className="text-2xl font-bold text-[#27265C]">₽{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Icon name="Warehouse" size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Склад</p>
                  <p className="font-semibold text-[#27265C]">{order.warehouse}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="User" size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Менеджер</p>
                  <p className="font-semibold text-[#27265C]">{order.manager}</p>
                  <p className="text-sm text-blue-600">{order.managerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Calendar" size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Плановая отгрузка</p>
                  <p className="font-semibold text-[#27265C]">{order.delivery}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">История заказа</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.history.map((event, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#27265C] mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#27265C]">{event.event}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <p className="text-xs text-gray-500">{event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

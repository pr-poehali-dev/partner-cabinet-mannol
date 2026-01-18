import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface BackorderItem {
  id: string;
  orderId: string;
  orderDate: string;
  productName: string;
  productId: string;
  requestedQty: number;
  availableQty: number;
  estimatedDate: string;
  status: "Ожидание" | "Частично" | "Доступен";
  category: string;
}

const Backorders = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const backorders: BackorderItem[] = [
    {
      id: "BO-001",
      orderId: "ORD-2024-1244",
      orderDate: "14.12.2024",
      productName: "MANNOL 5W-30 API SN/CF",
      productId: "MAN-001",
      requestedQty: 100,
      availableQty: 50,
      estimatedDate: "22.12.2024",
      status: "Частично",
      category: "Моторные масла"
    },
    {
      id: "BO-002",
      orderId: "ORD-2024-1244",
      orderDate: "14.12.2024",
      productName: "MANNOL ATF AG52",
      productId: "MAN-002",
      requestedQty: 50,
      availableQty: 0,
      estimatedDate: "28.12.2024",
      status: "Ожидание",
      category: "Трансмиссионные масла"
    },
    {
      id: "BO-003",
      orderId: "ORD-2024-1240",
      orderDate: "10.12.2024",
      productName: "MANNOL Radiator Cleaner",
      productId: "MAN-003",
      requestedQty: 30,
      availableQty: 30,
      estimatedDate: "17.12.2024",
      status: "Доступен",
      category: "Автохимия"
    },
    {
      id: "BO-004",
      orderId: "ORD-2024-1238",
      orderDate: "08.12.2024",
      productName: "MANNOL 10W-40 EXTRA",
      productId: "MAN-004",
      requestedQty: 80,
      availableQty: 80,
      estimatedDate: "15.12.2024",
      status: "Доступен",
      category: "Моторные масла"
    }
  ];

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Доступен":
        return "bg-green-100 text-green-700";
      case "Частично":
        return "bg-orange-100 text-orange-700";
      case "Ожидание":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const waitingItems = backorders.filter(b => b.status === "Ожидание");
  const partialItems = backorders.filter(b => b.status === "Частично");
  const availableItems = backorders.filter(b => b.status === "Доступен");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Недопоставленный товар</h1>
          <p className="text-gray-600 mt-1">Товары, временно отсутствовавшие на складе</p>
        </div>
        {selectedItems.length > 0 && (
          <div className="flex gap-2">
            <Button 
              className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold"
              onClick={() => console.log('Add to order:', selectedItems)}
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить в заказ ({selectedItems.length})
            </Button>
            <Button 
              variant="destructive"
              onClick={() => console.log('Cancel:', selectedItems)}
            >
              <Icon name="X" size={18} className="mr-2" />
              Аннулировать
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="Clock" size={20} />
              Ожидают
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{waitingItems.length}</div>
            <p className="text-sm text-gray-500 mt-2">{waitingItems.reduce((sum, i) => sum + i.requestedQty, 0)} л всего</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="AlertCircle" size={20} />
              Частично
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{partialItems.length}</div>
            <p className="text-sm text-gray-500 mt-2">{partialItems.reduce((sum, i) => sum + i.availableQty, 0)} л доступно</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="CheckCircle" size={20} />
              Доступны
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{availableItems.length}</div>
            <p className="text-sm text-gray-500 mt-2">Готовы к отгрузке</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle className="text-[#27265C]">Список недопоставок</CardTitle>
              <CardDescription>Всего позиций: {backorders.length}</CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-[300px]">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Поиск по товару или заказу..." className="pl-10" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all">Все ({backorders.length})</TabsTrigger>
          <TabsTrigger value="waiting">Ожидают ({waitingItems.length})</TabsTrigger>
          <TabsTrigger value="partial">Частично ({partialItems.length})</TabsTrigger>
          <TabsTrigger value="available">Доступны ({availableItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {backorders.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer flex-shrink-0 mt-1 ${
                      selectedItems.includes(item.id) 
                        ? 'bg-[#FCC71E] border-[#FCC71E]' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {selectedItems.includes(item.id) && (
                      <Icon name="Check" size={14} className="text-[#27265C]" />
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#27265C]">{item.productName}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline" className="border-[#27265C] text-[#27265C]">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Артикул: {item.productId} • Заказ: {item.orderId} • Дата: {item.orderDate}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Запрошено</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Package" size={16} className="text-[#27265C]" />
                          <span className="font-semibold text-[#27265C]">{item.requestedQty} л</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Доступно</p>
                        <span className={`font-semibold ${
                          item.availableQty === 0 ? 'text-red-600' :
                          item.availableQty < item.requestedQty ? 'text-orange-600' :
                          'text-green-600'
                        }`}>{item.availableQty} л</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Ожидается</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} className="text-[#27265C]" />
                          <span className="font-semibold text-[#27265C]">{item.estimatedDate}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Прогресс</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.availableQty === 0 ? 'bg-red-500' :
                                item.availableQty < item.requestedQty ? 'bg-orange-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(item.availableQty / item.requestedQty) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#27265C]">
                            {Math.round((item.availableQty / item.requestedQty) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-40">
                    <Link to={`/product/${item.productId}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                      >
                        <Icon name="Eye" size={14} className="mr-2" />
                        Карточка
                      </Button>
                    </Link>
                    {item.status === "Доступен" && (
                      <Button 
                        size="sm"
                        className="w-full bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold"
                        onClick={() => toggleItem(item.id)}
                      >
                        <Icon name="Plus" size={14} className="mr-2" />
                        В заказ
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="w-full"
                    >
                      <Icon name="X" size={14} className="mr-2" />
                      Отменить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="waiting">
          <div className="text-center py-12 text-gray-500">
            Показываются товары со статусом "Ожидание"
          </div>
        </TabsContent>

        <TabsContent value="partial">
          <div className="text-center py-12 text-gray-500">
            Показываются товары со статусом "Частично"
          </div>
        </TabsContent>

        <TabsContent value="available">
          <div className="text-center py-12 text-gray-500">
            Показываются товары со статусом "Доступен"
          </div>
        </TabsContent>
      </Tabs>

      {backorders.filter(b => b.status === "Доступен").length > 0 && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="CheckCircle" size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">✅ Товары доступны для заказа!</h3>
                <p className="text-green-800 mb-4">
                  {availableItems.length} позиций теперь в наличии и готовы к отгрузке. 
                  Вы можете добавить их в новый заказ или текущий черновик.
                </p>
                <div className="flex gap-2">
                  <Link to="/order/new">
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Создать новый заказ
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                    <Icon name="FileText" size={18} className="mr-2" />
                    Добавить в черновик
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Backorders;

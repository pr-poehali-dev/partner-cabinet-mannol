import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const OrderNew = () => {
  const [cartItems, setCartItems] = useState([
    { id: "MAN-001", name: "MANNOL 5W-30 API SN/CF", quantity: 50, price: 1250, warehouse: "Склад 1" },
    { id: "MAN-004", name: "MANNOL 10W-40 EXTRA", quantity: 30, price: 1100, warehouse: "Склад 1" },
  ]);

  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [isDirectOrder, setIsDirectOrder] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const minOrderAmount = 50000;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Формирование заказа</h1>
          <p className="text-gray-600 mt-1">Создайте новый заказ товаров</p>
        </div>
        <Link to="/catalog">
          <Button variant="outline" className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            В каталог
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="manual">Ручное добавление</TabsTrigger>
          <TabsTrigger value="excel">Загрузка из Excel</TabsTrigger>
          <TabsTrigger value="api">Из системы 1С</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Корзина товаров</CardTitle>
              <CardDescription>Добавьте товары из каталога или введите артикулы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Введите артикул товара" className="flex-1" />
                <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-500">#{idx + 1}</span>
                        <h4 className="font-bold text-[#27265C]">{item.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">Артикул: {item.id} • {item.warehouse}</p>
                      <p className="text-sm font-semibold text-[#27265C]">Цена: ₽{item.price.toLocaleString()} за шт</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 10)}
                      >
                        <Icon name="Minus" size={14} />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 text-center font-bold"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 10)}
                      >
                        <Icon name="Plus" size={14} />
                      </Button>
                    </div>
                    <div className="text-right w-32">
                      <p className="text-xl font-bold text-[#27265C]">
                        ₽{(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Корзина пуста. Добавьте товары из каталога.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="excel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Загрузка заказа из Excel</CardTitle>
              <CardDescription>Загрузите файл Excel с артикулами и количеством товаров</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#27265C] transition-colors cursor-pointer">
                <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold text-[#27265C] mb-2">Перетащите файл или нажмите для выбора</h3>
                <p className="text-sm text-gray-600 mb-4">Поддерживается формат .xlsx, .xls</p>
                <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
                  <Icon name="FileSpreadsheet" size={18} className="mr-2" />
                  Выбрать файл
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-2">Формат файла Excel:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Колонка A: Артикул товара</li>
                      <li>Колонка B: Количество</li>
                      <li>Первая строка — заголовки</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                <Icon name="Download" size={18} className="mr-2" />
                Скачать шаблон Excel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Загрузка из системы 1С</CardTitle>
              <CardDescription>Импортируйте заказ напрямую из вашей системы учета</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-endpoint">API Endpoint системы 1С</Label>
                  <Input
                    id="api-endpoint"
                    placeholder="https://your-1c-system.ru/api/orders"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="api-key">API ключ</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Введите ваш API ключ"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="order-id">Номер заказа в 1С</Label>
                  <Input
                    id="order-id"
                    placeholder="ЗК-00001234"
                    className="mt-2"
                  />
                </div>

                <Button className="w-full bg-[#27265C] text-white hover:bg-[#27265C]/90">
                  <Icon name="Download" size={18} className="mr-2" />
                  Загрузить заказ из 1С
                </Button>
              </div>

              <Separator />

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-2">Преимущества интеграции с 1С:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Автоматическая синхронизация товаров</li>
                      <li>Актуальные цены и остатки</li>
                      <li>Выгрузка подтвержденных заказов обратно в 1С</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#27265C]">Параметры заказа</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Дата отгрузки</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Icon name="Calendar" size={18} className="mr-2" />
                    {deliveryDate ? format(deliveryDate, "PPP", { locale: ru }) : "Выберите дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon name="Truck" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#27265C]">Прямой заказ с завода</p>
                  <p className="text-sm text-gray-600">Доставка 10-14 дней, оптовые цены</p>
                </div>
              </div>
              <Button
                variant={isDirectOrder ? "default" : "outline"}
                onClick={() => setIsDirectOrder(!isDirectOrder)}
                className={isDirectOrder ? "bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90" : ""}
              >
                {isDirectOrder ? "Активно" : "Включить"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий к заказу</Label>
              <textarea
                id="comment"
                className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                placeholder="Добавьте комментарий или особые требования к заказу..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#27265C]">Итоги заказа</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Позиций в заказе:</span>
                <span className="font-semibold text-[#27265C]">{cartItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Всего товаров:</span>
                <span className="font-semibold text-[#27265C]">{totalItems} шт</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-[#27265C]">Сумма заказа:</span>
                <span className="text-2xl font-bold text-[#27265C]">₽{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {totalAmount < minOrderAmount && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <Icon name="AlertCircle" size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold">Минимальная сумма заказа</p>
                    <p className="mt-1">Добавьте товаров еще на ₽{(minOrderAmount - totalAmount).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {isDirectOrder && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <Icon name="Info" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Прямой заказ</p>
                    <p className="mt-1">Ваш заказ будет отправлен на завод для согласования</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-bold text-lg h-12"
              disabled={cartItems.length === 0 || totalAmount < minOrderAmount}
            >
              <Icon name="CheckCircle" size={20} className="mr-2" />
              Отправить на согласование
            </Button>

            <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить черновик
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderNew;

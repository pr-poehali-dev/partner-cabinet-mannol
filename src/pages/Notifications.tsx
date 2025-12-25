import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  type: "order" | "shipment" | "system" | "promo";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionLink?: string;
  actionLabel?: string;
}

const Notifications = () => {
  const [dismissedPromotions, setDismissedPromotions] = useState<string[]>([]);

  const promotions = [
    {
      id: "promo-banner-1",
      title: "🎉 Спецпредложение: Скидка 15% на моторные масла",
      description: "Оформите заказ на моторные масла MANNOL и получите скидку 15% на весь ассортимент! Минимальный заказ: 100 литров.",
      validUntil: "31.12.2024",
      link: "/catalog",
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      id: "promo-banner-2",
      title: "🚚 Бесплатная доставка при заказе от 50 000₽",
      description: "Сделайте заказ на сумму от 50 000 рублей и получите бесплатную доставку по Москве и МО.",
      validUntil: "25.12.2024",
      link: "/order/new",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      id: "promo-banner-3",
      title: "⭐ Акция: 3 по цене 2 на автохимию",
      description: "При покупке 3 единиц автохимии, третья в подарок! Акция действует на все позиции раздела.",
      validUntil: "20.12.2024",
      link: "/catalog",
      color: "bg-gradient-to-r from-orange-500 to-red-500"
    }
  ];

  const activePromotions = promotions.filter(p => !dismissedPromotions.includes(p.id));

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "Заказ подтвержден",
      message: "Заказ ORD-2024-1250 подтвержден и готов к отгрузке 22.12.2024",
      time: "5 минут назад",
      isRead: false,
      actionLink: "/orders",
      actionLabel: "Посмотреть заказ"
    },
    {
      id: "2",
      type: "shipment",
      title: "Отгрузка завершена",
      message: "Заказ ORD-2024-1246 отгружен со склада. ТТН: 12345678901234",
      time: "2 часа назад",
      isRead: false,
      actionLink: "/orders",
      actionLabel: "Скачать документы"
    },
    {
      id: "3",
      type: "promo",
      title: "Специальное предложение",
      message: "Скидка 15% на моторные масла MANNOL 5W-30 при заказе от 100 литров",
      time: "4 часа назад",
      isRead: true,
      actionLink: "/catalog",
      actionLabel: "В каталог"
    },
    {
      id: "4",
      type: "system",
      title: "Обновление остатков",
      message: "Остатки на складе обновлены. Доступны новые позиции в каталоге.",
      time: "6 часов назад",
      isRead: true,
      actionLink: "/catalog",
      actionLabel: "Посмотреть каталог"
    },
    {
      id: "5",
      type: "order",
      title: "Требуется согласование",
      message: "Прямой заказ ORD-2024-1244 требует вашего подтверждения",
      time: "8 часов назад",
      isRead: false,
      actionLink: "/orders",
      actionLabel: "Согласовать"
    },
    {
      id: "6",
      type: "shipment",
      title: "График отгрузок изменен",
      message: "Отгрузка заказа ORD-2024-1245 перенесена на 19.12.2024",
      time: "1 день назад",
      isRead: true,
      actionLink: "/schedule",
      actionLabel: "График отгрузок"
    },
    {
      id: "7",
      type: "order",
      title: "Заказ доставлен",
      message: "Заказ ORD-2024-1243 успешно доставлен и подписан",
      time: "2 дня назад",
      isRead: true,
      actionLink: "/orders",
      actionLabel: "Посмотреть"
    },
    {
      id: "8",
      type: "promo",
      title: "Новинка в каталоге",
      message: "Добавлена новая линейка масел MANNOL MOLIBDEN BENZIN 10W-40",
      time: "3 дня назад",
      isRead: true,
      actionLink: "/catalog",
      actionLabel: "Узнать больше"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return "ShoppingCart";
      case "shipment": return "Truck";
      case "system": return "Settings";
      case "promo": return "Sparkles";
      default: return "Bell";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order": return "bg-blue-100 text-blue-600";
      case "shipment": return "bg-green-100 text-green-600";
      case "system": return "bg-gray-100 text-gray-600";
      case "promo": return "bg-[#FCC71E] text-[#27265C]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "order": return "Заказы";
      case "shipment": return "Отгрузки";
      case "system": return "Система";
      case "promo": return "Акции";
      default: return "Прочее";
    }
  };

  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const orderCount = notifications.filter(n => n.type === "order").length;
  const shipmentCount = notifications.filter(n => n.type === "shipment").length;
  const promoCount = notifications.filter(n => n.type === "promo").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Уведомления и акции</h1>
          <p className="text-gray-600 mt-1">
            Активных акций: {activePromotions.length} • Непрочитанных: {unreadCount}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Icon name="CheckCheck" size={18} className="mr-2" />
            Прочитать все
          </Button>
        </div>
      </div>

      {activePromotions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-yellow-500" />
            <h2 className="text-lg font-bold text-[#27265C]">Закреплённые акции</h2>
          </div>
          {activePromotions.map(promo => (
            <Card key={promo.id} className={`border-2 ${promo.color} text-white overflow-hidden hover:shadow-xl transition-all animate-fade-in`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Gift" size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                        <p className="text-white/90 text-sm leading-relaxed">{promo.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
                        <Icon name="Clock" size={16} />
                        <span className="text-sm font-semibold">Действует до {promo.validUntil}</span>
                      </div>
                      <Link to={promo.link}>
                        <Button className="bg-white text-[#27265C] hover:bg-white/90 font-semibold">
                          <Icon name="ArrowRight" size={16} className="mr-2" />
                          Подробнее
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDismissedPromotions([...dismissedPromotions, promo.id])}
                    className="text-white hover:bg-white/20 flex-shrink-0"
                    title="Скрыть на этот сеанс"
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator className="my-6" />

      <div>
        <h2 className="text-lg font-bold text-[#27265C] mb-4">Обычные уведомления</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск по уведомлениям..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-100 w-full justify-start">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Icon name="Bell" size={16} />
            Все ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <Icon name="BellDot" size={16} />
            Непрочитанные ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="order" className="flex items-center gap-2">
            <Icon name="ShoppingCart" size={16} />
            Заказы ({orderCount})
          </TabsTrigger>
          <TabsTrigger value="shipment" className="flex items-center gap-2">
            <Icon name="Truck" size={16} />
            Отгрузки ({shipmentCount})
          </TabsTrigger>
          <TabsTrigger value="promo" className="flex items-center gap-2">
            <Icon name="Sparkles" size={16} />
            Акции ({promoCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="Bell" size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Нет уведомлений</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md animate-fade-in ${
                  !notification.isRead ? 'border-l-4 border-l-[#FCC71E] bg-yellow-50/30' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                      <Icon name={getTypeIcon(notification.type) as any} size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-bold text-[#27265C] ${!notification.isRead ? 'text-lg' : ''}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <Badge className="bg-[#FCC71E] text-[#27265C] text-xs">
                              Новое
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getTypeBadge(notification.type)}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {notification.actionLink && (
                          <Link to={notification.actionLink}>
                            <Button
                              size="sm"
                              className="bg-[#27265C] text-white hover:bg-[#27265C]/90"
                              onClick={() => markAsRead(notification.id)}
                            >
                              {notification.actionLabel}
                              <Icon name="ArrowRight" size={14} className="ml-2" />
                            </Button>
                          </Link>
                        )}
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Icon name="Check" size={14} className="mr-2" />
                            Прочитано
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Icon name="Trash2" size={14} className="mr-2" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3 mt-6">
          {filteredNotifications.filter(n => !n.isRead).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="font-bold text-[#27265C] mb-2">Всё прочитано!</h3>
                <p className="text-gray-500">У вас нет непрочитанных уведомлений</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.filter(n => !n.isRead).map((notification) => (
              <Card
                key={notification.id}
                className="border-l-4 border-l-[#FCC71E] bg-yellow-50/30 transition-all hover:shadow-md animate-fade-in"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                      <Icon name={getTypeIcon(notification.type) as any} size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#27265C] text-lg">
                            {notification.title}
                          </h3>
                          <Badge className="bg-[#FCC71E] text-[#27265C] text-xs">
                            Новое
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {notification.actionLink && (
                          <Link to={notification.actionLink}>
                            <Button
                              size="sm"
                              className="bg-[#27265C] text-white hover:bg-[#27265C]/90"
                              onClick={() => markAsRead(notification.id)}
                            >
                              {notification.actionLabel}
                              <Icon name="ArrowRight" size={14} className="ml-2" />
                            </Button>
                          </Link>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Icon name="Check" size={14} className="mr-2" />
                          Прочитано
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="order" className="space-y-3 mt-6">
          {filteredNotifications.filter(n => n.type === "order").map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md animate-fade-in ${
                !notification.isRead ? 'border-l-4 border-l-[#FCC71E] bg-yellow-50/30' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                    <Icon name={getTypeIcon(notification.type) as any} size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold text-[#27265C] ${!notification.isRead ? 'text-lg' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge className="bg-[#FCC71E] text-[#27265C] text-xs">
                            Новое
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {notification.actionLink && (
                        <Link to={notification.actionLink}>
                          <Button
                            size="sm"
                            className="bg-[#27265C] text-white hover:bg-[#27265C]/90"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.actionLabel}
                            <Icon name="ArrowRight" size={14} className="ml-2" />
                          </Button>
                        </Link>
                      )}
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Icon name="Check" size={14} className="mr-2" />
                          Прочитано
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="shipment" className="space-y-3 mt-6">
          {filteredNotifications.filter(n => n.type === "shipment").map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md animate-fade-in ${
                !notification.isRead ? 'border-l-4 border-l-[#FCC71E] bg-yellow-50/30' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                    <Icon name={getTypeIcon(notification.type) as any} size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold text-[#27265C] ${!notification.isRead ? 'text-lg' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge className="bg-[#FCC71E] text-[#27265C] text-xs">
                            Новое
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {notification.actionLink && (
                        <Link to={notification.actionLink}>
                          <Button
                            size="sm"
                            className="bg-[#27265C] text-white hover:bg-[#27265C]/90"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.actionLabel}
                            <Icon name="ArrowRight" size={14} className="ml-2" />
                          </Button>
                        </Link>
                      )}
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Icon name="Check" size={14} className="mr-2" />
                          Прочитано
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="promo" className="space-y-3 mt-6">
          {filteredNotifications.filter(n => n.type === "promo").map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md animate-fade-in ${
                !notification.isRead ? 'border-l-4 border-l-[#FCC71E] bg-yellow-50/30' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                    <Icon name={getTypeIcon(notification.type) as any} size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold text-[#27265C] ${!notification.isRead ? 'text-lg' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge className="bg-[#FCC71E] text-[#27265C] text-xs">
                            Новое
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {notification.actionLink && (
                        <Link to={notification.actionLink}>
                          <Button
                            size="sm"
                            className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.actionLabel}
                            <Icon name="ArrowRight" size={14} className="ml-2" />
                          </Button>
                        </Link>
                      )}
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Icon name="Check" size={14} className="mr-2" />
                          Прочитано
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Separator />

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Icon name="Settings" size={24} className="text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Настройка уведомлений</h3>
              <p className="text-sm text-blue-800 mb-4">
                Вы можете настроить, какие уведомления хотите получать и каким способом
              </p>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
                <Icon name="Settings" size={16} className="mr-2" />
                Настроить уведомления
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
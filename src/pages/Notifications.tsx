import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import PromotionBanner from "@/components/notifications/PromotionBanner";
import NotificationList from "@/components/notifications/NotificationList";

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

      <PromotionBanner
        promotions={activePromotions}
        onDismiss={(id) => setDismissedPromotions([...dismissedPromotions, id])}
      />

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

      <NotificationList
        notifications={filteredNotifications}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        getTypeIcon={getTypeIcon}
        getTypeColor={getTypeColor}
        getTypeBadge={getTypeBadge}
      />
    </div>
  );
};

export default Notifications;

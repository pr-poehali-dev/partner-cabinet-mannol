import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import NotificationCard from "./NotificationCard";

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

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getTypeIcon: (type: string) => string;
  getTypeColor: (type: string) => string;
  getTypeBadge: (type: string) => string;
}

const NotificationList = ({
  notifications,
  onMarkAsRead,
  onDelete,
  getTypeIcon,
  getTypeColor,
  getTypeBadge
}: NotificationListProps) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const orderCount = notifications.filter(n => n.type === "order").length;
  const shipmentCount = notifications.filter(n => n.type === "shipment").length;
  const promoCount = notifications.filter(n => n.type === "promo").length;

  const renderNotifications = (filterFn: (n: Notification) => boolean) => {
    const filtered = notifications.filter(filterFn);
    
    if (filtered.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="Bell" size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Нет уведомлений</p>
          </CardContent>
        </Card>
      );
    }

    return filtered.map((notification) => (
      <NotificationCard
        key={notification.id}
        notification={notification}
        onMarkAsRead={onMarkAsRead}
        onDelete={onDelete}
        getTypeIcon={getTypeIcon}
        getTypeColor={getTypeColor}
        getTypeBadge={getTypeBadge}
      />
    ));
  };

  return (
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
        {renderNotifications(() => true)}
      </TabsContent>

      <TabsContent value="unread" className="space-y-3 mt-6">
        {renderNotifications(n => !n.isRead)}
      </TabsContent>

      <TabsContent value="order" className="space-y-3 mt-6">
        {renderNotifications(n => n.type === "order")}
      </TabsContent>

      <TabsContent value="shipment" className="space-y-3 mt-6">
        {renderNotifications(n => n.type === "shipment")}
      </TabsContent>

      <TabsContent value="promo" className="space-y-3 mt-6">
        {renderNotifications(n => n.type === "promo")}
      </TabsContent>
    </Tabs>
  );
};

export default NotificationList;

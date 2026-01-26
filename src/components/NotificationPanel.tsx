import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  type: "order" | "payment" | "system" | "promotion";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationPanel = ({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationPanelProps) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return "Package";
      case "payment":
        return "CreditCard";
      case "promotion":
        return "Tag";
      case "system":
        return "Bell";
      default:
        return "Bell";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-600 bg-blue-50";
      case "payment":
        return "text-green-600 bg-green-50";
      case "promotion":
        return "text-purple-600 bg-purple-50";
      case "system":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#27265C]">Уведомления</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-sm text-[#27265C] hover:text-[#27265C]/80"
          >
            Прочитать все
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Icon name="Bell" size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Нет уведомлений</p>
            <p className="text-sm text-gray-400 mt-1">
              Здесь будут отображаться важные уведомления
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    <Icon name={getNotificationIcon(notification.type)} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[#27265C] text-sm">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{notification.time}</span>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead?.(notification.id)}
                            className="h-7 text-xs text-[#27265C]"
                          >
                            <Icon name="Check" size={14} className="mr-1" />
                            Прочитано
                          </Button>
                        )}
                        {notification.link && (
                          <Link to={notification.link}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-[#27265C]"
                            >
                              Открыть
                              <Icon name="ChevronRight" size={14} className="ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />
      
      <div className="p-4">
        <Link to="/notifications">
          <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
            Все уведомления
            <Icon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotificationPanel;

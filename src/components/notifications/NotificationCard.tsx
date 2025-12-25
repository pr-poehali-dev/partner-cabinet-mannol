import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getTypeIcon: (type: string) => string;
  getTypeColor: (type: string) => string;
  getTypeBadge: (type: string) => string;
}

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  getTypeIcon,
  getTypeColor,
  getTypeBadge
}: NotificationCardProps) => {
  return (
    <Card
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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-[#27265C]">{notification.title}</h4>
                  {!notification.isRead && (
                    <Badge className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90">
                      Новое
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="border-[#27265C] text-[#27265C] text-xs">
                  {getTypeBadge(notification.type)}
                </Badge>
              </div>
              <div className="flex gap-1">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-[#27265C] hover:bg-[#27265C] hover:text-white"
                    title="Отметить прочитанным"
                  >
                    <Icon name="Check" size={16} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(notification.id)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                  title="Удалить"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {notification.message}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Icon name="Clock" size={14} />
                <span>{notification.time}</span>
              </div>

              {notification.actionLink && notification.actionLabel && (
                <Link to={notification.actionLink}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                  >
                    {notification.actionLabel}
                    <Icon name="ArrowRight" size={14} className="ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;

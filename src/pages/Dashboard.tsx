import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const mainStats = [
    { 
      title: "Активные заказы", 
      value: "12", 
      description: "В работе сейчас — в пределах нормы",
      icon: "CheckCircle2", 
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      status: "Всё время сегодня в срок",
      statusColor: "text-emerald-600",
      link: "/orders" 
    },
    { 
      title: "На складе", 
      value: "847", 
      description: "позиций в наличии — хватает",
      icon: "Package", 
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      status: "Товары в наличии, можно заказывать",
      statusColor: "text-blue-600",
      link: "/catalog" 
    },
    { 
      title: "Сумма заказов", 
      value: "₽2,4М", 
      description: "за месяц",
      icon: "TrendingUp", 
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      trend: "+5,5%",
      status: "На 15% больше, чем в прошлом месяце",
      statusColor: "text-rose-600",
      link: "/analytics" 
    },
  ];

  const additionalInfo = [
    {
      icon: "Clock",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      text: "Всё время сегодня в срок",
      link: "/orders"
    },
    {
      icon: "Package",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      text: "Товары по унита",
      subtext: "заказано",
      link: "/backorders"
    },
    {
      icon: "AlertCircle",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      text: "Програзов в 6 регионах",
      link: "/backorders"
    }
  ];

  const recentOrders = [
    { id: "ORD-2026-0198", date: "от 15 февраля", status: "Требует согласования", statusColor: "bg-orange-100 text-orange-700", amount: "₽2,458,900" },
    { id: "ORD-2026-0195", date: "от 14 февраля", status: "Подтверждён", statusColor: "bg-green-100 text-green-700", amount: "₽1,320,000" },
    { id: "ORD-2026-0192", date: "от 12 февраля", status: "Отправлен", statusColor: "bg-blue-100 text-blue-700", amount: "₽890,400" },
  ];

  const notifications = [
    {
      id: 1,
      priority: "high",
      icon: "AlertCircle",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      title: "Просроченная задолженность!",
      description: "Оплатите счета на сумму ₽410,000 до 30 апреля, чтобы избежать блокировки отгрузок",
      tag: "эк рисков.",
      actionText: "Оплатить счета",
      actionLink: "/payments",
      detailsLink: "/debt-details"
    },
    {
      id: 2,
      priority: "info",
      icon: "Truck",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "Бесплатная доставка при заказе от ₽100,000",
      description: "Доступна по вашему региону, воспользуйтесь выгодными условиями",
      actionText: "Все уведомления",
      actionLink: "/notifications",
      detailsLink: "/notifications"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Личный кабинет партнера</h1>
          <p className="text-gray-600 mt-1">Добрый день! Готовы к новым заказам MANNOL?</p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#27265C] mb-2">Создать новый заказ</h2>
              <Link to="/order/new">
                <Button className="bg-[#FCC71E] hover:bg-[#FCC71E]/90 text-[#27265C] font-semibold px-8 py-6 text-base mt-4">
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  Создать новый заказ
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://cdn.poehali.dev/projects/5fb2cde2-4a6e-45ad-96cc-fea77357ddc8/bucket/242f1f87-ca29-40a8-881c-509c272c8e5b.png" 
                alt="MANNOL Products" 
                className="h-32 object-contain"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mainStats.map((stat, idx) => (
          <Link key={idx} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                      <Icon name={stat.icon} className={stat.iconColor} size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold text-[#27265C]">{stat.value}</span>
                        {stat.trend && (
                          <span className="text-sm font-semibold text-emerald-600">{stat.trend}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Icon name="MessageCircle" size={20} className="text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">{stat.description}</span>
                </p>
                <p className={`text-xs ${stat.statusColor}`}>{stat.status}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {additionalInfo.map((info, idx) => (
          <Link key={idx} to={info.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${info.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={info.icon} className={info.iconColor} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{info.text}</p>
                    {info.subtext && (
                      <p className="text-xs text-gray-500">{info.subtext}</p>
                    )}
                  </div>
                  <Icon name="ChevronRight" size={18} className="text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#27265C]">Последние заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order, idx) => (
                <Link key={idx} to={`/order/${order.id}`}>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <p className="font-semibold text-[#27265C]">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                      <Badge className={`${order.statusColor} text-xs`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-[#27265C] text-lg">{order.amount}</p>
                      <Icon name="ChevronRight" size={18} className="text-gray-400 ml-auto" />
                    </div>
                  </div>
                </Link>
              ))}
              <div className="pt-2 flex gap-2">
                <Link to="/catalog" className="flex-1">
                  <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                    Каталог товаров
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/catalog" className="flex-1">
                  <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                    Рекомендации
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#27265C]">Важные уведомления</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 rounded-lg ${notif.priority === 'high' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-lg ${notif.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon name={notif.icon} className={notif.iconColor} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <Badge variant="destructive" className="text-xs bg-red-600 shrink-0">
                          {notif.id}
                        </Badge>
                        <h3 className="font-semibold text-[#27265C] text-sm">{notif.title}</h3>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{notif.description}</p>
                      {notif.tag && (
                        <div className="flex items-center gap-2 mb-3">
                          <Icon name="Star" size={14} className="text-amber-500" />
                          <span className="text-xs text-gray-600">{notif.tag}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link to={notif.actionLink}>
                          <Button 
                            size="sm" 
                            className={`${notif.priority === 'high' ? 'bg-[#FCC71E] hover:bg-[#FCC71E]/90 text-[#27265C]' : 'bg-[#27265C] hover:bg-[#27265C]/90 text-white'} font-semibold`}
                          >
                            {notif.actionText}
                            <Icon name="ArrowRight" size={14} className="ml-1" />
                          </Button>
                        </Link>
                        <Link to={notif.detailsLink}>
                          <Button size="sm" variant="ghost" className="text-gray-600 hover:text-[#27265C]">
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/notifications">
                <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                  Все уведомления
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
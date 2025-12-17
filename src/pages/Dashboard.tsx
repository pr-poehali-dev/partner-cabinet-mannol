import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    { title: "Активные заказы", value: "12", icon: "ShoppingCart", trend: "+2 сегодня" },
    { title: "На складе позиций", value: "847", icon: "Package", trend: "95% в наличии" },
    { title: "Сумма заказов", value: "₽2.4М", icon: "TrendingUp", trend: "+18% к прошлому месяцу" },
    { title: "Новинки", value: "23", icon: "Sparkles", trend: "Добавлено за неделю" },
  ];

  const recentOrders = [
    { id: "ORD-2024-1247", date: "17.12.2024", status: "В обработке", amount: "₽124,500" },
    { id: "ORD-2024-1246", date: "16.12.2024", status: "Отгружен", amount: "₽89,200" },
    { id: "ORD-2024-1245", date: "15.12.2024", status: "Доставлен", amount: "₽156,800" },
  ];

  const recommendations = [
    { product: "MANNOL 5W-30 API SN/CF", stock: 5, reason: "Низкий остаток", action: "Пополнить" },
    { product: "MANNOL ATF AG52", stock: 12, reason: "Популярный товар", action: "Заказать" },
    { product: "MANNOL Radiator Cleaner", stock: 0, reason: "Закончился", action: "Срочно" },
  ];

  const quickActions = [
    { title: "Создать заказ", icon: "Plus", link: "/order/new", color: "bg-[#FCC71E]" },
    { title: "Каталог товаров", icon: "Package", link: "/catalog", color: "bg-[#27265C]" },
    { title: "Мои заказы", icon: "FileText", link: "/orders", color: "bg-[#27265C]" },
    { title: "График отгрузок", icon: "Calendar", link: "/schedule", color: "bg-[#27265C]" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#27265C]">Панель управления</h1>
        <p className="text-gray-600 mt-1">Добро пожаловать в личный кабинет партнера MANNOL</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-[#27265C] flex items-center justify-center">
                <Icon name={stat.icon as any} className="text-white" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#27265C]">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Link key={idx} to={action.link}>
            <Button 
              className={`w-full h-24 ${action.color} text-white hover:opacity-90 transition-opacity flex flex-col gap-2`}
            >
              <Icon name={action.icon as any} size={28} />
              <span className="font-semibold">{action.title}</span>
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#27265C]">Последние заказы</CardTitle>
            <CardDescription>Ваши недавние заказы и их статусы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-[#27265C]">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-[#27265C]">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Доставлен" ? "bg-green-100 text-green-700" :
                      order.status === "Отгружен" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              <Link to="/orders">
                <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                  Все заказы
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#27265C]">Рекомендации</CardTitle>
            <CardDescription>Товары требующие внимания</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1 flex-1">
                    <p className="font-semibold text-[#27265C] text-sm">{rec.product}</p>
                    <p className="text-xs text-gray-500">Остаток: {rec.stock} шт • {rec.reason}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className={`${rec.stock === 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-[#FCC71E] hover:bg-[#FCC71E]/90'} text-[#27265C] font-semibold`}
                  >
                    {rec.action}
                  </Button>
                </div>
              ))}
              <Link to="/catalog">
                <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                  Перейти в каталог
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

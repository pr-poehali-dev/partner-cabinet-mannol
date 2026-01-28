import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const [periodFilter, setPeriodFilter] = useState("year");

  const monthlyOrders = [
    { month: "Янв", orders: 45, revenue: 2450000, plan: 2000000 },
    { month: "Фев", orders: 52, revenue: 2680000, plan: 2000000 },
    { month: "Мар", orders: 48, revenue: 2520000, plan: 2000000 },
    { month: "Апр", orders: 55, revenue: 2850000, plan: 2500000 },
    { month: "Май", orders: 62, revenue: 3120000, plan: 2500000 },
    { month: "Июн", orders: 58, revenue: 2980000, plan: 2500000 },
    { month: "Июл", orders: 51, revenue: 2650000, plan: 2500000 },
    { month: "Авг", orders: 60, revenue: 3080000, plan: 2500000 },
    { month: "Сен", orders: 57, revenue: 2920000, plan: 2500000 },
    { month: "Окт", orders: 64, revenue: 3250000, plan: 3000000 },
    { month: "Ноя", orders: 59, revenue: 3050000, plan: 3000000 },
    { month: "Дек", orders: 42, revenue: 2400000, plan: 3000000 },
  ];

  const categoryData = [
    { name: "Моторные масла", value: 58, amount: 14500000, color: "#3b82f6" },
    { name: "Трансмиссионные", value: 20, amount: 5000000, color: "#10b981" },
    { name: "Антифризы", value: 12, amount: 3000000, color: "#8b5cf6" },
    { name: "Автохимия", value: 6, amount: 1500000, color: "#f59e0b" },
    { name: "Фильтры", value: 4, amount: 1000000, color: "#ef4444" },
  ];

  const topProducts = [
    { 
      id: 1,
      name: "MANNOL 5W-30 API SN/CF", 
      orders: 245, 
      units: 4900,
      revenue: 6125000,
      trend: "+18%",
      trendUp: true
    },
    { 
      id: 2,
      name: "MANNOL 10W-40 EXTRA", 
      orders: 198, 
      units: 3960,
      revenue: 4356000,
      trend: "+12%",
      trendUp: true
    },
    { 
      id: 3,
      name: "MANNOL ATF AG52", 
      orders: 156, 
      units: 3120,
      revenue: 3057600,
      trend: "+8%",
      trendUp: true
    },
    { 
      id: 4,
      name: "MANNOL Antifreeze AG11", 
      orders: 142, 
      units: 2840,
      revenue: 1846000,
      trend: "-3%",
      trendUp: false
    },
    { 
      id: 5,
      name: "MANNOL 0W-20 Longlife", 
      orders: 128, 
      units: 2560,
      revenue: 3712000,
      trend: "+25%",
      trendUp: true
    },
  ];

  const quarterlyComparison = [
    { quarter: "Q1 2023", revenue: 7650000 },
    { quarter: "Q2 2023", revenue: 8920000 },
    { quarter: "Q3 2023", revenue: 8450000 },
    { quarter: "Q4 2023", revenue: 9180000 },
    { quarter: "Q1 2024", revenue: 8880000 },
    { quarter: "Q2 2024", revenue: 9750000 },
    { quarter: "Q3 2024", revenue: 9350000 },
    { quarter: "Q4 2024", revenue: 10120000 },
  ];

  const kpiStats = [
    {
      title: "Общая выручка",
      value: "₽28,4М",
      change: "+15,2%",
      isPositive: true,
      icon: "TrendingUp",
      description: "За последние 12 месяцев",
      color: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      title: "Средний чек",
      value: "₽48,650",
      change: "+8,5%",
      isPositive: true,
      icon: "DollarSign",
      description: "Средняя сумма заказа",
      color: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Всего заказов",
      value: "584",
      change: "+6,2%",
      isPositive: true,
      icon: "ShoppingCart",
      description: "За текущий год",
      color: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Выполнение плана",
      value: "94%",
      change: "-6%",
      isPositive: false,
      icon: "Target",
      description: "От годового плана",
      color: "bg-amber-50",
      iconColor: "text-amber-600"
    },
  ];

  const salesPlan = {
    year: {
      plan: 30000000,
      fact: 28400000,
      percent: 94.7,
    },
    quarter: {
      plan: 10000000,
      fact: 10120000,
      percent: 101.2,
    },
    month: {
      plan: 3000000,
      fact: 2400000,
      percent: 80.0,
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-[#27265C] mb-2">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₽{(entry.value / 1000000).toFixed(2)}М
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Аналитика и отчёты</h1>
          <p className="text-gray-600 mt-1">Подробная статистика продаж и эффективности</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={periodFilter === "month" ? "default" : "outline"}
            onClick={() => setPeriodFilter("month")}
            className={periodFilter === "month" ? "bg-[#27265C]" : ""}
          >
            Месяц
          </Button>
          <Button 
            variant={periodFilter === "quarter" ? "default" : "outline"}
            onClick={() => setPeriodFilter("quarter")}
            className={periodFilter === "quarter" ? "bg-[#27265C]" : ""}
          >
            Квартал
          </Button>
          <Button 
            variant={periodFilter === "year" ? "default" : "outline"}
            onClick={() => setPeriodFilter("year")}
            className={periodFilter === "year" ? "bg-[#27265C]" : ""}
          >
            Год
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon name={stat.icon as any} className={stat.iconColor} size={24} />
                </div>
                <Badge 
                  variant={stat.isPositive ? "default" : "destructive"}
                  className={stat.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}
                >
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-[#27265C] mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className={`${salesPlan.month.percent >= 100 ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500'}`}>
          <CardHeader>
            <CardTitle className="text-lg text-[#27265C] flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              Декабрь 2024
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">План</span>
              <span className="font-semibold">₽{(salesPlan.month.plan / 1000000).toFixed(1)}М</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Факт</span>
              <span className="font-semibold text-[#27265C]">₽{(salesPlan.month.fact / 1000000).toFixed(1)}М</span>
            </div>
            <Progress value={salesPlan.month.percent} className="h-2" />
            <p className="text-xs text-gray-500 text-center">{salesPlan.month.percent}% выполнения</p>
          </CardContent>
        </Card>

        <Card className={`${salesPlan.quarter.percent >= 100 ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500'}`}>
          <CardHeader>
            <CardTitle className="text-lg text-[#27265C] flex items-center gap-2">
              <Icon name="BarChart3" size={18} />
              Q4 2024
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">План</span>
              <span className="font-semibold">₽{(salesPlan.quarter.plan / 1000000).toFixed(1)}М</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Факт</span>
              <span className="font-semibold text-emerald-600">₽{(salesPlan.quarter.fact / 1000000).toFixed(1)}М</span>
            </div>
            <Progress value={salesPlan.quarter.percent} className="h-2" />
            <p className="text-xs text-emerald-600 text-center font-semibold">{salesPlan.quarter.percent}% — План перевыполнен!</p>
          </CardContent>
        </Card>

        <Card className={`${salesPlan.year.percent >= 100 ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500'}`}>
          <CardHeader>
            <CardTitle className="text-lg text-[#27265C] flex items-center gap-2">
              <Icon name="TrendingUp" size={18} />
              Год 2024
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">План</span>
              <span className="font-semibold">₽{(salesPlan.year.plan / 1000000).toFixed(1)}М</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Факт</span>
              <span className="font-semibold text-[#27265C]">₽{(salesPlan.year.fact / 1000000).toFixed(1)}М</span>
            </div>
            <Progress value={salesPlan.year.percent} className="h-2" />
            <p className="text-xs text-gray-500 text-center">{salesPlan.year.percent}% выполнения</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#27265C] flex items-center gap-2">
            <Icon name="LineChart" size={22} />
            Динамика заказов за 2024 год
          </CardTitle>
          <CardDescription>
            Сравнение плановых и фактических показателей продаж по месяцам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyOrders}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27265C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#27265C" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPlan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FCC71E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FCC71E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₽${(value / 1000000).toFixed(1)}М`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="plan" 
                stroke="#FCC71E" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPlan)" 
                name="План"
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#27265C" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name="Выручка"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#27265C] flex items-center gap-2">
              <Icon name="PieChart" size={22} />
              Структура продаж по категориям
            </CardTitle>
            <CardDescription>
              Распределение выручки по группам товаров
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any, props: any) => [
                      `${value}% (₽${(props.payload.amount / 1000000).toFixed(1)}М)`,
                      props.payload.name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 w-full lg:w-auto">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#27265C]">{cat.name}</p>
                      <p className="text-xs text-gray-500">
                        {cat.value}% • ₽{(cat.amount / 1000000).toFixed(1)}М
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#27265C] flex items-center gap-2">
              <Icon name="BarChart2" size={22} />
              Рост по кварталам
            </CardTitle>
            <CardDescription>
              Сравнение показателей 2023 и 2024 года
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quarterlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="quarter" 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₽${(value / 1000000).toFixed(1)}М`}
                />
                <Tooltip 
                  formatter={(value: any) => `₽${(value / 1000000).toFixed(2)}М`}
                  labelStyle={{ color: '#27265C', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#27265C" 
                  radius={[8, 8, 0, 0]}
                  name="Выручка"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#27265C] flex items-center gap-2">
                <Icon name="Award" size={22} />
                ТОП-5 продуктов
              </CardTitle>
              <CardDescription>
                Самые популярные товары за текущий год
              </CardDescription>
            </div>
            <Link to="/catalog">
              <Button variant="outline" className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                Весь каталог
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div 
                key={product.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                  idx === 0 ? 'bg-amber-500' : 
                  idx === 1 ? 'bg-gray-400' : 
                  idx === 2 ? 'bg-amber-700' : 'bg-gray-300'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#27265C] mb-1">{product.name}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{product.orders} заказов</span>
                    <span>•</span>
                    <span>{product.units.toLocaleString()} шт</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#27265C] text-lg">
                    ₽{(product.revenue / 1000000).toFixed(1)}М
                  </p>
                  <Badge 
                    variant={product.trendUp ? "default" : "destructive"}
                    className={product.trendUp ? "bg-emerald-100 text-emerald-700 text-xs" : "bg-red-100 text-red-700 text-xs"}
                  >
                    {product.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link to="/orders" className="flex-1">
          <Button className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white py-6">
            <Icon name="FileText" size={20} className="mr-2" />
            Все заказы
          </Button>
        </Link>
        <Link to="/catalog" className="flex-1">
          <Button className="w-full bg-[#FCC71E] hover:bg-[#FCC71E]/90 text-[#27265C] py-6">
            <Icon name="Package" size={20} className="mr-2" />
            Перейти в каталог
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Analytics;

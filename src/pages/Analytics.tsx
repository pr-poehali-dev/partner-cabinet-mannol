import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Analytics = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const skuRating = {
    totalSKU: 450,
    orderedSKU: 287,
    percentage: 64,
    rank: 12,
    totalPartners: 45
  };

  const neverOrderedCategories = [
    {
      id: "synthetic",
      name: "Синтетические масла",
      count: 12,
      products: [
        { id: "MAN-101", name: "MANNOL 0W-20 Longlife", viscosity: "0W-20", price: 1450 },
        { id: "MAN-102", name: "MANNOL 5W-20 Elite", viscosity: "5W-20", price: 1380 },
        { id: "MAN-103", name: "MANNOL 0W-30 Racing", viscosity: "0W-30", price: 1550 }
      ]
    },
    {
      id: "semi-synthetic",
      name: "Полусинтетические масла",
      count: 8,
      products: [
        { id: "MAN-201", name: "MANNOL 10W-40 Classic", viscosity: "10W-40", price: 890 },
        { id: "MAN-202", name: "MANNOL 5W-40 Diesel", viscosity: "5W-40", price: 980 }
      ]
    },
    {
      id: "transmission",
      name: "Трансмиссионные масла",
      count: 15,
      products: [
        { id: "MAN-301", name: "MANNOL ATF WS", viscosity: "ATF", price: 1120 },
        { id: "MAN-302", name: "MANNOL Gear 75W-90", viscosity: "75W-90", price: 850 }
      ]
    },
    {
      id: "filters",
      name: "Фильтры",
      count: 25,
      products: [
        { id: "MAN-401", name: "Фильтр воздушный A1234", viscosity: "-", price: 450 },
        { id: "MAN-402", name: "Фильтр салонный C5678", viscosity: "-", price: 380 }
      ]
    }
  ];

  const longTimeNoOrderCategories = [
    {
      id: "synthetic-old",
      name: "Синтетические масла",
      count: 7,
      products: [
        { id: "MAN-501", name: "MANNOL 5W-30 API SN/CF", lastOrder: "05.09.2024", daysAgo: 107, price: 1250 },
        { id: "MAN-502", name: "MANNOL 0W-40 Premium", lastOrder: "12.08.2024", daysAgo: 131, price: 1580 }
      ]
    },
    {
      id: "transmission-old",
      name: "Трансмиссионные масла",
      count: 5,
      products: [
        { id: "MAN-601", name: "MANNOL ATF AG52", lastOrder: "20.09.2024", daysAgo: 92, price: 980 },
        { id: "MAN-602", name: "MANNOL CVT Fluid", lastOrder: "01.09.2024", daysAgo: 111, price: 1150 }
      ]
    },
    {
      id: "coolants-old",
      name: "Антифризы",
      count: 3,
      products: [
        { id: "MAN-701", name: "MANNOL Antifreeze AG13", lastOrder: "15.08.2024", daysAgo: 128, price: 650 }
      ]
    }
  ];

  const topProducts = [
    { id: "MAN-001", name: "MANNOL 5W-30 API SN/CF", orders: 45, liters: 2250, revenue: "₽2,812,500" },
    { id: "MAN-004", name: "MANNOL 10W-40 EXTRA", orders: 38, liters: 1900, revenue: "₽2,090,000" },
    { id: "MAN-002", name: "MANNOL ATF AG52", orders: 32, liters: 1280, revenue: "₽1,254,400" },
    { id: "MAN-005", name: "MANNOL Antifreeze AG11", orders: 28, liters: 1120, revenue: "₽728,000" },
    { id: "MAN-003", name: "MANNOL Radiator Cleaner", orders: 24, liters: 480, revenue: "₽216,000" }
  ];

  const salesPlan = {
    currentMonth: {
      planLiters: 5000,
      factLiters: 3200,
      planUnits: 2500,
      factUnits: 1600,
      percentComplete: 64
    },
    currentQuarter: {
      planLiters: 15000,
      factLiters: 11800,
      planUnits: 7500,
      factUnits: 5900,
      percentComplete: 79
    },
    currentYear: {
      planLiters: 60000,
      factLiters: 38500,
      planUnits: 30000,
      factUnits: 19250,
      percentComplete: 64
    }
  };

  const topDistributors = [
    { rank: 1, name: "ООО \"Авто-Про\"", share: 18.5, liters: 7125, trend: "+12%" },
    { rank: 2, name: "ИП Петров С.А.", share: 15.2, liters: 5852, trend: "+8%" },
    { rank: 3, name: "ООО \"МегаАвто\"", share: 12.8, liters: 4928, trend: "+5%" },
    { rank: 4, name: "ООО \"Торг-Плюс\"", share: 10.5, liters: 4042, trend: "-3%" },
    { rank: 5, name: "ИП Иванов А.В.", share: 9.2, liters: 3542, trend: "+15%" }
  ];

  const categoryBreakdown = [
    { category: "Моторные масла", liters: 22500, units: 11250, share: 58, color: "bg-blue-500" },
    { category: "Трансмиссионные масла", liters: 7700, units: 3850, share: 20, color: "bg-green-500" },
    { category: "Антифризы", liters: 4620, units: 2310, share: 12, color: "bg-purple-500" },
    { category: "Автохимия", liters: 2310, units: 1155, share: 6, color: "bg-orange-500" },
    { category: "Тормозные жидкости", liters: 1540, units: 770, share: 4, color: "bg-red-500" }
  ];

  const monthlyDynamics = [
    { month: "Январь", plan: 5000, fact: 4500 },
    { month: "Февраль", plan: 5000, fact: 4800 },
    { month: "Март", plan: 5000, fact: 5200 },
    { month: "Апрель", plan: 5000, fact: 4600 },
    { month: "Май", plan: 5000, fact: 5400 },
    { month: "Июнь", plan: 5000, fact: 5100 },
    { month: "Июль", plan: 5000, fact: 4900 },
    { month: "Август", plan: 5000, fact: 5300 },
    { month: "Сентябрь", plan: 5000, fact: 4700 },
    { month: "Октябрь", plan: 5000, fact: 5100 },
    { month: "Ноябрь", plan: 5000, fact: 4800 },
    { month: "Декабрь", plan: 5000, fact: 3200 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Аналитика продаж</h1>
          <p className="text-gray-600 mt-1">Планы, факты и рейтинги дистрибьюторов</p>
        </div>
        <Badge variant="outline" className="border-[#27265C] text-[#27265C] text-sm px-4 py-2">
          <Icon name="Calendar" size={16} className="mr-2" />
          Данные за 2024 год
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Месяц (Декабрь)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">План / Факт (литры)</span>
                <span className="font-bold text-[#27265C]">{salesPlan.currentMonth.factLiters.toLocaleString()} / {salesPlan.currentMonth.planLiters.toLocaleString()}</span>
              </div>
              <Progress value={salesPlan.currentMonth.percentComplete} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">{salesPlan.currentMonth.percentComplete}% от плана</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">План / Факт (штуки)</span>
                <span className="font-bold text-[#27265C]">{salesPlan.currentMonth.factUnits.toLocaleString()} / {salesPlan.currentMonth.planUnits.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="Calendar" size={20} />
              Квартал (Q4)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">План / Факт (литры)</span>
                <span className="font-bold text-[#27265C]">{salesPlan.currentQuarter.factLiters.toLocaleString()} / {salesPlan.currentQuarter.planLiters.toLocaleString()}</span>
              </div>
              <Progress value={salesPlan.currentQuarter.percentComplete} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">{salesPlan.currentQuarter.percentComplete}% от плана</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">План / Факт (штуки)</span>
                <span className="font-bold text-[#27265C]">{salesPlan.currentQuarter.factUnits.toLocaleString()} / {salesPlan.currentQuarter.planUnits.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="BarChart3" size={20} />
              Год (2024)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">План / Факт (литры)</span>
                <span className="font-bold text-[#27265C]">{salesPlan.currentYear.factLiters.toLocaleString()} / {salesPlan.currentYear.planLiters.toLocaleString()}</span>
              </div>
              <Progress value={salesPlan.currentYear.percentComplete} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">{salesPlan.currentYear.percentComplete}% от плана</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">План / Факт (штуки)</span>
                <span className="font-bold text-[#27265C]">{salesPlan.currentYear.factUnits.toLocaleString()} / {salesPlan.currentYear.planUnits.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#27265C]">Рейтинг дистрибьюторов</CardTitle>
            <CardDescription>ТОП-5 по объёму продаж в литрах</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDistributors.map((distributor) => (
                <div key={distributor.rank} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    distributor.rank === 1 ? "bg-yellow-500" :
                    distributor.rank === 2 ? "bg-gray-400" :
                    distributor.rank === 3 ? "bg-orange-600" :
                    "bg-[#27265C]"
                  }`}>
                    {distributor.rank === 1 && "🏆"}
                    {distributor.rank === 2 && "🥈"}
                    {distributor.rank === 3 && "🥉"}
                    {distributor.rank > 3 && distributor.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#27265C]">{distributor.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">{distributor.liters.toLocaleString()} л</span>
                      <Badge variant="outline" className={distributor.trend.startsWith("+") ? "border-green-500 text-green-600" : "border-red-500 text-red-600"}>
                        {distributor.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#27265C]">{distributor.share}%</div>
                    <p className="text-xs text-gray-500">доля рынка</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#27265C]">Продажи по категориям</CardTitle>
            <CardDescription>Распределение объёма продаж за год</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryBreakdown.map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${category.color}`} />
                      <span className="font-semibold text-[#27265C]">{category.category}</span>
                    </div>
                    <span className="font-bold text-[#27265C]">{category.share}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <Icon name="Droplets" size={14} className="inline mr-1 text-blue-600" />
                      <span className="text-gray-600">{category.liters.toLocaleString()} л</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <Icon name="Package" size={14} className="inline mr-1 text-gray-600" />
                      <span className="text-gray-600">{category.units.toLocaleString()} шт</span>
                    </div>
                  </div>
                  <Progress value={category.share} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-[#FCC71E]">
        <CardHeader>
          <CardTitle className="text-[#27265C] flex items-center gap-2">
            <Icon name="Award" size={24} />
            Рейтинг по SKU
          </CardTitle>
          <CardDescription>Процент охвата товарного ассортимента</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#27265C] to-[#3d3b7c] text-white rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Package" size={20} />
                  <span className="text-sm opacity-90">Всего SKU</span>
                </div>
                <p className="text-4xl font-bold">{skuRating.totalSKU}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={20} />
                  <span className="text-sm opacity-90">Заказано SKU</span>
                </div>
                <p className="text-4xl font-bold">{skuRating.orderedSKU}</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#FCC71E] to-[#fdb91e] text-[#27265C] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="TrendingUp" size={20} />
                  <span className="text-sm opacity-90">Охват</span>
                </div>
                <p className="text-4xl font-bold">{skuRating.percentage}%</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Прогресс охвата ассортимента</span>
                <span className="font-bold text-[#27265C]">{skuRating.orderedSKU} из {skuRating.totalSKU}</span>
              </div>
              <Progress value={skuRating.percentage} className="h-4" />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Ваша позиция в рейтинге</p>
                  <p className="text-sm text-blue-800">
                    Вы занимаете <span className="font-bold">{skuRating.rank} место</span> из {skuRating.totalPartners} партнеров по охвату SKU. 
                    Закажите товары из раздела "Не брал совсем" чтобы повысить рейтинг!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="XCircle" size={20} className="text-red-600" />
              Не брал совсем
            </CardTitle>
            <CardDescription>SKU, которые вы ещё не заказывали</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="AlertTriangle" size={16} className="text-red-600" />
                <span className="font-semibold text-red-900 text-sm">Расширьте ассортимент</span>
              </div>
              <p className="text-xs text-red-800">
                {neverOrderedCategories.reduce((sum, cat) => sum + cat.count, 0)} SKU в каталоге
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {neverOrderedCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-semibold text-[#27265C] text-sm">{category.name}</span>
                      <Badge variant="outline" className="border-red-500 text-red-600 text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {category.products.map((product) => (
                        <div key={product.id} className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#27265C] text-xs truncate">{product.name}</p>
                              <p className="text-xs text-gray-600">{product.viscosity} • ₽{product.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Link to={`/product/${product.id}`} className="flex-1">
                              <Button size="sm" variant="outline" className="w-full h-7 text-xs border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                                <Icon name="Eye" size={12} className="mr-1" />
                                Карточка
                              </Button>
                            </Link>
                            <Link to="/order/new" className="flex-1">
                              <Button size="sm" className="w-full h-7 text-xs bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90">
                                <Icon name="Plus" size={12} className="mr-1" />
                                Заказать
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="Clock" size={20} className="text-orange-600" />
              Давно не заказывал
            </CardTitle>
            <CardDescription>Не заказывались более 2 месяцев</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="AlertCircle" size={16} className="text-orange-600" />
                <span className="font-semibold text-orange-900 text-sm">Возобновите закупки</span>
              </div>
              <p className="text-xs text-orange-800">
                {longTimeNoOrderCategories.reduce((sum, cat) => sum + cat.count, 0)} SKU давно не заказывались
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {longTimeNoOrderCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-semibold text-[#27265C] text-sm">{category.name}</span>
                      <Badge variant="outline" className="border-orange-500 text-orange-600 text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {category.products.map((product) => (
                        <div key={product.id} className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#27265C] text-xs truncate">{product.name}</p>
                              <p className="text-xs text-gray-600">
                                {product.lastOrder} ({product.daysAgo}д)
                              </p>
                              <p className="text-xs text-gray-600">₽{product.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Link to={`/product/${product.id}`} className="flex-1">
                              <Button size="sm" variant="outline" className="w-full h-7 text-xs border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                                <Icon name="Eye" size={12} className="mr-1" />
                                Карточка
                              </Button>
                            </Link>
                            <Link to="/order/new" className="flex-1">
                              <Button size="sm" className="w-full h-7 text-xs bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90">
                                <Icon name="Plus" size={12} className="mr-1" />
                                Заказать
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-[#27265C] flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className="text-green-600" />
              Топ покупаемых
            </CardTitle>
            <CardDescription>Самые популярные за год</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                    idx === 0 ? "bg-yellow-500" :
                    idx === 1 ? "bg-gray-400" :
                    idx === 2 ? "bg-orange-600" :
                    "bg-[#27265C]"
                  }`}>
                    {idx === 0 && "🏆"}
                    {idx === 1 && "🥈"}
                    {idx === 2 && "🥉"}
                    {idx > 2 && (idx + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#27265C] text-xs truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{product.orders} зак.</span>
                      <span>•</span>
                      <span>{product.liters} л</span>
                    </div>
                    <p className="text-xs font-semibold text-green-600">{product.revenue}</p>
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                      <Icon name="Eye" size={12} />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">Динамика продаж по месяцам</CardTitle>
          <CardDescription>План vs Факт в литрах за 2024 год</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyDynamics.map((month, idx) => {
              const percentage = Math.round((month.fact / month.plan) * 100);
              const isOverPlan = month.fact >= month.plan;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-semibold text-gray-600">{month.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">План: {month.plan.toLocaleString()} л</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs font-semibold text-[#27265C]">Факт: {month.fact.toLocaleString()} л</span>
                      <Badge variant="outline" className={isOverPlan ? "border-green-500 text-green-600" : "border-orange-500 text-orange-600"}>
                        {percentage}%
                      </Badge>
                    </div>
                    <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div className="absolute h-full bg-blue-200 rounded-full" style={{ width: "100%" }} />
                      <div className={`absolute h-full rounded-full ${isOverPlan ? "bg-green-500" : "bg-orange-500"}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
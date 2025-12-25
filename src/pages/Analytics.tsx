import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Analytics = () => {
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

import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import OrderFlowStatus from "@/components/OrderFlowStatus";

const ORDER_ID = "ORD-2026-0201";

const ITEMS = [
  { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 800, sum: 1160000 },
  { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 350, sum: 385000 },
  { name: "MANNOL ATF AG52 Automatic Special", sku: "MN8211-4", qty: 200, sum: 196000 },
  { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 80, sum: 84000 },
  { name: "MANNOL Compressor Oil ISO 100", sku: "MN2902-4", qty: 150, sum: 133500 },
  { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", qty: 300, sum: 156000 },
  { name: "MANNOL Longlife 504/507 5W-30", sku: "MN7715-4", qty: 350, sum: 588000 },
];

export default function OrderScreening() {
  return (
    <div className="max-w-6xl mx-auto space-y-4 px-4 md:px-0">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link to="/orders" className="hover:text-[#27265C] font-medium transition-colors">Все заказы</Link>
        <Icon name="ChevronRight" size={14} />
        <span className="text-[#27265C] font-semibold">{ORDER_ID}</span>
      </nav>

      {/* Stepper */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl px-4 md:px-6 py-4 shadow-sm">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Этапы оформления заказа
        </p>
        <OrderFlowStatus current="review" />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#27265C]">{ORDER_ID}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Создан 17.02.2026 · Москва · Иванова М.С.
        </p>
      </div>

      {/* Info banner */}
      <Alert className="border-blue-200 bg-blue-50">
        <Icon name="Info" size={18} className="text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          <strong>Заказ на рассмотрении у менеджера.</strong> Редактирование недоступно до получения ответа. Ожидаемый срок: 1–2 рабочих дня.
        </AlertDescription>
      </Alert>

      {/* Layout: stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">

        {/* Main content */}
        <div className="w-full lg:flex-1 min-w-0">
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="px-4 md:px-6 py-4 bg-[#27265C]">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Icon name="Package" size={15} className="text-[#FCC71E]" />
                Состав заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile: card list */}
              <div className="md:hidden divide-y divide-[#F4F4F4]">
                {ITEMS.map((item, idx) => (
                  <div key={idx} className="px-4 py-3 space-y-1">
                    <p className="text-sm font-medium text-[#27265C] leading-snug">{item.name}</p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground bg-[#F4F4F4] px-2 py-0.5 rounded">{item.sku}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">{item.qty.toLocaleString("ru-RU")} шт.</span>
                        <span className="font-semibold text-[#27265C]">{item.sum.toLocaleString("ru-RU")} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F8FA] border-b border-[#E8E8E8]">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Товар</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Артикул</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Количество</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F4F4]">
                    {ITEMS.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAFAFA]">
                        <td className="px-5 py-3.5 font-medium text-[#27265C]">{item.name}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs text-muted-foreground bg-[#F4F4F4] px-2 py-0.5 rounded">{item.sku}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-[#27265C] font-medium">{item.qty.toLocaleString("ru-RU")} шт.</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-[#27265C]">{item.sum.toLocaleString("ru-RU")} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — full width on mobile */}
        <div className="w-full lg:w-[260px] lg:flex-shrink-0 space-y-4">
          {/* Summary */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardHeader className="px-5 py-4 border-b border-[#F0F0F0]">
              <CardTitle className="text-sm font-semibold text-[#27265C]">Сводка заказа</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-0 md:space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Позиций</span>
                  <span className="font-semibold text-[#27265C]">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Штук</span>
                  <span className="font-semibold text-[#27265C]">2 230</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сумма</span>
                  <span className="font-bold text-[#27265C]">389 500 ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата отгрузки</span>
                  <span className="font-medium text-[#27265C]">28.02.2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Склад</span>
                  <span className="font-medium text-[#27265C]">Москва</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manager */}
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardContent className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#27265C] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  ИМ
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#27265C]">Иванова М.С.</p>
                  <p className="text-xs text-muted-foreground">Менеджер</p>
                </div>
              </div>
              <p className="text-sm text-[#27265C]">+7 (495) 123-45-67</p>
              <Button
                variant="outline"
                className="w-full h-9 text-sm border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5"
                asChild
              >
                <a href="tel:+74951234567">
                  <Icon name="Phone" size={14} className="mr-2" />
                  Позвонить менеджеру
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Back button */}
          <Link to="/orders">
            <Button variant="outline" className="w-full h-10 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5">
              <Icon name="ArrowLeft" size={15} className="mr-2" />
              Все заказы
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

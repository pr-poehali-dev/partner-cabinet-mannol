import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import OrderFlowStatus from "@/components/OrderFlowStatus";

const ORDER_ID = "ORD-2026-0189";
const BACKORDER_ID = "ORD-2026-0215";
const HAS_BACKORDER = true;

export default function OrderAccepted() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 px-4 md:px-0">

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
        <OrderFlowStatus current="success" />
      </div>

      {/* Main card */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="px-5 md:px-8 py-8 md:py-10 text-center space-y-5">

          {/* Success icon */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={36} className="text-emerald-500 md:hidden" />
              <Icon name="CheckCircle" size={44} className="text-emerald-500 hidden md:block" />
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#27265C]">Заказ подтверждён</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Заказ передан в работу. Ожидайте отгрузку в указанную дату.
            </p>
          </div>

          {/* Metadata grid — 1 col on mobile, 3 on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-[#F7F8FA] rounded-xl p-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Номер заказа</p>
              <p className="font-bold text-[#27265C] text-xs md:text-sm">{ORDER_ID}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Дата отгрузки</p>
              <p className="font-bold text-emerald-600">19.02.2026</p>
            </div>
            <div className="bg-[#F7F8FA] rounded-xl p-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Склад</p>
              <p className="font-bold text-[#27265C]">Москва</p>
            </div>
          </div>

          {/* Backorder block */}
          {HAS_BACKORDER && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="AlertTriangle" size={18} className="text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-800">
                    Недопоставка по 2 позициям оформлена отдельным заказом
                  </p>
                  <p className="text-sm text-amber-700 mt-0.5 flex items-center gap-1 flex-wrap">
                    Номер:{" "}
                    <Badge className="bg-amber-100 text-amber-700 border-amber-300 font-mono text-xs">
                      {BACKORDER_ID}
                    </Badge>
                  </p>
                </div>
              </div>
              <Link to={`/order/${BACKORDER_ID}/backorder`}>
                <Button variant="outline" className="w-full h-9 text-sm border-amber-300 text-amber-700 hover:bg-amber-50">
                  <Icon name="ExternalLink" size={14} className="mr-2" />
                  Перейти к заказу по недопоставке
                </Button>
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full h-11 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5">
                Все заказы
              </Button>
            </Link>
            <Link to={`/order/${ORDER_ID}`} className="flex-1">
              <Button className="w-full h-11 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold">
                <Icon name="ArrowRight" size={16} className="mr-2" />
                Перейти к заказу
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

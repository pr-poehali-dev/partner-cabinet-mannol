import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

type BackorderStatus = "formed" | "waiting" | "ready" | "converted" | "cancelled";

const STATUS_CONFIG: Record<BackorderStatus, { label: string; color: string; bg: string; icon: string }> = {
  formed:    { label: "Сформирована",               color: "text-blue-700",   bg: "bg-blue-100",   icon: "FileText" },
  waiting:   { label: "Ожидание поступления",        color: "text-amber-700",  bg: "bg-amber-100",  icon: "Clock" },
  ready:     { label: "Готова к созданию заказа",    color: "text-purple-700", bg: "bg-purple-100", icon: "PackageCheck" },
  converted: { label: "Преобразована в заказ",       color: "text-emerald-700",bg: "bg-emerald-100",icon: "CheckCircle" },
  cancelled: { label: "Отменена",                    color: "text-red-700",    bg: "bg-red-100",    icon: "XCircle" },
};

const SOURCE_ORDER_ID = "ORD-2026-0201";
const NEW_ORDER_ID = "ORD-2026-0215";
const CURRENT_STATUS: BackorderStatus = "converted";

const ITEMS = [
  {
    name: "MANNOL Longlife 504/507 5W-30",
    sku: "MN7715-4",
    shortage: 100,
    reason: "Нет на складе",
  },
  {
    name: "MANNOL Antifreeze AG13 -40C",
    sku: "MN4013-5",
    shortage: 50,
    reason: "Частичный остаток",
  },
];

export default function OrderBackorder() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const status = cancelled ? "cancelled" : CURRENT_STATUS;
  const cfg = STATUS_CONFIG[status];

  const handleConfirmCancel = () => {
    setCancelled(true);
    setShowCancelDialog(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/orders" className="hover:text-[#27265C] font-medium transition-colors">Все заказы</Link>
        <Icon name="ChevronRight" size={14} />
        <span className="text-[#27265C] font-semibold">Недопоставка</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#27265C]">
            Недопоставка по заказу {SOURCE_ORDER_ID}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Создана 17.02.2026</p>
        </div>
        {/* Status badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${cfg.bg} flex-shrink-0`}>
          <Icon name={cfg.icon as never} size={16} className={cfg.color} />
          <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>

      {/* Info banner */}
      <Alert className="border-blue-200 bg-blue-50">
        <Icon name="Info" size={18} className="text-blue-600" />
        <AlertDescription className="text-blue-800">
          Недостающие позиции зафиксированы. Новый заказ будет создан автоматически после поступления товара на склад.
        </AlertDescription>
      </Alert>

      {/* Table */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-4 bg-[#27265C]">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Icon name="AlertTriangle" size={15} className="text-[#FCC71E]" />
            Позиции недопоставки
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F7F8FA] border-b border-[#E8E8E8]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Товар</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Артикул</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Не хватает (шт.)</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Причина</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F4]">
                {ITEMS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFAFA]">
                    <td className="px-5 py-3.5 font-medium text-[#27265C]">{item.name}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-muted-foreground bg-[#F4F4F4] px-2 py-0.5 rounded">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-amber-600">{item.shortage}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Source order link */}
      <div className="flex items-center gap-2 text-sm">
        <Icon name="Link" size={14} className="text-muted-foreground" />
        <span className="text-muted-foreground">Создана на основании заказа</span>
        <Link
          to={`/order/${SOURCE_ORDER_ID}`}
          className="font-semibold text-[#27265C] hover:underline underline-offset-2 transition-colors"
        >
          {SOURCE_ORDER_ID}
        </Link>
      </div>

      {/* Converted order block */}
      {(status === "converted") && (
        <Card className="border border-emerald-200 bg-emerald-50 rounded-2xl shadow-sm">
          <CardContent className="px-6 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Icon name="PackageCheck" size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800">Новый заказ создан</p>
                <p className="text-sm text-emerald-700">
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 font-mono text-xs mr-1">
                    {NEW_ORDER_ID}
                  </Badge>
                </p>
              </div>
            </div>
            <Link to={`/order/${NEW_ORDER_ID}`}>
              <Button className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                <Icon name="ArrowRight" size={14} className="mr-2" />
                Перейти к заказу
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Cancel button */}
      {status !== "cancelled" && status !== "converted" && (
        <div className="pb-4">
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={() => setShowCancelDialog(true)}
          >
            <Icon name="XCircle" size={15} className="mr-2" />
            Отменить недопоставку
          </Button>
        </div>
      )}

      {/* Cancelled notice */}
      {status === "cancelled" && (
        <Alert className="border-red-200 bg-red-50">
          <Icon name="XCircle" size={18} className="text-red-600" />
          <AlertDescription className="text-red-700">
            Недопоставка отменена. Новый заказ по недостающим позициям создан не будет.
          </AlertDescription>
        </Alert>
      )}

      {/* Cancel confirmation dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#27265C]">Вы уверены?</DialogTitle>
            <DialogDescription>
              Новый заказ по недостающим позициям создан не будет.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="border-[#27265C]/20 text-[#27265C]"
            >
              Отмена
            </Button>
            <Button
              onClick={handleConfirmCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Да, отменить недопоставку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

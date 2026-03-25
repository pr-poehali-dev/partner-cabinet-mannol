import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { Link, useSearchParams } from "react-router-dom";

/* ─────────── Types ─────────── */

type SlotStatus = "Подтверждено" | "В ожидании" | "Отгружено";

interface ScheduleSlot {
  time: string;
  order: string;
  status: SlotStatus;
  warehouse: string;
  address: string;
  items: { name: string; sku: string; qty: number; weight: string }[];
  totalWeight: string;
  pallets: number;
  driver: string;
  vehicle: string;
  contactPhone: string;
  manager: string;
  note: string;
}

interface ScheduleDay {
  date: string;
  day: string;
  slots: ScheduleSlot[];
}

/* ─────────── Status config ─────────── */

const STATUS_CONFIG: Record<
  SlotStatus,
  {
    label: string;
    icon: string;
    badgeClass: string;
    borderClass: string;
    bgClass: string;
    iconClass: string;
    iconBg: string;
  }
> = {
  Подтверждено: {
    label: "Подтверждено",
    icon: "CheckCircle",
    badgeClass: "bg-emerald-500 text-white",
    borderClass: "border-emerald-200",
    bgClass: "bg-emerald-50",
    iconClass: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  "В ожидании": {
    label: "В ожидании",
    icon: "Clock",
    badgeClass: "bg-amber-400 text-[#27265C]",
    borderClass: "border-amber-200",
    bgClass: "bg-amber-50",
    iconClass: "text-amber-500",
    iconBg: "bg-amber-100",
  },
  Отгружено: {
    label: "Отгружено",
    icon: "Truck",
    badgeClass: "bg-blue-500 text-white",
    borderClass: "border-blue-200",
    bgClass: "bg-blue-50",
    iconClass: "text-blue-600",
    iconBg: "bg-blue-100",
  },
};

/* ─────────── Mock data ─────────── */

const schedule: ScheduleDay[] = [
  {
    date: "12.02.2026",
    day: "Четверг",
    slots: [
      {
        time: "09:00–12:00",
        order: "ORD-2026-0180",
        status: "Отгружено",
        warehouse: "Москва (Подольск)",
        address: "г. Подольск, ул. Логистическая, д. 4, стр. 1",
        items: [
          { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 600, weight: "2 400 кг" },
          { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 500, weight: "2 000 кг" },
          { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 150, weight: "600 кг" },
        ],
        totalWeight: "5 000 кг",
        pallets: 10,
        driver: "Сидоров К.Л.",
        vehicle: "Volvo FH 460 (В 789 АК 50)",
        contactPhone: "+7 (495) 987-65-43",
        manager: "Козлов А.П.",
        note: "",
      },
    ],
  },
  {
    date: "15.02.2026",
    day: "Воскресенье",
    slots: [
      {
        time: "10:00–13:00",
        order: "ORD-2026-0185",
        status: "Отгружено",
        warehouse: "Москва (Подольск)",
        address: "г. Подольск, ул. Логистическая, д. 4, стр. 1",
        items: [
          { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 900, weight: "3 600 кг" },
          { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 500, weight: "2 000 кг" },
          { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 200, weight: "800 кг" },
          { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", qty: 300, weight: "1 500 кг" },
        ],
        totalWeight: "7 900 кг",
        pallets: 15,
        driver: "Кузнецов Д.В.",
        vehicle: "Scania R410 (Е 321 МН 77)",
        contactPhone: "+7 (495) 123-45-67",
        manager: "Иванова М.С.",
        note: "Воскресная отгрузка — пропуск оформлен заранее",
      },
    ],
  },
  {
    date: "19.02.2026",
    day: "Четверг",
    slots: [
      {
        time: "09:00–12:00",
        order: "ORD-2026-0189",
        status: "Подтверждено",
        warehouse: "Москва (Подольск)",
        address: "г. Подольск, ул. Логистическая, д. 4, стр. 1",
        items: [
          { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 1200, weight: "4 800 кг" },
          { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 700, weight: "2 800 кг" },
          { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", qty: 400, weight: "2 000 кг" },
        ],
        totalWeight: "9 600 кг",
        pallets: 18,
        driver: "Иванов А.С.",
        vehicle: "МАН TGS 18.360 (А 456 ВС 77)",
        contactPhone: "+7 (495) 123-45-67",
        manager: "Козлов А.П.",
        note: "Въезд через ворота №2, пропуск оформлен",
      },
      {
        time: "14:00–17:00",
        order: "ORD-2026-0194",
        status: "В ожидании",
        warehouse: "Москва (Подольск)",
        address: "г. Подольск, ул. Логистическая, д. 4, стр. 1",
        items: [
          { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 500, weight: "2 000 кг" },
          { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 400, weight: "1 600 кг" },
          { name: "MANNOL ATF AG52 Automatic Special", sku: "MN8211-4", qty: 300, weight: "1 200 кг" },
        ],
        totalWeight: "4 800 кг",
        pallets: 9,
        driver: "Не назначен",
        vehicle: "Не назначено",
        contactPhone: "+7 (495) 123-45-67",
        manager: "Иванова М.С.",
        note: "Ожидает подтверждения из 1С",
      },
    ],
  },
  {
    date: "25.02.2026",
    day: "Среда",
    slots: [
      {
        time: "10:00–13:00",
        order: "ORD-2026-0198",
        status: "В ожидании",
        warehouse: "Москва (Подольск)",
        address: "г. Подольск, ул. Логистическая, д. 4, стр. 1",
        items: [
          { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 800, weight: "3 200 кг" },
          { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 600, weight: "2 400 кг" },
          { name: "MANNOL ATF AG52 Automatic Special", sku: "MN8211-4", qty: 200, weight: "800 кг" },
          { name: "MANNOL Longlife 504/507 5W-30", sku: "MN7715-4", qty: 100, weight: "400 кг" },
          { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 80, weight: "320 кг" },
        ],
        totalWeight: "7 120 кг",
        pallets: 14,
        driver: "Не назначен",
        vehicle: "Не назначено",
        contactPhone: "+7 (495) 987-65-43",
        manager: "Иванова М.С.",
        note: "Крупная партия — уточнить количество машин",
      },
    ],
  },
  {
    date: "05.03.2026",
    day: "Четверг",
    slots: [
      {
        time: "09:00–12:00",
        order: "ORD-2026-0201",
        status: "В ожидании",
        warehouse: "Москва (Подольск)",
        address: "г. Подольск, ул. Логистическая, д. 4, стр. 1",
        items: [
          { name: "MANNOL Energy Formula OP 5W-30", sku: "MN7917-4", qty: 400, weight: "1 600 кг" },
          { name: "MANNOL Diesel Extra 10W-40", sku: "MN7504-4", qty: 300, weight: "1 200 кг" },
          { name: "MANNOL Antifreeze AG13 -40C", sku: "MN4013-5", qty: 250, weight: "1 250 кг" },
        ],
        totalWeight: "4 050 кг",
        pallets: 8,
        driver: "Не назначен",
        vehicle: "Не назначено",
        contactPhone: "+7 (495) 123-45-67",
        manager: "Иванова М.С.",
        note: "",
      },
    ],
  },
];

/* ─────────── Summary counters ─────────── */

const totalSlots = schedule.reduce((s, d) => s + d.slots.length, 0);
const confirmedCount = schedule.reduce(
  (s, d) => s + d.slots.filter((sl) => sl.status === "Подтверждено").length,
  0,
);
const pendingCount = schedule.reduce(
  (s, d) => s + d.slots.filter((sl) => sl.status === "В ожидании").length,
  0,
);

/* ─────────── Component ─────────── */

const Schedule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSlot, setSelectedSlot] = useState<{
    slot: ScheduleSlot;
    date: string;
    day: string;
  } | null>(() => {
    const orderId = searchParams.get("order");
    if (orderId) {
      for (const day of schedule) {
        const slot = day.slots.find((s) => s.order === orderId);
        if (slot) return { slot, date: day.date, day: day.day };
      }
    }
    return null;
  });

  const openDetails = (slot: ScheduleSlot, date: string, day: string) => {
    setSelectedSlot({ slot, date, day });
    setSearchParams({ order: slot.order });
  };

  const closeDetails = () => {
    setSelectedSlot(null);
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#27265C]">График отгрузок</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Планирование и контроль дат отгрузки заказов · февраль–март 2026
          </p>
        </div>
        <Link to="/order/new">
          <Button className="bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold w-full sm:w-auto">
            <Icon name="Plus" size={18} className="mr-2" />
            Запланировать отгрузку
          </Button>
        </Link>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Запланировано</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#27265C]">{totalSlots}</div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon name="Calendar" className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Отгрузок на период</p>
          </CardContent>
        </Card>

        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Подтверждено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-emerald-600">{confirmedCount}</div>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Icon name="CheckCircle" className="text-emerald-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Готовы к отгрузке</p>
          </CardContent>
        </Card>

        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">В ожидании</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-amber-500">{pendingCount}</div>
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <Icon name="Clock" className="text-amber-500" size={24} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Требуют подтверждения</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Schedule days ── */}
      <div className="space-y-4">
        {schedule.map((day, idx) => (
          <Card key={idx} className="border border-[#E8E8E8] rounded-2xl shadow-sm">
            <CardHeader className="bg-gray-50 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#27265C]">{day.date}</CardTitle>
                  <CardDescription>{day.day}</CardDescription>
                </div>
                <Badge variant="outline" className="border-[#27265C] text-[#27265C]">
                  {day.slots.length} {day.slots.length === 1 ? "слот" : "слота"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-3">
                {day.slots.map((slot, slotIdx) => {
                  const cfg = STATUS_CONFIG[slot.status];
                  return (
                    <div
                      key={slotIdx}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border-2 ${cfg.borderClass} ${cfg.bgClass}`}
                    >
                      {/* Left: icon + info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon name={cfg.icon} size={22} className={cfg.iconClass} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-[#27265C] text-base md:text-lg">
                              {slot.time}
                            </span>
                            <Badge className={`${cfg.badgeClass} border-0`}>{slot.status}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="FileText" size={14} />
                              Заказ: <strong className="text-[#27265C]">{slot.order}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Warehouse" size={14} />
                              {slot.warehouse}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Package" size={14} />
                              {slot.totalWeight}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: actions */}
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                          onClick={() => openDetails(slot, day.date, day.day)}
                        >
                          <Icon name="Eye" size={16} className="mr-1" />
                          Детали
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Info banner ── */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Icon name="Info" size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-[#27265C]">Как работает график отгрузок?</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>После создания заказа выберите удобную дату и время отгрузки</li>
                <li>Заказ отправляется в 1С на согласование и резервирование товаров</li>
                <li>После подтверждения из 1С статус меняется на «Подтверждено»</li>
                <li>В день отгрузки вы получите уведомление и сопроводительные документы</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Detail dialog ── */}
      <Dialog open={!!selectedSlot} onOpenChange={() => closeDetails()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSlot && (() => {
            const cfg = STATUS_CONFIG[selectedSlot.slot.status];
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-[#27265C] flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${cfg.iconBg} flex items-center justify-center`}>
                      <Icon name={cfg.icon} size={22} className={cfg.iconClass} />
                    </div>
                    Детали отгрузки
                  </DialogTitle>
                  <DialogDescription>
                    Заказ {selectedSlot.slot.order} · {selectedSlot.date}, {selectedSlot.day}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                  {/* Basic info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Дата и время</p>
                      <p className="font-semibold text-[#27265C]">
                        {selectedSlot.date}, {selectedSlot.slot.time}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Статус</p>
                      <Badge className={`${cfg.badgeClass} border-0`}>{selectedSlot.slot.status}</Badge>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Склад</p>
                      <p className="font-semibold text-[#27265C]">{selectedSlot.slot.warehouse}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Общий вес</p>
                      <p className="font-semibold text-[#27265C]">{selectedSlot.slot.totalWeight}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Адрес склада</p>
                    <p className="font-semibold text-[#27265C] flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-gray-400 flex-shrink-0" />
                      {selectedSlot.slot.address}
                    </p>
                  </div>

                  <Separator />

                  {/* Items list */}
                  <div>
                    <p className="text-sm font-semibold text-[#27265C] mb-3 flex items-center gap-2">
                      <Icon name="Package" size={16} />
                      Товары в отгрузке ({selectedSlot.slot.items.length})
                    </p>
                    <div className="space-y-2">
                      {selectedSlot.slot.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-white border border-[#E8E8E8] rounded-xl"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#27265C] text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Арт: {item.sku}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="font-semibold text-[#27265C]">{item.qty} шт</p>
                            <p className="text-xs text-muted-foreground">{item.weight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Transport info */}
                  <div>
                    <p className="text-sm font-semibold text-[#27265C] mb-3 flex items-center gap-2">
                      <Icon name="Truck" size={16} />
                      Транспорт и логистика
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Водитель</p>
                        <p className="font-semibold text-[#27265C]">{selectedSlot.slot.driver}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Транспортное средство</p>
                        <p className="font-semibold text-[#27265C] text-sm">{selectedSlot.slot.vehicle}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Паллеты</p>
                        <p className="font-semibold text-[#27265C]">{selectedSlot.slot.pallets} шт</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Телефон склада</p>
                        <p className="font-semibold text-[#27265C]">{selectedSlot.slot.contactPhone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Manager */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Менеджер</p>
                    <p className="font-semibold text-[#27265C] flex items-center gap-2">
                      <Icon name="User" size={14} className="text-gray-400" />
                      {selectedSlot.slot.manager}
                    </p>
                  </div>

                  {/* Note */}
                  {selectedSlot.slot.note && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-600 mb-1 flex items-center gap-1">
                        <Icon name="MessageSquare" size={12} />
                        Примечание
                      </p>
                      <p className="text-sm text-amber-900">{selectedSlot.slot.note}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link to={`/order/${selectedSlot.slot.order}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                      >
                        <Icon name="FileText" size={16} className="mr-2" />
                        Перейти к заказу
                      </Button>
                    </Link>
                    {selectedSlot.slot.status === "В ожидании" && (
                      <Button className="flex-1 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold">
                        <Icon name="Check" size={16} className="mr-2" />
                        Подтвердить отгрузку
                      </Button>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;

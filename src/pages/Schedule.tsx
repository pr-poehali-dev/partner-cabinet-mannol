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
import { Link } from "react-router-dom";

interface ScheduleSlot {
  time: string;
  order: string;
  status: string;
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

const schedule: ScheduleDay[] = [
  {
    date: "18.12.2024",
    day: "Среда",
    slots: [
      {
        time: "09:00-12:00",
        order: "ORD-2024-1250",
        status: "Подтверждено",
        warehouse: "Склад 1",
        address: "г. Москва, ул. Складская 15, стр. 2",
        items: [
          { name: "MANNOL Energy Formula 5W-30", sku: "MN7917-4", qty: 120, weight: "480 кг" },
          { name: "MANNOL Longlife 504/507 5W-30", sku: "MN7715-4", qty: 80, weight: "320 кг" },
          { name: "MANNOL Radiator Cleaner", sku: "MN9965-0.325", qty: 200, weight: "65 кг" },
        ],
        totalWeight: "865 кг",
        pallets: 4,
        driver: "Иванов А.С.",
        vehicle: "МАН TGS 18.360 (А 456 ВС 77)",
        contactPhone: "+7 (495) 123-45-67",
        manager: "Петров М.В.",
        note: "Въезд через ворота №2, пропуск оформлен",
      },
      {
        time: "14:00-17:00",
        order: "ORD-2024-1251",
        status: "Ожидание",
        warehouse: "Склад 1",
        address: "г. Москва, ул. Складская 15, стр. 2",
        items: [
          { name: "MANNOL ATF AG52 Automatic Special", sku: "MN8211-4", qty: 60, weight: "240 кг" },
          { name: "MANNOL Antifreeze AG13 -40°C", sku: "MN4013-5", qty: 100, weight: "500 кг" },
        ],
        totalWeight: "740 кг",
        pallets: 3,
        driver: "Не назначен",
        vehicle: "Не назначено",
        contactPhone: "+7 (495) 123-45-67",
        manager: "Петров М.В.",
        note: "Ожидает подтверждения из 1С",
      },
    ],
  },
  {
    date: "19.12.2024",
    day: "Четверг",
    slots: [
      {
        time: "10:00-13:00",
        order: "ORD-2024-1245",
        status: "Подтверждено",
        warehouse: "Склад 2",
        address: "г. Москва, Промзона Южная, д. 8",
        items: [
          { name: "MANNOL 10W-40 Extra Diesel", sku: "MN7504-4", qty: 200, weight: "800 кг" },
          { name: "MANNOL Diesel TDI 5W-30", sku: "MN7909-4", qty: 60, weight: "240 кг" },
        ],
        totalWeight: "1040 кг",
        pallets: 5,
        driver: "Сидоров К.Л.",
        vehicle: "Volvo FH 460 (В 789 АК 50)",
        contactPhone: "+7 (495) 987-65-43",
        manager: "Козлова Е.А.",
        note: "",
      },
    ],
  },
  {
    date: "20.12.2024",
    day: "Пятница",
    slots: [
      {
        time: "09:00-12:00",
        order: "ORD-2024-1246",
        status: "Подтверждено",
        warehouse: "Склад 2",
        address: "г. Москва, Промзона Южная, д. 8",
        items: [
          { name: "MANNOL Classic 10W-40", sku: "MN7501-4", qty: 150, weight: "600 кг" },
        ],
        totalWeight: "600 кг",
        pallets: 3,
        driver: "Кузнецов Д.В.",
        vehicle: "Scania R410 (Е 321 МН 77)",
        contactPhone: "+7 (495) 987-65-43",
        manager: "Козлова Е.А.",
        note: "Крупногабаритный груз, нужен гидроборт",
      },
      {
        time: "13:00-16:00",
        order: "—",
        status: "Свободно",
        warehouse: "Склад 1",
        address: "г. Москва, ул. Складская 15, стр. 2",
        items: [],
        totalWeight: "—",
        pallets: 0,
        driver: "",
        vehicle: "",
        contactPhone: "+7 (495) 123-45-67",
        manager: "Петров М.В.",
        note: "",
      },
    ],
  },
  {
    date: "22.12.2024",
    day: "Воскресенье",
    slots: [
      {
        time: "10:00-13:00",
        order: "ORD-2024-1247",
        status: "Ожидание",
        warehouse: "Склад 1",
        address: "г. Москва, ул. Складская 15, стр. 2",
        items: [
          { name: "MANNOL Energy Combi LL 5W-30", sku: "MN7907-4", qty: 90, weight: "360 кг" },
          { name: "MANNOL Maxpower 4x4 75W-140", sku: "MN8102-4", qty: 40, weight: "160 кг" },
        ],
        totalWeight: "520 кг",
        pallets: 2,
        driver: "Не назначен",
        vehicle: "Не назначено",
        contactPhone: "+7 (495) 123-45-67",
        manager: "Петров М.В.",
        note: "Воскресная отгрузка — согласовать заранее",
      },
    ],
  },
];

const Schedule = () => {
  const [selectedSlot, setSelectedSlot] = useState<{ slot: ScheduleSlot; date: string; day: string } | null>(null);

  const openDetails = (slot: ScheduleSlot, date: string, day: string) => {
    setSelectedSlot({ slot, date, day });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">График отгрузок</h1>
          <p className="text-gray-600 mt-1">Планирование и контроль дат отгрузки заказов</p>
        </div>
        <Link to="/order/new">
          <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
            <Icon name="Plus" size={18} className="mr-2" />
            Запланировать отгрузку
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Запланировано</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#27265C]">8</div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon name="Calendar" className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Отгрузок на этой неделе</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Подтверждено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">5</div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon name="CheckCircle" className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Готовы к отгрузке</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Ожидание</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-yellow-600">3</div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Icon name="Clock" className="text-yellow-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Требуют подтверждения</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {schedule.map((day, idx) => (
          <Card key={idx}>
            <CardHeader className="bg-gray-50">
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
            <CardContent className="pt-6">
              <div className="space-y-3">
                {day.slots.map((slot, slotIdx) => (
                  <div
                    key={slotIdx}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      slot.status === "Подтверждено"
                        ? "border-green-200 bg-green-50"
                        : slot.status === "Ожидание"
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-white border-2 border-current flex items-center justify-center">
                        <Icon
                          name={
                            slot.status === "Подтверждено"
                              ? "CheckCircle"
                              : slot.status === "Ожидание"
                                ? "Clock"
                                : "Calendar"
                          }
                          size={24}
                          className={
                            slot.status === "Подтверждено"
                              ? "text-green-600"
                              : slot.status === "Ожидание"
                                ? "text-yellow-600"
                                : "text-gray-400"
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#27265C] text-lg">{slot.time}</span>
                          <Badge
                            className={
                              slot.status === "Подтверждено"
                                ? "bg-green-500 text-white"
                                : slot.status === "Ожидание"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-300 text-gray-700"
                            }
                          >
                            {slot.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Icon name="FileText" size={14} />
                            Заказ: <strong>{slot.order}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Warehouse" size={14} />
                            {slot.warehouse}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {slot.status === "Ожидание" && (
                        <Button size="sm" className="bg-green-500 text-white hover:bg-green-600">
                          <Icon name="Check" size={16} className="mr-1" />
                          Подтвердить
                        </Button>
                      )}
                      {slot.status !== "Свободно" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                          onClick={() => openDetails(slot, day.date, day.day)}
                        >
                          <Icon name="Eye" size={16} className="mr-1" />
                          Детали
                        </Button>
                      )}
                      {slot.status === "Свободно" && (
                        <Button size="sm" className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90">
                          <Icon name="Plus" size={16} className="mr-1" />
                          Забронировать
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Icon name="Info" size={24} className="text-blue-600 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">Как работает график отгрузок?</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>После создания заказа выберите удобную дату и время отгрузки</li>
                <li>Заказ отправляется в 1С на согласование и резервирование товаров</li>
                <li>После подтверждения из 1С статус меняется на "Подтверждено"</li>
                <li>В день отгрузки вы получите уведомление и документы</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSlot && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#27265C] flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedSlot.slot.status === "Подтверждено"
                        ? "bg-green-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <Icon
                      name={selectedSlot.slot.status === "Подтверждено" ? "CheckCircle" : "Clock"}
                      size={22}
                      className={
                        selectedSlot.slot.status === "Подтверждено"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    />
                  </div>
                  Детали отгрузки
                </DialogTitle>
                <DialogDescription>
                  Заказ {selectedSlot.slot.order} · {selectedSlot.date}, {selectedSlot.day}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Дата и время</p>
                    <p className="font-semibold text-[#27265C]">
                      {selectedSlot.date}, {selectedSlot.slot.time}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Статус</p>
                    <Badge
                      className={
                        selectedSlot.slot.status === "Подтверждено"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }
                    >
                      {selectedSlot.slot.status}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Склад</p>
                    <p className="font-semibold text-[#27265C]">{selectedSlot.slot.warehouse}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Общий вес</p>
                    <p className="font-semibold text-[#27265C]">{selectedSlot.slot.totalWeight}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Адрес склада</p>
                  <p className="font-semibold text-[#27265C] flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="text-gray-400" />
                    {selectedSlot.slot.address}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-semibold text-[#27265C] mb-3 flex items-center gap-2">
                    <Icon name="Package" size={16} />
                    Товары в отгрузке ({selectedSlot.slot.items.length})
                  </p>
                  <div className="space-y-2">
                    {selectedSlot.slot.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#27265C] text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Арт: {item.sku}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="font-semibold text-[#27265C]">{item.qty} шт</p>
                          <p className="text-xs text-gray-500">{item.weight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-semibold text-[#27265C] mb-3 flex items-center gap-2">
                    <Icon name="Truck" size={16} />
                    Транспорт и логистика
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Водитель</p>
                      <p className="font-semibold text-[#27265C]">{selectedSlot.slot.driver}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Транспорт</p>
                      <p className="font-semibold text-[#27265C] text-sm">{selectedSlot.slot.vehicle}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Паллеты</p>
                      <p className="font-semibold text-[#27265C]">{selectedSlot.slot.pallets} шт</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Телефон склада</p>
                      <p className="font-semibold text-[#27265C]">{selectedSlot.slot.contactPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Менеджер</p>
                  <p className="font-semibold text-[#27265C]">{selectedSlot.slot.manager}</p>
                </div>

                {selectedSlot.slot.note && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-600 mb-1 flex items-center gap-1">
                      <Icon name="MessageSquare" size={12} />
                      Примечание
                    </p>
                    <p className="text-sm text-amber-900">{selectedSlot.slot.note}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Link to={`/order/${selectedSlot.slot.order}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                    >
                      <Icon name="FileText" size={16} className="mr-2" />
                      Перейти к заказу
                    </Button>
                  </Link>
                  {selectedSlot.slot.status === "Ожидание" && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold">
                      <Icon name="Check" size={16} className="mr-2" />
                      Подтвердить отгрузку
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Schedule = () => {
  const schedule = [
    {
      date: "18.12.2024",
      day: "Среда",
      slots: [
        { time: "09:00-12:00", order: "ORD-2024-1250", status: "Подтверждено", warehouse: "Склад 1" },
        { time: "14:00-17:00", order: "ORD-2024-1251", status: "Ожидание", warehouse: "Склад 1" },
      ]
    },
    {
      date: "19.12.2024",
      day: "Четверг",
      slots: [
        { time: "10:00-13:00", order: "ORD-2024-1245", status: "Подтверждено", warehouse: "Склад 2" },
      ]
    },
    {
      date: "20.12.2024",
      day: "Пятница",
      slots: [
        { time: "09:00-12:00", order: "ORD-2024-1246", status: "Подтверждено", warehouse: "Склад 2" },
        { time: "13:00-16:00", order: "—", status: "Свободно", warehouse: "Склад 1" },
      ]
    },
    {
      date: "22.12.2024",
      day: "Воскресенье",
      slots: [
        { time: "10:00-13:00", order: "ORD-2024-1247", status: "Ожидание", warehouse: "Склад 1" },
      ]
    },
  ];

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
                  {day.slots.length} {day.slots.length === 1 ? 'слот' : 'слота'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {day.slots.map((slot, slotIdx) => (
                  <div
                    key={slotIdx}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      slot.status === "Подтверждено" ? "border-green-200 bg-green-50" :
                      slot.status === "Ожидание" ? "border-yellow-200 bg-yellow-50" :
                      "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-white border-2 border-current flex items-center justify-center">
                        <Icon
                          name={
                            slot.status === "Подтверждено" ? "CheckCircle" :
                            slot.status === "Ожидание" ? "Clock" :
                            "Calendar"
                          }
                          size={24}
                          className={
                            slot.status === "Подтверждено" ? "text-green-600" :
                            slot.status === "Ожидание" ? "text-yellow-600" :
                            "text-gray-400"
                          }
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#27265C] text-lg">{slot.time}</span>
                          <Badge
                            className={
                              slot.status === "Подтверждено" ? "bg-green-500 text-white" :
                              slot.status === "Ожидание" ? "bg-yellow-500 text-white" :
                              "bg-gray-300 text-gray-700"
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
                        <Button
                          size="sm"
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          <Icon name="Check" size={16} className="mr-1" />
                          Подтвердить
                        </Button>
                      )}
                      {slot.status !== "Свободно" && (
                        <Link to={`/order/${slot.order}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                          >
                            <Icon name="Eye" size={16} className="mr-1" />
                            Детали
                          </Button>
                        </Link>
                      )}
                      {slot.status === "Свободно" && (
                        <Button
                          size="sm"
                          className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90"
                        >
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
    </div>
  );
};

export default Schedule;

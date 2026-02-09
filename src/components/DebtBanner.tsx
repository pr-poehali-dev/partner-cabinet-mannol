import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DebtInfo {
  amount: number;
  overdueDays?: number;
  isOverdue: boolean;
  isBlocked: boolean;
}

const DebtBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/debt-details/modal') {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [location]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    navigate('/debt-details/modal');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(-1);
  };
  
  const debtInfo: DebtInfo = {
    amount: 0,
    overdueDays: 0,
    isOverdue: false,
    isBlocked: false
  };

  if (!isVisible || debtInfo.amount === 0) return null;

  return (
    <div
      className={`sticky top-0 z-50 ${
        debtInfo.isOverdue
          ? "bg-gradient-to-r from-red-600 via-red-500 to-red-600"
          : "bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"
      } text-white shadow-lg animate-pulse`}
    >
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
              <Icon
                name={debtInfo.isOverdue ? "AlertTriangle" : "AlertCircle"}
                size={24}
                className="text-white"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold">
                  {debtInfo.isOverdue ? "⚠️ ВНИМАНИЕ! ПРОСРОЧЕННАЯ ЗАДОЛЖЕННОСТЬ" : "ЗАДОЛЖЕННОСТЬ"}
                </h3>
                {debtInfo.isBlocked && (
                  <span className="bg-white/30 backdrop-blur px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    🚫 ОТГРУЗКА ПРИОСТАНОВЛЕНА
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="DollarSign" size={16} />
                  <span className="font-semibold">
                    Сумма задолженности: <span className="text-2xl font-bold">₽{debtInfo.amount.toLocaleString()}</span>
                  </span>
                </div>

                {debtInfo.overdueDays && debtInfo.overdueDays > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
                    <Icon name="Clock" size={16} />
                    <span className="font-bold">
                      Просрочка: {debtInfo.overdueDays} {debtInfo.overdueDays === 1 ? "день" : "дней"}
                    </span>
                  </div>
                )}
              </div>

              {debtInfo.isBlocked && (
                <p className="mt-2 text-sm bg-white/20 backdrop-blur px-3 py-1.5 rounded inline-block">
                  Для возобновления отгрузок необходимо погасить задолженность
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/payments">
              <Button className="bg-white text-red-600 hover:bg-white/90 font-bold text-lg px-6 py-6">
                <Icon name="CreditCard" size={20} className="mr-2" />
                Погасить долг
              </Button>
            </Link>

            <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 border-2 border-white font-semibold"
                  onClick={handleOpenModal}
                >
                  <Icon name="Info" size={18} className="mr-2" />
                  Подробнее
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onEscapeKeyDown={handleCloseModal}>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-red-600 flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Icon name="AlertTriangle" size={24} className="text-red-600" />
                    </div>
                    Детали задолженности
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Полная информация по текущей задолженности
                  </DialogDescription>
                </DialogHeader>
                
                <Separator />
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <Icon name="DollarSign" size={18} />
                        <span className="text-sm font-semibold">Общая задолженность</span>
                      </div>
                      <p className="text-3xl font-bold text-red-600">₽{debtInfo.amount.toLocaleString()}</p>
                    </div>
                    
                    {debtInfo.overdueDays && debtInfo.overdueDays > 0 && (
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-orange-600 mb-2">
                          <Icon name="Clock" size={18} />
                          <span className="text-sm font-semibold">Просрочка</span>
                        </div>
                        <p className="text-3xl font-bold text-orange-600">{debtInfo.overdueDays} дней</p>
                      </div>
                    )}
                    
                    <div className={`${debtInfo.isBlocked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border-2 rounded-lg p-4`}>
                      <div className={`flex items-center gap-2 ${debtInfo.isBlocked ? 'text-red-600' : 'text-green-600'} mb-2`}>
                        <Icon name={debtInfo.isBlocked ? "XCircle" : "CheckCircle"} size={18} />
                        <span className="text-sm font-semibold">Статус отгрузок</span>
                      </div>
                      <p className={`text-lg font-bold ${debtInfo.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                        {debtInfo.isBlocked ? 'Приостановлены' : 'Активны'}
                      </p>
                    </div>
                  </div>

                  {debtInfo.isBlocked && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex items-start gap-3">
                        <Icon name="AlertTriangle" size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-900 mb-1">Отгрузка приостановлена</p>
                          <p className="text-sm text-red-800">
                            Для возобновления отгрузок необходимо погасить просроченную задолженность в размере ₽{debtInfo.amount.toLocaleString()}.
                            Все новые заказы будут приостановлены до момента оплаты.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-[#27265C] mb-3 flex items-center gap-2">
                      <Icon name="FileText" size={18} />
                      Неоплаченные счета
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#27265C]">INV-2024-1120</p>
                            <p className="text-sm text-gray-600">Выставлен: 15.11.2024 • Срок: 20.12.2024</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-red-600">₽{debtInfo.amount.toLocaleString()}</p>
                            <Badge className="bg-red-500 text-white mt-1">Просрочен</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Способы оплаты</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Банковский перевод (реквизиты в разделе "Платежи")</li>
                          <li>• Оплата по счету через личный кабинет банка</li>
                          <li>• Онлайн-оплата банковской картой</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#27265C] mb-3 flex items-center gap-2">
                      <Icon name="HelpCircle" size={18} />
                      Часто задаваемые вопросы
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="border rounded-lg p-3">
                        <p className="font-semibold text-[#27265C] mb-1">Когда будет возобновлена отгрузка?</p>
                        <p className="text-gray-700">Отгрузки возобновляются сразу после поступления платежа на наш расчетный счет (обычно в течение 1-2 часов).</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <p className="font-semibold text-[#27265C] mb-1">Можно ли оплатить частично?</p>
                        <p className="text-gray-700">Да, вы можете оплатить любую сумму. Отгрузки возобновятся после полного погашения просроченной задолженности.</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <p className="font-semibold text-[#27265C] mb-1">Как связаться с финансовым отделом?</p>
                        <p className="text-gray-700">Телефон: +7 (495) 123-45-67, доб. 2 • Email: finance@mannol.ru • Работаем пн-пт с 9:00 до 18:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex gap-2">
                    <Link to="/payments" className="flex-1">
                      <Button className="w-full bg-red-600 text-white hover:bg-red-700 font-semibold">
                        <Icon name="CreditCard" size={18} className="mr-2" />
                        Перейти к оплате
                      </Button>
                    </Link>
                    <Link to="/debt-details" className="flex-1">
                      <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                        <Icon name="FileText" size={18} className="mr-2" />
                        Полная история
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link to="/orders">
                      <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                        <Icon name="Package" size={16} className="mr-2" />
                        Заказы
                      </Button>
                    </Link>
                    <Link to="/analytics">
                      <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                        <Icon name="BarChart3" size={16} className="mr-2" />
                        Аналитика
                      </Button>
                    </Link>
                    <Link to="/catalog">
                      <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        Каталог
                      </Button>
                    </Link>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white/20"
              title="Скрыть до конца сессии"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtBanner;
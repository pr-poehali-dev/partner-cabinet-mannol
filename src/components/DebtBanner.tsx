import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface DebtInfo {
  amount: number;
  overdueDays?: number;
  isOverdue: boolean;
  isBlocked: boolean;
}

const DebtBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  const debtInfo: DebtInfo = {
    amount: 124500,
    overdueDays: 5,
    isOverdue: true,
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

            <Link to="/debt-details">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 border-2 border-white font-semibold"
              >
                <Icon name="Info" size={18} className="mr-2" />
                Подробнее
              </Button>
            </Link>

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

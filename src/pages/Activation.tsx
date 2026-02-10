import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

const Activation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#27265C] via-[#3d3b7a] to-[#27265C] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-[#FCC71E] rounded-2xl flex items-center justify-center font-bold text-[#27265C] text-3xl shadow-lg">
              M
            </div>
            <span className="font-bold text-4xl text-white">MANNOL</span>
          </div>
          <p className="text-white/80 text-lg">Партнерский портал</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                <Icon name="Clock" size={40} className="text-amber-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-[#27265C]">Аккаунт создан!</CardTitle>
            <CardDescription className="text-base">
              Ваша заявка отправлена на модерацию
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-amber-200 bg-amber-50">
              <Icon name="Info" size={18} className="text-amber-600" />
              <AlertDescription className="text-amber-800">
                Ваш аккаунт успешно создан и ожидает верификации через систему 1С. 
                Это необходимо для подтверждения ваших партнерских реквизитов.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="FileCheck" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#27265C] mb-1">Проверка данных</h3>
                  <p className="text-sm text-gray-600">
                    Наша служба безопасности проверяет введенный вами ИНН и реквизиты компании через интеграцию с 1С
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="CheckCircle" size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#27265C] mb-1">Активация аккаунта</h3>
                  <p className="text-sm text-gray-600">
                    После успешной верификации вы получите email с уведомлением об активации и получите доступ ко всем функциям личного кабинета
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Zap" size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#27265C] mb-1">Полный доступ</h3>
                  <p className="text-sm text-gray-600">
                    Каталог товаров, размещение заказов, отслеживание поставок, история покупок, аналитика и многое другое
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Clock" size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Время проверки</h4>
                    <p className="text-sm text-blue-800">
                      Обычно проверка занимает от нескольких минут до 24 часов в рабочие дни. 
                      Вы получите уведомление на email сразу после активации.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                asChild
                variant="outline"
                className="flex-1 border-[#27265C] text-[#27265C] hover:bg-gray-50"
              >
                <Link to="/support">
                  <Icon name="HelpCircle" size={18} className="mr-2" />
                  Связаться с поддержкой
                </Link>
              </Button>
              <Button 
                asChild
                className="flex-1 bg-[#27265C] hover:bg-[#27265C]/90 text-white"
              >
                <Link to="/login">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Вернуться на главную
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-white/70">
            <Link to="/support" className="hover:text-white transition-colors">
              <Icon name="HelpCircle" size={16} className="inline mr-1" />
              Поддержка
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              <Icon name="Shield" size={16} className="inline mr-1" />
              Конфиденциальность
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              <Icon name="FileText" size={16} className="inline mr-1" />
              Условия
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-white/50 text-xs">
          © 2024 MANNOL. Все права защищены.
        </div>
      </div>
    </div>
  );
};

export default Activation;

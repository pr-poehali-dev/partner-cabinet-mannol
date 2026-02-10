import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
  };

  const handleResend = () => {
    setEmailSent(false);
    setTimeout(() => setEmailSent(true), 100);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#27265C] via-[#3d3b7a] to-[#27265C] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#27265C]">Письмо отправлено</CardTitle>
                  <CardDescription>
                    Проверьте вашу почту
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Icon name="Mail" size={18} className="text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Мы отправили инструкции по восстановлению пароля на <strong>{email}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      Откройте письмо и нажмите на ссылку для сброса пароля
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      Придумайте новый надежный пароль
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      Войдите в систему с новым паролем
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <Icon name="Clock" size={18} className="text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  Ссылка для восстановления действует 24 часа. Не получили письмо? Проверьте папку "Спам"
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleResend}
                  variant="outline"
                  className="w-full border-[#27265C] text-[#27265C] hover:bg-gray-50"
                >
                  <Icon name="RefreshCw" size={18} className="mr-2" />
                  Отправить письмо повторно
                </Button>

                <Button
                  asChild
                  className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white"
                >
                  <Link to="/login">
                    <Icon name="ArrowLeft" size={18} className="mr-2" />
                    Вернуться к входу
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
            </div>
          </div>

          <div className="mt-6 text-center text-white/50 text-xs">
            © 2024 MANNOL. Все права защищены.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#27265C] via-[#3d3b7a] to-[#27265C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[#FCC71E] rounded-full flex items-center justify-center">
                <Icon name="KeyRound" size={24} className="text-[#27265C]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#27265C]">Восстановление пароля</CardTitle>
                <CardDescription>
                  Введите email для получения инструкций
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Icon name="Info" size={18} className="text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Мы отправим вам ссылку для создания нового пароля на указанный email
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#27265C] font-semibold">
                  Email адрес
                </Label>
                <div className="relative">
                  <Icon 
                    name="Mail" 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#27265C] focus:ring-[#27265C]"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Укажите email, который вы использовали при регистрации
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white font-semibold py-6 text-base"
              >
                <Icon name="Send" size={18} className="mr-2" />
                Отправить инструкции
              </Button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Вспомнили пароль?
                </p>
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  className="text-[#27265C] hover:text-[#FCC71E] font-semibold"
                >
                  <Link to="/login">
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Вернуться к входу
                  </Link>
                </Button>
              </div>
            </form>
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

export default ForgotPassword;

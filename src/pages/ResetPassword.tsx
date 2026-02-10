import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }
    
    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#27265C] via-[#3d3b7a] to-[#27265C] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardContent className="pt-6">
              <Alert className="border-red-200 bg-red-50">
                <Icon name="XCircle" size={18} className="text-red-600" />
                <AlertDescription className="text-red-800">
                  Недействительная ссылка для сброса пароля. Запросите новую ссылку.
                </AlertDescription>
              </Alert>
              <Button
                asChild
                className="w-full mt-4 bg-[#27265C] hover:bg-[#27265C]/90 text-white"
              >
                <Link to="/forgot-password">
                  Запросить новую ссылку
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
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
            <CardHeader className="space-y-1 pb-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={40} className="text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-[#27265C]">Пароль изменен!</CardTitle>
              <CardDescription className="text-base">
                Вы можете войти с новым паролем
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-emerald-200 bg-emerald-50">
                <Icon name="CheckCircle" size={18} className="text-emerald-600" />
                <AlertDescription className="text-emerald-800">
                  Ваш пароль успешно обновлен. Сейчас вы будете перенаправлены на страницу входа.
                </AlertDescription>
              </Alert>

              <Button
                asChild
                className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white"
              >
                <Link to="/login">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти в систему
                </Link>
              </Button>
            </CardContent>
          </Card>
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
                <Icon name="Lock" size={24} className="text-[#27265C]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#27265C]">Создание нового пароля</CardTitle>
                <CardDescription>
                  Введите новый надежный пароль
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Icon name="Info" size={18} className="text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Пароль должен содержать минимум 6 символов. Рекомендуем использовать буквы, цифры и специальные символы.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#27265C] font-semibold">
                  Новый пароль
                </Label>
                <div className="relative">
                  <Icon 
                    name="Lock" 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Минимум 6 символов"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-[#27265C] focus:ring-[#27265C]`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm" className="text-[#27265C] font-semibold">
                  Подтверждение пароля
                </Label>
                <div className="relative">
                  <Icon 
                    name="Lock" 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                  />
                  <Input
                    id="passwordConfirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="Повторите пароль"
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      if (errors.passwordConfirm) setErrors(prev => ({ ...prev, passwordConfirm: '' }));
                    }}
                    className={`pl-10 pr-10 ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'} focus:border-[#27265C] focus:ring-[#27265C]`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon name={showPasswordConfirm ? "EyeOff" : "Eye"} size={18} />
                  </button>
                </div>
                {errors.passwordConfirm && <p className="text-xs text-red-500">{errors.passwordConfirm}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white font-semibold py-6 text-base"
              >
                <Icon name="Check" size={18} className="mr-2" />
                Сохранить новый пароль
              </Button>

              <div className="text-center pt-4 border-t border-gray-200">
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  className="text-gray-600"
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
          </div>
        </div>

        <div className="mt-6 text-center text-white/50 text-xs">
          © 2024 MANNOL. Все права защищены.
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

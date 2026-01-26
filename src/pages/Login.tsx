import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

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
            <CardTitle className="text-2xl font-bold text-[#27265C]">Вход в систему</CardTitle>
            <CardDescription>
              Введите ваши учетные данные для доступа к личному кабинету
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#27265C] font-semibold">
                  Email или логин
                </Label>
                <div className="relative">
                  <Icon 
                    name="Mail" 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                  />
                  <Input
                    id="email"
                    type="text"
                    placeholder="partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#27265C] focus:ring-[#27265C]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#27265C] font-semibold">
                    Пароль
                  </Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-[#27265C] hover:text-[#FCC71E] transition-colors"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <div className="relative">
                  <Icon 
                    name="Lock" 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus:border-[#27265C] focus:ring-[#27265C]"
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
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Запомнить меня
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white font-semibold py-6 text-base"
              >
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти в систему
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">или</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Icon name="Chrome" size={18} className="mr-2" />
                  Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Icon name="Key" size={18} className="mr-2" />
                  1С
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Нет аккаунта?{" "}
                <Link 
                  to="/register" 
                  className="text-[#27265C] hover:text-[#FCC71E] font-semibold transition-colors"
                >
                  Зарегистрироваться
                </Link>
              </p>
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

export default Login;

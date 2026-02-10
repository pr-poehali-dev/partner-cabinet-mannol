import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

const RegisterVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your-email@example.com";
  
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length === 6) {
      navigate("/activation");
    }
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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[#FCC71E] rounded-full flex items-center justify-center">
                <Icon name="Mail" size={24} className="text-[#27265C]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#27265C]">Подтверждение email</CardTitle>
                <CardDescription>
                  Код отправлен на {email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerification} className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Icon name="Info" size={18} className="text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Введите 6-значный код из письма для подтверждения регистрации
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-[#27265C] font-semibold">
                  Код подтверждения
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest font-mono border-gray-300 focus:border-[#27265C] focus:ring-[#27265C]"
                  maxLength={6}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white font-semibold py-6 text-base"
                disabled={verificationCode.length !== 6}
              >
                <Icon name="CheckCircle" size={18} className="mr-2" />
                Подтвердить email
              </Button>

              <div className="text-center">
                <Button 
                  type="button"
                  variant="ghost"
                  className="text-[#27265C] hover:text-[#FCC71E]"
                >
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Отправить код повторно
                </Button>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  className="text-gray-600"
                >
                  <Link to="/register">
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Вернуться к регистрации
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

export default RegisterVerify;

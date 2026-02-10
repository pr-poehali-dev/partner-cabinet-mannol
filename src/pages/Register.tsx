import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    fullName: "",
    phone: "",
    company: "",
    inn: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Некорректный email';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }
    
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Пароли не совпадают';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Обязательное поле';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Обязательное поле';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Обязательное поле';
    }
    
    if (!/^\d{10,12}$/.test(formData.inn)) {
      newErrors.inn = 'ИНН должен содержать 10 или 12 цифр';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      navigate('/register/verify', { state: { email: formData.email } });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-[#27265C]">Регистрация партнера</CardTitle>
            <CardDescription>
              Заполните форму для создания аккаунта в партнерской программе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#27265C] font-semibold">
                    Email *
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
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-[#27265C] focus:ring-[#27265C]`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#27265C] font-semibold">
                    ФИО *
                  </Label>
                  <div className="relative">
                    <Icon 
                      name="User" 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Иванов Иван Иванович"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className={`pl-10 ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:border-[#27265C] focus:ring-[#27265C]`}
                      required
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#27265C] font-semibold">
                    Пароль *
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
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
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
                    Подтверждение пароля *
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
                      value={formData.passwordConfirm}
                      onChange={(e) => updateField('passwordConfirm', e.target.value)}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#27265C] font-semibold">
                    Номер телефона *
                  </Label>
                  <div className="relative">
                    <Icon 
                      name="Phone" 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-[#27265C] focus:ring-[#27265C]`}
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-[#27265C] font-semibold">
                    Компания *
                  </Label>
                  <div className="relative">
                    <Icon 
                      name="Building" 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="company"
                      type="text"
                      placeholder="ООО Ваша компания"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      className={`pl-10 ${errors.company ? 'border-red-500' : 'border-gray-300'} focus:border-[#27265C] focus:ring-[#27265C]`}
                      required
                    />
                  </div>
                  {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inn" className="text-[#27265C] font-semibold">
                  ИНН *
                </Label>
                <div className="relative">
                  <Icon 
                    name="FileText" 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                  />
                  <Input
                    id="inn"
                    type="text"
                    placeholder="1234567890 или 123456789012"
                    value={formData.inn}
                    onChange={(e) => updateField('inn', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className={`pl-10 ${errors.inn ? 'border-red-500' : 'border-gray-300'} focus:border-[#27265C] focus:ring-[#27265C]`}
                    required
                  />
                </div>
                {errors.inn && <p className="text-xs text-red-500">{errors.inn}</p>}
                <p className="text-xs text-gray-500">10 цифр для юридических лиц, 12 для ИП</p>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <Icon name="Info" size={18} className="text-amber-600" />
                <AlertDescription className="text-amber-800">
                  После регистрации на вашу почту придет код подтверждения. 
                  Доступ к личному кабинету откроется после верификации ИНН службой безопасности.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white font-semibold py-6 text-base"
              >
                <Icon name="UserPlus" size={18} className="mr-2" />
                Зарегистрироваться
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Уже есть аккаунт?{" "}
                <Link 
                  to="/login" 
                  className="text-[#27265C] hover:text-[#FCC71E] font-semibold transition-colors"
                >
                  Войти
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

export default Register;

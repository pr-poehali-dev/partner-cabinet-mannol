import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    lastName: "Иванов",
    firstName: "Иван",
    middleName: "Иванович",
    email: "ivan.ivanov@example.com",
    phone: "+7 (999) 123-45-67",
    company: "ООО Автозапчасти",
    inn: "7707083893",
    position: "Менеджер по закупкам"
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePasswordField = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Здесь будет отправка данных на сервер
  };

  const handlePasswordChange = () => {
    // Здесь будет смена пароля
    setShowPasswordChange(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Профиль партнера</h1>
          <p className="text-gray-600 mt-1">Управление личными данными и настройками аккаунта</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-200 text-base px-4 py-2">
          <Icon name="CheckCircle" size={18} className="mr-2" />
          Активный партнер
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#27265C]">Личная информация</CardTitle>
                <CardDescription>Данные для связи и идентификации в системе</CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white"
                >
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-[#27265C] hover:bg-[#27265C]/90"
                  >
                    <Icon name="Save" size={16} className="mr-2" />
                    Сохранить
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#27265C] font-semibold">
                  Фамилия
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  disabled={!isEditing}
                  className="disabled:opacity-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[#27265C] font-semibold">
                  Имя
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  disabled={!isEditing}
                  className="disabled:opacity-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-[#27265C] font-semibold">
                  Отчество
                </Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => updateField('middleName', e.target.value)}
                  disabled={!isEditing}
                  className="disabled:opacity-100"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#27265C] font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Icon name="Mail" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 disabled:opacity-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#27265C] font-semibold">
                  Телефон
                </Label>
                <div className="relative">
                  <Icon name="Phone" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 disabled:opacity-100"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-[#27265C] text-lg">Компания</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-[#27265C] font-semibold">
                    Название компании
                  </Label>
                  <div className="relative">
                    <Icon name="Building" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 disabled:opacity-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inn" className="text-[#27265C] font-semibold">
                    ИНН
                  </Label>
                  <div className="relative">
                    <Icon name="Hash" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="inn"
                      value={formData.inn}
                      onChange={(e) => updateField('inn', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 disabled:opacity-100"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="position" className="text-[#27265C] font-semibold">
                    Должность
                  </Label>
                  <div className="relative">
                    <Icon name="Briefcase" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => updateField('position', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 disabled:opacity-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Безопасность</CardTitle>
              <CardDescription>Управление паролем и доступом</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showPasswordChange ? (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="Lock" size={20} className="text-gray-600" />
                      <span className="font-semibold text-[#27265C]">Пароль</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Последнее изменение: 15 января 2026
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowPasswordChange(true)}
                    >
                      <Icon name="Key" size={16} className="mr-2" />
                      Изменить пароль
                    </Button>
                  </div>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Icon name="Shield" size={18} className="text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      Используйте надёжный пароль длиной не менее 8 символов
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-[#27265C] font-semibold">
                      Текущий пароль
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                      placeholder="Введите текущий пароль"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-[#27265C] font-semibold">
                      Новый пароль
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                      placeholder="Минимум 8 символов"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#27265C] font-semibold">
                      Подтверждение
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                      placeholder="Повторите новый пароль"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowPasswordChange(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      className="flex-1 bg-[#27265C] hover:bg-[#27265C]/90"
                      onClick={handlePasswordChange}
                    >
                      Сохранить
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="ShoppingCart" size={20} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Всего заказов</span>
                </div>
                <span className="font-bold text-blue-900 text-lg">47</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="TrendingUp" size={20} className="text-green-600" />
                  <span className="text-sm font-medium text-green-900">Сумма покупок</span>
                </div>
                <span className="font-bold text-green-900 text-lg">₽2.4М</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" size={20} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">С нами с</span>
                </div>
                <span className="font-bold text-purple-900 text-lg">2022</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

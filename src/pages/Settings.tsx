import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    orderStatus: true,
    newProducts: true,
    promotions: false,
    priceChanges: true,
    stockAlerts: true,
    newsletter: false
  });

  const [preferences, setPreferences] = useState({
    language: "ru",
    dateFormat: "dd.mm.yyyy",
    currency: "RUB",
    itemsPerPage: "25"
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const updatePreference = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#27265C]">Настройки</h1>
        <p className="text-gray-600 mt-1">Персонализация портала и управление уведомлениями</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">Уведомления</CardTitle>
          <CardDescription>Настройте, какие уведомления вы хотите получать</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-start gap-3 flex-1">
                <Icon name="Package" size={20} className="text-[#27265C] mt-1" />
                <div>
                  <Label htmlFor="orderStatus" className="text-base font-semibold text-[#27265C] cursor-pointer">
                    Статус заказов
                  </Label>
                  <p className="text-sm text-gray-600">Уведомления об изменении статуса ваших заказов</p>
                </div>
              </div>
              <Switch
                id="orderStatus"
                checked={notifications.orderStatus}
                onCheckedChange={() => toggleNotification('orderStatus')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-start gap-3 flex-1">
                <Icon name="Sparkles" size={20} className="text-[#27265C] mt-1" />
                <div>
                  <Label htmlFor="newProducts" className="text-base font-semibold text-[#27265C] cursor-pointer">
                    Новые товары
                  </Label>
                  <p className="text-sm text-gray-600">Уведомления о поступлении новых продуктов</p>
                </div>
              </div>
              <Switch
                id="newProducts"
                checked={notifications.newProducts}
                onCheckedChange={() => toggleNotification('newProducts')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-start gap-3 flex-1">
                <Icon name="Tag" size={20} className="text-[#27265C] mt-1" />
                <div>
                  <Label htmlFor="promotions" className="text-base font-semibold text-[#27265C] cursor-pointer">
                    Акции и спецпредложения
                  </Label>
                  <p className="text-sm text-gray-600">Информация о скидках и специальных предложениях</p>
                </div>
              </div>
              <Switch
                id="promotions"
                checked={notifications.promotions}
                onCheckedChange={() => toggleNotification('promotions')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-start gap-3 flex-1">
                <Icon name="TrendingUp" size={20} className="text-[#27265C] mt-1" />
                <div>
                  <Label htmlFor="priceChanges" className="text-base font-semibold text-[#27265C] cursor-pointer">
                    Изменение цен
                  </Label>
                  <p className="text-sm text-gray-600">Уведомления об изменении цен на товары в корзине</p>
                </div>
              </div>
              <Switch
                id="priceChanges"
                checked={notifications.priceChanges}
                onCheckedChange={() => toggleNotification('priceChanges')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-start gap-3 flex-1">
                <Icon name="AlertCircle" size={20} className="text-[#27265C] mt-1" />
                <div>
                  <Label htmlFor="stockAlerts" className="text-base font-semibold text-[#27265C] cursor-pointer">
                    Наличие товаров
                  </Label>
                  <p className="text-sm text-gray-600">Уведомления о поступлении ожидаемых товаров</p>
                </div>
              </div>
              <Switch
                id="stockAlerts"
                checked={notifications.stockAlerts}
                onCheckedChange={() => toggleNotification('stockAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-start gap-3 flex-1">
                <Icon name="Mail" size={20} className="text-[#27265C] mt-1" />
                <div>
                  <Label htmlFor="newsletter" className="text-base font-semibold text-[#27265C] cursor-pointer">
                    Новостная рассылка
                  </Label>
                  <p className="text-sm text-gray-600">Еженедельная рассылка новостей и обновлений</p>
                </div>
              </div>
              <Switch
                id="newsletter"
                checked={notifications.newsletter}
                onCheckedChange={() => toggleNotification('newsletter')}
              />
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Icon name="Info" size={18} className="text-blue-600" />
            <AlertDescription className="text-blue-800">
              Уведомления отправляются на email, указанный в вашем профиле
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">Региональные настройки</CardTitle>
          <CardDescription>Язык, формат даты и валюта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-[#27265C] font-semibold">
                Язык интерфейса
              </Label>
              <Select value={preferences.language} onValueChange={(val) => updatePreference('language', val)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat" className="text-[#27265C] font-semibold">
                Формат даты
              </Label>
              <Select value={preferences.dateFormat} onValueChange={(val) => updatePreference('dateFormat', val)}>
                <SelectTrigger id="dateFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd.mm.yyyy">ДД.ММ.ГГГГ</SelectItem>
                  <SelectItem value="mm/dd/yyyy">ММ/ДД/ГГГГ</SelectItem>
                  <SelectItem value="yyyy-mm-dd">ГГГГ-ММ-ДД</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-[#27265C] font-semibold">
                Валюта
              </Label>
              <Select value={preferences.currency} onValueChange={(val) => updatePreference('currency', val)}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">₽ Российский рубль</SelectItem>
                  <SelectItem value="USD">$ Доллар США</SelectItem>
                  <SelectItem value="EUR">€ Евро</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemsPerPage" className="text-[#27265C] font-semibold">
                Товаров на странице
              </Label>
              <Select value={preferences.itemsPerPage} onValueChange={(val) => updatePreference('itemsPerPage', val)}>
                <SelectTrigger id="itemsPerPage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">Интеграции</CardTitle>
          <CardDescription>Подключение к внешним системам</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Icon name="Database" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">1С: Предприятие</h3>
                <p className="text-sm text-green-700">Интеграция активна</p>
              </div>
            </div>
            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
              <Icon name="Settings" size={16} className="mr-2" />
              Настроить
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Icon name="FileSpreadsheet" size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#27265C]">Excel импорт/экспорт</h3>
                <p className="text-sm text-gray-600">Не подключено</p>
              </div>
            </div>
            <Button variant="outline">
              <Icon name="Plus" size={16} className="mr-2" />
              Подключить
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">
          Сбросить настройки
        </Button>
        <Button className="bg-[#27265C] hover:bg-[#27265C]/90">
          <Icon name="Save" size={16} className="mr-2" />
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
};

export default Settings;

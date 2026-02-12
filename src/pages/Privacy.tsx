import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#27265C] rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Политика конфиденциальности</h1>
          <p className="text-gray-600">Последнее обновление: 12 февраля 2026</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">1. Общие положения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации о партнерах, 
            использующих партнерский портал MANNOL.
          </p>
          <p>
            Используя портал, вы соглашаетесь с условиями данной Политики конфиденциальности. 
            Если вы не согласны с условиями, пожалуйста, не используйте портал.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">2. Собираемая информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>Мы собираем следующие категории информации:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon name="User" size={18} className="text-[#27265C] mt-0.5" />
              <div>
                <p className="font-semibold text-[#27265C]">Личные данные</p>
                <p className="text-sm">ФИО, email, телефон, должность</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon name="Building" size={18} className="text-[#27265C] mt-0.5" />
              <div>
                <p className="font-semibold text-[#27265C]">Данные компании</p>
                <p className="text-sm">Название организации, ИНН, адрес, реквизиты</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon name="ShoppingCart" size={18} className="text-[#27265C] mt-0.5" />
              <div>
                <p className="font-semibold text-[#27265C]">Данные о заказах</p>
                <p className="text-sm">История заказов, предпочтения, статистика покупок</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon name="Activity" size={18} className="text-[#27265C] mt-0.5" />
              <div>
                <p className="font-semibold text-[#27265C]">Технические данные</p>
                <p className="text-sm">IP-адрес, cookies, история действий на портале</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">3. Использование информации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>Собранная информация используется для:</p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
              <span>Обработки и выполнения заказов</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
              <span>Предоставления технической поддержки</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
              <span>Информирования о новых продуктах и акциях</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
              <span>Улучшения качества обслуживания</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
              <span>Анализа и статистики использования портала</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">4. Защита данных</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            Мы применяем современные технические и организационные меры для защиты ваших данных от 
            несанкционированного доступа, изменения, раскрытия или уничтожения.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Lock" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-2">Меры безопасности включают:</p>
                <ul className="text-sm text-blue-800 space-y-1 ml-4">
                  <li>• Шифрование данных при передаче (SSL/TLS)</li>
                  <li>• Регулярное резервное копирование</li>
                  <li>• Ограничение доступа к персональным данным</li>
                  <li>• Регулярный аудит систем безопасности</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">5. Передача данных третьим лицам</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            Мы не передаем ваши персональные данные третьим лицам, за исключением случаев:
          </p>
          <ul className="space-y-2 ml-6">
            <li>• Когда это необходимо для выполнения заказа (логистические компании)</li>
            <li>• При наличии вашего явного согласия</li>
            <li>• По требованию государственных органов в рамках законодательства</li>
            <li>• Для интеграции с 1С (при активации соответствующей функции)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">6. Ваши права</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>Вы имеете право:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <Icon name="Eye" size={18} className="text-[#27265C] mb-2" />
              <p className="font-semibold text-[#27265C]">Доступ к данным</p>
              <p className="text-sm">Запросить копию ваших персональных данных</p>
            </div>
            <div className="p-3 border rounded-lg">
              <Icon name="Edit" size={18} className="text-[#27265C] mb-2" />
              <p className="font-semibold text-[#27265C]">Исправление</p>
              <p className="text-sm">Исправить неточные данные</p>
            </div>
            <div className="p-3 border rounded-lg">
              <Icon name="Trash" size={18} className="text-[#27265C] mb-2" />
              <p className="font-semibold text-[#27265C]">Удаление</p>
              <p className="text-sm">Запросить удаление ваших данных</p>
            </div>
            <div className="p-3 border rounded-lg">
              <Icon name="Ban" size={18} className="text-[#27265C] mb-2" />
              <p className="font-semibold text-[#27265C]">Ограничение</p>
              <p className="text-sm">Ограничить обработку данных</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">7. Контактная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>По вопросам защиты персональных данных обращайтесь:</p>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon name="Mail" size={18} className="text-[#27265C]" />
              <span>privacy@mannol.ru</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Phone" size={18} className="text-[#27265C]" />
              <span>+7 (495) 123-45-67</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;

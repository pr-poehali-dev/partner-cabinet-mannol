import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const Help = () => {
  const faqItems = [
    {
      category: "Заказы",
      icon: "ShoppingCart",
      questions: [
        {
          q: "Как оформить заказ?",
          a: "Перейдите в каталог, выберите нужные товары и их количество, затем нажмите 'Создать заказ'. Проверьте корзину и подтвердите заказ."
        },
        {
          q: "Какой минимальный заказ?",
          a: "Рекомендуется заказывать кратно паллетам для оптимизации доставки. Минимальный заказ - 1 паллета выбранного товара."
        },
        {
          q: "Можно ли отменить заказ?",
          a: "Заказ можно отменить до момента его подтверждения менеджером. После подтверждения свяжитесь с вашим менеджером."
        },
        {
          q: "Как отследить статус заказа?",
          a: "В разделе 'Заказы' вы видите все текущие и прошлые заказы с актуальными статусами и датами доставки."
        }
      ]
    },
    {
      category: "Оплата",
      icon: "CreditCard",
      questions: [
        {
          q: "Какие способы оплаты доступны?",
          a: "Вы можете скачать квитанцию в PDF с QR-кодом для онлайн-оплаты или отправить счет в систему 1С для проведения платежа."
        },
        {
          q: "Как получить счет на оплату?",
          a: "В разделе 'Оплаты' выберите нужные документы, укажите способ получения счета (PDF или 1С) и нажмите соответствующую кнопку."
        },
        {
          q: "Когда нужно оплатить заказ?",
          a: "Стандартная отсрочка платежа - 14 дней с момента отгрузки. Условия могут отличаться согласно договору."
        },
        {
          q: "Что делать при задолженности?",
          a: "В разделе 'Детали задолженности' вы увидите все неоплаченные счета. Рекомендуем погасить задолженность в указанные сроки."
        }
      ]
    },
    {
      category: "Доставка",
      icon: "Truck",
      questions: [
        {
          q: "Как работает доставка?",
          a: "Доставка осуществляется по графику. В разделе 'График поставок' вы можете забронировать удобную дату и время."
        },
        {
          q: "Сколько стоит доставка?",
          a: "Стоимость доставки рассчитывается индивидуально в зависимости от объема и адреса. Уточните у менеджера."
        },
        {
          q: "Можно ли изменить дату доставки?",
          a: "Да, вы можете изменить дату до момента подтверждения заказа менеджером. После - только через менеджера."
        }
      ]
    },
    {
      category: "Продукция",
      icon: "Package",
      questions: [
        {
          q: "Как узнать характеристики товара?",
          a: "Нажмите на кнопку Info (ℹ️) рядом с товаром в каталоге. Откроется подробная страница с описанием, характеристиками и применением."
        },
        {
          q: "Что означает 'Предзаказ'?",
          a: "Товар временно отсутствует на складе, но ожидается поставка. Вы можете оформить предзаказ - товар будет зарезервирован."
        },
        {
          q: "Как выбрать правильное масло?",
          a: "Ориентируйтесь на вязкость и спецификации производителя автомобиля. В описании товара указаны применимые стандарты."
        }
      ]
    },
    {
      category: "Личный кабинет",
      icon: "User",
      questions: [
        {
          q: "Как изменить данные профиля?",
          a: "Перейдите в 'Профиль', нажмите 'Редактировать', внесите изменения и сохраните. Изменения ИНН согласуйте с менеджером."
        },
        {
          q: "Как сменить пароль?",
          a: "В разделе 'Профиль' → 'Безопасность' нажмите 'Изменить пароль' и следуйте инструкциям."
        },
        {
          q: "Где посмотреть статистику заказов?",
          a: "В разделе 'Аналитика' доступна детальная статистика по заказам, объемам и популярным товарам."
        }
      ]
    }
  ];

  const contacts = [
    {
      title: "Менеджер отдела продаж",
      icon: "UserCircle",
      items: [
        { label: "Телефон", value: "+7 (495) 123-45-67", icon: "Phone" },
        { label: "Email", value: "sales@mannol.ru", icon: "Mail" }
      ]
    },
    {
      title: "Служба поддержки",
      icon: "Headphones",
      items: [
        { label: "Телефон", value: "+7 (800) 555-35-35", icon: "Phone" },
        { label: "Email", value: "support@mannol.ru", icon: "Mail" }
      ]
    },
    {
      title: "Техподдержка 1С",
      icon: "Settings",
      items: [
        { label: "Телефон", value: "+7 (495) 987-65-43", icon: "Phone" },
        { label: "Email", value: "1c@mannol.ru", icon: "Mail" }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#27265C]">Справка и поддержка</h1>
        <p className="text-gray-600 mt-1">Часто задаваемые вопросы и контакты службы поддержки</p>
      </div>

      <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <Icon name="Info" size={20} className="text-blue-600" />
        <AlertDescription className="ml-2 text-blue-900">
          <strong>Не нашли ответ на свой вопрос?</strong> Свяжитесь с нами любым удобным способом — мы всегда рады помочь!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {faqItems.map((category, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#27265C] rounded-lg flex items-center justify-center">
                    <Icon name={category.icon} size={20} className="text-white" />
                  </div>
                  <CardTitle className="text-[#27265C]">{category.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-2">
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`${idx}-${qIdx}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-[#27265C] font-semibold hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-[#27265C]">Контакты</CardTitle>
              <CardDescription>Свяжитесь с нами напрямую</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contacts.map((contact, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon name={contact.icon} size={18} className="text-[#27265C]" />
                    <h3 className="font-semibold text-[#27265C]">{contact.title}</h3>
                  </div>
                  <div className="space-y-2 ml-6">
                    {contact.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2 text-sm">
                        <Icon name={item.icon} size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">{item.label}</p>
                          <p className="font-medium text-gray-700">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {idx < contacts.length - 1 && <div className="border-t pt-3" />}
                </div>
              ))}

              <Button className="w-full bg-[#27265C] hover:bg-[#27265C]/90">
                <Icon name="MessageCircle" size={18} className="mr-2" />
                Написать в поддержку
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Режим работы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Icon name="Clock" size={20} className="text-green-600" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900">Пн-Пт: 9:00 - 18:00</p>
                  <p className="text-green-700">Сб-Вс: выходной</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Заказы через портал принимаются 24/7
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Payments = () => {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"pdf" | "1c" | null>(null);

  const invoices = [
    { id: "INV-2024-1120", amount: 79500, status: "Просрочен", overdueDays: 5, date: "15.01.2024" },
    { id: "INV-2024-1145", amount: 45000, status: "Текущий", overdueDays: 0, date: "28.01.2024" }
  ];

  const toggleInvoice = (id: string) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedTotal = invoices
    .filter(inv => selectedInvoices.includes(inv.id))
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleDownloadPDF = () => {
    alert(`Скачивается счет на оплату на сумму ₽${selectedTotal.toLocaleString()}`);
  };

  const handleSendTo1C = () => {
    alert(`Счет отправлен в 1С на сумму ₽${selectedTotal.toLocaleString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Оплата счетов</h1>
          <p className="text-gray-600 mt-1">Выберите счета и способ получения</p>
        </div>
        <Link to="/debt-details">
          <Button variant="outline" className="border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Выберите счета для оплаты</CardTitle>
              <CardDescription>Отметьте счета, для которых нужно сформировать документ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    onClick={() => toggleInvoice(invoice.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedInvoices.includes(invoice.id)
                        ? "border-[#FCC71E] bg-yellow-50"
                        : invoice.status === "Просрочен"
                        ? "border-red-300 bg-red-50 hover:border-red-400"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedInvoices.includes(invoice.id)
                          ? "bg-[#FCC71E] border-[#FCC71E]"
                          : "border-gray-300"
                      }`}>
                        {selectedInvoices.includes(invoice.id) && (
                          <Icon name="Check" size={16} className="text-[#27265C]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[#27265C]">{invoice.id}</h4>
                          <Badge className={invoice.status === "Просрочен" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}>
                            {invoice.status}
                          </Badge>
                          {invoice.overdueDays > 0 && (
                            <Badge className="bg-orange-500 text-white">
                              Просрочка {invoice.overdueDays} дней
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">от {invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#27265C]">₽{invoice.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C]">Способ получения счета</CardTitle>
              <CardDescription>Выберите удобный формат документа</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Icon name="Info" size={18} className="text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Счет будет сформирован на основе выбранных документов. Вы сможете оплатить его удобным способом.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("pdf")}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === "pdf"
                      ? "border-[#27265C] bg-[#27265C] text-white"
                      : "border-gray-200 hover:border-[#27265C] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === "pdf"
                        ? "bg-white border-white"
                        : "border-gray-300"
                    }`}>
                      {paymentMethod === "pdf" && (
                        <div className="w-3 h-3 bg-[#27265C] rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Icon name="FileText" size={32} className={`mb-3 ${paymentMethod === "pdf" ? "text-white" : "text-[#27265C]"}`} />
                      <h3 className="font-bold text-lg mb-2">Скачать PDF счет</h3>
                      <p className={`text-sm ${paymentMethod === "pdf" ? "text-white/80" : "text-gray-600"}`}>
                        Получите счет в формате PDF для распечатки или оплаты через банк
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("1c")}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === "1c"
                      ? "border-[#27265C] bg-[#27265C] text-white"
                      : "border-gray-200 hover:border-[#27265C] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === "1c"
                        ? "bg-white border-white"
                        : "border-gray-300"
                    }`}>
                      {paymentMethod === "1c" && (
                        <div className="w-3 h-3 bg-[#27265C] rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Icon name="Database" size={32} className={`mb-3 ${paymentMethod === "1c" ? "text-white" : "text-[#27265C]"}`} />
                      <h3 className="font-bold text-lg mb-2">Отправить в 1С</h3>
                      <p className={`text-sm ${paymentMethod === "1c" ? "text-white/80" : "text-gray-600"}`}>
                        Счет автоматически загрузится в вашу систему 1С для учета и оплаты
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {paymentMethod === "pdf" && (
                <Alert className="border-green-200 bg-green-50">
                  <Icon name="FileDown" size={18} className="text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>PDF счет</strong> — универсальный документ для оплаты через любой банк или бухгалтерию.
                  </AlertDescription>
                </Alert>
              )}

              {paymentMethod === "1c" && (
                <Alert className="border-green-200 bg-green-50">
                  <Icon name="Database" size={18} className="text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Интеграция с 1С</strong> — счет автоматически появится в системе для проведения платежа.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-[#27265C]">Сводка по счетам</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2 font-semibold">Выберите счета</p>
                  <p className="text-xs text-gray-400">Отметьте документы для формирования счета на оплату</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="FileText" size={16} className="text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">Выбрано документов:</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">{selectedInvoices.length}</div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      {invoices
                        .filter(inv => selectedInvoices.includes(inv.id))
                        .map(inv => (
                          <div key={inv.id} className="flex justify-between text-sm p-2 rounded hover:bg-gray-50">
                            <div>
                              <span className="text-gray-600 font-medium">{inv.id}</span>
                              <p className="text-xs text-gray-400">{inv.date}</p>
                            </div>
                            <span className="font-semibold text-[#27265C]">₽{inv.amount.toLocaleString()}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 bg-[#FCC71E] rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#27265C]">Итого к оплате:</span>
                    </div>
                    <div className="text-3xl font-bold text-[#27265C]">₽{selectedTotal.toLocaleString()}</div>
                  </div>

                  {!paymentMethod && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Icon name="AlertCircle" size={18} className="text-amber-600" />
                      <AlertDescription className="text-amber-800 text-sm">
                        Выберите способ получения счета
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentMethod === "pdf" && (
                    <Button
                      onClick={handleDownloadPDF}
                      className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white font-bold text-base h-14"
                    >
                      <Icon name="FileDown" size={20} className="mr-2" />
                      Скачать счет PDF
                    </Button>
                  )}

                  {paymentMethod === "1c" && (
                    <Button
                      onClick={handleSendTo1C}
                      className="w-full bg-[#27265C] hover:bg-[#27265C]/90 text-white font-bold text-base h-14"
                    >
                      <Icon name="Send" size={20} className="mr-2" />
                      Отправить в 1С
                    </Button>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    После получения счета вы сможете оплатить его удобным способом
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C] text-sm flex items-center gap-2">
                <Icon name="HelpCircle" size={16} />
                Способы оплаты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <Icon name="Building" size={16} className="text-[#27265C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#27265C] mb-1">Банковский перевод</p>
                    <p>Оплатите через банк-клиент по реквизитам из счета</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CreditCard" size={16} className="text-[#27265C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#27265C] mb-1">Наличные/терминал</p>
                    <p>Оплатите в банке с распечатанным счетом</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Database" size={16} className="text-[#27265C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#27265C] mb-1">Через 1С</p>
                    <p>Проведите платеж напрямую из вашей системы учета</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payments;

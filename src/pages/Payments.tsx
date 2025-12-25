import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Payments = () => {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const invoices = [
    { id: "INV-2024-1120", amount: 79500, status: "Просрочен", overdueDays: 5 },
    { id: "INV-2024-1145", amount: 45000, status: "Текущий", overdueDays: 0 }
  ];

  const toggleInvoice = (id: string) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedTotal = invoices
    .filter(inv => selectedInvoices.includes(inv.id))
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Оплата счетов</h1>
          <p className="text-gray-600 mt-1">Выберите счета для оплаты</p>
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
              <CardDescription>Отметьте счета которые хотите оплатить</CardDescription>
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
              <CardTitle className="text-[#27265C]">Способ оплаты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-2 hover:border-[#27265C] hover:bg-[#27265C] hover:text-white"
                >
                  <Icon name="CreditCard" size={32} />
                  <span className="font-semibold">Банковская карта</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-2 hover:border-[#27265C] hover:bg-[#27265C] hover:text-white"
                >
                  <Icon name="Building" size={32} />
                  <span className="font-semibold">Банковский перевод</span>
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label htmlFor="card-number">Номер карты</Label>
                  <Input id="card-number" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Срок действия</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-[#27265C]">Итого к оплате</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="CreditCard" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Выберите счета для оплаты</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {invoices
                      .filter(inv => selectedInvoices.includes(inv.id))
                      .map(inv => (
                        <div key={inv.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{inv.id}</span>
                          <span className="font-semibold">₽{inv.amount.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#27265C]">Всего:</span>
                    <span className="text-3xl font-bold text-[#27265C]">₽{selectedTotal.toLocaleString()}</span>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-14"
                    disabled={selectedTotal === 0}
                  >
                    <Icon name="CheckCircle" size={20} className="mr-2" />
                    Оплатить ₽{selectedTotal.toLocaleString()}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с условиями оплаты
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#27265C] text-sm">Безопасность</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Icon name="Shield" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600">
                  <p className="mb-2">Ваши платежные данные защищены по стандарту PCI DSS.</p>
                  <p>Все транзакции проходят через защищенное соединение.</p>
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

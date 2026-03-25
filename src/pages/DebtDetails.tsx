import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const DebtDetails = () => {
  const debtInfo = {
    totalDebt: 124500,
    currentDebt: 45000,
    overdueDebt: 79500,
    overdueDays: 5,
    isBlocked: false
  };

  const invoices = [
    { id: "INV-2024-1120", date: "15.11.2024", dueDate: "20.12.2024", amount: 79500, status: "Просрочен", overdueDays: 5 },
    { id: "INV-2024-1145", date: "01.12.2024", dueDate: "28.12.2024", amount: 45000, status: "Текущий", overdueDays: 0 }
  ];

  const paymentHistory = [
    { date: "10.12.2024", amount: 150000, invoice: "INV-2024-1089", status: "Проведен" },
    { date: "25.11.2024", amount: 95000, invoice: "INV-2024-1045", status: "Проведен" },
    { date: "15.11.2024", amount: 120000, invoice: "INV-2024-1012", status: "Проведен" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#27265C]">Задолженность</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Детальная информация по дебиторской задолженности</p>
        </div>
        <Link to="/payments">
          <Button className="bg-red-600 text-white hover:bg-red-700 font-bold text-sm md:text-lg px-4 md:px-6 w-full sm:w-auto">
            <Icon name="CreditCard" size={18} className="mr-2" />
            Погасить долг
          </Button>
        </Link>
      </div>

      {debtInfo.overdueDebt > 0 && (
        <Card className="border-2 border-red-500 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="AlertTriangle" size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">⚠️ Просроченная задолженность</h3>
                <p className="text-red-800 mb-4">
                  У вас имеется просроченная задолженность на сумму <span className="font-bold text-2xl">₽{debtInfo.overdueDebt.toLocaleString()}</span>. 
                  Просрочка составляет {debtInfo.overdueDays} дней.
                </p>
                {debtInfo.isBlocked && (
                  <div className="bg-white/50 border border-red-300 rounded-lg p-3">
                    <p className="text-red-900 font-semibold">
                      🚫 Отгрузка товаров приостановлена до полного погашения задолженности
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-[#27265C]">Общая задолженность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">₽{debtInfo.totalDebt.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">Требует оплаты</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-[#27265C]">Просроченная</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">₽{debtInfo.overdueDebt.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">Просрочка {debtInfo.overdueDays} дней</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-[#27265C]">Текущая</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">₽{debtInfo.currentDebt.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">Не просрочена</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">Неоплаченные счета</CardTitle>
          <CardDescription>Список счетов требующих оплаты</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className={`p-4 rounded-lg border-2 ${
                  invoice.status === "Просрочен"
                    ? "bg-red-50 border-red-300"
                    : "bg-blue-50 border-blue-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-bold text-[#27265C]">{invoice.id}</h4>
                      <Badge
                        className={
                          invoice.status === "Просрочен"
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                        }
                      >
                        {invoice.status}
                      </Badge>
                      {invoice.overdueDays > 0 && (
                        <Badge className="bg-orange-500 text-white">
                          Просрочка {invoice.overdueDays} дней
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Дата выставления</p>
                        <p className="font-semibold text-[#27265C]">{invoice.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Срок оплаты</p>
                        <p className="font-semibold text-[#27265C]">{invoice.dueDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                    <div className="text-xl sm:text-2xl font-bold text-[#27265C]">₽{invoice.amount.toLocaleString()}</div>
                    <Link to="/payments">
                      <Button
                        size="sm"
                        className={`${
                          invoice.status === "Просрочен"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white font-semibold`}
                      >
                        Оплатить
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#27265C]">История платежей</CardTitle>
          <CardDescription>Последние проведенные платежи</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentHistory.map((payment, idx) => (
              <div key={idx} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="CheckCircle" size={20} className="text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#27265C] truncate">{payment.invoice}</p>
                    <p className="text-sm text-gray-500">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-green-600">₽{payment.amount.toLocaleString()}</p>
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebtDetails;
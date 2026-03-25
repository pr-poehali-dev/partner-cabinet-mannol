import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(n);
}

/* ─── данные синхронизированы с Payments.tsx ─── */
const INVOICES = [
  {
    id: "INV-2026-0042",
    date: "10.01.2026",
    dueDate: "10.02.2026",
    amount: 410000,
    status: "overdue" as const,
    overdueDays: 14,
    order: "ORD-2026-0185",
  },
  {
    id: "INV-2026-0051",
    date: "01.02.2026",
    dueDate: "01.03.2026",
    amount: 256000,
    status: "current" as const,
    overdueDays: 0,
    order: "ORD-2026-0194",
  },
];

const PAYMENT_HISTORY = [
  { date: "20.01.2026", amount: 380000, invoice: "INV-2026-0038", method: "Банковский перевод" },
  { date: "05.01.2026", amount: 215000, invoice: "INV-2026-0031", method: "Банковский перевод" },
  { date: "18.12.2025", amount: 490000, invoice: "INV-2025-0124", method: "Банковский перевод" },
];

const overdueAmount = INVOICES.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
const currentAmount = INVOICES.filter(i => i.status === "current").reduce((s, i) => s + i.amount, 0);
const totalAmount = overdueAmount + currentAmount;

export default function DebtDetails() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#27265C]">Задолженность</h1>
          <p className="text-muted-foreground mt-1 text-sm">Дебиторская задолженность по счетам</p>
        </div>
        <Link to="/payments">
          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 px-5">
            <Icon name="CreditCard" size={16} className="mr-2" />
            Оплатить счета
          </Button>
        </Link>
      </div>

      {/* Overdue alert */}
      {overdueAmount > 0 && (
        <Card className="border-2 border-red-300 rounded-2xl bg-red-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <Icon name="AlertTriangle" size={18} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-red-800 mb-1">Просроченная задолженность</p>
                <p className="text-sm text-red-700 mb-3">
                  Просрочка {INVOICES.find(i => i.status === "overdue")?.overdueDays} дней.
                  Во избежание блокировки отгрузок оплатите счёт как можно скорее.
                </p>
                <p className="text-2xl font-extrabold text-red-700">{fmt(overdueAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#27265C]/8 flex items-center justify-center flex-shrink-0">
                <Icon name="Banknote" size={17} className="text-[#27265C]" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Всего</p>
            </div>
            <p className="text-2xl font-extrabold text-[#27265C]">{fmt(totalAmount)}</p>
          </CardContent>
        </Card>
        <Card className="border border-red-200 rounded-2xl shadow-sm bg-red-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <Icon name="AlertCircle" size={17} className="text-red-600" />
              </div>
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Просрочено</p>
            </div>
            <p className="text-2xl font-extrabold text-red-700">{fmt(overdueAmount)}</p>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Icon name="Clock" size={17} className="text-amber-600" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Текущее</p>
            </div>
            <p className="text-2xl font-extrabold text-[#27265C]">{fmt(currentAmount)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices table */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-[#F0F0F0] bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#27265C]/8 flex items-center justify-center">
                <Icon name="FileText" size={15} className="text-[#27265C]" />
              </div>
              <CardTitle className="text-base font-semibold text-[#27265C]">Неоплаченные счета</CardTitle>
            </div>
            <Link to="/payments">
              <Button size="sm" className="h-8 px-3 bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-semibold text-xs">
                <Icon name="CreditCard" size={13} className="mr-1.5" />
                Оплатить
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 whitespace-nowrap">Счёт</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 whitespace-nowrap">Заказ</th>
                  <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 whitespace-nowrap">Срок оплаты</th>
                  <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 whitespace-nowrap">Статус</th>
                  <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 whitespace-nowrap">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F4]">
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className={`hover:bg-[#FAFAFA] transition-colors ${inv.status === "overdue" ? "bg-red-50/40" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#27265C]">{inv.id}</p>
                      <p className="text-xs text-muted-foreground">от {inv.date}</p>
                    </td>
                    <td className="px-3 py-4">
                      <Link to={`/order/${inv.order}`} className="text-sm font-medium text-[#27265C] hover:underline">
                        {inv.order}
                      </Link>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <p className="text-sm font-medium text-[#27265C]">{inv.dueDate}</p>
                      {inv.status === "overdue" && (
                        <p className="text-xs text-red-500 font-semibold">просрочен {inv.overdueDays} дн.</p>
                      )}
                    </td>
                    <td className="px-3 py-4 text-center">
                      {inv.status === "overdue" ? (
                        <Badge className="bg-red-100 text-red-700 border-0 font-semibold">Просрочен</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 border-0 font-semibold">Текущий</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className={`text-base font-extrabold ${inv.status === "overdue" ? "text-red-600" : "text-[#27265C]"}`}>
                        {fmt(inv.amount)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Icon name="CheckCircle" size={15} className="text-emerald-600" />
            </div>
            <CardTitle className="text-base font-semibold text-[#27265C]">История платежей</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div className="divide-y divide-[#F4F4F4]">
            {PAYMENT_HISTORY.map((p, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={14} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#27265C]">{p.invoice}</p>
                    <p className="text-xs text-muted-foreground">{p.date} · {p.method}</p>
                  </div>
                </div>
                <p className="text-base font-bold text-emerald-600 flex-shrink-0">{fmt(p.amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

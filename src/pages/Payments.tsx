import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(n);
}

/* ─── синхронизировано с DebtDetails.tsx ─── */
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

export default function Payments() {
  const [selected, setSelected] = useState<string[]>(["INV-2026-0042"]); // просроченный выбран по умолчанию
  const [sent, setSent] = useState(false);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const selectAll = () => setSelected(INVOICES.map((i) => i.id));
  const clearAll  = () => setSelected([]);

  const selectedInvoices = INVOICES.filter((i) => selected.includes(i.id));
  const total = selectedInvoices.reduce((s, i) => s + i.amount, 0);

  function handleDownload() {
    if (selected.length === 0) { toast.error("Выберите хотя бы один счёт"); return; }
    toast.success("Счёт сформирован", { description: `PDF на ${fmt(total)} готов к скачиванию` });
  }

  function handleSend1C() {
    if (selected.length === 0) { toast.error("Выберите хотя бы один счёт"); return; }
    setSent(true);
    toast.success("Отправлено в 1С", { description: `Счёт на ${fmt(total)} передан в бухгалтерию` });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/debt-details" className="hover:text-[#27265C] font-medium transition-colors">Задолженность</Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <span className="text-[#27265C] font-semibold">Оплата счетов</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#27265C]">Оплата счетов</h1>
        <p className="text-sm text-muted-foreground mt-1">Выберите счета для формирования платёжного документа</p>
      </div>

      {/* Invoice selection */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-[#F0F0F0]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#27265C]">Счета к оплате</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-[#27265C]/60 hover:text-[#27265C]" onClick={selectAll}>Выбрать все</Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-[#27265C]/60 hover:text-[#27265C]" onClick={clearAll}>Сбросить</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div className="divide-y divide-[#F4F4F4]">
            {INVOICES.map((inv) => {
              const isSelected = selected.includes(inv.id);
              return (
                <div
                  key={inv.id}
                  className={`flex items-start gap-4 px-6 py-5 cursor-pointer transition-colors ${
                    isSelected ? "bg-[#FFF9E6]" : "hover:bg-[#FAFAFA]"
                  }`}
                  onClick={() => toggle(inv.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggle(inv.id)}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-sm font-bold text-[#27265C]">{inv.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          от {inv.date} · срок {inv.dueDate}
                        </p>
                        <Link
                          to={`/order/${inv.order}`}
                          className="text-xs text-[#27265C]/60 hover:text-[#27265C] hover:underline mt-0.5 inline-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {inv.order}
                        </Link>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg font-extrabold ${inv.status === "overdue" ? "text-red-600" : "text-[#27265C]"}`}>
                          {fmt(inv.amount)}
                        </p>
                        {inv.status === "overdue" ? (
                          <Badge className="bg-red-100 text-red-700 border-0 text-xs font-semibold">
                            Просрочен {inv.overdueDays} дн.
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-xs font-semibold">
                            Текущий
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Total */}
      <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm">
        <CardContent className="px-6 py-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Выбрано счетов</p>
              <p className="text-xs text-muted-foreground">{selected.length} из {INVOICES.length}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#27265C]">{fmt(total)}</p>
              <p className="text-xs text-muted-foreground">к оплате</p>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Payment methods */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Способ получения счёта</p>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full h-12 border-[#E2E2E2] text-[#27265C] hover:bg-[#27265C]/5 hover:border-[#27265C]/40 font-medium justify-start"
              onClick={handleDownload}
              disabled={selected.length === 0}
            >
              <div className="w-8 h-8 rounded-lg bg-[#27265C]/8 flex items-center justify-center mr-3 flex-shrink-0">
                <Icon name="Download" size={16} className="text-[#27265C]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Скачать PDF</p>
                <p className="text-xs text-muted-foreground font-normal">Счёт для самостоятельной оплаты</p>
              </div>
            </Button>

            <Button
              className={`w-full h-12 font-medium justify-start shadow-none ${
                sent
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 cursor-default"
                  : "bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C]"
              }`}
              onClick={handleSend1C}
              disabled={selected.length === 0 || sent}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${sent ? "bg-emerald-200" : "bg-[#27265C]/10"}`}>
                <Icon name={sent ? "CheckCircle" : "Send"} size={16} className={sent ? "text-emerald-700" : "text-[#27265C]"} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">{sent ? "Отправлено в 1С" : "Отправить в 1С"}</p>
                <p className={`text-xs font-normal ${sent ? "text-emerald-600" : "text-[#27265C]/70"}`}>
                  {sent ? "Бухгалтерия получила счёт" : "Передать напрямую в бухгалтерию"}
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back */}
      <div className="flex justify-start">
        <Link to="/debt-details">
          <Button variant="ghost" className="text-[#27265C]/60 hover:text-[#27265C] hover:bg-[#27265C]/5 h-10">
            <Icon name="ArrowLeft" size={15} className="mr-2" />
            К задолженности
          </Button>
        </Link>
      </div>
    </div>
  );
}

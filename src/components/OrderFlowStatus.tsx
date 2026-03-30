import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export type OrderFlowStep =
  | "draft"
  | "new"
  | "send"
  | "review"
  | "adjust"
  | "confirm"
  | "success";

interface Step {
  key: OrderFlowStep;
  label: string;
  icon: string;
  description: string;
}

const STEPS: Step[] = [
  { key: "new",     label: "Составление",    icon: "FileEdit",    description: "Выбор товаров и параметров заказа" },
  { key: "send",    label: "Отправка",        icon: "Send",        description: "Проверка и отправка менеджеру" },
  { key: "review",  label: "На согласовании", icon: "ClipboardList", description: "Менеджер рассматривает заказ" },
  { key: "adjust",  label: "Корректировка",   icon: "Pencil",      description: "Уточнение позиций при необходимости" },
  { key: "confirm", label: "Подтверждение",   icon: "CheckCircle", description: "Финальное подтверждение заказа" },
  { key: "success", label: "Принят",          icon: "PackageCheck","description": "Заказ передан в работу на склад" },
];

const STEP_INDEX: Record<OrderFlowStep, number> = {
  draft:   -1,
  new:      0,
  send:     1,
  review:   2,
  adjust:   3,
  confirm:  4,
  success:  5,
};

interface OrderFlowStatusProps {
  current: OrderFlowStep;
  orderId?: string;
  compact?: boolean;
}

export default function OrderFlowStatus({ current, orderId, compact = false }: OrderFlowStatusProps) {
  const currentIdx = STEP_INDEX[current];

  if (current === "draft") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
        <Icon name="FileEdit" size={15} />
        <span className="font-medium">Черновик</span>
        <span className="text-slate-400">— не отправлен</span>
      </div>
    );
  }

  if (compact) {
    const step = STEPS[currentIdx];
    if (!step) return null;
    const isDone = current === "success";
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
        isDone
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-[#27265C]/5 border-[#27265C]/15 text-[#27265C]"
      }`}>
        <Icon name={step.icon as never} size={14} />
        <span>{step.label}</span>
        <span className="text-xs opacity-60">({currentIdx + 1}/{STEPS.length})</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile: vertical compact list */}
      <div className="flex flex-col gap-0 sm:hidden">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isFuture = idx > currentIdx;

          return (
            <div key={step.key} className="flex items-start gap-3">
              {/* connector line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                    ? "bg-[#27265C] border-[#27265C] text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-300"
                }`}>
                  {isDone
                    ? <Icon name="Check" size={14} />
                    : <Icon name={step.icon as never} size={14} />
                  }
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-0.5 h-6 mt-1 ${isDone ? "bg-emerald-300" : "bg-gray-200"}`} />
                )}
              </div>
              <div className={`pb-4 pt-1 ${isFuture ? "opacity-40" : ""}`}>
                <p className={`text-sm font-semibold leading-tight ${isActive ? "text-[#27265C]" : isDone ? "text-emerald-700" : "text-gray-400"}`}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="hidden sm:flex items-start gap-0">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isFuture = idx > currentIdx;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.key} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                {/* circle + line */}
                <div className="flex items-center w-full">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all z-10 ${
                    isDone
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                      : isActive
                      ? "bg-[#27265C] border-[#27265C] text-white shadow-lg ring-4 ring-[#27265C]/10"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}>
                    {isDone
                      ? <Icon name="Check" size={15} />
                      : <Icon name={step.icon as never} size={15} />
                    }
                  </div>
                  {!isLast && (
                    <div className={`h-0.5 flex-1 mx-1 transition-all ${isDone ? "bg-emerald-400" : "bg-gray-200"}`} />
                  )}
                </div>
                {/* label */}
                <div className={`mt-2 text-center px-1 w-full ${isFuture ? "opacity-40" : ""}`}>
                  <p className={`text-xs font-semibold leading-tight whitespace-nowrap overflow-hidden text-ellipsis ${
                    isActive ? "text-[#27265C]" : isDone ? "text-emerald-700" : "text-gray-400"
                  }`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden md:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import OrderFlowStatus from "@/components/OrderFlowStatus";

type SuccessType = "sent" | "adjusted" | "confirmed";

const CONFIGS: Record<
  SuccessType,
  {
    icon: string;
    iconBg: string;
    iconColor: string;
    ringColor: string;
    title: string;
    description: string;
    nextLabel: string;
    nextTo: (orderId: string) => string;
    secondaryLabel?: string;
    secondaryTo?: (orderId: string) => string;
  }
> = {
  sent: {
    icon: "Send",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    ringColor: "ring-blue-100",
    title: "Заказ отправлен на согласование",
    description:
      "Менеджер получил ваш заказ и рассмотрит его в течение 1–2 рабочих дней. Мы уведомим вас о результатах.",
    nextLabel: "Перейти к заказу",
    nextTo: (id) => `/order/${id}`,
    secondaryLabel: "Все заказы",
    secondaryTo: () => "/orders",
  },
  adjusted: {
    icon: "PackagePlus",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    ringColor: "ring-purple-100",
    title: "Дозаказ отправлен",
    description:
      "Дополнительные позиции добавлены и переданы менеджеру. Перейдите к финальному подтверждению заказа.",
    nextLabel: "Подтвердить заказ",
    nextTo: (id) => `/order/${id}/confirm`,
    secondaryLabel: "К деталям заказа",
    secondaryTo: (id) => `/order/${id}`,
  },
  confirmed: {
    icon: "CheckCircle2",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    ringColor: "ring-emerald-100",
    title: "Заказ подтверждён",
    description:
      "Заказ передан в график отгрузки. Ожидайте уведомления о дате отправки.",
    nextLabel: "Перейти к заказу",
    nextTo: (id) => `/order/${id}`,
    secondaryLabel: "Все заказы",
    secondaryTo: () => "/orders",
  },
};

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") as SuccessType) || "sent";
  const config = CONFIGS[type] || CONFIGS.sent;
  const id = orderId || "";

  const flowStep = type === "confirmed" ? "success" : type === "adjusted" ? "adjust" : "review";

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">

      {/* Order Flow Progress */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl px-4 md:px-6 py-4 shadow-sm">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Этапы оформления заказа
        </p>
        <OrderFlowStatus current={flowStep} />
      </div>

      {/* Success card */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-10 text-center">
          <div className={`w-20 h-20 ${config.iconBg} ring-8 ${config.ringColor} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
            <Icon name={config.icon as never} size={36} className={config.iconColor} />
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#27265C] mb-3">{config.title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            {config.description}
          </p>
        </div>

        <div className="border-t border-[#F0F0F0] px-6 py-4 bg-[#FAFAFA]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Номер заказа
            </span>
            <span className="text-sm font-bold text-[#27265C] font-mono">{id}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          asChild
          className="bg-[#FCC71E] hover:bg-[#e6b41a] text-[#27265C] font-bold h-12 rounded-xl text-[15px]"
        >
          <Link to={config.nextTo(id)}>
            <Icon name="ArrowRight" size={16} className="mr-2" />
            {config.nextLabel}
          </Link>
        </Button>

        {config.secondaryLabel && config.secondaryTo && (
          <Button
            asChild
            variant="outline"
            className="border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 h-12 rounded-xl font-medium"
          >
            <Link to={config.secondaryTo(id)}>
              {config.secondaryLabel}
            </Link>
          </Button>
        )}

        <Link to="/orders" className="text-center text-sm text-muted-foreground hover:text-[#27265C] transition-colors py-1">
          Вернуться ко всем заказам
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

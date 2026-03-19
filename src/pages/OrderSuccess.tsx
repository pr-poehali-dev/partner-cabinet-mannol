import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

type SuccessType = "sent" | "adjusted" | "confirmed";

const CONFIGS: Record<
  SuccessType,
  {
    icon: string;
    iconBg: string;
    iconColor: string;
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
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
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
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
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
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
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

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div
          className={`w-20 h-20 ${config.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-6`}
        >
          <Icon name={config.icon} className={`w-10 h-10 ${config.iconColor}`} />
        </div>

        <h1 className="text-2xl font-bold text-[#27265C] mb-3">{config.title}</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {config.description}
        </p>

        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-8 text-left shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              Заказ
            </span>
            <span className="text-sm font-semibold text-[#27265C]">{id}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="bg-[#27265C] hover:bg-[#27265C]/90 text-white h-12 rounded-xl"
          >
            <Link to={config.nextTo(id)}>
              {config.nextLabel}
            </Link>
          </Button>

          {config.secondaryLabel && config.secondaryTo && (
            <Button
              asChild
              variant="ghost"
              className="text-gray-500 hover:text-[#27265C] h-12"
            >
              <Link to={config.secondaryTo(id)}>
                {config.secondaryLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface Promotion {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  link: string;
  color: string;
}

interface PromotionBannerProps {
  promotions: Promotion[];
  onDismiss: (id: string) => void;
}

const PromotionBanner = ({ promotions, onDismiss }: PromotionBannerProps) => {
  if (promotions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon name="Sparkles" size={20} className="text-yellow-500" />
        <h2 className="text-lg font-bold text-[#27265C]">Закреплённые акции</h2>
      </div>
      {promotions.map(promo => (
        <Card key={promo.id} className={`border-2 ${promo.color} text-white overflow-hidden hover:shadow-xl transition-all animate-fade-in`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Gift" size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">{promo.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
                    <Icon name="Clock" size={16} />
                    <span className="text-sm font-semibold">Действует до {promo.validUntil}</span>
                  </div>
                  <Link to={promo.link}>
                    <Button className="bg-white text-[#27265C] hover:bg-white/90 font-semibold">
                      <Icon name="ArrowRight" size={16} className="mr-2" />
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(promo.id)}
                className="text-white hover:bg-white/20 flex-shrink-0"
                title="Скрыть на этот сеанс"
              >
                <Icon name="X" size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PromotionBanner;

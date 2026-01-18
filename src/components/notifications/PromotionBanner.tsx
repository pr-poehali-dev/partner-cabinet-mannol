import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-white text-[#27265C] hover:bg-white/90 font-semibold"
                        onClick={() => setSelectedPromotion(promo)}
                      >
                        <Icon name="Info" size={16} className="mr-2" />
                        Подробнее
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-[#27265C] flex items-center gap-3">
                          <div className={`w-12 h-12 ${promo.color} rounded-lg flex items-center justify-center`}>
                            <Icon name="Gift" size={24} className="text-white" />
                          </div>
                          {promo.title}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          Действует до {promo.validUntil}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Separator />
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-[#27265C] mb-2 flex items-center gap-2">
                            <Icon name="FileText" size={18} />
                            Описание акции
                          </h4>
                          <p className="text-gray-700 leading-relaxed">{promo.description}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-[#27265C] mb-3 flex items-center gap-2">
                            <Icon name="CheckCircle" size={18} />
                            Условия участия
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                              <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Акция действует для всех партнеров MANNOL</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Скидка применяется автоматически при оформлении заказа</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Можно комбинировать с другими акциями</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Бесплатная доставка при заказе от 50 000₽</span>
                            </li>
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Icon name="Calendar" size={16} />
                              <span className="text-sm">Период действия</span>
                            </div>
                            <p className="font-semibold text-[#27265C]">До {promo.validUntil}</p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Icon name="Tag" size={16} />
                              <span className="text-sm">Тип акции</span>
                            </div>
                            <Badge className="bg-[#FCC71E] text-[#27265C]">Специальное предложение</Badge>
                          </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <div className="flex items-start gap-3">
                            <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-blue-900 mb-1">Как воспользоваться?</p>
                              <p className="text-sm text-blue-800">
                                Перейдите в каталог, добавьте нужные товары в заказ. 
                                Скидка будет применена автоматически при оформлении.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Link to={promo.link} className="flex-1">
                          <Button className="w-full bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
                            <Icon name="ShoppingCart" size={18} className="mr-2" />
                            Перейти в каталог
                          </Button>
                        </Link>
                      </div>
                    </DialogContent>
                  </Dialog>
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
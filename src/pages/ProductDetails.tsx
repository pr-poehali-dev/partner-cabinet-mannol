import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { getProductById, getProductPath } from "@/data/catalogData";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const product = productId ? getProductById(productId) : null;
  const path = productId ? getProductPath(productId) : {};
  
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [quantity, setQuantity] = useState(0);

  if (!product || !path.category || !path.series) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Icon name="PackageX" size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Товар не найден</h2>
          <Link to="/catalog">
            <Button variant="outline">Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pack = product.packaging[selectedPackage];
  const palletInfo = {
    fullPallets: Math.floor(quantity / pack.palletQty),
    remainder: quantity % pack.palletQty,
    isExact: quantity % pack.palletQty === 0
  };

  const breadcrumbs = [
    { label: "Каталог", path: "/catalog" },
    { label: path.category.name, path: `/catalog/${path.category.id}` },
    { label: path.series.name, path: `/catalog/${path.category.id}/${path.series.id}` },
    { label: product.name, path: `/product/${product.id}` }
  ];

  const addToOrder = () => {
    if (quantity > 0) {
      navigate('/order/new', { 
        state: { 
          orderItems: [{
            product,
            size: pack.size,
            quantity,
            price: pack.price
          }]
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && <Icon name="ChevronRight" size={14} />}
            <Link 
              to={crumb.path}
              className="hover:text-[#27265C] font-medium"
            >
              {crumb.label}
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-3xl text-[#27265C]">{product.name}</CardTitle>
                    {product.availability === 'in-stock' && (
                      <Badge className="bg-green-100 text-green-700">В наличии</Badge>
                    )}
                    {product.availability === 'pre-order' && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Icon name="Clock" size={12} className="mr-1" />
                        Предзаказ
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">Артикул: {product.id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {path.category.name} → {path.series.name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-bold text-[#27265C] mb-3">Описание</h3>
                <p className="text-gray-700">{product.description || 'Описание отсутствует'}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-[#27265C] mb-3">Характеристики</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Вязкость</p>
                    <p className="font-mono font-bold text-[#27265C]">{product.viscosity}</p>
                  </div>
                  {product.stockLevel && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">На складе</p>
                      <p className="font-bold text-[#27265C]">{product.stockLevel} шт</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-[#27265C] mb-3">Спецификации</h3>
                <div className="flex flex-wrap gap-2">
                  {product.specifications.map((spec, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {product.features && product.features.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-bold text-[#27265C] mb-3">Преимущества</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Icon name="CheckCircle" size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {product.applications && product.applications.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-bold text-[#27265C] mb-3">Применение</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-700">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-[#27265C]">Оформить заказ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Выберите упаковку
                </label>
                <Tabs value={selectedPackage.toString()} onValueChange={(v) => setSelectedPackage(parseInt(v))}>
                  <TabsList className="grid w-full grid-cols-2 h-auto">
                    {product.packaging.map((pack, idx) => (
                      <TabsTrigger 
                        key={idx} 
                        value={idx.toString()}
                        className="data-[state=active]:bg-[#FCC71E] data-[state=active]:text-[#27265C] py-3"
                      >
                        <div className="text-center">
                          <div className="font-bold">{pack.size}</div>
                          <div className="text-xs">₽{pack.price.toLocaleString()}</div>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <Separator />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Кратность паллете</p>
                    <p>В одной паллете: <span className="font-bold">{pack.palletQty} шт</span></p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Количество (шт)
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(0, quantity - pack.palletQty))}
                  >
                    <Icon name="Minus" size={14} />
                  </Button>
                  <Input
                    type="number"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="text-center font-bold text-lg"
                    placeholder="0"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(quantity + pack.palletQty)}
                  >
                    <Icon name="Plus" size={14} />
                  </Button>
                </div>
              </div>

              {quantity > 0 && (
                <div className={`rounded-lg p-4 ${
                  palletInfo.isExact 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-orange-50 border border-orange-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <Icon 
                      name={palletInfo.isExact ? "CheckCircle" : "AlertCircle"} 
                      size={16} 
                      className={`mt-0.5 flex-shrink-0 ${
                        palletInfo.isExact ? 'text-green-600' : 'text-orange-600'
                      }`}
                    />
                    <div className={`text-sm ${
                      palletInfo.isExact ? 'text-green-800' : 'text-orange-800'
                    }`}>
                      <p className="font-semibold mb-1">
                        {palletInfo.isExact ? 'Кратно палете' : 'Не кратно палете'}
                      </p>
                      <p>
                        {palletInfo.fullPallets > 0 && `${palletInfo.fullPallets} пал.`}
                        {palletInfo.remainder > 0 && ` + ${palletInfo.remainder} шт`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Цена за единицу:</span>
                  <span className="font-semibold text-[#27265C]">₽{pack.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Количество:</span>
                  <span className="font-semibold text-[#27265C]">{quantity} шт</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-[#27265C]">Итого:</span>
                  <span className="text-2xl font-bold text-[#27265C]">
                    ₽{(quantity * pack.price).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={addToOrder}
                disabled={quantity === 0}
                className="w-full bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-bold h-12 text-lg"
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Добавить в заказ
              </Button>

              {product.availability === 'pre-order' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <Icon name="Clock" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold">Предзаказ</p>
                      <p className="mt-1">Товар доступен под заказ. Срок поставки уточняйте у менеджера.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

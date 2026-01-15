import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { catalogData, getProductPath, type Product } from "@/data/catalogData";

const Catalog = () => {
  const { categoryId, seriesId } = useParams<{ categoryId?: string; seriesId?: string }>();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState<{ [key: string]: { [size: string]: number } }>({});
  const [selectedPackaging, setSelectedPackaging] = useState<{ [key: string]: string }>({});

  const selectedCategory = categoryId ? catalogData.find(c => c.id === categoryId) : null;
  const selectedSeries = seriesId && selectedCategory 
    ? selectedCategory.series.find(s => s.id === seriesId) 
    : null;

  const displayProducts = selectedSeries?.products || [];

  const breadcrumbs = [
    { label: "Каталог", path: "/catalog" },
    ...(selectedCategory ? [{ label: selectedCategory.name, path: `/catalog/${selectedCategory.id}` }] : []),
    ...(selectedSeries ? [{ label: selectedSeries.name, path: `/catalog/${categoryId}/${seriesId}` }] : [])
  ];

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [size]: Math.max(0, quantity)
      }
    }));
  };

  const getProductQuantity = (productId: string, size: string): number => {
    return cart[productId]?.[size] || 0;
  };

  const getTotalCartAmount = (): number => {
    let total = 0;
    displayProducts.forEach(product => {
      product.packaging.forEach(pack => {
        const qty = getProductQuantity(product.id, pack.size);
        total += qty * pack.price;
      });
    });
    return total;
  };

  const getTotalCartItems = (): number => {
    let count = 0;
    Object.values(cart).forEach(sizes => {
      Object.values(sizes).forEach(qty => {
        count += qty;
      });
    });
    return count;
  };

  const getSelectedPackage = (productId: string) => {
    return selectedPackaging[productId] || '4л';
  };

  const calculatePallets = (quantity: number, palletQty: number) => {
    const pallets = quantity / palletQty;
    const fullPallets = Math.floor(pallets);
    const remainder = quantity % palletQty;
    const isExact = remainder === 0;
    
    return { pallets, fullPallets, remainder, isExact };
  };

  const createOrder = () => {
    const orderItems = [];
    displayProducts.forEach(product => {
      product.packaging.forEach(pack => {
        const qty = getProductQuantity(product.id, pack.size);
        if (qty > 0) {
          orderItems.push({
            product,
            size: pack.size,
            quantity: qty,
            price: pack.price
          });
        }
      });
    });
    
    if (orderItems.length > 0) {
      navigate('/order/new', { state: { orderItems } });
    }
  };

  const totalAmount = getTotalCartAmount();
  const totalItems = getTotalCartItems();

  return (
    <div className="flex gap-6">
      <aside className="w-72 flex-shrink-0">
        <Card className="sticky top-4">
          <CardContent className="p-4">
            <h3 className="font-bold text-[#27265C] mb-4">Категории</h3>
            <Accordion type="multiple" className="space-y-2">
              {catalogData.map(category => (
                <AccordionItem key={category.id} value={category.id} className="border-none">
                  <AccordionTrigger className="py-2 px-3 hover:bg-gray-100 rounded-lg text-sm font-semibold text-[#27265C]">
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-2">
                    <div className="space-y-1 ml-2">
                      {category.series.map(series => (
                        <Button
                          key={series.id}
                          variant="ghost"
                          className={`w-full justify-start text-sm ${
                            seriesId === series.id ? 'bg-[#FCC71E] text-[#27265C] font-semibold' : 'text-gray-700'
                          }`}
                          onClick={() => navigate(`/catalog/${category.id}/${series.id}`)}
                        >
                          {series.name}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </aside>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
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
          {totalItems > 0 && (
            <Button
              onClick={createOrder}
              className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-bold"
            >
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Создать заказ ({totalItems} шт • ₽{totalAmount.toLocaleString()})
            </Button>
          )}
        </div>

        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogData.map(category => (
              <Card 
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/catalog/${category.id}`)}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#27265C] mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Icon name="Layers" size={16} className="mr-2" />
                    {category.series.length} серий
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedCategory && !selectedSeries && (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-[#27265C]">{selectedCategory.name}</h1>
            <p className="text-gray-600">{selectedCategory.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategory.series.map(series => (
                <Card 
                  key={series.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/catalog/${categoryId}/${series.id}`)}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#27265C] mb-2">{series.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{series.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Icon name="Package" size={16} className="mr-2" />
                      {series.products.length} товаров
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedSeries && (
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-[#27265C]">{selectedSeries.name}</h1>
              <p className="text-gray-600">{selectedSeries.description}</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Наименование</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Вязкость</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Характеристики</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Упаковка</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Цена</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Наличие</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Количество</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {displayProducts.map(product => {
                        const selectedSize = getSelectedPackage(product.id);
                        const selectedPack = product.packaging.find(p => p.size === selectedSize) || product.packaging[0];
                        const quantity = getProductQuantity(product.id, selectedPack.size);
                        const palletInfo = calculatePallets(quantity, selectedPack.palletQty);
                        
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="space-y-1">
                                <Link 
                                  to={`/product/${product.id}`}
                                  className="font-semibold text-[#27265C] hover:underline"
                                >
                                  {product.name}
                                </Link>
                                <p className="text-xs text-gray-500">Арт: {product.id}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className="font-mono">
                                {product.viscosity}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-xs text-gray-600 space-y-1">
                                {product.specifications.slice(0, 2).map((spec, idx) => (
                                  <div key={idx}>{spec}</div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <select
                                className="text-sm border rounded px-2 py-1 bg-white"
                                value={selectedSize}
                                onChange={(e) => setSelectedPackaging({ ...selectedPackaging, [product.id]: e.target.value })}
                              >
                                {product.packaging.map(pack => (
                                  <option key={pack.size} value={pack.size}>
                                    {pack.size}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <p className="font-bold text-[#27265C]">₽{selectedPack.price.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">за 1 шт</p>
                            </td>
                            <td className="px-4 py-4 text-center">
                              {product.availability === 'in-stock' && (
                                <Badge className="bg-green-100 text-green-700">В наличии</Badge>
                              )}
                              {product.availability === 'pre-order' && (
                                <Badge className="bg-blue-100 text-blue-700">Предзаказ</Badge>
                              )}
                              {product.availability === 'out-of-stock' && (
                                <Badge className="bg-red-100 text-red-700">Нет</Badge>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(product.id, selectedPack.size, quantity - selectedPack.palletQty)}
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <Input
                                  type="number"
                                  value={quantity || ''}
                                  onChange={(e) => updateQuantity(product.id, selectedPack.size, parseInt(e.target.value) || 0)}
                                  className="w-20 text-center font-bold"
                                  placeholder="0"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(product.id, selectedPack.size, quantity + selectedPack.palletQty)}
                                >
                                  <Icon name="Plus" size={14} />
                                </Button>
                              </div>
                              {quantity > 0 && (
                                <div className="mt-2 text-center">
                                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                                    palletInfo.isExact 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-orange-100 text-orange-700'
                                  }`}>
                                    <Icon 
                                      name={palletInfo.isExact ? "CheckCircle" : "AlertCircle"} 
                                      size={12} 
                                    />
                                    {palletInfo.fullPallets > 0 && `${palletInfo.fullPallets} пал.`}
                                    {palletInfo.remainder > 0 && ` +${palletInfo.remainder} шт`}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <Link to={`/product/${product.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Icon name="Info" size={16} />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {totalItems > 0 && (
              <Alert className="bg-[#FCC71E]/10 border-[#FCC71E]">
                <Icon name="ShoppingCart" size={18} className="text-[#27265C]" />
                <AlertDescription className="ml-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#27265C]">
                      В корзине: {totalItems} шт на сумму ₽{totalAmount.toLocaleString()}
                    </span>
                    <Button 
                      onClick={createOrder}
                      className="bg-[#27265C] text-white hover:bg-[#27265C]/90"
                    >
                      Оформить заказ
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;

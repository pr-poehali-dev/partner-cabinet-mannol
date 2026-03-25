import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { catalogData, type Product } from "@/data/catalogData";

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

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [size]: Math.max(0, quantity) }
    }));
  };

  const getProductQuantity = (productId: string, size: string): number =>
    cart[productId]?.[size] || 0;

  const getTotalCartAmount = (): number => {
    let total = 0;
    displayProducts.forEach(product => {
      product.packaging.forEach(pack => {
        total += getProductQuantity(product.id, pack.size) * pack.price;
      });
    });
    return total;
  };

  const getTotalCartItems = (): number => {
    let count = 0;
    Object.values(cart).forEach(sizes => {
      Object.values(sizes).forEach(qty => { count += qty; });
    });
    return count;
  };

  const getSelectedPackage = (productId: string) =>
    selectedPackaging[productId] || '4л';

  const calculatePallets = (quantity: number, palletQty: number) => {
    const fullPallets = Math.floor(quantity / palletQty);
    const remainder = quantity % palletQty;
    return { fullPallets, remainder, isExact: remainder === 0 };
  };

  const createOrder = () => {
    const orderItems: { product: Product; size: string; quantity: number; price: number }[] = [];
    displayProducts.forEach(product => {
      product.packaging.forEach(pack => {
        const qty = getProductQuantity(product.id, pack.size);
        if (qty > 0) orderItems.push({ product, size: pack.size, quantity: qty, price: pack.price });
      });
    });
    if (orderItems.length > 0) navigate('/order/new', { state: { orderItems } });
  };

  const totalAmount = getTotalCartAmount();
  const totalItems = getTotalCartItems();

  return (
    <div className="space-y-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-[#27265C] transition-colors flex items-center gap-1">
          <Icon name="Home" size={13} />
        </Link>
        <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
        <Link
          to="/catalog"
          className={`transition-colors font-medium ${!selectedCategory ? "text-[#27265C] font-semibold" : "hover:text-[#27265C]"}`}
        >
          Каталог
        </Link>
        {selectedCategory && (
          <>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
            <Link
              to={`/catalog/${selectedCategory.id}`}
              className={`transition-colors font-medium ${!selectedSeries ? "text-[#27265C] font-semibold" : "hover:text-[#27265C]"}`}
            >
              {selectedCategory.name}
            </Link>
          </>
        )}
        {selectedSeries && (
          <>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
            <span className="text-[#27265C] font-semibold">{selectedSeries.name}</span>
          </>
        )}
      </nav>

      {/* Top-bar: title + cart button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#27265C]">
            {selectedSeries?.name ?? selectedCategory?.name ?? "Каталог"}
          </h1>
          {(selectedSeries?.description ?? selectedCategory?.description) && (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedSeries?.description ?? selectedCategory?.description}
            </p>
          )}
        </div>
        {totalItems > 0 && (
          <Button
            onClick={createOrder}
            className="bg-[#FCC71E] text-[#27265C] hover:bg-[#e6b41a] font-bold h-10 flex-shrink-0"
          >
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            Создать заказ — {totalItems} шт &middot; ₽{totalAmount.toLocaleString()}
          </Button>
        )}
      </div>

      {/* Root: category cards */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogData.map(category => (
            <Card
              key={category.id}
              className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/catalog/${category.id}`)}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#27265C] mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon name="Layers" size={14} />
                  {category.series.length} серий
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Category level: series cards */}
      {selectedCategory && !selectedSeries && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {selectedCategory.series.map(series => (
            <Card
              key={series.id}
              className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/catalog/${categoryId}/${series.id}`)}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#27265C] mb-2">{series.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{series.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon name="Package" size={14} />
                  {series.products.length} товаров
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Series level: product table */}
      {selectedSeries && (
        <div className="space-y-4">
          <Card className="border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#27265C]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase whitespace-nowrap">Наименование</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase whitespace-nowrap">Вязкость</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase whitespace-nowrap hidden lg:table-cell">Характеристики</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase whitespace-nowrap">Упаковка</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-white/80 uppercase whitespace-nowrap">Цена</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-white/80 uppercase whitespace-nowrap hidden sm:table-cell">Наличие</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-white/80 uppercase whitespace-nowrap">Количество</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F4F4] bg-white">
                    {displayProducts.map(product => {
                      const selectedSize = getSelectedPackage(product.id);
                      const selectedPack = product.packaging.find(p => p.size === selectedSize) || product.packaging[0];
                      const quantity = getProductQuantity(product.id, selectedPack.size);
                      const palletInfo = calculatePallets(quantity, selectedPack.palletQty);

                      return (
                        <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-4 py-4 min-w-[140px]">
                            <Link
                              to={`/product/${product.id}`}
                              className="font-semibold text-[#27265C] hover:underline text-sm block"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5">Арт: {product.id}</p>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className="font-mono text-xs">
                              {product.viscosity}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              {product.specifications.slice(0, 2).map((spec, idx) => (
                                <div key={idx}>{spec}</div>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <select
                              className="text-sm border border-[#E8E8E8] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#27265C]"
                              value={selectedSize}
                              onChange={e => setSelectedPackaging({ ...selectedPackaging, [product.id]: e.target.value })}
                            >
                              {product.packaging.map(pack => (
                                <option key={pack.size} value={pack.size}>{pack.size}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <p className="font-bold text-[#27265C] text-sm">₽{selectedPack.price.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">за 1 шт</p>
                          </td>
                          <td className="px-4 py-4 text-center hidden sm:table-cell">
                            {product.availability === 'in-stock' && (
                              <Badge className="bg-emerald-100 text-emerald-700 border-0">В наличии</Badge>
                            )}
                            {product.availability === 'pre-order' && (
                              <Badge className="bg-blue-100 text-blue-700 border-0">Предзаказ</Badge>
                            )}
                            {product.availability === 'out-of-stock' && (
                              <Badge className="bg-red-100 text-red-700 border-0">Нет</Badge>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(product.id, selectedPack.size, quantity - selectedPack.palletQty)}
                              >
                                <Icon name="Minus" size={13} />
                              </Button>
                              <Input
                                type="number"
                                value={quantity || ''}
                                onChange={e => updateQuantity(product.id, selectedPack.size, parseInt(e.target.value) || 0)}
                                className="w-16 text-center font-bold h-8 text-sm"
                                placeholder="0"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(product.id, selectedPack.size, quantity + selectedPack.palletQty)}
                              >
                                <Icon name="Plus" size={13} />
                              </Button>
                            </div>
                            {quantity > 0 && (
                              <div className="mt-1.5 text-center">
                                <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                                  palletInfo.isExact
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                  <Icon name={palletInfo.isExact ? "CheckCircle" : "AlertCircle"} size={11} />
                                  {palletInfo.fullPallets > 0 && `${palletInfo.fullPallets} пал.`}
                                  {palletInfo.remainder > 0 && ` +${palletInfo.remainder} шт`}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Link to={`/product/${product.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-[#27265C] hover:text-white"
                                title="Подробнее"
                              >
                                <Icon name="Info" size={15} />
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
            <Alert className="bg-[#FCC71E]/10 border-[#FCC71E] rounded-2xl">
              <Icon name="ShoppingCart" size={18} className="text-[#27265C]" />
              <AlertDescription className="ml-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
                  <span className="font-semibold text-[#27265C]">
                    В корзине: {totalItems} шт на сумму ₽{totalAmount.toLocaleString()}
                  </span>
                  <Button
                    onClick={createOrder}
                    className="bg-[#27265C] text-white hover:bg-[#27265C]/90 font-bold w-full sm:w-auto"
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
  );
};

export default Catalog;

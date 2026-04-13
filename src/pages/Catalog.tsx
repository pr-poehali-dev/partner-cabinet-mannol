import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { catalogData, type Product } from "@/data/catalogData";

/* ─── helpers ─── */
function availBadge(a: Product["availability"]) {
  if (a === "in-stock")    return <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] px-1.5 py-0.5 shrink-0">В наличии</Badge>;
  if (a === "pre-order")   return <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] px-1.5 py-0.5 shrink-0">Предзаказ</Badge>;
  return                          <Badge className="bg-red-100 text-red-700 border-0 text-[10px] px-1.5 py-0.5 shrink-0">Нет</Badge>;
}

/* ════════════════════════════════════════════════════ */
const Catalog = () => {
  const { categoryId, seriesId } = useParams<{ categoryId?: string; seriesId?: string }>();
  const navigate = useNavigate();

  const [cart, setCart]           = useState<Record<string, Record<string, number>>>({});
  const [selPkg, setSelPkg]       = useState<Record<string, string>>({});
  const [added, setAdded]         = useState<Record<string, boolean>>({});   // pulse animation

  const selectedCategory = categoryId ? catalogData.find(c => c.id === categoryId) : null;
  const selectedSeries   = seriesId && selectedCategory
    ? selectedCategory.series.find(s => s.id === seriesId)
    : null;

  const displayProducts = selectedSeries?.products ?? [];

  /* ── cart helpers ── */
  const getQty  = (id: string, size: string) => cart[id]?.[size] ?? 0;
  const getPkg  = (id: string)               => selPkg[id] ?? displayProducts.find(p => p.id === id)?.packaging[0]?.size ?? "4л";

  const setQty = (id: string, size: string, qty: number) => {
    setCart(prev => ({ ...prev, [id]: { ...(prev[id] ?? {}), [size]: Math.max(0, qty) } }));
    if (qty > 0) {
      setAdded(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setAdded(prev => ({ ...prev, [id]: false })), 600);
    }
  };

  const totalItems  = Object.values(cart).flatMap(s => Object.values(s)).reduce((a, b) => a + b, 0);
  const totalAmount = displayProducts.reduce((sum, p) =>
    sum + p.packaging.reduce((s, pk) => s + getQty(p.id, pk.size) * pk.price, 0), 0);

  const calcPallets = (qty: number, palletQty: number) => {
    const full      = Math.floor(qty / palletQty);
    const remainder = qty % palletQty;
    return { full, remainder, exact: remainder === 0 };
  };

  const createOrder = () => {
    const items: { product: Product; size: string; quantity: number; price: number }[] = [];
    displayProducts.forEach(p =>
      p.packaging.forEach(pk => {
        const q = getQty(p.id, pk.size);
        if (q > 0) items.push({ product: p, size: pk.size, quantity: q, price: pk.price });
      })
    );
    if (items.length > 0) navigate("/order/new", { state: { orderItems: items } });
  };

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="space-y-5 pb-28 md:pb-6">

      {/* ── Breadcrumbs ── */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <Link to="/" className="hover:text-[#27265C] transition-colors">
          <Icon name="Home" size={13} />
        </Link>
        <Icon name="ChevronRight" size={13} className="opacity-40" />
        <Link to="/catalog" className={`transition-colors font-medium ${!selectedCategory ? "text-[#27265C]" : "hover:text-[#27265C]"}`}>
          Каталог
        </Link>
        {selectedCategory && (
          <>
            <Icon name="ChevronRight" size={13} className="opacity-40" />
            <Link to={`/catalog/${selectedCategory.id}`} className={`transition-colors font-medium ${!selectedSeries ? "text-[#27265C]" : "hover:text-[#27265C]"}`}>
              {selectedCategory.name}
            </Link>
          </>
        )}
        {selectedSeries && (
          <>
            <Icon name="ChevronRight" size={13} className="opacity-40" />
            <span className="text-[#27265C] font-semibold">{selectedSeries.name}</span>
          </>
        )}
      </nav>

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#27265C]">
            {selectedSeries?.name ?? selectedCategory?.name ?? "Каталог"}
          </h1>
          {(selectedSeries?.description ?? selectedCategory?.description) && (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedSeries?.description ?? selectedCategory?.description}
            </p>
          )}
        </div>
        {/* Desktop cart button in header */}
        {totalItems > 0 && (
          <Button
            onClick={createOrder}
            className="hidden sm:flex bg-[#FCC71E] text-[#27265C] hover:bg-[#e6b41a] font-bold h-10 shrink-0 shadow-sm"
          >
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            Оформить — {totalItems} шт · ₽{totalAmount.toLocaleString()}
          </Button>
        )}
      </div>

      {/* ════════════════════════════════════════════
          ROOT — список категорий
      ════════════════════════════════════════════ */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {catalogData.map(cat => (
            <Card
              key={cat.id}
              className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md hover:border-[#27265C]/20 transition-all cursor-pointer group"
              onClick={() => navigate(`/catalog/${cat.id}`)}
            >
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-xl bg-[#27265C]/6 flex items-center justify-center mb-4 group-hover:bg-[#27265C]/10 transition-colors">
                  <Icon name="Package" size={20} className="text-[#27265C]" />
                </div>
                <h3 className="text-base font-bold text-[#27265C] mb-1.5">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon name="Layers" size={13} />
                    {cat.series.length} серий
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-[#27265C]/40 group-hover:text-[#27265C] transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════
          CATEGORY LEVEL — список серий
      ════════════════════════════════════════════ */}
      {selectedCategory && !selectedSeries && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {selectedCategory.series.map(series => {
            const inStockCount = series.products.filter(p => p.availability === "in-stock").length;
            return (
              <Card
                key={series.id}
                className="border border-[#E8E8E8] rounded-2xl shadow-sm hover:shadow-md hover:border-[#27265C]/20 transition-all cursor-pointer group"
                onClick={() => navigate(`/catalog/${categoryId}/${series.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-bold text-[#27265C]">{series.name}</h3>
                    <Badge className="bg-[#27265C]/5 text-[#27265C] border-0 text-xs shrink-0">
                      {series.products.length} поз.
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{series.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <Icon name="CheckCircle" size={12} />
                        {inStockCount} в наличии
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#27265C] text-xs font-semibold group-hover:gap-2.5 transition-all">
                      Перейти
                      <Icon name="ArrowRight" size={14} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════
          SERIES LEVEL — товары
      ════════════════════════════════════════════ */}
      {selectedSeries && (
        <div className="space-y-4">

          {/* ── MOBILE: карточки товаров ── */}
          <div className="sm:hidden space-y-3">
            {displayProducts.map(product => {
              const pkg     = product.packaging.find(p => p.size === getPkg(product.id)) ?? product.packaging[0];
              const qty     = getQty(product.id, pkg.size);
              const pallets = calcPallets(qty, pkg.palletQty);
              const isAdded = added[product.id];

              return (
                <Card
                  key={product.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    qty > 0
                      ? "border-[#27265C]/30 shadow-md"
                      : "border-[#E8E8E8] shadow-sm"
                  }`}
                >
                  <CardContent className="p-0">

                    {/* Card header */}
                    <div className={`px-4 pt-4 pb-3 ${qty > 0 ? "bg-[#27265C]/[0.03]" : ""}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="font-semibold text-[#27265C] hover:underline text-sm leading-snug flex-1"
                        >
                          {product.name}
                        </Link>
                        {availBadge(product.availability)}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.viscosity && (
                          <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0.5">
                            {product.viscosity}
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground">Арт: {product.id}</span>
                      </div>
                      {product.specifications.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                          {product.specifications.slice(0, 3).join(" · ")}
                        </p>
                      )}
                    </div>

                    {/* Packaging tabs */}
                    <div className="px-4 pb-2 flex gap-1.5 flex-wrap border-t border-[#F4F4F4] pt-3">
                      {product.packaging.map(pk => {
                        const isActive = pk.size === getPkg(product.id);
                        const pkQty    = getQty(product.id, pk.size);
                        return (
                          <button
                            key={pk.size}
                            onClick={() => setSelPkg(p => ({ ...p, [product.id]: pk.size }))}
                            className={`relative flex flex-col items-center px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isActive
                                ? "border-[#27265C] bg-[#27265C] text-white shadow-sm"
                                : "border-[#E8E8E8] text-[#27265C] hover:border-[#27265C]/40 bg-white"
                            }`}
                          >
                            <span>{pk.size}</span>
                            <span className={`text-[10px] font-normal ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                              ₽{pk.price.toLocaleString()}
                            </span>
                            {pkQty > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 bg-[#FCC71E] text-[#27265C] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {pkQty}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Price + qty controls */}
                    <div className="px-4 pb-4 pt-2 flex items-center gap-3">
                      <div className="mr-auto">
                        <p className="text-base font-extrabold text-[#27265C]">
                          ₽{pkg.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">за 1 шт · {pkg.size}</p>
                      </div>

                      {qty === 0 ? (
                        <Button
                          size="sm"
                          className={`h-9 px-4 font-bold text-sm transition-all duration-200 ${
                            isAdded
                              ? "bg-emerald-500 text-white scale-95"
                              : "bg-[#FCC71E] text-[#27265C] hover:bg-[#e6b41a]"
                          }`}
                          onClick={() => setQty(product.id, pkg.size, pkg.palletQty)}
                        >
                          <Icon name="Plus" size={15} className="mr-1.5" />
                          +{pkg.palletQty} шт
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 border-[#27265C]/20"
                            onClick={() => setQty(product.id, pkg.size, qty - pkg.palletQty)}
                          >
                            <Icon name="Minus" size={13} />
                          </Button>
                          <Input
                            type="number"
                            value={qty || ""}
                            onChange={e => setQty(product.id, pkg.size, parseInt(e.target.value) || 0)}
                            className="w-16 text-center font-bold h-9 text-sm border-[#27265C]/20"
                            placeholder="0"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 border-[#27265C]/20"
                            onClick={() => setQty(product.id, pkg.size, qty + pkg.palletQty)}
                          >
                            <Icon name="Plus" size={13} />
                          </Button>
                        </div>
                      )}

                      <Link to={`/product/${product.id}`} className="shrink-0">
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-[#27265C] hover:text-white">
                          <Icon name="Info" size={15} />
                        </Button>
                      </Link>
                    </div>

                    {/* Pallet info */}
                    {qty > 0 && (
                      <div className={`px-4 py-2 border-t border-[#F4F4F4] flex items-center gap-1.5 ${
                        pallets.exact ? "bg-emerald-50" : "bg-orange-50"
                      }`}>
                        <Icon
                          name={pallets.exact ? "CheckCircle" : "AlertCircle"}
                          size={11}
                          className={pallets.exact ? "text-emerald-600" : "text-orange-600"}
                        />
                        <span className={`text-[11px] font-medium ${pallets.exact ? "text-emerald-700" : "text-orange-700"}`}>
                          {pallets.full > 0 && `${pallets.full} паллет`}
                          {pallets.remainder > 0 && ` + ${pallets.remainder} шт`}
                          {pallets.exact && pallets.full > 0 && " — кратно паллете"}
                          {!pallets.exact && " — некратно паллете"}
                        </span>
                        <span className="ml-auto text-[11px] font-bold text-[#27265C]">
                          ₽{(qty * pkg.price).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ── DESKTOP: таблица ── */}
          <Card className="hidden sm:block border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#27265C]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase tracking-wide whitespace-nowrap">Наименование</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase tracking-wide whitespace-nowrap">Вязкость</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase tracking-wide whitespace-nowrap hidden md:table-cell">Характеристики</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase tracking-wide whitespace-nowrap">Упаковка</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-white/80 uppercase tracking-wide whitespace-nowrap">Цена</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-white/80 uppercase tracking-wide whitespace-nowrap">Наличие</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-white/80 uppercase tracking-wide min-w-[160px]">Количество</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F4F4] bg-white">
                    {displayProducts.map(product => {
                      const pkg     = product.packaging.find(p => p.size === getPkg(product.id)) ?? product.packaging[0];
                      const qty     = getQty(product.id, pkg.size);
                      const pallets = calcPallets(qty, pkg.palletQty);

                      return (
                        <>
                          <tr
                            key={product.id}
                            className={`transition-colors ${qty > 0 ? "bg-[#27265C]/[0.025]" : "hover:bg-gray-50/60"}`}
                          >
                            <td className="px-4 py-3.5 min-w-[160px]">
                              <Link to={`/product/${product.id}`} className="font-semibold text-[#27265C] hover:underline text-sm block leading-snug">
                                {product.name}
                              </Link>
                              <p className="text-[11px] text-muted-foreground mt-0.5">Арт: {product.id}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge variant="outline" className="font-mono text-xs">{product.viscosity}</Badge>
                            </td>
                            <td className="px-4 py-3.5 hidden md:table-cell">
                              <div className="text-xs text-muted-foreground space-y-0.5">
                                {product.specifications.slice(0, 2).map((s, i) => <div key={i}>{s}</div>)}
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <select
                                className="text-sm border border-[#E8E8E8] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#27265C] cursor-pointer"
                                value={getPkg(product.id)}
                                onChange={e => setSelPkg(p => ({ ...p, [product.id]: e.target.value }))}
                              >
                                {product.packaging.map(pk => (
                                  <option key={pk.size} value={pk.size}>
                                    {pk.size} — ₽{pk.price.toLocaleString()}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <p className="font-bold text-[#27265C] text-sm">₽{pkg.price.toLocaleString()}</p>
                              <p className="text-[11px] text-muted-foreground">за 1 шт</p>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {availBadge(product.availability)}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5 justify-center">
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0"
                                  onClick={() => setQty(product.id, pkg.size, qty - pkg.palletQty)}>
                                  <Icon name="Minus" size={13} />
                                </Button>
                                <Input
                                  type="number"
                                  value={qty || ""}
                                  onChange={e => setQty(product.id, pkg.size, parseInt(e.target.value) || 0)}
                                  className="w-16 text-center font-bold h-8 text-sm"
                                  placeholder="0"
                                />
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0"
                                  onClick={() => setQty(product.id, pkg.size, qty + pkg.palletQty)}>
                                  <Icon name="Plus" size={13} />
                                </Button>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <Link to={`/product/${product.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#27265C] hover:text-white" title="Подробнее">
                                  <Icon name="Info" size={15} />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                          {/* Inline pallet info row */}
                          {qty > 0 && (
                            <tr key={`${product.id}-info`} className={pallets.exact ? "bg-emerald-50" : "bg-orange-50"}>
                              <td colSpan={8} className="px-4 py-1.5">
                                <div className="flex items-center gap-2 text-[11px]">
                                  <Icon
                                    name={pallets.exact ? "CheckCircle" : "AlertCircle"}
                                    size={11}
                                    className={pallets.exact ? "text-emerald-600" : "text-orange-600"}
                                  />
                                  <span className={`font-medium ${pallets.exact ? "text-emerald-700" : "text-orange-700"}`}>
                                    {pallets.full > 0 && `${pallets.full} паллет`}
                                    {pallets.remainder > 0 && ` + ${pallets.remainder} шт`}
                                    {pallets.exact ? " — кратно паллете" : " — некратно паллете"}
                                  </span>
                                  <span className="ml-auto font-bold text-[#27265C]">
                                    Итого: ₽{(qty * pkg.price).toLocaleString()}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ── Desktop total summary ── */}
          {totalItems > 0 && (
            <div className="hidden sm:flex items-center justify-between gap-4 bg-[#27265C] text-white rounded-2xl px-5 py-4 shadow-md">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-white/60 mb-0.5">Позиций выбрано</p>
                  <p className="text-lg font-extrabold">{Object.values(cart).flatMap(s => Object.entries(s).filter(([, v]) => v > 0)).length}</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-xs text-white/60 mb-0.5">Итого штук</p>
                  <p className="text-lg font-extrabold">{totalItems}</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-xs text-white/60 mb-0.5">Сумма</p>
                  <p className="text-xl font-extrabold text-[#FCC71E]">₽{totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <Button
                onClick={createOrder}
                className="bg-[#FCC71E] text-[#27265C] hover:bg-[#e6b41a] font-bold h-11 px-6 text-[15px] shadow-sm shrink-0"
              >
                <Icon name="ShoppingCart" size={18} className="mr-2" />
                Оформить заказ
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          MOBILE STICKY FOOTER — корзина
      ════════════════════════════════════════════ */}
      {selectedSeries && totalItems > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40">
          <div className="bg-[#27265C] px-4 py-2 flex items-center gap-3 border-t border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-center shrink-0">
                <p className="text-white font-extrabold text-base leading-none">{totalItems}</p>
                <p className="text-white/50 text-[10px] leading-none mt-0.5">шт</p>
              </div>
              <div className="w-px h-7 bg-white/20 shrink-0" />
              <div className="min-w-0">
                <p className="text-[#FCC71E] font-extrabold text-base leading-none truncate">₽{totalAmount.toLocaleString()}</p>
                <p className="text-white/50 text-[10px] leading-none mt-0.5">выбрано товаров</p>
              </div>
            </div>
            <Button
              onClick={createOrder}
              className="bg-[#FCC71E] text-[#27265C] hover:bg-[#e6b41a] font-bold h-10 px-4 shrink-0 text-sm shadow-sm"
            >
              Оформить
              <Icon name="ArrowRight" size={15} className="ml-1.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;

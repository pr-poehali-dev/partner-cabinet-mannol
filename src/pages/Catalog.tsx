import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { catalogData, type Product } from "@/data/catalogData";

/* ─── tiny helpers ─── */
const fmt = (n: number) => n.toLocaleString("ru-RU");

function AvailDot({ a }: { a: Product["availability"] }) {
  if (a === "in-stock")  return <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />В наличии</span>;
  if (a === "pre-order") return <span className="flex items-center gap-1 text-blue-600 font-medium text-xs"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />Предзаказ</span>;
  return                        <span className="flex items-center gap-1 text-red-500 font-medium text-xs"><span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />Нет</span>;
}

function AvailBadge({ a }: { a: Product["availability"] }) {
  if (a === "in-stock")  return <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">В наличии</Badge>;
  if (a === "pre-order") return <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">Предзаказ</Badge>;
  return                        <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">Нет в наличии</Badge>;
}

/* ════════════════════════════════════════════════════════ */
export default function Catalog() {
  const { categoryId, seriesId } = useParams<{ categoryId?: string; seriesId?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ── state ── */
  const [cart,   setCart]   = useState<Record<string, Record<string, number>>>({});
  const [selPkg, setSelPkg] = useState<Record<string, string>>({});
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");

  /* подхватываем ?search= из URL при переходе из страницы поиска */
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  /* ── derived data ── */
  const selectedCategory = useMemo(() => categoryId ? catalogData.find(c => c.id === categoryId) ?? null : null, [categoryId]);
  const selectedSeries   = useMemo(() =>
    seriesId && selectedCategory ? selectedCategory.series.find(s => s.id === seriesId) ?? null : null,
    [seriesId, selectedCategory]);
  const products = selectedSeries?.products ?? [];

  /* сброс поиска при смене уровня */
  const prevLevelKey = `${categoryId ?? ""}-${seriesId ?? ""}`;
  React.useEffect(() => { setSearch(""); }, [prevLevelKey]);

  /* фильтрация */
  const sq = search.toLowerCase().trim();
  const filteredCategories = useMemo(() =>
    !sq ? catalogData : catalogData.filter(c =>
      c.name.toLowerCase().includes(sq) ||
      c.description.toLowerCase().includes(sq) ||
      c.series.some(s => s.name.toLowerCase().includes(sq) || s.products.some(p => p.name.toLowerCase().includes(sq)))
    ), [sq]);

  const filteredSeries = useMemo(() =>
    !sq || !selectedCategory ? selectedCategory?.series ?? [] :
    selectedCategory.series.filter(s =>
      s.name.toLowerCase().includes(sq) ||
      s.description.toLowerCase().includes(sq) ||
      s.products.some(p => p.name.toLowerCase().includes(sq) || p.id.toLowerCase().includes(sq))
    ), [sq, selectedCategory]);

  const filteredProducts = useMemo(() =>
    !sq ? products : products.filter(p =>
      p.name.toLowerCase().includes(sq) ||
      p.id.toLowerCase().includes(sq) ||
      p.viscosity?.toLowerCase().includes(sq) ||
      p.specifications.some(s => s.toLowerCase().includes(sq))
    ), [sq, products]);

  /* ── cart helpers ── */
  const getQty = (id: string, size: string) => cart[id]?.[size] ?? 0;
  const getActivePkg = (product: Product) => {
    const size = selPkg[product.id] ?? product.packaging[0].size;
    return product.packaging.find(p => p.size === size) ?? product.packaging[0];
  };

  const addQty = (id: string, size: string, delta: number) => {
    setCart(prev => {
      const cur = prev[id]?.[size] ?? 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [id]: { ...(prev[id] ?? {}), [size]: next } };
    });
  };

  const setQtyDirect = (id: string, size: string, val: string) => {
    const n = parseInt(val) || 0;
    setCart(prev => ({ ...prev, [id]: { ...(prev[id] ?? {}), [size]: Math.max(0, n) } }));
  };

  const totalQty    = useMemo(() => Object.values(cart).flatMap(s => Object.values(s)).reduce((a, b) => a + b, 0), [cart]);
  const totalAmount = useMemo(() => products.reduce((sum, p) =>
    sum + p.packaging.reduce((s, pk) => s + getQty(p.id, pk.size) * pk.price, 0), 0), [cart, products]);

  const cartLineCount = useMemo(() =>
    Object.values(cart).flatMap(s => Object.entries(s).filter(([, v]) => v > 0)).length, [cart]);

  const calcPallets = (qty: number, palletQty: number) => {
    const full = Math.floor(qty / palletQty);
    const rem  = qty % palletQty;
    return { full, rem, exact: rem === 0 && qty > 0 };
  };

  const createOrder = () => {
    const items: { product: Product; size: string; quantity: number; price: number }[] = [];
    products.forEach(p => p.packaging.forEach(pk => {
      const q = getQty(p.id, pk.size);
      if (q > 0) items.push({ product: p, size: pk.size, quantity: q, price: pk.price });
    }));
    if (items.length > 0) navigate("/order/new", { state: { orderItems: items } });
  };

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-full">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap mb-4">
        <Link to="/" className="hover:text-[#27265C] transition-colors p-0.5"><Icon name="Home" size={13} /></Link>
        <Icon name="ChevronRight" size={12} className="opacity-30" />
        <Link to="/catalog" className={`transition-colors font-medium hover:text-[#27265C] ${!selectedCategory ? "text-[#27265C]" : ""}`}>
          Каталог
        </Link>
        {selectedCategory && <>
          <Icon name="ChevronRight" size={12} className="opacity-30" />
          <Link to={`/catalog/${selectedCategory.id}`} className={`transition-colors font-medium hover:text-[#27265C] ${!selectedSeries ? "text-[#27265C]" : ""}`}>
            {selectedCategory.name}
          </Link>
        </>}
        {selectedSeries && <>
          <Icon name="ChevronRight" size={12} className="opacity-30" />
          <span className="text-[#27265C] font-semibold">{selectedSeries.name}</span>
        </>}
      </nav>

      {/* ── Search bar ── */}
      <div className="relative mb-4">
        <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={
            selectedSeries ? "Поиск по названию, артикулу, вязкости..." :
            selectedCategory ? "Поиск по сериям..." :
            "Поиск по каталогу..."
          }
          className="pl-9 pr-9 h-10 bg-white border-[#E8E8E8] rounded-xl text-sm focus-visible:ring-[#27265C]/20 shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#27265C]"
          >
            <Icon name="X" size={15} />
          </button>
        )}
      </div>

      {/* ── Page title row ── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-[#27265C] leading-tight">
            {selectedSeries?.name ?? selectedCategory?.name ?? "Каталог"}
          </h1>
          {(selectedSeries?.description ?? selectedCategory?.description) && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {selectedSeries?.description ?? selectedCategory?.description}
            </p>
          )}
          {selectedSeries && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">{products.length} позиций</span>
              <span className="text-xs text-emerald-600 font-medium">
                {products.filter(p => p.availability === "in-stock").length} в наличии
              </span>
            </div>
          )}
        </div>
        {/* Desktop — кнопка корзины */}
        {totalQty > 0 && (
          <Button
            onClick={createOrder}
            className="hidden sm:flex shrink-0 bg-[#FCC71E] text-[#27265C] hover:bg-[#e6b41a] font-bold h-10 shadow-sm gap-2"
          >
            <Icon name="ShoppingCart" size={16} />
            {cartLineCount} позиц. · ₽{fmt(totalAmount)}
          </Button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          ROOT — категории
      ══════════════════════════════════════════════════ */}
      {!selectedCategory && filteredCategories.length === 0 && sq && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 bg-[#27265C]/8 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="SearchX" size={28} className="text-[#27265C]/30" />
          </div>
          <p className="font-semibold text-[#27265C]">Ничего не найдено</p>
          <p className="text-sm text-muted-foreground mt-1">По запросу «{search}» категорий нет</p>
          <button onClick={() => setSearch("")} className="mt-3 text-sm text-[#27265C] font-medium hover:underline">Сбросить поиск</button>
        </div>
      )}

      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCategories.map(cat => {
            const total = cat.series.reduce((s, sr) => s + sr.products.length, 0);
            const icons: Record<string, string> = { "motor-oils": "Droplets", "transmission-oils": "Cog", "additives": "FlaskConical" };
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/catalog/${cat.id}`)}
                className="text-left bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#27265C]/25 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#27265C]/6 flex items-center justify-center mb-4 group-hover:bg-[#27265C]/10 transition-colors">
                  <Icon name={(icons[cat.id] ?? "Package") as never} size={22} className="text-[#27265C]" />
                </div>
                <p className="font-bold text-[#27265C] text-base mb-1">{cat.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cat.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{cat.series.length} серии · {total} товаров</span>
                  <Icon name="ArrowRight" size={15} className="text-[#27265C]/30 group-hover:text-[#27265C] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          CATEGORY — серии
      ══════════════════════════════════════════════════ */}
      {selectedCategory && !selectedSeries && filteredSeries.length === 0 && sq && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 bg-[#27265C]/8 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="SearchX" size={28} className="text-[#27265C]/30" />
          </div>
          <p className="font-semibold text-[#27265C]">Серии не найдены</p>
          <p className="text-sm text-muted-foreground mt-1">По запросу «{search}» ничего нет</p>
          <button onClick={() => setSearch("")} className="mt-3 text-sm text-[#27265C] font-medium hover:underline">Сбросить поиск</button>
        </div>
      )}

      {selectedCategory && !selectedSeries && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredSeries.map(series => {
            const inStock = series.products.filter(p => p.availability === "in-stock").length;
            const preorder = series.products.filter(p => p.availability === "pre-order").length;
            return (
              <button
                key={series.id}
                onClick={() => navigate(`/catalog/${categoryId}/${series.id}`)}
                className="text-left bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#27265C]/25 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-bold text-[#27265C] text-base leading-snug">{series.name}</p>
                  <Badge className="bg-[#27265C]/6 text-[#27265C] border-0 text-xs shrink-0 mt-0.5">
                    {series.products.length} поз.
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{series.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {inStock > 0 && <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{inStock} в наличии</span>}
                    {preorder > 0 && <span className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{preorder} предзаказ</span>}
                  </div>
                  <span className="flex items-center gap-1 text-[#27265C] text-xs font-semibold opacity-60 group-hover:opacity-100 group-hover:gap-1.5 transition-all">
                    Открыть <Icon name="ArrowRight" size={13} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SERIES — список товаров
      ══════════════════════════════════════════════════ */}
      {selectedSeries && (
        <div className="pb-28 sm:pb-0 space-y-3">

          {/* ─── Счётчик/пусто при поиске ─── */}
          {sq && (
            <div className="flex items-center justify-between text-sm px-1">
              {filteredProducts.length > 0 ? (
                <span className="text-muted-foreground">
                  Найдено: <span className="font-semibold text-[#27265C]">{filteredProducts.length}</span> из {products.length}
                </span>
              ) : (
                <span className="text-muted-foreground">По запросу «{search}» ничего не найдено</span>
              )}
              <button onClick={() => setSearch("")} className="text-[#27265C] font-medium hover:underline text-xs">Сбросить</button>
            </div>
          )}

          {filteredProducts.length === 0 && sq && (
            <div className="flex flex-col items-center py-16 text-center bg-white rounded-2xl border border-[#E8E8E8]">
              <div className="w-14 h-14 bg-[#27265C]/8 rounded-2xl flex items-center justify-center mb-4">
                <Icon name="SearchX" size={28} className="text-[#27265C]/30" />
              </div>
              <p className="font-semibold text-[#27265C]">Товары не найдены</p>
              <p className="text-sm text-muted-foreground mt-1">Попробуйте другое название или артикул</p>
            </div>
          )}

          {/* ─── MOBILE: карточки ─── */}
          <div className="sm:hidden space-y-0 bg-white rounded-2xl border border-[#E8E8E8] shadow-sm overflow-hidden divide-y divide-[#F0F0F0]">
            {filteredProducts.map((product, idx) => {
              const activePkg = getActivePkg(product);
              const qty       = getQty(product.id, activePkg.size);
              const pallets   = calcPallets(qty, activePkg.palletQty);

              const lineTotal = qty * activePkg.price;

              return (
                <div key={product.id}>
                  {/* ── Product header ── */}
                  <div className={`px-4 pt-4 pb-3 transition-colors ${qty > 0 ? "bg-[#27265C]/[0.025]" : ""}`}>
                    {/* Name row */}
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-[#27265C]/30 bg-[#27265C]/6 rounded px-1.5 py-0.5 shrink-0">
                            #{idx + 1}
                          </span>
                          <AvailDot a={product.availability} />
                        </div>
                        <Link
                          to={`/product/${product.id}`}
                          className="font-bold text-[#27265C] text-[15px] leading-snug hover:underline block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Арт. {product.id}</p>
                      </div>
                      {qty > 0 && (
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-[#27265C]">₽{fmt(lineTotal)}</p>
                          <p className="text-[10px] text-muted-foreground">{qty} шт</p>
                        </div>
                      )}
                    </div>

                    {/* Specs chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {product.viscosity && (
                        <span className="font-mono text-[10px] bg-[#27265C] text-white px-2 py-0.5 rounded-md font-semibold">
                          {product.viscosity}
                        </span>
                      )}
                      {product.specifications.map((s, i) => (
                        <span key={i} className="text-[10px] bg-[#F4F4F4] text-muted-foreground px-2 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Packaging tabs ── */}
                  <div className="px-4 py-3 bg-[#FAFAFA] border-t border-[#F0F0F0]">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Выберите упаковку</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {product.packaging.map(pk => {
                        const isActive = pk.size === activePkg.size;
                        const pkQty    = getQty(product.id, pk.size);
                        return (
                          <button
                            key={pk.size}
                            onClick={() => setSelPkg(p => ({ ...p, [product.id]: pk.size }))}
                            className={`relative flex flex-col items-center justify-center rounded-xl border py-2 px-1 transition-all ${
                              isActive
                                ? "bg-[#27265C] border-[#27265C] shadow-sm"
                                : "bg-white border-[#E8E8E8] hover:border-[#27265C]/30"
                            }`}
                          >
                            <span className={`text-xs font-bold ${isActive ? "text-white" : "text-[#27265C]"}`}>
                              {pk.size}
                            </span>
                            <span className={`text-[9px] mt-0.5 font-medium ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                              ₽{fmt(pk.price)}
                            </span>
                            {pkQty > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 bg-[#FCC71E] text-[#27265C] text-[8px] font-extrabold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                                {pkQty}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Price + qty controls ── */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    {/* Price block */}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-extrabold text-[#27265C] leading-none">
                        ₽{fmt(activePkg.price)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        за шт · паллета {activePkg.palletQty} шт
                      </p>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => addQty(product.id, activePkg.size, -1)}
                        className="w-9 h-9 rounded-lg border border-[#E0E0E0] flex items-center justify-center text-[#27265C] hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <Icon name="Minus" size={14} />
                      </button>
                      <Input
                        type="number"
                        value={qty || ""}
                        placeholder="0"
                        onChange={e => setQtyDirect(product.id, activePkg.size, e.target.value)}
                        className="w-16 text-center font-bold h-9 text-sm border-[#E0E0E0]"
                      />
                      <button
                        onClick={() => addQty(product.id, activePkg.size, 1)}
                        className="w-9 h-9 rounded-lg border border-[#E0E0E0] flex items-center justify-center text-[#27265C] hover:bg-[#27265C] hover:border-[#27265C] hover:text-white transition-colors"
                      >
                        <Icon name="Plus" size={14} />
                      </button>
                    </div>

                    <Link to={`/product/${product.id}`} className="shrink-0">
                      <button className="w-9 h-9 rounded-lg border border-[#E0E0E0] flex items-center justify-center text-[#27265C]/50 hover:bg-[#27265C] hover:border-[#27265C] hover:text-white transition-colors">
                        <Icon name="Info" size={14} />
                      </button>
                    </Link>
                  </div>

                  {/* ── Pallet hint ── */}
                  {qty > 0 && (
                    <div className={`mx-4 mb-3 rounded-xl px-3 py-2 flex items-center gap-2 ${
                      pallets.exact ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"
                    }`}>
                      <Icon
                        name={pallets.exact ? "PackageCheck" : "AlertCircle"}
                        size={13}
                        className={pallets.exact ? "text-emerald-600 shrink-0" : "text-amber-600 shrink-0"}
                      />
                      <span className={`text-[11px] font-medium flex-1 ${pallets.exact ? "text-emerald-700" : "text-amber-700"}`}>
                        {pallets.full > 0 && `${pallets.full} паллет`}
                        {pallets.rem  > 0 && ` + ${pallets.rem} шт`}
                        {pallets.exact ? " — кратно паллете" : " — некратно паллете"}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#27265C] shrink-0">
                        ₽{fmt(lineTotal)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ─── DESKTOP: таблица ─── */}
          <div className="hidden sm:block bg-white rounded-2xl border border-[#E8E8E8] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#27265C]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/70 uppercase tracking-wider whitespace-nowrap">Наименование</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/70 uppercase tracking-wider whitespace-nowrap">Вязкость</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/70 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Спецификации</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/70 uppercase tracking-wider">Упаковка</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold text-white/70 uppercase tracking-wider whitespace-nowrap">Цена / шт</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold text-white/70 uppercase tracking-wider whitespace-nowrap">Наличие</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold text-white/70 uppercase tracking-wider min-w-[170px]">Количество</th>
                  <th className="px-3 py-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F4]">
                {filteredProducts.map(product => {
                  const activePkg = getActivePkg(product);
                  const qty       = getQty(product.id, activePkg.size);
                  const pallets   = calcPallets(qty, activePkg.palletQty);
                  const lineTotal = qty * activePkg.price;
                  const inCart    = qty > 0;

                  return (
                    <React.Fragment key={product.id}>
                      <tr
                        className={`transition-colors ${inCart ? "bg-[#27265C]/[0.025]" : "hover:bg-[#FAFAFA]"}`}
                      >
                        {/* Название */}
                        <td className="px-5 py-4">
                          <Link
                            to={`/product/${product.id}`}
                            className="font-semibold text-[#27265C] hover:underline text-sm leading-snug block"
                          >
                            {product.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Арт. {product.id}</p>
                        </td>
                        {/* Вязкость */}
                        <td className="px-4 py-4">
                          <span className="font-mono text-xs bg-[#27265C] text-white px-2 py-0.5 rounded font-bold whitespace-nowrap">
                            {product.viscosity}
                          </span>
                        </td>
                        {/* Спецификации */}
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="flex flex-col gap-0.5">
                            {product.specifications.slice(0, 2).map((s, i) => (
                              <span key={i} className="text-[11px] text-muted-foreground leading-snug">{s}</span>
                            ))}
                          </div>
                        </td>
                        {/* Упаковка */}
                        <td className="px-4 py-4">
                          <select
                            value={activePkg.size}
                            onChange={e => setSelPkg(p => ({ ...p, [product.id]: e.target.value }))}
                            className="text-sm border border-[#E2E2E2] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#27265C] cursor-pointer min-w-[120px]"
                          >
                            {product.packaging.map(pk => (
                              <option key={pk.size} value={pk.size}>
                                {pk.size} — ₽{fmt(pk.price)}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Цена */}
                        <td className="px-4 py-4 text-right">
                          <p className="font-bold text-[#27265C] text-sm">₽{fmt(activePkg.price)}</p>
                          <p className="text-[11px] text-muted-foreground">пал. {activePkg.palletQty} шт</p>
                        </td>
                        {/* Наличие */}
                        <td className="px-4 py-4 text-center">
                          <AvailBadge a={product.availability} />
                        </td>
                        {/* Количество */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => addQty(product.id, activePkg.size, -1)}
                              className="w-8 h-8 rounded-lg border border-[#E0E0E0] flex items-center justify-center text-[#27265C] hover:bg-red-50 hover:border-red-200 transition-colors"
                            >
                              <Icon name="Minus" size={12} />
                            </button>
                            <Input
                              type="number"
                              value={qty || ""}
                              placeholder="0"
                              onChange={e => setQtyDirect(product.id, activePkg.size, e.target.value)}
                              className="w-16 text-center font-bold h-8 text-sm border-[#E0E0E0]"
                            />
                            <button
                              onClick={() => addQty(product.id, activePkg.size, 1)}
                              className="w-8 h-8 rounded-lg border border-[#E0E0E0] flex items-center justify-center text-[#27265C] hover:bg-[#27265C] hover:border-[#27265C] hover:text-white transition-colors"
                            >
                              <Icon name="Plus" size={12} />
                            </button>
                          </div>
                        </td>
                        {/* Info */}
                        <td className="px-3 py-4 text-center">
                          <Link to={`/product/${product.id}`}>
                            <button className="w-8 h-8 rounded-lg border border-transparent flex items-center justify-center text-[#27265C]/30 hover:text-[#27265C] hover:border-[#E0E0E0] transition-colors">
                              <Icon name="Info" size={14} />
                            </button>
                          </Link>
                        </td>
                      </tr>

                      {/* ── Inline pallet info ── */}
                      {inCart && (
                        <tr key={`${product.id}-info`} className={pallets.exact ? "bg-emerald-50" : "bg-amber-50"}>
                          <td colSpan={8} className="px-5 py-1.5">
                            <div className="flex items-center gap-2">
                              <Icon
                                name={pallets.exact ? "PackageCheck" : "AlertCircle"}
                                size={11}
                                className={pallets.exact ? "text-emerald-600" : "text-amber-600"}
                              />
                              <span className={`text-[11px] font-medium ${pallets.exact ? "text-emerald-700" : "text-amber-700"}`}>
                                {pallets.full > 0 && `${pallets.full} паллет`}
                                {pallets.rem  > 0 && ` + ${pallets.rem} шт`}
                                {pallets.exact ? " — кратно паллете" : " — некратно паллете"}
                              </span>
                              <Separator orientation="vertical" className="h-3 mx-1" />
                              <span className="text-[11px] text-muted-foreground">
                                {qty} шт × ₽{fmt(activePkg.price)}
                              </span>
                              <span className="ml-auto text-[11px] font-extrabold text-[#27265C]">
                                = ₽{fmt(lineTotal)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ─── Desktop итог + кнопка ─── */}
          {totalQty > 0 && (
            <div className="hidden sm:flex items-center gap-6 bg-[#27265C] text-white rounded-2xl px-6 py-4 shadow-lg">
              <div className="grid grid-cols-3 gap-6 flex-1">
                <div>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mb-0.5">Позиций</p>
                  <p className="text-xl font-extrabold">{cartLineCount}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mb-0.5">Штук</p>
                  <p className="text-xl font-extrabold">{fmt(totalQty)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mb-0.5">Сумма</p>
                  <p className="text-xl font-extrabold text-[#FCC71E]">₽{fmt(totalAmount)}</p>
                </div>
              </div>
              <Button
                onClick={createOrder}
                className="bg-[#FCC71E] text-[#27265C] hover:bg-[#e6b41a] font-bold h-12 px-8 text-base shadow-sm shrink-0"
              >
                <Icon name="ShoppingCart" size={18} className="mr-2" />
                Оформить заказ
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MOBILE sticky footer
      ══════════════════════════════════════════════════ */}
      {selectedSeries && totalQty > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 shadow-2xl">
          <div className="bg-[#27265C] px-4 pt-3 pb-3">
            <div className="flex items-center gap-3">
              {/* Мини-итог */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wide leading-none">Позиций</p>
                  <p className="text-base font-extrabold text-white leading-tight">{cartLineCount}</p>
                </div>
                <div className="w-px h-8 bg-white/15 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wide leading-none">Штук</p>
                  <p className="text-base font-extrabold text-white leading-tight">{fmt(totalQty)}</p>
                </div>
                <div className="w-px h-8 bg-white/15 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-white/50 uppercase tracking-wide leading-none">Сумма</p>
                  <p className="text-base font-extrabold text-[#FCC71E] leading-tight truncate">₽{fmt(totalAmount)}</p>
                </div>
              </div>
              {/* CTA */}
              <Button
                onClick={createOrder}
                className="bg-[#FCC71E] text-[#27265C] hover:bg-[#e6b41a] font-bold h-11 px-5 shrink-0 text-sm"
              >
                Оформить
                <Icon name="ChevronRight" size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
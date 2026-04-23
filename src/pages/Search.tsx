import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { catalogData, type Product } from "@/data/catalogData";

interface ProductResult {
  product: Product;
  categoryId: string;
  categoryName: string;
  seriesId: string;
  seriesName: string;
}

const RECENT_SEARCHES = ["5W-30", "ATF AG52", "Classic 10W-40", "Antifreeze"];

const ORDERS_MOCK = [
  { id: "ORD-2026-0201", status: "На согласовании", date: "17.02.2026", sum: "389 500 ₽" },
  { id: "ORD-2026-0189", status: "Подтверждён", date: "08.02.2026", sum: "2 332 000 ₽" },
  { id: "ORD-2026-0175", status: "Отгружен", date: "01.02.2026", sum: "1 120 000 ₽" },
];

function getAllProducts(): ProductResult[] {
  const results: ProductResult[] = [];
  catalogData.forEach((cat) => {
    cat.series.forEach((series) => {
      series.products.forEach((product) => {
        results.push({ product, categoryId: cat.id, categoryName: cat.name, seriesId: series.id, seriesName: series.name });
      });
    });
  });
  return results;
}

function doSearch(query: string): { products: ProductResult[]; orders: typeof ORDERS_MOCK } {
  const q = query.toLowerCase().trim();
  if (!q) return { products: [], orders: [] };

  const all = getAllProducts();
  const products = all.filter(({ product, categoryName, seriesName }) =>
    product.name.toLowerCase().includes(q) ||
    product.id.toLowerCase().includes(q) ||
    product.viscosity?.toLowerCase().includes(q) ||
    product.specifications.some(s => s.toLowerCase().includes(q)) ||
    categoryName.toLowerCase().includes(q) ||
    seriesName.toLowerCase().includes(q)
  ).slice(0, 20);

  const orders = ORDERS_MOCK.filter(
    (o) => o.id.toLowerCase().includes(q) || o.status.toLowerCase().includes(q)
  );

  return { products, orders };
}

const fmt = (n: number) => n.toLocaleString("ru-RU");

function AvailBadge({ a }: { a: Product["availability"] }) {
  if (a === "in-stock")  return <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-medium px-1.5">В наличии</Badge>;
  if (a === "pre-order") return <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] font-medium px-1.5">Предзаказ</Badge>;
  return                        <Badge className="bg-red-100 text-red-700 border-0 text-[10px] font-medium px-1.5">Нет</Badge>;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#FCC71E]/40 text-[#27265C] rounded-sm not-italic font-semibold">{text.slice(idx, idx + query.trim().length)}</mark>
      {text.slice(idx + query.trim().length)}
    </>
  );
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 180);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const { products, orders } = doSearch(debouncedQuery);
  const total = products.length + orders.length;
  const isEmpty = debouncedQuery.length >= 1 && total === 0;
  const showEmpty = debouncedQuery.length === 0;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") navigate(-1);
  };

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
  };
  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const next = (prev[productId] ?? 0) - 1;
      if (next <= 0) { const c = { ...prev }; delete c[productId]; return c; }
      return { ...prev, [productId]: next };
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const goToCatalogWithSearch = () => {
    navigate(`/catalog?search=${encodeURIComponent(debouncedQuery)}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-0 pb-8">

      {/* ── Sticky search bar ── */}
      <div className="sticky top-0 bg-[#F4F4F4] pt-3 pb-3 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#27265C] hover:bg-white transition-colors flex-shrink-0"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Товар, артикул, вязкость, номер заказа..."
              className="pl-9 pr-9 h-11 bg-white border-[#E8E8E8] rounded-xl text-sm focus-visible:ring-[#27265C]/20 shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#27265C]"
              >
                <Icon name="X" size={15} />
              </button>
            )}
          </div>
          {/* Cart badge */}
          {cartCount > 0 && (
            <button
              onClick={() => navigate("/order/new")}
              className="relative w-9 h-9 flex items-center justify-center bg-[#FCC71E] rounded-xl text-[#27265C] flex-shrink-0 hover:bg-[#e6b41a] transition-colors shadow-sm"
            >
              <Icon name="ShoppingCart" size={18} />
              <span className="absolute -top-1 -right-1 bg-[#27265C] text-white text-[9px] font-extrabold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── Empty state — no query ── */}
      {showEmpty && (
        <div className="space-y-5 mt-2">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Недавние запросы
            </p>
            <div className="flex flex-wrap gap-2">
              {RECENT_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8E8E8] rounded-lg text-sm text-[#27265C] hover:border-[#27265C]/30 hover:bg-[#27265C]/5 transition-colors"
                >
                  <Icon name="Clock" size={13} className="text-muted-foreground" />
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Быстрый переход
            </p>
            <div className="space-y-1">
              {[
                { icon: "Package", label: "Каталог товаров", link: "/catalog", sub: "Весь ассортимент MANNOL" },
                { icon: "FileText", label: "Мои заказы", link: "/orders", sub: "История и статусы заказов" },
                { icon: "PackageX", label: "Недопоставки", link: "/backorders", sub: "Позиции ожидающие поступления" },
              ].map((item) => (
                <Link key={item.link} to={item.link}>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#E8E8E8] hover:border-[#27265C]/20 hover:bg-[#27265C]/5 transition-colors">
                    <div className="w-9 h-9 bg-[#27265C]/8 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as never} size={18} className="text-[#27265C]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#27265C]">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-auto flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Популярные категории
            </p>
            <div className="grid grid-cols-2 gap-2">
              {catalogData.map((cat) => {
                const icons: Record<string, string> = { "motor-oils": "Droplets", "transmission-oils": "Cog", "additives": "FlaskConical" };
                return (
                  <Link key={cat.id} to={`/catalog/${cat.id}`}>
                    <div className="flex items-center gap-2.5 px-3 py-3 bg-white rounded-xl border border-[#E8E8E8] hover:border-[#27265C]/20 hover:bg-[#27265C]/5 transition-colors">
                      <div className="w-8 h-8 bg-[#FCC71E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={(icons[cat.id] ?? "Package") as never} size={16} className="text-[#27265C]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#27265C] leading-tight truncate">{cat.name}</p>
                        <p className="text-[10px] text-muted-foreground">{cat.series.length} серий</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── No results ── */}
      {isEmpty && (
        <div className="mt-12 flex flex-col items-center text-center px-4">
          <div className="w-16 h-16 bg-[#27265C]/8 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="SearchX" size={32} className="text-[#27265C]/40" />
          </div>
          <p className="text-base font-semibold text-[#27265C]">Ничего не найдено</p>
          <p className="text-sm text-muted-foreground mt-1">
            По запросу «<span className="font-medium text-[#27265C]">{debouncedQuery}</span>» результатов нет
          </p>
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {RECENT_SEARCHES.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 bg-white border border-[#E8E8E8] rounded-lg text-sm text-[#27265C] hover:bg-[#27265C]/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {debouncedQuery.length >= 1 && !isEmpty && (
        <div className="space-y-5 mt-2">

          <p className="text-xs text-muted-foreground px-1">
            Найдено: <span className="font-semibold text-[#27265C]">{total}</span> результатов по запросу «{debouncedQuery}»
          </p>

          {/* ─── Products ─── */}
          {products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Товары ({products.length})
                </p>
                <button
                  onClick={goToCatalogWithSearch}
                  className="text-xs text-[#27265C] font-medium hover:underline flex items-center gap-1"
                >
                  Весь каталог <Icon name="ArrowRight" size={12} />
                </button>
              </div>

              <div className="space-y-2">
                {products.map(({ product, categoryId, categoryName, seriesId, seriesName }) => {
                  const defaultPkg = product.packaging[1] ?? product.packaging[0];
                  const qty = cart[product.id] ?? 0;

                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-xl border transition-all ${qty > 0 ? "border-[#27265C]/30 shadow-sm" : "border-[#E8E8E8] hover:border-[#27265C]/20"}`}
                    >
                      {/* ── Main row ── */}
                      <div className="flex items-start gap-3 px-4 pt-3 pb-2">
                        {/* Icon */}
                        <div className="w-10 h-10 bg-[#FCC71E]/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon name="Droplets" size={18} className="text-[#27265C]" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link to={`/product/${product.id}`} className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#27265C] leading-snug hover:underline">
                                <Highlight text={product.name} query={debouncedQuery} />
                              </p>
                            </Link>
                            <AvailBadge a={product.availability} />
                          </div>

                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {product.viscosity && (
                              <span className="font-mono text-[10px] bg-[#27265C] text-white px-1.5 py-0.5 rounded font-bold">
                                {product.viscosity}
                              </span>
                            )}
                            <span className="text-[11px] text-muted-foreground truncate">
                              {categoryName} · {seriesName}
                            </span>
                          </div>

                          <p className="text-[11px] text-muted-foreground mt-0.5">Арт. {product.id}</p>
                        </div>
                      </div>

                      {/* ── Bottom: specs + prices + add btn ── */}
                      <div className="px-4 pb-3">
                        {/* Specs */}
                        {product.specifications.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {product.specifications.slice(0, 3).map((s, i) => (
                              <span key={i} className="text-[10px] bg-[#F4F4F4] text-muted-foreground px-2 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Prices row + add to order */}
                        <div className="flex items-center justify-between gap-3">
                          {/* Packaging prices */}
                          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                            {product.packaging.slice(0, 3).map((pk) => (
                              <div key={pk.size} className="text-center">
                                <p className="text-xs font-bold text-[#27265C] leading-none">₽{fmt(pk.price)}</p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">{pk.size}</p>
                              </div>
                            ))}
                            {product.packaging.length > 3 && (
                              <span className="text-[10px] text-muted-foreground">+{product.packaging.length - 3}</span>
                            )}
                          </div>

                          {/* Qty stepper / add button */}
                          {qty === 0 ? (
                            <button
                              onClick={() => addToCart(product.id)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-[#27265C] text-white rounded-lg text-xs font-semibold hover:bg-[#1f1e4a] transition-colors flex-shrink-0"
                            >
                              <Icon name="Plus" size={13} />
                              В заказ
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="w-7 h-7 rounded-lg border border-[#E0E0E0] flex items-center justify-center text-[#27265C] hover:bg-red-50 hover:border-red-200 transition-colors"
                              >
                                <Icon name="Minus" size={12} />
                              </button>
                              <span className="w-7 text-center text-sm font-bold text-[#27265C]">{qty}</span>
                              <button
                                onClick={() => addToCart(product.id)}
                                className="w-7 h-7 rounded-lg bg-[#27265C] flex items-center justify-center text-white hover:bg-[#1f1e4a] transition-colors"
                              >
                                <Icon name="Plus" size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Link to catalog series */}
                        <Link
                          to={`/catalog/${categoryId}/${seriesId}`}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-[#27265C] mt-2 w-fit transition-colors"
                        >
                          <Icon name="FolderOpen" size={11} />
                          Перейти в серию: {seriesName}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA to catalog */}
              <button
                onClick={goToCatalogWithSearch}
                className="w-full mt-3 flex items-center justify-center gap-2 h-11 border border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 rounded-xl text-sm font-medium transition-colors"
              >
                <Icon name="Package" size={15} />
                Смотреть в каталоге: «{debouncedQuery}»
              </button>
            </div>
          )}

          {/* ─── Orders ─── */}
          {orders.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Заказы ({orders.length})
              </p>
              <div className="space-y-1.5">
                {orders.map((order) => (
                  <Link key={order.id} to={`/order/${order.id}`}>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#E8E8E8] hover:border-[#27265C]/20 hover:bg-[#27265C]/5 transition-colors">
                      <div className="w-9 h-9 bg-[#27265C]/8 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="FileText" size={17} className="text-[#27265C]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#27265C] font-mono">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.date} · {order.status}</p>
                      </div>
                      <span className="text-sm font-bold text-[#27265C] flex-shrink-0">{order.sum}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

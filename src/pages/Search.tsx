import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { catalogData } from "@/data/catalogData";

interface SearchResult {
  type: "product" | "category" | "series" | "order";
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  link: string;
  availability?: "in-stock" | "pre-order" | "out-of-stock";
  price?: number;
  sku?: string;
}

const RECENT_SEARCHES = ["5W-30", "ATF AG52", "Classic 10W-40", "Antifreeze"];

const ORDERS_MOCK = [
  { id: "ORD-2026-0201", status: "На согласовании", date: "17.02.2026", sum: "389 500 ₽" },
  { id: "ORD-2026-0189", status: "Подтверждён", date: "08.02.2026", sum: "2 332 000 ₽" },
  { id: "ORD-2026-0175", status: "Отгружен", date: "01.02.2026", sum: "1 120 000 ₽" },
];

function getAllProducts(): SearchResult[] {
  const results: SearchResult[] = [];
  catalogData.forEach((cat) => {
    cat.series.forEach((series) => {
      series.products.forEach((product) => {
        results.push({
          type: "product",
          title: product.name,
          subtitle: `${cat.name} · ${series.name} · ${product.viscosity}`,
          badge: product.availability === "in-stock" ? "В наличии" : product.availability === "pre-order" ? "Предзаказ" : "Нет",
          badgeColor: product.availability === "in-stock" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : product.availability === "pre-order" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-red-100 text-red-700 border-red-200",
          link: `/catalog/${cat.id}/${series.id}`,
          availability: product.availability,
          price: product.packaging[1]?.price,
          sku: product.id,
        });
      });
    });
  });
  return results;
}

function searchResults(query: string): { products: SearchResult[]; orders: typeof ORDERS_MOCK } {
  const q = query.toLowerCase().trim();
  if (!q) return { products: [], orders: [] };

  const allProducts = getAllProducts();
  const products = allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      (p.sku?.toLowerCase().includes(q))
  ).slice(0, 8);

  const orders = ORDERS_MOCK.filter(
    (o) => o.id.toLowerCase().includes(q) || o.status.toLowerCase().includes(q)
  );

  return { products, orders };
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { products, orders } = searchResults(debouncedQuery);
  const total = products.length + orders.length;
  const isEmpty = debouncedQuery.length >= 1 && total === 0;
  const showEmpty = debouncedQuery.length === 0;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-0 pb-8">

      {/* Search input bar */}
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
              placeholder="Товар, артикул, номер заказа..."
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
        </div>
      </div>

      {/* Empty state — no query yet */}
      {showEmpty && (
        <div className="space-y-5 mt-2">
          {/* Recent searches */}
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

          {/* Quick links */}
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

          {/* Popular categories */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Популярные категории
            </p>
            <div className="grid grid-cols-2 gap-2">
              {catalogData.map((cat) => (
                <Link key={cat.id} to={`/catalog/${cat.id}`}>
                  <div className="flex items-center gap-2.5 px-3 py-3 bg-white rounded-xl border border-[#E8E8E8] hover:border-[#27265C]/20 hover:bg-[#27265C]/5 transition-colors">
                    <div className="w-8 h-8 bg-[#FCC71E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Droplets" size={16} className="text-[#27265C]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#27265C] leading-tight truncate">{cat.name}</p>
                      <p className="text-[10px] text-muted-foreground">{cat.series.length} серий</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No results */}
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

      {/* Results */}
      {debouncedQuery.length >= 1 && !isEmpty && (
        <div className="space-y-4 mt-2">

          {/* Result count */}
          <p className="text-xs text-muted-foreground px-1">
            Найдено: <span className="font-semibold text-[#27265C]">{total}</span> результатов по запросу «{debouncedQuery}»
          </p>

          {/* Products */}
          {products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Товары ({products.length})
                </p>
                <Link to={`/catalog`} className="text-xs text-[#27265C] font-medium hover:underline">
                  Весь каталог
                </Link>
              </div>
              <div className="space-y-1.5">
                {products.map((item, idx) => (
                  <Link key={idx} to={item.link}>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#E8E8E8] hover:border-[#27265C]/20 hover:bg-[#27265C]/5 transition-colors group">
                      {/* Icon */}
                      <div className="w-9 h-9 bg-[#FCC71E]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Droplets" size={17} className="text-[#27265C]" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#27265C] leading-snug truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                      </div>
                      {/* Right side */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge className={`text-[10px] px-1.5 py-0 border ${item.badgeColor}`}>
                          {item.badge}
                        </Badge>
                        {item.price && (
                          <span className="text-xs font-semibold text-[#27265C]">
                            {item.price.toLocaleString("ru-RU")} ₽ / 4л
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
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
                      <span className="text-sm font-bold text-[#27265C] flex-shrink-0 text-right">{order.sum}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA to catalog */}
          {products.length >= 6 && (
            <Link to={`/catalog`}>
              <Button variant="outline" className="w-full h-11 border-[#27265C]/20 text-[#27265C] hover:bg-[#27265C]/5 mt-1">
                <Icon name="Package" size={15} className="mr-2" />
                Смотреть весь каталог
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const products = [
    {
      id: "MAN-001",
      name: "MANNOL 5W-30 API SN/CF",
      category: "Моторные масла",
      stock: 239,
      rating: 4.8,
      price: "₽1,250",
      isNew: true,
      isPopular: true,
      availability: "Много"
    },
    {
      id: "MAN-002",
      name: "MANNOL ATF AG52",
      category: "Трансмиссионные масла",
      stock: 18,
      rating: 4.6,
      price: "₽980",
      isNew: false,
      isPopular: true,
      availability: "Мало"
    },
    {
      id: "MAN-003",
      name: "MANNOL Radiator Cleaner",
      category: "Автохимия",
      stock: 0,
      rating: 4.9,
      price: "₽450",
      isNew: false,
      isPopular: false,
      availability: "Под заказ"
    },
    {
      id: "MAN-004",
      name: "MANNOL 10W-40 EXTRA",
      category: "Моторные масла",
      stock: 386,
      rating: 4.7,
      price: "₽1,100",
      isNew: true,
      isPopular: true,
      availability: "Много"
    },
    {
      id: "MAN-005",
      name: "MANNOL Brake Fluid DOT4",
      category: "Тормозные жидкости",
      stock: 123,
      rating: 4.5,
      price: "₽320",
      isNew: false,
      isPopular: false,
      availability: "Много"
    },
    {
      id: "MAN-006",
      name: "MANNOL Antifreeze AG13",
      category: "Антифризы",
      stock: 12,
      rating: 4.8,
      price: "₽680",
      isNew: true,
      isPopular: true,
      availability: "Мало"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27265C]">Каталог товаров</h1>
          <p className="text-gray-600 mt-1">Выберите товары для заказа</p>
        </div>
        <Link to="/order/new">
          <Button className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
            <Icon name="Plus" size={18} className="mr-2" />
            Создать заказ
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск товаров по названию или артикулу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="motor">Моторные масла</SelectItem>
                <SelectItem value="transmission">Трансмиссионные масла</SelectItem>
                <SelectItem value="chemicals">Автохимия</SelectItem>
                <SelectItem value="brake">Тормозные жидкости</SelectItem>
                <SelectItem value="antifreeze">Антифризы</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="border-[#27265C] text-[#27265C]">
          <Icon name="Package" size={14} className="mr-1" />
          {products.length} товаров
        </Badge>
        <Badge variant="outline" className="border-green-600 text-green-600">
          <Icon name="CheckCircle" size={14} className="mr-1" />
          {products.filter(p => p.availability === "Много").length} много
        </Badge>
        <Badge variant="outline" className="border-yellow-600 text-yellow-600">
          <Icon name="AlertTriangle" size={14} className="mr-1" />
          {products.filter(p => p.availability === "Мало").length} мало
        </Badge>
        <Badge variant="outline" className="border-blue-600 text-blue-600">
          <Icon name="Clock" size={14} className="mr-1" />
          {products.filter(p => p.availability === "Под заказ").length} под заказ
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-[#27265C]">{product.name}</h3>
                        {product.isNew && (
                          <Badge className="bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90">
                            <Icon name="Sparkles" size={12} className="mr-1" />
                            Новинка
                          </Badge>
                        )}
                        {product.isPopular && (
                          <Badge className="bg-green-500 text-white">
                            <Icon name="TrendingUp" size={12} className="mr-1" />
                            Популярно
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Артикул: {product.id} • {product.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#27265C]">{product.price}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Наличие</p>
                      <Badge className={
                        product.availability === "Много" ? "bg-green-100 text-green-700" :
                        product.availability === "Мало" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }>
                        {product.availability}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Категория</p>
                      <span className="text-sm font-semibold text-[#27265C]">{product.category}</span>
                    </div>
                  </div>

                  {product.availability === "Мало" && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">
                        Товар заканчивается! Рекомендуем пополнить запас.
                      </span>
                    </div>
                  )}
                  {product.availability === "Под заказ" && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Icon name="Info" size={16} className="text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">
                        Товара нет в наличии. Доступен предзаказ с обязательством выкупа.
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 md:w-40">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-[#27265C] text-[#27265C] hover:bg-[#27265C] hover:text-white">
                      <Icon name="Eye" size={16} className="mr-2" />
                      Подробнее
                    </Button>
                  </Link>
                  {product.availability === "Под заказ" ? (
                    <Link to={`/preorder/${product.id}`} className="flex-1">
                      <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 font-semibold">
                        <Icon name="Clock" size={16} className="mr-2" />
                        Предзаказ
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/order/new" className="flex-1">
                      <Button className="w-full bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90 font-semibold">
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        В заказ
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
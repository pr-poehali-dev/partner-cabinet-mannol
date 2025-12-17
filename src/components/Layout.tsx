import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: "LayoutDashboard", label: "Главная", path: "/" },
    { icon: "Package", label: "Каталог", path: "/catalog" },
    { icon: "ShoppingCart", label: "Создать заказ", path: "/order/new" },
    { icon: "FileText", label: "Мои заказы", path: "/orders" },
    { icon: "Calendar", label: "График отгрузок", path: "/schedule" },
    { icon: "Bell", label: "Уведомления", path: "/notifications" },
    { icon: "BarChart3", label: "Аналитика", path: "/analytics" },
    { icon: "Settings", label: "Настройки", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <aside
        className={`fixed left-0 top-0 h-full bg-[#27265C] text-white transition-all duration-300 z-50 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FCC71E] rounded-lg flex items-center justify-center font-bold text-[#27265C] text-xl">
                M
              </div>
              <span className="font-bold text-lg">MANNOL</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-white/10"
          >
            <Icon name={isSidebarOpen ? "ChevronLeft" : "ChevronRight"} size={20} />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive(item.path)
                    ? "bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90"
                    : "text-white hover:bg-white/10"
                } ${!isSidebarOpen && "justify-center"}`}
              >
                <Icon name={item.icon as any} size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-[#27265C]">
                Личный кабинет партнера
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/notifications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-[#27265C] hover:bg-gray-100"
                >
                  <Icon name="Bell" size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-gray-100"
                  >
                    <Avatar className="w-8 h-8 bg-[#27265C]">
                      <AvatarFallback className="bg-[#27265C] text-white font-semibold">
                        ИП
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-semibold text-[#27265C]">
                        ИП Петров
                      </p>
                      <p className="text-xs text-gray-500">Партнер</p>
                    </div>
                    <Icon name="ChevronDown" size={16} className="text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Icon name="User" size={16} className="mr-2" />
                    Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon name="Settings" size={16} className="mr-2" />
                    Настройки
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon name="HelpCircle" size={16} className="mr-2" />
                    Помощь
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#27265C] rounded-lg flex items-center justify-center font-bold text-white text-sm">
                  M
                </div>
                <span className="text-sm text-gray-600">
                  © 2024 MANNOL. Все права защищены.
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-[#27265C]">
                  Поддержка
                </a>
                <a href="#" className="hover:text-[#27265C]">
                  Документация
                </a>
                <a href="#" className="hover:text-[#27265C]">
                  Контакты
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
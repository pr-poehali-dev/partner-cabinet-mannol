import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DebtBanner from "@/components/DebtBanner";
import NotificationPanel from "@/components/NotificationPanel";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const notifications = [
    {
      id: "1",
      type: "order" as const,
      title: "Заказ #ORD-2024-1247 подтвержден",
      message: "Ваш заказ на 1,248 товаров успешно обработан и передан на склад",
      time: "2 часа назад",
      isRead: false,
      link: "/orders/ORD-2024-1247/details"
    },
    {
      id: "2",
      type: "payment" as const,
      title: "Платеж получен",
      message: "Оплата по счету #INV-2024-5689 на сумму 124,500₽ зачислена",
      time: "5 часов назад",
      isRead: false,
      link: "/orders"
    },
    {
      id: "3",
      type: "promotion" as const,
      title: "Новая акция: Весенняя распродажа",
      message: "Скидки до 30% на моторные масла. Успейте воспользоваться!",
      time: "1 день назад",
      isRead: false,
      link: "/notifications/PROMO-001"
    },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (location.pathname === '/notifications/panel') {
      setIsNotificationPanelOpen(true);
    } else {
      setIsNotificationPanelOpen(false);
    }
  }, [location]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleOpenNotificationPanel = () => {
    setIsNotificationPanelOpen(true);
    navigate('/notifications/panel');
  };

  const handleCloseNotificationPanel = () => {
    setIsNotificationPanelOpen(false);
    navigate(-1);
  };

  const menuItems = [
    { icon: "LayoutDashboard", label: "Главная", path: "/" },
    { icon: "Package", label: "Каталог", path: "/catalog" },
    { icon: "ShoppingCart", label: "Создать заказ", path: "/order/new" },
    { icon: "FileText", label: "Мои заказы", path: "/orders" },
    { icon: "PackageX", label: "Недопоставки", path: "/backorders" },
    { icon: "Calendar", label: "График отгрузок", path: "/schedule" },
    { icon: "Bell", label: "Уведомления", path: "/notifications" },
    { icon: "BarChart3", label: "Аналитика", path: "/analytics" },
    { icon: "Settings", label: "Настройки", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const SidebarNav = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="p-4 space-y-1">
      {menuItems.map((item) => (
        <Link key={item.path} to={item.path} onClick={onItemClick}>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${
              isActive(item.path)
                ? "bg-[#FCC71E] text-[#27265C] hover:bg-[#FCC71E]/90"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Icon name={item.icon as never} size={20} />
            <span>{item.label}</span>
          </Button>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#27265C] text-white transition-all duration-300 z-50 hidden lg:block ${
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
                <Icon name={item.icon as never} size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#27265C] text-white z-50 transition-transform duration-300 lg:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FCC71E] rounded-lg flex items-center justify-center font-bold text-[#27265C] text-xl">
              M
            </div>
            <span className="font-bold text-lg">MANNOL</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-white hover:bg-white/10"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        <SidebarNav onItemClick={() => setIsMobileSidebarOpen(false)} />
      </aside>

      <div
        className={`transition-all duration-300 lg:${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        <DebtBanner />

        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
            <div className="flex items-center gap-3">
              {/* Mobile burger */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-[#27265C] hover:bg-gray-100 p-2"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Icon name="Menu" size={22} />
              </Button>
              <h2 className="text-base md:text-xl font-semibold text-[#27265C] hidden sm:block">
                Личный кабинет партнера
              </h2>
              {/* Mobile logo */}
              <div className="flex items-center gap-2 sm:hidden">
                <div className="w-7 h-7 bg-[#FCC71E] rounded flex items-center justify-center font-bold text-[#27265C] text-sm">
                  M
                </div>
                <span className="font-bold text-[#27265C]">MANNOL</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Sheet open={isNotificationPanelOpen} onOpenChange={(open) => !open && handleCloseNotificationPanel()}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative text-[#27265C] hover:bg-gray-100"
                    onClick={handleOpenNotificationPanel}
                  >
                    <Icon name="Bell" size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md p-0">
                  <NotificationPanel notifications={notifications} />
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-gray-100 px-2"
                  >
                    <Avatar className="w-8 h-8 bg-[#27265C]">
                      <AvatarFallback className="bg-[#27265C] text-white font-semibold text-xs">
                        ИП
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-semibold text-[#27265C]">
                        ИП Петров
                      </p>
                      <p className="text-xs text-gray-500">Партнер</p>
                    </div>
                    <Icon name="ChevronDown" size={16} className="text-gray-500 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <Icon name="User" size={16} className="mr-2" />
                      Профиль
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem>
                      <Icon name="Settings" size={16} className="mr-2" />
                      Настройки
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/help">
                    <DropdownMenuItem>
                      <Icon name="HelpCircle" size={16} className="mr-2" />
                      Помощь
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link to="/login">
                    <DropdownMenuItem className="text-red-600">
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
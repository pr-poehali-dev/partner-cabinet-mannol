
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activation from "./pages/Activation";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import OrderNew from "./pages/OrderNew";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import Backorders from "./pages/Backorders";
import Schedule from "./pages/Schedule";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import DebtDetails from "./pages/DebtDetails";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activation" element={<Activation />} />
          <Route path="/forgot-password" element={<Login />} />
        </Routes>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="/help" element={<Dashboard />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:categoryId" element={<Catalog />} />
            <Route path="/catalog/:categoryId/:seriesId" element={<Catalog />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/order/new" element={<OrderNew />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId/details" element={<Orders />} />
            <Route path="/backorders" element={<Backorders />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications/panel" element={<Dashboard />} />
            <Route path="/notifications/:promoId" element={<Notifications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/debt-details" element={<DebtDetails />} />
            <Route path="/debt-details/modal" element={<Dashboard />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/support" element={<Dashboard />} />
            <Route path="/privacy" element={<Dashboard />} />
            <Route path="/terms" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
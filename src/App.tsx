
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterVerify from "./pages/RegisterVerify";
import Activation from "./pages/Activation";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordSent from "./pages/ForgotPasswordSent";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import OrderNew from "./pages/OrderNew";
import OrderDetails from "./pages/OrderDetails";
import OrderSend from "./pages/OrderSend";
import OrderReview from "./pages/OrderReview";
import OrderAdjust from "./pages/OrderAdjust";
import OrderConfirm from "./pages/OrderConfirm";
import OrderSuccess from "./pages/OrderSuccess";
import OrderScreening from "./pages/OrderScreening";
import OrderAdjustNew from "./pages/OrderAdjustNew";
import OrderConfirmNew from "./pages/OrderConfirmNew";
import OrderAccepted from "./pages/OrderAccepted";
import OrderBackorder from "./pages/OrderBackorder";
import Orders from "./pages/Orders";
import Backorders from "./pages/Backorders";
import Schedule from "./pages/Schedule";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import DebtDetails from "./pages/DebtDetails";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import B2BPortal from "./pages/B2BPortal";
import Search from "./pages/Search";

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
          <Route path="/register/verify" element={<RegisterVerify />} />
          <Route path="/activation" element={<Activation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password/sent" element={<ForgotPasswordSent />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/b2b" element={<B2BPortal />} />
        </Routes>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:categoryId" element={<Catalog />} />
            <Route path="/catalog/:categoryId/:seriesId" element={<Catalog />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/order/new" element={<OrderNew />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
            <Route path="/order/:orderId/send" element={<OrderSend />} />
            <Route path="/order/:orderId/review" element={<OrderReview />} />
            <Route path="/order/:orderId/adjust" element={<OrderAdjust />} />
            <Route path="/order/:orderId/confirm" element={<OrderConfirm />} />
            <Route path="/order/:orderId/success" element={<OrderSuccess />} />
            <Route path="/order/:orderId/screening" element={<OrderScreening />} />
            <Route path="/order/:orderId/adjust-new" element={<OrderAdjustNew />} />
            <Route path="/order/:orderId/confirm-new" element={<OrderConfirmNew />} />
            <Route path="/order/:orderId/accepted" element={<OrderAccepted />} />
            <Route path="/order/:orderId/backorder" element={<OrderBackorder />} />
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
            <Route path="/support" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
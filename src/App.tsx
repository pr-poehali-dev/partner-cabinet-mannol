
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import OrderNew from "./pages/OrderNew";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
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
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:categoryId" element={<Catalog />} />
            <Route path="/catalog/:categoryId/:seriesId" element={<Catalog />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/order/new" element={<OrderNew />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/debt-details" element={<DebtDetails />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
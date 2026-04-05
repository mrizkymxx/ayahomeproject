import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import WhyUs from "./pages/WhyUs";
import AdminLayout from "./components/AdminLayout";
import AdminRouteGuard from "./components/AdminRouteGuard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminLogin from "./pages/admin/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/why-us" element={<WhyUs />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRouteGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

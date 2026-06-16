import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "./pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductPage from "@/pages/ProductPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import AddressPage from "./pages/AddressPage/AddressPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AdminLayout from "./pages/AdminPages/AdminLayout/AdminLayout";
import AdminUsersPage from "./pages/AdminPages/AdminUsersPage/AdminUsersPage";
import AdminOrderPage from "./pages/AdminPages/AdminOrderPage/AdminOrderPage";
import AdminProductPage from "./pages/AdminPages/AdminProductPage/AdminProductPage";
import WishlistPage from "@/pages/WishlistPage";
import SellerStorePage from "@/pages/SellerStorePage";
import RequireRole from "@/components/RequireRole";

import NavBar from "@/features/navbar/NavBar";
import ContentWrapper from "@/components/ContentWrapper";
import Footer from "./features/footer/Footer";
import AccountLayout from "./pages/AccountLayout/AccountLayout";

function App() {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname} // 👈 VIKTIG!
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ContentWrapper>
            <Routes location={location}>
              {/* Routes här under pls */}

              <Route path="/admin" element={<AdminLayout />}>
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="products" element={<AdminProductPage />} />
                <Route path="orders" element={<AdminOrderPage />} />
              </Route>

              <Route index element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/seller/:sellerId" element={<SellerStorePage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/sellerdashboard"
                element={
                  <RequireRole roles={["seller", "admin"]}>
                    <SellerDashboardPage />
                  </RequireRole>
                }
              />

              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmationPage />}
              />
              <Route path="/profile" element={<AccountLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="address" element={<AddressPage />} />
                <Route path="orders" element={<OrdersPage />} />
              </Route>
            </Routes>
          </ContentWrapper>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;

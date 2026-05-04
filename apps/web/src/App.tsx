import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "./pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductPage from "@/pages/ProductPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import ReturnsPage from "./pages/ReturnsPage/ReturnsPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import AddressPage from "./pages/AddressPage/AddressPage";
import CheckoutPage from "./pages/CheckoutPage";


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
              <Route index element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route path="/profile" element={<AccountLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="address" element={<AddressPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="returns" element={<ReturnsPage />} />
              </Route>

            </Routes>
          </ContentWrapper>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;

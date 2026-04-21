import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import HomePage from "./pages/HomePage";
import ProductsPage from "@/pages/ProductsPage"
import ProductPage from "@/pages/ProductPage"
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import NavBar from "@/features/navbar/NavBar"
import ContentWrapper from "@/components/ContentWrapper";
import Footer from "./features/footer/Footer";


function App() {
  const location = useLocation();

  return (
    <>
      <div className="appLayout">
        <NavBar/>
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname} // 👈 VIKTIG!
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ height: "100%" }}
              >
              <ContentWrapper>
              <Routes location={location}>

                {/* Routes här under pls */}
                <Route path="/" element={<HomePage />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />

              </Routes>
              </ContentWrapper>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer/>
      </div>
      
    </>
  )
}

export default App;
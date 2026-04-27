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


function App() {
  const location = useLocation();

  return (
    <>
      <NavBar/>
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
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

          </Routes>
          </ContentWrapper>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default App;
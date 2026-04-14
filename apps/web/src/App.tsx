import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import ProductsPage from "@/pages/ProductsPage"
import ProductPage from "@/pages/ProductPage"



function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              >
              <ProductsPage />
            </motion.div>
          }/>
          <Route path="/product" element={<ProductPage />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App;

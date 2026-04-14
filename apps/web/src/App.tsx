import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import ProductsPage from "@/pages/ProductsPage"
import ProductPage from "@/pages/ProductPage"

import NavBar from "@/components/UI/Navigation/NavBar"
import MainContainer from "@/components/Containers/MainContainer";


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
          <MainContainer>
          <Routes location={location}>

            {/* Routes här under pls */}
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product" element={<ProductPage />} />

          </Routes>
          </MainContainer>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default App;

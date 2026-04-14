import "./App.css";
import { Routes, Route } from "react-router-dom";

import ProductsPage from "@/pages/ProductsPage"
import ProductPage from "@/pages/ProductPage"
import SignupPage from "./pages/SignupPage";

import MainContainer from "./components/Containers/MainContainer";
import ProductsContainer from "./components/Containers/ProductsContainer"
import NavBar from "./components/UI/Navigation/NavBar"
import ProductCard from "./components/ProductCard"
import Category from "./components/UI/Category"
import ProductCategories from "./components/UI/Navigation/ProductCategories";
import Banner from "./components/UI/Banner";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  )
}

export default App;

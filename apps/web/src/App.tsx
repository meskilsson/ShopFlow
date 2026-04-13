import "./App.css";
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
      <NavBar/>
      <Banner/>
      <MainContainer>
        <ProductCategories/>
        <Category categoryText="Shoes" articles={666}/>
        <ProductsContainer>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
        </ProductsContainer>
      </MainContainer>
    </>
  )
}

export default App;

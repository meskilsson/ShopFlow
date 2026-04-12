import "./App.css";
import MainContainer from "./components/Containers/MainContainer";
import ProductsContainer from "./components/Containers/ProductsContainer"
import NavBar from "./components/NavBar"
import ProductCard from "./components/ProductCard"
import Category from "./components/Category"

function App() {
  return (
    <>
      <NavBar/>
      <MainContainer>
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

import "./App.css";
import MainContainer from "./components/Containers/MainContainer";
import ProductsContainer from "./components/Containers/ProductsContainer"
import NavBar from "./components/NavBar"
import ProductCard from "./components/ProductCard"

function App() {
  return (
    <>
      <NavBar/>
      <MainContainer>
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

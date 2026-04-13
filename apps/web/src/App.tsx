import "./App.css";
import express from "express";

import productsRouter from "../../backend/src/routes/products"

const app = express();


// ---------------------- Routes ---------------------- //
app.use('/api/v1/products', productsRouter);

function App() {
  return <h1>hello!!!</h1>;
}

export default App;

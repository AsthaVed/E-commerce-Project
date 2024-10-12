//backup app.jsx
import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Product from './components/Product'
import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from 'react-router-dom'
import NoPage from './components/NoPage'
import ProductDetail from './components/ProductDetail'
import SearchItem from './components/SearchItem'
import Cart from './components/Cart'
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Index from './components/Index'
import Admin_register from './components/Admin_register'


function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  useEffect(() => {
    // Check if the user is authenticated (e.g., check localStorage for a token)
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const PrivateRoute = ({ loggedIn }) => {
    return loggedIn ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    <Router>
    <Navbar cart={cart} setProducts={setProducts} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
    <Routes>
      <Route path="/" element={<PrivateRoute loggedIn={loggedIn} />}>
      <Route index element={<Index products={products} setCart={setCart} />}></Route>
      <Route path='/product/:id' element={<ProductDetail products={products} setCart={setCart} />}></Route>
      <Route path='/search/:item' element={<SearchItem products={products} setCart={setCart} />}></Route>
      <Route path='/cart' element={<Cart cart={cart} setCart={setCart} />}></Route>
      </Route>
      {!loggedIn && (<> <Route path='/register' element={<Register setLoggedIn={setLoggedIn} />}></Route>
      <Route path='/login' element={<Login setLoggedIn={setLoggedIn} />}></Route></>)}
      {loggedIn && <Route path='/logout' element={<Logout setLoggedIn={setLoggedIn} />}></Route>}
      <Route path="*" element={<NoPage />} />
      <Route path="/admin_register" element={<Admin_register />} />
    </Routes>
    </Router>
    
    </>
  )
}

export default App
















//product.jsx
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Product = ({ products, setCart }) => {
  const addToCart = (id, title, price, description, imgSrc) => {
    const obj = {
      id,
      title,
      price,
      description,
      imgSrc,
    };
    setCart((prevCart) => {
      const updatedList = [...prevCart, obj];
      console.log(updatedList);
      return updatedList;
    });

    toast.success("Your item is added on Cart!", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <>
      <div className="product_container">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <Link to={`/product/${product.id}`}>
              <img
                src={product.imgSrc}
                alt={product.category}
                style={{ width: "100%" }}
              />
            </Link>
            <div className="card-body">
              <h5>{product.title}</h5>
              <p className="product-desc">{product.description}</p>
              <div className="card-body-btn">
                <button>{product.price} ₹</button>
                <button
                  onClick={() =>
                    addToCart(
                      product.id,
                      product.title,
                      product.price,
                      product.description,
                      product.imgSrc
                    )
                  }
                >
                  Add To Cart
                </button>
              </div>
              <div className="card-body-btn" style={{'marginTop': '10px'}}>
                <button>Edit</button>
                <button>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Product;

import React, { useEffect, useState } from 'react'
import Product from './Product';

const Index = ({products, setCart, setProducts}) => {
    const [username, setUsername] = useState('');
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      }, []);
  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <Product products={products} setCart={setCart} setProducts={setProducts}/>
    </div>
  )
}

export default Index

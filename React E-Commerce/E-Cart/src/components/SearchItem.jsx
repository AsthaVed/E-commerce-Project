import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Product from './Product';
import axios from "axios";

const SearchItem = ({setCart}) => {
  
  const {item} = useParams();
  const [filterData, setFilterData] = useState([]);
  const [products, setProducts] = useState([]);

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

  useEffect(() =>{
    const filteredData = () => {
      const data = products.filter((p) => 
        p.title.toLowerCase().includes(item.toLowerCase())
      )
      setFilterData(data);
    }
    filteredData();
    console.log(filterData);
  }, [item, products]);
  console.log(filterData);

  return (
    <div>
      {filterData.length > 0 ? (
        <Product products={filterData} setCart={setCart}/>
      ) : (
        <p>No products match your search.</p>
      )}
    </div>
  )
}

export default SearchItem
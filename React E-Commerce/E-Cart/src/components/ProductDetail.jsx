import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "./Product";
import { toast } from "react-toastify";

const ProductDetail = ({products, setCart, setProducts}) => {

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

  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const filteredProduct = products.filter((prod) => prod.id == id);
      console.log("filteredProduct", filteredProduct);
      setProduct(filteredProduct[0]);

      const filteredRelatedProduct = products.filter(
        (prod) => prod.category === filteredProduct[0].category && prod.id !== filteredProduct[0].id
        // (prod) => prod.category === filteredProduct.category && prod.id !== filteredProduct.id
      );
      console.log("filterRelatedProduct", filteredRelatedProduct);
      setRelatedProduct(filteredRelatedProduct);
    }
  }, [id, products]);

  console.log("product", product);
  console.log("setproduct", setProduct);

  return (
    <>
      <div className="main_card"  key={product.id}>
        <div className="pdp_img">
          <img
            src={product.imgSrc}
            alt={product.category}
            style={{ width: "100%" }}
          />
        </div>
        <div className="pdp_para">
          <h1 className="product-desc" style={{margin: "0px", textAlign: "center"}}>{product.title}</h1>
          <p className="product-desc" style={{textAlign: "center"}}>{product.description}</p>
          <div className="card-body-btn">
            <button>{product.price} ₹</button>
            <button onClick={() =>
                    addToCart(
                      product.id,
                      product.title,
                      product.price,
                      product.description,
                      product.imgSrc
                    )
                  }>Add To Cart</button>
          </div>
        </div>
        
      </div>
      <div>
      <h1 style={{textAlign: "center"}}>Related Products</h1>
      {relatedProduct.length > 0 ? (
        <Product products={relatedProduct} setCart={setCart} setProducts={setProducts}/>
      ) : (
        <p>No products match your search.</p>
      )}     
      </div>
  
    </>
  );
};

export default ProductDetail;

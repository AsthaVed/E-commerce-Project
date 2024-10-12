import React from "react";
import { Link } from "react-router-dom";

const Cart = ({ cart, setCart }) => {
  return (
    <>
      {cart.length == 0 ? (
        <>
          <div>
            <h1>Your cart is Empty</h1>
            <Link to={"/"}>Continue Shopping...</Link>
          </div>
        </>
      ) : (
        cart.map((product) => (
          <div className="main_card" key={product.id}>
            <div className="pdp_img">
              <img
                src={product.imgSrc}
                alt={product.category}
                style={{ width: "100%" }}
              />
            </div>
            <div className="pdp_para">
              <h1
                className="product-desc"
                style={{ margin: "0px", textAlign: "center" }}
              >
                {product.title}
              </h1>
              <p className="product-desc" style={{ textAlign: "center" }}>
                {product.description}
              </p>
              <div className="card-body-btn">
                <button>{product.price} ₹</button>
                <button>Buy Now</button>
              </div>
            </div>
          </div>
        ))
      )}

      {cart.length != 0 && (
        <div
          style={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button>Checkout</button>
          <button onClick={() => setCart("")}>Clear Cart</button>
        </div>
      )}
    </>
  );
};

export default Cart;

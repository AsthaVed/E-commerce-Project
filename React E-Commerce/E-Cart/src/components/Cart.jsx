import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Cart = ({ cart, setCart }) => {
  const [paidFor, setPaidFor] = useState(false);

  const handleApprove = (orderId) => {
    // Handle payment success here
    console.log("Order successful! Order ID: ", orderId);
    setPaidFor(true);
    setCart([]); // Clear the cart after successful payment
  };

  return (
    <>
      {cart.length === 0 ? (
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

      {cart.length !== 0 && (
        <div
          style={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* <h2>Total: ₹{cart.reduce((acc, product) => acc + Number(product.price), 0)}</h2> */}
          <h2>
  Total: ₹
  {cart.reduce((acc, product) => {
    console.log("Accumulator:", acc);
    console.log("Current Product:", product);
    return acc + Number(product.price);
  }, 0)}
</h2>


          
          {!paidFor ? (
            <PayPalScriptProvider
              options={{
                "client-id": "YOUR_PAYPAL_CLIENT_ID", // Replace with your actual PayPal Client ID
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: cart
                            .reduce((acc, product) => acc + product.price, 0)
                            .toString(),
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const order = await actions.order.capture();
                  handleApprove(order.id);
                }}
                onError={(err) => {
                  console.error("PayPal Checkout onError", err);
                }}
              />
            </PayPalScriptProvider>
          ) : (
            <h3>Payment Successful!</h3>
          )}

          <button onClick={() => setCart([])}>Clear Cart</button>
        </div>
      )}
    </>
  );
};

export default Cart;


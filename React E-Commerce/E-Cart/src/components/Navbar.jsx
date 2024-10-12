import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { BsFillCartCheckFill, BsPersonFill } from "react-icons/bs";
import { RiLogoutCircleFill } from "react-icons/ri"; // Import logout icon
import { AiOutlineUserAdd } from "react-icons/ai"; // Import register icon

const Navbar = ({ setProducts, cart, setLoggedIn, loggedIn }) => {
  
  const navigate = useNavigate();
  const handleLogout = () => {
    setLoggedIn(false); // Set logged-in state to false
    // localStorage.removeItem("token"); // Optionally remove token from localStorage
    console.log("User logged out");
    localStorage.removeItem('auth');
    navigate("/login");
  };
  // console.log(useLocation);
  const location = useLocation();
  const [items, setItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);
  

  const filterByCategory = (category) => {
    const element = items.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
    setProducts(element);
  };

  const filterByPrice = (price) => {
    const numericPrice = Number(price); // Convert the filter price to a number
    // console.log("Filtered price:", typeof numericPrice);
    const filteredProducts = items.filter(
      (product) => Number(product.price) >= numericPrice // Ensure product price is a number
    );
    setProducts(filteredProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <>
      <header style={{ position: "sticky", top: "0" }}>
        <div className="container">
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? "active brand" : "inactive-link brand"
            }
          >
            E-Commerce
          </NavLink>
          <form onSubmit={handleSubmit} className="search-bar">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search Products"
            />
          </form>
          <div className="nav-icons">
            {!loggedIn && (
              <>
                {/* {" "} */}
                <NavLink
                  className={
                    location.pathname === "/register"
                      ? "active"
                      : "inactive-link"
                  }
                  to={"/register"}
                >
                  <button className="btn_style">
                    <AiOutlineUserAdd style={{ fontSize: "1.5rem" }} />
                  </button>
                </NavLink>
                <NavLink
                  className={
                    location.pathname === "/login" ? "active" : "inactive-link"
                  }
                  to={"/login"}
                >
                  <button className="btn_style">
                    <BsPersonFill style={{ fontSize: "1.5rem" }} />
                  </button>
                </NavLink>
              </>
            )}
            {loggedIn && (
                <button className="btn_style" onClick={handleLogout}>
                  <RiLogoutCircleFill style={{ fontSize: "1.5rem" }} />
                </button>
            )}

            <NavLink
              className={({ isActive }) =>
                isActive ? "active cart" : "inactive-link cart"
              }
              to={"/cart"}
            >
              <button className="btn_style">
                <BsFillCartCheckFill style={{ fontSize: "1.5rem" }} />
                <span className="count">
                  {cart.length}
                  <span style={{ display: "none" }}>unread message</span>
                </span>
              </button>
            </NavLink>
          </div>
        </div>

        {location.pathname == "/" && (
          <div className="nav-bar-wrapper">
            <div className="items">Filter by -&gt;</div>
            <div className="items" onClick={() => setProducts(items)}>
              No Filter
            </div>
            <div className="items" onClick={() => filterByCategory("mobiles")}>
              Mobiles
            </div>
            <div className="items" onClick={() => filterByCategory("laptops")}>
              Laptops
            </div>
            <div className="items" onClick={() => filterByCategory("tablets")}>
              Tablets
            </div>
            <div className="items" onClick={() => filterByPrice("29999")}>
              {">="} 29999
            </div>
            <div className="items" onClick={() => filterByPrice("49999")}>
              &gt;= 49999
            </div>
            <div className="items" onClick={() => filterByPrice("69999")}>
              &gt;= 69999
            </div>
            <div className="items" onClick={() => filterByPrice("89999")}>
              &gt;= 89999
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;

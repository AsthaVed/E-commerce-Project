import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';

const Product = ({ products, setCart, setProducts }) => {
  const [editableProduct, setEditableProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    category: '',
    title: '',
    imgSrc: '',
    amazonLink: '',
    description: '',
    price: 0
  });
  const [newProduct, setNewProduct] = useState({
    // id: '',
    category: '',
    title: '',
    imgSrc: '',
    amazonLink: '',
    description: '',
    price: 0
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const addToCart = (id, title, price, description, imgSrc) => {
    const obj = { id, title, price, description, imgSrc };
    setCart((prevCart) => {
      const updatedList = [...prevCart, obj];
      console.log(updatedList);
      return updatedList;
    });

    toast.success("Your item is added to the Cart!", {
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

  const handleEditProduct = (product) => {
    setEditableProduct(product);
    setUpdatedProduct({
      category: product.category,
      title: product.title,
      description: product.description,
      price: product.price,
      imgSrc: product.imgSrc,
      amazonLink: product.amazonLink
    });
  };

  const handleInputChange = (event, setState) => {
    const { name, value } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateProduct = () => {
    const { id } = editableProduct;
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
        return response.json();
      })
      .then((updatedProductFromServer) => {
        const updatedProducts = products.map((product) =>
          product.id === id ? updatedProductFromServer : product
        );
        setProducts(updatedProducts);
        setEditableProduct(null); // Clear editable product after update
        setUpdatedProduct({
          category: '',
          title: '',
          imgSrc: '',
          amazonLink: '',
          description: '',
          price: 0
        }); // Reset updated product form
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  const handleDeleteProduct = (id) => {
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(response => {
        console.log('Product deleted successfully');
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
      })
      .catch(error => {
        console.error('Error deleting product', error);
      });
  };

  const handleAddProduct = () => {
    axios.post('http://localhost:5000/api/products', newProduct)
      .then(response => {
        console.log('Product added successfully');
        setProducts((prevProducts) => [...prevProducts, response.data]);
        setNewProduct({
          // id: '',
          category: '',
          title: '',
          imgSrc: '',
          amazonLink: '',
          description: '',
          price: 0
        }); // Reset new product form
      })
      .catch(error => {
        console.error('Error adding product', error);
      });
  };

  const [role, setRole] = useState('');
  useEffect(() => {
      const storedRole = localStorage.getItem('role');
      if (storedRole) {
        setRole(storedRole);
      }
    }, []);

  return (
    <>
    

      {/* Conditionally render the "Add New Product" button */}
      {(role === '1' || role === '2') && (
        <div>
          <button onClick={togglePopup} className="add_product">Add New Product</button>
        </div>
      )}


{/* Popup for adding a new product */}
{isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Product</h2>
            <form onSubmit={e => { e.preventDefault(); handleAddProduct(); }}>
              <input type="text" name="category" value={newProduct.category} onChange={e => handleInputChange(e, setNewProduct)} placeholder="Category" required />
              <input type="text" name="title" value={newProduct.title} onChange={e => handleInputChange(e, setNewProduct)} placeholder="Title" required />
              <textarea name="description" value={newProduct.description} onChange={e => handleInputChange(e, setNewProduct)} placeholder="Description" required />
              <input type="number" name="price" value={newProduct.price} onChange={e => handleInputChange(e, setNewProduct)} placeholder="Price" required />
              <input type="text" name="imgSrc" value={newProduct.imgSrc} onChange={e => handleInputChange(e, setNewProduct)} placeholder="Image URL" required />
              <input type="text" name="amazonLink" value={newProduct.amazonLink} onChange={e => handleInputChange(e, setNewProduct)} placeholder="Amazon Link" required />
              <button type="submit">Add Product</button>
              <button onClick={togglePopup}>Cancel</button>
            </form>
          </div>
        </div>
      )}



      {/* Render the product list */}
      <div className="product_container">
        {products.map((product) => (
          editableProduct && editableProduct.id === product.id ? (
            <div className="card" key={product.id}>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={updatedProduct.category}
                onChange={e => handleInputChange(e, setUpdatedProduct)}
                placeholder="Product Category"
              /><br />
              <label>Product Link</label>
              <input
                type="text"
                name="amazonLink"
                value={updatedProduct.amazonLink}
                onChange={e => handleInputChange(e, setUpdatedProduct)}
                placeholder="Product Link"
              /><br />
              <label>Product Title</label>
              <input
                type="text"
                name="title"
                value={updatedProduct.title}
                onChange={e => handleInputChange(e, setUpdatedProduct)}
                placeholder="Title"
              /><br />
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={updatedProduct.description}
                onChange={e => handleInputChange(e, setUpdatedProduct)}
                placeholder="Product Description"
              /><br />
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={e => handleInputChange(e, setUpdatedProduct)}
                placeholder="Product Price"
              /><br />
              <label>Image Url</label>
              <input
                type="text"
                name="imgSrc"
                value={updatedProduct.imgSrc}
                onChange={e => handleInputChange(e, setUpdatedProduct)}
                placeholder="Image URL"
              />
              <button onClick={handleUpdateProduct}>Update</button>
              <button onClick={() => setEditableProduct(null)}>Cancel</button>
            </div>
          ) : (
            <div className="card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.imgSrc}
                  alt={product.title}
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
                {(role === '1' || role === '2') && (
                <div className="card-body-btn" style={{ marginTop: "10px" }}>
                  <button onClick={() => handleEditProduct(product)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </div>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </>
  );
};

export default Product;

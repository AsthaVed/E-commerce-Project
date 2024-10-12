const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const app = express();
const cors = require("cors");
const data = require("./products.json");
const fs = require('fs');

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));

// Create connection to MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "react_register",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("MySQL Connected...");
  }
});

// Create a new user
app.post("/register", (req, res) => {
  console.log("req.body", req.body);
  const { name, email, password, role } = req.body;
  console.log(name, email, password, role);
  const hashedPassword = bcrypt.hashSync(password, 8);
  console.log("Hashed password:", hashedPassword);

  // Check if email already exists
  const checkUsernameQuery = "SELECT * FROM register WHERE email = ?";

  db.query(checkUsernameQuery, [email], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send(err);
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ message: "Username already exists" });
      return;
    } else {
      // Insert new user
      const query =
        "INSERT INTO register (name, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(query, [name, email, hashedPassword, role], (err, result) => {
        console.log("guys");
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).send(err);
        } else {
          console.log("User registered successfully:", result);
          res.status(200).send({ message: "User registered successfully!" });
        }
      });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  const query = "SELECT * FROM register WHERE email = ? AND role = ?";

  db.query(query, [email, role], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const user = results[0];
    console.log("user details", user);
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    console.log("passwordIsValid", passwordIsValid);

    if (!passwordIsValid) {
      res.status(400).json({ message: "Invalid credentials" });
    } else {
      res.status(200).json({ authenticated: true, username: user.name, role: user.role });
    }
  });
});

// run to get the products
app.get("/api/products", (req, res) => {
  res.json(data);
});


// PUT endpoint to update a product by ID
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  const productIndex = data.findIndex(product => product.id === parseInt(id));
  console.log("Hello hii byy byy");

  if (productIndex !== -1) {
      // Update the product details
      data[productIndex] = { ...data[productIndex], ...updatedProduct };

      const dataFilePath = './products.json';
      fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), (err) => {
          if (err) {
              console.error('Error writing to the JSON file', err);
              return res.status(500).json({ message: 'Internal Server Error' });
          }
          res.status(200).json(data[productIndex]);
      });
  } else {
      res.status(404).json({ message: 'Product not found' });
  }
});


// DELETE endpoint to delete a product by ID
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = data.findIndex(product => product.id === parseInt(id));

  if (productIndex !== -1) {
      data.splice(productIndex, 1);

      // Define the path to your JSON file
      const dataFilePath = './products.json'; // Adjust this path if necessary

      // Persist the change to the JSON file
      fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), (err) => {
          if (err) {
              console.error('Error writing to the JSON file', err);
              return res.status(500).json({ message: 'Internal Server Error' });
          }
          res.status(200).json({ message: 'Product deleted successfully' });
      });
  } else {
      res.status(404).json({ message: 'Product not found' });
  }
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  newProduct.id = data.length ? data[data.length - 1].id + 1 : 1; // Generate a new ID
  data.push(newProduct);

  const dataFilePath = './products.json';
  fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
          console.error('Error writing to the JSON file', err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.status(201).json(newProduct);
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

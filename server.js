require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

const PORT = process.env.API_PORT || 3000;

const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
        connection.release();
    }
});

app.post('/store-products', (req, res) => {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: "Invalid JSON format" });
    }
    
    db.query("TRUNCATE TABLE products", (truncateErr) => {
        if (truncateErr) return res.status(500).json({ error: truncateErr.message });
        
        if (products.length === 0) {
            return res.status(200).json({ message: "Success." });
        }
  
        let completedInserts = 0;
        let hasError = false;
        
        products.forEach(product => {
            const query = "INSERT INTO products (name, price, availability) VALUES (?, ?, ?)";
            db.query(query, [product.name, product.price, product.availability], (err) => {
                if (err && !hasError) {
                    hasError = true;
                    return res.status(500).json({ error: err.message });
                }
                
                completedInserts++;
                if (completedInserts === products.length && !hasError) {
                    return res.status(200).json({ message: "Success." });
                }
            });
        });
    });
});


app.get('/list-products', (req, res) => {
    db.query("SELECT name, price, availability FROM products", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const formattedResults = results.map(product => ({
            name: product.name,
            price: product.price, 
            availability: product.availability === 1
        }));
        
        res.status(200).json({ products: formattedResults });
    });
});

app.listen(PORT, () => console.log(`Server running on http://0.0.0.0:${PORT}`));
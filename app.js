const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
require('dotenv').config()

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const port = process.env.PORT || 8206;

app.listen(port, ()=>{
  console.log("Connected to backend")
});

app.get(`/`, (req, res) => {
  res.json("Hello this is backend");
});

app.get("/movies", (req,res)=>{
  const q = "SELECT * FROM movies"
  db.query(q,(err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

app.post("/movies", (req, res) => {
  const q = "INSERT INTO movies (`movieName`,`director`,`budget`,`cast`,`imdbrate`,`image`) VALUES (?)";
  const values = [
    req.body.movieName,
    req.body.director,
    req.body.budget,
    req.body.cast,
    req.body.imdbrate,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    console.log("Movie has been created successfully.");
    return res.json("Movie has been created successfully.");
  });
});

app.delete("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const q = "DELETE FROM movies WHERE id = ?";

  db.query(q, [movieId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Movie has been deleted successfully.");
  });
});

app.put("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const q = "UPDATE movies SET `movieName` = ?, `director` = ?, `budget` = ?, `cast` = ?, `imdbrate` = ?, `image` = ? WHERE id = ?";

  const values = [
    req.body.movieName,
    req.body.director,
    req.body.budget,
    req.body.cast,
    req.body.imdbrate,
  ];

  db.query(q, [...values, movieId], (err, data) => {
    if (err) return res.json(err);
    console.log("Movie has been updated successfully.");
    return res.json("Movie has been updated successfully.");
  });
});

//404-not found
app.use((req, res) => {
  res.status(404).send('Path not found');
});
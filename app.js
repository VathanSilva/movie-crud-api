const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
require('dotenv').config()
const multer = require('multer');

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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

app.post("/movies", upload.single('image'), (req, res) => {
  console.log(req.file);
  const q = "INSERT INTO movies (`movieName`,`director`,`budget`,`cast`,`imdbrate`,`image`) VALUES (?)";
  const values = [
    req.body.movieName,
    req.body.director,
    req.body.budget,
    req.body.cast,
    req.body.imdbrate,
    req.file.path,
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

app.put("/movies/:id", upload.single('image'), (req, res) => {
  const movieId = req.params.id;
  const q = "UPDATE movies SET `movieName` = ?, `director` = ?, `budget` = ?, `cast` = ?, `imdbrate` = ?, `image` = ? WHERE id = ?";

  const values = [
    req.body.movieName,
    req.body.director,
    req.body.budget,
    req.body.cast,
    req.body.imdbrate,
    req.file.path,
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

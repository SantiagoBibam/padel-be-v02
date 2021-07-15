const express = require('express');
const app = express();
const mysql = require('mysql');
const fetch = require('node-fetch');
const cors = require("cors");
app.use(cors())

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'prueba'
  });
connection.connect();

app.get('/select', function (req, res) {
  
  try{
    connection.query('SELECT category FROM categories_v2 WHERE active = 1', function(err, rows, fields) {
    if (err) {
      res.json({
        error: err.message
      });
    }
    res.json(rows);
  });
 }
 catch(error){
   res.json({
     error: error.message
   });
 }
});

app.get('/ranking', function (req, res) {
  let category = req.query.category;
  try{
    connection.query('SELECT affiliate_number, name, last_name, ranking_points FROM prueba.players_v2 where category =' + category + ' AND active = 1 ORDER BY ranking_points desc ', function(err, rows, fields) {
    if (err) {
      res.json({
        error: err.message
      });
    }
    res.json(rows);
  });
 }
 catch(error){
   res.json({
     error: error.message
   });
 }
});

process.on("SIGTERM", function(){
  if(connection){
    connection.end();
  }
})

var server = app.listen(5000, function () {
    console.log('Server is listening at port 5000...');
});

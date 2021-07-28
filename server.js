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

app.get('/search', function (req, res) {
  let name = req.query.name;
  try{
    connection.query("SELECT affiliate_number, name, last_name, category, ranking_points FROM prueba.players_v2 WHERE concat(name, ' ', last_name) LIKE '%" + name + "%'ORDER BY ranking_points desc" , function(err, rows, fields) {
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

app.get('/player', function (req, res) {
  let category = req.query.category;
  try{
    connection.query('SELECT affiliate_number, name, last_name, category, ranking_points FROM prueba.players_v2 where category =' + category + ' AND active = 1 ORDER BY ranking_points desc ', function(err, rows, fields) {
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

app.get('/player/:id', function (req, res) {
  let affiliateNumber = req.params.id;
  try{
    connection.query('SELECT affiliate_number, name, last_name, id, category, ranking_points, contact, active from players_v2 WHERE affiliate_number =' + affiliateNumber, function(err, rows, fields) {
    if (err) {
      res.json({
        error: err.message
      });
    }
    if (rows.length === 0){
      res.json({
        error: err.message
      });
    } else{
      res.json(rows[0]);
    }
    
  });
 }
 catch(error){
   res.json({
     error: error.message
   });
 }
});

app.put('/player', function (req, res) {
  let name = req.query.name;
  let lastName = req.query.lastName;
  let id = req.query.id;
  let category = req.query.category;
  let rankingPoints = req.query.rankingPoints;
  let contact = req.query.contact;
  let active = req.query.active;
  
  try{
    connection.query("INSERT INTO players_v2 VALUES (NULL, '" + name + "', '" + lastName + "'," + id + ", '" + category + "', " + rankingPoints + ", '" + contact + "'," + active + ")", function(err, rows, fields) {
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

app.post('/player', function (req, res) {
  let affiliateNumber = req.query.affiliateNumber;
  let name = req.query.name;
  let lastName = req.query.lastName;
  let id = req.query.id;
  let category = req.query.category;
  let rankingPoints = req.query.rankingPoints;
  let contact = req.query.contact;
  let active = req.query.active;
  
  try{
    connection.query("UPDATE players_v2 SET name='" + name + "', last_name='" + lastName + "', id=" + id + ", category='" + category + "', ranking_points=" + rankingPoints + ", contact='" + contact + "', active = " + active + " where affiliate_number = " + affiliateNumber, function(err, rows, fields) {
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

app.delete('/player', function (req, res) {
  let affiliateNumber = req.query.affiliateNumber;
  try{
    connection.query('UPDATE players_v2 SET active = 0 WHERE affiliate_number = ' + affiliateNumber, function(err, rows, fields) {
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


app.get('/category', function (req, res) {
  let onlyActives = ""
  if (req.query.onlyactives == "true"){
    onlyActives = " WHERE active = 1"
  }
  try{
    connection.query('SELECT category, active FROM categories_v2' + onlyActives, function(err, rows, fields) {
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

app.post('/category', function (req, res) {
  let oldName = req.query.oldName;
  let newName = req.query.newName;
  let active = req.query.active
  try{
    connection.query("UPDATE categories_v2 set category='" + newName + "', active=" + active + " WHERE category='" + oldName + "'", function(err, rows, fields) {
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

app.put('/category', function (req, res) {
  let category = req.query.newCategory
  try{
    connection.query("INSERT INTO categories_v2 VALUES ('" + category + "', 1)", function(err, rows, fields) {
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

app.delete('/category', function (req, res) {
  let category = req.query.category
  try{
    connection.query("UPDATE categories_v2 SET active=0 WHERE category='" + category + "'", function(err, rows, fields) {
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

app.get('/users', function (req, res) {
  try{
    connection.query('SELECT email, admin, user, active FROM accounts_v2 ORDER BY active desc, email asc', function(err, rows, fields) {
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

app.get('/user', function (req, res) {
  let user = req.query.user
  try{
    connection.query("SELECT email, admin, user, active FROM accounts_v2 WHERE email='" + user + "'", function(err, rows, fields) {
    if (err) {
      res.json({
        error: err.message
      });
    }
    
    if(rows && rows.length>0){
      res.json(rows[0]);
    }
    else{
      res.json({})
    }
  });
 }
 catch(error){
   res.json({
     error: error.message
   });
 }
});

app.delete('/user', function (req, res) {
  let user  = req.query.user
  try{
    connection.query("UPDATE accounts_v2 SET admin=0, user=0, active=0 WHERE email='" + user + "'", function(err, rows, fields) {
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

app.post('/user', function (req, res) {
  let mail  = req.query.mail
  let admin  = (req.query.admin=="true" ? "1" :"0")
  let user  = (req.query.user=="true" ? "1" :"0")
  let active  = (req.query.active=="true" ? "1" :"0")
  try{
    connection.query("UPDATE accounts_v2 SET admin=" + admin + ", user=" + user + ", active=" + active + " WHERE email='" + mail + "'", function(err, rows, fields) {
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

app.put('/user', function (req, res) {
  let mail  = req.query.mail
  let admin  = (req.query.admin=="true" ? "1" :"0")
  let user  = (req.query.user=="true" ? "1" :"0")
  try{
    connection.query("INSERT INTO accounts_v2 VALUES('" + mail + "', " + admin + ", " + user + ", 1)", function(err, rows, fields) {
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

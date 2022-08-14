const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const path = require('path');
const fs = require('fs');
const e = require('express');

var messagesP1 = "";
var messagesP2 = "";
var p1 = "";
var p2 = "";

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.set('view engine', 'pug')

app.post('/', (req, res) => {
  console.log("incoming: " + JSON.stringify(req.body));
  if(JSON.stringify(req.body) == "{}") return;
  if(req.body.clientHash == p1) {
    messagesP1 = req.body;
    res.json("OK: P1")
  }
  else if(req.body.clientHash == p2) {
    messagesP2 = req.body;
    res.json("OK: P2")
  } else {
    console.log("Unauthorized message upload");
    res.status(401).json("Error: Unauthorized")
  }
 
})

app.get('/', (req, res) => {
  var resMessages = ""
  if(p1 == p2 && p1 == req.query.clientHash) {
    var resMessages = messagesP1;
    messagesP1 = "";
    res.json(resMessages)
  } else if(req.query.clientHash == p1) {
    var resMessages = messagesP2;
    messagesP2 = "";
    res.json(resMessages)
  } else if(req.query.clientHash == p2) {
    var resMessages = messagesP1;
    messagesP1 = "";
    res.json(resMessages)
  } else {
    console.log("Unauthorized message download: "+ req.query.clientHash);
    res.status(401).json("Error: Unauthorized")
  }
})

app.post('/login', (req,res) => {
  if(p1 == "") {
    p1 = req.body.clientHash;
    console.log("P1 connected: "+ req.body.clientHash)
    res.json("connected as p1")
  } else if(p2 == "") {
    p2 = req.body.clientHash;
    console.log("P2 connected: "+ req.body.clientHash)
    res.json("connected as p2")
  } else {
    res.status(401).json("Not connected - too many players")
  }
})


app.get('/admin', function(req, res) {
  res.render('admin', { p1: p1, p2: p2 })
});

app.get('/kick', function(req, res) {
  if(kickPlayer(req.query.clientHash)) {
    res.status(200).json("Player: "+req.query.clientHash+" kicked")
  } else {
    res.status(400).json("Failed to kick player " + req.query.clientHash)
  }
});
app.get('/javascripts/kick.js', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.write(fs.readFileSync(__dirname + "\\javascripts\\kick.js", 'utf8'));
  res.end();
});
app.get('/refresh', function(req, res) {
  if(req.query.clientHash1 == p1 && req.query.clientHash2 == p2) {
    res.status(200).write("OK");
  }
  else {
    res.status(200).write("REF");
  }
  res.end();
});




app.listen(8080, () => {
  console.log("Server started!!!");
})




function kickPlayer(clientHash) {
  if(p1 == clientHash) {
    p1 = "";
    return true;
  }
  if(p2 == clientHash) {
    p2 = "";
    return true;
  }
  return false;
}
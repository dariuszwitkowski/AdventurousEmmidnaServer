const express = require('express')
const bodyParser = require('body-parser')
const app = express();

var messagesP1 = "";
var messagesP2 = "";
var p1 = "";
var p2 = "";

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

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
    res.json("Error: Unauthorized")
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
    console.log("Unauthorized message download: "+ clientHash);
    res.json("Error: Unauthorized")
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
    res.json("Not connected - too many players")
  }
})





app.listen(8080, () => {
  console.log("Server started!!!");
})
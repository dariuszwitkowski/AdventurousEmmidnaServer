// packages import
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const path = require('path');
const fs = require('fs');
const e = require('express');

// action list player 1
var messagesP1 = "";
// action list player 1
var messagesP2 = "";
// client identifier player 1
var p1 = "";
// client identifier player 2
var p2 = "";

// enable body parser, set input to json
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// enable templating engine
app.set('view engine', 'pug')

/* POST request on "/"
  req -> request (data from client)
  res -> response (date from server)
  req.body -> POST data
*/
app.post('/', (req, res) => {
  console.log("incoming: " + JSON.stringify(req.body));
  if(JSON.stringify(req.body) == "{}") res.status(200);
  // check if player is p1 or p2. If yes: save message; If not: return 401 err
  if(req.body.clientHash == p1) {
    messagesP1 = req.body;
    res.json("OK: P1")
  }
  else if(req.body.clientHash == p2) {
    messagesP2 = req.body;
    res.json("OK: P2")
  } else {
    console.warn("Unauthorized message upload");
    res.status(401).json("Error: Unauthorized")
  }
 
})

/* GET request on "/"
  req -> request (data from client)
  res -> response (date from server)
  req.query -> params from url
*/
app.get('/', (req, res) => {
  var resMessages = ""
  // TODO delete before release
  // first if for testing purpose only
  // check if player is p1 or p2, return message
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
    console.warn("Unauthorized message download: "+ req.query.clientHash);
    res.status(401).json("Error: Unauthorized")
  }
})

app.post('/login', (req,res) => {
  // check if slots are open. If yes: assign player to slot, else return unauthorized err
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

// render admin panel
app.get('/admin', function(req, res) {
  res.render('admin', { p1: p1, p2: p2 })
});
// endpoint to kick player
app.get('/kick', function(req, res) {
  if(kickPlayer(req.query.clientHash)) {
    res.status(200).json("Player: "+req.query.clientHash+" kicked")
  } else {
    res.status(400).json("Failed to kick player " + req.query.clientHash)
  }
});
// additional resource
app.get('/javascripts/kick.js', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.write(fs.readFileSync(__dirname + "\\javascripts\\kick.js", 'utf8'));
  res.end();
});
// endpoint for dynamic player list loading
app.get('/refresh', function(req, res) {
  if(req.query.clientHash1 == p1 && req.query.clientHash2 == p2) {
    res.status(200).write("OK");
  }
  else {
    res.status(200).write("REF");
  }
  res.end();
});



// run server
app.listen(8080, () => {
  console.log("Server started!!!");
})



//kick player helper
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
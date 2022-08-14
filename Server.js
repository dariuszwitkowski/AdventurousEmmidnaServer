const express = require('express')
const bodyParser = require('body-parser')
const app = express();

var messages = "";

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log("incoming: " + JSON.stringify(req.body));
  if(JSON.stringify(req.body) == "{}") return;
  messages = req.body;
})
app.get('/', (req, res) => {
  var resMessages = messages;
  messages = "";
   console.log("outcoming: " + resMessages);
  res.json(resMessages)
})





app.listen(8080, () => {
  console.log("Server started!!!");
})
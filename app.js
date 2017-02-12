var restify = require('restify'),
    bot = require('./bot'),
    bodyParser = require('body-parser');

var app = restify.createServer();
app.use(bodyParser.json())

app.get('/', (req, res) => {
  return bot._verify(req, res);
});

app.post('/', (req, res) => {
  bot._handleMessage(req.body)
  res.send(200); // Ack to fb, otherwise will keep sending requests
})

app.listen(8080, function() {
  console.log('%s listening at %s', app.name, app.url);
});

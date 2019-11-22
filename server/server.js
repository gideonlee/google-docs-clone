let express = require('express');
let path = require('path');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(dbConfig.db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Database sucessfully connected')
}, error => {
  console.log('Database could not connected: ' + error)
})

// Setting up port with express js
const documentRoute = require('./routes/document.route');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors()); 
app.use(express.static(path.join(__dirname, 'dist/google-docs-clone')));
app.use('/', express.static(path.join(__dirname, 'dist/google-docs-clone')));
app.use('/api', documentRoute);

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

// Sockets
const http = require('http').Server(app);
const io = require('./sockets/io.js')(http);
http.listen(4444);
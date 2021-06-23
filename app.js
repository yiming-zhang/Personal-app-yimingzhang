/*
  app.js -- This creates an Express webserver
*/

// First we load in all of the packages we need for the server...
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require('cors');
const layouts = require("express-ejs-layouts");
const logger=require('morgan')
//const bodyParser = require("body-parser");
const axios = require("axios");
const User = require('./models/User');
var debug = require("debug")("personalapp:server");

// Now we create the server
const app = express();


const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect( 'mongodb://localhost/authDemo');
//const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const toDoRouter = require('./routes/todo');
const toDoAjaxRouter = require('./routes/todoAjax');
const foodJournalRouter = require('./routes/foodJournal');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/todo',toDoRouter);
app.use('/todoAjax',toDoAjaxRouter);

app.use('/fj',foodJournalRouter);

const myLogger = (req,res,next) => {
  console.log('inside a route!')
  next()
}

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling ..
app.use(
  session({
    secret: "zzbbya789fds89snana789sdfa",
    resave: false,
    saveUninitialized: false
  })
);

//app.use(bodyParser.urlencoded({ extended: false }));

// This is an example of middleware
// where we look at a request and process it!
app.use(function(req, res, next) {
  //console.log("about to look for routes!!! "+new Date())
  console.log(`${req.method} ${req.url}`);
  //console.dir(req.headers)
  next();
});

// here we start handling routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/demo",
        function (req, res){res.render("demo");});

app.get("/about", (request, response) => {
  response.render("about");
});

app.get("/form", (request,response) => {
  response.render("form")
})

app.get("/dataDemo", (request,response) => {
  response.locals.name="Tim Hickey"
  response.locals.vals =[1,2,3,4,5]
  response.locals.people =[
    {'name':'Tim','age':65},
    {'name':'Yas','age':29}]
  response.render("dataDemo")
})

app.post("/showformdata", (request,response) => {
  response.json(request.body)
})

app.get("/checkhealth", (request,response) => {
  response.render("checkhealth")
})

app.post('/showhealth', (req,res) => {
  const height = parseFloat(req.body.height) // converts form parameter from string to float
  const weight = parseFloat(req.body.weight)
  const bmi=(703*weight)/(height*height)
  res.locals.height =height
  res.locals.weight = weight
  res.locals.bmi = bmi
  res.locals.selfrating =req.body.selfrating

  res.render('showhealth')
})


  //res.locals.sugarintake = sugarintake
  //res.render('showintake')


app.get("/intake", (request,response) => {
  response.render("intake")
})

app.post('/showintake', (req,res) => {
  const sugarintake = parseFloat(req.body.sugarintake) // converts form parameter from string to float

  res.locals.sugarintake = sugarintake
  res.render('showintake')
})



app.get('/recipe', (req,res) => {
  res.render('recipe')
})

app.post("/getRecipes",
  async (req,res,next) => {
    try {
      const food = req.body.food
      const url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+food+""
      const result = await axios.get(url)
      res.locals.meals=result.data.meals
      res.render('showRecipes')
    } catch(error){
      next(error)
    }
})







// Don't change anything below here ...

// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Here we set the port to use
const port = "5000";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
session = require("express-session"); //for authentication
const passport = require("passport"); //for authentication
const LocalStrategy = require("passport-local").Strategy; //for authentication

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// Include the user model for saving to MongoDB VIA mongoose
const User = require("./models/user");

//Database connection -- We are using MongoDB
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const mongoString =
  "mongodb+srv://gautamkriti89:iRZbodFRaxzSf2K2@sign.llrax6n.mongodb.net/?retryWrites=true&w=majority";
    // "mongodb+srv://admin:bjeCPOcOcnErnvkF@cluster0.uud0rqm.mongodb.net/";
 //gautamkriti89:bjeCPOcOcnErnvkF@cluster0.jtnewis.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(mongoString);
const db = mongoose.connection;
// iRZbodFRaxzSf2K2
var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your secret key",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: "mongodb://127.0.0.1/signApp" }),
 
    // mongoose.connect("mongodb://localhost:27017/demoDb");
  })
);
/*
  Setup the local passport strategy, add the serialize and 
  deserialize functions that only saves the ID from the user
  by default.
*/
const strategy = new LocalStrategy(User.authenticate());
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/register", function (req, res) {
  res.render("signup");
});
// app.get("/hello", function (req, res) {
//   res.render("learn");
// });

app.post("/register", async function (req, res) {
  try {
    const users = await User.find();

    let newUser;
    const userId = generateUserId(req.body.role, users.length + 1);
    
      newUser = new User({
        email: req.body.email,
        // fullname:req.body.fullname,
        username: req.body.username,
        userId: userId,})
     

    // Register the new user
    User.register(newUser, req.body.password);
    res.redirect("/login");
  } catch (err) {
    res.status(400).json({ error: err.message });
    // You might want to handle errors more gracefully here
  }
});

/*
  Login routes -- This is where we will use the 'local'
  passport authenciation strategy. If success, send to
  /login-success, if failure, send to /login-failure
*/
app.get("/login", function (req, res) {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/error",
  }),
  (req, res) => {
    console.log(req.session);
    // Check the user's role and redirect accordingly
    res.redirect("/");

  }
);
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/login");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

/*
  Protected Route -- Look in the account controller for
  how we ensure a user is logged in before proceeding.
  We call 'isAuthenticated' to check if the request is 
  authenticated or not. 
*/
app.get('/profile', function(req, res) {
  console.log(req.session)
  if (req.isAuthenticated()) {
    res.json({ message: 'You made it to the secured profie' })
  } else {
    res.json({ message: 'You are not authenticated' })
  }
})
function generateUserId(role, count) {
  return `00-${count}`;
}


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

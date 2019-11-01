var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var passport    = require("passport"),
    LocalStrategy = require("passport-local"),

    methodOverride = require("method-override"),
    Campground  = require("./models/campgrounds"),
    Comment     = require("./models/comment"),
    User        = require("./models/user")
var seedDB = require("./seed")

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();

app.use(require("express-session")({
    secret: "COE-2 is shit!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function(){
    console.log("The app has started!!");
})

var express = require('express');
var mysql = require('mysql');
var md5 = require('md5');
const app = express();
const bodyParser = require('body-parser');
var passport = require('passport');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "it255-projekat"
});
con.connect(function (err) {
  if (err)
    //throw err
    console.log(err.code);
});
const cors = require('cors')

var corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST'],
  credentials: true
}
var session = require('express-session');


app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(session({
  secret: 'kasgfsagsgasdg',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7200000 }
  //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

app.listen(8080, function () {
  console.log('listening on 8080');
  app.post('/register', function (req, res) {
    var sql = " INSERT INTO `users` ( `username`, `password`) VALUES ('" + req.body.username + "', '" + md5(req.body.password) + "')";
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err.code);
        if (err.code == "ER_DUP_ENTRY") {

          console.log("A");
          res.status(555).end("");
        }
        else {
          res.status(500).end("");

        }
      }
      console.log("1 record inserted");
      res.status(200).end("");
    });

  }
  );
  app.post('/login', function (req, res) {
    console.log(req.isAuthenticated());
    var sql = "SELECT id,username FROM `users` WHERE  `username`='" + req.body.username + "' AND `password`= '" + md5(req.body.password) + "'";
    con.query(sql, function (err, result, fields) {
      if (err) res.status(500).end("");

      if (result.length) {
        req.login(result[0].username, function (err) { res.status(202).end(JSON.stringify(req.user)); });
        console.log("Ex" + result[0].username);

        console.log(JSON.stringify(req.user));
        console.log(req.isAuthenticated());

        res.status(201).end(JSON.stringify(req.user));
      } else { console.log("Nex") }

    });

  }
  )
});
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  //  User.findById(id, function (err, user) {
  done(null, id);
  // });
});
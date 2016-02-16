'use strict';

var
  express = require('express'),
  app = require('express')(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser'),
  connectionString = process.env.DATABASE_URL,
  knex = require('knex')({
    client: 'pg',
    connection: connectionString,
    searchPath: 'knex,public',
    pool: {
      min: 0,
      max: 5
    }
  }),
  Project = require('./project');

var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

// Authetication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    knex.select('*').from('users')
    .where('username', username).andWhere('password', password)
    .then(function(user) {
      return done(null, user);
    }).catch(function(err){
      return done(err);
    });
  });
}));

app.get('/login', function (req, resp) {
  resp.sendFile(__dirname + '/login.html');
});

app.post('/login',
  passport.authenticate('local'),
  function(req, resp) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log(req);
    resp.redirect('/loginSuccess');
  });

app.get('/loginFailure', function(req, resp, next) {
  resp.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, resp, next) {
  // resp.send('Successfully authenticated');
  resp.sendFile(__dirname + '/admin.html');
});

app.get('/', function (req, resp) {
  resp.sendFile(__dirname + '/index.html');
  // return next();
});

app.get('/api/projects', function (req, resp, next) {
  knex.select('*').from('projects')
    .then(function select (projs) {
      var projects = projs.map(function (proj) {
        var imageUrl;
        imageUrl = cloudinary.url(proj.image_url);
        return new Project(proj.id, proj.title, proj.description, proj.url, imageUrl).toJson();
      });
      console.log(projects);
      resp.json(projects);
      return next();
    }).catch(function (err) {
      resp.status(500).json(err);
      return next();
    });
});

app.post('/api/projects', function (req, resp, next) {
  if (!req.body.title || !req.body.description) {
    resp.status("400").json("BadRequest");
    return next();
  }
  var image, imageFormat, imageUrl;
  cloudinary.uploader.upload(req.body.image_url, function(result) { 
    console.log(result);
    image = result.public_id;
    imageFormat = result.format;
  });
  image = image.concat(imageFormat);
  imageUrl = cloudinary.url(image);
  var p = new Project(undefined, req.body.title, req.body.description, req.body.url, image);
  knex("projects")
    .returning("*")
    .insert({
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
      image_url: image
    }).then(function(data) {
      p.id(data[0].id);
      p.createdAt(getDateToday());
      resp.status(200).json(p.toJson());
      return next();
    }).catch(function (err){
      console.log("err" + err);
      resp.status(400).json(err);
      return next();
    });
});

app.get('/api/projects/:id', function (req, resp, next) {
  knex.first('*').from('projects').where('id', req.params.id)
    .then(function first (proj) {
      var project = proj, imageUrl;
      if (proj) {
        imageUrl = cloudinary.url(proj.image_url);
        project = new Project(proj.id, proj.title, proj.description, proj.url, imageUrl);
        resp.json(project.toJson());
        return next();
      } else {
        resp.status(404).json(null);
      }
    }).catch(function (err) {
      resp.status(500).json(err);
      return next();
    });
});
app.delete('/api/projects/:id', function (req, resp, next) {
  knex('projects').delete().where('id', req.params.id)
    .then(function delte (n) {
      if (n > 0) {
        resp.json(req.params.id);
        return next();
      } else {
        resp.status(404).json(req.params.id);
        return next();
      }
    }).catch(function (err) {
      resp.status(500).json(err);
      return next();
    });
});
    
app.listen(port, function () {
  console.log("Server running with port", port)
});

function getDateToday() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd < 10){
    dd ='0'+ dd
  } 
  if(mm < 10){
    mm ='0'+mm
  } 
  return today = yyyy+'-'+mm+'-'+dd;
}
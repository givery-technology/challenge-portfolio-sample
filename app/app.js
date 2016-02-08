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

var
  SQLITE_CONSTRAINT = 19;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

app.get('/', function (req, resp) {
  // resp.json('PONG');
  resp.sendFile(__dirname + '/index.html');
  // return next();
});

app.get('/api/projects', function (req, resp, next) {
  knex.select('*').from('projects')
    .then(function select (projs) {
      var projects = projs.map(function (proj) {
        return new Project(proj.id, proj.title, proj.description, proj.url).toJson();
      });
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
  var p = new Project(undefined, req.body.title, req.body.description, req.body.url);
  knex("projects")
    .returning("*")
    .insert({
      title: req.body.title,
      description: req.body.description,
      url: req.body.url
    }).then(function(data) {
      p.id(data[0].id);
      var now = new Date();
      p.createdAt(now);
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
      var project = proj;
      if (proj) {
        project = new Project(proj.id, proj.title, proj.description, proj.url);
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
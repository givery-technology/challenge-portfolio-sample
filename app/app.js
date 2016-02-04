'use strict';

var
  express = require('express'),
  app = require('express')(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser'),
  knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: ':memory:' },
  }),
  Project = require('./project');

var
  SQLITE_CONSTRAINT = 19;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

app.get('/', function (req, resp) {
  // resp.json('PONG');
  console.log(__dirname + '/css');
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
  var
    title = req.body.title,
    description = req.body.description,
    url = req.body.url;
  var p = new Project(undefined, title, description, url);
  if (!p.canSave()) {
    resp.status(400).json('BadRequest');
    return next();
  }
  var now = new Date();
  var id = knex('projects').insert({
    title: p.title(),
    description: p.description(),
    url: p.url(),
    created_at: now.toISOString()
  }).then(function (id) {
    p.id(id[0]).createdAt(now);
    console.log(p.toJson());
    resp.status(200).json(p.toJson());
    return next();
  }).catch(function (err) {
    if (err.errno === SQLITE_CONSTRAINT) {
      resp.status(400).json(err);
      return next();
    } else {
      resp.status(500).json(err);
      return next();
    }
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

/** @ToDo
  * Initialize database
  * this is for 'in-memory' database and should be removed
  */
var sqls = require('fs')
  .readFileSync( __dirname + '/../specifications/database.sql')
  .toString();

knex.raw(sqls)
  .then(function () {
    /** @ToDo
      * Run server after database initialization
      * this is for 'in-memory' database and should be removed
      */
    app.listen(port, function () {
      console.log("Server running with port", port)
    });
  });

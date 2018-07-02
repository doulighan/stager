var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var formidable = require('formidable')
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var p = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));



var projectName = 'project';
var subFolder = 'wireframes';
var modifier = '';

app.get('/', function (req, res) {
  res.render('index', {page: req.url});
})

app.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields) {
    console.log('in here', fields)
    if(fields.projectName) {
      projectName = fields.projectName;
    }
    if(fields.subFolder) {
      subFolder = fields.subFolder;
    } 
    if(fields.modifier){
      modifier = fields.modifier;
    }
  });

  form.on('end', function() {
      createFileStructure();
      res.end();
      res.redirect('/upload');
  })
})

app.get('/upload', function(req, res) {
  console.log(req.url)
  res.render('index', {page: req.url});
})

app.post('/upload', function (req, res) {
  res.redirect('/done');
  console.log('we hit upload! ', req.projectName);
})

app.get('/done', function (req, res) {
  console.log('got done');
  res.render('index', {page: req.url})
})

app.listen(3333, function() {
  console.log('Listening on p:3333');
})



//////////////////////////////////


function setArchiveName() {
  res.attachment('archive-name.zip');

}

function modify() {
  return modifier ? modifier + '/' : '';
}


function createFileStructure() {
  console.log('Project Name: ' + projectName, 'Sub Folder: ' + subFolder); 
  mkdirp('../outputs/' + projectName + '/' + subFolder + '/' + modify() + 'images/', function(err) {
    if(err) console.error(err);
    else console.log('pow!');
  })
}

function generateHTML(name) {
  const NAME = name.substring(0, name.lastIndexOf('.'));
  const path = '../outputs/' + projectName + '/' + subFolder + '/' + modify() + 'images/' + name;
  console.log(path);
  console.log(projectName);
  const htmlWRITE = NAME + '.html';
  const HTML = 
  '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content=""><meta name="author" content=""><title>' + NAME + '</title></head><body class="overflow-hidden" style="background:#000;"><img width="100%" src="./' + 'images/' + name + '"></body></html>';

  fs.writeFile("../outputs/" + projectName + "/" + subFolder + "/" + modify() + htmlWRITE, HTML, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was written!");
  }); 
} 

function writePathToFile(name) {
  const NAME = name.substring(0, name.lastIndexOf('.'));
  var text = 'http://sites.spiderboost.com/' + projectName + '/' + subFolder + '/' + modify(modifier) + NAME + '.html' + '\n\n';
  fs.appendFile("../outputs/" + projectName + '/' + 'paths.txt', text, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The path was written!");
  }); 

}
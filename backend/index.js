var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const expressForm = require('express-formidable');
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var p = require('path');

var projectName = 'project';
var subFolder = 'wireframes';
var modifier = '';

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(expressForm({ 
  uploadDir: './tmp',
  multiples: true, 
  keepExtensions: true,
  keepExtensions: true,
}));


app.get('/', function (req, res) {
  res.render('index', {page: req.url});
})

app.post('/info', function (req, res) {
  console.log(req.fields);
  if(req.fields.projectName) {
    projectName = req.fields.projectName;
  }
  if(req.fields.subFolder) {
    subFolder = req.fields.subFolder;
  } 
  if(req.fields.modifier){
    modifier = req.fields.modifier;
  }
  createFileStructure(projectName, subFolder, modifier);
  res.status(200).redirect('/upload');
})


app.get('/upload', function(req, res) {
  res.render('index', {page: req.url});
})

app.post('/upload', function (req, res) {
  req.files.filetoupload.forEach(function (file) {
    var newpath = './public/' + projectName + '/' + subFolder + '/' + modify(modifier) + 'images/' + file.name;
    console.log(newpath, file.path);
    fs.rename(file.path, newpath);
    generateHTML(file.name);
    writePathToFile(file.name, process.env.PORT || 3333);
  })

  res.redirect('/done');
})


app.get('/done', function (req, res) {
  // res.render('index', {page: req.url})
  fs.readFile('./public/' + projectName + '/paths.txt', (e, data) => {
        if (e) throw e;
        res.send(data);
    });
  projectName = 'project';
  subFolder = 'wireframes';
  modifier = '';
})

app.get('/:projectName/:subFolder/:name', function(req, res) {
  var pn = req.params.projectName;
  var sf = req.params.subFolder;
  var n = req.params.name;
  var path = '/' + pn + '/' + sf + '/' + n;
  console.log(path);
  res.sendFile(p.join(__dirname + path));
})

var server = app.listen(process.env.PORT || 3333, function() {
  console.log('Listening on' + server.address().port);
})








//////////////////////////////////

function modify() {
  return modifier ? modifier + '/' : '';
}


function createFileStructure(projectName, subFolder, modifier) {
  console.log('Project Name: ' + projectName, 'Sub Folder: ' + subFolder); 
  mkdirp('./public/' + projectName + '/' + subFolder + '/' + modify() + 'images/', function(err) {
    if(err) console.error(err);
    else console.log('pow!');
  })
}

function generateHTML(name) {
  const NAME = name.substring(0, name.lastIndexOf('.'));
  const path = '/' + projectName + '/' + subFolder + '/' + modify() + 'images/' + name;
  console.log(path);
  console.log(projectName);
  const htmlWRITE = NAME + '.html';
  const HTML = 
  '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content=""><meta name="author" content=""><title>' + NAME + '</title></head><body class="overflow-hidden" style="background:#000;"><img width="100%" src=' + path +'></body></html>';

  fs.writeFile("./public/" + projectName + "/" + subFolder + "/" + modify() + htmlWRITE, HTML, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was written!");
  }); 
} 

function writePathToFile(name, port) {
  var base;
  if(port === 3333) {
    base = 'localhost:3333/'
  } 
  const NAME = name.substring(0, name.lastIndexOf('.'));
  var text = base + projectName + '/' + subFolder + '/' + modify(modifier) + NAME + '.html' + '\n\n';
  fs.appendFile("./public/" + projectName + '/' + 'paths.txt', text, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The path was written!");
  }); 

}
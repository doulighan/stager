var http = require('http');
// var express = require('express')
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var archiver = require('archiver');
var p = require('path');

var projectName = 'project';
var subFolder = 'wireframes';
var modifier = '';



http.createServer(function (req, res) {
  
  if (req.url == '/fileupload') {
    var filenames = [];
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;

    form.on('file', function(feild, file) {
      var newpath = '../outputs/' + projectName + '/' + subFolder + '/' + modify(modifier) + 'images/' + file.name;

      fs.rename(file.path, newpath);
      filenames.push(file.name);
    });

    form.on('end', function() {
      filenames.forEach(function(file) {
        generateHTML(file);
        writePathToFile(file);
      })
    })

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});

      form.on('end', function() {
        console.log('-> upload done');

      });

      res.write('received upload:\n\n');

      setTimeout( function() {
        projectName = 'project';
        subFolder = 'wireframes';
        modifier = '';

        res.writeHead(302, {
            'Location': '/'
          });
          res.end();
      }, 2000); 
      
      // res.end(util.inspect({fields: fields, files: files}));

    });
 
    return;
  } 
  else if (req.url == '/getInfo') {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {

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
      res.writeHead(200, {'Content-Type': 'text/html'});
   res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
   res.write('<input type="file" multiple="multiple" name="filetoupload"><br>');
   res.write('<input type="submit">');
   res.write('</form>');

   return res.end();
    });  
 }

 else {
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write(
    '<form action="getInfo" method="post"><br>' +
      'Project Name:  <br>' +
      '<input type="text" placeholder="project" name="projectName"><br>' +
      'Subfolder: <br>' +
      '<input type="text" placeholder="wireframes" name="subFolder"><br>' +
      'Modifier? (Optional): <br>' +
      '<input type="text" name="modifier"><br>' +
      '<input type="submit">' +
    '</form>'
    );
   return res.end();
 }
}).listen(8800);

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
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var archiver = require('archiver');
var p = require('path');

var projectName = 'project';
var subFolder = 'wireframes';
var modifier = '';



var fileName

http.createServer(function (req, res) {

  // var archive = archiver('zip');

  // archive.on('end', function() {
  //   console.log('Archive wrote %d bytes', archive.pointer());
  // });

  // archive.pipe(res);
  // var fils = 


  if (req.url == '/fileupload') {
    var filenames = []
    var form = new formidable.IncomingForm();
    // form.uploadDir = './' + projectName + '/' + subFolder + '/images';
    // console.log(form.uploadDir)
    form.keepExtensions = true;
    form.multiples = true;

    form.on('file', function(feild, file) {
      var newpath = './' + projectName + '/' + subFolder + '/' + 'images/' + file.name;

      fs.rename(file.path, newpath);
      filenames.push(file.name);
    });

    form.on('end', function() {
      filenames.forEach(function(file) {
        generateHTML(file);
      })
    })

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});

      form.on('end', function() {
        console.log('-> upload done');

      });

      res.write('received upload:\n\n');
      
      res.end(util.inspect({fields: fields, files: files}));
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
      createFileStructure(projectName, subFolder, modifier);
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
      // 'Modifier? (Optional): <br>' +
      // '<input type="text" name="modifier"><br>' +
      '<input type="submit">' +
    '</form>'
    );
   return res.end();
 }
}).listen(8080);


function setArchiveName() {
  res.attachment('archive-name.zip');

}


function createFileStructure(projectName, subFolder, modifier) {
  console.log(projectName, subFolder, modifier);
  mkdirp('./' + projectName + '/' + subFolder + '/' + 'images/', function(err) {
    if(err) console.error(err);
    else console.log('pow!');
  })
}

function generateHTML(name) {
  const NAME = name.substring(0, name.lastIndexOf('.'));
  const path = '' + projectName + '/' + subFolder + '/images/' + name  + ''
  console.log(path);
  console.log(projectName);
  const htmlWRITE = NAME + '.html';
  const HTML = 
  '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content=""><meta name="author" content=""><title>' + NAME + '</title></head><body class="overflow-hidden" style="background:#000;"><img width="100%" src="../../' + projectName + '/' + subFolder + '/images/' + name + '"></body></html>';

  fs.writeFile("./" + projectName + "/" + subFolder + "/" + htmlWRITE, HTML, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was written!");
  }); 
} 
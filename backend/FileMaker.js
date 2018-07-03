var fs = require('fs');
exports = module.exports = createApplication;



function modify() {
  return modifier ? modifier + '/' : '';
}


function createFileStructure(projectName, subFolder, modifier) {
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
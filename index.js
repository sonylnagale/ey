const jsonfile = require('jsonfile');
const util = require('util');
const fs = require('fs');

const datafiles = ['Object1.json','Object2.json','Object3.json'];

let jsonData = [];

main();

function main() {
  let readPromise = readFiles(datafiles);

  readPromise.then(function() {

    for (let i = 0; i < jsonData.length; i++) {
      let counter = 0;

      while (counter < jsonData[i].length) {
        if (i !== 0) {
          if (jsonData[0][counter].children) {
            combineChildren(jsonData[0][counter], jsonData[i][counter]);
          }
        } else {
          jsonData[0][counter].value = Number(jsonData[0][counter].value);
        }

        counter++;
      }
    }

    fs.writeFile('myjsonfile.json', JSON.stringify(jsonData[0]), 'utf-8', function(err) {
      if (err) {
        throw err;
      } else {
        console.log('ok');
      }
    });

  }, function(err) {
    console.log(err);
  });
}

function combineChildren(baseNode, newNode) {
  baseNode.value = Number(baseNode.value);
  if (newNode) {
    baseNode.value += Number(newNode.value);
  }

  if (!baseNode.children) {
    return;
  }

  let nodeChildren = baseNode.children.length;

  if (nodeChildren > 0) {

    for (let i = 0; i < nodeChildren; i++) {
      combineChildren(baseNode.children[i], newNode.children[i]);

      if (newNode.children.length > 0) {
        baseNode.children.concat(newNode.children);
      }

    }
  }
}

function readFile(file) {
  return new Promise(function(resolve,reject) {
    jsonfile.readFile(file, function(err, obj) {
      if (err) {
        console.log(err);
        reject();
      } else {
        resolve(jsonData.push(obj));
      }
    });
  });
}

function readFiles(files) {
  let finished = 0;

  return new Promise(function(resolve,reject) {
    for (let i = 0;  i < files.length; i++) {
      let filePromise = readFile(files[i]);
      filePromise.then(function(result) {
        finished++;
        if (finished === files.length) {
          resolve();
        }
      }, function(err) {
        console.log(err);
      });
    }
  });
}

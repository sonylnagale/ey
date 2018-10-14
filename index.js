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
        // console.log(counter,i);
        if (i !== 0) {
          // console.log(jsonData[i][counter].item_code);
          // console.log(`jsonData[${i}][${counter}] jsonData[${i}][${counter}].value `, jsonData[i][counter].children.length);

          // if (jsonData[0][counter].item_code === jsonData[i][counter].item_code) {
          if (jsonData[0][counter].children) {
            // console.log(jsonData[0][counter].children.length);
            combineChildren(jsonData[0][counter], jsonData[i][counter]);
          }
          //   jsonData[0][counter].children.push(jsonData[i][counter].children);
          // }

          // jsonData[0][counter].value += Number(jsonData[i][counter].value);

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
  // console.log(newNode.item_code);
  //
  baseNode.value = Number(baseNode.value);
  if (newNode) {
    baseNode.value += Number(newNode.value);
  }
  // baseNode.value += Number(newNode.value);

  // if (baseNode.item_code == "APC0") {
  //   console.log(baseNode.value);
  // }

  if (!baseNode.children) {
  //   baseNode.value += Number(newNode.value);
  //
  //   // console.log(`${baseNode.item_code} ${baseNode.value}`);
  //
    return;
  }

  // console.log(`${baseNode.item_code} ${baseNode.value}`);

  let nodeChildren = baseNode.children.length;

  if (nodeChildren > 0) {

    for (let i = 0; i < nodeChildren; i++) {
      combineChildren(baseNode.children[i], newNode.children[i]);

      // if (i > 0) {
      //   baseNode.value += Number(newNode.value);
      // } else {
      //   baseNode.value = Number(baseNode.value);
      // }
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

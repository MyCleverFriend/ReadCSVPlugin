"use strict";

var csv = require('fast-csv');

module.exports.dataSet = {
  input: {
    csvfiles: {
      description: "Defines the csv files you like to read.",
      properties: {
        filename: { type:   "path",   description: "The path of the csv files." }
      }
    }
  },
  output: {
    result: {
      description: "Defines the extracted text of the csv files.",
      properties: {
        filename: { type:   "path",     description: "The path of the csv files." },
        content: { type:   "string",   description: "The extracted text of the csv files." }
      }
    }
  }
};

module.exports.start = function(packages, callback) {
  async.map(packages.input['csvfiles'], readCsvFile, callback);

  function readCsvFile(csvFileOn, cb) {
    var csvContent = [];
    csv.fromPath(csvFileOn.filename, { headers: true, delimiter: ';'})
      .on("data", function(data){
        csvContent.push(data);
      })
      .on("end", function(){
        packages.output['result'].push({ 'filename': csvFileOn.filename, 'content': csvContent });
        return cb(null, packages);
      });
  }
}

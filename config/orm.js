var connection = require("../config/connections.js");

function printQuestionMarks(num) {
    var arr = [];
  
    for (var i = 0; i < num; i++) {
      arr.push("?");
    }
  
    return arr.toString();
  }
  
  // Helper function to convert object key/value pairs to SQL syntax
//   similar to in SQL when you update one value for another
// should 
  function objToSql(ob) {
    var arr = [];
  
    // loop through the keys and push the key/value as a string int arr
    for (var key in ob) {
      var value = ob[key];
      // check to skip hidden properties
      if (Object.hasOwnProperty.call(ob, key)) {
        // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
        if (typeof value === "string" && value.indexOf(" ") >= 0) {
          value = "'" + value + "'";
        }
        // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
        // e.g. {sleepy: true} => ["sleepy=true"]
        arr.push(key + "=" + value);
      }
    }
  
    // translate array of strings to a single comma-separated string
    return arr.toString();
  }
  
  // Object for all our SQL statement functions.
  var orm = {
    all: function(tableInput, cb) {
      var queryString = "SELECT * FROM " + tableInput + ";";
    //   creates connection between app and mySQL then it carries mySQL database and retrieve data back 
    // tableInput is a placeholder that we'll use later in models
      connection.query(queryString, function(err, result) {
        if (err) {
          throw err;
        }
        // callback
        // callback and results are just templates 
        cb(result);
      });
    },
    // create, update, and select will be used later!! 
    create: function(table, cols, vals, cb) {
      var queryString = "INSERT INTO " + table;
  
      queryString += " (";
      queryString += cols.toString();
      queryString += ") ";
      queryString += "VALUES (";
    //   not sure how many values we will have. Each value will be replaced with that many "?"
      queryString += printQuestionMarks(vals.length);
      queryString += ") ";
  
      console.log(queryString);
  
      connection.query(queryString, vals, function(err, result) {
        if (err) {
          throw err;
        }
  
        cb(result);
      });
    },
    // An example of objColVals would be {name: panther, sleepy: true}
    update: function(table, objColVals, condition, cb) {
      var queryString = "UPDATE " + table;
//   name=value
      queryString += " SET ";
    //   UPDATE burger SET burgur_name=cheesy burger WHERE id = 1
      queryString += objToSql(objColVals);
      queryString += " WHERE ";
      queryString += condition;
//   name:value
      console.log(queryString);
      connection.query(queryString, function(err, result) {
        if (err) {
          throw err;
        }
  
        cb(result);
      });
    },
    // select: function(table, condition, cb) {
    //   var queryString = "SELECT FROM " + table;
    //   queryString += " WHERE ";
    //   queryString += condition;
  
    //   connection.query(queryString, function(err, result) {
    //     if (err) {
    //       throw err;
    //     }
  
    //     cb(result);
    //   });
    // }
    // select: function(whatToSelect, tableInput) {
    //     var queryString = "SELECT ?? FROM ??";
    //     connection.query(queryString, [whatToSelect, tableInput], function(err, result) {
    //       if (err) throw err;
    //       console.log(result);
    //     });
    //   },
  };
  
  // Export the orm object for the model (cat.js).
  module.exports = orm;
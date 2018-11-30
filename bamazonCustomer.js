// Variables for dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");

// Create a connection.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

//Use the connection variable to connect.
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
  openStore();
});

//Run query for desired data after the connection.
function openStore() {
  connection.query("SELECT * FROM products", function(err, result) {
    if (err) throw err;
    console.log(result);
    promptUser();
  });
}

//Call the function to prompt user.
function promptUser() {
  inquirer.prompt([

    {
      type: "input",
      name: "ID",
      message: "Hello! Please input the id of the item you would like to purchase."
    },

    {
      type: "input",
      name: "Units",
      message: "How many units would you like to purchase?"
    }
    //Code that uses order input to change stock number in the database.
  ]).then(function(answer) {
    // Variables converting User input into number values.
    var idInteger = parseInt(answer.ID);
    var unitsInteger = parseInt(answer.Units);
    //Connection query to pull and change info in database.
    connection.query("SELECT * FROM products WHERE item_id = ?",
      idInteger,
      function(err, res) {
        if (err) throw err;
        console.log(res[0].stock_quantity);
      })
  });
};
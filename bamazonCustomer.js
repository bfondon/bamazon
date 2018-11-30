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
  displayProducts();
});

//Run query for desired data after the connection.
function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        `
        Product Name: ${res[i].product_name} | Product ID: ${res[i].item_id} | Product Price: ${res[i].price} | Units in Stock: ${res[i].stock_quantity}
        `
      )
    }
    promptUser();
  });
}

//Call the function to prompt user.
function promptUser() {
  inquirer.prompt([{
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
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      var purchase;
      for (var i = 0; i < res.length; i++) {
        if (res[i].item_id === parseInt(answer.ID)) {
          purchase = res[i];
          totalPrice = (purchase.price * answer.Units);
        }
      }
      if (purchase.stock_quantity >= parseInt(answer.Units)) {
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [{
              stock_quantity: (purchase.stock_quantity - parseInt(answer.Units))
            },
            {
              item_id: purchase.item_id
            }
          ],
        );
        console.log(
          `The total for your purchase is ${totalPrice}.`
        );
      } else {
        console.log("Sorry! Insufficient quantity to fulfill your order.")
      };
      keepShopping();
    });
  });
};

function keepShopping() {
  inquirer.prompt([{
    type: "confirm",
    message: "Would you like to continue shopping?",
    name: "continue"
  }]).then(function(keepShoppingResponse) {
    if (keepShoppingResponse.continue === true) {
      displayProducts();
    } else {
      console.log("Thanks for checking us out, come back soon!");
      connection.end();
    }
  })
};
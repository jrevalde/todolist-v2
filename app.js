const express = require("express");

const app = express();
const mongoose= require("mongoose");
const date = require(__dirname + "/date.js");
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todoDB');

const itemSchema = new mongoose.Schema({
  name: String
});

const ITEM = mongoose.model('item', itemSchema);

const tem1 = new ITEM({name: "tem1"});
const tem2 = new ITEM({name: "tem2"});
const tem3 = new ITEM({name: "tem3"});

const defaultItems = [tem1, tem2, tem3];

ITEM.insertMany(defaultItems, function(err){
  if(err)
  {
    console.log("failed to insert default items.");
  }
  else
  {
    console.log("successfully logged default items.");
  }
});

/*const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];*/ //Gonna connect to database instead

app.get("/", function(req, res) {

const day = date.getDate();

  res.render("list", {listTitle: day, newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3030, function() {
  console.log("Server started on port 3000");
});

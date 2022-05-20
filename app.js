const express = require("express");

const app = express();
const mongoose= require("mongoose");
const date = require(__dirname + "/date.js");
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
var _ = require('lodash');

mongoose.connect('mongodb+srv://admin-jrevalde:P0rkbun101@cluster0.hz5p4.mongodb.net/todoDB'); //now its connected to mongoDB Atlas

const itemSchema = new mongoose.Schema({
  name: String
});

const ITEM = mongoose.model('item', itemSchema);

const tem1 = new ITEM({name: "test item 1"});
const tem2 = new ITEM({name: "test item 2"});
const tem3 = new ITEM({name: "test item 3"});

const defaultItems = [tem1, tem2, tem3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("list", listSchema);




/*const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];*/ //Gonna connect to database instead

app.get("/", function(req, res) 
{

//console log the items from the items collection

ITEM.find({}, function(err, foundItems)
{
  if (foundItems.length === 0)
  {
    ITEM.insertMany(defaultItems, function(err)
    { //saves the default data if the array is empty
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log("successfully logged default items.");
      }
    });
    res.redirect("/");
  }
  else
  {
    //const day = date.getDate();
    res.render("list", {listTitle: "Title", newListItems: foundItems});
  }
});
});




//dynamic route
app.get("/:customList", function(req,res){ //so basically it means. that whatever you type after the slash becomes a new route. and then you can do whatevers.
  const cum  = _.lowerCase(req.params.customList);


  List.findOne({name:cum} , function(err, results){
    if (!err){
      if(!results)
      {
        //where we create a new list
        const list = new List({
          name: cum,
          items: defaultItems
        });
        console.log("Doesn't exist. making a new list.");
        list.save();
        res.redirect("/" + cum);
      }
      else{
        //show the existing list
        res.render("list", {listTitle: results.name, newListItems: results.items});
      }
      
    }
  });
  
});





app.post("/", function(req, res){


  const item = req.body.newItem;
  const listName = req.body.list;
  const tem = new ITEM({name: item});

    if(listName === "Title")
    {
      tem.save();

      res.redirect("/");
    }
    else{
      List.findOne({name: listName.trim()}, function(err, foundList){
        if (!err)
        {
          if(foundList)
          {
            foundList.items.push(tem);
            foundList.save();
            res.redirect("/" + listName);
          }
          else{
            console.log("oh poopy!!");
          }
          
        }
      });
    }
  
  
});


app.post("/delete", function(req, res){
  const checkedItem = req.body.check;
  const list_Name = _.lowerCase(req.body.listName);

  const id = checkedItem.trim(); //sometimes mongoose acts all fucky so make sure the data passed is validated first. ;)

  if (list_Name === "Title")
  {
    ITEM.findByIdAndRemove(id, function(err){
      if(err)
      {
        console.log(err + "|| There is problem Deleting.");
      }
      else{
        console.log("successfully deleted the thing.");
        res.redirect("/");
      }
    });
  }
  else
  {
    List.findOneAndUpdate({name: list_Name}, {$pull: {items: {_id: id}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + list_Name);
      }
    });
  }
 
    
  
});




app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "")
{
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started on port 3030");
});

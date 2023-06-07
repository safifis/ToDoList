const express = require("express");
const https = require("https");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", {   useNewUrlParser: true });
}

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const defaultItems = [
  { name: "Welcome to your todolist!" },
  { name: "Hit the + button to add a new item." },
  { name: "<-- Hit this to delete an item." }
];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {

  const day = date.getDate();

  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Successfully saved into our DB.");
          })
          .catch((err) =>{
            console.log(err);
          });
      }
      res.render("list", { listTitle: day, newListItems: foundItems, route: "/"});
  })
  .catch(function(err){
    console.log(err);
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  const day = date.getDate();
  if (listName === day) {
    Item.findByIdAndDelete(checkedItemId)
      .then(() => {
        console.log("Successfully deleted item.");
      })
      .catch((err) =>{
        console.log(err);
      });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
      .then(() => {
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }

});

app.post("/:category", (req, res) => {
  const itemName = req.body.newItem;
  const categoryTitle = _.capitalize(req.params.category);
  const item = new Item({
    name: itemName
  });
  List.findOne({name: categoryTitle})
    .then((foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + categoryTitle);
    })
    .catch(function(err){
      console.log(err);
    });
});

app.get("/:category", (req, res) => {
  const categoryTitle = _.capitalize(req.params.category);

  List.findOne({name: categoryTitle})
    .then((foundList) => {
      if (foundList == null) {
        const list = new List({
          name: categoryTitle,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + categoryTitle);
      }
      res.render("list", { listTitle: categoryTitle, newListItems: foundList.items, route: "/" + categoryTitle});
  })
  .catch(function(err){
    console.log(err);
  });
});


app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});

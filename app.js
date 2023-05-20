const express = require("express");
const https = require("https");
const date = require(__dirname + "/date.js")

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs")

const items = ["Buy grocery", "Prepare food", "Do Laundry"];
const workItems = [];

app.get("/", (req, res) => {

  const day = date.getDate();

  res.render("list", {listTitle: day, newListItems: items, route: "/"});
});

app.post("/", (req, res) => {
  const item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.get("/work", (req, res) => {
  res.render("list", {listTitle: "Work List", newListItems: workItems, route: "/work"});
});

app.post("/work", (req, res) => {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});

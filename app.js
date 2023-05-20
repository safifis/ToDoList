const express = require("express");
const https = require("https");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs")

let items = ["Buy grocery", "Prepare food", "Do Laundry"];
let workItems = [];

app.get("/", (req, res) => {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US", options);

  res.render("list", {listTitle: day, newListItems: items, route: "/"});
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.get("/work", (req, res) => {
  res.render("list", {listTitle: "Work List", newListItems: workItems, route: "/work"});
});

app.post("/work", (req, res) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});

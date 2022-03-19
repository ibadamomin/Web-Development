const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

let items = [];
let workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://ibadmomin:beaconhouse12@cluster0.lg6sx.mongodb.net/todolistDB"
);

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const Item1 = new Item({
  name: "Welcome to your todolist!",
});
const Item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const Item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [Item1, Item2, Item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length == 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved items to the database.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItmes.push(item);
  res.redirect("/work");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port " + port);
});

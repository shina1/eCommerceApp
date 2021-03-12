const Item = require("../models/ItemModel");

module.exports.get_items = (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((item) =>
      res.status(200).json({
        status: "success",
        data: {
          item,
        },
      })
    );
};

module.exports.post_item = (req, res) => {
  const newItem = new Item(req.body);
  newItem.save().then((item) =>
    res.status(201).json({
      status: "success",
      data: {
        item,
      },
    })
  );
};

module.exports.update_item = (req, res) => {
  Item.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function (
    item
  ) {
    Item.findOne({ _id: req.params.id }).then(function (item) {
      res.status(201).json({
        status: "success",
        data: {
          item,
        },
      });
    });
  });
};

module.exports.delete_item = (req, res) => {
  Item.findByIdAndDelete({ _id: req.params.id }).then(function (item) {
    res.status(201).json({ success: true });
  });
};

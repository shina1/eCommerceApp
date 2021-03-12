const Cart = require("../models/CartModel");
const Item = require("../models/ItemModel");

// What i need to do is to fetch all the items i our cart for displayig on the front end

module.exports.get_cart_items = async (req, res) => {
  // step 1. Get the user_id of the user whose cart we want to access.
  const userId = req.params.id;
  try {
    // step 2. i will try to search for the cart base on the user_id
    let cart = await Cart.findOne({ userId });
    // when the cart is found, will check if it is not-empty ad return the cart else will return null
    if (cart && cart.items.length > 0) {
      return res.status(200).send(cart);
    } else {
      return res.status(200).send(null);
    }
  } catch (err) {
    console.log(err);
    res.staatus(500).send("Something went wrong");
  }
};

module.exports.add_cart_item = async (req, res) => {
  const userId = req.params.id;
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    let item = await Item.findOne({ _id: productId });
    if (!item) {
      return res.status(404).send("item not found");
    }
    const price = item.price;
    const name = item.title;
    if (cart) {
      //for when cart exist for the user
      let itemIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );
      //   check if product exists or not
      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity += quantity;
        cart.items[itemIndex] = productItem;
      } else {
        //  no cart exists, create one
        const newCart = await Cart.create({
          userId,
          items: [{ productId, name, quantity, price }],
          bill: quantity * price,
        });
        return res.status(201).send(newCart);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.delete_item = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.itemId;
  try {
    let cart = await Cart.findOne({ userId });
    let itemIndex = cart.items.findIndex((item) => item.productId == productId);
    if (itemIndex > -1) {
      let productItem = cart.items[itemIndex];
      cart.bill -= productItem.quantity * productItem.price;
      cart.items.splice(itemIndex, 1);
    }
    cart = await cart.save();
    return res.status(201).send(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

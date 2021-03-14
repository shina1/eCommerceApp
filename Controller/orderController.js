const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const User = require("../models/userModel");
const config = require("config");
const stripe = require("stripe")(config.get("StripeAPIKey"));

module.exports.get_orders = async (req, res) => {
  const userId = req.params.id;
  Order.find({ userId })
    .sort({ date: -1 })
    .then((orders) =>
      res.status(200).json({
        status: "success",
        data: {
          orders,
        },
      })
    );
};

module.exports.checkout = (req, res) => {
  const userId = req.params.id;
  const {source} = req.body;
  try{
      let cart = await Cart.findOne({userId});
      let user = await User.findOne({_id: userId});
      const email = user.email;
      if(cart){
          const payment = await stripe.charges.create({
              amount: cart.bill,
              currency: 'inr',
              source: source,
              receipt_email: email
          })
          if(!payment) throw Error('Payment failed');
          if(payment){
              const order = Order.create({
                  userId,
                  items: cart.items,
                  bill: cart.bill
              });
              const data = await Cart.findByIdAndDelete({_id: cart.id})
              return res.status(201).send(order);
          }
      }else{
          return res.status(500).send('YOu do not have items in the cart');
      }
  }
  catch(err){
      console.log(err);
      return res.status(500).send('Something went wrong')
  }
};

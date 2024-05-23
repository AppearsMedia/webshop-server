const express = require("express");
const app = express();
const cors = require('cors');
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51PJEZvRvdqCDotXI1Rg03VuACv9e9TtWSMReK4pGxCla8SEwVQ0m2uFJgkCZvZBou1cPyk3gE0NOkW1IucccvvFS00tNrPVJ1F');

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const calculateOrderAmount = (items) => {

    const totalAmount = items.reduce((acc, product) => acc + product.price, 0);
//   const totalAmount = items.reduce((acc, product) => acc + product.price, 0);
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return totalAmount;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

//   console.log(calculateOrderAmount(items))
//   res.json(items)
//   return
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sek",
    payment_method: 'pm_card_mastercard',
    description: 'Someone bought something',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });

  console.log(paymentIntent)


  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.listen(4242, () => console.log("Node server listening on port 4242!"));
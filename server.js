require("dotenv").config();
const express = require("express");
const authRoutes = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const adminRoute = require("./src/routes/adminRoute");
const farmerRoute = require("./src/routes/farmerRoute");
const residentRoute = require("./src/routes/residentRoute");
const laboursRoute = require("./src/routes/laboursRoute");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./src/middlewares/errorMiddleware");
const cors = require("cors");

const corsOptions = require("./src/middlewares/corsMiddleware");
const stripe = require("stripe")(process.env.SK_TEST_KEY);

const PORT = 5000;

const app = express();

//MiddleWare
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/resident", residentRoute);
app.use("/labours", laboursRoute);
app.use("/farmers", farmerRoute);

const endpointSecret = process.env.ENDPOINT_SECRETE_KEY;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log(`Unhandled event type ${event.type}`);

    response.send();
  }
);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

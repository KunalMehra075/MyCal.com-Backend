const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connection } = require("./config/db.js");

const { EventRouter } = require("./routes/event.route.js");
const { GoogleRouter } = require("./routes/GoogleAuth.route.js");
const { userRouter } = require("./routes/user.route.js");
const cookieSession = require("cookie-session")
const passport = require("passport")
require("dotenv").config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://127.0.0.1:5500",
  mehtods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', "collection", "Authorization", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin"],
  credentials: true
}));
app.use(cookieSession({
  name: 'google-auth-session',
  keys: ["key1", "key2"],
}))

app.use(passport.initialize())
app.use(passport.session())


// app.use(notifyBeforeRouter);
app.use("/google", GoogleRouter)
app.use("/users", userRouter);
app.use("/events", EventRouter);

app.get("/", (req, res) => {
  try {
    res.json({ Message: "Welcome to Calendly Login App" });
  } catch (err) {
    console.log(err);
    res.json({ Error: err })
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB");
  }
  console.log(`Server is Rocking on port ${process.env.PORT}`);
});

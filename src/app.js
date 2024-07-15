const express = require("express");
const cors = require("cors");
const { userRouter } = require("./routes/userRouter");
const { productRouter } = require("./routes/productRouter");
const app = express();
require("dotenv").config();
require("./connection");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});

const express= require("express");
const app=express();
const dotenv=require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error");
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
dotenv.config({path:"backend/config/config.env"});
const product = require("./routes/productRouter");
const user = require("./routes/userRoutes");
const order=require("./routes/orderRoutes")
const payment = require("./routes/paymentRoutes");
//route gula import 

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

// error middleware
app.use(errorMiddleware);





module.exports=app;
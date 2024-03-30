import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { connectToDb } from "./config/db.js";
import { appLevelErrorHandlerMiddleware } from "./utils/errorHandler.js";
import userRouter from "./features/User/user.route.js";


const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: "50mb" }));

app.use("/api/user/",userRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/predict", async (req, res) => {
  try {
    const { image } = req.body;

    const apiResponse = await axios.post("http://127.0.0.1:5000/predict", {
      image,
    });

    res.json(apiResponse.data);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(appLevelErrorHandlerMiddleware);

app.listen(port, async () => {
  await connectToDb();
  console.log(`Server is listening at http://localhost:${port}`);
});
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: "50mb" }));

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

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

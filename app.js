require("dotenv");
const express = require("express");
const port = process.env.PORT || 3000;
const libraryRoutes = require("./routes/main");
const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use("/api/v1/library", libraryRoutes);

app.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

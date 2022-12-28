require("dotenv");
const express = require("express");
const port = process.env.PORT || 3000;
const libraryRoutes = require("./routes/main");
const app = express();

app.use(express.json());
app.use("/api/v1/library", libraryRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

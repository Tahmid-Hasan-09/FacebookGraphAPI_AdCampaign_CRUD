const express = require("express");
const app = express();
const router = require("./routes/index");
const port = process.env.PORT || 80;
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(router);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

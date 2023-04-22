const express = require("express");
const app = express();
const path = require("path");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Start the server and listen on port 8080
const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

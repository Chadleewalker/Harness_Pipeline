// {{PROJECT_NAME}} — {{PROJECT_DESCRIPTION}}
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the front-end files in the public/ folder.
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Example backend endpoint. Add your own routes below.
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from {{PROJECT_NAME}}!" });
});

app.listen(PORT, () => {
  console.log(`{{PROJECT_NAME}} is running at http://localhost:${PORT}`);
});

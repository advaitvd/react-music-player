const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();

app.use(fileUpload());

//Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  console.log(file);

  let fileNm = "";
  for (const c of file.name) {
    if (c === " ") {
      continue;
    } else {
      fileNm = fileNm + c;
    }
  }

  file.mv(`${__dirname}/client/public/uploads/${fileNm}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: fileNm, filePath: `/uploads/${fileNm}` });
  });
});

app.listen(5000, () => console.log("Server Started..."));

import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8080;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});

app.get("/filteredimage", async (req, res) => {
  const imgUrl = req.query["image_url"];
  if (!imgUrl || !imgUrl.startsWith("http", "https")) {
    return res.status(400).send(`Please input valid image url.`);
  }
  await filterImageFromURL(imgUrl)
    .then(filteredpath => {
      res.sendFile(filteredpath);
      return { res, filteredpath };
    })
    .then(({ res, filteredpath }) => res.on('finish', () => deleteLocalFiles([filteredpath])))
    .catch(e => res.status(500).send(`${e}`))
});


// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});

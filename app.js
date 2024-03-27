import express from 'express';
import config from 'config';

const { port } = config.get('server');
const app = express();

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Doodle Dash listening on port ${port}!`);
});
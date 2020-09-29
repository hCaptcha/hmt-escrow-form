require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

const ETHInterface = require('./ETHInterface')


const port = process.env.PORT || 8080;

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  ETHInterface.list_transactions('0x262523f57ebFCeDc36cE7666D744F447c56949a7')
  res.send('Hello World!');
})

app.listen(port, () => console.log(`Server Started at port ${port}`));

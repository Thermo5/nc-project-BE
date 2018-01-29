require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const nodemon = require('nodemon');

const s3Router = require('./routes/s3Router')
const rdsRouter = require('./routes/rdsRouter')

const app = express();
const port = 3002;

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Hello world'));

app.use('/s3', s3Router)
app.use('/rds', rdsRouter)

app.listen(port, () => console.log('listening ' + port));
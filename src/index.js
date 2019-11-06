require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

require('./routes')(app);

const porta = process.env.PORT || 8080;

app.listen(porta);

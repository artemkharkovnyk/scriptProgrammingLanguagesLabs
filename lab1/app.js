require('dotenv').config();
const express = require('express');
const app = express();

app.get("/", (request, response) => {
  response.send('Hello World');
});

app.get("/dotenv", (request, response) => {
  response.send({ data1: process.env.DATA1, data2: process.env.DATA2 });
});

module.exports = app;


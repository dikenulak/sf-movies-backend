"use strict";

var _cors = _interopRequireDefault(require("cors"));

var _app = _interopRequireDefault(require("./app.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

async function startServer() {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use('/api/v1/', _app.default);
  app.use((0, _cors.default)());
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

startServer();
const express = require('express')
const app = express()
const port = process.env.PORT || 8000

import cors from 'cors'

import routes from './app.routes';

async function startServer () {
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use('/api/v1/', routes)

  app.use(cors())
  

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

 
}

startServer();

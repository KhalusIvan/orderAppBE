const express = require('express');

const { 
  getCurrencies, 
 } = require("../controller/currency.controller"); 

const currencyRoutes = express.Router();

currencyRoutes.get('/', getCurrencies);

module.exports = currencyRoutes;


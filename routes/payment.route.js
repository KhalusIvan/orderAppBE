const express = require('express');

const { 
  getPayments, 
 } = require("../controller/payment.controller"); 

const paymentRoutes = express.Router();

paymentRoutes.get('/', getPayments);

module.exports = paymentRoutes;


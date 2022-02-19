const { Currency } = require("../models");

const getCurrencies = async (req, res) => {
  try {
    const result = await Currency.findAll();
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getCurrencies,
};

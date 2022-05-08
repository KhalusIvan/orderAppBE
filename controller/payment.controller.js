const { Payment } = require("../models");
const { Op } = require("sequelize");

const getPayments = async (req, res) => {
  try {
    const result = await Payment.findAll({
      attributes: ["id", "name"],
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getPayments,
};

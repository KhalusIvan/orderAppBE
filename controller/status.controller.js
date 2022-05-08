const { Status } = require("../models");
const { Op } = require("sequelize");

const getStatuses = async (req, res) => {
  try {
    const result = await Status.findAll({
      attributes: ["id", "name"],
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getStatuses,
};

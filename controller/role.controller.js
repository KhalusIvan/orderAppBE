const { Role } = require("../models");
const { Op } = require("sequelize");

const getRoles = async (req, res) => {
  try {
    const result = await Role.findAll({
      where: { admin: { [Op.not]: true } },
      where: {
        [Op.and]: {
          admin: { [Op.not]: true },
          owner: { [Op.not]: true },
        },
      },
      attributes: ["id", "name"],
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getRoles,
};
